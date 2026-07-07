import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getWorkers, getCafes, collectPayment, makeCafeOwner, getAllUsers, getWorkersByCafe, updateUserRole, getPlatformStats, getReports, updateReportStatus } from '../controllers/adminController.js';

const router = express.Router();

router.get('/workers', protect, getWorkers);
router.get('/cafes', protect, getCafes);
router.get('/users', protect, getAllUsers);
router.get('/cafes/:cafeId/workers', protect, getWorkersByCafe);
router.post('/cafes/:cafeId/collect-payment', protect, collectPayment);
router.post('/make-cafe', protect, makeCafeOwner);

router.put('/users/:id/role', protect, updateUserRole);
router.get('/stats', protect, getPlatformStats);
router.get('/reports', protect, getReports);
router.put('/reports/:id', protect, updateReportStatus);

export default router;
