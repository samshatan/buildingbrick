import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClipboardList, MapPin, CalendarDays, DollarSign, Send, Info, Building2, Home, Building, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { workerCategories } from "@/data/marketplaceData";
import { toast } from "react-toastify";

function HireRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  
  const [request, setRequest] = useState({
    title: "",
    categoryId: searchParams.get('categoryId') || "",
    workerType: searchParams.get('workerType') || "",
    buildingType: "",
    location: "",
    startDate: "",
    endDate: "",
    budgetMin: "",
    budgetMax: "",
    details: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setRequest({ ...request, [event.target.name]: event.target.value });
  };

  const handleBuildingTypeChange = (type: string) => {
    setRequest({ ...request, buildingType: type });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post a work request.");
      navigate("/login");
      return;
    }

    if (!request.buildingType) {
      toast.error("Please select a building type.");
      return;
    }

    const payload = {
      hirerUserId: user.id,
      title: request.title,
      categoryId: request.categoryId,
      workerType: request.workerType,
      buildingType: request.buildingType,
      location: request.location,
      startDate: request.startDate || null,
      endDate: request.endDate || null,
      budgetMin: request.budgetMin ? parseInt(request.budgetMin) : 0,
      budgetMax: request.budgetMax ? parseInt(request.budgetMax) : 0,
      description: request.details
    };

    const loadingToast = toast.loading("Posting your request...");

    try {
      const response = await fetch('/api/v1/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.update(loadingToast, { render: err.message || 'Failed to post work request.', type: "error", isLoading: false, autoClose: 3000 });
        return;
      }

      toast.update(loadingToast, { render: "Work request posted successfully!", type: "success", isLoading: false, autoClose: 3000 });
      navigate('/work-requests'); // Redirects to work requests
    } catch (err) {
      console.error(err);
      toast.update(loadingToast, { render: "An unexpected error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 text-white mb-6 shadow-xl shadow-primary/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <ClipboardList className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Post a Work Request</h1>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Describe what you need done, set your budget, and let qualified professionals in your area apply to help.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-white overflow-hidden">
          
          <div className="bg-blue-50/80 border-b border-blue-100/50 p-6 sm:p-8 flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-xl shrink-0 mt-0.5">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
               <h3 className="text-blue-900 text-lg font-bold mb-1">Make your post stand out</h3>
               <p className="text-blue-800/80 font-medium leading-relaxed">
                 The more detailed your description and accurate your budget, the faster you'll receive high-quality proposals from top-rated workers.
               </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-10">
            
            {/* Building Type Selection */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                Project Category
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'Residential', icon: Home, desc: 'Homes & Apartments' },
                  { id: 'Corporate', icon: Building2, desc: 'Offices & Retail' },
                  { id: 'High Rise', icon: Building, desc: 'Towers & Skyscrapers' }
                ].map((type) => {
                  const isSelected = request.buildingType === type.id;
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleBuildingTypeChange(type.id)}
                      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]' 
                          : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-primary">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                      <Icon className={`w-10 h-10 mb-3 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                      <span className={`font-bold text-lg mb-1 ${isSelected ? 'text-primary' : 'text-gray-700'}`}>{type.id}</span>
                      <span className="text-xs font-medium text-gray-500 text-center">{type.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                Basic Information
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Job Title <span className="text-red-500">*</span></label>
                <input
                  name="title"
                  required
                  value={request.title}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="e.g. Need a professional plumber for bathroom renovation"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Trade Category <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      name="categoryId"
                      required
                      aria-label="Trade Category"
                      value={request.categoryId}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a main category</option>
                      {workerCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Specific Profession <span className="text-red-500">*</span></label>
                  <input
                    name="workerType"
                    required
                    title="Specific profession"
                    value={request.workerType}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="e.g. Plumber, Electrician"
                  />
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                Location & Schedule
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Location
                </label>
                <input
                  name="location"
                  value={request.location}
                  onChange={handleChange}
                  title="Project location"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="e.g. Downtown Area, City"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" /> Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    title="Start date"
                    value={request.startDate}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" /> End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    title="End date"
                    value={request.endDate}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Budget & Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">4</span>
                Budget & Details
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" /> Min Daily Budget (Rs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="budgetMin"
                    value={request.budgetMin}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="e.g. 1000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" /> Max Daily Budget (Rs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="budgetMax"
                    value={request.budgetMax}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="e.g. 2000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Detailed Description <span className="text-red-500">*</span></label>
                <textarea
                  name="details"
                  required
                  value={request.details}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                  placeholder="Describe the scope of work, any materials provided, specific requirements..."
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-gray-50/50 p-6 sm:px-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Your request will be instantly visible to all verified workers matching your criteria.
              </p>
            </div>
            <button 
              type="submit" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary to-blue-600 hover:from-primary-600 hover:to-blue-700 shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Post Job Now
              <Send className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default HireRequest;
