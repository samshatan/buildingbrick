import ExpertRequest from '../models/ExpertRequest.js';
import Notification from '../models/Notification.js';

// @desc    Create new expert request
// @route   POST /api/expert-requests
// @access  Private
export const createExpertRequest = async (req, res) => {
  try {
    const { projectDetails, location } = req.body;

    const request = new ExpertRequest({
      userId: req.user._id,
      projectDetails,
      location,
    });

    const createdRequest = await request.save();

    // Notify admins
    const adminNotification = new Notification({
      userId: req.user._id, 
      title: 'New Expert Inspection Request',
      message: `User ${req.user.name} has requested an expert inspection.`,
      type: 'system',
      isRead: false
    });
    await adminNotification.save();

    res.status(201).json(createdRequest);
  } catch (error) {
    console.error('Error creating expert request:', error);
    res.status(500).json({ message: 'Failed to create expert request.' });
  }
};

// @desc    Get user expert requests
// @route   GET /api/expert-requests/my-requests
// @access  Private
export const getMyExpertRequests = async (req, res) => {
  try {
    const requests = await ExpertRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching expert requests:', error);
    res.status(500).json({ message: 'Failed to fetch expert requests.' });
  }
};
