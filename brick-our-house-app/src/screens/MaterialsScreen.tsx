import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, ChevronLeft, ShoppingCart, Store, CheckCircle2, TrendingDown } from 'lucide-react';

const MATERIALS = [
  {
    id: 1,
    name: "Classic Red Brick (Pallet)",
    category: "Bricks",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&q=80",
    description: "Standard red clay bricks for general masonry. 500 count per pallet.",
    retailers: [
      { name: "HomeDepot", price: 355, stock: "Low Stock", distance: "2.1 mi" },
      { name: "BuildMart", price: 340, stock: "In Stock", distance: "4.5 mi" },
      { name: "Masonry Supply Co.", price: 325, stock: "In Stock", distance: "8.0 mi" }
    ]
  },
  {
    id: 2,
    name: "Portland Cement (50lb)",
    category: "Cement",
    image: "https://images.unsplash.com/photo-1621644782250-bcce4cc87c32?auto=format&fit=crop&w=300&q=80",
    description: "High quality portland cement for structural concrete.",
    retailers: [
      { name: "BuildMart", price: 18.50, stock: "In Stock", distance: "4.5 mi" },
      { name: "City Hardware", price: 21.00, stock: "In Stock", distance: "1.2 mi" },
      { name: "HomeDepot", price: 17.90, stock: "Out of Stock", distance: "2.1 mi" }
    ]
  },
  {
    id: 3,
    name: "Washed Concrete Sand (Ton)",
    category: "Sand",
    image: "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?auto=format&fit=crop&w=300&q=80",
    description: "Clean washed sand for mixing and leveling.",
    retailers: [
      { name: "City Hardware", price: 45, stock: "In Stock", distance: "1.2 mi" },
      { name: "Masonry Supply Co.", price: 40, stock: "In Stock", distance: "8.0 mi" }
    ]
  }
];

export default function MaterialsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState<typeof MATERIALS[0] | null>(null);

  const categories = ["All", "Bricks", "Cement", "Sand", "Lumber"];

  const filteredMaterials = MATERIALS.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          material.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === "All") return matchesSearch;
    return matchesSearch && material.category === activeCategory;
  });

  if (selectedMaterial) {
    const sortedRetailers = [...selectedMaterial.retailers].sort((a, b) => a.price - b.price);
    const bestPrice = sortedRetailers.length > 0 ? sortedRetailers[0].price : 0;

    return (
      <div className="flex flex-col h-full bg-zinc-50 relative pb-24">
        <div className="h-56 bg-zinc-200 relative">
           <img src={selectedMaterial.image} alt={selectedMaterial.name} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent opacity-80" />
           <button 
             onClick={() => setSelectedMaterial(null)}
             className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
           >
             <ChevronLeft size={24} />
           </button>
           <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-widest text-white mb-3 inline-block">
                 {selectedMaterial.category}
              </span>
              <h1 className="text-2xl font-display font-medium text-white leading-tight mb-1">{selectedMaterial.name}</h1>
           </div>
        </div>

        <div className="flex-1 px-6 pt-6 flex flex-col gap-6 relative bg-zinc-50 rounded-t-[24px] -mt-4">
           <div>
              <h3 className="text-sm font-bold text-zinc-900 tracking-wide mb-2">Description</h3>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed">{selectedMaterial.description}</p>
           </div>
           
           <div>
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold text-zinc-900 tracking-wide">Compare Retailers</h3>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                   <TrendingDown size={14} /> Best Price: ${bestPrice.toFixed(2)}
                 </div>
              </div>
              
              <div className="flex flex-col gap-3">
                {sortedRetailers.map((retailer, i) => (
                  <div key={i} className={`p-4 border rounded-[24px] bg-white flex items-center justify-between transition-colors ${i === 0 ? 'border-primary-500 shadow-sm shadow-primary-500/10' : 'border-zinc-100 shadow-sm'}`}>
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2">
                         <Store size={14} className={i === 0 ? "text-primary-500" : "text-zinc-400"} />
                         <span className="font-bold text-zinc-900 text-sm">{retailer.name}</span>
                       </div>
                       <div className="flex items-center gap-2 mt-0.5">
                         <span className={`text-[10px] font-bold uppercase tracking-widest ${retailer.stock === 'In Stock' ? 'text-emerald-500' : 'text-red-500'}`}>{retailer.stock}</span>
                         <span className="text-[10px] font-bold text-zinc-400">•</span>
                         <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 tracking-wide">
                            <MapPin size={10} /> {retailer.distance}
                         </div>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="font-display font-medium text-lg text-zinc-900">${retailer.price.toFixed(2)}</span>
                       <button className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${retailer.stock === 'In Stock' ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}>
                         Buy Now
                       </button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full px-6 pt-12 pb-24 relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-3xl font-display font-medium text-zinc-700">Materials</h1>
        <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 bg-white">
          <ShoppingCart size={20} />
        </div>
      </motion.div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-full p-2 border border-zinc-200 shadow-sm flex items-center mb-4"
      >
        <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 shrink-0">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search materials..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-medium text-zinc-700 placeholder:text-zinc-400"
        />
      </motion.div>

      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-4 mb-2 custom-scrollbar"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
              activeCategory === category 
                ? "bg-zinc-800 text-white" 
                : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Materials List */}
      <div className="flex flex-col gap-4">
        {filteredMaterials.map((material, index) => {
          const sortedPrices = material.retailers.map(r => r.price).sort((a, b) => a - b);
          const bestPrice = sortedPrices.length > 0 ? sortedPrices[0] : 0;
          return (
            <motion.div 
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              onClick={() => setSelectedMaterial(material)}
              className="bg-white rounded-[24px] p-4 shadow-sm border border-zinc-100 flex gap-4 cursor-pointer hover:border-zinc-200 transition-colors"
            >
              <div className="w-24 h-24 rounded-[16px] overflow-hidden shrink-0">
                <img src={material.image} alt={material.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center flex-1">
                <span className="text-[9px] font-bold text-primary-500 uppercase tracking-widest mb-1">{material.category}</span>
                <h3 className="font-bold text-zinc-900 text-sm leading-tight mb-2">{material.name}</h3>
                
                <div className="flex items-center justify-between mt-auto">
                   <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">From</span>
                     <span className="font-display font-medium text-zinc-900">${bestPrice.toFixed(2)}</span>
                   </div>
                   <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-50 border border-zinc-100 text-[10px] font-bold text-zinc-600 rounded-lg">
                     <Store size={12} /> {material.retailers.length} Retailers
                   </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filteredMaterials.length === 0 && (
          <div className="text-center text-zinc-500 text-sm mt-8">No materials found.</div>
        )}
      </div>
    </div>
  );
}
