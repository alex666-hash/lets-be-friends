const User = require('../models/User');
const Achievement = require('../models/Achievement');
const Item = require('../models/Item');

/**
 * Get user achievements
 */
const getUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('achievements items');
    
    res.json({
      success: true,
      achievements: user.achievements,
      items: user.items,
      points: user.points,
      level: user.level
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all available achievements
 */
const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    
    res.json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all items
 */
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    
    res.json({
      success: true,
      items
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Unlock achievement
 */
const unlockAchievement = async (req, res) => {
  try {
    const { achievementId } = req.body;
    
    const user = await User.findById(req.userId);
    const achievement = await Achievement.findById(achievementId);
    
    if (user.achievements.includes(achievementId)) {
      return res.status(400).json({ success: false, message: 'Achievement already unlocked' });
    }
    
    user.achievements.push(achievementId);
    user.points += achievement.rewardPoints;
    
    // Check for level up
    const pointsPerLevel = 100;
    const newLevel = Math.floor(user.points / pointsPerLevel) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Achievement unlocked',
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Purchase item
 */
const purchaseItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    
    const user = await User.findById(req.userId);
    const item = await Item.findById(itemId);
    
    if (user.items.includes(itemId)) {
      return res.status(400).json({ success: false, message: 'Item already owned' });
    }
    
    if (item.costType === 'points') {
      if (user.points < item.cost) {
        return res.status(400).json({ success: false, message: 'Insufficient points' });
      }
      user.points -= item.cost;
    }
    
    user.items.push(itemId);
    await user.save();
    
    res.json({
      success: true,
      message: 'Item purchased successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserAchievements,
  getAllAchievements,
  getAllItems,
  unlockAchievement,
  purchaseItem
};
