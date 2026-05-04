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
    name: "electronicaaudioyvideo-repuestosparatv-botonerasdetv",
    endpoint: "electronicaaudioyvideo-repuestosparatv-botonerasdetv",
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
  {
    name: "computacion-lectoresyscanners-lectorasygrabadorasdedvdsycds-grabadorasdedvd",
    endpoint: "computacion-lectoresyscanners-lectorasygrabadorasdedvdsycds-grabadorasdedvd",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-touchpads",
    endpoint: "computacion-notebooksyaccesorios-repuestos-touchpads",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-memoriasrapparalaptops",
    endpoint: "computacion-notebooksyaccesorios-repuestos-memoriasrapparalaptops",
  },
  {
    name: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-otros",
    endpoint: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-otros",
  },
  {
    name: "bebes-juegosyjuguetesparabebes-juegosdeencastreyapilables",
    endpoint: "bebes-juegosyjuguetesparabebes-juegosdeencastreyapilables",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-coolersinternosparalaptops",
    endpoint: "computacion-notebooksyaccesorios-repuestos-coolersinternosparalaptops",
  },
  {
    name: "electrodomesticosyairesac-repuestosyaccesorios-paralavarropasysecarropas-puertasytapas",
    endpoint: "electrodomesticosyairesac-repuestosyaccesorios-paralavarropasysecarropas-puertasytapas",
  },
  {
    name: "electrodomesticosyairesac-repuestosyaccesorios-paralavarropasysecarropas-poleasparalavarropas",
    endpoint: "electrodomesticosyairesac-repuestosyaccesorios-paralavarropasysecarropas-poleasparalavarropas",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-placas-otros",
    endpoint: "computacion-notebooksyaccesorios-repuestos-placas-otros",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-otros",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-otros",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-panelesdecontrol",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-panelesdecontrol",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-pasivos-capacitoreselectroliticos",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-pasivos-capacitoreselectroliticos",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-mangueras",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-mangueras",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-pasivos-resistencias",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-pasivos-resistencias",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-semiconductores-diodos-rectificadores",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-semiconductores-diodos-rectificadores",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-plaquetasparaheladeras",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-plaquetasparaheladeras",
  },
  {
    name: "computacion-monitoresyaccesorios-soportes",
    endpoint: "computacion-monitoresyaccesorios-soportes",
  },
  {
    name: "computacion-almacenamiento-discosyaccesorios-discosrigidosyssds",
    endpoint: "computacion-almacenamiento-discosyaccesorios-discosrigidosyssds",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-otros",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-otros",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-otros",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-otros",
  },
  {
    name: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-motores",
    endpoint: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-motores",
  },
  {
    name: "electronicaaudioyvideo-accesoriosparatv-baseselevadoras",
    endpoint: "electronicaaudioyvideo-accesoriosparatv-baseselevadoras",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-lavarropasysecarropas-motores-motoresparalavarropas",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-lavarropasysecarropas-motores-motoresparalavarropas",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-lavarropasysecarropas-soportesdetambor-paralavarropas",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-lavarropasysecarropas-soportesdetambor-paralavarropas",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-baterias",
    endpoint: "computacion-notebooksyaccesorios-repuestos-baterias",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-otros",
    endpoint: "computacion-notebooksyaccesorios-repuestos-otros",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-manijas",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-manijas",
  },
  {
    name: "otrascategorias-esoterismo-dijes",
    endpoint: "otrascategorias-esoterismo-dijes",
  },
  {
    name: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-helices",
    endpoint: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-helices",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-placas-placasdeencendido",
    endpoint: "computacion-notebooksyaccesorios-repuestos-placas-placasdeencendido",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-agitadores",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-agitadores",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-termostatos",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-termostatos",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-amortiguadores",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-amortiguadores",
  },
  {
    name: "computacion-cablesyhubsusb-cables-cablespower",
    endpoint: "computacion-cablesyhubsusb-cables-cablespower",
  },
  {
    name: "electrodomesticosyairesac-levado-repuestosyaccesorios-paralavarropasysecarropas-electrovalvulas",
    endpoint: "electrodomesticosyairesac-levado-repuestosyaccesorios-paralavarropasysecarropas-electrovalvulas",
  },
  {
    name: "herramientas-herramientasparajardin-repuestos-otros",
    endpoint: "herramientas-herramientasparajardin-repuestos-otros",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-interruptoresypresostatos-presostatos",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-interruptoresypresostatos-presostatos",
  },
  {
    name: "librosrevistasycomics-revistas",
    endpoint: "librosrevistasycomics-revistas",
  },
  {
    name: "electronicaaudioyvideo-accesoriosparaaudoiyvideo-otros",
    endpoint: "electronicaaudioyvideo-accesoriosparaaudoiyvideo-otros",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-inversoresdecorriente",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-inversoresdecorriente",
  },
  {
    name: "computacion-componentesdepc-refrigeracion-coolersyventiladores",
    endpoint: "computacion-componentesdepc-refrigeracion-coolersyventiladores",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-placas-placasdeaudio",
    endpoint: "computacion-notebooksyaccesorios-repuestos-placas-placasdeaudio",
  },
  {
    name: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-bisagras",
    endpoint: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-bisagras",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-bombas",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-bombas",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-conectores",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-conectores",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-bisagras",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-bisagras",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-semiconductores-otros",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-semiconductores-otros",
  },
  {
    name: "electrodomesticosyaires-climatizacion-repuestosyaccesorios-paraairesacondicionados-control",
    endpoint: "electrodomesticosyaires-climatizacion-repuestosyaccesorios-paraairesacondicionados-control",
  },
  {
    name: "electrodomesticosyaires-lavado-repuestosyaccesorios-paralavarropasysecarropas-correas",
    endpoint: "electrodomesticosyaires-lavado-repuestosyaccesorios-paralavarropasysecarropas-correas",
  },
  {
    name: "computacion-componentesdepc-fuentesdealimentacion-cablesdealimentacion",
    endpoint: "computacion-componentesdepc-fuentesdealimentacion-cablesdealimentacion",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-parlantes",
    endpoint: "computacion-notebooksyaccesorios-repuestos-parlantes",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-semiconductores-bobinas",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-semiconductores-bobinas",
  },
  {
    name: "electrodomesticosyairesac-artefactosdecuidadopersonal-repuestosyaccesorios",
    endpoint: "electrodomesticosyairesac-artefactosdecuidadopersonal-repuestosyaccesorios",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-carcasas",
    endpoint: "computacion-notebooksyaccesorios-repuestos-carcasas",
  },
  {
    name: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-basesparaventiladoresdepie",
    endpoint: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-basesparaventiladoresdepie",
  },
  {
    name: "electronicaaudioyvideo-audio-audioportatilyaccesorios-otros",
    endpoint: "electronicaaudioyvideo-audio-audioportatilyaccesorios-otros",
  },
  {
    name: "electrodomesticosyairesac-coccion-repuestosyaccesoriosparamicroondas-otros",
    endpoint: "electrodomesticosyairesac-coccion-repuestosyaccesoriosparamicroondas-otros",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-cajadeengranajes",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-cajadeengranajes",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-canastos",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-canastos",
  },
  {
    name: "electrodomesticosyairesac-pequenos-electrodomesticos-paracocina-repuestosyaccesorios-paralicuadoras-motores",
    endpoint: "electrodomesticosyairesac-pequenos-electrodomesticos-paracocina-repuestosyaccesorios-paralicuadoras-motores",
  },
  {
    name: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paramicroondas-plaquetas",
    endpoint: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paramicroondas-plaquetas",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-pantallas",
    endpoint: "computacion-notebooksyaccesorios-repuestos-pantallas",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-resistencias",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-resistencias",
  },
  {
    name: "electrodomesticosyairesac-dispensadoresypurificadores-repuestosyaccesorios-otros",
    endpoint: "electrodomesticosyairesac-dispensadoresypurificadores-repuestosyaccesorios-otros",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-displayslcd",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-displayslcd",
  },
  {
    name: "electronicaaudioyvideo-audio-minicomponentes",
    endpoint: "electronicaaudioyvideo-audio-minicomponentes",
  },
  {
    name: "industriasyoficinas-herramientasindustriales-repuestos-botonerasdeparoyarranque",
    endpoint: "industriasyoficinas-herramientasindustriales-repuestos-botonerasdeparoyarranque",
  },
  {
    name: "computacion-componentesdepc-sintonizadorasdetv",
    endpoint: "computacion-componentesdepc-sintonizadorasdetv",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-tapas",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-tapas",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-programador",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-programador",
  },
  {
    name: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraairesacondicionados-plaquetasparaairesac",
    endpoint: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraairesacondicionados-plaquetasparaairesac",
  },
  {
    name: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-otros",
    endpoint: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-otros",
  },
  {
    name: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracampanas-motores",
    endpoint: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracampanas-motores",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-fuelles",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-fuelles",
  },
  {
    name: "electronicaaudioyvideo-audio-audioportatilyaccesorios-accesorios-parlantesportatiles",
    endpoint: "electronicaaudioyvideo-audio-audioportatilyaccesorios-accesorios-parlantesportatiles",
  },
  {
    name: "electronicaaudioyvideo-cables-cablesdeaudoiyvideo",
    endpoint: "electronicaaudioyvideo-cables-cablesdeaudoiyvideo",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-disipadorestermicos-plaquetasdisipadoras",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-disipadorestermicos-plaquetasdisipadoras",
  },
  {
    name: "hogar-mueblesyjardin-mueblesparaelhogar-accesoriosyrepuestos-burletes",
    endpoint: "hogar-mueblesyjardin-mueblesparaelhogar-accesoriosyrepuestos-burletes",
  },
  {
    name: "computacion-monitoresyaccesorios-fuentes",
    endpoint: "computacion-monitoresyaccesorios-fuentes",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-filtrosparalavarropas",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-filtrosparalavarropas",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-teclados",
    endpoint: "computacion-notebooksyaccesorios-repuestos-teclados",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-motores",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-motores",
  },
  {
    name: "electronicaaudioyvideo-audio-parlantesybafles",
    endpoint: "electronicaaudioyvideo-audio-parlantesybafles",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-plaquetas",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-plaquetas",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-semiconductores-chips-leds",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-semiconductores-chips-leds",
  },
  {
    name: "electronicaaudioyvideo-otros",
    endpoint: "electronicaaudioyvideo-otros",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-semiconductores-reles",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-semiconductores-reles",
  },
  {
    name: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-preparacionesdebebidas-licuadoras",
    endpoint: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-preparacionesdebebidas-licuadoras",
  },
  {
    name: "herramientas-herramientaselectricas-limpieza-hidrolavadoras",
    endpoint: "herramientas-herramientaselectricas-limpieza-hidrolavadoras",
  },
  {
    name: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-vidriosparapuertas",
    endpoint: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-vidriosparapuertas",
  },
  {
    name: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-quemadores",
    endpoint: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-quemadores",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-burletes",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-burletes",
  },
  {
    name: "herramientas-accesoriosparaherramientas-inducidos",
    endpoint: "herramientas-accesoriosparaherramientas-inducidos",
  },
  {
    name: "hogarmueblesyjardin-cuidadodelhogarylavanderia-desechables-bolsasparaaspiradoras",
    endpoint: "hogarmueblesyjardin-cuidadodelhogarylavanderia-desechables-bolsasparaaspiradoras",
  },
  {
    name: "computacion-monitoresyaccesorios-baseselevadoras",
    endpoint: "computacion-monitoresyaccesorios-baseselevadoras",
  },
  {
    name: "electrodomesticosyairesac-climatizacion-ventiladores",
    endpoint: "electrodomesticosyairesac-climatizacion-ventiladores",
  },
  {
    name: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paracalefonesytermotanques-termocuplas",
    endpoint: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paracalefonesytermotanques-termocuplas",
  },
  {
    name: "computacion-componentesdepc-otros",
    endpoint: "computacion-componentesdepc-otros",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-placasdemicrocontroladores",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-placasdemicrocontroladores",
  },
  {
    name: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-otros",
    endpoint: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-otros",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-inverters",
    endpoint: "computacion-notebooksyaccesorios-repuestos-inverters",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-resistencias",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-resistencias",
  },
  {
    name: "electrodomesticosyairesac-lavado-lavavajillas",
    endpoint: "electrodomesticosyairesac-lavado-lavavajillas",
  },
  {
    name: "electronicaaudioyvideo-audio-sintonizadores",
    endpoint: "electronicaaudioyvideo-audio-sintonizadores",
  },
  {
    name: "electrodomesticosyairesac-lavado-secarropas",
    endpoint: "electrodomesticosyairesac-lavado-secarropas",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-pasivos-otros",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-pasivos-otros",
  },
  {
    name: "construccion-aberturas-puertas",
    endpoint: "construccion-aberturas-puertas",
  },
  {
    name: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracampanas-filtros",
    endpoint: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracampanas-filtros",
  },
  {
    name: "electronicaaudioyvideo-accesoriosparaaudioyvideo-adaptadores",
    endpoint: "electronicaaudioyvideo-accesoriosparaaudioyvideo-adaptadores",
  },
  {
    name: "electronicaaudioyvideo-accesoriosparaaudioyvideo-conversoresdetv",
    endpoint: "electronicaaudioyvideo-accesoriosparaaudioyvideo-conversoresdetv",
  },
  {
    name: "construccion-electricidad-interruptoresyenchufes-interruptores-botonesindustriales",
    endpoint: "construccion-electricidad-interruptoresyenchufes-interruptores-botonesindustriales",
  },
  {
    name: "electronicaaudioyvideo-audio-audioportatilyaccesorios-accesorios-soportes",
    endpoint: "electronicaaudioyvideo-audio-audioportatilyaccesorios-accesorios-soportes",
  },
  {
    name: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-resistencias",
    endpoint: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-resistencias",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-retenesparalavarropas",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-retenesparalavarropas",
  },
  {
    name: "electrodomesticosyairesac-lavado-lavarropasylavasecarropas",
    endpoint: "electrodomesticosyairesac-lavado-lavarropasylavasecarropas",
  },
  {
    name: "construccion-electricidad-interruptoresyenchufes-interruptores-interruptoreselectricos",
    endpoint: "construccion-electricidad-interruptoresyenchufes-interruptores-interruptoreselectricos",
  },
  {
    name: "saludyequipamientomedico-equipamientomedico-equipamientoodontologico-turbinasodontologicas",
    endpoint: "saludyequipamientomedico-equipamientomedico-equipamientoodontologico-turbinasodontologicas",
  },
  {
    name: "herramientas-accesoriosparaherramientas-escobillasdecarbon",
    endpoint: "herramientas-accesoriosparaherramientas-escobillasdecarbon",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-lectoreslaser",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-lectoreslaser",
  },
  {
    name: "computacion-otros",
    endpoint: "computacion-otros",
  },
  {
    name: "electronicaaudioyvideo-controlesremotos-otros",
    endpoint: "electronicaaudioyvideo-controlesremotos-otros",
  },
  {
    name: "herramientas-accesoriosparaherramientas-otros",
    endpoint: "herramientas-accesoriosparaherramientas-otros",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-interruptores",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-interruptores",
  },
  {
    name: "hogarmueblesyjardin-iluminacionparaelhogar-tirasdeled",
    endpoint: "hogarmueblesyjardin-iluminacionparaelhogar-tirasdeled",
  },
  {
    name: "hogarmueblesyjardin-jardinyairelibre-jardineriayaccesorios-herramientasparajardin-repuestos-carburadores",
    endpoint: "hogarmueblesyjardin-jardinyairelibre-jardineriayaccesorios-herramientasparajardin-repuestos-carburadores",
  },
  {
    name: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-tapasparahornallas",
    endpoint: "electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-tapasparahornallas",
  },
  {
    name: "electrodomesticosyairesac-pequenoselectrodomesticos-parahogar-repuestosyaccesorios-paraaspiradoras-motores",
    endpoint: "electrodomesticosyairesac-pequenoselectrodomesticos-parahogar-repuestosyaccesorios-paraaspiradoras-motores",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-sensores",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-sensores",
  },
  {
    name: "juegosyjuguetes-otros",
    endpoint: "juegosyjuguetes-otros",
  },
  {
    name: "bebesyjuguetes-parabebes-juegosdearrastre",
    endpoint: "bebesyjuguetes-parabebes-juegosdearrastre",
  },
  {
    name: "librosrevistasycomics-otros",
    endpoint: "librosrevistasycomics-otros",
  },
  {
    name: "computacion-componentesdepc-placas-placasusb-firewire",
    endpoint: "computacion-componentesdepc-placas-placasusb-firewire",
  },
  {
    name: "computacion-componentesdepc-placas-placasdesonido",
    endpoint: "computacion-componentesdepc-placas-placasdesonido",
  },
  {
    name: "computacion-impresion-repuestos-componenteselectronicos-placaslogicas",
    endpoint: "computacion-impresion-repuestos-componenteselectronicos-placaslogicas",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-pilasbiosycmos",
    endpoint: "computacion-notebooksyaccesorios-repuestos-pilasbiosycmos",
  },
  {
    name: "construccion-electricidad-fusibles",
    endpoint: "construccion-electricidad-fusibles",
  },
  {
    name: "construccion-electricidad-cablesyaccesorios-cableselectricos",
    endpoint: "construccion-electricidad-cablesyaccesorios-cableselectricos",
  },
  {
    name: "electrodomesticosyairesac-coccion-cocinas",
    endpoint: "electrodomesticosyairesac-coccion-cocinas",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-heladeras",
    endpoint: "electrodomesticosyairesac-refrigeracion-heladeras",
  },
  {
    name: "computacion-monitoresyaccesorios-monitores",
    endpoint: "computacion-monitoresyaccesorios-monitores",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-kitsderulemanesysellos",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-kitsderulemanesysellos",
  },
  {
    name: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-cajones",
    endpoint: "electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-cajones",
  },
  {
    name: "electronicaaudioyvideo-pilasycargadores-transformadoresyfuentes",
    endpoint: "electronicaaudioyvideo-pilasycargadores-transformadoresyfuentes",
  },
  {
    name: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-paraprocesadorasybatidoras-motores",
    endpoint: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-paraprocesadorasybatidoras-motores",
  },
  {
    name: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-preparaciondebebidas-exprimidoreselectricos",
    endpoint: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-preparaciondebebidas-exprimidoreselectricos",
  },
  {
    name: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-patasniveladoras",
    endpoint: "electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-patasniveladoras",
  },
  {
    name: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-parajugueras",
    endpoint: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-parajugueras",
  },
  {
    name: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-paracafeteras-depositosdeagua",
    endpoint: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-paracafeteras-depositosdeagua",
  },
  {
    name: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-jarraselectricas",
    endpoint: "electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-jarraselectricas",
  },
  {
    name: "electrodomesticosyairesac-coccion-anafes",
    endpoint: "electrodomesticosyairesac-coccion-anafes",
  },
  {
    name: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-capacitoresparaventiladores",
    endpoint: "electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-capacitoresparaventiladores",
  },
  {
    name: "herramientas-herramientasindustriales-repuestos-pulsadores",
    endpoint: "herramientas-herramientasindustriales-repuestos-pulsadores",
  },
  {
    name: "electrodomesticosyairesac-coccion-extractoresypurificadores",
    endpoint: "electrodomesticosyairesac-coccion-extractoresypurificadores",
  },
  {
    name: "herramientas-accesoriosparaherramientas-puntasyadaptadores-mandriles",
    endpoint: "herramientas-accesoriosparaherramientas-puntasyadaptadores-mandriles",
  },
  {
    name: "herramientas-herramientasparajardin-repuestos-kitsderepuestos",
    endpoint: "herramientas-herramientasparajardin-repuestos-kitsderepuestos",
  },
  {
    name: "computacion-notebooksyaccesorios-repuestos-placasmotherboards",
    endpoint: "computacion-notebooksyaccesorios-repuestos-placasmotherboards",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-semiconductores-modulosigbt",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-semiconductores-modulosigbt",
  },
  {
    name: "computacion-tabletsyaccesorios-repuestos-cablesflex",
    endpoint: "computacion-tabletsyaccesorios-repuestos-cablesflex",
  },
  {
    name: "computacion-proyectoresypantallas-otros",
    endpoint: "computacion-proyectoresypantallas-otros",
  },
  {
    name: "computacion-impresion-insumosdeimpresion-toners",
    endpoint: "computacion-impresion-insumosdeimpresion-toners",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-semiconductores-optoacopladores",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-semiconductores-optoacopladores",
  },
  {
    name: "electronicaaudioyvideo-video-reproductoresdedvd",
    endpoint: "electronicaaudioyvideo-video-reproductoresdedvd",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-pasivos-termistores",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-pasivos-termistores",
  },
  {
    name: "celularesytelefonos-handiesyradiofrecuencia-accesorios-fuentes",
    endpoint: "celularesytelefonos-handiesyradiofrecuencia-accesorios-fuentes",
  },
  {
    name: "electronicaaudioyvideo-componenteselectronicos-semiconductores-reguladoresdetension",
    endpoint: "electronicaaudioyvideo-componenteselectronicos-semiconductores-reguladoresdetension",
  },
  {
    name: "hogar-mueblesyjardin-mueblesparaelhogar-accesoriosyrepuestos-tiradores",
    endpoint: "hogar-mueblesyjardin-mueblesparaelhogar-accesoriosyrepuestos-tiradores",
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
        Marca: "Genérica",
        Modelo: item["attributes.COMPATIBLE_DEVICE_MODEL.value_name"] || item["attributes.COMPATIBLE_DEVICE.value_name"] || "TV",
        Largo: item["attributes.LENGTH.value_struct.number"] || "",
        "Unidad de Largo": item["attributes.LENGTH.value_struct.unit"] || "",
        "Dispositivo Compatible": item["attributes.COMPATIBLE_DEVICE.value_name"] || "TV",
        "Cantidad de Conductores": item["attributes.CONDUCTORS_NUMBER.value_name"] || "",
        "Numero de pieza del dispositivo": item["attributes.DEVICE_PART_NUMBER.value_name"] || item["attributes.COMPATIBLE_DEVICE.value_name"] || "",

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
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "TV",

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
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "TV",
        "Numero de pieza del dispositivo": item["attributes.DEVICE_PART_NUMBER.value_name"] || item["attributes.MODEL.value_name"] || "",
        
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
        Modelo: item["attributes.MODEL.value_name"] || "TV",
        "Codigo de la Placa": item["attributes.BOARD_CODE.value_name"] || item["attributes.MODEL.value_name"] || "TV",

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
        Compatibilidad: item["attributes.COMPATIBILITY.value_name"] || "TV",
        Largo: item["attributes.LENGTH.value_struct.number"],
        "Unidad de Largo": item["attributes.LENGTH.value_struct.unit"],

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
        Condicion: "Usado",
        "Codigo Universal": "El producto no tiene código registrado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Modelo Compatible": item["attributes.COMPATIBLE_MODEL.value_name"] || "TV",
        Modelo: item["attributes.MODEL.value_name"] || "TV",
        "Numero de Pieza": item["attributes.PART_NUMBER.value_name"] || item["attributes.MODEL.value_name"] || item["attributes.COMPATIBLE_MODEL.value_name"] || "",

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
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || "TV",
        "Incluye Pilas": item["attributes.INCLUDES_CELL_BATTERIES.value_name"] || "No",
        "Boton Netflix": item["attributes.WITH_NETFLIX_BUTTON.value_name"] || "",
        "Boton Youtube": item["attributes.WITH_YOUTUBE_BUTTON.value_name"] || "",
        "Es universal": item["attributes.IS_UNIVERSAL.value_name"] || "No",
        "Comando de Voz": item["attributes.WITH_VOICE_COMMAND.value_name"] || "No",
        "Teclado": item["attributes.WITH_KEYBOARD.value_name"] || "No",
        "Google Play": item["attributes.WITH_GOOGLE_PLAY_BUTTON.value_name"] || "No",
        "Prime Video": item["attributes.WITH_PRIME_VIDEO_BUTTON.value_name"] || "No",
        "Disney+": item["attributes.WITH_DISNEY_BUTTON.value_name"] || "No",
        "Hulu": item["attributes.WITH_HULU_BUTTON.value_name"] || "No",
        "Vudu": item["attributes.WITH_VUDU_BUTTON.value_name"] || "No",

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
        Condicion: "Usado",
        "Codigo Universal": "El producto no tiene código registrado",
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
        Condicion: "Usado",
        "Codigo Universal": "El producto no tiene código registrado",
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
        Condicion: "Usado",
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
        Condicion: "Usado",
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
        Condicion: "Usado",
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
        Condicion: "Usado",
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
        Condicion: "Usado",
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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
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

async function getComputacionLectoresyScannersLectorasyGrabadorasdeDVDsyCDsGrabadorasdeDVD(req, res) {
  const fileName = "Computación_Lectores_y_Scanners_Lectoras_y_Grabadoras_Grabadoras_de_DVDs_y_CDs_Grabadoras_de_DVD.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.LINE.value_name",
    "attributes.COLOR.value_name",
    "attributes.DVD_RECORDER_TYPE.value_name"
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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"] || "",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Genérico",
        "Tipo de grabadora de DVD": item["attributes.DVD_RECORDER_TYPE.value_name"] || "Interno",
        Linea: item["attributes.LINE.value_name"],


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

async function getComputacionNotebooksyAccesoriosRepuestosTouchpads(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Touchpads.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"] || "",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Genérico",


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

async function getComputacionNotebooksyAccesoriosRepuestosMemoriasRAMparaLaptops(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Memorias_RAM_para_Laptops.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.RAM_MEMORY_MODULES.value_name",
    "attributes.RAM_MEMORY_MODULE_TOTAL_CAPACITY.value_struct.number",
    "attributes.RAM_MEMORY_MODULE_TOTAL_CAPACITY.value_struct.unit",
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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        "Formato de venta": "Unidad",
        "Unidades por Pack": 1,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Genérico",
        "Modulos de memoria RAM": item["attributes.RAM_MEMORY_MODULES.value_name"] || "DDR2",
        "Capacidad Total": item["attributes.RAM_MEMORY_MODULE_TOTAL_CAPACITY.value_struct.number"] || "1111",
        "Unidad de Capacidad": item["attributes.RAM_MEMORY_MODULE_TOTAL_CAPACITY.value_struct.unit"] || "GB",
        Linea: item["attributes.LINE.value_name"],


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

async function getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaVentiladoresOtros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Climatización_Repuestos_y_Accesorios_Para_Ventiladores_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",
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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        "Formato de venta": "Unidad",
        "Unidades por Pack": 1,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Tipos de electrodomesticos": item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        "Marcas Compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        "Modelos Compatibles": item["attributes.COMPATIBLE_MODELS.value_name"],


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

async function getBebesJuegosyJuguetesparaBebesJuegosdeEncastreyApilables(req, res) {
  const fileName = "Bebés_Juegos_y_Juguetes_para_Bebés_Juegos_de_Encastre_y_Apilables.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COLOR.value_name",
    "attributes.MODEL.value_name",
    "attributes.AGE_GROUP.value_name",
    "attributes.TOY_SAFETY_CERTIFICATE_NUMBER.value_name",
    "attributes.THEME.value_name",
    "attributes.MATERIALS.value_name",
    "attributes.STIMULATED_SKILLS.value_name",
    "attributes.PIECES_NUMBER.value_name",
    "attributes.MIN_RECOMMENDED_AGE.value_struct.number",
    "attributes.MIN_RECOMMENDED_AGE.value_struct.unit",
    "attributes.MAX_RECOMMENDED_AGE.value_struct.number",
    "attributes.MAX_RECOMMENDED_AGE.value_struct.unit",
    "attributes.PRODUCT_TYPE.value_name",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
    "attributes.WIDTH.value_struct.number",
    "attributes.WIDTH.value_struct.unit",
    "attributes.HEIGHT.value_struct.number",
    "attributes.HEIGHT.value_struct.unit",
    "attributes.WITH_LIGHTS.value_name",
    "attributes.WITH_SOUND.value_name",
    "attributes.RECOMMENDED_AGE_GROUP.value_name",


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

      const row = {

        Titulo: item.family_name,
        Condicion: "Nuevo",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: item["attributes.BRAND.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        Edad: item["attributes.AGE_GROUP.value_name"],
        "Numero Certificado": item["attributes.TOY_SAFETY_CERTIFICATE_NUMBER.value_name"],
        Tema: item["attributes.THEME.value_name"],
        Materiales: item["attributes.MATERIALS.value_name"],
        "Habilidades Estimuladas": item["attributes.STIMULATED_SKILLS.value_name"],
        "Cantidad de Piezas": item["attributes.PIECES_NUMBER.value_name"],
        "Edad minima": item["attributes.MIN_RECOMMENDED_AGE.value_struct.number"],
        "Unidad Edad minima": item["attributes.MIN_RECOMMENDED_AGE.value_struct.unit"],
        "Edad maxima": item["attributes.MAX_RECOMMENDED_AGE.value_struct.number"],
        "Unidad Edad maxima": item["attributes.MAX_RECOMMENDED_AGE.value_struct.unit"],
        "Tipos de Productor": item["attributes.PRODUCT_TYPE.value_name"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        "Unidad de Largo": item["attributes.LENGTH.value_struct.unit"],
        Ancho: item["attributes.WIDTH.value_struct.number"],
        "Unidad de Ancho": item["attributes.WIDTH.value_struct.unit"],
        Altura: item["attributes.HEIGHT.value_struct.number"],
        "Unidad de Altura": item["attributes.HEIGHT.value_struct.unit"],
        "Con Luces": item["attributes.WITH_LIGHTS.value_name"],
        "Con Sonido": item["attributes.WITH_SOUND.value_name"],
        "Con Pilas": "No",
        "Edad Recomendada": item["attributes.RECOMMENDED_AGE_GROUP.value_name"],

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

async function getComputacionNotebooksyAccesoriosRepuestosCoolersInternosparaLaptops(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Coolers_Internos_para_Laptops.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.DEVICE_PART_NUMBER.value_name",
    "attributes.PINS_NUMBER.value_name",

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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "TV",
        "Numero de Pieza": item["attributes.DEVICE_PART_NUMBER.value_name"] || item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Cantidad Pines": item["attributes.PINS_NUMBER.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPuertasyTapas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Puertas_y_T.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.PRODUCT_TYPE.value_name",
    "attributes.APPLIANCE_TYPE.value_name",
    "attributes.MATERIAL.value_name",
    "attributes.LOCATION.value_name",

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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "TV",
        "Tipo de Producto": item["attributes.PRODUCT_TYPE.value_name"],
        "Tipo de Electrodomestico": item["attributes.APPLIANCE_TYPE.value_name"],
        Material: item["attributes.MATERIAL.value_name"],
        Ubicacion: item["attributes.LOCATION.value_name"],

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

async function getElectrodomesticosYAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPoleasparaLavarropas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Poleas_para.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.PULLEY_TYPE.value_name",
    "attributes.MATERIAL.value_name",

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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"] || "Unidad",
        "Unidades por Pack": item["attributes.UNITS_PER_PACK.value_name"] || 1,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Lavarropas",
        "Tipo de Polea": item["attributes.PULLEY_TYPE.value_name"],
        Material: item["attributes.MATERIAL.value_name"],

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

async function getComputacionNotebooksyAccesoriosRepuestosPlacasOtros(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Placas_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "TV",

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

async function getElectronicaAudioyVideoComponentesElectronicosOtros(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "TV",

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPanelesdeControl(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Paneles_de_.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.MATERIAL.value_name",

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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        "Color Principal": item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Lavarropas",
        Color: item["attributes.COLOR.value_name"],
        Material: item["attributes.MATERIAL.value_name"],

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

async function getElectronicaAudioyVideoComponentesElectronicosPasivosCapacitoresElectroliticos(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Pasivos_Capacitores_Electrolíticos.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"],
        Unidades: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Lavarropas",
        "Numero de Pieza": item["attributes.PART_NUMBER.value_name"] || item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasMangueras(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Mangueras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",

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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"],
        Unidades: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Lavarropas",

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

async function getElectronicaAudioyVideoComponentesElectronicoPasivosResistencias(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Pasivos_Resistencias.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.RESISTOR_CODE.value_name",
    "attributes.MATERIAL.value_name",
    "attributes.MOUNT_TYPE.value_name",
    
    "attributes.POWER.value_struct.number",
    "attributes.RESISTOR_RESISTANCE.value_struct.number",
    "attributes.TOLERANCE.value_struct.number",
    "attributes.WIDTH.value_struct.number",
    "attributes.LENGTH.value_struct.number",
    "attributes.DIAMETER.value_struct.number",

    "attributes.POWER.value_struct.unit",
    "attributes.RESISTOR_RESISTANCE.value_struct.unit",
    "attributes.TOLERANCE.value_struct.unit",
    "attributes.WIDTH.value_struct.unit",
    "attributes.LENGTH.value_struct.unit",
    "attributes.DIAMETER.value_struct.unit",

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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"],
        Unidades: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "",
        "Codigo de Resistencia": item["attributes.RESISTOR_CODE.value_name"],
        Potencia: item["attributes.POWER.value_struct.number"],
        "Unidad Potencia": item["attributes.POWER.value_struct.unit"],
        Tolerancia: item["attributes.TOLERANCE.value_struct.number"],
        "Unidad Tolerancia": item["attributes.TOLERANCE.value_struct.unit"],
        Resistencia: item["attributes.RESISTOR_RESISTANCE.value_struct.number"],
        "Unidad Resistencia": item["attributes.RESISTOR_RESISTANCE.value_struct.unit"],
        Material: item["attributes.MATERIAL.value_name"],
        "Tipo de Montaje": item["attributes.MOUNT_TYPE.value_name"],
        Ancho: item["attributes.WIDTH.value_struct.number"],
        "Unidad Ancho": item["attributes.WIDTH.value_struct.unit"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        "Unidad Largo": item["attributes.LENGTH.value_struct.unit"],
        Diametro: item["attributes.DIAMETER.value_struct.number"],
        "Unidad Diametro": item["attributes.DIAMETER.value_struct.unit"],

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

async function getElectronicaAudioyVideoComponentesElectronicosSemiconductoresDiodosRectificadores(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Semiconductores_Diodos_Rectificadores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"],
        Unidades: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Numero de Pieza": item["attributes.PART_NUMBER.value_name"] || item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "",

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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosPlaquetasParaHeladeras(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Plaquetas_para_Heladeras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.APPLIANCE_TYPE.value_name",


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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "",
        "Tipo de Electrodomestico": item["attributes.APPLIANCE_TYPE.value_name"],

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

async function getComputacionMonitoresyAccesoriosSoportes(req, res) {
  const fileName = "Computación_Monitores_y_Accesorios_Soportes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.IS_ARTICULATED_MOUNT.value_name",


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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "",
        "Es Articulado": item["attributes.IS_ARTICULATED_MOUNT.value_name"],
        "Lugares de Montaje": "Mesa",
        "Es Inclinable": "No",
        "Es giratorio": "No",
        "Es fijo": "Sí",
        "Es gamer": "No",
        "Es motorizada": "No",

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

async function getComputacionAlmacenamientoDiscosyAccesoriosDiscosRigidosySSDs(req, res) {
  const fileName = "Computación_Almacenamiento_Discos_y_Accesorios_Discos_Rígidos_y_SSDs.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.LINE.value_name",

    "attributes.CAPACITY.value_struct.number",
    "attributes.CAPACITY.value_struct.unit",
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

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: item.price,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "",
        Capacidad: item["attributes.CAPACITY.value_struct.number"],
        "Unidad de Capacidad": item["attributes.CAPACITY.value_struct.unit"],
        Linea: item["attributes.LINE.value_name"],
        "Tipo de Almacenamiento": "HDD",
        Ubicacion: "Interno",

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavavajillasOtros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavavajillas_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Tipo de electrodomestico": item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        "Marcas compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        "Modelos compatibles": item["attributes.COMPATIBLE_MODELS.value_name"],

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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosOtros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Tipo de electrodomestico": item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        "Marcas compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        "Modelos compatibles": item["attributes.COMPATIBLE_MODELS.value_name"],

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

async function getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaVentiladoresMotores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Climatización_Repuestos_y_Accesorios_Para_Ventiladores_Motores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        "Formato de venta": item["attributes.SALE_FORMAT.value_name"],
        "Unidades por pack": item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getElectronicaAudioyVideoAccesoriosParaTVBasesElevadoras(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Accesorios_para_TV_Bases_Elevadoras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasMotoresMotoresParaLavarropas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Motores_Mot.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.WASHING_MACHINE_MOTOR_TYPE.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Tipo de Motor": item["attributes.WASHING_MACHINE_MOTOR_TYPE.value_name"],
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasSoportesdeTamborParaLavarropas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Soportes_de.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Numero de Pieza": item["attributes.PART_NUMBER.value_name"] || item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getComputacionNotebooksyAccesoriosRepuestosBaterias(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Baterías.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",

    "attributes.BATTERY_CAPACITY.value_struct.number",
    "attributes.BATTERY_CAPACITY.value_struct.unit",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        Capacidad: item["attributes.BATTERY_CAPACITY.value_struct.number"],
        "Unidad de Capacidad": item["attributes.BATTERY_CAPACITY.value_struct.unit"],

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

async function getComputacionNotebooksyAccesoriosRepuestosOtros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Manijas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosManijas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Manijas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getOtrasCategoriasEsoterismoDijes(req, res) {
  const fileName = "Otras_categorías_Esoterismo_Dijes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.DESIGN.value_name",
    "attributes.MATERIAL.value_name",
    "attributes.LINE.value_name",
    "attributes.FINISH.value_name",
    "attributes.STYLES.value_name",
    "attributes.WITH_GEMSTONE.value_name",
    "attributes.INCLUDES_BOX.value_name",

    "attributes.DIAMETER.value_struct.number",
    "attributes.LENGTH.value_struct.number",
    "attributes.HEIGHT.value_struct.number",

    "attributes.DIAMETER.value_struct.unit",
    "attributes.LENGTH.value_struct.unit",
    "attributes.HEIGHT.value_struct.unit",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"],
        "Unidades por pack": item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        Diseño: item["attributes.DESIGN.value_name"],
        Material: item["attributes.MATERIAL.value_name"],
        Linea: item["attributes.LINE.value_name"],
        Acabado: item["attributes.FINISH.value_name"],

        Diametro: item["attributes.DIAMETER.value_struct.number"],
        "Unidad de diametro": item["attributes.DIAMETER.value_struct.unit"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        "Unidad de largo": item["attributes.LENGTH.value_struct.unit"],
        Altura: item["attributes.HEIGHT.value_struct.number"],
        "Unidad de altura": item["attributes.HEIGHT.value_struct.unit"],

        Estilo: item["attributes.STYLES.value_name"],
        Piedra: item["attributes.WITH_GEMSTONE.value_name"],
        Caja: item["attributes.WITH_GEMSTONE.value_name"],

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

async function getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaVentiladoresHelices(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Climatización_Repuestos_y_Accesorios_Para_Ventiladores_Hélices.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.RECOMMENDED_USE.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        "Nombre comercial": item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"],
        "Unidades por pack": item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Uso recomendado": item["attributes.RECOMMENDED_USE.value_name"],


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

async function getComputacionNotebooksyAccesoriosRepuestosPlacasPlacasdeEncendido(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Placas_Placas_de_Encendido.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.DEVICE_PART_NUMBER.value_name",
    "attributes.WITH_CABLE.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Numero de Pieza": item["attributes.DEVICE_PART_NUMBER.value_name"] || item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        Cable: item["attributes.WITH_CABLE.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasAgitadores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Agitadores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        "Nombre Comercial": item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Numero de Pieza": item["attributes.PART_NUMBER.value_name"] || item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosTermostatos(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Termostatos.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.PART_NUMBER.value_name",
    "attributes.PRODUCT_TYPE.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Numero de pieza": item["attributes.PART_NUMBER.value_name"] || item["attributes.MODEL.value_name"],
        "Tipo de producto": item["attributes.PRODUCT_TYPE.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasAmortiguadores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Amortiguado.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"] || "Unidad",
        "Unidades por Pack": item["attributes.UNITS_PER_PACK.value_name"] || 1,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getComputacionCablesyHubsUSBCablesCablesPower(req, res) {
  const fileName = "Computación_Cables_y_Hubs_USB_Cables_Cables_Power.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.PINS_NUMBER.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        Voltaje: "220V",
        "Cantidad de Pines": item["attributes.PINS_NUMBER.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasElectrovalvulas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Electroválv.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        Voltaje: "220V",
        "Cantidad de Pines": item["attributes.PINS_NUMBER.value_name"],

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

async function getHerramientasHerramientasParaJardinRepuestosOtros(req, res) {
  const fileName = "Herramientas_Herramientas_para_Jardín_Repuestos_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_TOOLS.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Herramientas compatibles": item["attributes.COMPATIBLE_TOOLS.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasInterruptoresyPresostatosPresostatos(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Interruptor.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_TOOLS.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Herramientas compatibles": item["attributes.COMPATIBLE_TOOLS.value_name"],

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

async function getLibrosRevistasyComicsRevistas(req, res) {
  const fileName = "Libros,_Revistas_y_Comics_Revistas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.MAGAZINE_NAME.value_name",
    "attributes.PUBLISHER.value_name",
    "attributes.MODEL.value_name",
    "attributes.FORMAT.value_name",
    "attributes.GENRE.value_name",
    "attributes.ORIGIN.value_name",
    "attributes.EDITION_NUMBER.value_name",
    "attributes.PUBLICATION_MONTH.value_name",
    "attributes.PUBLICATION_YEAR.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Nombre: item["attributes.MAGAZINE_NAME.value_name"],
        Editorial: item["attributes.PUBLISHER.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        Formato: item["attributes.FORMAT.value_name"],
        Genero: item["attributes.GENRE.value_name"],
        Origen: item["attributes.ORIGIN.value_name"],
        Marca: item["attributes.BRAND.value_name"],
        "Numero de la edicion": item["attributes.EDITION_NUMBER.value_name"],
        Idioma: "Español",
        "Año de publicacion": item["attributes.PUBLICATION_YEAR.value_name"],
        "Mes de publicacion": item["attributes.PUBLICATION_MONTH.value_name"],


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

async function getElectronicaAudioyVideoAccesoriosParaAudioyVideoOtros(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Accesorios_para_Audio_y_Video_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getElectronicaAudioyVideoComponentesElectronicosInversoresdeCorriente(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Inversores_de_Corriente.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],

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

async function getComputacionComponentesdePCRefrigeracionCoolersyVentiladores(req, res) {
  const fileName = "Computación_Componentes_de_PC_Refrigeración_Coolers_y_Ventiladores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.PRODUCT_TYPE.value_name",
    "attributes.LINE.value_name",
    "attributes.REFRIGERATION_TYPE.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"], 
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        "Formato de venta": item["attributes.SALE_FORMAT.value_name"],
        "Unidades por pack": item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Tipo de Producto": item["attributes.PRODUCT_TYPE.value_name"],
        Linea: item["attributes.LINE.value_name"],
        "Modelo Alfanumerico": item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Tipo de refrigeracion": item["attributes.REFRIGERATION_TYPE.value_name"],

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

async function getComputacionNotebooksyAccesoriosRepuestosPlacasPlacasdeAudio(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Placas_Placas_de_Audio.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.AUDIO_BOARD_TYPE.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Tipo de placa": item["attributes.AUDIO_BOARD_TYPE.value_name"],

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

async function getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosBisagras(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Repuestos_y_Accesorios_Para_Cocinas_y_Hornos_Bisagras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Tipo de Electrodomestico": item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        "Marcas Compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        "Modelos Compatibles": item["attributes.COMPATIBLE_MODELS.value_name"] || item["attributes.MODEL.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasBombas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Bombas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.GTIN.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        "Codigo universal": item["attributes.GTIN.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],


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

async function getElectronicaAudioyVideoComponentesElectronicosConectores(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Conectores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.GTIN.value_name",
    "attributes.CONNECTOR_TYPE.value_name",
    "attributes.CONNECTOR_GENDER.value_name",
    "attributes.COATING_MATERIAL.value_name",
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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        "Codigo universal": item["attributes.GTIN.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        "Tipo de Conector": item["attributes.CONNECTOR_TYPE.value_name"],
        "Genero de Conector": item["attributes.CONNECTOR_GENDER.value_name"],
        "Material Revestimiento": item["attributes.COATING_MATERIAL.value_name"],
        

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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosBisagras(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Bisagras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.MATERIAL.value_name",
    "attributes.FINISH.value_name",

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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        "Codigo universal": item["attributes.GTIN.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        Material: item["attributes.MATERIAL.value_name"],
        Acabado: item["attributes.FINISH.value_name"],
        

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

async function getElectronicaAudioyVideoComponentesElectronicosSemiconductoresOtros(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Semiconductores_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Marcas Compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        

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

async function getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaAiresAcondicionadosControl(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Climatización_Repuestos_y_Accesorios_Para_Aires_Acondicionados_Control.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item ["attributes.BRAND.value_name"],
        

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasCorreas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Correas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",

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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"],
        "Unidades por Pack": item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item ["attributes.BRAND.value_name"],
        

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

async function getComputacionComponentesdePCFuentesdeAlimentacionCablesdeAlimentacion(req, res) {
  const fileName = "Computación_Componentes_de_PC_Fuentes_de_Alimentación_Cables_de_Alimentación.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.PINS_NUMBER.value_name",
    "attributes.CONNECTOR_TYPE.value_name",
    "attributes.USE_TYPE.value_name",

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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item ["attributes.BRAND.value_name"],
        "Cantidad de Pines": item["attributes.PINS_NUMBER.value_name"],
        "Tipo de Conectores": item["attributes.CONNECTOR_TYPE.value_name"],
        "Tipo de Uso": item["attributes.USE_TYPE.value_name"],
        

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

async function getComputacionNotebooksyAccesoriosRepuestosParlantes(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Parlantes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",


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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"],
        "Unidades por pack": item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item ["attributes.BRAND.value_name"],
        

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

async function getElectronicaAudioyVideoComponentesElectronicosSemiconductoresBobinas(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Semiconductores_Bobinas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.RADIAL_INDUCTOR_TYPE.value_name",

    "attributes.INDUCTOR_VOLTAGE.value_struct.number",
    "attributes.RADIAL_INDUCTOR_RESISTANCE.value_struct.number",
    "attributes.DIAMETER.value_struct.number",
    "attributes.THICKNESS.value_struct.number",

    "attributes.INDUCTOR_VOLTAGE.value_struct.unit",
    "attributes.RADIAL_INDUCTOR_RESISTANCE.value_struct.unit",
    "attributes.DIAMETER.value_struct.unit",
    "attributes.THICKNESS.value_struct.unit",


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

      const precioActualizado = item.price * 0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        "Formato de Venta": item["attributes.SALE_FORMAT.value_name"],
        "Unidades por pack": item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item ["attributes.BRAND.value_name"],
        "Tipo de Inductor Radial": item["attributes.RADIAL_INDUCTOR_TYPE.value_name"],
        "Voltaje": item["attributes.INDUCTOR_VOLTAGE.value_struct.number"],
        "Unidad Voltaje": item["attributes.INDUCTOR_VOLTAGE.value_struct.unit"],
        "Resistencia": item["attributes.RADIAL_INDUCTOR_RESISTANCE.value_struct.number"],
        "Unidad Resistencia": item["attributes.RADIAL_INDUCTOR_RESISTANCE.value_struct.unit"],
        "Diametro": item["attributes.DIAMETER.value_struct.number"],
        "Unidad Diametro": item["attributes.DIAMETER.value_struct.unit"],
        "Espesor": item["attributes.THICKNESS.value_struct.number"],
        "Unidad Espesor": item["attributes.THICKNESS.value_struct.unit"],
        

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

async function getElectrodomesticosyAiresAcArtefactosdeCuidadoPersonalRepuestosyAccesorios(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Artefactos_de_Cuidado_Personal_Repuestos_y_Accesorios.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Tipo de electrodomesticos": item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        "Marcas Compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"],
        "Modelos Compatibles": item["attributes.COMPATIBLE_MODELS.value_name"],
        

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

async function getComputacionNotebooksyAccesoriosRepuestosCarcasas(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Carcasas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.PART_NUMBER.value_name",
    "attributes.LAPTOP_HOUSING_TYPE.value_name",
    "attributes.INCLUDES_HINGES.value_name",
    "attributes.MATERIAL.value_name",
    "attributes.WITH_KEYBOARD.value_name",


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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Genérico",
        "Numero de Pieza": item["attributes.PART_NUMBER.value_name"],
        "Tipo de carcasa":item["attributes.LAPTOP_HOUSING_TYPE.value_name"],
        Bisagras: item["attributes.INCLUDES_HINGES.value_name"],
        Material: item["attributes.MATERIAL.value_name"],
        Teclado: item["attributes.WITH_KEYBOARD.value_name"],
        

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

async function getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaVentiladoresBasesparaVentiladoresdePie(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Climatización_Repuestos_y_Accesorios_Para_Ventiladores_Bases_para_Vent.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"] || "Genérico",

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

async function getElectronicaAudioyVideoAudioAudioPortatilyAccesoriosOtros(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Audio_Audio_Portátil_y_Accesorios_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.POWER_SUPPLY_TYPES.value_name",
    "attributes.INCLUDES_CELL_BATTERIES.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Marcas Compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        "Tipos de Alimentacion:": item["attributes.POWER_SUPPLY_TYPES.value_name"],
        Pilas: item["attributes.INCLUDES_CELL_BATTERIES.value_name"],

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

async function getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaMicroondasOtros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Repuestos_y_Accesorios_Para_Microondas_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        "Tipo de electrodomesticos": item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        "Marcas Compatibles": item["attributes.COMPATIBLE_BRANDS.value_name"],
        "Modelos Compatibles": item["attributes.COMPATIBLE_MODELS.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasCajadeEngranajes(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Caja_de_Eng.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.TEETH_NUMBER.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Dientes: item["attributes.TEETH_NUMBER.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavavajillasCanastos(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavavajillas_Canastos.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        ElectrodomesticosCompatibles: item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        MarcasCompatibles: item["attributes.COMPATIBLE_BRANDS.value_name"],
        ModelosCompatibles: item["attributes.COMPATIBLE_MODELS.value_name"],

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

async function getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaRepuestosyAccesoriosParaLicuadorasMotores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Pequeños_Electrodomésticos_Para_Cocina_Repuestos_y_Accesorios_Para_Lic.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],


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

async function getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaMicroondasPlaquetas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Repuestos_y_Accesorios_Para_Microondas_Plaquetas.json";
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoElectrodomestico: item["attributes.APPLIANCE_TYPE.value_name"],
        TipoAlimentacion: item["attributes.POWER_SUPPLY_TYPE.value_name"],


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

async function getComputacionNotebooksyAccesoriosRepuestosPantallas(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Pantallas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],


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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosResistencias(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Resistencias.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.DEVICE_PART_NUMBER.value_name",
    "attributes.MATERIAL.value_name",
    "attributes.RECOMMENDED_APPLIANCE_TYPE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        NumeroPieza: item["attributes.DEVICE_PART_NUMBER.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        Material: item["attributes.MATERIAL.value_name"],
        TipoElectrodomestico: item["attributes.RECOMMENDED_APPLIANCE_TYPE.value_name"],


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

async function getElectrodomesticosyAiresAcDispensadoresyPurificadoresRepuestosyAccesoriosOtros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Dispensadores_y_Purificadores_Repuestos_y_Accesorios_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        ElectrodomesticosCompatibles: item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        MarcasCompatibles: item["attributes.COMPATIBLE_BRANDS.value_name"],
        ModelosCompatibles: item["attributes.COMPATIBLE_MODELS.value_name"],


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

async function getElectronicaAudioyVideoComponentesElectronicosDisplaysLCD(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Displays_LCD.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.DISPLAY_SIZE.value_struct.number",
    "attributes.DISPLAY_SIZE.value_struct.unit",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TamanoPantalla: item["attributes.DISPLAY_SIZE.value_struct.number"],
        UnidadTamano: item["attributes.DISPLAY_SIZE.value_struct.unit"],


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

async function getElectronicaAudioyVideoAudioMinicomponentes(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Audio_Minicomponentes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoAlimentacion: item["attributes.POWER_SUPPLY_TYPE.value_name"],


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

async function getIndustriasyOficinasHerramientasIndustrialesRepuestosBotonerasdeParoyArranque(req, res) {
  const fileName = "Industrias_y_Oficinas_Herramientas_Industriales_Repuestos_Botoneras_de_Paro_y_Arranque.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.MODEL.value_name",
    "attributes.VOLTAGE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Voltaje: item["attributes.VOLTAGE.value_name"],


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

async function getComputacionComponentesdePCSintonizadorasdeTV(req, res) {
  const fileName = "Computación_Componentes_de_PC_Sintonizadoras_de_TV.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.TV_TUNER_FORM_FACTOR.value_name",
    "attributes.TV_TUNER_TYPE.value_name",
    "attributes.TV_TUNER_INTERFACE.value_name",
    "attributes.VIDEO_INPUT.value_name",
    "attributes.VIDEO_OUTPUT.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Ubicacion: item["attributes.TV_TUNER_FORM_FACTOR.value_name"],
        Tipo: item["attributes.TV_TUNER_TYPE.value_name"],
        Interfaz: item["attributes.TV_TUNER_INTERFACE.value_name"],
        EntradadeVideo: item["attributes.VIDEO_INPUT.value_name"],
        SalidadeVideo: item["attributes.VIDEO_OUTPUT.value_name"],


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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosTapas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Tapas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasProgramador(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Programador.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],

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

async function getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaAiresAcondicionadosPlaquetasparaAiresAc(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Climatización_Repuestos_y_Accesorios_Para_Aires_Acondicionados_Plaquet.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.APPLIANCE_TYPE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoElectrodomestico: item["attributes.APPLIANCE_TYPE.value_name"],

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

async function getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosOtros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Climatización_Repuestos_y_Accesorios_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoElectrodomestico: item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        MarcasCompatibles: item["attributes.COMPATIBLE_BRANDS.value_name"],
        ModelosCompatibles: item["attributes.COMPATIBLE_MODELS.value_name"],

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

async function getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCampanasMotores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Repuestos_y_Accesorios_Para_Campanas_Motores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoElectrodomestico: item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        MarcasCompatibles: item["attributes.COMPATIBLE_BRANDS.value_name"],
        ModelosCompatibles: item["attributes.COMPATIBLE_MODELS.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasFuelles(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Fuelles.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],

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

async function getElectronicaAudioyVideoAudioAudioPortatilyAccesoriosAccesoriosParlantesPortatiles(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Audio_Audio_Portátil_y_Accesorios_Accesorios_Parlantes_Portátiles.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.MAIN_COLOR.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        ColorPrincipal: item["attributes.MAIN_COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        No: "No",

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

async function getElectronicaAudioyVideoCablesCablesdeAudioyVideo(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Cables_Cables_de_Audio_y_Video.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.CABLE_AND_ADAPTER_TYPE.value_name",
    "attributes.CABLE_LENGTH.value_struct.number",
    "attributes.CABLE_LENGTH.value_struct.unit",
    "attributes.PRODUCT_TYPE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        TipoCableyAdaptador: item["attributes.CABLE_AND_ADAPTER_TYPE.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        Color2: item["attributes.COLOR.value_name"],
        LargoCable: item["attributes.CABLE_LENGTH.value_struct.number"],
        UnidadLargoCable: item["attributes.CABLE_LENGTH.value_struct.unit"],
        TipoProducto: item["attributes.PRODUCT_TYPE.value_name"],

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

async function getElectronicaAudioyVideoComponentesElectronicosDisipadoresTermicosPlaquetasDisipadoras(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Disipadores_Térmicos_Plaquetas_Disipadoras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.CABLE_AND_ADAPTER_TYPE.value_name",
    "attributes.CABLE_LENGTH.value_struct.number",
    "attributes.CABLE_LENGTH.value_struct.unit",
    "attributes.PRODUCT_TYPE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],

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

async function getHogarMueblesyJardinMueblesparaelHogarAccesoriosyRepuestosBurletes(req, res) {
  const fileName = "Hogar,_Muebles_y_Jardín_Muebles_para_el_Hogar_Accesorios_y_Repuestos_Burletes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.MATERIAL.value_name",
    "attributes.PATTERN_NAME.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        NombreComercialColor: item["attributes.COLOR.value_name"],
        NombreDiseno: item["attributes.PATTERN_NAME.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Material: item["attributes.MATERIAL.value_name"],

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

async function getComputacionMonitoresyAccesoriosFuentes(req, res) {
  const fileName = "Computación_Monitores_y_Accesorios_Fuentes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasFiltrosparaLavarropas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Filtros_par.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.MATERIALS.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.COLOR.value_name"

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Materiales: item["attributes.MATERIALS.value_name"],
        

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

async function getComputacionNotebooksyAccesoriosRepuestosTeclados(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Teclados.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.LINE.value_name",
    "attributes.LANGUAGE.value_name"

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Idioma: item["attributes.LANGUAGE.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Linea: item["attributes.LINE.value_name"],
        

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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosMotores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Motores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectronicaAudioyVideoAudioParlantesyBafles(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Audio_Parlantes_y_Bafles.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        No: "No",
        

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavavajillasPlaquetas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavavajillas_Plaquetas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.COMPATIBLE_MODELS.value_name"] || item["attributes.BRAND.value_name"],
        TipoElectrodomestico: item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        

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

async function getElectronicaAudioyVideoComponentesElectronicosSemiconductoresChipsLeds(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Semiconductores_Chips_Leds.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.LIGHT_COLOR.value_name",
    "attributes.VOLTAGE.value_name",
    "attributes.POWER.value_struct.number",
    "attributes.POWER.value_struct.unit",
    "attributes.HEIGHT.value_struct.number",
    "attributes.HEIGHT.value_struct.unit",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
    "attributes.WIDTH.value_struct.number",
    "attributes.WIDTH.value_struct.unit",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        ColorLuz: item["attributes.LIGHT_COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        Voltaje: item["attributes.VOLTAGE.value_name"],
        Potencia: item["attributes.POWER.value_struct.number"],
        UnidadPotencia: item["attributes.POWER.value_struct.unit"],
        Altura: item["attributes.HEIGHT.value_struct.number"],
        UnidadAltura: item["attributes.HEIGHT.value_struct.unit"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        UnidadLargo: item["attributes.LENGTH.value_struct.unit"],
        Ancho: item["attributes.WIDTH.value_struct.number"],
        UnidadAncho: item["attributes.WIDTH.value_struct.unit"],
        

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

async function getElectronicaAudioyVideoOtros(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        

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

async function getElectronicaAudioyVideoComponentesElectronicosSemiconductoresReles(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Semiconductores_Relés.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.CONTACTOR_AND_RELAY_TYPE.value_name",
    "attributes.VOLTAGE.value_name"

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        TipoProducto: item["attributes.CONTACTOR_AND_RELAY_TYPE.value_name"],
        Voltaje: item["attributes.VOLTAGE.value_name"],
        
        

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

async function getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaPreparaciondeBebidasLicuadoras(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Pequeños_Electrodomésticos_Para_Cocina_Preparación_de_Bebidas_Licuador.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.POWER_SUPPLY_TYPE.value_name"

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        TipoAlimentacion: item["attributes.POWER_SUPPLY_TYPE.value_name"],
        
        

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

async function getHerramientasHerramientasElectricasLimpiezaHidrolavadoras(req, res) {
  const fileName = "Herramientas_Herramientas_Eléctricas_Limpieza_Hidrolavadoras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.FREQUENCY.value_name"

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Frecuencia: item["attributes.FREQUENCY.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        No: "No",
        
        

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

async function getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosVidriosparaPuertas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Repuestos_y_Accesorios_Para_Cocinas_y_Hornos_Vidrios_para_Puer.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        ComercialColor: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"] || item["attributes.BRAND.value_name"],
        
        

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

async function getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosQuemadores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Repuestos_y_Accesorios_Para_Cocinas_y_Hornos_Quemadores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",

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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosBurletes(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Burletes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
    "attributes.WIDTH.value_struct.number",
    "attributes.WIDTH.value_struct.unit",
    "attributes.WITH_MAGNET.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        ComercialColor: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        UnidadLargo: item["attributes.LENGTH.value_struct.unit"],
        Ancho: item["attributes.WIDTH.value_struct.number"],
        UnidadAncho: item["attributes.WIDTH.value_struct.unit"],
        Iman: item["attributes.WITH_MAGNET.value_name"],

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

async function getHerramientasAccesoriosparaHerramientasInducidos(req, res) {
  const fileName = "Herramientas_Accesorios_para_Herramientas_Inducidos.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.RECOMMENDED_ELECTRIC_TOOL.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        HerramientaRecomendada: item["attributes.RECOMMENDED_ELECTRIC_TOOL.value_name"],
        Modelo: item["attributes.MODEL.value_name"],

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

async function getHogarMueblesyJardinCuidadodelHogaryLavanderiaDesechablesBolsasparaAspiradoras(req, res) {
  const fileName = "Hogar,_Muebles_y_Jardín_Cuidado_del_Hogar_y_Lavandería_Desechables_Bolsas_para_Aspiradoras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.UNITS_PER_PACKAGE.value_name",
    "attributes.INCLUDES_FILTER.value_name",
    "attributes.IS_DISPOSABLE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UindadesporPack: item["attributes.UNITS_PER_PACK.value_name"],
        UnidadesporEnvase: item["attributes.UNITS_PER_PACKAGE.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Filtro: item["attributes.INCLUDES_FILTER.value_name"],
        Descartable: item["attributes.IS_DISPOSABLE.value_name"],

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

async function getComputacionMonitoresyAccesoriosBasesElevadoras(req, res) {
  const fileName = "Computación_Monitores_y_Accesorios_Bases_Elevadoras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],

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

async function getElectrodomesticosyAiresAcClimatizacionVentiladores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Climatización_Ventiladores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.DIAMETER.value_name",
    "attributes.FREQUENCY.value_name",
    "attributes.STRUCTURE_COLOR.value_name",
    "attributes.BLADES_COLOR.value_name",
    "attributes.BLADES_MATERIAL.value_name",
    "attributes.BLADES_NUMBER.value_name",
    "attributes.FAN_TYPE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Diametro: item["attributes.DIAMETER.value_name"],
        Frecuencia: item["attributes.FREQUENCY.value_name"],
        Color: item["attributes.STRUCTURE_COLOR.value_name"],
        ColorAspas: item["attributes.BLADES_COLOR.value_name"],
        MaterialAspas: item["attributes.BLADES_MATERIAL.value_name"],
        CantidadAspas: item["attributes.BLADES_NUMBER.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoVentilador: item["attributes.FAN_TYPE.value_name"],

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

async function getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaCalefonesyTermotanquesTermocuplas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Climatización_Repuestos_y_Accesorios_Para_Calefones_y_Termotanques_Ter.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        TipoElectrodomesticos: item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        MarcasCompatibles: item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        Modelo: item["attributes.COMPATIBLE_MODELS.value_name"],

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

async function getComputacionComponentesdePCOtros(req, res) {
  const fileName = "Computación_Componentes_de_PC_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],

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

async function getElectronicaAudioyVideoComponentesElectronicosPlacasdeMicrocontroladores(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Placas_de_Microcontroladores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],

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

async function getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaRepuestosyAccesoriosOtros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Pequeños_Electrodomésticos_Para_Cocina_Repuestos_y_Accesorios_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        TipoElectrodomesticos: item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        Marcas: item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        Modelo: item["attributes.COMPATIBLE_MODELS.value_name"],

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

async function getComputacionNotebooksyAccesoriosRepuestosInverters(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Inverters.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavavajillasResistencias(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavavajillas_Resistencias.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name",
    "attributes.COMPATIBLE_MODELS.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        TipoElectrodomesticos: item["attributes.COMPATIBLE_HOME_APPLIANCES_TYPES.value_name"],
        Marcas: item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        Modelo: item["attributes.COMPATIBLE_MODELS.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoLavavajillas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Lavavajillas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.WIDTH.value_struct.number",
    "attributes.WIDTH.value_struct.unit",
    "attributes.DEPTH.value_struct.number",
    "attributes.DEPTH.value_struct.unit",
    "attributes.HEIGHT.value_struct.number",
    "attributes.HEIGHT.value_struct.unit",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Ancho: item["attributes.WIDTH.value_struct.number"],
        UnidadAncho: item["attributes.WIDTH.value_struct.unit"],
        Profundidad: item["attributes.DEPTH.value_struct.number"],
        UnidadProfundidad: item["attributes.DEPTH.value_struct.unit"],
        Altura: item["attributes.HEIGHT.value_struct.number"],
        UnidadAltura: item["attributes.HEIGHT.value_struct.unit"],

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

async function getElectronicaAudioyVideoAudioSintonizadores(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Audio_Sintonizadores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoAlimentacion: item["attributes.MODEL.value_name"],

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

async function getElectrodomesticosyAiresAcLavadoSecarropas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Secarropas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.WEIGHT_CAPACITY.value_struct.number",
    "attributes.WEIGHT_CAPACITY.value_struct.unit",
    "attributes.POWER_SUPPLY_TYPES.value_name",
    "attributes.LOADING_TYPE.value_name",
    "attributes.DRYING_TYPES.value_name",
    "attributes.DETAILED_MODEL.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Capacidad: item["attributes.WEIGHT_CAPACITY.value_struct.number"],
        UnidadCapacidad: item["attributes.WEIGHT_CAPACITY.value_struct.unit"],
        TipoAlimentacion: item["attributes.POWER_SUPPLY_TYPES.value_name"],
        Carga: item["attributes.LOADING_TYPE.value_name"],
        TipoSecado: item["attributes.DRYING_TYPES.value_name"],
        ModeloDetallado: item["attributes.DETAILED_MODEL.value_name"],

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

async function getElectronicaAudioyVideoComponentesElectronicosPasivosOtros(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Pasivos_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        MarcasCompatibles: item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],

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

async function getConstruccionAberturasPuertas(req, res) {
  const fileName = "Construcción_Aberturas_Puertas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.WIDTH.value_struct.number",
    "attributes.WIDTH.value_struct.unit",
    "attributes.HEIGHT.value_struct.number",
    "attributes.HEIGHT.value_struct.unit",
    "attributes.MATERIAL.value_name",
    "attributes.DOOR_TYPE.value_name",
    "attributes.IS_SUITABLE_FOR_INTERIOR.value_name",
    "attributes.IS_SUITABLE_FOR_EXTERIOR.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Ancho: item["attributes.WIDTH.value_struct.number"],
        UnidadAncho: item["attributes.WIDTH.value_struct.unit"],
        Altura: item["attributes.HEIGHT.value_struct.number"],
        UnidadAltura: item["attributes.HEIGHT.value_struct.unit"],
        Material: item["attributes.MATERIAL.value_name"],
        TipoPuerta: item["attributes.DOOR_TYPE.value_name"],
        AptaInterior: item["attributes.IS_SUITABLE_FOR_INTERIOR.value_name"],
        AptaExterior: item["attributes.IS_SUITABLE_FOR_EXTERIOR.value_name"],

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

async function getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCampanasFiltros(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Repuestos_y_Accesorios_Para_Campanas_Filtros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.MODEL.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectronicaAudioyVideoAccesoriosparaAudioyVideoAdaptadores(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Accesorios_para_Audio_y_Video_Adaptadores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.CABLE_AND_ADAPTER_TYPE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        TipoCable: item["attributes.CABLE_AND_ADAPTER_TYPE.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectronicaAudioyVideoAccesoriosparaAudioyVideoConversoresdeTV(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Accesorios_para_Audio_y_Video_Conversores_de_TV.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getConstruccionElectricidadInterruptoresyEnchufesInterruptoresBotonesIndustriales(req, res) {
  const fileName = "Construcción_Electricidad_Interruptores_y_Enchufes_Interruptores_Botones_Industriales.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectronicaAudioyVideoAudioAudioPortatilyAccesoriosAccesoriosSoportes(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Audio_Audio_Portátil_y_Accesorios_Accesorios_Soportes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        MarcasCompatibles: item["attributes.COMPATIBLE_BRANDS.value_name"],
        

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

async function getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosResistencias(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Repuestos_y_Accesorios_Para_Cocinas_y_Hornos_Resistencias.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasRetenesparaLavarropas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Retenes_par.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.SEAL_TYPE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoReten: item["attributes.SEAL_TYPE.value_name"],
        

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

async function getElectrodomesticosyAiresAcLavadoLavarropasyLavasecarropas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Lavarropas_y_Lavasecarropas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.WASHING_MACHINE_TYPE.value_name",
    "attributes.LOADING_TYPE.value_name",
    "attributes.WASHING_MACHINE_CAPACITY.value_struct.number",
    "attributes.WASHING_MACHINE_CAPACITY.value_struct.unit",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoAlimentacion: item["attributes.SEAL_TYPE.value_name"],
        TipoLavarropas: item["attributes.WASHING_MACHINE_TYPE.value_name"],
        TipoCarga: item["attributes.LOADING_TYPE.value_name"],
        CapacidadLavarropas: item["attributes.WASHING_MACHINE_CAPACITY.value_struct.number"],
        UnidadCapacidadLavarropas: item["attributes.WASHING_MACHINE_CAPACITY.value_struct.unit"],
        

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

async function getConstruccionElectricidadInterruptoresyEnchufesInterruptoresInterruptoresElectricos(req, res) {
  const fileName = "Salud_y_Equipamiento_Médico_Equipamiento_Médico_Equipamiento_Odontológico_Turbinas_Odontológicas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getSaludyEquipamientoMedicoEquipamientoMedicoEquipamientoOdontologicoTurbinasOdontologicas(req, res) {
  const fileName = "Salud_y_Equipamiento_Médico_Equipamiento_Médico_Equipamiento_Odontológico_Turbinas_Odontológicas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getHerramientasAccesoriosparaHerramientasEscobillasdeCarbon(req, res) {
  const fileName = "Herramientas_Accesorios_para_Herramientas_Escobillas_de_Carbón.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectronicaAudioyVideoComponentesElectronicosLectoresLaser(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Lectores_Láser.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.PART_NUMBER.value_name",
    "attributes.WITH_MECHANISM.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        NumeroPieza: item["attributes.PART_NUMBER.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        Mecanismo: item["attributes.WITH_MECHANISM.value_name"],
        

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

async function getComputacionOtros(req, res) {
  const fileName = "Computación_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectronicaAudioyVideoControlesRemotosOtros(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Controles_Remotos_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getHerramientasAccesoriosparaHerramientasOtros(req, res) {
  const fileName = "Herramientas_Accesorios_para_Herramientas_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosInterruptores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Interruptores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getHogarMueblesyJardinIluminacionparaelHogarTirasdeLED(req, res) {
  const fileName = "Hogar,_Muebles_y_Jardín_Iluminación_para_el_Hogar_Tiras_de_LED.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        UnidadLargo: item["attributes.LENGTH.value_struct.unit"],
        

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

async function getHogarMueblesyJardinJardinyAireLibreJardineriayAccesoriosHerramientasparaJardinRepuestosCarburadores(req, res) {
  const fileName = "Hogar,_Muebles_y_Jardín_Jardin_y_Aire_Libre_Jardinería_y_Accesorios_Herramientas_para_Jardín_Repuest.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosTapasparaHornallas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Repuestos_y_Accesorios_Para_Cocinas_y_Hornos_Tapas_para_Hornal.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        

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

async function getElectrodomesticosyAiresAcPequenosElectrodomesticosParaHogarRepuestosyAccesoriosParaAspiradorasMotores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Pequeños_Electrodomésticos_Para_Hogar_Repuestos_y_Accesorios_Para_Aspi.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.POWER_SUPPLY_TYPE.value_name",
    "attributes.HEIGHT.value_struct.number",
    "attributes.HEIGHT.value_struct.unit",
    "attributes.DIAMETER.value_struct.number",
    "attributes.DIAMETER.value_struct.unit",
    "attributes.POWER.value_struct.number",
    "attributes.POWER.value_struct.unit",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoAlimentacion: item["attributes.POWER_SUPPLY_TYPE.value_name"],
        Altura: item["attributes.HEIGHT.value_struct.number"],
        UnidadAltura: item["attributes.HEIGHT.value_struct.unit"],
        Diametro: item["attributes.DIAMETER.value_struct.number"],
        UnidadDiametro: item["attributes.DIAMETER.value_struct.unit"],
        Potencia: item["attributes.POWER.value_struct.number"],
        UnidadPotencia: item["attributes.POWER.value_struct.unit"],
        

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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosSensores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Sensores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SENSOR_TYPE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoSensor: item["attributes.SENSOR_TYPE.value_name"],
        

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

async function getJuegosyJuguetesOtros(req, res) {
  const fileName = "Juegos_y_Juguetes_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.MIN_RECOMMENDED_AGE.value_struct.number",
    "attributes.MIN_RECOMMENDED_AGE.value_struct.unit",
    "attributes.TOY_SAFETY_CERTIFICATE_NUMBER.value_name",
    "attributes.RECOMMENDED_AGE_GROUP.value_name",
    "attributes.MAX_RECOMMENDED_AGE.value_struct.number",
    "attributes.MAX_RECOMMENDED_AGE.value_struct.unit",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        EdadMinima: item["attributes.MIN_RECOMMENDED_AGE.value_struct.number"],
        UEdadMinima: item["attributes.MIN_RECOMMENDED_AGE.value_struct.unit"],
        Certificado: item["attributes.TOY_SAFETY_CERTIFICATE_NUMBER.value_name"],
        EdadRecomendada: item["attributes.RECOMMENDED_AGE_GROUP.value_name"],
        EdadMaxima: item["attributes.MAX_RECOMMENDED_AGE.value_struct.number"],
        UEdadMaxima: item["attributes.MAX_RECOMMENDED_AGE.value_struct.unit"],
        

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

async function getBebesyJuguetesparaBebesJuegosdeArrastre(req, res) {
  const fileName = "Bebés_Juegos_y_Juguetes_para_Bebés_Juegos_de_Arrastre.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.TOY_SAFETY_CERTIFICATE_NUMBER.value_name",
    "attributes.CHARACTER.value_name",
    "attributes.MATERIAL.value_name",
    "attributes.TOY_SHAPE.value_name",
    "attributes.MIN_RECOMMENDED_AGE.value_struct.number",
    "attributes.MIN_RECOMMENDED_AGE.value_struct.unit",
    "attributes.HEIGHT.value_struct.number",
    "attributes.HEIGHT.value_struct.unit",
    "attributes.WIDTH.value_struct.number",
    "attributes.WIDTH.value_struct.unit",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
    "attributes.WEIGHT.value_struct.number",
    "attributes.WEIGHT.value_struct.unit",
    "attributes.WITH_STRING.value_name",
    "attributes.WITH_SOUND.value_name",
    "attributes.INCLUDES_CELL_BATTERIES.value_name",
    "attributes.CELL_BATTERIES_TYPE.value_name",
    "attributes.RECOMMENDED_AGE_GROUP.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Certificado: item["attributes.TOY_SAFETY_CERTIFICATE_NUMBER.value_name"],
        Personaje: item["attributes.CHARACTER.value_name"],
        Material: item["attributes.MATERIAL.value_name"],
        Forma: item["attributes.TOY_SHAPE.value_name"],
        EdadMinima: item["attributes.MIN_RECOMMENDED_AGE.value_struct.number"],
        UEdadMinima: item["attributes.MIN_RECOMMENDED_AGE.value_struct.unit"],
        Altura: item["attributes.HEIGHT.value_struct.number"],
        UAltura: item["attributes.HEIGHT.value_struct.unit"],
        Ancho: item["attributes.WIDTH.value_struct.number"],
        UAncho: item["attributes.WIDTH.value_struct.unit"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        ULargo: item["attributes.LENGTH.value_struct.unit"],
        Peso: item["attributes.WEIGHT.value_struct.number"],
        UPeso: item["attributes.WEIGHT.value_struct.unit"],
        Cuerda: item["attributes.WITH_STRING.value_name"],
        Sonido: item["attributes.WITH_SOUND.value_name"],
        Pilas: item["attributes.INCLUDES_CELL_BATTERIES.value_name"],
        TipoPilas: item["attributes.CELL_BATTERIES_TYPE.value_name"],
        EdadRecomendada: item["attributes.RECOMMENDED_AGE_GROUP.value_name"],
        

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

async function getLibrosRevistasyComicsOtros(req, res) {
  const fileName = "Libros,_Revistas_y_Comics_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.GTIN.value_name",
    "attributes.PUBLISHER.value_name",
    "attributes.FORMAT.value_name",
    "attributes.LANGUAGE.value_name",

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        ISBN: item["attributes.GTIN.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Editorial: item["attributes.PUBLISHER.value_name"],
        Formato: item["attributes.FORMAT.value_name"],
        Idioma: item["attributes.LANGUAGE.value_name"],
        

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

async function getComputacionComponentesdePCPlacasPlacasUSByFirewire(req, res) {
  const fileName = "Computación_Componentes_de_PC_Placas_Placas_USB_y_Firewire.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.EXPANSION_TYPES.value_name"

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        TipoExpansiones: item["attributes.EXPANSION_TYPES.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        
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

async function getComputacionComponentesdePCPlacasPlacasdeSonido(req, res) {
  const fileName = "Computación_Componentes_de_PC_Placas_Placas_de_Sonido.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SOUND_CARD_TYPE.value_name"

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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoPlaca: item["attributes.SOUND_CARD_TYPE.value_name"],
        
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

async function getComputacionImpresionRepuestosComponentesElectronicosPlacasLogicas(req, res) {
  const fileName = "Computación_Impresión_Repuestos_Componentes_Electrónicos_Placas_Lógicas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        
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

async function getComputacionNotebooksyAccesoriosRepuestosPilasBIOSyCMOS(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Pilas_BIOS_y_CMOS.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        
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

async function getConstruccionElectricidadFusibles(req, res) {
  const fileName = "Construcción_Electricidad_Fusibles.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        
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

async function getConstruccionElectricidadCablesyAccesoriosCablesElectricos(req, res) {
  const fileName = "Construcción_Electricidad_Cables_y_Accesorios_Cables_Eléctricos.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.CABLE_JACKET_COLOR.value_name",
    "attributes.ELECTRIC_CABLE_TYPE.value_name",
    "attributes.SECTION_SIZE.value_struct.number",
    "attributes.SECTION_SIZE.value_struct.unit",
    "attributes.CABLE_LENGTH.value_struct.number",
    "attributes.CABLE_LENGTH.value_struct.unit",
    "attributes.CONDUCTORS_NUMBER.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.CABLE_JACKET_COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        TipoCable: item["attributes.ELECTRIC_CABLE_TYPE.value_name"],
        TamanoSeccion: item["attributes.SECTION_SIZE.value_struct.number"],
        UTamanoSeccion: item["attributes.SECTION_SIZE.value_struct.unit"],
        Largo: item["attributes.CABLE_LENGTH.value_struct.number"],
        ULargo: item["attributes.CABLE_LENGTH.value_struct.unit"],
        Conductores: item["attributes.CONDUCTORS_NUMBER.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        
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

async function getElectrodomesticosyAiresAcCoccionCocinas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Cocinas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.MOUNTING_TYPE.value_name"
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoMontaje: item["attributes.MOUNTING_TYPE.value_name"],
        
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

async function getElectrodomesticosyAiresAcRefrigeracionHeladeras(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Heladeras.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.WITH_FREEZER.value_name",
    "attributes.IS_MINIBAR.value_name",
    "attributes.DEFROST_TYPE.value_name",
    "attributes.TOTAL_CAPACITY.value_struct.number",
    "attributes.TOTAL_CAPACITY.value_struct.unit",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Freezer: item["attributes.WITH_FREEZER.value_name"],
        Minibar: item["attributes.IS_MINIBAR.value_name"],
        Deshielo: item["attributes.DEFROST_TYPE.value_name"],
        Capacidad: item["attributes.TOTAL_CAPACITY.value_struct.number"],
        UCapacidad: item["attributes.TOTAL_CAPACITY.value_struct.unit"],
        
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

async function getComputacionMonitoresyAccesoriosMonitores(req, res) {
  const fileName = "Computación_Monitores_y_Accesorios_Monitores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.DISPLAY_SIZE.value_struct.number",
    "attributes.DISPLAY_SIZE.value_struct.unit",
    "attributes.RESOLUTION_TYPE.value_name",
    "attributes.IS_CURVED.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Tamano: item["attributes.DISPLAY_SIZE.value_struct.number"],
        UTamano: item["attributes.DISPLAY_SIZE.value_struct.unit"],
        TipoResolucion: item["attributes.RESOLUTION_TYPE.value_name"],
        Curvo: item["attributes.IS_CURVED.value_name"],
        Linea: item["attributes.LINE.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasKitsdeRulemanesySellos(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Kits_de_Rul.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosCajones(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Refrigeración_Repuestos_y_Accesorios_Cajones.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        
        
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

async function getElectronicaAudioyVideoPilasyCargadoresTransformadoresyFuentes(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Pilas_y_Cargadores_Transformadores_y_Fuentes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name"
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        MarcasCompatibles: item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaRepuestosyAccesoriosParaProcesadorasyBatidorasMotores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Pequeños_Electrodomésticos_Para_Cocina_Repuestos_y_Accesorios_Para_Pro.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name"
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        MarcasCompatibles: item["attributes.COMPATIBLE_BRANDS.value_name"] || item["attributes.BRAND.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaPreparaciondeBebidasExprimidoresElectricos(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Pequeños_Electrodomésticos_Para_Cocina_Preparación_de_Bebidas_Exprimid.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.FREQUENCY.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Frecuencia: item["attributes.FREQUENCY.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoAlimentacion: item["attributes.POWER_SUPPLY_TYPE.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPatasNiveladoras(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Lavado_Repuestos_y_Accesorios_Para_Lavarropas_y_Secarropas_Patas_Nivel.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.PART_NUMBER.value_name",
    "attributes.SALE_FORMAT.value_name"
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.MODEL.value_name"],
        Marca: "Genérica",
        NumeroPieza: item["attributes.PART_NUMBER.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaRepuestosyAccesoriosParaJugueras(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Pequeños_Electrodomésticos_Para_Cocina_Repuestos_y_Accesorios_Para_Jug.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_BRANDS.value_name"
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Marcas: item["attributes.COMPATIBLE_BRANDS.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaRepuestosyAccesoriosParaCafeterasDepositosdeAgua(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Pequeños_Electrodomésticos_Para_Cocina_Repuestos_y_Accesorios_Para_Caf.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaJarrasElectricas(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Pequeños_Electrodomésticos_Para_Cocina_Jarras_Eléctricas.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name"
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcCoccionAnafes(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Anafes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.POWER_SUPPLY_TYPES.value_name"
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoAlimentacion: item["attributes.POWER_SUPPLY_TYPES.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaVentiladoresCapacitoresparaVentiladores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Climatización_Repuestos_y_Accesorios_Para_Ventiladores_Capacitores_par.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.POWER_SUPPLY_TYPES.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.CAPACITANCES.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        TipoAlimentacion: item["attributes.POWER_SUPPLY_TYPES.value_name"],
        Capacitancias: item["attributes.CAPACITANCES.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        
        
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

async function getHerramientasHerramientasIndustrialesRepuestosPulsadores(req, res) {
  const fileName = "Herramientas_Herramientas_Industriales_Repuestos_Pulsadores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COMPATIBLE_TOOLS.value_name"
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        HerramientasCompatibles: item["attributes.COMPATIBLE_TOOLS.value_name"],
        
        
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

async function getElectrodomesticosyAiresAcCoccionExtractoresyPurificadores(req, res) {
  const fileName = "Electrodomésticos_y_Aires_Ac._Cocción_Extractores_y_Purificadores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.RANGE_HOOD_FUNCTION.value_name",
    "attributes.LINE.value_name",
    "attributes.WIDTH.value_struct.number",
    "attributes.WIDTH.value_struct.unit",
    "attributes.HEIGHT.value_struct.number",
    "attributes.HEIGHT.value_struct.unit",
    "attributes.DEPTH.value_struct.number",
    "attributes.DEPTH.value_struct.unit",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Funcion: item["attributes.RANGE_HOOD_FUNCTION.value_name"],
        Linea: item["attributes.LINE.value_name"],
        Ancho: item["attributes.WIDTH.value_struct.number"],
        UAncho: item["attributes.WIDTH.value_struct.unit"],
        Altura: item["attributes.HEIGHT.value_struct.number"],
        UAltura: item["attributes.HEIGHT.value_struct.unit"],
        Profundidad: item["attributes.DEPTH.value_struct.number"],
        UProfundidad: item["attributes.DEPTH.value_struct.unit"],
        
        
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

async function getHerramientasAccesoriosparaHerramientasPuntasyAdaptadoresMandriles(req, res) {
  const fileName = "Herramientas_Accesorios_para_Herramientas_Puntas_y_Adaptadores_Mandriles.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        
        
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

async function getHerramientasHerramientasparaJardinRepuestosKitsdeRepuestos(req, res) {
  const fileName = "Herramientas_Herramientas_para_Jardín_Repuestos_Kits_de_Repuestos.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.PIECES_NUMBER.value_name",
    "attributes.PIECES_INCLUDED.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        CantidadPiezas: item["attributes.PIECES_NUMBER.value_name"],
        PiezasIncluidas: item["attributes.PIECES_INCLUDED.value_name"],
        
        
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

async function getComputacionNotebooksyAccesoriosRepuestosPlacasMotherboards(req, res) {
  const fileName = "Computación_Notebooks_y_Accesorios_Repuestos_Placas_Motherboards.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.LINE.value_name",
    "attributes.VERSION.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Linea: item["attributes.LINE.value_name"],
        Version: item["attributes.VERSION.value_name"],
        
        
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

async function getElectronicaAudioyVideoComponentesElectronicosSemiconductoresModulosIGBT(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Semiconductores_Módulos_IGBT.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        
        
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

async function getComputacionTabletsyAccesoriosRepuestosCablesFlex(req, res) {
  const fileName = "Computación_Tablets_y_Accesorios_Repuestos_Cables_Flex.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.CELLPHONE_AND_TABLET_FLEX_CABLE_TYPE.value_name",
    "attributes.MANUFACTURER.value_name",
    "attributes.DEVICE_TYPE.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        TipoCable: item["attributes.CELLPHONE_AND_TABLET_FLEX_CABLE_TYPE.value_name"],
        Fabricante: item["attributes.MANUFACTURER.value_name"],
        Modelo: item["attributes.MODEL.value_name"],
        TipoDispositivo: item["attributes.DEVICE_TYPE.value_name"],
        
        
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

async function getComputacionProyectoresyPantallasOtros(req, res) {
  const fileName = "Computación_Proyectores_y_Pantallas_Otros.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
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
    // CREAR EXCEL
    // ========================================
    const workbook = XLSX.utils.book_new();
    const dataForExcel = [];

    results.forEach(item => {
      const pics = Array.isArray(item.pictures) ? item.pictures : [];
      const picturesUrl = pics.join(",");

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        
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

async function getComputacionImpresionInsumosdeImpresionToners(req, res) {
  const fileName = "Computación_Impresión_Insumos_de_Impresión_Tóners.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.INK_COLOR.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.TOTAL_CONTENT_WEIGHT.value_struct.number",
    "attributes.TOTAL_CONTENT_WEIGHT.value_struct.unit",
    "attributes.IS_CHARGED.value_name",
    "attributes.TONER_TYPE.value_name",
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        ColorTinta: item["attributes.INK_COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Peso: item["attributes.TOTAL_CONTENT_WEIGHT.value_struct.number"],
        UPeso: item["attributes.TOTAL_CONTENT_WEIGHT.value_struct.unit"],
        Cargado: item["attributes.IS_CHARGED.value_name"],
        TipoToner: item["attributes.TONER_TYPE.value_name"],
        
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

async function getElectronicaAudioyVideoComponentesElectronicosSemiconductoresOptoacopladores(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Semiconductores_Optoacopladores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.ENCAPSULATION_TYPE.value_name",
    "attributes.ISOLATION_VOLTAGE.value_name",
    "attributes.MAX_OPERATING_VOLTAGE.value_name",
    "attributes.MAX_CURRENT.value_struct.number",
    "attributes.MAX_CURRENT.value_struct.unit",
    "attributes.BANDWIDTH.value_struct.number",
    "attributes.BANDWIDTH.value_struct.unit",
    "attributes.PINS_NUMBER.value_struct.unit",
    "attributes.HEIGHT.value_struct.number",
    "attributes.HEIGHT.value_struct.unit",
    "attributes.WIDTH.value_struct.number",
    "attributes.WIDTH.value_struct.unit",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
    "attributes.WEIGHT.value_struct.number",
    "attributes.WEIGHT.value_struct.unit",
    
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        TipoEncapsulado: item["attributes.ENCAPSULATION_TYPE.value_name"],
        VoltajeAislamiento: item["attributes.ISOLATION_VOLTAGE.value_name"],
        VoltajeMaximo: item["attributes.MAX_OPERATING_VOLTAGE.value_name"],
        CorrienteMaxima: item["attributes.MAX_CURRENT.value_struct.number"],
        UCorrienteMaxima: item["attributes.MAX_CURRENT.value_struct.unit"],
        AnchoBanda: item["attributes.BANDWIDTH.value_struct.number"],
        UAnchoBanda: item["attributes.BANDWIDTH.value_struct.unit"],
        Pines: item["attributes.PINS_NUMBER.value_struct.unit"],
        Altura: item["attributes.HEIGHT.value_struct.number"],
        UAltura: item["attributes.HEIGHT.value_struct.unit"],
        Ancho: item["attributes.WIDTH.value_struct.number"],
        UAncho: item["attributes.WIDTH.value_struct.unit"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        ULargo: item["attributes.LENGTH.value_struct.unit"],
        Peso: item["attributes.WEIGHT.value_struct.number"],
        UPeso: item["attributes.WEIGHT.value_struct.unit"],
        
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

async function getElectronicaAudioyVideoVideoReproductoresdeDVD(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Video_Reproductores_de_DVD.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.LINE.value_name",
    "attributes.COMPATIBLE_DISC_TYPES.value_name",
    "attributes.WITH_HDMI.value_name",
    "attributes.WITH_USB.value_name",
    "attributes.WITH_KARAOKE.value_name",
    
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Linea: item["attributes.LINE.value_name"],
        DiscosCompatibles: item["attributes.COMPATIBLE_DISC_TYPES.value_name"],
        HDMI: item["attributes.WITH_HDMI.value_name"],
        USB: item["attributes.WITH_USB.value_name"],
        Karaoke: item["attributes.WITH_KARAOKE.value_name"],
        
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

async function getElectronicaAudioyVideoComponentesElectronicosPasivosTermistores(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Pasivos_Termistores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
    "attributes.WEIGHT.value_struct.number",
    "attributes.WEIGHT.value_struct.unit",
    
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        ULargo: item["attributes.LENGTH.value_struct.unit"],
        Peso: item["attributes.WEIGHT.value_struct.number"],
        UPeso: item["attributes.WEIGHT.value_struct.unit"],
        
        
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

async function getCelularesyTelefonosHandiesyRadiofrecuenciaAccesoriosFuentes(req, res) {
  const fileName = "Celulares_y_Teléfonos_Handies_y_Radiofrecuencia_Accesorios_Fuentes.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.IS_SWITCHED.value_name"
    
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Conmutada: item["attributes.IS_SWITCHED.value_name"],
        
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

async function getElectronicaAudioyVideoComponentesElectronicosSemiconductoresReguladoresdeTension(req, res) {
  const fileName = "Electrónica,_Audio_y_Video_Componentes_Electrónicos_Semiconductores_Reguladores_de_Tensión.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.VOLTAGE_FUNCTIONS.value_name",
    "attributes.MIN_INPUT_VOLTAGE.value_struct.number",
    "attributes.MIN_INPUT_VOLTAGE.value_struct.unit",
    "attributes.MAX_INPUT_VOLTAGE.value_struct.number",
    "attributes.MAX_INPUT_VOLTAGE.value_struct.unit",
    "attributes.MIN_OUTPUT_VOLTAGE.value_struct.number",
    "attributes.MIN_OUTPUT_VOLTAGE.value_struct.unit",
    "attributes.MAX_OUTPUT_VOLTAGE.value_struct.number",
    "attributes.MAX_OUTPUT_VOLTAGE.value_struct.unit",
    "attributes.MAX_OUTPUT_CURRENT.value_struct.number",
    "attributes.MAX_OUTPUT_CURRENT.value_struct.unit",
    "attributes.POWER.value_struct.number",
    "attributes.POWER.value_struct.unit",
    "attributes.FREQUENCY.value_name",
    "attributes.CONVERSION_EFFICIENCY.value_struct.number",
    "attributes.CONVERSION_EFFICIENCY.value_struct.unit",
    "attributes.MIN_OPERATING_TEMPERATURE.value_struct.number",
    "attributes.MIN_OPERATING_TEMPERATURE.value_struct.unit",
    "attributes.MAX_OPERATING_TEMPERATURE.value_struct.number",
    "attributes.MAX_OPERATING_TEMPERATURE.value_struct.unit",
    "attributes.HEIGHT.value_struct.number",
    "attributes.HEIGHT.value_struct.unit",
    "attributes.WIDTH.value_struct.number",
    "attributes.WIDTH.value_struct.unit",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
    "attributes.WEIGHT.value_struct.number",
    "attributes.WEIGHT.value_struct.unit",
    "attributes.OUTLETS_NUMBER.value_name",
    "attributes.WITH_ADJUSTABLE_OUTPUT_VOLTAGE.value_name",
    "attributes.WITH_SHORT_CIRCUIT_PROTECTION.value_name",
    "attributes.WITH_CIRCUIT_BREAKER.value_name",
    
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        FuncionesVoltaje: item["attributes.VOLTAGE_FUNCTIONS.value_name"],
        VoltajeMinimoEntrada: item["attributes.MIN_INPUT_VOLTAGE.value_struct.number"],
        UVoltajeMinimoEntrada: item["attributes.MIN_INPUT_VOLTAGE.value_struct.unit"],
        VoltajeMaximoEntrada: item["attributes.MAX_INPUT_VOLTAGE.value_struct.number"],
        UVoltajeMaximoEntrada: item["attributes.MAX_INPUT_VOLTAGE.value_struct.unit"],
        VoltajeMinimoSalida: item["attributes.MIN_OUTPUT_VOLTAGE.value_struct.number"],
        UVoltajeMinimoSalida: item["attributes.MIN_OUTPUT_VOLTAGE.value_struct.unit"],
        VoltajeMaximoSalida: item["attributes.MAX_OUTPUT_VOLTAGE.value_struct.number"],
        UVoltajeMaximoSalida: item["attributes.MAX_OUTPUT_VOLTAGE.value_struct.unit"],
        CorrienteMaximaSalida: item["attributes.MAX_OUTPUT_CURRENT.value_struct.number"],
        UCorrienteMaximaSalida: item["attributes.MAX_OUTPUT_CURRENT.value_struct.unit"],
        Potencia: item["attributes.POWER.value_struct.number"],
        UPotencia: item["attributes.POWER.value_struct.unit"],
        Frecuencia: item["attributes.FREQUENCY.value_name"],
        EficienciaConversion: item["attributes.CONVERSION_EFFICIENCY.value_struct.number"],
        UEficienciaConversion: item["attributes.CONVERSION_EFFICIENCY.value_struct.unit"],
        TemperaturaMinimaFuncionamiento: item["attributes.MIN_OPERATING_TEMPERATURE.value_struct.number"],
        UTemperaturaMinimaFuncionamiento: item["attributes.MIN_OPERATING_TEMPERATURE.value_struct.unit"],
        TemperaturaMaximaFuncionamiento: item["attributes.MAX_OPERATING_TEMPERATURE.value_struct.number"],
        UTemperaturaMaximaFuncionamiento: item["attributes.MAX_OPERATING_TEMPERATURE.value_struct.unit"],
        Altura: item["attributes.HEIGHT.value_struct.number"],
        UAltura: item["attributes.HEIGHT.value_struct.unit"],
        Ancho: item["attributes.WIDTH.value_struct.number"],
        UAncho: item["attributes.WIDTH.value_struct.unit"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        ULargo: item["attributes.LENGTH.value_struct.unit"],
        Peso: item["attributes.WEIGHT.value_struct.number"],
        UPeso: item["attributes.WEIGHT.value_struct.unit"],
        CantidadTomas: item["attributes.OUTLETS_NUMBER.value_name"],
        VoltajeSalidaRegulable: item["attributes.WITH_ADJUSTABLE_OUTPUT_VOLTAGE.value_name"],
        ProteccionCortocircuito: item["attributes.WITH_SHORT_CIRCUIT_PROTECTION.value_name"],
        Cortacorriente: item["attributes.WITH_CIRCUIT_BREAKER.value_name"],
        
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

async function getHogarMuesblesyJardinMueblesparaelHogarAccesoriosyRepuestosTiradores(req, res) {
  const fileName = "Hogar,_Muebles_y_Jardín_Muebles_para_el_Hogar_Accesorios_y_Repuestos_Tiradores.json";
  const filePath = path.join(__dirname, "..", "data", "items-categories", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `No existe el archivo ${fileName}` });
  }

  const camposExtra = [
    "family_name",
    "attributes.BRAND.value_name",
    "attributes.MODEL.value_name",
    "attributes.COLOR.value_name",
    "attributes.SALE_FORMAT.value_name",
    "attributes.UNITS_PER_PACK.value_name",
    "attributes.LENGTH.value_struct.number",
    "attributes.LENGTH.value_struct.unit",
    "attributes.DIAMETER.value_struct.number",
    "attributes.DIAMETER.value_struct.unit",
    "attributes.INCLUDES_INSTALLATION_KIT.value_name",
    "attributes.MATERIAL.value_name",
    "attributes.SHAPE.value_name",
    
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

      const precioActualizado = item.price * 0.95 *0.95 *0.95;

      const row = {

        Titulo: item.family_name,
        Condicion: "Usado",
        Color: item["attributes.COLOR.value_name"],
        Fotos: picturesUrl,
        Stock: item.available_quantity,
        Precio: precioActualizado,
        FormatoVenta: item["attributes.SALE_FORMAT.value_name"],
        UnidadesPack: item["attributes.UNITS_PER_PACK.value_name"],
        Descripcion: item.description || "",
        Marca: "Genérica",
        Modelo: item["attributes.MODEL.value_name"],
        Largo: item["attributes.LENGTH.value_struct.number"],
        ULargo: item["attributes.LENGTH.value_struct.unit"],
        Diametro: item["attributes.DIAMETER.value_struct.number"],
        UDiametro: item["attributes.DIAMETER.value_struct.unit"],
        KitInstalacion: item["attributes.INCLUDES_INSTALLATION_KIT.value_name"],
        Material: item["attributes.MATERIAL.value_name"],
        Forma: item["attributes.SHAPE.value_name"],
        
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
router.get("/electronicaaudioyvideo-repuestosparatv-botonerasdetv", getElectronicaAudioyVideoRepuestosparaTVBotonerasDeTV)
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-transistores", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresTransistores);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesoriosparacocinasyhornos-otros", getElectrodomesticosYAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosOtros);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-plaquetas", getElectrodomesticosYAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPlaquetas);
router.get("/computacion-notebooksyaccesorios-repuestos-camarasinternas", getComputacionNotebooksyAccesoriosRepuestosCamarasInternas);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-estantes", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosEstantes);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-jaboneras", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasJaboneras);
router.get("/electronicaaudioyvideo-controlesremotos-parareproductoresdevideo", getElectronicaAudioyVideoControlesRemotosParaReproductoresDeVideo);
router.get("/computacion-conectividadyredes-placasdered", getComputacionConectividadyRedesPlacasDeRed);
router.get("/computacion-lectoresyscanners-lectorasygrabadorasdedvdsycds-grabadorasdedvd", getComputacionLectoresyScannersLectorasyGrabadorasdeDVDsyCDsGrabadorasdeDVD);
router.get("/computacion-notebooksyaccesorios-repuestos-touchpads", getComputacionNotebooksyAccesoriosRepuestosTouchpads);
router.get("/computacion-notebooksyaccesorios-repuestos-memoriasrapparalaptops", getComputacionNotebooksyAccesoriosRepuestosMemoriasRAMparaLaptops);
router.get("/electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-otros", getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaVentiladoresOtros);
router.get("/bebes-juegosyjuguetesparabebes-juegosdeencastreyapilables", getBebesJuegosyJuguetesparaBebesJuegosdeEncastreyApilables);
router.get("/computacion-notebooksyaccesorios-repuestos-coolersinternosparalaptops", getComputacionNotebooksyAccesoriosRepuestosCoolersInternosparaLaptops);
router.get("/electrodomesticosyairesac-repuestosyaccesorios-paralavarropasysecarropas-puertasytapas", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPuertasyTapas);
router.get("/electrodomesticosyairesac-repuestosyaccesorios-paralavarropasysecarropas-poleasparalavarropas", getElectrodomesticosYAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPoleasparaLavarropas);
router.get("/computacion-notebooksyaccesorios-repuestos-placas-otros", getComputacionNotebooksyAccesoriosRepuestosPlacasOtros);
router.get("/electronicaaudioyvideo-componenteselectronicos-otros", getElectronicaAudioyVideoComponentesElectronicosOtros);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-panelesdecontrol", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPanelesdeControl);
router.get("/electronicaaudioyvideo-componenteselectronicos-pasivos-capacitoreselectroliticos", getElectronicaAudioyVideoComponentesElectronicosPasivosCapacitoresElectroliticos);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-mangueras", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasMangueras);
router.get("/electronicaaudioyvideo-componenteselectronicos-pasivos-resistencias", getElectronicaAudioyVideoComponentesElectronicoPasivosResistencias);
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-diodos-rectificadores", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresDiodosRectificadores);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-plaquetasparaheladeras", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosPlaquetasParaHeladeras);
router.get("/computacion-monitoresyaccesorios-soportes", getComputacionMonitoresyAccesoriosSoportes);
router.get("/computacion-almacenamiento-discosyaccesorios-discosrigidosyssds", getComputacionAlmacenamientoDiscosyAccesoriosDiscosRigidosySSDs);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-otros", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavavajillasOtros);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-otros", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosOtros);
router.get("/electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-motores", getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaVentiladoresMotores);
router.get("/electronicaaudioyvideo-accesoriosparatv-baseselevadoras", getElectronicaAudioyVideoAccesoriosParaTVBasesElevadoras);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-lavarropasysecarropas-motores-motoresparalavarropas", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasMotoresMotoresParaLavarropas);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-lavarropasysecarropas-soportesdetambor-paralavarropas", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasSoportesdeTamborParaLavarropas);
router.get("/computacion-notebooksyaccesorios-repuestos-baterias", getComputacionNotebooksyAccesoriosRepuestosBaterias);
router.get("/computacion-notebooksyaccesorios-repuestos-otros", getComputacionNotebooksyAccesoriosRepuestosOtros);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-manijas", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosManijas);
router.get("/otrascategorias-esoterismo-dijes", getOtrasCategoriasEsoterismoDijes);
router.get("/electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-helices", getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaVentiladoresHelices);
router.get("/computacion-notebooksyaccesorios-repuestos-placas-placasdeencendido", getComputacionNotebooksyAccesoriosRepuestosPlacasPlacasdeEncendido);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-agitadores", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasAgitadores);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-termostatos", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosTermostatos);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-amortiguadores", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasAmortiguadores);
router.get("/computacion-cablesyhubsusb-cables-cablespower", getComputacionCablesyHubsUSBCablesCablesPower);
router.get("/electrodomesticosyairesac-levado-repuestosyaccesorios-paralavarropasysecarropas-electrovalvulas", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasElectrovalvulas);
router.get("/herramientas-herramientasparajardin-repuestos-otros", getHerramientasHerramientasParaJardinRepuestosOtros);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-interruptoresypresostatos-presostatos", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasInterruptoresyPresostatosPresostatos);
router.get("/librosrevistasycomics-revistas", getLibrosRevistasyComicsRevistas);
router.get("/electronicaaudioyvideo-accesoriosparaaudoiyvideo-otros", getElectronicaAudioyVideoAccesoriosParaAudioyVideoOtros);
router.get("/electronicaaudioyvideo-componenteselectronicos-inversoresdecorriente", getElectronicaAudioyVideoComponentesElectronicosInversoresdeCorriente);
router.get("/computacion-componentesdepc-refrigeracion-coolersyventiladores", getComputacionComponentesdePCRefrigeracionCoolersyVentiladores);
router.get("/computacion-notebooksyaccesorios-repuestos-placas-placasdeaudio", getComputacionNotebooksyAccesoriosRepuestosPlacasPlacasdeAudio);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-bisagras", getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosBisagras);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-bombas", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasBombas);
router.get("/electronicaaudioyvideo-componenteselectronicos-conectores", getElectronicaAudioyVideoComponentesElectronicosConectores);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-bisagras", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosBisagras);
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-otros", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresOtros);
router.get("/electrodomesticosyaires-climatizacion-repuestosyaccesorios-paraairesacondicionados-control", getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaAiresAcondicionadosControl);
router.get("/electrodomesticosyaires-lavado-repuestosyaccesorios-paralavarropasysecarropas-correas", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasCorreas);
router.get("/computacion-componentesdepc-fuentesdealimentacion-cablesdealimentacion", getComputacionComponentesdePCFuentesdeAlimentacionCablesdeAlimentacion);
router.get("/computacion-notebooksyaccesorios-repuestos-parlantes", getComputacionNotebooksyAccesoriosRepuestosParlantes);
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-bobinas", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresBobinas);
router.get("/electrodomesticosyairesac-artefactosdecuidadopersonal-repuestosyaccesorios", getElectrodomesticosyAiresAcArtefactosdeCuidadoPersonalRepuestosyAccesorios);
router.get("/computacion-notebooksyaccesorios-repuestos-carcasas", getComputacionNotebooksyAccesoriosRepuestosCarcasas);
router.get("/electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-basesparaventiladoresdepie", getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaVentiladoresBasesparaVentiladoresdePie);
router.get("/electronicaaudioyvideo-audio-audioportatilyaccesorios-otros", getElectronicaAudioyVideoAudioAudioPortatilyAccesoriosOtros);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesoriosparamicroondas-otros", getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaMicroondasOtros);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-cajadeengranajes", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasCajadeEngranajes);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-canastos", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavavajillasCanastos);
router.get("/electrodomesticosyairesac-pequenos-electrodomesticos-paracocina-repuestosyaccesorios-paralicuadoras-motores", getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaRepuestosyAccesoriosParaLicuadorasMotores);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesorios-paramicroondas-plaquetas", getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaMicroondasPlaquetas);
router.get("/computacion-notebooksyaccesorios-repuestos-pantallas", getComputacionNotebooksyAccesoriosRepuestosPantallas);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-resistencias", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosResistencias);
router.get("/electrodomesticosyairesac-dispensadoresypurificadores-repuestosyaccesorios-otros", getElectrodomesticosyAiresAcDispensadoresyPurificadoresRepuestosyAccesoriosOtros);
router.get("/electronicaaudioyvideo-componenteselectronicos-displayslcd", getElectronicaAudioyVideoComponentesElectronicosDisplaysLCD);
router.get("/electronicaaudioyvideo-audio-minicomponentes", getElectronicaAudioyVideoAudioMinicomponentes);
router.get("/industriasyoficinas-herramientasindustriales-repuestos-botonerasdeparoyarranque", getIndustriasyOficinasHerramientasIndustrialesRepuestosBotonerasdeParoyArranque);
router.get("/computacion-componentesdepc-sintonizadorasdetv", getComputacionComponentesdePCSintonizadorasdeTV);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-tapas", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosTapas);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-programador", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasProgramador);
router.get("/electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraairesacondicionados-plaquetasparaairesac", getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaAiresAcondicionadosPlaquetasparaAiresAc);
router.get("/electrodomesticosyairesac-climatizacion-repuestosyaccesorios-otros", getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosOtros);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesorios-paracampanas-motores", getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCampanasMotores);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-fuelles", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasFuelles);
router.get("/electronicaaudioyvideo-audio-audioportatilyaccesorios-accesorios-parlantesportatiles", getElectronicaAudioyVideoAudioAudioPortatilyAccesoriosAccesoriosParlantesPortatiles);
router.get("/electronicaaudioyvideo-cables-cablesdeaudoiyvideo", getElectronicaAudioyVideoCablesCablesdeAudioyVideo);
router.get("/electronicaaudioyvideo-componenteselectronicos-disipadorestermicos-plaquetasdisipadoras", getElectronicaAudioyVideoComponentesElectronicosDisipadoresTermicosPlaquetasDisipadoras);
router.get("/hogar-mueblesyjardin-mueblesparaelhogar-accesoriosyrepuestos-burletes", getHogarMueblesyJardinMueblesparaelHogarAccesoriosyRepuestosBurletes);
router.get("/computacion-monitoresyaccesorios-fuentes", getComputacionMonitoresyAccesoriosFuentes);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-filtrosparalavarropas", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasFiltrosparaLavarropas);
router.get("/computacion-notebooksyaccesorios-repuestos-teclados", getComputacionNotebooksyAccesoriosRepuestosTeclados);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-motores", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosMotores);
router.get("/electronicaaudioyvideo-audio-parlantesybafles", getElectronicaAudioyVideoAudioParlantesyBafles);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-plaquetas", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavavajillasPlaquetas);
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-chips-leds", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresChipsLeds);
router.get("/electronicaaudioyvideo-otros", getElectronicaAudioyVideoOtros);
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-reles", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresReles);
router.get("/electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-preparacionesdebebidas-licuadoras", getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaPreparaciondeBebidasLicuadoras);
router.get("/herramientas-herramientaselectricas-limpieza-hidrolavadoras", getHerramientasHerramientasElectricasLimpiezaHidrolavadoras);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-vidriosparapuertas", getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosVidriosparaPuertas);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-quemadores", getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosQuemadores);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-burletes", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosBurletes);
router.get("/herramientas-accesoriosparaherramientas-inducidos", getHerramientasAccesoriosparaHerramientasInducidos);
router.get("/hogarmueblesyjardin-cuidadodelhogarylavanderia-desechables-bolsasparaaspiradoras", getHogarMueblesyJardinCuidadodelHogaryLavanderiaDesechablesBolsasparaAspiradoras);
router.get("/computacion-monitoresyaccesorios-baseselevadoras", getComputacionMonitoresyAccesoriosBasesElevadoras);
router.get("/electrodomesticosyairesac-climatizacion-ventiladores", getElectrodomesticosyAiresAcClimatizacionVentiladores);
router.get("/electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paracalefonesytermotanques-termocuplas", getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaCalefonesyTermotanquesTermocuplas);
router.get("/computacion-componentesdepc-otros", getComputacionComponentesdePCOtros);
router.get("/electronicaaudioyvideo-componenteselectronicos-placasdemicrocontroladores", getElectronicaAudioyVideoComponentesElectronicosPlacasdeMicrocontroladores);
router.get("/electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-otros", getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaRepuestosyAccesoriosOtros);
router.get("/computacion-notebooksyaccesorios-repuestos-inverters", getComputacionNotebooksyAccesoriosRepuestosInverters);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavavajillas-resistencias", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavavajillasResistencias);
router.get("/electrodomesticosyairesac-lavado-lavavajillas", getElectrodomesticosyAiresAcLavadoLavavajillas);
router.get("/electronicaaudioyvideo-audio-sintonizadores", getElectronicaAudioyVideoAudioSintonizadores);
router.get("/electrodomesticosyairesac-lavado-secarropas", getElectrodomesticosyAiresAcLavadoSecarropas);
router.get("/electronicaaudioyvideo-componenteselectronicos-pasivos-otros", getElectronicaAudioyVideoComponentesElectronicosPasivosOtros);
router.get("/construccion-aberturas-puertas", getConstruccionAberturasPuertas);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesorios-paracampanas-filtros", getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCampanasFiltros);
router.get("/electronicaaudioyvideo-accesoriosparaaudioyvideo-adaptadores", getElectronicaAudioyVideoAccesoriosparaAudioyVideoAdaptadores);
router.get("/electronicaaudioyvideo-accesoriosparaaudioyvideo-conversoresdetv", getElectronicaAudioyVideoAccesoriosparaAudioyVideoConversoresdeTV);
router.get("/construccion-electricidad-interruptoresyenchufes-interruptores-botonesindustriales", getConstruccionElectricidadInterruptoresyEnchufesInterruptoresBotonesIndustriales);
router.get("/electronicaaudioyvideo-audio-audioportatilyaccesorios-accesorios-soportes", getElectronicaAudioyVideoAudioAudioPortatilyAccesoriosAccesoriosSoportes);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-resistencias", getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosResistencias);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-retenesparalavarropas", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasRetenesparaLavarropas);
router.get("/electrodomesticosyairesac-lavado-lavarropasylavasecarropas", getElectrodomesticosyAiresAcLavadoLavarropasyLavasecarropas);
router.get("/construccion-electricidad-interruptoresyenchufes-interruptores-interruptoreselectricos", getConstruccionElectricidadInterruptoresyEnchufesInterruptoresInterruptoresElectricos);
router.get("/saludyequipamientomedico-equipamientomedico-equipamientoodontologico-turbinasodontologicas", getSaludyEquipamientoMedicoEquipamientoMedicoEquipamientoOdontologicoTurbinasOdontologicas);
router.get("/herramientas-accesoriosparaherramientas-escobillasdecarbon", getHerramientasAccesoriosparaHerramientasEscobillasdeCarbon);
router.get("/electronicaaudioyvideo-componenteselectronicos-lectoreslaser", getElectronicaAudioyVideoComponentesElectronicosLectoresLaser);
router.get("/computacion-otros", getComputacionOtros);
router.get("/electronicaaudioyvideo-controlesremotos-otros", getElectronicaAudioyVideoControlesRemotosOtros);
router.get("/herramientas-accesoriosparaherramientas-otros", getHerramientasAccesoriosparaHerramientasOtros);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-interruptores", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosInterruptores);
router.get("/hogarmueblesyjardin-iluminacionparaelhogar-tirasdeled", getHogarMueblesyJardinIluminacionparaelHogarTirasdeLED);
router.get("/hogarmueblesyjardin-jardinyairelibre-jardineriayaccesorios-herramientasparajardin-repuestos-carburadores", getHogarMueblesyJardinJardinyAireLibreJardineriayAccesoriosHerramientasparaJardinRepuestosCarburadores);
router.get("/electrodomesticosyairesac-coccion-repuestosyaccesorios-paracocinasyhornos-tapasparahornallas", getElectrodomesticosyAiresAcCoccionRepuestosyAccesoriosParaCocinasyHornosTapasparaHornallas);
router.get("/electrodomesticosyairesac-pequenoselectrodomesticos-parahogar-repuestosyaccesorios-paraaspiradoras-motores", getElectrodomesticosyAiresAcPequenosElectrodomesticosParaHogarRepuestosyAccesoriosParaAspiradorasMotores);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-sensores", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosSensores);
router.get("/juegosyjuguetes-otros", getJuegosyJuguetesOtros);
router.get("/bebesyjuguetes-parabebes-juegosdearrastre", getBebesyJuguetesparaBebesJuegosdeArrastre);
router.get("/librosrevistasycomics-otros", getLibrosRevistasyComicsOtros);
router.get("/computacion-componentesdepc-placas-placasusb-firewire", getComputacionComponentesdePCPlacasPlacasUSByFirewire);
router.get("/computacion-componentesdepc-placas-placasdesonido", getComputacionComponentesdePCPlacasPlacasdeSonido);
router.get("/computacion-impresion-repuestos-componenteselectronicos-placaslogicas", getComputacionImpresionRepuestosComponentesElectronicosPlacasLogicas);
router.get("/computacion-notebooksyaccesorios-repuestos-pilasbiosycmos", getComputacionNotebooksyAccesoriosRepuestosPilasBIOSyCMOS);
router.get("/construccion-electricidad-fusibles", getConstruccionElectricidadFusibles);
router.get("/construccion-electricidad-cablesyaccesorios-cableselectricos", getConstruccionElectricidadCablesyAccesoriosCablesElectricos);
router.get("/electrodomesticosyairesac-coccion-cocinas", getElectrodomesticosyAiresAcCoccionCocinas);
router.get("/electrodomesticosyairesac-refrigeracion-heladeras", getElectrodomesticosyAiresAcRefrigeracionHeladeras);
router.get("/computacion-monitoresyaccesorios-monitores", getComputacionMonitoresyAccesoriosMonitores);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-kitsderulemanesysellos", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasKitsdeRulemanesySellos);
router.get("/electrodomesticosyairesac-refrigeracion-repuestosyaccesorios-cajones", getElectrodomesticosyAiresAcRefrigeracionRepuestosyAccesoriosCajones);
router.get("/electronicaaudioyvideo-pilasycargadores-transformadoresyfuentes", getElectronicaAudioyVideoPilasyCargadoresTransformadoresyFuentes);
router.get("/electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-paraprocesadorasybatidoras-motores", getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaRepuestosyAccesoriosParaProcesadorasyBatidorasMotores);
router.get("/electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-preparaciondebebidas-exprimidoreselectricos", getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaPreparaciondeBebidasExprimidoresElectricos);
router.get("/electrodomesticosyairesac-lavado-repuestosyaccesorios-paralavarropasysecarropas-patasniveladoras", getElectrodomesticosyAiresAcLavadoRepuestosyAccesoriosParaLavarropasySecarropasPatasNiveladoras);
router.get("/electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-parajugueras", getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaRepuestosyAccesoriosParaJugueras);
router.get("/electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-repuestosyaccesorios-paracafeteras-depositosdeagua", getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaRepuestosyAccesoriosParaCafeterasDepositosdeAgua);
router.get("/electrodomesticosyairesac-pequenoselectrodomesticos-paracocina-jarraselectricas", getElectrodomesticosyAiresAcPequenosElectrodomesticosParaCocinaJarrasElectricas);
router.get("/electrodomesticosyairesac-coccion-anafes", getElectrodomesticosyAiresAcCoccionAnafes);
router.get("/electrodomesticosyairesac-climatizacion-repuestosyaccesorios-paraventiladores-capacitoresparaventiladores", getElectrodomesticosyAiresAcClimatizacionRepuestosyAccesoriosParaVentiladoresCapacitoresparaVentiladores);
router.get("/herramientas-herramientasindustriales-repuestos-pulsadores", getHerramientasHerramientasIndustrialesRepuestosPulsadores);
router.get("/electrodomesticosyairesac-coccion-extractoresypurificadores", getElectrodomesticosyAiresAcCoccionExtractoresyPurificadores);
router.get("/herramientas-accesoriosparaherramientas-puntasyadaptadores-mandriles", getHerramientasAccesoriosparaHerramientasPuntasyAdaptadoresMandriles);
router.get("/herramientas-herramientasparajardin-repuestos-kitsderepuestos", getHerramientasHerramientasparaJardinRepuestosKitsdeRepuestos);
router.get("/computacion-notebooksyaccesorios-repuestos-placasmotherboards", getComputacionNotebooksyAccesoriosRepuestosPlacasMotherboards);
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-modulosigbt", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresModulosIGBT);
router.get("/computacion-tabletsyaccesorios-repuestos-cablesflex", getComputacionTabletsyAccesoriosRepuestosCablesFlex);
router.get("/computacion-proyectoresypantallas-otros", getComputacionProyectoresyPantallasOtros);
router.get("/computacion-impresion-insumosdeimpresion-toners", getComputacionImpresionInsumosdeImpresionToners);
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-optoacopladores", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresOptoacopladores);
router.get("/electronicaaudioyvideo-video-reproductoresdedvd", getElectronicaAudioyVideoVideoReproductoresdeDVD);
router.get("/electronicaaudioyvideo-componenteselectronicos-pasivos-termistores", getElectronicaAudioyVideoComponentesElectronicosPasivosTermistores);
router.get("/celularesytelefonos-handiesyradiofrecuencia-accesorios-fuentes", getCelularesyTelefonosHandiesyRadiofrecuenciaAccesoriosFuentes);
router.get("/electronicaaudioyvideo-componenteselectronicos-semiconductores-reguladoresdetension", getElectronicaAudioyVideoComponentesElectronicosSemiconductoresReguladoresdeTension);
router.get("/hogar-mueblesyjardin-mueblesparaelhogar-accesoriosyrepuestos-tiradores", getHogarMuesblesyJardinMueblesparaelHogarAccesoriosyRepuestosTiradores);

module.exports = router;