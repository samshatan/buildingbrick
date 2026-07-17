import { useState } from "react";
import Title from "@/components/Title";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function BulkOrders() {
  const { token, user } = useAuth();
  const [materials, setMaterials] = useState("");
  const [quantity, setQuantity] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to submit a bulk order.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/v1/bulk-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          materialsRequested: materials,
          quantityDescription: quantity,
          deliveryAddress: address
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      setSuccess(true);
      toast.success("Bulk order request submitted successfully!");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Title text1={"Bulk"} text2={"ORDERS"} />
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🚚</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wholesale Materials Pricing</h2>
          <p className="text-gray-600 mb-8 max-w-2xl text-lg">
            Need materials in large quantities for a major project? Request a bulk order for special discounted pricing on bricks, cement, sand, and more.
          </p>
          
          {success ? (
            <div className="bg-green-50 p-8 rounded-2xl border border-green-100 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
              <p className="text-gray-600 mb-6">We've received your bulk order request. Our team will review your requirements and get back to you with a quote shortly.</p>
              <Link to="/" className="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors">
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Request a Quote</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">What materials do you need?</label>
                  <textarea
                    required
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="E.g., 500 bags of cement, 10,000 red bricks..."
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quantity & Timeline</label>
                  <textarea
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="E.g., Need it delivered by next week."
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address (Optional)</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Where should it be delivered?"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all min-h-[80px]"
                  />
                </div>
              </div>

              {!token ? (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-4 text-amber-800 text-sm font-medium">
                  You must be logged in to submit a request. <Link to="/login" className="underline font-bold">Log in here</Link>.
                </div>
              ) : null}

              <button 
                type="submit" 
                disabled={loading || !token}
                className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
