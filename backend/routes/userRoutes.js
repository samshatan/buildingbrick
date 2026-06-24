import express from 'express';
import { becomeWorker, updateAccount, updatePreferences } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/become-worker', protect, becomeWorker);
router.patch('/account', protect, updateAccount);
router.patch('/preferences', protect, updatePreferences);

export default router;
