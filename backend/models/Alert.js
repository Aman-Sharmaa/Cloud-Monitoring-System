const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
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
  },
  alertType: {
    type: String,
    required: true,
    enum: ['cost', 'cpu', 'memory', 'storage', 'performance', 'health'],
  },
  threshold: {
    type: Number,
    required: true,
  },
  currentValue: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  triggered: {
    type: Boolean,
    default: true,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  resolvedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Alert', alertSchema);

