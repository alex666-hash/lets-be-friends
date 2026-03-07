const Message = require('../models/Message');
const User = require('../models/User');
const { checkMessage } = require('../utils/moderation');

/**
 * Get messages between two users
 */
const getMessages = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { sender: req.userId, recipient: targetUserId },
        { sender: targetUserId, recipient: req.userId }
      ],
      isDeleted: false
    })
    .populate('sender recipient', '-password')
    .sort({ createdAt: 1 })
    .limit(100);
    
    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Send message
 */
const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    if (!content || !recipientId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Check for content violations
    const sender = await User.findById(req.userId);
    if (sender.isBanned) {
      return res.status(403).json({ success: false, message: 'Your account is banned' });
    }
    
    // Create message
    const message = new Message({
      sender: req.userId,
      recipient: recipientId,
      content
    });
    
    await message.save();
    
    // Run moderation check
    const moderation = await checkMessage(req.userId, message._id, content);
    
    if (moderation.hasViolations) {
      message.violationsDetected = moderation.violations;
      message.isFlagged = true;
      await message.save();
      
      if (moderation.banned) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been banned due to content violations'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Message contains prohibited content',
        violations: moderation.violations
      });
    }
    
    // Update match message count
    const Match = require('../models/Match');
    await Match.findOneAndUpdate(
      {
        $or: [
          { userId1: req.userId, userId2: recipientId },
          { userId1: recipientId, userId2: req.userId }
        ]
      },
      {
        lastMessageAt: new Date(),
        $inc: { messageCount: 1 }
      }
    );
    
    await message.populate('sender recipient', '-password');
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete message
 */
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId);
    
    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    message.isDeleted = true;
    await message.save();
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Mark message as read
 */
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await Message.findByIdAndUpdate(
      messageId,
      { readAt: new Date() },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  deleteMessage,
  markAsRead
};
