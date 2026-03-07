const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  userId1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userId2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  compatibility: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  matchedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  blockedBy: mongoose.Schema.Types.ObjectId,
  lastMessageAt: Date,
  messageCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Match', matchSchema);
