import Review from '../models/Review.js';
import Job from '../models/Job.js';
import WorkerProfile from '../models/WorkerProfile.js';

// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private (Hirer)
export const createReview = async (req, res) => {
  try {
    const { jobId, workerId, rating, comment } = req.body;
    const hirerId = req.user._id;

    if (!jobId || !workerId || !rating) {
      return res.status(400).json({ message: 'Job, Worker, and Rating are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Verify job is completed
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    
    // We can allow reviews if the job is COMPLETED.
    if (job.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Can only review completed jobs.' });
    }

    // Ensure hirer owns this job
    if (job.hirerUserId.toString() !== hirerId.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this job.' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ jobId, hirerId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this job.' });
    }

    // Create review
    const review = await Review.create({
      jobId,
      hirerId,
      workerId,
      rating,
      comment
    });

    // Update worker's average rating and jobs completed
    const workerProfile = await WorkerProfile.findOne({ userId: workerId });
    if (workerProfile) {
      const allReviews = await Review.find({ workerId });
      const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;
      
      workerProfile.rating = Math.round(avgRating * 10) / 10;
      workerProfile.jobsCompleted = allReviews.length; // assuming 1 review = 1 completed job. Or just increment.
      await workerProfile.save();
    }

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error creating review.' });
  }
};

// @desc    Get reviews for a specific worker
// @route   GET /api/v1/reviews/worker/:workerId
// @access  Public
export const getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId })
      .populate('hirerId', 'name avatarUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews.' });
  }
};
