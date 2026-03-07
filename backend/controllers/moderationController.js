const ContentModerationLog = require('../models/ContentModerationLog');
const User = require('../models/User');
const Message = require('../models/Message');
const { checkMessage } = require('../utils/moderation');

/**
 * Get moderation logs for admin
 */
const getModerationLogs = async (req, res) => {
  try {
    const logs = await ContentModerationLog.find()
      .populate('userId', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      logs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Report user
 */
const reportUser = async (req, res) => {
  try {
    const { targetUserId, reason, details } = req.body;
    
    const report = new ContentModerationLog({
      userId: targetUserId,
      violationType: reason,
      content: details,
      severity: 'medium',
      actionTaken: false
    });
    
    await report.save();
    
    res.status(201).json({
      success: true,
      message: 'Report submitted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Review moderation log
 */
const reviewLog = async (req, res) => {
  try {
    const { logId, action } = req.body;
    
    const log = await ContentModerationLog.findByIdAndUpdate(
      logId,
      { action, actionTaken: true },
      { new: true }
    );
    
    // Execute action if needed
    if (action === 'temporary_ban') {
      const user = await User.findByIdAndUpdate(
        log.userId,
        {
          isBanned: true,
          banReason: `Temporary ban for: ${log.violationType}`,
          bannedDate: new Date()
        }
      );
      
      // TODO: Schedule unban after 24 hours
    } else if (action === 'permanent_ban') {
      await User.findByIdAndUpdate(
        log.userId,
        {
          isBanned: true,
          banReason: `Permanent ban for: ${log.violationType}`,
          bannedDate: new Date()
        }
      );
    }
    
    res.json({
      success: true,
      message: 'Moderation action completed',
      log
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getModerationLogs,
  reportUser,
  reviewLog
};
