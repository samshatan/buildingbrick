import { useEffect, useState } from "react";
import { ClipboardList, MapPin, CalendarDays, Search, Filter, Briefcase, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface WorkRequest {
  id: string;
  hirerUserId: string;
  categoryId: string;
  workerType: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  budgetMin: number;
  budgetMax: number;
  status: string;
  createdAt: string;
}

function WorkRequests() {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<WorkRequest[]>([]);
  const [directRequests, setDirectRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'public' | 'direct'>('public');
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WorkRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Proposal form state
  const [proposedRate, setProposedRate] = useState("");
  const [proposalText, setProposalText] = useState("");

  useEffect(() => {
    fetch('/api/v1/requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data.filter((req: WorkRequest) => req.status === "OPEN"));
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch requests:", err);
        setLoading(false);
      });

    if (user?.userType === 'WORKER' && token) {
      fetch('/api/v1/direct-requests/worker', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setDirectRequests(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch direct requests:", err));
    }
  }, [user, token]);

  const handleApplyClick = (req: WorkRequest) => {
    if (!user) {
      toast.error("Please login as a worker to apply.");
      return;
    }
    if (user.userType !== "WORKER") {
      toast.error("Only registered workers can apply to requests.");
      return;
    }
    setSelectedRequest(req);
    setProposedRate("");
    setProposalText("");
    setApplyModalOpen(true);
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !user) return;

    const payload = {
      requestId: selectedRequest.id,
      workerId: user.id,
      proposalText: proposalText,
      proposedRate: parseInt(proposedRate) || 0
    };

    try {
      const response = await fetch('/api/v1/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.error(err.message || 'Failed to submit application.');
        return;
      }

      toast.success("Application submitted successfully!");
      setApplyModalOpen(false);
      setSelectedRequest(null);
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleUpdateDirectRequest = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/v1/direct-requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Request ${status.toLowerCase()}!`);
        setDirectRequests(directRequests.map(dr => dr.id === id ? { ...dr, status } : dr));
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status.");
    }
  };

  const filteredRequests = requests.filter(req => 
    req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.workerType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Work Requests</h1>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Browse and apply to jobs posted by hirers in your area.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, locations..."
              className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none font-medium"
            />
          </div>
        </div>

        {user?.userType === 'WORKER' && (
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('public')}
              className={`pb-4 text-sm font-bold transition-all ${activeTab === 'public' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Public Jobs
            </button>
            <button 
              onClick={() => setActiveTab('direct')}
              className={`pb-4 text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'direct' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Direct Requests To Me
              {directRequests.filter(r => r.status === 'PENDING').length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{directRequests.filter(r => r.status === 'PENDING').length}</span>
              )}
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          
          {/* Sidebar / Filters Placeholder for future */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                Job Filters
              </h2>
              <div className="space-y-4">
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium text-gray-600 text-center">
                    Advanced filtering options coming soon.
                 </div>
              </div>
            </div>
          </div>

          {/* Job Feed */}
          <div className="space-y-6">
            
            {activeTab === 'direct' ? (
              directRequests.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No direct requests yet</h3>
                  <p className="text-sm text-gray-500 font-medium">When hirers contact you directly, they will appear here.</p>
                </div>
              ) : (
                directRequests.map(req => (
                  <div key={req.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${req.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {req.status}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">Direct Hire Request</h3>
                        <p className="text-sm text-gray-500 font-medium mt-1">From: {req.hirerId?.name || "Unknown"}</p>
                      </div>
                      <div className="text-left sm:text-right text-sm">
                        <div className="font-bold text-gray-900 mb-1">{new Date(req.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-sm font-medium text-gray-700 leading-relaxed">
                      {req.message}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">Job Location</p>
                          <p className="text-sm font-bold text-gray-900 mt-0.5">{req.hirerAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">Contact Number</p>
                          <p className="text-sm font-bold text-gray-900 mt-0.5">{req.hirerPhone}</p>
                        </div>
                      </div>
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 mt-4">
                        <button onClick={() => handleUpdateDirectRequest(req.id, 'REJECTED')} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                          Decline
                        </button>
                        <button onClick={() => handleUpdateDirectRequest(req.id, 'ACCEPTED')} className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-600 transition-colors shadow-sm shadow-primary/20">
                          Accept Request
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )
            ) : (
              loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary"></div>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No work requests found</h3>
                  <p className="text-sm text-gray-500 font-medium">Check back later or try adjusting your search terms.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map(req => (
                    <div key={req.id} className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-extrabold text-xl text-gray-900 tracking-tight">{req.title}</h3>
                          <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                            Open
                          </span>
                        </div>
                        <span className="inline-block text-xs font-bold px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full">
                          {req.workerType}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 sm:text-right shrink-0">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Budget</p>
                        <p className="font-extrabold text-primary text-lg">Rs {req.budgetMin} - {req.budgetMax}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-3xl">{req.description || "No description provided."}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-gray-400" />
                        </div>
                        <span>{req.location || "Location not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                          <CalendarDays className="w-4 h-4 text-gray-400" />
                        </div>
                        <span>{req.startDate ? req.startDate : "Flexible"} {req.endDate ? `to ${req.endDate}` : ""}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <button 
                        onClick={() => handleApplyClick(req)}
                        className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all border-none"
                      >
                        Apply for Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Modernized Apply Modal */}
      {applyModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="bg-gray-50 p-6 border-b border-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Submit Proposal</h2>
              <p className="text-sm font-medium text-gray-500">Applying for: <span className="text-primary font-bold">{selectedRequest.title}</span></p>
            </div>
            
            <form onSubmit={submitApplication} className="p-6 space-y-6">
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 font-medium leading-relaxed">
                  The client has set a budget of <strong>Rs {selectedRequest.budgetMin} - {selectedRequest.budgetMax}</strong>. Proposing a rate within this range increases your chances of getting hired.
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Proposed Daily Rate (Rs)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-bold">
                    Rs
                  </div>
                  <input
                    type="number"
                    required
                    value={proposedRate}
                    onChange={(e) => setProposedRate(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none font-bold"
                    placeholder="e.g. 800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cover Letter / Proposal</label>
                <textarea
                  required
                  rows={5}
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none font-medium resize-none"
                  placeholder="Explain why you're a good fit for this job, mention your relevant experience..."
                />
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setApplyModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-600 shadow-md shadow-primary/20 hover:shadow-lg transition-all border-none cursor-pointer"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkRequests;
