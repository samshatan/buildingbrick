import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { CreditCard, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import Title from "@/components/Title";

function Checkout() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { amount: number; items: any[] } | null;

  const [loading, setLoading] = useState(false);
  if (!user || !state || !state.items || state.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const { amount, items } = state;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      toast.error('Razorpay is not configured. Please contact support.');
      return;
    }

    setLoading(true);
    try {
      const scriptLoaded = await new Promise<boolean>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
      if (!scriptLoaded) {
        toast.error('Razorpay checkout could not be loaded.');
        return;
      }

      const orderResponse = await fetch('/api/v1/payment/razorpay/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, receipt: `cart_checkout_${Date.now()}` })
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok || !orderData.success || !orderData.order) {
        toast.error(orderData.message || 'Payment initiation failed.');
        return;
      }

      const payment = await new Promise<any>((resolve, reject) => {
        const checkout = new (window as any).Razorpay({
          key: razorpayKeyId,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'BrickOurHouse',
          description: 'Material order',
          order_id: orderData.order.id,
          prefill: { name: user.fullName || '', email: user.email || '' },
          theme: { color: '#8B4513' },
          handler: resolve,
        });
        checkout.on('payment.failed', (error: any) => reject(error.error || error));
        checkout.open();
      });

      const verifyResponse = await fetch('/api/v1/payment/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...payment, paymentType: 'CART_CHECKOUT', amount, items })
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok || !verifyData.success) {
        toast.error(verifyData.message || 'Payment verification failed.');
        return;
      }

      toast.success('Payment successful! Order placed.');
      navigate('/material-orders', { replace: true });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error((error as any)?.description || 'An error occurred during payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </button>

        <div className="mb-8">
          <Title text1="Secure" text2="CHECKOUT" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Secure Razorpay Checkout</h3>
            </div>

            <form onSubmit={handleCheckout} className="space-y-5">
              <p className="text-sm leading-6 text-gray-500">Complete your payment securely in Razorpay. Your card details are never stored by BrickOurHouse.</p>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                ) : (
                  <>Pay ₹{amount.toLocaleString()} <ArrowRight className="w-5 h-5" /></>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm font-medium text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Payments are secure and encrypted
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item, idx) => (
                  <div key={item._id || idx} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Img</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600 text-sm font-medium">
                  <span>Subtotal</span>
                  <span>₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm font-medium">
                  <span>Taxes & Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-primary">₹{amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
