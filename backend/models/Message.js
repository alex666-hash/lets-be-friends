const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isModerated: {
    type: Boolean,
    default: false
  },
  violationsDetected: [{
    type: String,
    enum: ['sexual_content', 'offensive_language', 'spam', 'threat']
  }],
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: String,
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  readAt: Date
});

module.exports = mongoose.model('Message', messageSchema);
