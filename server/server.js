require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs").promises;

const app = express();

app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = 'APP_USR-1844316705046675-040913-8f05e0ea4c8cf14d15cb03f18eb49609-86060871';
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

app.get("/api/ml/items-details", async (req, res) => {
    try {
        const allItemIds = [];
        let scrollId = null;
        let keepScrolling = true;

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
        }

        const detailedItems = [];
        for (let i = 0; i < allItemIds.length; i += 20) {
            const batchIds = allItemIds.slice(i, i + 20);
            const idsString = batchIds.join(',');

            const response = await axios.get(
                `https://api.mercadolibre.com/items?ids=${idsString}`,
                {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`
                    }
                }
            );

            const batchItems = response.data
                .filter(item => item.body.available_quantity > 0)
                .map(item => ({
                    id: item.body.id,
                    title: item.body.title,
                    category_id: item.body.categoy_id,
                    price: item.body.price,
                    available_quantity: item.available_quantity,
                    condition: item.body.condition,
                    pictures: item.body.pictures.map(pic => pic.url),
                    descriptions: item.body.descriptions
                }));

                detailedItems.push(...batchItems);
                console.log(`Procesados ${detailedItems.length} items de ${allItemIds.length}`);
        }

        const outputString = JSON.stringify(detailedItems, null, 2);
        await fs.writeFile('items-details.txt', outputString);

        res.json({
            success: true,
            total: detailedItems.length,
            items: detailedItems
        });
    } catch (error) {
        console.error("Error al obtener los detalles: ", error.message);
        res.status(500).json({ error: "Error al obtener los detalles de los items" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})