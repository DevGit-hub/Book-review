import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: '', // Match backend field name
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Login form data:', formData);

      // Send login request to the backend
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the form data directly
      });

      // Parse the response as JSON
      const data = await response.json();
      console.log("User data "+JSON.stringify(data.data.user));

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      

      // Check if user is admin and redirect accordingly
      if (JSON.stringify(data.data.user.isAdmin)) {
        console.log('Admin login successful, redirecting to admin dashboard');
        navigate('/admin');
      } else {
        console.log('User login successful, redirecting to books page');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <input
              type="text"
              name="emailOrUsername" // Match backend field name
              value={formData.emailOrUsername}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account?{' '}
          <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;