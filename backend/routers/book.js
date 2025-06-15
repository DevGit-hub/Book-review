const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../books.db");

// Create books table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    description TEXT NOT NULL,
    rating REAL NOT NULL,
    image BLOB NOT NULL
  )
`);

// Add a new book
router.post("/", (req, res) => {
  const { category, name, year, description, rating, image } = req.body;
  console.log("Received data:", req.body);

  // Validate required fields
  if (!category || !name || !year || !description || !rating || !image) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Convert the Base64 image to a buffer
  const imageBuffer = Buffer.from(image, "base64");

  // Insert the book into the database
  const query = `
    INSERT INTO books (category, name, year, description, rating, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [category, name, year, description, rating, imageBuffer];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error adding book:", err);
      return res.status(500).json({ success: false, message: "Error adding book" });
    }
    res.json({ success: true, message: "Book added successfully", id: this.lastID });
  });
});

// Get all books
router.get("/", (req, res) => {
  const query = "SELECT * FROM books";

  db.all(query, (err, rows) => {
    if (err) {
      console.error("Error fetching books:", err);
      return res.status(500).json({ success: false, message: "Error fetching books" });
    }

    // Convert the image buffer to a Base64 string for each book
    const books = rows.map((book) => ({
      ...book,
      image: book.image.toString("base64"), // Convert BLOB to Base64
    }));

    // Send the books as a JSON response
    res.json({ success: true, data: books });
  });
});

// Update a book by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { category, name, year, description, rating, image } = req.body;

  // Validate required fields
  if (!category || !name || !year || !description || !rating || !image) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Convert the Base64 image to a buffer
  const imageBuffer = Buffer.from(image, "base64");

  // Update the book in the database
  const query = `
    UPDATE books
    SET category = ?, name = ?, year = ?, description = ?, rating = ?, image = ?
    WHERE id = ?
  `;
  const params = [category, name, year, description, rating, imageBuffer, id];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating book:", err);
      return res.status(500).json({ success: false, message: "Error updating book" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, message: "Book updated successfully" });
  });
});

// Delete a book by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Delete the book from the database
  const query = "DELETE FROM books WHERE id = ?";
  const params = [id];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error deleting book:", err);
      return res.status(500).json({ success: false, message: "Error deleting book" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, message: "Book deleted successfully" });
  });
});

module.exports = router;