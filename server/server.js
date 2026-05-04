require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USER_ID = process.env.USER_ID;

const DATA_FILE = path.join(__dirname, "data", "items.json");

const IDS_TO_REMOVE_FILE = path.join(__dirname, "data", "ids.txt");
const GOOD_WITH_CATEGORIES = path.join(__dirname, "data", "items-good-with-categories.json");
const FINAL_CLEAN_OUTPUT = path.join(__dirname, "data", "items-good-clean.json");
const REMOVED_OUTPUT = path.join(__dirname, "data", "ids-eliminados.json");

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

app.get("/api/ml/add-categories", async (req, res) => {
  try {
    console.log("\nAgregando nombres de categorías reales a items.json...\n");

    const items = readItems();
    if (items.length === 0) {
      return res.json({ success: false, message: "No hay productos en items.json" });
    }

    const categoryCache = new Map();

    const getCategoryName = async (categoryId) => {
      if (!categoryId) return "Sin categoría";
      if (categoryCache.has(categoryId)) return categoryCache.get(categoryId);

      try {
        const response = await axios.get(`https://api.mercadolibre.com/categories/${categoryId}`);
        const path = response.data.path_from_root.map(c => c.name).join(" > ");
        const name = path || response.data.name || "Categoría no encontrada";
        categoryCache.set(categoryId, name);
        return name;
      } catch (err) {
        const name = "Categoría no encontrada";
        categoryCache.set(categoryId, name);
        return name;
      }
    };

    let processed = 0;
    for (const item of items) {
      processed++;
      process.stdout.write(`\rProcesando producto ${processed}/${items.length}`);

      const oldCategory = item.category; // ej: "MLA413683"
      const categoryName = await getCategoryName(oldCategory);

      // Renombramos y agregamos el nombre real
      item.category_id = oldCategory;
      item.category = categoryName;

      await new Promise(r => setTimeout(r, 100)); // ser amables con la API
    }

    // Guardamos en archivo nuevo
    const outputFile = path.join(__dirname, "data", "items-with-categories.json");
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(items, null, 2));

    console.log(`\n\n¡Listo! ${items.length} productos con categoría real guardados en:`);
    console.log(`   ${outputFile}\n`);

    res.json({
      success: true,
      message: "Categorías agregadas correctamente",
      total: items.length,
      file: "data/items-with-categories.json",
      example: items[0]
    });

  } catch (err) {
    console.error("Error agregando categorías:", err.message);
    res.status(500).json({ error: err.message });
  }
});

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

  //ENDPOINT: devuelve el body completo de un solo item
app.get("/api/ml/item-body/:id", async (req, res) => {
  const itemId = req.params.id.trim();

  if (!itemId || !itemId.startsWith("MLA")) {
    return res.status(400).json({ error: "ID inválido. Ejemplo: MLA875848733" });
  }

  try {
    console.log(`Consultando item completo: ${itemId}`);

    const response = await axios.get(`https://api.mercadolibre.com/items/${itemId}`, {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    });

    res.json({
      success: true,
      item_id: itemId,
      body: response.data
    });

  } catch (err) {
    console.error(`Error consultando ${itemId}:`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: "No se pudo obtener el item",
      details: err.response?.data || err.message
    });
  }
});

app.get("/api/ml/group-by-category", async (req, res) => {
  try {
    console.log("\nIniciando agrupación de productos under_review por categoría...\n");

    const inputFile = path.join(__dirname, "data", "items-good-clean.json");
    if (!fs.existsSync(inputFile)) {
      return res.status(404).json({ error: "No existe items-with-categories.json" });
    }

    const rawData = fs.readFileSync(inputFile, "utf-8");
    const items = JSON.parse(rawData);

    // Filtrar solo under_review
    const underReviewItems = items.filter(item => item.status === "under_review");

    if (underReviewItems.length === 0) {
      return res.json({ 
        success: true, 
        message: "No hay productos con status 'under_review'" 
      });
    }

    console.log(`Encontrados ${underReviewItems.length} productos under_review`);

    // Agrupar por categoría
    const grouped = {};
    underReviewItems.forEach(item => {
      const cat = item.category || "Sin categoría";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    // Crear carpeta destino
    const outputDir = path.join(__dirname, "data", "items-categories");
    fs.mkdirSync(outputDir, { recursive: true });

    let created = 0;
    let singles = []; // Aquí van los items con categoría de 1 solo

    for (const [categoryName, categoryItems] of Object.entries(grouped)) {
      if (categoryItems.length === 1) {
        // Es categoría con un solo ítem → lo mandamos al archivo agrupado
        singles.push(...categoryItems);
      } else {
        // Categoría con 2 o más → archivo individual
        const safeName = categoryName
          .replace(/[<>:"|?*\\\/]/g, "")
          .replace(/\s*>\s*/g, " - ")
          .replace(/\s+/g, "_")
          .substring(0, 100);

        const fileName = path.join(outputDir, `${safeName}.json`);
        fs.writeFileSync(fileName, JSON.stringify(categoryItems, null, 2));
        created++;
        console.log(`→ ${categoryItems.length} ítems → ${safeName}.json`);
      }
    }

    // Guardar todos los singles en un solo archivo
    if (singles.length > 0) {
      const singleFile = path.join(outputDir, "single-category.json");
      fs.writeFileSync(singleFile, JSON.stringify(singles, null, 2));
      created++;
      console.log(`→ ${singles.length} ítems con categoría única → single-category.json`);
    }

    console.log(`\n¡Listo! ${created} archivos creados en data/items-categories/\n`);

    res.json({
      success: true,
      message: "Productos under_review agrupados por categoría",
      total_items: underReviewItems.length,
      categories_created: created,
      single_category_items: singles.length,
      output_folder: "data/items-categories/"
    });

  } catch (err) {
    console.error("Error agrupando por categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/ml/generate-excel-file", async (req, res) => {
  const jsonPath = path.join(__dirname, "data", "items-categories", "Agro_Repuestos_Maquinaria_Agrícola_Motor_Bombas_Bombas_de_Aceite.json");
  if (!fs.existsSync(jsonPath)) {
    return res.status(404).json({ error: "No existe json" });
  }

  const templatePath = path.join(__dirname, "data", "templates", "template_masivo_mercadolibre.xlsx");
  if (!fs.existsSync(templatePath)) {
    return res.status(500).send("Falta el template oficial en data/templates/template_masivo_mercadolibre.xlsx");
  }

  try {
    const items = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    const workbook = XLSX.readFile(templatePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Limpiar filas manteniendo formato
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        delete worksheet[cellAddress];
      }
    }

    const rows = items.map(item => {
      const pics = item.pictures || [];
      return {
        title: item.title,
        price: item.price,
        available_quantity: item.available_quantity,
        condition: item.condition === "new" ? "new" : "used",
        listing_type_id: "gold_special",
        buying_mode: "buy_it_now",
        currency_id: "ARS",
        picture_1: pics[0] || "",
        picture_2: pics[1] || "",
        picture_3: pics[2] || "",
        picture_4: pics[3] || "",
        picture_5: pics[4] || "",
        picture_6: pics[5] || "",
        picture_7: pics[6] || "",
        picture_8: pics[7] || "",
        picture_9: pics[8] || "",
        picture_10: pics[9] || "",
        picture_11: pics[10] || "",
        picture_12: pics[11] || "",
        description: item.description || "",
        warranty: "Garantía del vendedor: 3 meses",
        category_id: item.category_id,
      };
    });

    XLSX.utils.sheet_add_json(worksheet, rows, {
      skipHeader: true,
      origin: "A2"
    });

    const fileNameOnly = path.basename(jsonPath, ".json"); // solo el nombre
    const output = path.join(__dirname, "data", "excel-ready", `carga_${fileNameOnly}.xlsx`);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    XLSX.writeFile(workbook, output);

    res.download(output, `carga_${fileNameOnly}.xlsx`, err => {
      if (err) console.error("Error enviando Excel:", err);
    });

  } catch (err) {
    console.error("Error generando Excel:", err);
    res.status(500).send("Error interno del servidor");
  }
});

function removeByIdsList() {
  // 1. Leer y parsear ids.txt
  if (!fs.existsSync(IDS_TO_REMOVE_FILE)) {
    throw new Error("No existe data/ids.txt");
  }
  if (!fs.existsSync(GOOD_WITH_CATEGORIES)) {
    throw new Error("No existe items-good-with-categories.json");
  }

  const rawIds = fs.readFileSync(IDS_TO_REMOVE_FILE, "utf-8").trim();
  let idsToRemove = [];

  try {
    // Intentar parsear como JSON array
    const parsed = JSON.parse(rawIds);
    if (Array.isArray(parsed)) {
      idsToRemove = parsed.map(n => String(n).trim());
    }
  } catch (e) {
    // Si no es JSON → asumir una ID por línea
    idsToRemove = rawIds
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(n => n.replace(/[^0-9]/g, "")) // limpiar cualquier caracter raro
      .filter(n => n.length > 5); // solo números largos
  }

  console.log(`\nCargados ${idsToRemove.length} IDs para eliminar desde ids.txt`);

  // 2. Cargar items-good-with-categories.json
  const items = JSON.parse(fs.readFileSync(GOOD_WITH_CATEGORIES, "utf-8"));
  console.log(`${items.length} publicaciones cargadas desde items-good-with-categories.json`);

  // 3. Separar: mantenidos y eliminados
  const keptItems = [];
  const removedItems = [];

  for (const item of items) {
    // Extraer el número final del ID (ej: MLA1884413740 → 1884413740)
    const itemNumber = item.id.replace(/[^0-9]/g, "");

    if (idsToRemove.includes(itemNumber)) {
      removedItems.push(item);
    } else {
      keptItems.push(item);
    }
  }

  // 4. Guardar resultados
  fs.mkdirSync(path.dirname(FINAL_CLEAN_OUTPUT), { recursive: true });
  fs.writeFileSync(FINAL_CLEAN_OUTPUT, JSON.stringify(keptItems, null, 2));
  fs.writeFileSync(REMOVED_OUTPUT, JSON.stringify(removedItems, null, 2));

  console.log(`\n¡LIMPIEZA COMPLETADA!`);
  console.log(`→ Eliminados: ${removedItems.length} publicaciones`);
  console.log(`→ Quedan: ${keptItems.length} publicaciones limpias`);

  return { keptItems, removedItems };
}

app.get("/api/ml/remove-by-ids", (req, res) => {
  try {
    const { keptItems, removedItems } = removeByIdsList();

    res.json({
      success: true,
      message: "Eliminación masiva completada",
      removed_count: removedItems.length,
      kept_count: keptItems.length,
      files: {
        final: "data/items-good-clean.json",
        removed: "data/ids-eliminados.json"
      },
      tip: "Vamo carajo!"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



const categoryRoutes = require("./routes/categoryRoutes");
// Pasar el token a las rutas de categorías
app.use("/api/ml/category", (req, res, next) => {
  categoryRoutes.setAccessToken(req.accessToken);
  next();
}, categoryRoutes);

// Inicio
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServidor LOCAL corriendo en http://localhost:${PORT}`);
  console.log(`Productos guardados en: ${DATA_FILE}\n`);
  console.log("Endpoints:");
  console.log("  → GET  http://localhost:5000/api/ml/items");
  console.log("  → GET  http://localhost:5000/api/ml/items-details-test?debug=true  (para actualizar)\n");
});