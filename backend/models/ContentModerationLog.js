const mongoose = require('mongoose');

const contentModerationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  violationType: {
    type: String,
    enum: ['sexual_content', 'offensive_language', 'spam', 'threat', 'harassment']
  },
  content: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical']
  },
  action: {
    type: String,
    enum: ['warning', 'message_deleted', 'temporary_ban', 'permanent_ban']
  },
  actionTaken: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ContentModerationLog', contentModerationLogSchema);
