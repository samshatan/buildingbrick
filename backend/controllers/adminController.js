import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';

// @desc    Get all workers with verification status
// @route   GET /api/v1/admin/workers
// @access  Private (Admin only)
export const getWorkers = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an Admin.' });
    }

    const workers = await WorkerProfile.find()
      .populate('userId', 'name email createdAt')
      .populate('verifiedByCafeId', 'name email');
      
    res.status(200).json(workers);
  } catch (error) {
    console.error('Error fetching workers for admin:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get all cafes with pending balances
// @route   GET /api/v1/admin/cafes
// @access  Private (Admin only)
export const getCafes = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an Admin.' });
    }

    const cafes = await User.find({ accountType: 'cafe' }).select('-password');
    
    // For each cafe, calculate how many pending verifications they have
    const cafeData = await Promise.all(cafes.map(async (cafe) => {
      const pendingVerifications = await WorkerProfile.countDocuments({
        verifiedByCafeId: cafe._id,
        cafePaymentStatus: 'PENDING_ADMIN_COLLECTION'
      });
      
      const totalVerifications = await WorkerProfile.countDocuments({
        verifiedByCafeId: cafe._id
      });

      return {
        _id: cafe._id,
        name: cafe.name,
        email: cafe.email,
        pendingVerifications,
        totalVerifications,
        pendingBalance: pendingVerifications * 118 // assuming Rs 118 fee
      };
    }));

    res.status(200).json(cafeData);
  } catch (error) {
    console.error('Error fetching cafes for admin:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Collect payment from a cafe
// @route   POST /api/v1/admin/cafes/:cafeId/collect-payment
// @access  Private (Admin only)
export const collectPayment = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an Admin.' });
    }

    // Update all pending workers for this cafe
    const result = await WorkerProfile.updateMany(
      { verifiedByCafeId: req.params.cafeId, cafePaymentStatus: 'PENDING_ADMIN_COLLECTION' },
      { $set: { cafePaymentStatus: 'COLLECTED_BY_ADMIN' } }
    );

    res.status(200).json({ message: `Successfully collected payment for ${result.modifiedCount} verifications.` });
  } catch (error) {
    console.error('Error collecting payment:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Make any user a Cafe Owner
// @route   POST /api/v1/admin/make-cafe
// @access  Private (Admin only)
export const makeCafeOwner = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an Admin.' });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide a user email.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.accountType === 'cafe') {
      return res.status(400).json({ message: 'User is already a Cafe Owner.' });
    }

    user.accountType = 'cafe';
    await user.save();

    res.status(200).json({ message: `${user.name} is now a Cafe Owner.` });
  } catch (error) {
    console.error('Error making cafe owner:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get all standard users
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin.' });
    }

    const users = await User.find({ accountType: { $in: ['worker', 'hirer'] } }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
};

