import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./Review.css";

const Review = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!book) {
      navigate('/books');
      return;
    }

    fetchReviews();
  }, [id, book, navigate]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${id}/reviews`);
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reviews');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="review-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="review-container">
        <div className="error">Book not found</div>
      </div>
    );
  }

  return (
    <div className="review-container">
      <div className="book-details">
        <div className="book-header">
          <h1>{book.name}</h1>
          <button onClick={() => navigate('/books')} className="back-button">
            Back to Books
          </button>
        </div>

        <div className="book-content">
          <div className="book-image">
            <img 
              src={book.image ? `data:image/jpeg;base64,${book.image}` : '/images/default-book.jpg'} 
              alt={book.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-book.jpg';
              }}
            />
          </div>

          <div className="book-info">
            <div className="info-item">
              <span className="label">Category:</span>
              <span className="value">{book.category}</span>
            </div>
            <div className="info-item">
              <span className="label">Year:</span>
              <span className="value">{book.year || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Rating:</span>
              <span className="value">{book.rating || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Description:</span>
              <span className="value">{book.description || 'No description available.'}</span>
            </div>
            {reviews.length > 0 && (
              <div className="info-item">
                <span className="label">Average Rating:</span>
                <span className="value">
                  {(reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)}/10
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <div className="reviews-section">
        <h2>Reviews</h2>
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">
                    {review.reviewer_name || 'Anonymous'}
                  </span>
                  <span className="review-rating">
                    Rating: {review.rating}/10
                  </span>
                </div>
                <p className="review-text">{review.review_text}</p>
                <div className="review-footer">
                  <span className="review-date">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-reviews">
              <p>No reviews available for this book.</p>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default Review;