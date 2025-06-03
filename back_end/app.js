const express = require("express");
const cors = require("cors");
const db = require("./services/db.js");

const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = JSON.parse(fs.readFileSync("./services/swagger.json"));



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
    const id = parseInt(req.params.id);
    try {
        const dish = await db("Dishes").where({ id }).first();
        if (dish) {
            res.status(200).json(dish);
        } else {
            res.status(404).json({ error: "Gerecht niet gevonden" });
        }
    } catch (err) {
        res.status(500).json({ error: "Interne serverfout" });
    }

})

app.post("/newDish", async (req, res) => {
    const {name, dish_type, cuisine, is_vegetarian} = req.body;

    if (!name || !dish_type || !cuisine || typeof is_vegetarian !== "number") {
        return res.status(400).json({message: "Vul alle velden in"});
    }

    try {
        const [id] = await db("Dishes").insert({name, dish_type, cuisine, is_vegetarian})
        res.status(201).json({
            message: "Succesvol toegevoegd ",
            id: id
        })
    } catch (error) {
        res.status(500).json({message: "Fout bij het toevoegen van het gerecht"});
    }
})

app.put("/updateDish/:id", async (req, res) => {
    const { name, dish_type, cuisine, is_vegetarian } = req.body;
    const { id } = req.params;

    // Controleer of alle waarden aanwezig zijn
    if (!name || !dish_type || !cuisine || typeof is_vegetarian !== "number") {
        return res.status(400).json({ message: "Vul alle velden in" });
    }

    try {
        await db("Dishes").where({ id }).update({
            name,
            dish_type,
            cuisine,
            is_vegetarian
        });

        res.status(200).json({ message: "Gerecht succesvol bijgewerkt" });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Fout bij het bijwerken" });
    }
});



app.delete("/deleteDish/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try{
        const deleted = await db("Dishes").where('id', id).del();
        if (deleted === 0){
            res.status(404).json({message: "Gerecht niet gevonden."});
        }
        res.status(200).json({message: 'Gerecht verwijderd'});
    }catch{
        res.status(500).json({message: "Internal server error."});
    }

});

app.use("/dish-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3333, () => {
    console.log("API draait op http://localhost:3333");
});
