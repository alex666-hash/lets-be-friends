const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Generate face verification token
 */
const generateVerificationToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const token = require('crypto').randomBytes(32).toString('hex');
    
    user.faceVerificationToken = token;
    await user.save();
    
    res.json({
      success: true,
      token,
      message: 'Verification token generated'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Submit face verification images
 */
const submitFaceVerification = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }
    
    if (req.files.length < 2) {
      return res.status(400).json({ success: false, message: 'At least 2 images required' });
    }
    
    const user = await User.findById(req.userId);
    const uploadedImages = [];
    
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'lets-be-friends/face-verification',
        resource_type: 'auto'
      });
      uploadedImages.push(result.secure_url);
    }
    
    user.faceVerificationImages = uploadedImages;
    user.verificationDate = new Date();
    
    // Simulate face verification (In production, use a proper AI service)
    // This would use a library like face-api.js or a cloud service
    user.faceVerified = true;
    user.isVerified = true;
    user.level = Math.min(user.level + 1, 10);
    user.points += 50;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Face verification submitted successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get verification status
 */
const getVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    res.json({
      success: true,
      verification: {
        isVerified: user.isVerified,
        faceVerified: user.faceVerified,
        verificationDate: user.verificationDate,
        imagesSubmitted: user.faceVerificationImages.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateVerificationToken,
  submitFaceVerification,
  getVerificationStatus
};
