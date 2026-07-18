import express from 'express';
import { getJobs, getMyJobs, completeJob } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/my-jobs', protect, getMyJobs);
router.patch('/:id/complete', protect, completeJob);

export default router;
