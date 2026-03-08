const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Local Strategy
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Invalid password' });
    }
    
    if (user.isBanned) {
      return done(null, false, { message: 'Your account has been banned' });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Google Strategy - only if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 'authProviders.google': profile.id });
      
      if (!user) {
        user = await User.findOne({ email: profile.emails?.[0]?.value });
        
        if (!user) {
          user = new User({
            email: profile.emails?.[0]?.value,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            avatar: profile.photos?.[0]?.value,
            authProviders: {
              google: profile.id
            },
            isVerified: true
          });
        } else {
          user.authProviders.google = profile.id;
        }
      }
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

// Facebook Strategy - only if credentials are provided
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 'authProviders.facebook': profile.id });
      
      if (!user) {
        user = await User.findOne({ email: profile.emails?.[0]?.value });
        
        if (!user) {
          user = new User({
            email: profile.emails?.[0]?.value,
            firstName: profile.displayName?.split(' ')[0],
            avatar: profile.photos?.[0]?.value,
            authProviders: {
              facebook: profile.id
            },
            isVerified: true
          });
        } else {
          user.authProviders.facebook = profile.id;
        }
      }
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
