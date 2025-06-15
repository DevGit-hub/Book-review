import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import book_logo from '../../assets/Book-logo2.png';
import search_logo from '../../assets/search2.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={book_logo} alt="Book Logo" className="logo" />
      
      <div className="nav-content">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/browse">Browse</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>

        {/* <div className="search-box">
          <input type="text" placeholder="Search books..." />
          <img src={search_logo} alt="Search Icon" />
        </div> */}

        <div className="auth-buttons">
          <Link to="/login">
            <button className="btn btn-login">Log In</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-signup">Sign Up</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
