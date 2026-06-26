import { useState, useEffect } from 'react';
import Title from "@/components/Title";
import { Search, Store, Package } from 'lucide-react';
import { Link } from 'react-router-dom';


function Materials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Bricks", "Cement", "Sand", "Lumber"];

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/v1/materials');
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setMaterials(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          material.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === "All") return matchesSearch;
    return matchesSearch && material.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Title text1={"Material"} text2={"STORE"} />
          <p className="text-sm text-gray-500 font-medium mt-2 max-w-2xl">
            Browse and order construction materials from top local retailers directly to your site.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search materials..."
            className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none font-medium"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Categories */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Categories
            </h2>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeCategory === category 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm h-full min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
              <p className="text-gray-500 font-medium">Loading materials...</p>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm h-full min-h-[400px] text-center px-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-500 font-medium max-w-sm">
                We couldn't find any materials matching your current filters.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="mt-8 px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-full transition-colors text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMaterials.map(material => {
                const sortedPrices = material.retailers?.map((r: any) => r.price).sort((a: number, b: number) => a - b) || [];
                const bestPrice = sortedPrices.length > 0 ? sortedPrices[0] : 0;
                
                return (
                  <Link to={`/materials/${material._id || material.id}`} key={material._id || material.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100">
                      {material.image ? (
                        <img src={material.image} alt={material.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">{material.category}</span>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{material.name}</h3>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-4">{material.description || "High quality building material."}</p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Starting from</p>
                          <p className="text-xl font-extrabold text-gray-900">${bestPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                          <Store className="w-4 h-4 text-gray-500" />
                          <span className="text-xs font-bold text-gray-700">{material.retailers?.length || 0} Options</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Materials;
