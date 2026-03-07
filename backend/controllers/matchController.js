const Match = require('../models/Match');
const User = require('../models/User');
const { findMatches } = require('../utils/matching');

/**
 * Get user matches
 */
const getMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { userId1: req.userId, isActive: true },
        { userId2: req.userId, isActive: true }
      ]
    })
    .populate('userId1 userId2', '-password -violatedChatMessages')
    .sort({ matchedAt: -1 });
    
    res.json({
      success: true,
      matches
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Find potential matches
 */
const findPotentialMatches = async (req, res) => {
  try {
    const matches = await findMatches(req.userId, User);
    
    // Filter out already matched users
    const userMatches = await Match.find({
      $or: [
        { userId1: req.userId },
        { userId2: req.userId }
      ]
    });
    
    const matchedUserIds = userMatches.flatMap(m => [
      m.userId1.toString(),
      m.userId2.toString()
    ]);
    
    const potentialMatches = matches.filter(m => 
      !matchedUserIds.includes(m.user._id.toString())
    );
    
    res.json({
      success: true,
      matches: potentialMatches.slice(0, 20)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create match (when two users like each other)
 */
const createMatch = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    
    // Check if both users have liked each other
    const currentUser = await User.findById(req.userId);
    const targetUser = await User.findById(targetUserId);
    
    const mutualLike = currentUser.likes.given.includes(targetUserId) &&
                       targetUser.likes.given.includes(req.userId);
    
    if (!mutualLike) {
      return res.status(400).json({ success: false, message: 'Not a mutual like' });
    }
    
    // Check if match already exists
    const existingMatch = await Match.findOne({
      $or: [
        { userId1: req.userId, userId2: targetUserId },
        { userId1: targetUserId, userId2: req.userId }
      ]
    });
    
    if (existingMatch) {
      return res.status(400).json({ success: false, message: 'Match already exists' });
    }
    
    // Create match
    const match = new Match({
      userId1: req.userId,
      userId2: targetUserId,
      compatibility: 75 // This would be calculated more precisely
    });
    
    await match.save();
    
    // Add to user's matches
    currentUser.matches.push(targetUserId);
    targetUser.matches.push(req.userId);
    await currentUser.save();
    await targetUser.save();
    
    res.status(201).json({
      success: true,
      message: 'Match created successfully',
      match
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Block user
 */
const blockUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    
    const match = await Match.findOne({
      $or: [
        { userId1: req.userId, userId2: targetUserId },
        { userId1: targetUserId, userId2: req.userId }
      ]
    });
    
    if (match) {
      match.isActive = false;
      match.blockedBy = req.userId;
      await match.save();
    }
    
    res.json({
      success: true,
      message: 'User blocked successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Unblock user
 */
const unblockUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    
    const match = await Match.findOne({
      $or: [
        { userId1: req.userId, userId2: targetUserId },
        { userId1: targetUserId, userId2: req.userId }
      ]
    });
    
    if (match) {
      match.isActive = true;
      match.blockedBy = null;
      await match.save();
    }
    
    res.json({
      success: true,
      message: 'User unblocked successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMatches,
  findPotentialMatches,
  createMatch,
  blockUser,
  unblockUser
};
