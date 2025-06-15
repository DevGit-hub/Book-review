import React from 'react';
import Navbar from './Components/Navbar/Navbar';
import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import About from './pages/aboutus';
import Browse from './pages/browse';
import Home from './pages/Home';
import Login from './pages/login';  
import Signup from './pages/signup';  
import AdminPanel from './pages/AdminPanel';
import Review from "./pages/Review";
import Books from "./pages/Books";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <div className='container'>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/books" element={<Books />} />
        <Route path="/review/:title" element={<Review />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;