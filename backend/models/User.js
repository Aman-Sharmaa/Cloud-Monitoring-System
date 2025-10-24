const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  cloudProviders: {
    aws: {
      connected: { type: Boolean, default: false },
      accessKeyId: { type: String, default: '' },
      secretAccessKey: { type: String, default: '' },
      region: { type: String, default: 'us-east-1' },
    },
    gcp: {
      connected: { type: Boolean, default: false },
      projectId: { type: String, default: '' },
      serviceAccountKey: { type: String, default: '' },
    },
    azure: {
      connected: { type: Boolean, default: false },
      subscriptionId: { type: String, default: '' },
      tenantId: { type: String, default: '' },
      clientId: { type: String, default: '' },
      clientSecret: { type: String, default: '' },
    },
    digitalocean: {
      connected: { type: Boolean, default: false },
      apiToken: { type: String, default: '' },
    },
  },
  alertSettings: {
    costThreshold: { type: Number, default: 1000 },
    cpuThreshold: { type: Number, default: 80 },
    memoryThreshold: { type: Number, default: 80 },
    storageThreshold: { type: Number, default: 90 },
    notificationsEnabled: { type: Boolean, default: true },
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

