const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // References the 'Job' model
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Success', 'Failure'] // Simple status
  },
  statusCode: {
    type: Number,
    required: true
  },
  responseSnippet: {
    type: String,
    trim: true,
    default: "",
    // Limit the snippet to 500 chars to avoid saving huge responses
    maxlength: [500, 'Response snippet cannot be more than 500 characters']
  }
}, {
  // We only care about when the log was created
  timestamps: { createdAt: true, updatedAt: false } 
});

// Create an index on the 'job' field for faster log lookups by job
logSchema.index({ job: 1 });

// Create a TTL (Time To Live) index.
// This will automatically delete logs after 30 days.
// This is critical for keeping your database from getting full!
logSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 2592000 }); // 30 days

const Log = mongoose.model('Log', logSchema);

module.exports = Log;