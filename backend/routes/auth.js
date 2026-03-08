const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const { register, login, googleCallback, facebookCallback, getCurrentUser } = require('../controllers/authController');

// Dummy middleware for disabled OAuth
const dummyOAuth = (req, res) => {
  res.status(503).json({ success: false, message: 'OAuth not configured' });
};

// Local authentication
router.post('/register', register);
router.post('/login', login);

// Google OAuth - only if credentials provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);
} else {
  router.get('/google', dummyOAuth);
  router.get('/google/callback', dummyOAuth);
}

// Facebook OAuth - only if credentials provided
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), facebookCallback);
} else {
  router.get('/facebook', dummyOAuth);
  router.get('/facebook/callback', dummyOAuth);
}

// Get current user
router.get('/me', auth, getCurrentUser);

module.exports = router;
