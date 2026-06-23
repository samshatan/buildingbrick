import { motion } from 'motion/react';
import { Search, Star, MapPin, Briefcase, Filter } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WORKERS = [
  {
    id: 1,
    name: "Marcus Johnson",
    role: "Master Mason",
    rating: 4.9,
    reviews: 124,
    rate: 45,
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    skills: ["Brickwork", "Stone", "Restoration"],
    available: true,
    ratingHistory: [ { month: 'Jan', rating: 4.8 }, { month: 'Feb', rating: 4.8 }, { month: 'Mar', rating: 4.9 }, { month: 'Apr', rating: 4.9 }, { month: 'May', rating: 4.8 }, { month: 'Jun', rating: 4.9 } ],
    projectHistory: [ { month: 'Jan', projects: 4 }, { month: 'Feb', projects: 3 }, { month: 'Mar', projects: 6 }, { month: 'Apr', projects: 5 }, { month: 'May', projects: 7 }, { month: 'Jun', projects: 5 } ]
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "General Contractor",
    rating: 4.8,
    reviews: 89,
    rate: 65,
    location: "Evanston, IL",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    skills: ["Project Management", "Permits", "Estimation"],
    available: false,
    ratingHistory: [ { month: 'Jan', rating: 4.7 }, { month: 'Feb', rating: 4.7 }, { month: 'Mar', rating: 4.8 }, { month: 'Apr', rating: 4.8 }, { month: 'May', rating: 4.9 }, { month: 'Jun', rating: 4.8 } ],
    projectHistory: [ { month: 'Jan', projects: 2 }, { month: 'Feb', projects: 2 }, { month: 'Mar', projects: 3 }, { month: 'Apr', projects: 3 }, { month: 'May', projects: 2 }, { month: 'Jun', projects: 4 } ]
  },
  {
    id: 3,
    name: "David Rodriguez",
    role: "Cafe Staff / Barista",
    rating: 4.7,
    reviews: 56,
    rate: 22,
    location: "Oak Park, IL",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    skills: ["Espresso", "Customer Service", "Inventory"],
    available: true,
    ratingHistory: [ { month: 'Jan', rating: 4.5 }, { month: 'Feb', rating: 4.6 }, { month: 'Mar', rating: 4.6 }, { month: 'Apr', rating: 4.7 }, { month: 'May', rating: 4.7 }, { month: 'Jun', rating: 4.7 } ],
    projectHistory: [ { month: 'Jan', projects: 12 }, { month: 'Feb', projects: 15 }, { month: 'Mar', projects: 14 }, { month: 'Apr', projects: 18 }, { month: 'May', projects: 16 }, { month: 'Jun', projects: 19 } ]
  },
  {
    id: 4,
    name: "Michael Torres",
    role: "Laborer",
    rating: 4.6,
    reviews: 42,
    rate: 28,
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    skills: ["Demolition", "Site Cleanup", "Material Transport"],
    available: true,
    ratingHistory: [ { month: 'Jan', rating: 4.5 }, { month: 'Feb', rating: 4.5 }, { month: 'Mar', rating: 4.5 }, { month: 'Apr', rating: 4.6 }, { month: 'May', rating: 4.6 }, { month: 'Jun', rating: 4.6 } ],
    projectHistory: [ { month: 'Jan', projects: 6 }, { month: 'Feb', projects: 8 }, { month: 'Mar', projects: 7 }, { month: 'Apr', projects: 9 }, { month: 'May', projects: 8 }, { month: 'Jun', projects: 10 } ]
  }
];

export default function WorkersScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedWorker, setSelectedWorker] = useState<typeof WORKERS[0] | null>(null);

  const categories = ["All", "Masons", "Contractors", "Cafe Staff", "Laborers"];

  const filteredWorkers = WORKERS.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          worker.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeCategory === "All") return matchesSearch;
    if (activeCategory === "Masons") return matchesSearch && worker.role.includes("Mason");
    if (activeCategory === "Contractors") return matchesSearch && worker.role.includes("Contractor");
    if (activeCategory === "Cafe Staff") return matchesSearch && worker.role.includes("Cafe");
    if (activeCategory === "Laborers") return matchesSearch && worker.role.includes("Laborer");
    
    return matchesSearch;
  });

  if (selectedWorker) {
    return (
      <div className="flex flex-col h-full bg-zinc-50 relative pb-24">
        <div className="h-48 bg-zinc-200 relative">
           <img src={selectedWorker.image} alt={selectedWorker.name} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
           <button 
             onClick={() => setSelectedWorker(null)}
             className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
           >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           </button>
           <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-3xl font-display font-medium text-white mb-1">{selectedWorker.name}</h1>
              <p className="text-sm font-medium text-zinc-300">{selectedWorker.role}</p>
           </div>
        </div>

        <div className="flex-1 px-6 pt-6 flex flex-col gap-6 -mt-4 relative bg-zinc-50 rounded-t-[24px]">
           <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-zinc-100">
             <div className="text-center flex-1 border-r border-zinc-100">
               <div className="text-xl font-display font-medium text-zinc-900">${selectedWorker.rate}</div>
               <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rate / hr</div>
             </div>
             <div className="text-center flex-1 border-r border-zinc-100">
               <div className="text-xl font-display font-medium text-zinc-900 flex items-center justify-center gap-1">
                 {selectedWorker.rating} <Star size={14} className="fill-yellow-500 text-yellow-500" />
               </div>
               <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rating</div>
             </div>
             <div className="text-center flex-1">
               <div className="text-xl font-display font-medium text-zinc-900">{selectedWorker.reviews}</div>
               <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reviews</div>
             </div>
           </div>

           <div>
              <h3 className="text-sm font-bold text-zinc-900 tracking-wide mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedWorker.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-white text-zinc-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-zinc-200">
                    {skill}
                  </span>
                ))}
              </div>
              
              <h3 className="text-sm font-bold text-zinc-900 tracking-wide mb-3">Rating Trends</h3>
              <div className="h-48 w-full bg-white p-4 rounded-2xl border border-zinc-200 mb-6">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={selectedWorker.ratingHistory}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} dy={10} />
                     <YAxis domain={['dataMin - 0.1', 'dataMax + 0.1']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} dx={-10} hide />
                     <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                       cursor={{ stroke: '#f4f4f5', strokeWidth: 32 }}
                     />
                     <Line type="monotone" dataKey="rating" stroke="#cc4518" strokeWidth={3} dot={{ r: 4, fill: '#cc4518', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                   </LineChart>
                 </ResponsiveContainer>
              </div>

               <h3 className="text-sm font-bold text-zinc-900 tracking-wide mb-3">Projects Completed</h3>
               <div className="h-48 w-full bg-white p-4 rounded-2xl border border-zinc-200 mb-6">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={selectedWorker.projectHistory}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} dy={10} />
                     <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                       cursor={{ fill: '#f4f4f5' }}
                     />
                     <Bar dataKey="projects" fill="#18181b" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
           </div>

           <div>
              <h3 className="text-sm font-bold text-zinc-900 tracking-wide mb-3">Project Details</h3>
              <textarea placeholder="Describe the job and your requirements..." className="w-full h-32 px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-medium text-zinc-900 outline-none focus:border-primary-500 transition-colors resize-none placeholder:text-zinc-400" />
           </div>

           <button className="w-full py-4 mt-auto mb-6 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors shadow-lg shadow-primary-500/20">
             Send Request to Hire
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full px-6 pt-12 pb-24 relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-display font-medium text-zinc-700 mb-2">
          Marketplace
        </h1>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
          Find qualified workers & contractors
        </p>
      </motion.div>
      
      {/* Search Bar */}
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
          placeholder="Search by role or skill..." 
          className="flex-1 bg-transparent px-3 text-sm outline-none text-zinc-700 placeholder:text-zinc-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 shrink-0 cursor-pointer hover:bg-primary-100 transition-colors">
          <Filter size={18} />
        </div>
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

      {/* Workers List */}
      <div className="flex flex-col gap-4">
        {filteredWorkers.map((worker, index) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            className="bg-white rounded-[24px] p-5 shadow-sm border border-zinc-100 flex flex-col gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100 shrink-0 border-2 border-white shadow-sm">
                <img src={worker.image} alt={worker.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-zinc-900 truncate pr-2">{worker.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full text-yellow-600 shrink-0">
                    <Star size={12} className="fill-yellow-500" />
                    <span className="text-[10px] font-bold">{worker.rating}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-primary-600 mb-2">{worker.role}</div>
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} /> {worker.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={12} /> {worker.reviews} jobs
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-50">
              {worker.skills.map(skill => (
                <span key={skill} className="px-2.5 py-1 bg-zinc-50 text-zinc-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-zinc-100">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-zinc-900 font-display text-xl font-medium">
                ${worker.rate}<span className="text-xs font-sans font-bold text-zinc-400 uppercase tracking-widest">/hr</span>
              </div>
              <button 
                onClick={() => setSelectedWorker(worker)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                  worker.available 
                    ? "bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-500/20" 
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                }`}
                disabled={!worker.available}
              >
                {worker.available ? "Hire Now" : "Busy"}
              </button>
            </div>
          </motion.div>
        ))}

        {filteredWorkers.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-sm font-medium">
            No workers found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
