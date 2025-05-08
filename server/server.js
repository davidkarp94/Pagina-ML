require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USER_ID = process.env.USER_ID;
const TOKEN_FILE = path.join(__dirname, "tokens.json");

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "Panconpalta1",
    database: "mercado_libre",
    connectionLimit: 10,
};
const pool = mysql.createPool(dbConfig);

let tokens = {
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN || "",
    expires_at: 0,
};

async function loadTokens() {
    try {
        const data = await fs.readFile(TOKEN_FILE, "utf8");
        tokens = JSON.parse(data);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error("Error loading tokens: ", error.message);
        }
        await saveTokens();
    }
}

async function saveTokens() {
    try {
        await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2));
    } catch (error) {
        console.error("Error saving tokens: ", error.message);
    }
}

async function refreshAccessToken() {
    try {
        const response = await axios.post(
            "https://api.mercadolibre.oauth/token",
            {
                grant_type: "refresh_token",
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: tokens.refresh_token,
            },
            {
                headers: {
                    accept: "application/json",
                    "content-type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { access_token, refresh_token, expires_in } = response.data;
        tokens = {
            access_token,
            refresh_token,
            expires_at: Date.now() + expires_in * 1000,
        };
        await saveTokens();
        console.log("Access token refreshed successfully");
        return access_token;
    } catch (error) {
        console.error("Error refreshing token: ", error.response?.data || error.message);
        throw new Error("Failed to refresh access token");
    }
}

async function ensureValidToken(req, res, next) {
    try {
        await loadTokens();
        if (!tokens.access_token || Date.now() >= tokens.expires_at - 60000) {
            tokens.access_token = await refreshAccessToken();
        }
        req.accessToken = tokens.access_token;
        next();
    } catch (error) {
        res.status(500).json({ error: "Aunthentication error" });
    }
}

app.use("/api/ml", ensureValidToken);

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
                        Authorization: `Bearer ${req.accessToken}`
                    }
                }
            );

            const batchItems = response.data
                .filter(item => item.body.available_quantity > 0 && item.body.status === "active")
                .map(item => ({
                    id: item.body.id,
                    title: item.body.title,
                    price: item.body.price,
                    available_quantity: item.body.available_quantity,
                    condition: item.body.condition,
                    pictures: item.body.pictures.map(pic => pic.url),
                    thumbnail: item.body.thumbnail,
                    status: item.body.status
                }));

                detailedItems.push(...batchItems);
                console.log(`${detailedItems.length} items de ${allItemIds.length}`);
        }

        const connection = await pool.getConnection();
        try {
            await connection.query("TRUNCATE TABLE items");
            for (const item of detailedItems) {
                await connection.query(
                `INSERT INTO items (id, title, price, available_quantity, condition, pictures, thumbnail, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                    item.id,
                    item.title,
                    item.price,
                    item.available_quantity,
                    item.condition,
                    JSON.stringify(item.pictures),
                    item.thumbnail,
                    item.status,
                    ]
                );
            }
        } finally {
            connection.release();
        }
    
        const outputString = JSON.stringify(detailedItems, null, 2);
        await fs.writeFile("items-details.txt", outputString);

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

app.get("/api/ml/item", async (req, res) => {
    try {
            const detailedItems = [];
            const response = await axios.get(
                `https://api.mercadolibre.com/items?ids=MLA904096666`,
                {
                    headers: {
                        Authorization: `Bearer ${req.accessToken}`
                    }
                }
            );

            const batchItems = response.data
                .map(item => ({
                    id: item.body.id,
                    title: item.body.title,
                    category_id: item.body.category_id,
                    price: item.body.price,
                    available_quantity: item.body.available_quantity,
                    condition: item.body.condition,
                    pictures: item.body.pictures.map(pic => pic.url),
                    thumbnail: item.body.thumbnail,
                    status: item.body.status
                }));

                detailedItems.push(...batchItems);
                console.log(`${detailedItems.length} items de `);

        res.json({
            detailedItems
        });
    } catch (error) {
        console.error("Error al obtener los detalles: ", error.message);
        res.status(500).json({ error: "Error al obtener los detalles de los items" });
    }
});

app.get("/api/ml/items", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM items");
        res.json({
            success: true,
            total: rows.length,
            items: rows.map((row) => ({
                ...row,
                pictures: JSON.parse(row.pictures),
            })),
        });
    } catch (error) {
        console.error("Error fetching items from database: ", error.message);
        res.status(500).json({ error: "Error fetching items from database" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})