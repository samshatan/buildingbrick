import express from 'express';
import { initiatePhonePePayment, phonePeCallback, processCheckout, getUserOrders } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/phonepe/initiate', protect, initiatePhonePePayment);
router.post('/phonepe/callback', phonePeCallback); // Public webhook
router.post('/process', protect, processCheckout);
router.get('/orders', protect, getUserOrders);

export default router;
