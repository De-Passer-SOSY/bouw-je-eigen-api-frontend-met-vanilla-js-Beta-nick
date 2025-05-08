const express = require("express");
const cors = require("cors");
const db = require("./services/db.js");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/dishes", async (req, res) => {
    try {
        const results = await db("Dishes");
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Interne serverfout" });
    }
});

app.get("/dish/:id", async (req, res) => {
    const id = parseInt(req.params.id); // ID uit URL halen en omzetten naar getal
    try {
        const dish = await db("Dishes").where({ id }).first();
        if (dish) {
            res.status(200).json(dish);
        } else {
            res.status(404).json({ error: "Afwezigheid niet gevonden" });
        }
    } catch (err) {
        res.status(500).json({ error: "Interne serverfout" });
    }

});

app.listen(3333, () => {
    console.log("API draait op http://localhost:3333");
});
