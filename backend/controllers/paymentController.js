import crypto from 'crypto';
import WorkerProfile from '../models/WorkerProfile.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Razorpay from 'razorpay';

const getRazorpayClient = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    const error = new Error('Razorpay credentials are not configured');
    error.code = 'RAZORPAY_NOT_CONFIGURED';
    throw error;
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
};

// @desc    Get user material orders
// @route   GET /api/v1/payment/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching orders.' });
  }
};

// @desc    Initiate a Razorpay payment
// @route   POST /api/v1/payment/razorpay/initiate
// @access  Private
export const initiateRazorpayPayment = async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const order = await getRazorpayClient().orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Razorpay Initiation Error:', error);
    if (error.code === 'RAZORPAY_NOT_CONFIGURED') {
      return res.status(503).json({ success: false, message: 'Razorpay is not configured on the server.' });
    }
    res.status(500).json({ success: false, message: 'Server error initiating Razorpay payment.' });
  }
};

// @desc    Verify a Razorpay payment
// @route   POST /api/v1/payment/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentType, referenceId, items } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ success: false, message: 'Razorpay is not configured on the server.' });
    }

    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
       // Payment is verified, handle business logic
       if (paymentType === 'WORKER_ONBOARDING') {
          const worker = await WorkerProfile.findById(referenceId);
          if (worker && worker.userId.toString() === req.user._id.toString()) {
             worker.onboardingFeePaid = true;
             if (worker.verificationStatus === 'INCOMPLETE') {
               worker.verificationStatus = 'PENDING';
             }
             await worker.save();
          }
       } else if (paymentType === 'CART_CHECKOUT') {
           // Create the Order
           const order = await Order.create({
             user: req.user._id,
             items: items.map(i => ({
               materialId: i.materialId,
               name: i.name,
               price: i.price,
               quantity: i.quantity,
               image: i.image,
               retailer: i.retailer
             })),
             totalAmount: req.body.amount,
             paymentStatus: 'PAID',
             orderStatus: 'PROCESSING',
             transactionId: razorpay_payment_id
           });

           // Clear the User's Cart
           await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
       }

       res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
       res.status(400).json({ success: false, message: 'Invalid signature sent!' });
    }
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    res.status(500).json({ success: false, message: 'Server error verifying Razorpay payment.' });
  }
};
