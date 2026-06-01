import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { searchWorker, verifyWorker, getUnverifiedWorkers, getVerifiedHistory } from '../controllers/cafeController.js';

const router = express.Router();

router.get('/workers/search', protect, searchWorker);
router.get('/workers/unverified', protect, getUnverifiedWorkers);
router.get('/workers/history', protect, getVerifiedHistory);
router.post('/workers/verify/:workerId', protect, verifyWorker);

export default router;
