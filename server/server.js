require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USER_ID = process.env.USER_ID;

const DATA_FILE = path.join(__dirname, "data", "items.json");

let tokens = {
  access_token: process.env.ACCESS_TOKEN || "",
  refresh_token: process.env.REFRESH_TOKEN || "",
  expires_at: 0,
};

function readItems() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return data.trim() === "" ? [] : JSON.parse(data);
  } catch (err) {
    console.error("Error leyendo items.json:", err.message);
    return [];
  }
}

function writeItems(items) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
    console.log(`\nGuardados ${items.length} productos en data/items.json\n`);
  } catch (err) {
    console.error("Error guardando items.json:", err.message);
  }
}

async function refreshAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET || !tokens.refresh_token) {
    throw new Error("Faltan credenciales o refresh token");
  }

  const response = await axios.post(
    "https://api.mercadolibre.com/oauth/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: tokens.refresh_token,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  tokens = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token || tokens.refresh_token,
    expires_at: Date.now() + response.data.expires_in * 1000,
  };

  console.log("Token refrescado correctamente");
  return tokens.access_token;
}

async function ensureValidToken(req, res, next) {
  try {
    if (!tokens.access_token || Date.now() >= tokens.expires_at - 60000) {
      await refreshAccessToken();
    }
    req.accessToken = tokens.access_token;
    next();
  } catch (err) {
    console.error("Error de autenticación:", err.message);
    res.status(500).json({ error: "Error de autenticación", details: err.message });
  }
}

app.use("/api/ml", ensureValidToken);

// Endpoint normal: leer del JSON
app.get("/api/ml/items", (req, res) => {
  const items = readItems();
  res.json({
    success: true,
    total: items.length,
    items,
  });
});

const categoryCache = new Map();

async function getCategoryName(categoryId, accessToken) {
  if (!categoryId) return "Sin categoría";
  if (categoryCache.has(categoryId)) {
    return categoryCache.get(categoryId);
  }

  try {
    const res = await axios.get(
      `https://api.mercadolibre.com/categories/${categoryId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const name = res.data.path_from_root
      .map(c => c.name)
      .join(" > ") || res.data.name;

    categoryCache.set(categoryId, name);
    return name;
  } catch (err) {
    categoryCache.set(categoryId, "Categoría no encontrada");
    return "Categoría no encontrada";
  }
}

// === FUNCIÓN PRINCIPAL CON PROGRESO EN VIVO ===
async function fetchAndSaveItems(accessToken, maxItems = Infinity, debug = false) {
    console.log("\nIniciando TEST con nombre de categoría real y descripción...\n");
  
    const allItemIds = [];
    let scrollId = null;
    let keepScrolling = true;
    let page = 1;
  
    // Paso 1: Scroll para obtener todos los IDs
    while (keepScrolling && allItemIds.length < maxItems) {
      const url = `https://api.mercadolibre.com/users/${USER_ID}/items/search?search_type=scan${scrollId ? `&scroll_id=${encodeURIComponent(scrollId)}` : ""}`;
  
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const newIds = res.data.results || [];
      allItemIds.push(...newIds);
  
      console.log(`Página ${page} → +${newIds.length} IDs (total: ${allItemIds.length})`);
  
      if (!res.data.scroll_id || newIds.length === 0 || allItemIds.length >= maxItems) {  // ← AQUÍ ESTABA EL ERROR
        keepScrolling = false;
      } else {
        scrollId = res.data.scroll_id;
        page++;
      }
  
      await new Promise(r => setTimeout(r, 200));
    }
  
    const uniqueItemIds = [...new Set(allItemIds)];
    console.log(`\nTotal IDs únicos obtenidos: ${uniqueItemIds.length}\n`);
  
    if (uniqueItemIds.length === 0) return [];
  
    const detailedItems = [];
    let processed = 0;
  
    for (let i = 0; i < uniqueItemIds.length; i += 20) {
      const batch = uniqueItemIds.slice(i, i + 20);
      const ids = batch.join(",");
  
      try {
        const res = await axios.get(`https://api.mercadolibre.com/items?ids=${ids}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const candidates = res.data.filter(item => debug || (item.body?.available_quantity > 0));
  
        for (const item of candidates) {
          const b = item.body;
  
          // Descripción
          let description = "";
          try {
            const descRes = await axios.get(
              `https://api.mercadolibre.com/items/${b.id}/description`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            description = (descRes.data.plain_text || descRes.data.text || "").trim();
          } catch (err) {
            description = "";
          }
  
          // Categoría real
          const categoryName = await getCategoryName(b.category_id, accessToken);
  
          const pictures = Array.isArray(b.pictures)
            ? b.pictures.map(p => p.url).filter(u => u?.startsWith("http"))
            : [];
  
          detailedItems.push({
            id: b.id,
            title: b.title,
            category_id: b.category_id,
            category: categoryName,        // ← Nombre real de la categoría
            price: b.price,
            available_quantity: b.available_quantity,
            condition: b.condition,
            pictures,
            thumbnail: b.thumbnail || "",
            status: b.status,
            description
          });
        }
  
        processed += batch.length;
        process.stdout.write(
          `\rDescargando + categoría + descripción: ${processed}/${uniqueItemIds.length} → ${detailedItems.length} válidos`
        );
  
        await new Promise(r => setTimeout(r, 350));
  
      } catch (err) {
        console.log(`\nError en lote:`, err.response?.data?.message || err.message);
      }
    }
  
    console.log(`\n\nTEST COMPLETADO → ${detailedItems.length} productos con categoría real y descripción`);
    return detailedItems;
  }

  async function fetchAndSaveItemsTest(accessToken, maxItems = 500, debug = false) {
    console.log("\nIniciando TEST con nombre de categoría real y descripción...\n");
  
    const allItemIds = [];
    let scrollId = null;
    let keepScrolling = true;
    let page = 1;
  
    // Paso 1: Scroll para obtener todos los IDs
    while (keepScrolling && allItemIds.length < maxItems) {
      const url = `https://api.mercadolibre.com/users/${USER_ID}/items/search?search_type=scan${scrollId ? `&scroll_id=${encodeURIComponent(scrollId)}` : ""}`;
  
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const newIds = res.data.results || [];
      allItemIds.push(...newIds);
  
      console.log(`Página ${page} → +${newIds.length} IDs (total: ${allItemIds.length})`);
  
      if (!res.data.scroll_id || newIds.length === 0 || allItemIds.length >= maxItems) {  // ← AQUÍ ESTABA EL ERROR
        keepScrolling = false;
      } else {
        scrollId = res.data.scroll_id;
        page++;
      }
  
      await new Promise(r => setTimeout(r, 200));
    }
  
    const uniqueItemIds = [...new Set(allItemIds)];
    console.log(`\nTotal IDs únicos obtenidos: ${uniqueItemIds.length}\n`);
  
    if (uniqueItemIds.length === 0) return [];
  
    const detailedItems = [];
    let processed = 0;
  
    for (let i = 0; i < uniqueItemIds.length; i += 20) {
      const batch = uniqueItemIds.slice(i, i + 20);
      const ids = batch.join(",");
  
      try {
        const res = await axios.get(`https://api.mercadolibre.com/items?ids=${ids}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const candidates = res.data.filter(item => debug || (item.body?.available_quantity > 0));
  
        for (const item of candidates) {
          const b = item.body;
  
          // Descripción
          let description = "";
          try {
            const descRes = await axios.get(
              `https://api.mercadolibre.com/items/${b.id}/description`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            description = (descRes.data.plain_text || descRes.data.text || "").trim();
          } catch (err) {
            description = "";
          }
  
          // Categoría real
          const categoryName = await getCategoryName(b.category_id, accessToken);
  
          const pictures = Array.isArray(b.pictures)
            ? b.pictures.map(p => p.url).filter(u => u?.startsWith("http"))
            : [];
  
          detailedItems.push({
            id: b.id,
            title: b.title,
            category_id: b.category_id,
            category: categoryName,        // ← Nombre real de la categoría
            price: b.price,
            available_quantity: b.available_quantity,
            condition: b.condition,
            pictures,
            thumbnail: b.thumbnail || "",
            status: b.status,
            description
          });
        }
  
        processed += batch.length;
        process.stdout.write(
          `\rDescargando + categoría + descripción: ${processed}/${uniqueItemIds.length} → ${detailedItems.length} válidos`
        );
  
        await new Promise(r => setTimeout(r, 350));
  
      } catch (err) {
        console.log(`\nError en lote:`, err.response?.data?.message || err.message);
      }
    }
  
    console.log(`\n\nTEST COMPLETADO → ${detailedItems.length} productos con categoría real y descripción`);
    return detailedItems;
  }

// Endpoints que actualizan el JSON
app.get("/api/ml/items-details", async (req, res) => {
  try {
    const debug = req.query.debug === "true";
    const items = await fetchAndSaveItems(req.accessToken, Infinity, debug);
    writeItems(items);
    res.json({ success: true, total: items.length, message: "Datos actualizados" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/ml/items-details-test", async (req, res) => {
    try {
      const debug = req.query.debug === "true";
      console.log("\nIniciando TEST (máx 5000 productos)...");
      console.log("Los resultados se guardarán en data/test-items.json (NO toca items.json)\n");
  
      const items = await fetchAndSaveItemsTest(req.accessToken, 500, debug);
  
      // GUARDAR EN ARCHIVO APARTE
      const testFile = path.join(__dirname, "data", "test-items.json");
      fs.mkdirSync(path.dirname(testFile), { recursive: true });
      fs.writeFileSync(testFile, JSON.stringify(items, null, 2));
  
      console.log(`\nTEST COMPLETADO → ${items.length} productos guardados en:`);
      console.log(`   ${testFile}\n`);
  
      res.json({
        success: true,
        message: "Test completado",
        count: items.length,
        file: "data/test-items.json",
        tip: "Tu items.json principal NO fue modificado"
      });
  
    } catch (err) {
      console.error("\nError en test:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

// Inicio
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServidor LOCAL corriendo en http://localhost:${PORT}`);
  console.log(`Productos guardados en: ${DATA_FILE}\n`);
  console.log("Endpoints:");
  console.log("  → GET  http://localhost:5000/api/ml/items");
  console.log("  → GET  http://localhost:5000/api/ml/items-details-test?debug=true  (para actualizar)\n");
});