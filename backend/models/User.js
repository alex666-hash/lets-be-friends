const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    minlength: 6
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'prefer-not-to-say']
  },
  interestedIn: {
    type: String,
    enum: ['male', 'female', 'everyone']
  },
  
  // Profile
  bio: String,
  avatar: String,
  photos: [String],
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  city: String,
  state: String,
  country: String,
  shareLocation: {
    type: Boolean,
    default: false
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  faceVerificationToken: String,
  faceVerificationImages: [String],
  faceVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  
  // Authentication Methods
  authProviders: {
    google: String,
    facebook: String,
    tiktok: String,
    instagram: String,
    local: Boolean
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  bannedDate: Date,
  
  // Admin/Owner Roles
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user'
  },
  
  // Preferences
  preferences: {
    ageRange: {
      min: Number,
      max: Number
    },
    distanceRange: {
      type: Number,
      default: 50
    }
  },
  
  // Safety & Content Moderation
  contentWarnings: {
    type: Number,
    default: 0
  },
  violatedChatMessages: [String],
  suspiciousActivityCount: {
    type: Number,
    default: 0
  },
  
  // Achievements & Gamification
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  
  // Statistics
  likes: {
    given: [mongoose.Schema.Types.ObjectId],
    received: [mongoose.Schema.Types.ObjectId]
  },
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: Date
});

// Create geospatial index for location-based queries
userSchema.index({ 'location.coordinates': '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get safe user data (exclude sensitive fields)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.faceVerificationToken;
  delete user.violatedChatMessages;
  return user;
};

module.exports = mongoose.model('User', userSchema);
