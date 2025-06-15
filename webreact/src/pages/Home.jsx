import React, { useEffect, useRef } from 'react';
import './Home.css';

const Home = () => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    
    const scrollInterval = setInterval(() => {
      if (scrollContainer) {
        const singleImageWidth = scrollContainer.firstElementChild.offsetWidth + 20; 
        const maxScrollLeft =
          scrollContainer.scrollWidth - scrollContainer.offsetWidth;

        
        if (
          scrollContainer.scrollLeft + singleImageWidth >=
          maxScrollLeft + singleImageWidth
        ) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainer.scrollBy({
            left: singleImageWidth,
            behavior: 'smooth',
          });
        }
      }
    }, 2000); 

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="home-container">
      
      <header className="header">
        <div className="header-content">
          <h1>Welcome to BookHaven</h1>
          <p>"Explore Book Reviews & Share Your Thoughts on Your Favorite Reads!"







</p>
        
        </div>
      </header>

      
      <div className="image-row" ref={scrollContainerRef}>
        {[...Array(12)].map((_, index) => (
          <div key={index} className="book-cardhome">
            <img
              src={`src/assets/${index + 1}.jpg`}
              alt={`Book ${index + 1}`}
              className="book-img"
            />
          </div>
        ))}
      </div>

      
      <section className="cta-section">
        <h2>Join BookHaven Today</h2>
        <p>Connect with a community of book lovers and start sharing your reviews.</p>
        <button className="join-btn">Sign Up</button>
        <button className="Join-btn">Login</button>
      </section>
    </div>
  );
};

export default Home;