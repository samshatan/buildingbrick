import BulkOrder from '../models/BulkOrder.js';
import Notification from '../models/Notification.js';

// @desc    Create new bulk order
// @route   POST /api/bulk-orders
// @access  Private
export const createBulkOrder = async (req, res) => {
  try {
    const { materialsRequested, quantityDescription, deliveryAddress } = req.body;

    const order = new BulkOrder({
      userId: req.user._id,
      materialsRequested,
      quantityDescription,
      deliveryAddress,
    });

    const createdOrder = await order.save();

    // Notify admins
    const adminNotification = new Notification({
      userId: req.user._id,
      message: `User ${req.user.name} has requested a bulk order.`,
      type: 'INFO',
      isRead: false
    });
    await adminNotification.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating bulk order:', error);
    res.status(500).json({ message: 'Failed to create bulk order request.' });
  }
};

// @desc    Get user bulk orders
// @route   GET /api/bulk-orders/my-orders
// @access  Private
export const getMyBulkOrders = async (req, res) => {
  try {
    const orders = await BulkOrder.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching bulk orders:', error);
    res.status(500).json({ message: 'Failed to fetch bulk orders.' });
  }
};
