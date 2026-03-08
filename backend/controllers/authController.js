const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail, sendWelcomeEmail } = require('../utils/email');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * Register new user
 */
const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    
    const { email, password, firstName, lastName } = value;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      email,
      password,
      firstName,
      lastName,
      authProviders: {
        local: true
      }
    });
    
    await user.save();
    
    // Send verification email (non-blocking - don't wait)
    try {
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${user._id}`;
      sendVerificationEmail(email, verificationLink).catch(err => {
        console.error('Verification email failed:', err.message);
      });
      
      // Send welcome email (non-blocking)
      sendWelcomeEmail(email, firstName).catch(err => {
        console.error('Welcome email failed:', err.message);
      });
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
      // Don't block registration if email fails
    }
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    
    const { email, password } = value;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Your account has been banned' });
    }
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Update last active
    user.lastActive = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Google OAuth callback
 */
const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
    
    const token = generateToken(req.user._id);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Facebook OAuth callback
 */
const facebookCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
    
    const token = generateToken(req.user._id);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('achievements items matches');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  googleCallback,
  facebookCallback,
  getCurrentUser
};
