const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const { register, login, googleCallback, facebookCallback, getCurrentUser } = require('../controllers/authController');

// Local authentication
router.post('/register', register);
router.post('/login', login);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), facebookCallback);

// Get current user
router.get('/me', auth, getCurrentUser);

module.exports = router;
