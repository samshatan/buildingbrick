import express from 'express';
import { becomeWorker } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/become-worker', protect, becomeWorker);

export default router;
