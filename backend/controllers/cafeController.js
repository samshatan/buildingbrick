import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';

// @desc    Search for a worker by email (or name)
// @route   GET /api/v1/cafes/workers/search
// @access  Private (Cafe only)
export const searchWorker = async (req, res) => {
  try {
    if (req.user.accountType !== 'cafe' && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as a Cafe owner.' });
    }

    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required.' });
    }

    // Find users with accountType 'worker' matching email or name
    const users = await User.find({
      accountType: 'worker',
      $or: [
        { email: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).limit(100).select('-password');

    if (users.length === 0) {
      return res.status(404).json({ message: 'No workers found.' });
    }

    // Get their worker profiles
    const userIds = users.map(u => u._id);
    const profiles = await WorkerProfile.find({ userId: { $in: userIds } }).limit(100).populate('userId', 'name email avatarUrl');

    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error searching workers:', error);
    res.status(500).json({ message: 'Server error searching workers.' });
  }
};

// @desc    Verify a worker and collect payment
// @route   POST /api/v1/cafes/workers/verify/:workerId
// @access  Private (Cafe only)
export const verifyWorker = async (req, res) => {
  try {
    if (req.user.accountType !== 'cafe' && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as a Cafe owner.' });
    }

    const workerProfile = await WorkerProfile.findById(req.params.workerId).populate('userId', 'name email');
    if (!workerProfile) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    if (workerProfile.verified) {
      return res.status(400).json({ message: 'Worker is already verified.' });
    }

    workerProfile.verificationStatus = 'VERIFIED';
    workerProfile.verified = true;
    workerProfile.verifiedByCafeId = req.user._id;
    workerProfile.verifiedAt = new Date();
    workerProfile.cafePaymentStatus = 'PENDING_ADMIN_COLLECTION';
    
    await workerProfile.save();

    res.status(200).json({ message: 'Worker verified successfully!', worker: workerProfile });
  } catch (error) {
    console.error('Error verifying worker:', error);
    res.status(500).json({ message: 'Server error verifying worker.' });
  }
};

// @desc    Get recent unverified workers queue
// @route   GET /api/v1/cafes/workers/unverified
// @access  Private (Cafe only)
export const getUnverifiedWorkers = async (req, res) => {
  try {
    if (req.user.accountType !== 'cafe' && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as a Cafe owner.' });
    }

    const profiles = await WorkerProfile.find({ verificationStatus: 'PENDING' })
      .populate('userId', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching unverified workers:', error);
    res.status(500).json({ message: 'Server error fetching workers.' });
  }
};

// @desc    Get workers verified by this cafe
// @route   GET /api/v1/cafes/workers/history
// @access  Private (Cafe only)
export const getVerifiedHistory = async (req, res) => {
  try {
    if (req.user.accountType !== 'cafe' && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as a Cafe owner.' });
    }

    const profiles = await WorkerProfile.find({ verifiedByCafeId: req.user._id })
      .limit(100)
      .populate('userId', 'name email avatarUrl')
      .sort({ verifiedAt: -1 });

    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching verified history:', error);
    res.status(500).json({ message: 'Server error fetching history.' });
  }
};

// @desc    Pay online for specific verified workers
// @route   POST /api/v1/cafes/workers/pay-online
// @access  Private (Cafe only)

// @desc    Reject a worker
export const payOnline = async (req, res) => {
  try {
    if (req.user.accountType !== 'cafe' && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as a Cafe owner.' });
    }

    const { workerIds, receiptUrl } = req.body;
    
    if (!workerIds || !Array.isArray(workerIds) || workerIds.length === 0) {
      return res.status(400).json({ message: 'No workers selected for online payment.' });
    }

    const updateData = { cafePaymentStatus: 'PAID_ONLINE_BY_CAFE' };
    if (receiptUrl) {
      updateData.cafePaymentReceipt = receiptUrl;
    }

    // Update specific pending workers verified by this cafe
    const result = await WorkerProfile.updateMany(
      { 
        _id: { $in: workerIds },
        verifiedByCafeId: req.user._id, 
        cafePaymentStatus: 'PENDING_ADMIN_COLLECTION' 
      },
      { $set: updateData }
    );

    res.status(200).json({ message: `Successfully paid for ${result.modifiedCount} verifications online.` });
  } catch (error) {
    console.error('Error in online payment:', error);
    res.status(500).json({ message: 'Server error processing online payment.' });
  }
};

// @desc    Reject a worker
// @route   POST /api/v1/cafes/workers/reject/:workerId
// @access  Private (Cafe only)
export const rejectWorker = async (req, res) => {
  try {
    if (req.user.accountType !== 'cafe' && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as a Cafe owner.' });
    }

    const workerProfile = await WorkerProfile.findById(req.params.workerId);
    if (!workerProfile) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    if (workerProfile.verificationStatus !== 'PENDING') {
      return res.status(400).json({ message: 'Worker is not pending verification.' });
    }

    workerProfile.verificationStatus = 'REJECTED';
    workerProfile.verified = false;
    
    await workerProfile.save();

    res.status(200).json({ message: 'Worker rejected successfully.' });
  } catch (error) {
    console.error('Error rejecting worker:', error);
    res.status(500).json({ message: 'Server error rejecting worker.' });
  }
};
// @desc    Get nearby cafes based on state and district
// @route   GET /api/v1/cafes/nearby
// @access  Public
export const getNearbyCafes = async (req, res) => {
  try {
    const { state, district } = req.query;
    if (!state || !district) {
      return res.status(400).json({ message: 'State and district are required.' });
    }

    const cafes = await User.find({
      accountType: 'cafe',
      state: state,
      district: district
    }).select('name email phone address state district postalCode avatarUrl').limit(50);

    res.status(200).json(cafes);
  } catch (error) {
    console.error('Error fetching nearby cafes:', error);
    res.status(500).json({ message: 'Server error fetching cafes.' });
  }
};

// @desc    Update cafe profile (location settings)
// @route   PUT /api/v1/cafes/profile
// @access  Private (Cafe only)
export const updateCafeProfile = async (req, res) => {
  try {
    if (req.user.accountType !== 'cafe' && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as a Cafe owner.' });
    }

    const { address, state, district, postalCode } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (address !== undefined) user.address = address;
    if (state !== undefined) user.state = state;
    if (district !== undefined) user.district = district;
    if (postalCode !== undefined) user.postalCode = postalCode;

    await user.save();

    res.status(200).json({ 
      message: 'Profile updated successfully.', 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        address: user.address,
        state: user.state,
        district: user.district,
        postalCode: user.postalCode
      }
    });
  } catch (error) {
    console.error('Error updating cafe profile:', error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};
