const Job = require('../models/job.model');
const Log = require('../models/log.model');
const scheduler = require('../services/scheduler.service');

// @desc    Create a new job
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { name, url, httpMethod, cronSchedule, payload } = req.body;

    // Basic validation
    if (!name || !url || !httpMethod || !cronSchedule) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const job = new Job({
      name,
      url,
      httpMethod,
      cronSchedule,
      payload: payload || null,
      user: req.user._id, // We get this from the 'protect' middleware
    });

    const createdJob = await job.save();

    // TODO: Add job to the actual scheduler 
    if (createdJob.isEnabled) {
      scheduler.startJob(createdJob);
    }

    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all jobs for the logged-in user
// @route   GET /api/jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single job by its ID
// @route   GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Security check: Make sure the job belongs to the logged-in user
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Security check: Make sure the job belongs to the logged-in user
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update the fields from the request body
    const { name, url, httpMethod, cronSchedule, payload, isEnabled } = req.body;
    job.name = name || job.name;
    job.url = url || job.url;
    job.httpMethod = httpMethod || job.httpMethod;
    job.cronSchedule = cronSchedule || job.cronSchedule;
    job.payload = payload !== undefined ? payload : job.payload;
    job.isEnabled = isEnabled !== undefined ? isEnabled : job.isEnabled;

    const updatedJob = await job.save();

    // TODO: Update the job in the actual scheduler 
    // Stop the old job first
    scheduler.stopJob(updatedJob._id);
    // If the job is still enabled, start it again with new settings
    if (updatedJob.isEnabled) {
      scheduler.startJob(updatedJob);
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Security check: Make sure the job belongs to the logged-in user
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Before deleting the job, delete all associated logs
    await Log.deleteMany({ job: job._id });

    // Now remove the job
    await job.deleteOne(); // Use deleteOne() on the document

    // Remove the job from the actual scheduler 
    scheduler.stopJob(job._id);

    res.status(200).json({ message: 'Job and associated logs removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// --- Export all the functions ---
module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};