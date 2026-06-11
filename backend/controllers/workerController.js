import WorkerProfile from '../models/WorkerProfile.js';
import { geocodeAddress } from '../utils/geocode.js';

// @desc    Get all workers
// @route   GET /api/v1/workers
// @access  Public
export const getWorkers = async (req, res) => {
  try {
    const { lat, lng, maxDistance } = req.query;

    let workers;

    if (lat && lng) {
      const distance = maxDistance ? parseInt(maxDistance) * 1000 : 50000; // default 50km
      
      workers = await WorkerProfile.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            distanceField: "distance",
            maxDistance: distance,
            spherical: true,
            query: { verified: true }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId"
          }
        },
        { $unwind: "$userId" },
        {
          $project: {
            "userId.password": 0,
            "userId.__v": 0
          }
        }
      ]);
      
      workers = workers.map(w => {
        w.id = w._id.toString();
        if (w.userId && w.userId._id) {
          w.userId.id = w.userId._id.toString();
        }
        return w;
      });

    } else {
      workers = await WorkerProfile.find({ verified: true }).limit(100).populate('userId', 'phone email name');
    }
    
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
    const { 
      displayName, bio, skills, dailyRate, experienceYears, location,
      address, fatherName, motherName, spouseName, alternateMobile, 
      termsAccepted, aadharCard, panCard, bankPassbook, onboardingFeePaid, paymentPreference
    } = req.body;

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
    
    // New Onboarding Fields
    if (address !== undefined) worker.address = address;
    if (fatherName !== undefined) worker.fatherName = fatherName;
    if (motherName !== undefined) worker.motherName = motherName;
    if (spouseName !== undefined) worker.spouseName = spouseName;
    if (alternateMobile !== undefined) worker.alternateMobile = alternateMobile;
    if (termsAccepted !== undefined) worker.termsAccepted = termsAccepted;
    if (aadharCard !== undefined) worker.aadharCard = aadharCard;
    if (panCard !== undefined) worker.panCard = panCard;
    if (bankPassbook !== undefined) worker.bankPassbook = bankPassbook;
    if (onboardingFeePaid !== undefined) worker.onboardingFeePaid = onboardingFeePaid;
    if (paymentPreference !== undefined) worker.paymentPreference = paymentPreference;

    if (location !== undefined) {
      worker.location = location;
      const coords = await geocodeAddress(location);
      if (coords) {
        worker.locationCoordinates = {
          type: 'Point',
          coordinates: [coords.lng, coords.lat]
        };
      }
    }

    // Move to PENDING state if all required documents and fee are provided (or if offline payment chosen)
    if (
      worker.verificationStatus === 'INCOMPLETE' &&
      worker.address &&
      worker.termsAccepted &&
      worker.aadharCard &&
      worker.panCard &&
      worker.bankPassbook &&
      (worker.onboardingFeePaid || worker.paymentPreference === 'OFFLINE')
    ) {
      worker.verificationStatus = 'PENDING';
    }

    await worker.save();

    res.status(200).json(worker);
  } catch (error) {
    console.error('Error updating worker profile:', error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};
