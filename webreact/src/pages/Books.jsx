import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      if (data.success) {
        setBooks(data.data);
        
        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.data.map(book => book.category))];
        setCategories(uniqueCategories);
      } else {
        throw new Error('Failed to fetch books: API returned unsuccessful');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    (selectedCategory === "All" || book.category === selectedCategory) &&
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookClick = (book) => {
    navigate(`/review/${book.id}`, { state: book });
  };

  if (loading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="books-container">
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="book-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-cover" onClick={() => handleBookClick(book)}>
              <img
                src={book.image ? `data:image/jpeg;base64,${book.image}` : '/default-book-cover.jpg'}
                alt={book.name}
              />
              <p>{book.name}</p>
            </div>
          ))
        ) : (
          <p className="no-books">No books found</p>
        )}
      </div>
    </div>
  );
}

export default Books;