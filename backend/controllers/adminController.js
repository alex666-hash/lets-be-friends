const User = require('../models/User');
const ContentModerationLog = require('../models/ContentModerationLog');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, status } = req.query;
    let query = {};

    if (role) query.role = role;
    if (status) {
      if (status === 'banned') query.isBanned = true;
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;
    }
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').limit(100);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ban user
exports.banUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isBanned: true,
        banReason: reason || 'Admin ban',
        bannedDate: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User banned successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Unban user
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isBanned: false,
        banReason: null,
        bannedDate: null
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User unbanned successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user role (owner/admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin', 'owner'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User role updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get moderation logs
exports.getModerationLogs = async (req, res) => {
  try {
    const { userId, type, page = 1, limit = 50 } = req.query;
    let query = {};

    if (userId) query.userId = userId;
    if (type) query.violationType = type;

    const logs = await ContentModerationLog.find(query)
      .populate('userId', 'email username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ContentModerationLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get platform statistics
exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const verifiedUsers = await User.countDocuments({ faceVerified: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const violations = await ContentModerationLog.countDocuments();

    res.json({
      success: true,
      data: {
        totalUsers,
        bannedUsers,
        verifiedUsers,
        adminUsers,
        totalViolations: violations,
        activeUsers: totalUsers - bannedUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user account (permanent)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted permanently' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset user warnings
exports.resetUserWarnings = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        contentWarnings: 0,
        lastViolationDate: null
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User warnings reset', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
