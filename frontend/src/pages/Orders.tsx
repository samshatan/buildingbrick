import { useEffect, useState } from "react";
import { Briefcase, Clock, CheckCircle2, AlertCircle, FileText, FileSignature, Check, X, Building2, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface WorkerApplication {
  id: string;
  requestId: string;
  workerId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl?: string;
  };
  proposalText: string;
  proposedRate: number;
  status: string;
}

interface Job {
  id: string;
  requestId: string;
  workerId: string;
  hirerUserId: string;
  agreedRate: number;
  status: string;
}

interface WorkRequest {
  id: string;
  title: string;
  status: string;
  applications?: WorkerApplication[];
}

function Orders() {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState<WorkerApplication[]>([]);
  const [hirerRequests, setHirerRequests] = useState<WorkRequest[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        if (user.userType === "WORKER") {
          const res = await fetch(`/api/v1/applications/worker/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setApplications(data);
          }
        } else {
          const fetchUrl = user.userType === "ADMIN" 
            ? `/api/v1/requests`
            : `/api/v1/requests/hirer/${user.id}`;
            
          const reqRes = await fetch(fetchUrl);
          if (reqRes.ok) {
            const reqData: WorkRequest[] = await reqRes.json();
            const requestsWithApps = await Promise.all(
              reqData.map(async (req) => {
                const appRes = await fetch(`/api/v1/applications/request/${req.id}`);
                const apps = appRes.ok ? await appRes.json() : [];
                return { ...req, applications: apps };
              })
            );
            setHirerRequests(requestsWithApps);
          }
        }
        
        const jobsRes = await fetch(`/api/v1/jobs`);
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(user.userType === "ADMIN" ? jobsData : jobsData.filter((j: Job) => j.workerId === user.id || j.hirerUserId === user.id));
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, token]);

  const handleAcceptApplication = async (applicationId: string) => {
    const loadingToast = toast.loading("Processing acceptance...");
    try {
      const res = await fetch(`/api/v1/applications/${applicationId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.update(loadingToast, { render: "Worker hired successfully!", type: "success", isLoading: false, autoClose: 3000 });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.update(loadingToast, { render: "Failed to hire worker.", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.update(loadingToast, { render: "Error processing request.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-500 font-medium">Please login to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <FileSignature className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Active Contracts</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Track your hiring agreements and job applications.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mb-4"></div>
            <p className="text-gray-500 font-medium">Loading contracts...</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Active Jobs Section - Shared */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-gray-500" /> Ongoing Jobs
              </h2>
              {jobs.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
                  <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No active jobs found at the moment.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {jobs.map(job => (
                    <div key={job.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                      
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-green-100 text-green-800 rounded-full">
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="relative z-10">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Agreed Rate</p>
                        <p className="text-3xl font-extrabold text-gray-900 mb-4">Rs {job.agreedRate}</p>
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500 font-medium">Job Reference: <span className="font-mono text-gray-900">{job.id.substring(0, 8)}...</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Hirer / Admin View */}
            {["HIRER", "ADMIN"].includes(user.userType) && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-gray-500" /> {user.userType === "ADMIN" ? "All Platform Work Requests" : "Your Job Postings"}
                </h2>
                {hirerRequests.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
                    <p className="text-gray-500 font-medium">You haven't posted any work requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {hirerRequests.map(req => (
                      <div key={req.id} className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                          <div>
                            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{req.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${req.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                Status: {req.status}
                              </span>
                              <span className="text-xs text-gray-500 font-medium text-gray-400">ID: {req.id.substring(0,8)}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 rounded-xl text-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Applications</p>
                            <p className="text-2xl font-extrabold text-primary">{req.applications?.length || 0}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Proposals</h4>
                          {(!req.applications || req.applications.length === 0) ? (
                            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 border-dashed">
                              <p className="text-sm text-gray-500 font-medium">No proposals received yet. Waiting for workers to apply.</p>
                            </div>
                          ) : (
                            <div className="grid gap-4 lg:grid-cols-2">
                              {req.applications.map(app => (
                                <div key={app.id} className="flex flex-col p-5 bg-gray-50 rounded-2xl border border-gray-200 gap-4 group hover:border-primary/30 transition-colors shadow-sm">
                                  
                                  {/* Worker Details Header */}
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                                        {app.workerId?.avatarUrl ? (
                                          <img src={app.workerId.avatarUrl} alt="worker" className="w-full h-full object-cover" />
                                        ) : (
                                          <span className="text-xl font-bold text-gray-400">
                                            {app.workerId?.name ? app.workerId.name.charAt(0).toUpperCase() : '?'}
                                          </span>
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="font-extrabold text-gray-900">{app.workerId?.name || 'Unknown Worker'}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                          <p className="text-xs font-bold text-gray-500">{app.workerId?.phone || 'No phone'}</p>
                                          <Link to={`/worker/${app.workerId?._id}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                            <User className="w-3 h-3" /> Profile
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                      app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {app.status}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Proposed Rate</p>
                                      <p className="text-xl font-extrabold text-primary">Rs {app.proposedRate}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed shadow-inner">
                                    "{app.proposalText}"
                                  </div>

                                  {app.status === 'PENDING' && req.status === 'OPEN' && (
                                    <div className="flex gap-3 mt-auto pt-4 border-t border-gray-200">
                                      <button 
                                        onClick={() => handleAcceptApplication(app.id)}
                                        className="flex-1 bg-primary hover:bg-primary-600 text-white py-3 text-sm rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                                      >
                                        <Check className="w-4 h-4" /> Hire Worker
                                      </button>
                                      <button className="px-5 py-3 bg-white border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                                        Decline
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Worker View */}
            {user.userType === "WORKER" && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-gray-500" /> Submitted Applications
                </h2>
                {applications.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
                    <p className="text-gray-500 font-medium">You haven't applied to any jobs yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map(app => (
                      <div key={app.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                        
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800 border border-green-200' :
                            app.status === 'REJECTED' ? 'bg-red-100 text-red-800 border border-red-200' :
                            'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {app.status}
                          </span>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Sent</span>
                          </div>
                        </div>
                        
                        <div className="mb-6 flex-1">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Proposed Rate</p>
                          <p className="text-2xl font-extrabold text-primary mb-4">Rs {app.proposedRate}</p>
                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-sm text-gray-600 font-medium line-clamp-3 italic">"{app.proposalText}"</p>
                          </div>
                        </div>

                        {app.status === 'ACCEPTED' && (
                          <div className="bg-green-50 text-green-700 text-xs font-bold px-4 py-3 rounded-xl border border-green-100 text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Contract Created
                          </div>
                        )}
                        {app.status === 'PENDING' && (
                          <div className="text-gray-500 text-xs font-bold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-center">
                            Awaiting Client Response
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
