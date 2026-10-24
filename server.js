const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Frontend files serve karne ke liye

// Database Setup (SQLite)
const db = new sqlite3.Database('./blog.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

// Table Create karna agar nahi bani toh
db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    date TEXT NOT NULL
)`);

// 1. GET API - Saare posts fetch karne ke liye
app.get('/api/posts', (req, res) => {
    db.all("SELECT * FROM posts ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. POST API - Naya post create karne ke liye
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;
    const date = new Date().toLocaleString();
    
    if (!title || !content || !author) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO posts (title, content, author, date) VALUES (?, ?, ?, ?)";
    db.run(sql, [title, content, author, date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title, content, author, date });
    });
});

// 3. DELETE API - Post delete karne ke liye
app.delete('/api/posts/:id', (req, res) => {
    db.run("DELETE FROM posts WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});