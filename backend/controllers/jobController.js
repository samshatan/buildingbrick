import Job from '../models/Job.js';
import Review from '../models/Review.js';

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public (filtered on frontend)
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate('requestId')
      .populate('workerId', 'name email')
      .populate('hirerUserId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    // Fetch all reviews for these jobs to attach isReviewed boolean
    const jobIds = jobs.map(j => j._id);
    const reviews = await Review.find({ jobId: { $in: jobIds } });
    const reviewedJobIds = reviews.map(r => r.jobId.toString());

    const jobsWithReviews = jobs.map(job => {
      const isReviewed = reviewedJobIds.includes(job._id.toString());
      return { ...job.toObject(), isReviewed };
    });

    res.status(200).json(jobsWithReviews);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error fetching jobs.' });
  }
};
