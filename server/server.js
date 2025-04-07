require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = 'APP_USR-1844316705046675-040711-0061f77f34a56dc874b7bc167ecdc44c-86060871';
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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})