const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMatches,
  findPotentialMatches,
  createMatch,
  blockUser,
  unblockUser
} = require('../controllers/matchController');

router.get('/', auth, getMatches);
router.get('/potential', auth, findPotentialMatches);
router.post('/', auth, createMatch);
router.post('/block', auth, blockUser);
router.post('/unblock', auth, unblockUser);

module.exports = router;
