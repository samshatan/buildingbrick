import express from 'express';
import { createBulkOrder, getMyBulkOrders } from '../controllers/bulkOrderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBulkOrder);
router.get('/my-orders', protect, getMyBulkOrders);

export default router;
