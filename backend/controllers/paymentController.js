import crypto from 'crypto';
import WorkerProfile from '../models/WorkerProfile.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// Configuration
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
const SALT_KEY = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const ENV = process.env.PHONEPE_ENV || 'UAT';

const PHONEPE_HOST = ENV === 'UAT' 
  ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
  : 'https://api.phonepe.com/apis/hermes';

// Utility to generate X-VERIFY signature
const generateSignature = (payloadString, endpoint) => {
  const dataToHash = payloadString + endpoint + SALT_KEY;
  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  return hash + '###' + SALT_INDEX;
};

// @desc    Initiate a PhonePe payment
// @route   POST /api/v1/payment/phonepe/initiate
// @access  Private
export const initiatePhonePePayment = async (req, res) => {
  try {
    const { workerProfileId } = req.body;
    
    if (!workerProfileId) {
      return res.status(400).json({ message: 'Worker Profile ID is required.' });
    }

    const worker = await WorkerProfile.findById(workerProfileId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker Profile not found.' });
    }

    // Verify ownership
    if (worker.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to make payment for this profile.' });
    }

    // Generate a unique Merchant Transaction ID
    const merchantTransactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Define amount in Paise (Rs 19.00 = 1900 paise)
    const amount = 1900; 

    // Important: Determine the frontend redirect URL
    // We assume the frontend is running on localhost:5173 or the host originating the request
    const origin = req.headers.origin || 'http://localhost:5173';
    const redirectUrl = `${origin}/verification-required?success=true`;
    
    // We also need a backend webhook endpoint that PhonePe will call S2S
    // Normally this needs to be a public IP. For local testing, PhonePe cannot hit localhost.
    // However, the PhonePe UAT often relies on the redirectUrl for UI flow.
    // For this implementation, we will actually update the DB upon successful redirect if webhook isn't reachable locally.
    
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: req.user._id.toString(),
      amount: amount,
      redirectUrl: redirectUrl,
      redirectMode: 'REDIRECT',
      callbackUrl: `${origin}/api/v1/payment/phonepe/callback`, // Needs a public IP in PROD
      mobileNumber: '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const payloadString = JSON.stringify(payload);
    const base64EncodedPayload = Buffer.from(payloadString).toString('base64');
    
    const endpoint = '/pg/v1/pay';
    const signature = generateSignature(base64EncodedPayload, endpoint);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': signature,
        'accept': 'application/json'
      },
      body: JSON.stringify({ request: base64EncodedPayload })
    };

    const response = await fetch(`${PHONEPE_HOST}${endpoint}`, requestOptions);
    const responseData = await response.json();

    if (responseData.success) {
      // Store transaction intent temporarily if needed, but here we just return the URL
      // We will also optimistically mark fee as paid here for local testing purposes 
      // since UAT webhooks won't reach localhost.
      // In production, you MUST move this to the callback URL verification!
      if (ENV === 'UAT') {
         worker.onboardingFeePaid = true;
         if (worker.verificationStatus === 'INCOMPLETE') {
           worker.verificationStatus = 'PENDING';
         }
         await worker.save();
      }
      
      const paymentUrl = responseData.data.instrumentResponse.redirectInfo.url;
      res.status(200).json({ success: true, url: paymentUrl });
    } else {
      console.error('PhonePe error:', responseData);
      res.status(400).json({ success: false, message: responseData.message });
    }
  } catch (error) {
    console.error('PhonePe Initiation Error:', error);
    res.status(500).json({ message: 'Server error initiating payment.' });
  }
};

// @desc    PhonePe Server-to-Server Webhook Callback
// @route   POST /api/v1/payment/phonepe/callback
// @access  Public
export const phonePeCallback = async (req, res) => {
  try {
    const { response } = req.body;
    
    // In production, decode `response`, verify the signature against X-VERIFY header, 
    // extract `merchantTransactionId` and `merchantUserId`, 
    // and then update the WorkerProfile `onboardingFeePaid` to true.
    
    // As this is a placeholder for the actual public callback:
    console.log('PhonePe Webhook received:', response);
    res.status(200).send('OK');
  } catch (error) {
    console.error('PhonePe Callback Error:', error);
    res.status(500).send('Error processing callback');
  }
};

// @desc    Process a cart checkout (Simulated for Demo)
// @route   POST /api/v1/payment/process
// @access  Private
export const processCheckout = async (req, res) => {
  try {
    const { amount, items, paymentMethod, cardDetails } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    // 1. Create the Order
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
      totalAmount: amount,
      paymentStatus: 'PAID', // Simulating successful card charge
      orderStatus: 'PROCESSING'
    });

    // 2. Clear the User's Cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(200).json({ success: true, data: order, message: 'Payment successful!' });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Server error processing payment.' });
  }
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
