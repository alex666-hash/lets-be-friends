const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const { register, login, googleCallback, facebookCallback, getCurrentUser } = require('../controllers/authController');

// Dummy middleware for disabled OAuth
const dummyOAuth = (req, res) => {
  res.status(503).json({ success: false, message: 'OAuth not configured' });
};

// Safe OAuth middleware wrapper
const safeGoogleAuth = (req, res, next) => {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  }
  return dummyOAuth(req, res);
};

const safeGoogleCallback = (req, res, next) => {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    return passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
  }
  return dummyOAuth(req, res);
};

const safeFacebookAuth = (req, res, next) => {
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    return passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
  }
  return dummyOAuth(req, res);
};

const safeFacebookCallback = (req, res, next) => {
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    return passport.authenticate('facebook', { failureRedirect: '/login' })(req, res, next);
  }
  return dummyOAuth(req, res);
};

// Local authentication
router.post('/register', register);
router.post('/login', login);

// Google OAuth with safe wrapper
router.get('/google', safeGoogleAuth);
router.get('/google/callback', safeGoogleCallback, googleCallback);

// Facebook OAuth with safe wrapper
router.get('/facebook', safeFacebookAuth);
router.get('/facebook/callback', safeFacebookCallback, facebookCallback);

// Get current user
router.get('/me', auth, getCurrentUser);

module.exports = router;
