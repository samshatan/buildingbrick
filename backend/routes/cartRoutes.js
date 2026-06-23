import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.route('/')
  .get(getCart);

router.route('/add')
  .post(addToCart);

router.route('/remove/:itemId')
  .delete(removeFromCart);

router.route('/clear')
  .delete(clearCart);

export default router;
