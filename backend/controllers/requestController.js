import WorkRequest from '../models/WorkRequest.js';

// @desc    Post a new work request
// @route   POST /api/v1/requests
// @access  Private
export const createRequest = async (req, res) => {
  try {
    const { title, categoryId, workerType, location, startDate, endDate, budgetMin, budgetMax, description } = req.body;

    if (!title || !categoryId || !workerType) {
      return res.status(400).json({ message: 'Title, Category, and Worker Type are required fields.' });
    }

    const request = await WorkRequest.create({
      hirerUserId: req.user._id,
      title,
      categoryId,
      workerType,
      location,
      startDate,
      endDate,
      budgetMin,
      budgetMax,
      description,
      status: 'OPEN'
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating work request:', error);
    res.status(500).json({ message: 'Server error posting work request.' });
  }
};

// @desc    Get all work requests
// @route   GET /api/v1/requests
// @access  Public
export const getRequests = async (req, res) => {
  try {
    const requests = await WorkRequest.find({}).limit(100);
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server error fetching requests.' });
  }
};

// @desc    Get requests by hirer user ID
// @route   GET /api/v1/requests/hirer/:userId
// @access  Public
export const getRequestsByHirer = async (req, res) => {
  try {
    const requests = await WorkRequest.find({ hirerUserId: req.params.userId }).limit(100);
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests by hirer ID:', error);
    res.status(500).json({ message: 'Server error fetching requests.' });
  }
};
