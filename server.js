const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const client = new MongoClient("mongodb://127.0.0.1:27017");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function start() {
    await client.connect();

    const db = client.db("alumniDB");
    const alumni = db.collection("alumni");

    // READ
    app.get("/api/alumni", async (req, res) => {
        res.json(await alumni.find().toArray());
    });

    // CREATE
    app.post("/api/alumni", async (req, res) => {
        const result = await alumni.insertOne(req.body);
        res.json({ ...req.body, _id: result.insertedId });
    });

    // UPDATE
    app.put("/api/alumni/:id", async (req, res) => {
        const { _id, ...data } = req.body;

        await alumni.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: data }
        );

        res.json({ message: "Updated" });
    });

    // DELETE
    app.delete("/api/alumni/:id", async (req, res) => {
        await alumni.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json({ message: "Deleted" });
    });

    app.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });
}

start();