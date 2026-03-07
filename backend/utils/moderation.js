const axios = require('axios');
const User = require('../models/User');
const ContentModerationLog = require('../models/ContentModerationLog');

const SEXUAL_KEYWORDS = [
  'sexy', 'sex', 'porn', 'nsfw', 'explicit', 'naked', 'xxx', 'adult',
  'horny', 'nudes', 'booty', 'cock', 'pussy', 'dick', 'tits', 'ass hole',
  'masturbate', 'cum', 'orgasm', 'fuck', 'sexual encounter', 'meet for sex'
];

const OFFENSIVE_KEYWORDS = [
  'bitch', 'asshole', 'bastard', 'damn', 'hell', 'crap'
];

const SPAM_PATTERNS = [
  /http[s]?:\/\/[^\s]+/gi, // URLs
  /([a-zA-Z0-9]{10,})/g // Long character sequences
];

/**
 * Moderate text content for violations
 */
const moderateContent = (text) => {
  const violations = [];
  const lowerText = text.toLowerCase();
  
  // Check for sexual content
  for (const keyword of SEXUAL_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      violations.push('sexual_content');
      break;
    }
  }
  
  // Check for offensive language
  for (const keyword of OFFENSIVE_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      violations.push('offensive_language');
      break;
    }
  }
  
  // Check for spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      violations.push('spam');
      break;
    }
  }
  
  return violations;
};

/**
 * Log and handle content violations
 */
const logViolation = async (userId, messageId, violationType, content, severity = 'medium') => {
  try {
    await ContentModerationLog.create({
      userId,
      messageId,
      violationType,
      content,
      severity,
      actionTaken: false
    });
    
    // Update user violation count
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $inc: { contentWarnings: 1 },
        $push: { violatedChatMessages: messageId }
      },
      { new: true }
    );
    
    // Auto-ban if too many violations
    if (user.contentWarnings >= 3) {
      await User.findByIdAndUpdate(userId, {
        isBanned: true,
        banReason: 'Automatic ban due to multiple content violations',
        bannedDate: new Date()
      });
      
      return { banned: true, reason: 'Multiple content violations detected' };
    }
    
    return { banned: false };
  } catch (error) {
    console.error('Error logging violation:', error);
    throw error;
  }
};

/**
 * Check and moderate a message
 */
const checkMessage = async (userId, messageId, content) => {
  const violations = moderateContent(content);
  
  if (violations.length > 0) {
    const severity = violations.includes('sexual_content') ? 'high' : 'medium';
    const result = await logViolation(userId, messageId, violations[0], content, severity);
    
    return {
      hasViolations: true,
      violations,
      banned: result.banned
    };
  }
  
  return {
    hasViolations: false,
    violations: [],
    banned: false
  };
};

module.exports = {
  moderateContent,
  logViolation,
  checkMessage
};
