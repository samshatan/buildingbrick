import express from 'express';
import { 
  getUserOrders,
  initiateRazorpayPayment,
  verifyRazorpayPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Razorpay Routes
router.post('/razorpay/initiate', protect, initiateRazorpayPayment);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

router.get('/orders', protect, getUserOrders);

export default router;
