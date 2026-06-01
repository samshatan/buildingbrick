import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Phone, MapPin, Send, Briefcase, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import type { WorkerProfileResponse } from "@/components/WorkerCard";

function DirectHire() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [worker, setWorker] = useState<WorkerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    hirerPhone: user?.phone || "",
    hirerAddress: "",
    message: ""
  });

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
        console.error("Failed to fetch worker:", err);
        setLoading(false);
      });
  }, [workerId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to send a direct request.");
      navigate("/login");
      return;
    }

    const payload = {
      workerProfileId: worker?.id,
      hirerPhone: formData.hirerPhone,
      hirerAddress: formData.hirerAddress,
      message: formData.message
    };

    const loadingToast = toast.loading("Sending request...");
    try {
      const response = await fetch('/api/v1/direct-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.update(loadingToast, { render: err.message || 'Failed to send request.', type: "error", isLoading: false, autoClose: 3000 });
        return;
      }

      toast.update(loadingToast, { render: "Direct request sent successfully!", type: "success", isLoading: false, autoClose: 3000 });
      navigate('/requests');
    } catch (err) {
      console.error(err);
      toast.update(loadingToast, { render: "An unexpected error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500">
        Worker not found.
      </div>
    );
  }

  // Cast any to access populated userId if it exists
  const workerPhone = (worker as any).userId?.phone || "Phone not provided";

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center text-sm font-medium text-gray-500">
        <Link to="/workers" className="hover:text-primary transition-colors">Workers</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <Link to={`/worker/${worker.id}`} className="hover:text-primary transition-colors">{worker.displayName}</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-gray-900">Direct Hire</span>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Worker Info Banner */}
        <div className="bg-gray-900 p-8 text-white flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center shrink-0 border-2 border-white/20 overflow-hidden">
            {worker.photo ? (
              <img src={worker.photo} alt={worker.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-extrabold">{worker.displayName.charAt(0)}</span>
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold mb-1">Hire {worker.displayName}</h1>
            <p className="text-gray-400 text-sm font-medium">{worker.workerType} • {worker.location}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right min-w-[200px]">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Worker Contact</p>
            <a href={`tel:${workerPhone}`} className="flex items-center justify-center sm:justify-end gap-2 text-lg font-bold text-green-400 hover:text-green-300 transition-colors">
              <Phone className="w-5 h-5" />
              {workerPhone}
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Send a Request</h2>
            <p className="text-gray-500 font-medium">
              Provide your details so {worker.displayName.split(' ')[0]} can evaluate your job and reach out to you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> Your Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  minLength={10}
                  title="Please enter a valid 10-digit mobile number"
                  value={formData.hirerPhone}
                  onChange={e => setFormData({ ...formData, hirerPhone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Job Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.hirerAddress}
                  onChange={e => setFormData({ ...formData, hirerAddress: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Full address where work is needed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" /> Message / Work Details <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="Describe what you need help with..."
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-600 shadow-md shadow-primary/20 transition-all duration-200"
              >
                Send Direct Request
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DirectHire;
