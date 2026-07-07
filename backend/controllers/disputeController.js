import Dispute from '../models/Dispute.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create a new dispute
// @route   POST /api/v1/disputes
// @access  Private
export const createDispute = async (req, res) => {
  try {
    const { requestType, requestId, againstUserId, reason, description } = req.body;

    if (!requestType || !requestId || !reason || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const dispute = await Dispute.create({
      requestType,
      requestId,
      raisedBy: req.user._id,
      againstUser: againstUserId || null,
      reason,
      description
    });

    // Notify admins (Assuming admins check the dashboard, or we could create an admin notification)
    
    // If it's against a specific user, notify them
    if (againstUserId) {
      await Notification.create({
        userId: againstUserId,
        message: `A dispute has been raised regarding your job. Please check your disputes center.`,
        type: 'WARNING',
        link: '/disputes'
      });
    }

    res.status(201).json(dispute);
  } catch (error) {
    console.error('Error creating dispute:', error);
    res.status(500).json({ message: 'Failed to create dispute' });
  }
};

// @desc    Get all disputes for logged-in user (raised by them or against them)
// @route   GET /api/v1/disputes/user
// @access  Private
export const getUserDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({
      $or: [{ raisedBy: req.user._id }, { againstUser: req.user._id }]
    })
    .populate('raisedBy', 'name email')
    .populate('againstUser', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json(disputes);
  } catch (error) {
    console.error('Error fetching user disputes:', error);
    res.status(500).json({ message: 'Failed to fetch disputes' });
  }
};

// @desc    Get all disputes (Admin only)
// @route   GET /api/v1/disputes
// @access  Private/Admin
export const getAllDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate('raisedBy', 'name email')
      .populate('againstUser', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(disputes);
  } catch (error) {
    console.error('Error fetching all disputes:', error);
    res.status(500).json({ message: 'Failed to fetch disputes' });
  }
};

// @desc    Resolve a dispute (Admin only)
// @route   PATCH /api/v1/disputes/:id/resolve
// @access  Private/Admin
export const resolveDispute = async (req, res) => {
  try {
    const { status, resolution, adminNotes } = req.body;
    
    if (!['RESOLVED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    dispute.status = status;
    if (resolution) dispute.resolution = resolution;
    if (adminNotes) dispute.adminNotes = adminNotes;
    
    await dispute.save();

    // Notify users involved
    await Notification.create({
      userId: dispute.raisedBy,
      message: `Your dispute has been resolved by Admin.`,
      type: 'INFO',
      link: '/disputes'
    });

    if (dispute.againstUser) {
      await Notification.create({
        userId: dispute.againstUser,
        message: `A dispute against you has been resolved by Admin.`,
        type: 'INFO',
        link: '/disputes'
      });
    }

    res.status(200).json(dispute);
  } catch (error) {
    console.error('Error resolving dispute:', error);
    res.status(500).json({ message: 'Failed to resolve dispute' });
  }
};
