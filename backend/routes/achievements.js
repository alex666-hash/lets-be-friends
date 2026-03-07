const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserAchievements,
  getAllAchievements,
  getAllItems,
  unlockAchievement,
  purchaseItem
} = require('../controllers/achievementController');

// Get user achievements
router.get('/user', auth, getUserAchievements);

// Get all achievements and items
router.get('/', getAllAchievements);
router.get('/items', getAllItems);

// Unlock achievement
router.post('/unlock', auth, unlockAchievement);

// Purchase item
router.post('/item/purchase', auth, purchaseItem);

module.exports = router;
