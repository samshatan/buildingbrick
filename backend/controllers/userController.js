import User from '../models/User.js';
import WorkerProfile from '../models/WorkerProfile.js';
import { generateToken, mapUserResponse, getCategoryId } from './authController.js';

// @desc    Convert a Hirer account into a Worker account
// @route   POST /api/v1/users/become-worker
// @access  Private
export const becomeWorker = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, phone, location } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Worker category is required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Optionally update user's phone if provided
    if (phone) {
      user.phone = phone;
    }

    if (user.accountType === 'worker') {
      return res.status(400).json({ message: 'User is already a worker.' });
    }

    // Update User accountType
    user.accountType = 'worker';
    await user.save();

    // Create corresponding WorkerProfile
    const categoryId = getCategoryId(category);
    await WorkerProfile.create({
      userId,
      displayName: user.name,
      categoryId: categoryId,
      workerType: category,
      location: location || "Not specified",
      dailyRate: 0, 
      experienceYears: 0, 
      bio: '',
      skills: category,
      photo: user.avatarUrl || ""
    });

    // Generate fresh token and response payload
    res.status(200).json({
      message: 'Successfully converted to Worker account.',
      token: generateToken(user._id),
      user: mapUserResponse(user),
    });
  } catch (error) {
    console.error('Become worker error:', error);
    res.status(500).json({ message: 'Server error. Failed to upgrade account.' });
  }
};
