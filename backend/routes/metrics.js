const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboard,
  getBilling,
  getResources,
  getPerformance,
  getAllMetrics,
  seedMetrics,
  clearMetrics,
} = require('../controllers/metricsController');

// All routes are protected
router.use(protect);

// Dashboard and aggregated metrics
router.get('/dashboard', getDashboard);

// Provider-specific metrics
router.get('/:provider/billing', getBilling);
router.get('/:provider/resources', getResources);
router.get('/:provider/performance', getPerformance);
router.get('/:provider/all', getAllMetrics);

// Seed and manage metrics
router.post('/seed', seedMetrics);
router.delete('/clear', clearMetrics);

module.exports = router;

