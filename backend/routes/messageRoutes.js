import express from 'express';
import { sendMessage, getConversation, getConversations } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/', protect, getConversations);
router.get('/:otherUserId', protect, getConversation);

export default router;
