import WorkerApplication from '../models/WorkerApplication.js';
import WorkRequest from '../models/WorkRequest.js';
import Job from '../models/Job.js';

import WorkerProfile from '../models/WorkerProfile.js';
import Notification from '../models/Notification.js';

// @desc    Submit an application/proposal
// @route   POST /api/v1/applications
// @access  Private
export const submitApplication = async (req, res) => {
  try {
    const { requestId, proposalText, proposedRate } = req.body;

    if (!requestId || !proposalText || !proposedRate) {
      return res.status(400).json({ message: 'Request ID, Proposal text, and proposed rate are required.' });
    }

    const workerProfile = await WorkerProfile.findOne({ userId: req.user._id });
    if (!workerProfile || !workerProfile.verified) {
      return res.status(403).json({ message: 'You must complete verification at a Cafe before applying to jobs.' });
    }

    const request = await WorkRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Work request not found.' });
    }

    if (request.status !== 'OPEN') {
      return res.status(400).json({ message: 'This work request is no longer open for applications.' });
    }

    // Check if worker already applied
    const alreadyApplied = await WorkerApplication.findOne({ requestId, workerId: req.user._id });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already submitted a proposal for this request.' });
    }

    const application = await WorkerApplication.create({
      requestId,
      workerId: req.user._id,
      proposalText,
      proposedRate,
      status: 'PENDING'
    });

    // Notify Hirer
    await Notification.create({
      userId: request.hirerUserId,
      message: `${req.user.name} applied to your job: "${request.title}"`,
      type: 'INFO',
      link: '/orders'
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Error submitting proposal:', error);
    res.status(500).json({ message: 'Server error submitting application.' });
  }
};

// @desc    Get applications submitted by a specific worker (user ID)
// @route   GET /api/v1/applications/worker/:workerId
// @access  Private
export const getApplicationsByWorker = async (req, res) => {
  try {
    // Only allow verified users to see their own applications
    if (req.user._id.toString() !== req.params.workerId) {
      return res.status(403).json({ message: 'Not authorized to view these applications.' });
    }

    const applications = await WorkerApplication.find({ workerId: req.params.workerId }).limit(100);
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching proposals by worker:', error);
    res.status(500).json({ message: 'Server error retrieving applications.' });
  }
};

// @desc    Get applications for a specific work request
// @route   GET /api/v1/applications/request/:requestId
// @access  Public
export const getApplicationsForRequest = async (req, res) => {
  try {
    const applications = await WorkerApplication.find({ requestId: req.params.requestId }).limit(100).populate('workerId', 'name email phone avatarUrl');
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications for request:', error);
    res.status(500).json({ message: 'Server error retrieving applications.' });
  }
};

// @desc    Accept worker's application, close request, and create active job
// @route   POST /api/v1/applications/:applicationId/accept
// @access  Private
export const acceptApplication = async (req, res) => {
  try {
    const application = await WorkerApplication.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application proposal not found.' });
    }

    if (application.status !== 'PENDING') {
      return res.status(400).json({ message: 'This application is no longer pending.' });
    }

    const request = await WorkRequest.findById(application.requestId);
    if (!request) {
      return res.status(404).json({ message: 'Work request not found.' });
    }

    // Verify requesting user is the hirer who posted the request or an Admin
    if (request.hirerUserId.toString() !== req.user._id.toString() && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to accept applications for this request.' });
    }

    if (request.status !== 'OPEN') {
      return res.status(400).json({ message: 'This work request is already closed or assigned.' });
    }

    // Accept this application and reject others
    application.status = 'ACCEPTED';
    await application.save();

    await WorkerApplication.updateMany(
      { requestId: request._id, _id: { $ne: application._id } },
      { status: 'REJECTED' }
    );

    // Close the work request
    request.status = 'ACCEPTED';
    await request.save();

    // Create the active Job
    const job = await Job.create({
      requestId: request._id,
      workerId: application.workerId,
      hirerUserId: request.hirerUserId,
      agreedRate: application.proposedRate,
      status: 'ONGOING'
    });

    // Notify Worker
    await Notification.create({
      userId: application.workerId,
      message: `Congratulations! Your application for "${request.title}" was accepted.`,
      type: 'SUCCESS',
      link: '/orders'
    });

    res.status(200).json({ message: 'Application accepted and job created successfully.', job });
  } catch (error) {
    console.error('Error accepting application:', error);
    res.status(500).json({ message: 'Server error accepting proposal.' });
  }
};

// @desc    Decline worker's application
// @route   POST /api/v1/applications/:applicationId/decline
// @access  Private
export const declineApplication = async (req, res) => {
  try {
    const application = await WorkerApplication.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application proposal not found.' });
    }

    if (application.status !== 'PENDING') {
      return res.status(400).json({ message: 'This application is no longer pending.' });
    }

    const request = await WorkRequest.findById(application.requestId);
    if (!request) {
      return res.status(404).json({ message: 'Work request not found.' });
    }

    // Verify requesting user is the hirer who posted the request or an Admin
    if (request.hirerUserId.toString() !== req.user._id.toString() && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to decline applications for this request.' });
    }

    // Update the application status to REJECTED
    application.status = 'REJECTED';
    await application.save();

    // Notify Worker
    await Notification.create({
      userId: application.workerId,
      message: `Your application for "${request.title}" was declined.`,
      type: 'INFO',
      link: '/requests'
    });

    res.status(200).json({ message: 'Application declined successfully.' });
  } catch (error) {
    console.error('Error declining application:', error);
    res.status(500).json({ message: 'Server error declining proposal.' });
  }
};
