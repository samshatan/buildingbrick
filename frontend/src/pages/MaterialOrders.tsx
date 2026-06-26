import { useState, useEffect } from 'react';
import Title from "@/components/Title";
import { Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function MaterialOrders() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/v1/payment/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOrders(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-500 font-medium mb-6">Please login to view your material orders.</p>
        <Link to="/login" className="px-6 py-2.5 bg-primary text-white font-bold rounded-full">Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Title text1={"Material"} text2={"ORDERS"} />
          <p className="text-sm text-gray-500 font-medium mt-2">
            Track your construction material purchases and deliveries.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
            <p className="text-gray-500 font-medium">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm text-center px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 font-medium max-w-sm mb-8">
              When you buy materials, your orders will appear here.
            </p>
            <Link 
              to="/materials"
              className="px-6 py-3 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isDelivered = order.orderStatus === 'DELIVERED';
              const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div key={order._id} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">Placed on {date}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDelivered ? 'bg-green-50 border-green-200 text-green-700' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                      {isDelivered ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      <span className="text-xs font-bold uppercase tracking-wider">{order.orderStatus}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                          <p className="text-xs text-gray-500 font-medium">{item.retailer?.name || 'Local Supplier'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-500 font-medium mt-1">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Amount</span>
                    <span className="text-2xl font-extrabold text-gray-900">${order.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MaterialOrders;
