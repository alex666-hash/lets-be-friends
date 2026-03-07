const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMessages,
  sendMessage,
  deleteMessage,
  markAsRead
} = require('../controllers/messageController');

router.get('/:targetUserId', auth, getMessages);
router.post('/', auth, sendMessage);
router.delete('/:messageId', auth, deleteMessage);
router.put('/:messageId/read', auth, markAsRead);

module.exports = router;
