const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  type: {
    type: String,
    enum: ['badge', 'theme', 'frame', 'effect']
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary']
  },
  cost: {
    type: Number,
    default: 0
  },
  costType: {
    type: String,
    enum: ['free', 'points', 'premium']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', itemSchema);
