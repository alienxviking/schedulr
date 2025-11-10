const cron = require('node-cron');
const axios = require('axios');
const Job = require('../models/job.model');
const Log = require('../models/log.model');

// This object will hold all our active cron jobs,
// so we can start/stop them by their job ID.
const scheduledJobs = {};

/**
 * Executes the HTTP request for a job and logs the result.
 */
const executeJob = async (job) => {
  console.log(`Executing job: ${job.name} (ID: ${job._id})`);

  let logStatus = 'Failure';
  let statusCode = 500;
  let responseSnippet = '';

  try {
    // 1. Configure the request
    const config = {
      method: job.httpMethod,
      url: job.url,
      timeout: 10000, // 10 second timeout
    };

    // Add payload if it exists (for POST/PUT)
    if (job.payload && (job.httpMethod === 'POST' || job.httpMethod === 'PUT' || job.httpMethod === 'PATCH')) {
      config.data = job.payload;
    }

    // 2. Make the HTTP request
    const response = await axios(config);
    
    // 3. Request was successful
    logStatus = 'Success';
    statusCode = response.status;
    
    // Save a small snippet of the response
    if (response.data) {
      responseSnippet = JSON.stringify(response.data).substring(0, 500);
    }

  } catch (error) {
    // 4. Request failed
    console.error(`Job ${job.name} failed: ${error.message}`);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      statusCode = error.response.status;
      responseSnippet = JSON.stringify(error.response.data).substring(0, 500);
    } else if (error.request) {
      // The request was made but no response was received
      statusCode = 503; // Service Unavailable or Timeout
      responseSnippet = 'No response received from server.';
    } else {
      // Something happened in setting up the request that triggered an Error
      statusCode = 500;
      responseSnippet = error.message;
    }
  }

  // 5. Save the log to the database
  try {
    await Log.create({
      job: job._id,
      status: logStatus,
      statusCode: statusCode,
      responseSnippet: responseSnippet,
    });
    console.log(`Logged execution for job: ${job.name}`);
  } catch (logError) {
    console.error(`Failed to save log for job ${job._id}: ${logError.message}`);
  }
};

/**
 * Starts a new cron job and adds it to our tracking object.
 */
const startJob = (job) => {
  // Make sure the cron schedule is valid
  if (!cron.validate(job.cronSchedule)) {
    console.error(`Invalid cron string: ${job.cronSchedule} for job ${job._id}`);
    return;
  }
  
  // Make sure job is not already running
  if (scheduledJobs[job._id]) {
    scheduledJobs[job._id].stop();
  }

  // Schedule the job
  const task = cron.schedule(job.cronSchedule, () => {
    // We wrap executeJob in an anonymous function to pass the 'job' object
    executeJob(job);
  }, {
    scheduled: true // Start the job immediately
  });

  // Store the task in our tracking object
  scheduledJobs[job._id] = task;
  console.log(`Job ${job.name} (ID: ${job._id}) scheduled.`);
};

/**
 * Stops a running cron job and removes it from our tracking object.
 */
const stopJob = (jobId) => {
  const task = scheduledJobs[jobId];
  if (task) {
    task.stop();
    delete scheduledJobs[jobId];
    console.log(`Job ${jobId} stopped.`);
  }
};

/**
 * Loads all enabled jobs from the database and starts them.
 * This should be called on server startup.
 */
const loadAllJobs = async () => {
  console.log('Loading all enabled jobs from database...');
  try {
    const jobs = await Job.find({ isEnabled: true });
    for (const job of jobs) {
      startJob(job);
    }
    console.log(`Loaded and scheduled ${jobs.length} jobs.`);
  } catch (error) {
    console.error('Failed to load jobs from database:', error.message);
  }
};

module.exports = {
  startJob,
  stopJob,
  loadAllJobs,
};