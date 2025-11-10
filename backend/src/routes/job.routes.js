const express = require('express');
const router = express.Router();

// Import our authentication middleware
const { protect } = require('../middleware/auth.middleware');

// We will create these controller functions in the next step
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
} = require('../controllers/job.controller.js');

// --- Protected Routes ---
// We apply the 'protect' middleware to all routes in this file.
// Any request to /api/jobs/* will first have to pass the 'protect' function.

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private
router.post('/', protect, createJob);

// @route   GET /api/jobs
// @desc    Get all jobs for the logged-in user
// @access  Private
router.get('/', protect, getAllJobs);

// @route   GET /api/jobs/:id
// @desc    Get a single job by its ID
// @access  Private
router.get('/:id', protect, getJobById);

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', protect, updateJob);

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', protect, deleteJob);

module.exports = router;