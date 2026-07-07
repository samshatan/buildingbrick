import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';
import Report from '../models/Report.js';
import Job from '../models/Job.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Get all workers with verification status
// @route   GET /api/v1/admin/workers
// @access  Private (Admin only)
export const getWorkers = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an Admin.' });
    }

    const workers = await WorkerProfile.find()
      .limit(100)
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

    const cafes = await User.find({ accountType: 'cafe' }).limit(100).select('-password');
    
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
        pendingBalance: pendingVerifications * 19 // assuming Rs 19 fee
      };
    }));

    res.status(200).json(cafeData);
  } catch (error) {
    console.error('Error fetching cafes for admin:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get all workers verified by a specific cafe
// @route   GET /api/v1/admin/cafes/:cafeId/workers
// @access  Private (Admin only)
export const getWorkersByCafe = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an Admin.' });
    }

    const workers = await WorkerProfile.find({ verifiedByCafeId: req.params.cafeId })
      .limit(100)
      .populate('userId', 'name email avatarUrl')
      .sort({ verifiedAt: -1 });

    res.status(200).json(workers);
  } catch (error) {
    console.error('Error fetching workers for cafe:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Collect offline payment from a cafe for specific workers
// @route   POST /api/v1/admin/cafes/:cafeId/collect-payment
// @access  Private (Admin only)
export const collectPayment = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an Admin.' });
    }

    const { workerIds } = req.body;
    
    if (!workerIds || !Array.isArray(workerIds) || workerIds.length === 0) {
      return res.status(400).json({ message: 'No workers selected for payment collection.' });
    }

    // Update specific pending workers for this cafe
    const result = await WorkerProfile.updateMany(
      { 
        _id: { $in: workerIds },
        verifiedByCafeId: req.params.cafeId, 
        cafePaymentStatus: 'PENDING_ADMIN_COLLECTION' 
      },
      { $set: { cafePaymentStatus: 'COLLECTED_OFFLINE_BY_ADMIN' } }
    );

    res.status(200).json({ message: `Successfully collected payment for ${result.modifiedCount} verifications offline.` });
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

    const { email, identifier } = req.body;
    const searchIdentifier = identifier || email;

    if (!searchIdentifier) {
      return res.status(400).json({ message: 'Please provide a user email or phone number.' });
    }

    const user = await User.findOne({ 
      $or: [
        { email: searchIdentifier }, 
        { phone: searchIdentifier }
      ] 
    });

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

    const users = await User.find({ accountType: { $in: ['worker', 'hirer'] } }).limit(100).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
};

// @desc    Update user role
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin.' });
    }
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.accountType = role;
    await user.save();
    res.status(200).json({ message: `User role updated to ${role}` });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get platform stats for analytics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin only)
export const getPlatformStats = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin.' });
    }
    
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalWorkers = await WorkerProfile.countDocuments({ verified: true });
    const totalCafes = await User.countDocuments({ accountType: 'cafe' });
    const totalJobs = await Job.countDocuments();

    // Aggregate user signups by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of that month

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      }
    ]);

    const workerGrowth = await WorkerProfile.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, verified: true } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Build array for the last 6 months
    const growthData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let currentTotalUsers = 0;
    let currentTotalWorkers = 0;
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthIndex = d.getMonth();
      const monthLabel = monthNames[monthIndex];

      const uCount = userGrowth.find(g => g._id === monthIndex + 1)?.count || 0;
      const wCount = workerGrowth.find(g => g._id === monthIndex + 1)?.count || 0;
      
      // Cumulative or absolute? The charts usually show cumulative or monthly. Let's do monthly growth.
      growthData.push({
        name: monthLabel,
        users: uCount,
        workers: wCount
      });
    }

    res.status(200).json({
      totals: { totalUsers, totalWorkers, totalCafes, totalJobs },
      growthData
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get all reports
// @route   GET /api/v1/admin/reports
// @access  Private (Admin only)
export const getReports = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin.' });
    }
    const reports = await Report.find().sort({ createdAt: -1 }).populate('reportedBy', 'name email');
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Update report status (Warn/Ban/Dismiss)
// @route   PUT /api/v1/admin/reports/:id
// @access  Private (Admin only)
export const updateReportStatus = async (req, res) => {
  try {
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin.' });
    }
    const { status, action, adminNotes } = req.body;
    const report = await Report.findById(req.params.id);
    
    if (!report) return res.status(404).json({ message: 'Report not found.' });

    report.status = status;
    report.adminNotes = adminNotes;
    await report.save();

    // If action is warn or ban, try to email the user
    if (action === 'warn' || action === 'ban') {
      let targetEmail = '';
      let targetName = report.targetName;
      
      // We only email if target is a User
      if (report.targetModel === 'User') {
        const targetUser = await User.findById(report.targetId);
        if (targetUser) {
          targetEmail = targetUser.email;
          if (action === 'ban') {
            targetUser.accountType = 'banned';
            await targetUser.save();
          }
        }
      }

      if (targetEmail) {
        const subject = action === 'ban' ? 'Account Suspended' : 'Official Warning from BrickOurHouse';
        const text = `Hello ${targetName},\n\nYour account has been ${action === 'ban' ? 'suspended' : 'warned'} due to a violation of our community guidelines.\n\nReason given: ${report.reason}\n\nIf you believe this is an error, please contact support.`;
        
        await sendEmail({
          to: targetEmail,
          subject,
          text
        });
      }
    }

    res.status(200).json({ message: `Report updated and action '${action || status}' applied.` });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
