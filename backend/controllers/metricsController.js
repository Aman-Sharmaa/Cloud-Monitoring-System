const Metric = require('../models/Metric');
const Alert = require('../models/Alert');

// @desc    Get aggregated metrics for dashboard
// @route   GET /api/metrics/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const { provider } = req.query;
    const userId = req.user._id;

    // Build query
    const query = { userId };
    if (provider && provider !== 'all') {
      query.provider = provider;
    }

    // Get latest metrics for each type
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

    const latestMetrics = await Metric.aggregate([
      {
        $match: {
          ...query,
          timestamp: { $gte: oneDayAgo },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: { provider: '$provider', metricType: '$metricType' },
          value: { $first: '$value' },
          unit: { $first: '$unit' },
          timestamp: { $first: '$timestamp' },
        },
      },
    ]);

    // Get recent alerts
    const recentAlerts = await Alert.find({
      userId,
      resolved: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate aggregated metrics
    const billing = latestMetrics.filter(m => m._id.metricType === 'billing');
    const totalBilling = billing.reduce((sum, m) => sum + m.value, 0);

    const cpu = latestMetrics.filter(m => m._id.metricType === 'cpu');
    const avgCpu = cpu.length > 0 ? cpu.reduce((sum, m) => sum + m.value, 0) / cpu.length : 0;

    const memory = latestMetrics.filter(m => m._id.metricType === 'memory');
    const avgMemory = memory.length > 0 ? memory.reduce((sum, m) => sum + m.value, 0) / memory.length : 0;

    const storage = latestMetrics.filter(m => m._id.metricType === 'storage');
    const avgStorage = storage.length > 0 ? storage.reduce((sum, m) => sum + m.value, 0) / storage.length : 0;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalBilling: totalBilling.toFixed(2),
          avgCpu: avgCpu.toFixed(2),
          avgMemory: avgMemory.toFixed(2),
          avgStorage: avgStorage.toFixed(2),
        },
        metrics: latestMetrics,
        alerts: recentAlerts,
      },
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard metrics',
    });
  }
};

// @desc    Get billing metrics for a provider
// @route   GET /api/metrics/:provider/billing
// @access  Private
const getBilling = async (req, res) => {
  try {
    const { provider } = req.params;
    const { days = 7 } = req.query;
    const userId = req.user._id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const metrics = await Metric.find({
      userId,
      provider,
      metricType: 'billing',
      timestamp: { $gte: startDate },
    }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Billing metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching billing metrics',
    });
  }
};

// @desc    Get resource metrics for a provider
// @route   GET /api/metrics/:provider/resources
// @access  Private
const getResources = async (req, res) => {
  try {
    const { provider } = req.params;
    const { days = 7 } = req.query;
    const userId = req.user._id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const metrics = await Metric.find({
      userId,
      provider,
      metricType: { $in: ['cpu', 'memory', 'storage'] },
      timestamp: { $gte: startDate },
    }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Resource metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resource metrics',
    });
  }
};

// @desc    Get performance metrics for a provider
// @route   GET /api/metrics/:provider/performance
// @access  Private
const getPerformance = async (req, res) => {
  try {
    const { provider } = req.params;
    const { days = 7 } = req.query;
    const userId = req.user._id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const metrics = await Metric.find({
      userId,
      provider,
      metricType: { $in: ['latency', 'throughput'] },
      timestamp: { $gte: startDate },
    }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching performance metrics',
    });
  }
};

// @desc    Get all metrics for a provider
// @route   GET /api/metrics/:provider/all
// @access  Private
const getAllMetrics = async (req, res) => {
  try {
    const { provider } = req.params;
    const { days = 7, type } = req.query;
    const userId = req.user._id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const query = {
      userId,
      provider,
      timestamp: { $gte: startDate },
    };

    if (type) {
      query.metricType = type;
    }

    const metrics = await Metric.find(query).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Get all metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching metrics',
    });
  }
};

// @desc    Seed sample metrics (for development)
// @route   POST /api/metrics/seed
// @access  Private
const seedMetrics = async (req, res) => {
  try {
    const userId = req.user._id;
    const providers = ['aws', 'gcp', 'azure', 'digitalocean'];
    const metrics = [];

    // Generate sample data for the last 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);

      for (const provider of providers) {
        // Billing
        metrics.push({
          userId,
          provider,
          metricType: 'billing',
          value: Math.random() * 500 + 100,
          unit: 'USD',
          timestamp: new Date(date.setHours(0, 0, 0, 0)),
        });

        // CPU
        metrics.push({
          userId,
          provider,
          metricType: 'cpu',
          value: Math.random() * 40 + 40,
          unit: '%',
          timestamp: new Date(date.setHours(12, 0, 0, 0)),
        });

        // Memory
        metrics.push({
          userId,
          provider,
          metricType: 'memory',
          value: Math.random() * 30 + 50,
          unit: '%',
          timestamp: new Date(date.setHours(12, 0, 0, 0)),
        });

        // Storage
        metrics.push({
          userId,
          provider,
          metricType: 'storage',
          value: Math.random() * 20 + 60,
          unit: '%',
          timestamp: new Date(date.setHours(12, 0, 0, 0)),
        });

        // Latency
        metrics.push({
          userId,
          provider,
          metricType: 'latency',
          value: Math.random() * 100 + 50,
          unit: 'ms',
          timestamp: new Date(date.setHours(12, 0, 0, 0)),
        });

        // Throughput
        metrics.push({
          userId,
          provider,
          metricType: 'throughput',
          value: Math.random() * 1000 + 500,
          unit: 'req/s',
          timestamp: new Date(date.setHours(12, 0, 0, 0)),
        });
      }
    }

    await Metric.insertMany(metrics);

    res.status(201).json({
      success: true,
      message: 'Sample metrics seeded successfully',
      count: metrics.length,
    });
  } catch (error) {
    console.error('Seed metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding metrics',
    });
  }
};

// @desc    Delete all metrics for user
// @route   DELETE /api/metrics/clear
// @access  Private
const clearMetrics = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const result = await Metric.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'Metrics cleared successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Clear metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing metrics',
    });
  }
};

module.exports = {
  getDashboard,
  getBilling,
  getResources,
  getPerformance,
  getAllMetrics,
  seedMetrics,
  clearMetrics,
};

