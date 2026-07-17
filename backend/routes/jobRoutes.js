import express from 'express';
import { getJobs, getMyJobs } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/my-jobs', protect, getMyJobs);

export default router;
