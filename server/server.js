require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = 'APP_USR-1844316705046675-040815-e3aba7302fa380a04d3f04893bac36b0-86060871';
const USER_ID = '86060871';

app.get("/api/ml/items-ids", async (req, res) => {
    const allItemIds = [];
    let scrollId = null;
    let keepScrolling = true;

    try {
        while (keepScrolling) {
            let url = `https://api.mercadolibre.com/users/${USER_ID}/items/search?search_type=scan`;
            if (scrollId) {
                url += `&scroll_id=${encodeURIComponent(scrollId)}`;
            }

            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            });

            const itemIds = data.results || [];
            allItemIds.push(...itemIds);

            if (itemIds.length === 0 || !data.scroll_id) {
                keepScrolling = false;
            } else {
                scrollId = data.scroll_id;
            }

            console.log(`Recuperados ${allItemIds.length} IDs hasta ahora...`);
        }

        res.json({ total: allItemIds.length, items: allItemIds });
    } catch (error) {
        console.error("Error al obtener los Ids: ", error.message);
        res.status(500).json({ error: "Errir al obtener los item Ids" });
    }
});

app.post("/api/ml/items-details", async (req, res) => {
    const itemIds = req.body.itemIds;
    if (!itemIds || !Array.isArray(itemIds)) {
        return res.status(400).json({ error: "Se requiere un array de itemIds" });
    }

    const chunkSize = 20;
    const allItemDetails = [];

    try {
        for (let i = 0; i < itemIds.length; i += chunkSize) {
            const chunk = itemIds.slice(i, i + chunkSize);
            const idsParam = chunk.join(',');

            const { data } = await axios.get(`https://api.mercadolibre.com/items?ids=${idsParam}`, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            });

            const validItems = data
                .filter(item => item.code === 200)
                .map(item => item.body);

                allItemDetails.push(...validItems);

                console.log(`Procesando chunk ${i / chunkSize + 1}: ${chunk.length} items`);
        }

        res.json({ total: allItemDetails.length, items: allItemDetails });
    } catch (error) {
        console.error("Error al obtener los detalles de los items.", error.message);
        res.status(500).json({ error: "Error al obtener los detalles de los items" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})