import express from 'express';
import { 
  initiatePhonePePayment, 
  phonePeCallback, 
  processCheckout, 
  getUserOrders,
  initiateRazorpayPayment,
  verifyRazorpayPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// PhonePe Routes
router.post('/phonepe/initiate', protect, initiatePhonePePayment);
router.post('/phonepe/callback', phonePeCallback); // Public webhook

// Razorpay Routes
router.post('/razorpay/initiate', protect, initiateRazorpayPayment);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

// Cart checkout (Generic / Demo)
router.post('/process', protect, processCheckout);
router.get('/orders', protect, getUserOrders);

export default router;
