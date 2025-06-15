const express = require('express');
const router = express.Router();
const db = require('../database'); 
const bcrypt = require('bcrypt');

// Middleware to parse JSON request bodies
router.use(express.json());

// Signup route
router.post('/signup', async (req, res) => {
  const { email, username, password, isAdmin } = req.body;

  console.log('Received signup data:', { email, username, password, isAdmin });

  // Validate required fields
  if (!email || !username || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insert the user into the database
  const query = `
    INSERT INTO users (email, username, password, isAdmin)
    VALUES (?, ?, ?, ?)
  `;
  const params = [email, username, hashedPassword, isAdmin || false];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Error inserting user into database:', err.message);

      // Handle duplicate email or username
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ success: false, message: 'Email or username already exists' });
      }

      return res.status(500).json({ success: false, message: 'Error creating user' });
    }

    // Successfully inserted user
    console.log(`User inserted with ID: ${this.lastID}`);
    res.json({
      success: true,
      message: 'Signup successful',
      data: {
        token: 'example-token', // Replace with a real token in a real application
        user: { id: this.lastID, email, username, isAdmin },
      },
    });
  });
});

router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  console.log('Received login data:', { emailOrUsername, password });

  // Validate required fields
  if (!emailOrUsername || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Find the user by email or username
  const query = `
    SELECT * FROM users
    WHERE email = ? OR username = ?
  `;
  const params = [emailOrUsername, emailOrUsername];

  db.get(query, params, async (err, user) => {
    if (err) {
      console.error('Error finding user in database:', err.message);
      return res.status(500).json({ success: false, message: 'Error during login' });
    }

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email/username or password' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email/username or password' });
    }

    // Successfully authenticated
    console.log(`User logged in with ID: ${user.id}`);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: 'example-token', // Replace with a real token in a real application
        user: { id: user.id, email: user.email, username: user.username, isAdmin: user.isAdmin },
      },
    });
  });
  
});



module.exports = router;