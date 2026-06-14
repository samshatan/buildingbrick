import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { searchWorker, verifyWorker, rejectWorker, getUnverifiedWorkers, getVerifiedHistory, payOnline, getNearbyCafes, updateCafeProfile } from '../controllers/cafeController.js';

const router = express.Router();

// Cafe Profile Routes
router.get('/nearby', getNearbyCafes);
router.put('/profile', protect, updateCafeProfile);

// Worker Verification Routes
router.get('/workers/search', protect, searchWorker);
router.get('/workers/unverified', protect, getUnverifiedWorkers);
router.get('/workers/history', protect, getVerifiedHistory);
router.post('/workers/verify/:workerId', protect, verifyWorker);
router.post('/workers/reject/:workerId', protect, rejectWorker);
router.post('/workers/pay-online', protect, payOnline);

export default router;
