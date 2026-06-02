import express from 'express';
import { getWorkers, getWorkerById, getWorkerByUserId, updateAvailability, updatePhoto, updateProfile } from '../controllers/workerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getWorkers);
router.get('/:id', getWorkerById);
router.get('/user/:userId', getWorkerByUserId);
router.patch('/:id/availability', protect, updateAvailability);
router.patch('/:id/photo', protect, updatePhoto);
router.patch('/:id/profile', protect, updateProfile);

export default router;
