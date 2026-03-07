const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  generateVerificationToken,
  submitFaceVerification,
  getVerificationStatus
} = require('../controllers/verificationController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/token/generate', auth, generateVerificationToken);
router.post('/face/submit', auth, upload.array('images'), submitFaceVerification);
router.get('/status', auth, getVerificationStatus);

module.exports = router;
