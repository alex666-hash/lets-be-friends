const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getModerationLogs,
  reportUser,
  reviewLog
} = require('../controllers/moderationController');

// User can report others
router.post('/report', auth, reportUser);

// Admin routes (would need admin middleware)
router.get('/logs', getModerationLogs);
router.post('/review', reviewLog);

module.exports = router;
