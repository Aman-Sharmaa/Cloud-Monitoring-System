const User = require('../models/User');
const Alert = require('../models/Alert');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile',
    });
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password',
    });
  }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    const { alertSettings, theme, cloudProviders } = req.body;

    const updateData = {};
    if (alertSettings) updateData.alertSettings = alertSettings;
    if (theme) updateData.theme = theme;
    if (cloudProviders) updateData.cloudProviders = cloudProviders;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
    });
  }
};

// @desc    Get user alerts
// @route   GET /api/users/alerts
// @access  Private
const getAlerts = async (req, res) => {
  try {
    const { resolved, limit = 50 } = req.query;
    
    const query = { userId: req.user._id };
    
    if (resolved !== undefined) {
      query.resolved = resolved === 'true';
    }

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts',
    });
  }
};

// @desc    Create a new alert
// @route   POST /api/users/alerts
// @access  Private
const createAlert = async (req, res) => {
  try {
    const { provider, alertType, threshold, currentValue, message, severity } = req.body;

    if (!provider || !alertType || !threshold || !currentValue || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const alert = await Alert.create({
      userId: req.user._id,
      provider,
      alertType,
      threshold,
      currentValue,
      message,
      severity: severity || 'medium',
    });

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert,
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating alert',
    });
  }
};

// @desc    Resolve an alert
// @route   PUT /api/users/alerts/:id/resolve
// @access  Private
const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { resolved: true, resolvedAt: new Date() },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert resolved successfully',
      data: alert,
    });
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resolving alert',
    });
  }
};

// @desc    Delete an alert
// @route   DELETE /api/users/alerts/:id
// @access  Private
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting alert',
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const Metric = require('../models/Metric');
    
    const userId = req.user._id;
    
    // Get total metrics count
    const metricsCount = await Metric.countDocuments({ userId });
    
    // Get alerts count
    const alertsCount = await Alert.countDocuments({ userId });
    const unresolvedAlertsCount = await Alert.countDocuments({ userId, resolved: false });
    
    // Get connected providers
    const user = await User.findById(userId).select('cloudProviders');
    const connectedProviders = Object.keys(user.cloudProviders).filter(
      provider => user.cloudProviders[provider].connected
    );

    res.status(200).json({
      success: true,
      data: {
        metricsCount,
        alertsCount,
        unresolvedAlertsCount,
        connectedProvidersCount: connectedProviders.length,
        connectedProviders,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  updateSettings,
  getAlerts,
  createAlert,
  resolveAlert,
  deleteAlert,
  getStats,
};

