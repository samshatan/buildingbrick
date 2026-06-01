import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, BadgeCheck, Clock, Calendar, CheckCircle2, ChevronRight, Briefcase } from "lucide-react";
import { workerCategories, workerSubscriptionPlan } from "@/data/marketplaceData";
import type { WorkerProfileResponse } from "@/components/WorkerCard";

function Product() {
  const { workerId } = useParams();
  const [worker, setWorker] = useState<WorkerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!workerId) return;
    fetch(`/api/v1/workers/${workerId}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setWorker(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch worker profile:", err);
        setLoading(false);
      });
  }, [workerId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Briefcase className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-500 font-medium max-w-sm text-center mb-8">
          The worker profile you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/workers" className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-600 transition-colors">
          Browse All Workers
        </Link>
      </div>
    );
  }

  const category = workerCategories.find((cat) => cat.id === worker.categoryId);
  
  // Format worker types cleanly if they are comma separated
  const displayWorkerTypes = worker.workerType.split(',').map(t => t.trim());

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Breadcrumb / Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center text-sm font-medium text-gray-500">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link to="/workers" className="hover:text-primary transition-colors">Workers</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-900 truncate">{worker.displayName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden mb-8">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-primary/10 flex items-center justify-center shadow-inner border border-primary/20 shrink-0">
                  {worker.photo ? (
                    <img src={worker.photo} alt={worker.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-extrabold text-primary">
                      {worker.displayName.charAt(0)}
                    </span>
                  )}
                </div>
                {worker.availabilityStatus === 'AVAILABLE' && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm" title="Available"></div>
                )}
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{worker.displayName}</h1>
                  {worker.verified && <BadgeCheck className="w-6 h-6 text-green-500 shrink-0" />}
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
                  {displayWorkerTypes.map((type, idx) => (
                    <span key={idx} className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-bold">
                      {type}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                    {category?.name ?? "General"}
                  </span>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start gap-6 text-sm font-medium text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {worker.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{worker.rating?.toFixed(1) || "0.0"}</span>
                    <span className="text-gray-400">({worker.jobsCompleted} jobs)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3 bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Daily Rate</div>
              <div className="text-3xl font-extrabold text-primary">Rs {worker.dailyRate}</div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full w-full text-center mt-2 ${worker.availabilityStatus === "AVAILABLE" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                {worker.availabilityStatus === "AVAILABLE" ? "Available for Hire" : "Currently Busy"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Custom Tabs */}
            <div className="flex gap-8 border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-4 text-sm font-bold transition-all ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 text-sm font-bold transition-all ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Reviews & Past Jobs
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-600 leading-relaxed font-medium">
                      {worker.bio || "This worker hasn't added a biography yet, but they are ready to help with your next project. Highly skilled and verified by our platform."}
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-wrap gap-2">
                       {worker.skills ? worker.skills.split(',').map((skill, i) => (
                         <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-200">
                           <CheckCircle2 className="w-4 h-4 text-primary" />
                           {skill.trim()}
                         </div>
                       )) : (
                         <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-200">
                           <CheckCircle2 className="w-4 h-4 text-primary" />
                           General Labor
                         </div>
                       )}
                    </div>
                  </div>
                </section>

              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-500 font-medium">Be the first to hire and review {worker.displayName.split(' ')[0]}.</p>
                </div>
              </div>
            )}

          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Hire this professional</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> Experience</span>
                  <span className="font-bold text-gray-900">{worker.experienceYears} Years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium flex items-center gap-2"><Calendar className="w-4 h-4" /> Priority Tier</span>
                  <span className="font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">Dynamic</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link to={`/direct-hire/${worker.id}`} className="block w-full text-center bg-primary hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-primary/20">
                  Request to Hire
                </Link>
                <Link to="/hire-request" className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-3 rounded-xl transition-colors text-center">
                  Post Public Job
                </Link>
              </div>
              <p className="text-xs text-gray-400 text-center mt-4 font-medium">
                You won't be charged until the worker accepts.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white shadow-lg">
              <h4 className="font-bold mb-2">Worker Verification</h4>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Registered workers pay Rs {workerSubscriptionPlan.fee} for a {workerSubscriptionPlan.durationMonths}-month subscription to maintain their verified status on the platform.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Product;
