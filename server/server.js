require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const ML_SELLER_ID = process.env.ML_SELLER_ID;

app.get("/api/products", async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.mercadolibre.com/sites/MLA/search?seller_id=${ML_SELLER_ID}`
        );
        res.json(response.data.results);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})