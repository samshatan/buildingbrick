import Job from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public (filtered on frontend)
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error fetching jobs.' });
  }
};
