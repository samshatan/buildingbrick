import express from 'express';
import { createExpertRequest, getMyExpertRequests } from '../controllers/expertRequestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createExpertRequest);
router.get('/my-requests', protect, getMyExpertRequests);

export default router;
