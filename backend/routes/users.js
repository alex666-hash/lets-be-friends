const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  updateLocation,
  uploadAvatar,
  uploadPhotos,
  searchUsers,
  likeUser
} = require('../controllers/userController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Profile routes
router.get('/:userId', getProfile);
router.put('/profile/update', auth, updateProfile);
router.put('/location/update', auth, updateLocation);

// Upload routes
router.post('/avatar/upload', auth, upload.single('avatar'), uploadAvatar);
router.post('/photos/upload', auth, upload.array('photos'), uploadPhotos);

// Search and interaction
router.get('/search', auth, searchUsers);
router.post('/like', auth, likeUser);

module.exports = router;
