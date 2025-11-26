const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const XLSX = require("xlsx");

// Token que le pasa server.js
let accessToken = "";

// Para recibir el token desde server.js
router.setAccessToken = (token) => {
  accessToken = token;
};

// ========================================
// MENÚ PRINCIPAL: lista solo las FUNCIONES definidas
// ========================================
const availableFunctions = [
  {
    name: "Agro - Repuestos Maquinaria Agrícola - Motor - Bombas - Bombas de Aceite",
    endpoint: "agro-repuestos-bombas-aceite",
  },
  {
    name: "agro-repuestos-maquinaria-agricola-motor-ciguenales",
    endpoint: "agro-repuestos-maquinaria-agricola-motor-ciguenales",
  },
  {
    name: "antiguedadesycolecciones-antiguedades-electrodomesticosantiguos-ventiladores",
    endpoint: "antiguedadesycolecciones-antiguedades-electrodomesticosantiguos-ventiladores",
  },
  {
    name: "electronicaaudioyvideo-repuestosparatv-cablesflex",
    endpoint: "electronicaaudioyvideo-repuestosparatv-cablesflex",
  },
  {
    name: "electronicaaudioyvideo-accesoriosparatv-soportes",
    endpoint: "electronicaaudioyvideo-accesoriosparatv-soportes",
  },
  {
    name: "electronicaaudioyvideo-repuestosparatv-placasmain",
    endpoint: "electronicaaudioyvideo-repuestosparatv-placasmain",
  },
  {
    name: "electronicaaudioyvideo-repuestosparatv-fuentesparatv",
    endpoint: "electronicaaudioyvideo-repuestosparatv-fuentesparatv",
  },
  {
    name: "electronicaaudioyvideo-repuestosparatv-tiraparaled",
    endpoint: "electronicaaudioyvideo-repuestosparatv-tiraparaled",
  },
  {
    name: "electronicaaudioyvideo-repuestosparatv-otros",
    endpoint: "electronicaaudioyvideo-repuestosparatv-otros",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-plaquetas",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-plaquetas",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-semiconductores-circuitosintegrados",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-semiconductores-circuitosintegrados",
  },
  {
    name: "electronicaaudioyvideo-accesoriosparatv-otros",
    endpoint: "electronicaaudioyvideo-accesoriosparatv-otros",
  },
  {
    name: "electronicaaudioyvideo-controlesremotosparatv",
    endpoint: "electronicaaudioyvideo-controlesremotosparatv",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-otros",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-otros",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-cablesflex",
    endpoint: "computacion-notebooksyaccesorios-repuestos-cablesflex",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-semiconductores-transistores",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-semiconductores-transistores",
  },
  {
    name: "electrodomesticosyairesac-coccion-repuestosyaccesoriosparacocinasyhornos-otros",
    endpoint: "electrodomesticosyairesac-coccion-repuestosyaccesoriosparacocinasyhornos-otros",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-plaquetas",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-plaquetas",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-camarasinternas",
    endpoint: "computacion-notebooksyaccesorios-repuestos-camarasinternas",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-estantes",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-estantes",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-jaboneras",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-jaboneras",
  },
  {
    name: "electronicaaudioyvideo-controlesremotos-parareproductoresdevideo",
    endpoint: "electronicaaudioyvideo-controlesremotos-parareproductoresdevideo",
  },
  {
    name: "computacion-conectividadyredes-placasdered",
    endpoint: "computacion-conectividadyredes-placasdered",
  },
];

router.get("/", (req, res) => {
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Funciones de Categorías</title>
    <style>
      body { font-family: Arial; background: #f9f9f9; margin: 40px; }
      h1 { color: #333; }
      .func { background: white; padding: 20px; margin: 15px 0; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
      .btn { background: #3483fa; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
      .btn:hover { background: #2968c8; }
    </style>
  </head>
  <body>
    <h1>Funciones disponibles por categoría</h1>
  `;

  availableFunctions.forEach(func => {
    html += `
    <div class="func">
      <a href="/api/ml/category/${func.endpoint}">
        <div class="btn">${func.name}</div>
      </a>
    </div>`;
  });

  html += `</body></html>`;
  res.send(html);
});

async function getAgroRepuestosBombasAceite(req, res) {
  const fileName = "Agro_Repuestos_Maquinaria_Agrícola_Motor_Bombas_Bombas_de_Aceite.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [

  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          const keys = campo.split(".");
          let value = body;
          for (const key of keys) {
            if (value === undefined || value === null) break;
            const match = key.match(/(\w+)\[(\d+)\]/);
            if (match) {
              value = value[match[1]]?.[parseInt(match[2])];
            } else {
              value = value[key];
            }
          }
          extraData[campo] = value ?? "";
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO (sin template)
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];

      // TODAS LAS FOTOS EN UNA SOLA COLUMNA separadas por coma
      const picturesUrl = pics.join(",");

      // Condición en español
      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.title,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",


      };

      // Campos extra dinámicos (seller_id, buying_mode, etc.)
      camposExtra.forEach(campo => {
        row[campo] = item[campo] || "";
      });

      dataForExcel.push(row);
    });

    // Crear hoja con cabeceras en fila 1
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    // Guardar y descargar
    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado SIN template → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getAgroRepuestosMaquinariaAgricolaMotorCiguenales(req, res) {
  const fileName = "Agro_Repuestos_Maquinaria_Agrícola_Motor_Cigüeñales.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "attributes.PART_NUMBER.value_name",
    "attributes.MODEL.value_name"
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = body;

          if (campo.startsWith("attributes.")) {
            // Caso especial: atributos por ID
            const attrId = campo.split(".")[1]; // ej: "PART_NUMBER"
            const subKey = campo.split(".").slice(2).join("."); // ej: "value_name"

            const attr = body.attributes?.find(a => a.id === attrId);
            if (attr && subKey) {
              value = subKey === "value_name" ? attr.value_name : attr[subKey];
            } else {
              value = "";
            }
          } else {
            // Caso normal (seller_id, warranty, etc.)
            const keys = campo.split(".");
            for (const key of keys) {
              if (value === undefined || value === null) break;
              const match = key.match(/(\w+)\[(\d+)\]/);
              if (match) {
                value = value[match[1]]?.[parseInt(match[2])];
              } else {
                value = value[key];
              }
            }
          }

          extraData[campo] = value ?? "";
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.title,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        "Número de pieza": item["attributes.PART_NUMBER.value_name"] || "",
        Modelo: item["attributes.MODEL.value_name"] || "",
      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getAntiguedadesyColeccionesAntiguedadesElectrodomesticosAntiguosVentiladores(req, res) {
  const fileName = "Antigüedades_y_Colecciones_Antigüedades_Electrodomésticos_Antiguos_Ventiladores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "attributes.MODEL.value_name",
    "attributes.FAN_TYPE.value_name",
    "family_name",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = body;

          if (campo.startsWith("attributes.")) {
            // Caso especial: atributos por ID
            const attrId = campo.split(".")[1]; // ej: "PART_NUMBER"
            const subKey = campo.split(".").slice(2).join("."); // ej: "value_name"

            const attr = body.attributes?.find(a => a.id === attrId);
            if (attr && subKey) {
              value = subKey === "value_name" ? attr.value_name : attr[subKey];
            } else {
              value = "";
            }
          } else {
            // Caso normal (seller_id, warranty, etc.)
            const keys = campo.split(".");
            for (const key of keys) {
              if (value === undefined || value === null) break;
              const match = key.match(/(\w+)\[(\d+)\]/);
              if (match) {
                value = value[match[1]]?.[parseInt(match[2])];
              } else {
                value = value[key];
              }
            }
          }

          extraData[campo] = value ?? "";
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Modelo: item["attributes.MODEL.value_name"] || "",
        "Tipo de Ventilador": item["attributes.FAN_TYPE.value_name"] || "",
      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoRepuestosparaTVCablesFlex(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Repuestos_para_TV_Cables_Flex.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.COMPATIBLE_DEVICE_MODEL.value_name",
    "attributes.COMPATIBLE_DEVICE.value_name",
    "attributes.DEVICE_PART_NUMBER.value_name",
    "attributes.CONDUCTORS_NUMBER.value_name",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit"
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Modelo: item["attributes.COMPATIBLE_DEVICE_MODEL.value_name"] || "",
        Largo: item["attributes.LENGTH.value_struct.number"] || "",
        "Unidad de Largo": item["attributes.LENGTH.value_struct.unit"] || "",
        "Dispositivo Compatible": item["attributes.COMPATIBLE_DEVICE.value_name"] || "",
        "Cantidad de Conductores": item["attributes.CONDUCTORS_NUMBER.value_name"] || "",
        "Numero de pieza del dispositivo": item["attributes.DEVICE_PART_NUMBER.value_name"] || "",
        
      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoAccesoriosParaTVSoportes(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Accesorios_para_TV_Soportes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.COLOR.value_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Color: item["attributes.COLOR.value_name"] || "",
        Marca: item["attributes.BRAND.value_name"] || "",
        Modelo: item["attributes.MODEL.value_name"] || "",
        
      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoRepuestosparaTVPlacasMain(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Repuestos_para_TV_Placas_Main.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.DEVICE_PART_NUMBER.value_name",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: item["attributes.BRAND.value_name"] || "",
        Modelo: item["attributes.MODEL.value_name"] || "",
        "Numero de pieza del dispositivo": item["attributes.DEVICE_PART_NUMBER.value_name"]
        
      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoRepuestosparaTVFuentesParaTV(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Repuestos_para_TV_Fuentes_para_TV.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.MODEL.value_name",
    "attributes.BOARD_CODE.value_name",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || "",
        "Codigo de la Placa": item["attributes.BOARD_CODE.value_name"]
        
      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoRepuestosparaTVTiraParaLed(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Repuestos_para_TV_Tira_para_Led.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.PART_NUMBER.value_name",
    "attributes.COMPATIBILITY.value_name",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || "",
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"],
        "Unidades por Pack": item["attributes.UNITS_PER_PACK.value_name"],
        "Numero de Pieza": item["attributes.PART_NUMBER.value_name"] || item["attributes.MODEL.value_name"],
        Compatibilidad: item["attributes.COMPATIBILITY.value_name"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        "Unidad de Largo": item["attributes.LENGTH.value_struct.unit"]

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoRepuestosparaTVOtros(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Repuestos_para_TV_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Marcas Compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoRepuestosparaTVBotonerasDeTV(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Repuestos_para_TV_Botoneras_de_TV.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.COMPATIBLE_MODEL.value_name",
    "attributes.MODEL.value_name",
    "attributes.PART_NUMBER.value_name"
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Modelo Compatible": item["attributes.COMPATIBLE_MODEL.value_name"] || "TV",
        Modelo: item["attributes.MODEL.value_name"] || "TV",
        "Numero de Pieza": item["attributes.PART_NUMBER.value_name"] || ""

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoComponentesElectronicosPlaquetas(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Plaquetas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.COMPATIBLE_BRANDS.value_name",

  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {
        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Marca Compatible": item["attributes.COMPATIBLE_BRANDS.value_name"] || "TV",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoComponentesElectronicosSemiconductoresCircuitosIntegrados(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Semiconductores_Circuitos_Integrados.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.MODEL.value_name",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
    "attributes.WIDTH.value_struct.number",
    "attributes.WIDTH.value_struct.unit",
    "attributes.TRANSISTORS_NUMBER.value_name",


  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Tipo de Circuito": "Datos",
        "Numero de pieza": item["attributes.COMPATIBLE_BRANDS.value_name"] || "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || "",
        Largo: item["attributes.LENGTH.value_struct.number"] || "",
        "Unidad de Largo": item["attributes.LENGTH.value_struct.unit"] || "",
        Ancho: item["attributes.WIDTH.value_struct.number"] || "",
        "Unidad de Ancho": item["attributes.WIDTH.value_struct.unit"] || "",
        "Numero de Transistores": item["attributes.TRANSISTORS_NUMBER.value_name"] || "",

        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoAccesoriosParaTVOtros(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Accesorios_para_TV_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",

  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Marcas Compatibles": item["attributes.BRAND.value_name"] || "",

        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoControlesRemotosParaTV(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Controles_Remotos_Para_TV.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.MODEL.value_name",
    "attributes.INCLUDES_CELL_BATTERIES.value_name",
    "attributes.WITH_NETFLIX_BUTTON.value_name",
    "attributes.WITH_YOUTUBE_BUTTON.value_name",
    "attributes.IS_UNIVERSAL.value_name",
    "attributes.WITH_VOICE_COMMAND.value_name",
    "attributes.WITH_KEYBOARD.value_name",
    "attributes.WITH_GOOGLE_PLAY_BUTTON.value_name",
    "attributes.WITH_PRIME_VIDEO_BUTTON.value_name",
    "attributes.WITH_DISNEY_BUTTON.value_name",
    "attributes.WITH_HULU_BUTTON.value_name",
    "attributes.WITH_VUDU_BUTTON.value_name",

  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || "TV",
        "Incluye Pilas": item["attributes.INCLUDES_CELL_BATTERIES.value_name"] || "",
        "Boton Netflix": item["attributes.WITH_NETFLIX_BUTTON.value_name"] || "",
        "Boton Youtube": item["attributes.WITH_YOUTUBE_BUTTON.value_name"] || "",
        "Es universal": item["attributes.IS_UNIVERSAL.value_name"] || "",
        "Comando de Voz": item["attributes.WITH_VOICE_COMMAND.value_name"] || "",
        "Teclado": item["attributes.WITH_KEYBOARD.value_name"] || "",
        "Google Play": item["attributes.WITH_GOOGLE_PLAY_BUTTON.value_name"] || "",
        "Prime Video": item["attributes.WITH_PRIME_VIDEO_BUTTON.value_name"] || "",
        "Disney+": item["attributes.WITH_DISNEY_BUTTON.value_name"] || "",
        "Hulu": item["attributes.WITH_HULU_BUTTON.value_name"] || "",
        "Vudu": item["attributes.WITH_VUDU_BUTTON.value_name"] || "",

        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectrodomesticosYAiresAcLavadoRepuestosYAccesoriosParaLavarropasYSecarropasOtros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Marcas Compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"] || "",
        "Modelos Compatibles": item["attributes.COMPATIBLE_MODELS.value_name"] || "",

        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getComputacionNotebooksYAccesoriosRepuestosCablesFlex(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Cables_Flex.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  // ← AQUÍ PONÉS LO QUE QUERÁS TRAER
  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.MANUFACTURER.value_name",
    "attributes.DEVICE_PART_NUMBER.value_name",
    "attributes.CONDUCTORS_NUMBER.value_name",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL DESDE CERO
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Genérico",
        Fabricante: item["attributes.MANUFACTURER.value_name"] || "",
        "Numero de Pieza": item["attributes.DEVICE_PART_NUMBER.value_name"],
        Largo: item["attributes.LENGTH.value_struct.number"] || "",
        "Unidad de Largo": item["attributes.LENGTH.value_struct.unit"] || "",
        "Numero de Conductores": item["attributes.CONDUCTORS_NUMBER.value_name"] || "",

        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoComponentesElectronicosSemiconductoresTransistores(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Semiconductores_Transistores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.TRANSISTOR_CODE.value_name",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Genérico",
        "Codigo del transistor": item["attributes.TRANSISTOR_CODE.value_name"] || item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "",

        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectrodomesticosYAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosOtros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Repuestos_y_Accesorios_Para_Cocinas_y_Hornos_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Tipo de electrodomesticos compatibles": item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"] || "",
        "Marcas Compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"] || "",
        "Modelos Compatibles": item["attributes.MODEL.value_name"] || "",

        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectrodomesticosYAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPlaquetas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Plaquetas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.APPLIANCE_TYPE.value_name",
    "attributes.POWER_SUPPLY_TYPE.value_name",

  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "",
        "Tipo de Electrodomestico": item["attributes.APPLIANCE_TYPE.value_name"] || "",
        "Tipo de Alimentacion": item["attributes.POWER_SUPPLY_TYPE.value_name"] || "",

        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getComputacionNotebooksyAccesoriosRepuestosCamarasInternas(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Cámaras_Internas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.DEVICE_PART_NUMBER.value_name",
    "attributes.MODEL.value_name",

  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Numero de pieza": item["attributes.DEVICE_PART_NUMBER.value_name"] || item["attributes.BRAND.value_name"] || item["attributes.MODEL.value_name"] || "",
        Modelo: item["attributes.MODEL.value_name"] || "",


        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosEstantes(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Estantes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",

  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Genérico",
        "Tipo de Estante": "Bandeja",
        Largo: item["attributes.LENGTH.value_struct.number"] || "",
        "Unidad de Largo": item["attributes.LENGTH.value_struct.unit"] || "",


        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasJaboneras(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Jaboneras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.PART_NUMBER.value_name",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Numero de Pieza": item["attributes.PART_NUMBER.value_name"] || item["attributes.BRAND.value_name"] || "Genérica",


        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getElectronicaAudioyVideoControlesRemotosParaReproductoresDeVideo(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Controles_Remotos_Para_Reproductores_de_Video.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.INCLUDES_CELL_BATTERIES.value_name",
    "attributes.REQUIRES_PROGRAMMING.value_name",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Genérico",
        "Incluye pilas": item["attributes.INCLUDES_CELL_BATTERIES.value_name"] || "",
        "Requiere Programacion": item["attributes.REQUIRES_PROGRAMMING.value_name"] || "",


        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getComputacionConectividadyRedesPlacasDeRed(req, res) {
  const fileName = "Computación_Conectividad_y_Redes_Placas_de_Red.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.LINE.value_name",
  ];

  try {
    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const results = [];

    console.log(`\nProcesando ${items.length} productos de ${fileName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      process.stdout.write(`\rItem ${i + 1}/${items.length} → ${item.id}`);

      let extraData = {};
      try {
        const response = await axios.get(`https://api.mercadolibre.com/items/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const body = response.data;

        camposExtra.forEach(campo => {
          let value = "";
        
          if (campo === "family_name") {
            value = body.family_name || "";
          }
          else if (campo.startsWith("attributes.")) {
            const [, attrId, sub1, sub2] = campo.split(".");
        
            const attr = body.attributes?.find(a => a.id === attrId);
        
            if (attr) {
              if (sub1 === "value_struct" && sub2) {
                value = attr.value_struct?.[sub2] 
                     ?? attr.values?.[0]?.struct?.[sub2] 
                     ?? "";
              }
              else if (sub1?.startsWith("value_")) {
                value = attr[sub1] ?? "";
              }
            }
          }
        
          extraData[campo] = value;
        });

      } catch (err) {
        camposExtra.forEach(campo => extraData[campo] = "Error");
      }

      results.push({
        ...item,
        ...extraData
      });

      await new Promise(r => setTimeout(r, 200));
    }

    // ========================================
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const conditionSpanish = item.condition === "new" ? "Nuevo" : "Usado";

      const row = {

        Titulo: item.family_name,
        Condicion: conditionSpanish,
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Genérico",
        Linea: item["attributes.LINE.value_name"] || "",


        "Costo de envio": "A cargo del comprador",
        "Retiro en persona": "Acepto",
        "Tipo de Garantia": "Garantía del vendedor",
        "Tiempo de Garantia": "3",
        "Unidad de tiempo de Garantia": "meses",

      };

      dataForExcel.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    const outputFile = path.join(__dirname, "..", "data", "excel-ready", fileName.replace(".json", ".xlsx"));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    XLSX.writeFile(workbook, outputFile);

    console.log(`\nExcel generado → ${outputFile}\n`);

    res.download(outputFile, `carga_${fileName.replace(".json", ".xlsx")}`, err => {
      if (err) console.error("Error enviando archivo:", err);
    });

  } catch (err) {
    console.error("Error en función de categoría:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// Registrar la función con URL limpia
router.get("/agro-repuestos-bombas-aceite", getAgroRepuestosBombasAceite);
router.get("/agro-repuestos-maquinaria-agricola-motor-ciguenales", getAgroRepuestosMaquinariaAgricolaMotorCiguenales);
router.get("/antiguedadesycolecciones-antiguedades-electrodomesticosantiguos-ventiladores", getAntiguedadesyColeccionesAntiguedadesElectrodomesticosAntiguosVentiladores);
router.get("/electronicaaudioyvideo-repuestosparatv-cablesflex", getElectronicaAudioyVideoRepuestosparaTVCablesFlex);
router.get("/electronicaaudioyvideo-accesoriosparatv-soportes", getElectronicaAudioyVideoAccesoriosParaTVSoportes);
router.get("/electronicaaudioyvideo-repuestosparatv-placasmain", getElectronicaAudioyVideoRepuestosparaTVPlacasMain);
router.get("/electronicaaudioyvideo-repuestosparatv-fuentesparatv", getElectronicaAudioyVideoRepuestosparaTVFuentesParaTV);
router.get("/electronicaaudioyvideo-repuestosparatv-tiraparaled", getElectronicaAudioyVideoRepuestosparaTVTiraParaLed);
router.get("/electronicaaudioyvideo-repuestosparatv-otros", getElectronicaAudioyVideoRepuestosparaTVOtros);
router.get("/electronicaaudioyvideo-componenteselectronicos-plaquetas", getElectronicaAudioyVideoComponentesElectronicosPlaquetas);
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-circuitosintegrados", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresCircuitosIntegrados),
router.get("/electronicaaudioyvideo-accesoriosparatv-otros", getElectronicaAudioyVideoAccesoriosParaTVOtros);
router.get("/electronicaaudioyvideo-controlesremotosparatv", getElectronicaAudioyVideoControlesRemotosParaTV);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-otros", getElectrodomesticosYAiresAcLavadoRepuestosYAccesoriosParaLavarropasYSecarropasOtros);
router.get("/computacion-notebooksyaccesorios-repuestos-cablesflex", getComputacionNotebooksYAccesoriosRepuestosCablesFlex);
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-transistores", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresTransistores);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesoriosparacocinasyhornos-otros", getElectrodomesticosYAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosOtros);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-plaquetas", getElectrodomesticosYAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPlaquetas);
router.get("/computacion-notebooksyaccesorios-repuestos-camarasinternas", getComputacionNotebooksyAccesoriosRepuestosCamarasInternas);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-estantes", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosEstantes);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-jaboneras", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasJaboneras);
router.get("/electronicaaudioyvideo-controlesremotos-parareproductoresdevideo", getElectronicaAudioyVideoControlesRemotosParaReproductoresDeVideo);
router.get("/computacion-conectividadyredes-placasdered", getComputacionConectividadyRedesPlacasDeRed);

module.exports = router;