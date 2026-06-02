import WorkerProfile from '../models/WorkerProfile.js';

// @desc    Get all workers
// @route   GET /api/v1/workers
// @access  Public
export const getWorkers = async (req, res) => {
  try {
    const workers = await WorkerProfile.find({ verified: true });
    res.status(200).json(workers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ message: 'Server error fetching workers.' });
  }
};

// @desc    Get single worker by ID
// @route   GET /api/v1/workers/:id
// @access  Public
export const getWorkerById = async (req, res) => {
  try {
    const worker = await WorkerProfile.findById(req.params.id).populate('userId', 'phone email name');
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }
    res.status(200).json(worker);
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    res.status(500).json({ message: 'Server error fetching worker profile.' });
  }
};

// @desc    Get worker profile by User ID
// @route   GET /api/v1/workers/user/:userId
// @access  Public
export const getWorkerByUserId = async (req, res) => {
  try {
    const worker = await WorkerProfile.findOne({ userId: req.params.userId }).populate('userId', 'phone email name');
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found for this user.' });
    }
    res.status(200).json(worker);
  } catch (error) {
    console.error('Error fetching worker by user ID:', error);
    res.status(500).json({ message: 'Server error fetching worker profile.' });
  }
};

// @desc    Update worker availability
// @route   PATCH /api/v1/workers/:id/availability
// @access  Private
export const updateAvailability = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['AVAILABLE', 'BUSY'].includes(status)) {
      return res.status(400).json({ message: 'Invalid availability status.' });
    }

    const worker = await WorkerProfile.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    // Verify authorized user owns this profile
    if (worker.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this profile.' });
    }

    worker.availabilityStatus = status;
    await worker.save();

    res.status(200).json(worker);
  } catch (error) {
    console.error('Error updating worker availability:', error);
    res.status(500).json({ message: 'Server error updating availability.' });
  }
};

// @desc    Update worker profile photo
// @route   PATCH /api/v1/workers/:id/photo
// @access  Private
export const updatePhoto = async (req, res) => {
  try {
    const { photo } = req.body;

    if (!photo) {
      return res.status(400).json({ message: 'Photo string is required.' });
    }

    const worker = await WorkerProfile.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    // Verify authorized user owns this profile
    if (worker.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this profile.' });
    }

    worker.photo = photo;
    await worker.save();

    res.status(200).json(worker);
  } catch (error) {
    console.error('Error updating worker photo:', error);
    res.status(500).json({ message: 'Server error updating profile photo.' });
  }
};

// @desc    Update worker profile details
// @route   PATCH /api/v1/workers/:id/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { displayName, bio, skills, dailyRate, experienceYears } = req.body;

    const worker = await WorkerProfile.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found.' });
    }

    // Verify authorized user owns this profile
    if (worker.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this profile.' });
    }

    if (displayName !== undefined) worker.displayName = displayName;
    if (bio !== undefined) worker.bio = bio;
    if (skills !== undefined) worker.skills = skills;
    if (dailyRate !== undefined) worker.dailyRate = Number(dailyRate);
    if (experienceYears !== undefined) worker.experienceYears = Number(experienceYears);

    await worker.save();

    res.status(200).json(worker);
  } catch (error) {
    console.error('Error updating worker profile:', error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};
