import React from "react";
import { useNavigate } from "react-router-dom";
import "./browse.css";

const topics = [
  { name: "Romance", image: '/src/assets/romance_book.jpg' },
  { name: "Psychology", image: '/src/assets/psychology_book.jpg' },
  { name: "Fantasy", image: '/src/assets/fantasy_book.jpg' },
  { name: "History", image: '/src/assets/history_book.jpg' },
  { name: "Young Adults", image: '/src/assets/young_book.jpg' },
];

function Browse() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/books"); 
  };

  return (
    <div className="browse-container">
      <div className="row">
        {topics.slice(0, 3).map((topic, index) => (
          <div 
            key={index} 
            className="topic-box" 
            style={{ backgroundImage: `url(${topic.image})` }} 
            onClick={handleClick} 
          >
            <span>{topic.name}</span>
          </div>
        ))}
      </div>
      <div className="row">
        {topics.slice(3).map((topic, index) => (
          <div 
            key={index} 
            className="topic-box" 
            style={{ backgroundImage: `url(${topic.image})` }} 
            onClick={handleClick} 
          >
            <span>{topic.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Browse;
