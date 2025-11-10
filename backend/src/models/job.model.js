const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the 'User' model
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a job name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  url: {
    type: String,
    required: [true, 'Please provide a URL'],
    trim: true
  },
  httpMethod: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] // Valid HTTP methods
  },
  cronSchedule: {
    type: String,
    required: [true, 'Please provide a cron schedule string'],
    trim: true
  },
  payload: {
    type: mongoose.Schema.Types.Mixed, // Allows storing any JSON object
    default: null
  },
  isEnabled: {
    type: Boolean,
    default: true // Jobs are active by default
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create an index on the 'user' field for faster querying of jobs by user
jobSchema.index({ user: 1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;