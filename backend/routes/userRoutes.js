import express from 'express';
import { becomeWorker, updateAccount } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/become-worker', protect, becomeWorker);
router.patch('/account', protect, updateAccount);

export default router;
