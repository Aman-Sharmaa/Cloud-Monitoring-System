const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  updatePassword,
  updateSettings,
  getAlerts,
  createAlert,
  resolveAlert,
  deleteAlert,
  getStats,
} = require('../controllers/usersController');

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Password route
router.put('/password', updatePassword);

// Settings route
router.put('/settings', updateSettings);

// Alerts routes
router.get('/alerts', getAlerts);
router.post('/alerts', createAlert);
router.put('/alerts/:id/resolve', resolveAlert);
router.delete('/alerts/:id', deleteAlert);

// Statistics route
router.get('/stats', getStats);

module.exports = router;

