import express from 'express';
import { createDirectRequest, getWorkerDirectRequests, updateRequestStatus } from '../controllers/directRequestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createDirectRequest);
router.get('/worker', protect, getWorkerDirectRequests);
router.patch('/:id/status', protect, updateRequestStatus);

export default router;
