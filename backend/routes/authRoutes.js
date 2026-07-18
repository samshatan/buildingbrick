import express from 'express';
import { signup, login, googleAuth, googleAuthMobile, getMe, sendOtp, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/reset-password', resetPassword);
router.post('/signup', upload.single('photo'), signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/google-mobile', googleAuthMobile);
router.get('/me', protect, getMe);

export default router;
