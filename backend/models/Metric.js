const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  provider: {
    type: String,
    required: true,
    enum: ['aws', 'gcp', 'azure', 'digitalocean'],
    index: true,
  },
  metricType: {
    type: String,
    required: true,
    enum: ['billing', 'cpu', 'memory', 'storage', 'latency', 'throughput', 'health'],
  },
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  resourceId: {
    type: String,
    default: '',
  },
  resourceName: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Create compound index for efficient queries
metricSchema.index({ userId: 1, provider: 1, metricType: 1, timestamp: -1 });

module.exports = mongoose.model('Metric', metricSchema);

