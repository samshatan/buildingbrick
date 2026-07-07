import express from 'express';
import { createDispute, getUserDisputes, getAllDisputes, resolveDispute } from '../controllers/disputeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createDispute);
router.get('/user', protect, getUserDisputes);
router.get('/', protect, admin, getAllDisputes);
router.patch('/:id/resolve', protect, admin, resolveDispute);

export default router;
