const User = require('../models/User');
const { calculateProfileCompleteness } = require('../utils/matching');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('achievements items');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user: user.toJSON(),
      profileCompleteness: calculateProfileCompleteness(user)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, gender, interestedIn, dateOfBirth, preferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        bio,
        gender,
        interestedIn,
        dateOfBirth,
        preferences,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON(),
      profileCompleteness: calculateProfileCompleteness(user)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update location
 */
const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, city, state, country } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        city,
        state,
        country,
        shareLocation: true
      },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Location updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Upload avatar
 */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'lets-be-friends/avatars',
      resource_type: 'auto'
    });
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar: result.secure_url },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Upload photos
 */
const uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided' });
    }
    
    const photos = [];
    
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'lets-be-friends/photos',
        resource_type: 'auto'
      });
      photos.push(result.secure_url);
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { photos: { $each: photos } } },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Photos uploaded successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Search users
 */
const searchUsers = async (req, res) => {
  try {
    const { firstName, city, gender } = req.query;
    
    const query = {
      _id: { $ne: req.userId },
      isActive: true,
      isBanned: false
    };
    
    if (firstName) query.firstName = { $regex: firstName, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (gender) query.gender = gender;
    
    const users = await User.find(query).limit(50);
    
    res.json({
      success: true,
      users: users.map(u => u.toJSON())
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Like/Unlike user
 */
const likeUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (user.likes.given.includes(targetUserId)) {
      // Unlike
      user.likes.given = user.likes.given.filter(id => id.toString() !== targetUserId);
    } else {
      // Like
      user.likes.given.push(targetUserId);
    }
    
    await user.save();
    
    // Update received likes for target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser.likes.received.includes(req.userId)) {
      targetUser.likes.received.push(req.userId);
      await targetUser.save();
    }
    
    res.json({
      success: true,
      message: 'Like updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateLocation,
  uploadAvatar,
  uploadPhotos,
  searchUsers,
  likeUser
};
