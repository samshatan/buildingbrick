import DirectRequest from '../models/DirectRequest.js';
import WorkerProfile from '../models/WorkerProfile.js';
import Notification from '../models/Notification.js';

// @desc    Create a direct hire request
// @route   POST /api/v1/direct-requests
// @access  Private (Hirer/User)
export const createDirectRequest = async (req, res) => {
  try {
    const { workerProfileId, hirerPhone, hirerAddress, message, buildingType } = req.body;
    
    if (!workerProfileId || !hirerPhone || !hirerAddress || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const worker = await WorkerProfile.findById(workerProfileId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found.' });
    }

    const newRequest = await DirectRequest.create({
      hirerId: req.user._id,
      workerProfileId,
      hirerPhone,
      hirerAddress,
      buildingType,
      message
    });

    // Notify Worker
    await Notification.create({
      userId: worker.userId,
      message: `${req.user.name} sent you a Direct Work Request!`,
      type: 'INFO',
      link: '/requests'
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating direct request:', error);
    res.status(500).json({ message: 'Failed to send direct hire request.' });
  }
};

// @desc    Get all direct requests for the logged-in worker
// @route   GET /api/v1/direct-requests/worker
// @access  Private (Worker)
export const getWorkerDirectRequests = async (req, res) => {
  try {
    // Find worker profile by userId
    const workerProfile = await WorkerProfile.findOne({ userId: req.user._id });
    if (!workerProfile) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    const requests = await DirectRequest.find({ workerProfileId: workerProfile._id })
      .limit(100)
      .populate('hirerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching direct requests:', error);
    res.status(500).json({ message: 'Failed to fetch direct requests.' });
  }
};

// @desc    Update direct request status (Accept/Reject)
// @route   PATCH /api/v1/direct-requests/:id/status
// @access  Private (Worker)
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const request = await DirectRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Optional: verify the worker owns this request
    const workerProfile = await WorkerProfile.findOne({ userId: req.user._id });
    if (!workerProfile || request.workerProfileId.toString() !== workerProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request.' });
    }

    request.status = status;
    await request.save();

    // Notify Hirer
    await Notification.create({
      userId: request.hirerId,
      message: `${workerProfile.displayName || req.user.name} has ${status.toLowerCase()} your direct request.`,
      type: status === 'ACCEPTED' ? 'SUCCESS' : 'INFO',
      link: '/orders'
    });

    res.status(200).json(request);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Failed to update request status.' });
  }
};
