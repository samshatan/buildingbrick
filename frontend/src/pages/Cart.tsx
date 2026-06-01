import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClipboardList, MapPin, CalendarDays, DollarSign, Send, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { workerCategories } from "@/data/marketplaceData";
import { toast } from "react-toastify";

function Cart() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  
  const [request, setRequest] = useState({
    title: "",
    categoryId: searchParams.get('categoryId') || "",
    workerType: searchParams.get('workerType') || "",
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post a work request.");
      navigate("/login");
      return;
    }

    const payload = {
      hirerUserId: user.id,
      title: request.title,
      categoryId: request.categoryId,
      workerType: request.workerType,
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
      navigate('/requests');
    } catch (err) {
      console.error(err);
      toast.update(loadingToast, { render: "An unexpected error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 shadow-sm">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Post a Work Request</h1>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Describe what you need done, set your budget, and let qualified professionals in your area apply to help.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          
          <div className="bg-blue-50/50 border-b border-blue-100 p-6 flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div>
               <h3 className="text-blue-900 font-bold mb-1">Make your post stand out</h3>
               <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                 The more detailed your description and accurate your budget, the faster you'll receive high-quality proposals from top-rated workers.
               </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Information</h3>
              
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
                  <label className="text-sm font-bold text-gray-700">Category <span className="text-red-500">*</span></label>
                  <select
                    name="categoryId"
                    required
                    value={request.categoryId}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a main category</option>
                    {workerCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Specific Profession <span className="text-red-500">*</span></label>
                  <input
                    name="workerType"
                    required
                    value={request.workerType}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="e.g. Plumber, Electrician"
                  />
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Location & Schedule</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Location
                </label>
                <input
                  name="location"
                  value={request.location}
                  onChange={handleChange}
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
                    value={request.endDate}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Budget & Details */}
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Budget & Details</h3>
              
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

          <div className="bg-gray-50 p-6 sm:px-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 font-medium text-center sm:text-left">
              Your request will be publicly visible to all registered workers.
            </p>
            <button 
              type="submit" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-600 shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200"
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

export default Cart;
