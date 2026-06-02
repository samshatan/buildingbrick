import { useEffect, useState } from "react";
import { ClipboardList, MapPin, CalendarDays, Search, Filter, Briefcase, CheckCircle2, Activity, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
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
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'public' | 'direct'>('public');
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WorkRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Applications modal state
  const [viewAppsModalOpen, setViewAppsModalOpen] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  
  // Proposal form state
  const [proposedRate, setProposedRate] = useState("");
  const [proposalText, setProposalText] = useState("");

  useEffect(() => {
    const endpoint = user?.userType === 'HIRER' ? `/api/v1/requests/hirer/${user?.id}` : '/api/v1/requests';
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (user?.userType === 'HIRER') {
          setRequests(data);
        } else {
          setRequests(data.filter((req: WorkRequest) => req.status === "OPEN"));
        }
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

      fetch(`/api/v1/applications/worker/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setMyApplications(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch my applications:", err));
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

      toast.success("Proposal submitted successfully!");
      setApplyModalOpen(false);
      // Refresh feed and applications list
      fetch(`/api/v1/applications/worker/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setMyApplications(Array.isArray(data) ? data : []));
      
      fetch('/api/v1/requests')
        .then(res => res.json())
        .then(data => setRequests(data.filter((req: WorkRequest) => req.status === "OPEN")));
      
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

  const handleViewApplications = async (req: WorkRequest) => {
    setSelectedRequest(req);
    setViewAppsModalOpen(true);
    setLoadingApps(true);
    try {
      const res = await fetch(`/api/v1/applications/request/${req.id}`);
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch applications");
    } finally {
      setLoadingApps(false);
    }
  };

  const handleAcceptApplication = async (appId: string) => {
    try {
      const res = await fetch(`/api/v1/applications/${appId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Application accepted successfully!');
        setViewAppsModalOpen(false);
        // Refresh requests
        const reqRes = await fetch(`/api/v1/requests/hirer/${user?.id}`);
        const reqData = await reqRes.json();
        setRequests(reqData);
      } else {
        toast.error(data.message || 'Failed to accept application.');
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  };

  const filteredRequests = requests.filter(req => 
    req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.workerType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute Recent Activity
  const recentActivity = user?.userType === 'HIRER' ? 
    requests.map(req => ({
      id: req.id,
      title: 'Job Posted',
      desc: req.title,
      date: new Date(req.createdAt).getTime(),
      icon: <Briefcase className="w-4 h-4 text-blue-500" />
    })).sort((a, b) => b.date - a.date).slice(0, 5)
  : [
      ...directRequests.map(req => ({
        id: req.id,
        title: 'Direct Request',
        desc: `From ${req.hirerId?.name || 'Unknown'}`,
        date: new Date(req.createdAt).getTime(),
        icon: <ClipboardList className="w-4 h-4 text-orange-500" />
      })),
      ...requests.map(req => ({
        id: req.id,
        title: 'New Public Job',
        desc: req.title,
        date: new Date(req.createdAt).getTime(),
        icon: <Briefcase className="w-4 h-4 text-blue-500" />
      }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

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
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {user?.userType === 'HIRER' ? 'My Work Requests' : 'Work Requests'}
              </h1>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {user?.userType === 'HIRER' 
                ? 'Manage your posted requests and view applications.' 
                : 'Browse and apply to jobs posted by hirers in your area.'}
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
          
          {/* Sidebar / Activity Feed */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-8">
              <h3 className="font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Recent Activity
              </h3>
              
              <div className="space-y-5">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No recent activity.</p>
                ) : (
                  recentActivity.map((activity, idx) => (
                    <div key={activity.id + idx} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{activity.desc}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${req.status === 'OPEN' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                            {req.status}
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
                      {user?.userType === 'HIRER' ? (
                        <button 
                          onClick={() => handleViewApplications(req)}
                          className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all border-none"
                        >
                          View Applications
                        </button>
                      ) : (
                        myApplications.some(app => app.requestId === req.id) ? (
                          <button 
                            disabled
                            className="bg-gray-200 text-gray-500 px-8 py-3 rounded-xl text-sm font-bold cursor-not-allowed border-none shadow-inner"
                          >
                            <CheckCircle2 className="w-4 h-4 inline-block mr-1.5" /> Already Applied
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleApplyClick(req)}
                            className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all border-none"
                          >
                            Apply Now
                          </button>
                        )
                      )}
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

      {/* View Applications Modal for Hirers */}
      {viewAppsModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Job Applications</h2>
                <p className="text-sm font-medium text-gray-500">For: <span className="text-primary font-bold">{selectedRequest.title}</span></p>
              </div>
              <button 
                onClick={() => setViewAppsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {loadingApps ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-sm text-gray-500 font-medium">Workers haven't applied to this job yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                            {app.workerId?.avatarUrl ? (
                              <img src={app.workerId.avatarUrl} alt="worker avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-bold text-gray-400">
                                {app.workerId?.name ? app.workerId.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{app.workerId?.name || 'Unknown Worker'}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-gray-500">{app.workerId?.phone || 'No phone provided'}</p>
                              <Link to={`/worker/${app.workerId?._id}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                <User className="w-3 h-3" /> Profile
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                            app.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                            app.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border border-green-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {app.status}
                          </span>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Proposed Rate</p>
                          <p className="font-extrabold text-primary">Rs {app.proposedRate}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-700 mb-4 border border-gray-100">
                        <p className="font-semibold text-xs text-gray-500 uppercase mb-1">Proposal / Cover Letter</p>
                        {app.proposalText}
                      </div>
                      
                      {app.status === 'PENDING' && selectedRequest.status === 'OPEN' && (
                        <div className="flex justify-end pt-2 border-t border-gray-100">
                          <button 
                            onClick={() => handleAcceptApplication(app.id)}
                            className="bg-primary hover:bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
                          >
                            Accept Application
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkRequests;
