const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "food_ordering"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        console.error("Check MySQL is running and database.sql has been executed.");
        return;
    }
    console.log("Connected to MySQL database: food_ordering");
});

// Get all food items
app.get("/api/food", (req, res) => {
    const sql = "SELECT * FROM food ORDER BY food_id DESC";
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get one food item
app.get("/api/food/:id", (req, res) => {
    db.query("SELECT * FROM food WHERE food_id = ?", [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ error: "Food item not found" });
        res.json(rows[0]);
    });
});

// Add a food item
app.post("/api/food", (req, res) => {
    const { food_name, category, price, description, availability } = req.body;
    if (!food_name || !["Vegetarian", "Non-Vegetarian"].includes(category) ||
        price === undefined || Number(price) < 0) {
        return res.status(400).json({ error: "Enter a name, valid category, and non-negative price." });
    }

    const sql = `INSERT INTO food (food_name, category, price, description, availability)
                 VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [
        food_name.trim(), category, Number(price), description || "",
        availability === true || availability === "true" || availability === "1"
    ], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Food item added successfully", food_id: result.insertId });
    });
});

// Update a food item
app.put("/api/food/:id", (req, res) => {
    const { food_name, category, price, description, availability } = req.body;
    if (!food_name || !["Vegetarian", "Non-Vegetarian"].includes(category) ||
        price === undefined || Number(price) < 0) {
        return res.status(400).json({ error: "Enter a name, valid category, and non-negative price." });
    }

    const sql = `UPDATE food
                 SET food_name = ?, category = ?, price = ?, description = ?, availability = ?
                 WHERE food_id = ?`;
    db.query(sql, [
        food_name.trim(), category, Number(price), description || "",
        availability === true || availability === "true" || availability === "1",
        req.params.id
    ], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Food item not found" });
        res.json({ message: "Food item updated successfully" });
    });
});

// Delete a food item
app.delete("/api/food/:id", (req, res) => {
    db.query("DELETE FROM food WHERE food_id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Food item not found" });
        res.json({ message: "Food item deleted successfully" });
    });
});

app.listen(3000, () => {
    console.log("Food Ordering System running at http://localhost:3000");
});
