import RazorpayCheckout from 'react-native-razorpay';
import apiClient from './client';

type PaymentDetails = {
  amount: number;
  paymentType: 'CART_CHECKOUT' | 'WORKER_ONBOARDING';
  referenceId?: string;
  items?: any[];
  name?: string;
  email?: string;
  contact?: string;
};

const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;

export async function payWithRazorpay({
  amount,
  paymentType,
  referenceId,
  items,
  name,
  email,
  contact,
}: PaymentDetails) {
  if (!RAZORPAY_KEY_ID) {
    throw new Error('Razorpay is not configured. Please contact support.');
  }

  const orderResponse = await apiClient.post('/payment/razorpay/initiate', {
    amount,
    receipt: `${paymentType.toLowerCase()}_${Date.now()}`,
  });
  const order = orderResponse.data?.order;

  if (!order?.id) {
    throw new Error(orderResponse.data?.message || 'Payment initiation failed.');
  }

  const prefill: any = {};
  if (name) prefill.name = name;
  if (email) prefill.email = email;
  if (contact) prefill.contact = contact;

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency || 'INR',
    name: 'BrickOurHouse',
    description: paymentType === 'CART_CHECKOUT' ? 'Material order' : 'Worker onboarding fee',
    order_id: order.id,
    prefill,
    theme: { color: '#8B4513' },
  };

  console.log("Opening Razorpay with options:", options);

  const payment = await RazorpayCheckout.open(options);

  const verificationResponse = await apiClient.post('/payment/razorpay/verify', {
    ...payment,
    paymentType,
    referenceId,
    amount,
    items,
  });

  if (!verificationResponse.data?.success) {
    throw new Error(verificationResponse.data?.message || 'Payment verification failed.');
  }

  return verificationResponse.data;
}
