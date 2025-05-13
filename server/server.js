require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USER_ID = process.env.USER_ID;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: true },
};
const pool = new Pool(dbConfig);

let tokens = {
    access_token: process.env.ACCESS_TOKEN || "",
    refresh_token: process.env.REFRESH_TOKEN || "",
    expires_at: 0,
};

async function loadTokens() {
    try {
        const { rows } = await pool.query("SELECT * FROM tokens WHERE id = 1");
        if (rows.length > 0) {
            tokens = {
                access_token: rows[0].access_token,
                refresh_token: rows[0].refresh_token,
                expires_at: rows[0].expires_at,
            };
        } else {
            await saveTokens();
        }
    } catch (error) {
        console.error("Error loading tokens from PostgreSQL: ", error.message);
        await saveTokens();
    }
}

async function saveTokens() {
    try {
        await pool.query(
            `INSERT INTO tokens (id, access_token, refresh_token, expires_at)
            VALUES (1, $1, $2, $3)
            ON CONFLICT (id)
            DO UPDATE SET
            access_token = EXCLUDED.access_token,
            refresh_token = EXCLUDED.refresh_token,
            expires_at = EXCLUDED.expires_at`,
            [tokens.access_token, tokens.refresh_token, tokens.expires_at]
        );
    } catch (error) {
        console.error("Error saving tokens to PostgreSQL: ", error.message);
    }
}

async function refreshAccessToken() {
    if (!CLIENT_ID || !CLIENT_SECRET || !tokens.refresh_token) {
        throw new Error("Missing CLIENT_ID, CLIENT_SECRET or REFRESH_TOKEN");
    }
    try {
        const response = await axios.post(
            "https://api.mercadolibre.com/oauth/token",
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
        console.log("Access Token refreshed successfully");
        return access_token;
    } catch (error) {
        console.error("Token refresh error: ", error.response?.data || error.message);
        throw new Error(`Failed to refresh access token: ${error.response?.data?.message || error.message}`);
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
        console.error("Authentication middleware error: ", error.message);
        res.status(500).json({ error: "Authentication error", details: error.message });
    }
}

app.use("/api/ml", ensureValidToken);

async function fetchAndSaveItems(accessToken, maxItems = Infinity) {
    const allItemIds = [];
    let scrollId = null;
    let keepScrolling = true;

    while (keepScrolling && allItemIds.length < maxItems) {
        let url = `https://api.mercadolibre.com/users/${USER_ID}/items/search?search_type=scan`;
        if (scrollId) {
            url += `&scroll_id=${encodeURIComponent(scrollId)}`;
        }

        const { data } = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        const itemIds = data.results || [];
        allItemIds.push(...itemIds.slice(0, maxItems - allItemIds.length));

        if (itemIds.length === 0 || !data.scroll_id || allItemIds.length >= maxItems) {
            keepScrolling = false;
        } else {
            scrollId = data.scroll_id;
        }
    }

    const uniqueItemIds = [...new Set(allItemIds)];
    
    const detailedItems = [];
    for (let i = 0; i < uniqueItemIds.length; i += 20) {
        const batchIds = uniqueItemIds.slice(i, i + 20);
        const idsString = batchIds.join(",");

        const response = await axios.get(
            `https://api.mercadolibre.com/items?ids=${idsString}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            }
        );

        const batchItems = response.data
            .filter(
                (item) => item.body.available_quantity > 0 && item.body.status === "active"
            )
            .map((item) => ({
                id: item.body.id,
                title: item.body.title,
                price: item.body.price,
                available_quantity: item.body.available_quantity,
                condition: item.body.condition,
                pictures: item.body.pictures.map((pic) => pic.url),
                thumbnail: item.body.thumbnail,
                status: item.body.status,
            }));

            detailedItems.push(...batchItems);
            console.log(`Processed ${detailedItems.length} items of ${uniqueItemIds.length}`);
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query("TRUNCATE TABLE items");

        const batchSize = 100;
        for (let i = 0; i < detailedItems.length; i += batchSize) {
            const batch = detailedItems.slice(i, i + batchSize);
            const values = batch.map(item => [
                item.id,
                item.title,
                item.price,
                item.available_quantity,
                item.condition,
                JSON.stringify(item.pictures),
                item.thumbnail,
                item.status
            ]);

            if (values.length > 0) {
                const placeholders = values.map((_, j) => `($${j * 8 + 1}, $${j * 8 + 2}, $${j * 8 + 3}, $${j * 8 + 4}, $${j * 8 + 5}, $${j * 8 + 6}, $${j * 8 + 7}, $${j * 8 + 8})`).join(", ");
                await client.query(
                `INSERT INTO items (id, title, price, available_quantity, condition, pictures, thumbnail, status)
                VALUES ${placeholders}
                ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                price = EXCLUDED.price,
                available_quantity = EXCLUDED.available_quantity,
                condition = EXCLUDED.condition,
                pictures = EXCLUDED.pictures,
                thumbnail = EXCLUDED.thumbnail,
                status = EXCLUDED.status`,
                values.flat()
                );
            }
        }

        await client.query("COMMIT");
    } catch (dbError) {
        await client.query("ROLLBACK");
        console.error("PostgreSQL error: ", dbError.message);
        throw new Error(`Failed to save items to PostgerSQL: ${dbError.message}`);
    } finally {
        client.release();
    }

    return detailedItems;
}

app.get("/api/ml/items-details", async (req, res) => {
    try {
        const detailedItems = await fetchAndSaveItems(req.accessToken);
        res.json({
            success: true,
            total: detailedItems.length,
            items: detailedItems,
        });
    } catch (error) {
        console.error("Error al obtener los detalles: ", error.message);
        res.status(500).json({ error: "Error al obtener los detalles de los items", details: error.message });
    }
});

app.get("/api/ml/items-details-test", async (req, res) => {
    try {
        const detailedItems = await fetchAndSaveItems(req.accessToken, 100);
        res.json({
            success: true,
            total: detailedItems.length,
            items: detailedItems,
        });
    } catch (error) {
        console.error("Error al obtener los detalles (test): ", error.message);
        res.status(500).json({ error: "Error al obtener los detalles de los items (test)", details: error.message });
    }
});

app.get("/api/ml/items", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM items");
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
        res.status(500).json({ error: "Error fetching items from database: ", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS tokens (
                id INTEGER PRIMARY KEY,
                access_token TEXT NOT NULL,
                refresh_token TEXT NOT NULL,
                expires_at BIGINT NOT NULL
            )`
        );
        await loadTokens();
    } catch (error) {
        console.error("Error initializing tokens table: ", error.message);
    }
});