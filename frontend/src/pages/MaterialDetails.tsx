import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Title from "@/components/Title";
import { ShoppingCart, Package, MapPin, ChevronLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function MaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await fetch(`/api/v1/materials/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setMaterial(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching material:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMaterial();
  }, [id]);

  const handleAddToCart = async (retailer: any, index: number) => {
    if (!token) {
      toast.error('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    setAddingToCart(index);
    try {
      const response = await fetch('/api/v1/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          materialId: material._id || material.id,
          name: material.name,
          price: retailer.price,
          quantity: 1,
          image: material.image,
          retailer: {
            name: retailer.name,
            distance: retailer.distance,
            stock: retailer.stock
          }
        })
      });
      
      if (response.ok) {
        toast.success(`${material.name} added to cart!`);
      } else {
        toast.error('Failed to add item to cart.');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('An error occurred.');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/30">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Material Not Found</h2>
        <Link to="/materials" className="text-primary hover:underline font-medium">Return to Materials</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/materials')}
          className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Materials
        </button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="h-64 sm:h-96 w-full bg-gray-100 relative">
            {material.image ? (
              <img src={material.image} alt={material.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-300" />
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary uppercase tracking-widest shadow-sm">
                {material.category}
              </span>
            </div>
          </div>
          
          <div className="p-6 sm:p-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">{material.name}</h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
              {material.description || `Premium quality ${material.name.toLowerCase()} sourced locally.`}
            </p>

            <Title text1={"Available"} text2={"RETAILERS"} />
            <div className="mt-6 space-y-4">
              {material.retailers?.length > 0 ? (
                material.retailers.map((retailer: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{retailer.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                          <MapPin className="w-4 h-4" /> {retailer.distance} away
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                          <Package className="w-4 h-4" /> {retailer.stock}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto">
                      <div className="text-2xl font-black text-gray-900">
                        ${retailer.price.toFixed(2)}
                      </div>
                      <button 
                        onClick={() => handleAddToCart(retailer, idx)}
                        disabled={addingToCart === idx}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        {addingToCart === idx ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-orange-800 text-sm font-medium">
                  Currently no retailers have this item in stock in your area.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialDetails;
