const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  badgeColor: String,
  criteria: {
    type: String,
    enum: ['profile_complete', 'first_match', 'verified_user', 'messages_sent', 'profile_photo', 'bio_written', 'social_connected']
  },
  rewardPoints: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);
