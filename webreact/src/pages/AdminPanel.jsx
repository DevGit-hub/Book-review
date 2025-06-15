import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState("all");
  const [newBook, setNewBook] = useState({
    category: "",
    name: "",
    year: "",
    description: "",
    rating: "",
    image: null,
  });
  const [editingBook, setEditingBook] = useState(null); // Track the book being edited

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/books");
      setBooks(response.data.data); // Assuming the API returns { success: true, data: [...] }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleCategoryChange = (e) => setCategory(e.target.value);

  const handleAddBook = async (e) => {
    e.preventDefault();

    // Convert the image file to a Base64 string
    const imageBase64 = await convertImageToBase64(newBook.image);

    // Create the payload object
    const payload = {
      category: newBook.category,
      name: newBook.name,
      year: newBook.year,
      description: newBook.description,
      rating: newBook.rating,
      image: imageBase64, // Send the image as a Base64 string
    };

    try {
      // Send the payload to the backend
      const response = await axios.post("http://localhost:5000/api/books", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Reset the form and fetch updated books
      setNewBook({ category: "", name: "", year: "", description: "", rating: "", image: null });
      fetchBooks();

      console.log("Book added successfully:", response.data);
      alert("Book added successfully!");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Error adding book. Please try again.");
    }
  };

  const handleEditBook = (book) => {
    // Set the book being edited
    setEditingBook(book);
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();

    // Convert the image file to a Base64 string if a new image is provided
    const imageBase64 = editingBook.image instanceof File
      ? await convertImageToBase64(editingBook.image)
      : editingBook.image;

    // Create the payload object
    const payload = {
      category: editingBook.category,
      name: editingBook.name,
      year: editingBook.year,
      description: editingBook.description,
      rating: editingBook.rating,
      image: imageBase64,
    };

    try {
      // Send the payload to the backend
      const response = await axios.put(`http://localhost:5000/api/books/${editingBook.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Reset the editing state and fetch updated books
      setEditingBook(null);
      fetchBooks();

      console.log("Book updated successfully:", response.data);
      alert("Book updated successfully!");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Error updating book. Please try again.");
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      // Send a DELETE request to the backend
      const response = await axios.delete(`http://localhost:5000/api/books/${id}`);

      // Fetch updated books
      fetchBooks();

      console.log("Book deleted successfully:", response.data);
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Error deleting book. Please try again.");
    }
  };

  // Helper function to convert an image file to a Base64 string
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove the data URL prefix
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel - Manage Books</h1>

      <div className="category-filter">
        <label>Filter by Category: </label>
        <select value={category} onChange={handleCategoryChange}>
          <option value="all">All</option>
          <option value="action">Action</option>
          <option value="horror">Horror</option>
          <option value="romance">Romance</option>
          <option value="thriller">Thriller</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
        </select>
      </div>

      <div className="add-book">
        <h2>{editingBook ? "Edit Book" : "Add New Book"}</h2>
        <form onSubmit={editingBook ? handleUpdateBook : handleAddBook}>
          <input
            type="text"
            placeholder="Category"
            value={editingBook ? editingBook.category : newBook.category}
            onChange={(e) =>
              editingBook
                ? setEditingBook({ ...editingBook, category: e.target.value })
                : setNewBook({ ...newBook, category: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Name"
            value={editingBook ? editingBook.name : newBook.name}
            onChange={(e) =>
              editingBook
                ? setEditingBook({ ...editingBook, name: e.target.value })
                : setNewBook({ ...newBook, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Year"
            value={editingBook ? editingBook.year : newBook.year}
            onChange={(e) =>
              editingBook
                ? setEditingBook({ ...editingBook, year: e.target.value })
                : setNewBook({ ...newBook, year: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={editingBook ? editingBook.description : newBook.description}
            onChange={(e) =>
              editingBook
                ? setEditingBook({ ...editingBook, description: e.target.value })
                : setNewBook({ ...newBook, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Rating"
            value={editingBook ? editingBook.rating : newBook.rating}
            onChange={(e) =>
              editingBook
                ? setEditingBook({ ...editingBook, rating: e.target.value })
                : setNewBook({ ...newBook, rating: e.target.value })
            }
          />
          <input
            type="file"
            onChange={(e) =>
              editingBook
                ? setEditingBook({ ...editingBook, image: e.target.files[0] })
                : setNewBook({ ...newBook, image: e.target.files[0] })
            }
          />
          <button type="submit">{editingBook ? "Update Book" : "Add Book"}</button>
          {editingBook && (
            <button type="button" onClick={() => setEditingBook(null)} className="cancel">
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="book-list">
        <h2>Book List</h2>
        <table className="book-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Name</th>
              <th>Year</th>
              <th>Description</th>
              <th>Rating</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.category}</td>
                <td>{book.name}</td>
                <td>{book.year}</td>
                <td>{book.description}</td>
                <td>{book.rating}</td>
                <td>
                  <img
                    src={book.image ? `data:image/jpeg;base64,${book.image}` : '/images/default-book.jpg'}
                    alt={book.name}
                    className="book-image"
                  />
                </td>
                <td>
                  <button onClick={() => handleEditBook(book)}>Edit</button>
                  <button onClick={() => handleDeleteBook(book.id)} className="delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;