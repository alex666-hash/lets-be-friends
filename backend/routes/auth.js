const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, getCurrentUser } = require('../controllers/authController');

// Local authentication only (email/password)
router.post('/register', register);
router.post('/login', login);

// Get current user
router.get('/me', auth, getCurrentUser);

// OAuth endpoints disabled - return info message
router.get('/google', (req, res) => {
  res.status(503).json({ 
    success: false, 
    message: 'Google OAuth not configured. Please use email/password login.' 
  });
});

router.get('/facebook', (req, res) => {
  res.status(503).json({ 
    success: false, 
    message: 'Facebook OAuth not configured. Please use email/password login.' 
  });
});

module.exports = router;
