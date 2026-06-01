import express from 'express';
import { createRequest, getRequests, getRequestsByHirer } from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRequest);
router.get('/', getRequests);
router.get('/hirer/:userId', getRequestsByHirer);

export default router;
