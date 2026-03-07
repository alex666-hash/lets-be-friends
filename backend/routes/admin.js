const express = require('express');
const router = express.Router();
const { adminAuth, ownerAuth } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All admin routes require admin or owner authentication

// User Management
router.get('/users', adminAuth, adminController.getAllUsers);
router.get('/users/:userId', adminAuth, adminController.getUserDetails);
router.post('/users/:userId/ban', adminAuth, adminController.banUser);
router.post('/users/:userId/unban', adminAuth, adminController.unbanUser);
router.put('/users/:userId/role', ownerAuth, adminController.updateUserRole); // Only owner can change roles
router.delete('/users/:userId', ownerAuth, adminController.deleteUser); // Only owner can delete
router.post('/users/:userId/reset-warnings', adminAuth, adminController.resetUserWarnings);

// Moderation
router.get('/moderation/logs', adminAuth, adminController.getModerationLogs);

// Statistics
router.get('/stats', adminAuth, adminController.getPlatformStats);

module.exports = router;
