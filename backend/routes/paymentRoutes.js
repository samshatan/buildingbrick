import express from 'express';
import { initiatePhonePePayment, phonePeCallback } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/phonepe/initiate', protect, initiatePhonePePayment);
router.post('/phonepe/callback', phonePeCallback); // Public webhook

export default router;
