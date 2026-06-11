import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ShieldCheck, Store, Users, CheckCircle2, IndianRupee, User, ArrowUpRight, FileText, Activity, Clock } from "lucide-react";

interface CafeData {
  _id: string;
  name: string;
  email: string;
  pendingVerifications: number;
  totalVerifications: number;
  pendingBalance: number;
}

interface WorkerData {
  id: string;
  userId: {
    name: string;
    email: string;
    createdAt: string;
  };
  workerType: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedByCafeId?: {
    name: string;
    email: string;
  };
  cafePaymentStatus: string;
}

function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"cafes" | "workers" | "users">("cafes");
  
  const [cafes, setCafes] = useState<CafeData[]>([]);
  const [workers, setWorkers] = useState<WorkerData[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCafeIdentifier, setNewCafeIdentifier] = useState("");
  const [promoting, setPromoting] = useState(false);

  // Modal State
  const [selectedCafeForModal, setSelectedCafeForModal] = useState<CafeData | null>(null);
  const [cafeWorkers, setCafeWorkers] = useState<WorkerData[]>([]);
  const [loadingCafeWorkers, setLoadingCafeWorkers] = useState(false);
  const [selectedWorkersForOffline, setSelectedWorkersForOffline] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      if (activeTab === "cafes") endpoint = "/api/v1/admin/cafes";
      else if (activeTab === "workers") endpoint = "/api/v1/admin/workers";
      else endpoint = "/api/v1/admin/users";

      const res = await fetch(`${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (activeTab === "cafes") setCafes(data);
        else if (activeTab === "workers") setWorkers(data);
        else setUsers(data);
      } else {
        toast.error("Failed to load data.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCafeDetails = async (cafe: CafeData) => {
    setSelectedCafeForModal(cafe);
    setSelectedWorkersForOffline([]);
    setLoadingCafeWorkers(true);
    try {
      const res = await fetch(`/api/v1/admin/cafes/${cafe._id}/workers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCafeWorkers(await res.json());
      } else {
        toast.error("Failed to load workers for this cafe");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred loading workers.");
    } finally {
      setLoadingCafeWorkers(false);
    }
  };

  const handleCollectOffline = async () => {
    if (!selectedCafeForModal || selectedWorkersForOffline.length === 0) return;
    const toastId = toast.loading("Processing offline collection...");
    try {
      const res = await fetch(`/api/v1/admin/cafes/${selectedCafeForModal._id}/collect-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ workerIds: selectedWorkersForOffline })
      });
      const data = await res.json();
      if (res.ok) {
        toast.update(toastId, { render: data.message || "Payment collected!", type: "success", isLoading: false, autoClose: 3000 });
        setSelectedWorkersForOffline([]);
        handleViewCafeDetails(selectedCafeForModal); // Refresh modal list
        fetchData(); // Refresh main data
      } else {
        toast.update(toastId, { render: data.message || "Failed to process", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "An error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const toggleWorkerSelection = (id: string) => {
    setSelectedWorkersForOffline(prev => prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]);
  };

  const handleMakeCafeOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCafeIdentifier) return;

    setPromoting(true);
    const toastId = toast.loading("Promoting user to Cafe Owner...");
    try {
      const res = await fetch(`/api/v1/admin/make-cafe`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ identifier: newCafeIdentifier })
      });
      const data = await res.json();
      if (res.ok) {
        toast.update(toastId, { render: data.message, type: "success", isLoading: false, autoClose: 3000 });
        setNewCafeIdentifier("");
        fetchData(); // Refresh cafes list
      } else {
        toast.update(toastId, { render: data.message || "Failed to promote user.", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "An error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setPromoting(false);
    }
  };

  // Compute Recent Activity
  const recentActivity = [...users.map(u => ({
    id: u._id,
    type: 'NEW_USER',
    title: `New user joined`,
    desc: u.name,
    date: new Date(u.createdAt).getTime(),
    icon: <User className="w-4 h-4 text-blue-500" />
  })), ...workers.filter(w => w.verified).map(w => ({
    id: w.id,
    type: 'WORKER_VERIFIED',
    title: `Worker verified`,
    desc: w.userId?.name || 'Unknown User',
    date: new Date(w.verifiedAt || 0).getTime(),
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
  }))].sort((a, b) => b.date - a.date).slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Master Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage cyber cafes, workers, and reconcile payments.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button 
            onClick={() => setActiveTab("cafes")}
            className={`px-6 py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "cafes" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Store className="w-4 h-4" /> Cafe Managers
          </button>
          <button 
            onClick={() => setActiveTab("workers")}
            className={`px-6 py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "workers" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="w-4 h-4" /> All Workers
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`px-6 py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "users" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <User className="w-4 h-4" /> Users Directory
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
          </div>
        ) : activeTab === "cafes" ? (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Promote User to Cafe Manager</label>
                <input 
                  type="text" 
                  placeholder="Enter user's email or phone number..." 
                  value={newCafeIdentifier}
                  onChange={(e) => setNewCafeIdentifier(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <button 
                onClick={handleMakeCafeOwner}
                disabled={promoting || !newCafeIdentifier}
                className="px-6 py-3 bg-primary hover:bg-primary-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                {promoting ? "Promoting..." : "Make Cafe Owner"}
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm text-gray-600">
                 <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                   <tr>
                     <th className="px-6 py-4 border-b border-gray-100">Cafe Owner</th>
                     <th className="px-6 py-4 border-b border-gray-100 text-center">Total Verified</th>
                     <th className="px-6 py-4 border-b border-gray-100 text-center">Pending Verifications</th>
                     <th className="px-6 py-4 border-b border-gray-100 text-right">Owed Balance</th>
                     <th className="px-6 py-4 border-b border-gray-100 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {cafes.map(cafe => (
                     <tr key={cafe._id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="font-bold text-gray-900">{cafe.name}</div>
                         <div className="text-xs text-gray-500">{cafe.email}</div>
                       </td>
                       <td className="px-6 py-4 text-center font-medium">{cafe.totalVerifications}</td>
                       <td className="px-6 py-4 text-center">
                         <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${cafe.pendingVerifications > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                           {cafe.pendingVerifications}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <span className={`font-extrabold text-lg ${cafe.pendingBalance > 0 ? 'text-red-500' : 'text-gray-900'}`}>
                           Rs {cafe.pendingBalance}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => handleViewCafeDetails(cafe)}
                           className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors shadow-sm"
                         >
                           <FileText className="w-3.5 h-3.5" />
                           View Details
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
               {cafes.length === 0 && (
                 <div className="py-12 text-center text-gray-500 font-medium">No cafes registered yet.</div>
               )}
            </div>
          </div>
        ) : activeTab === "workers" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-gray-600">
                 <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                   <tr>
                     <th className="px-6 py-4 border-b border-gray-100">Worker</th>
                     <th className="px-6 py-4 border-b border-gray-100">Profession</th>
                     <th className="px-6 py-4 border-b border-gray-100 text-center">Status</th>
                     <th className="px-6 py-4 border-b border-gray-100">Verified By</th>
                     <th className="px-6 py-4 border-b border-gray-100 text-center">Admin Payment</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {workers.map(worker => (
                     <tr key={worker.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="font-bold text-gray-900">{worker.userId?.name || 'Unknown User'}</div>
                         <div className="text-xs text-gray-500">{worker.userId?.email || 'No Email'}</div>
                       </td>
                       <td className="px-6 py-4 font-medium">{worker.workerType}</td>
                       <td className="px-6 py-4 text-center">
                         {worker.verified ? (
                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                             <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                           </span>
                         ) : (
                           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                             Unverified
                           </span>
                         )}
                       </td>
                       <td className="px-6 py-4">
                         {worker.verifiedByCafeId ? (
                           <div>
                             <div className="font-bold text-gray-900 text-xs">{worker.verifiedByCafeId.name}</div>
                             <div className="text-[10px] text-gray-500">{new Date(worker.verifiedAt || "").toLocaleDateString()}</div>
                           </div>
                         ) : (
                           <span className="text-gray-400">-</span>
                         )}
                       </td>
                       <td className="px-6 py-4 text-center">
                         {worker.cafePaymentStatus === 'COLLECTED_BY_ADMIN' || worker.cafePaymentStatus === 'COLLECTED_OFFLINE_BY_ADMIN' ? (
                           <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">Offline</span>
                         ) : worker.cafePaymentStatus === 'PAID_ONLINE_BY_CAFE' ? (
                           <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Online</span>
                         ) : worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' ? (
                           <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Pending</span>
                         ) : (
                           <span className="text-gray-400">-</span>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             {workers.length === 0 && (
               <div className="py-12 text-center text-gray-500 font-medium">No workers registered yet.</div>
             )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Registered Platform Users</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((u) => (
                <div key={u._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-xl">
                      {(u.name || "?").charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{u.name || "Unknown"}</h3>
                      <p className="text-sm text-gray-500">{u.email || u.phone}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                        {u.accountType}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setNewCafeIdentifier(u.email || u.phone);
                      setActiveTab("cafes");
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                    }}
                    className="mt-auto w-full py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Promote to Cafe
                  </button>
                </div>
              ))}
              {users.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500">
                  No standard users found.
                </div>
              )}
            </div>
          </div>
        )}
        </div>

        {/* Recent Activity Sidebar */}
        <div className="space-y-6 hidden xl:block">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-8">
            <h3 className="font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Platform Activity
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
                      <p className="text-sm text-gray-500">{activity.desc}</p>
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

        </div>

        {/* Cafe Workers Details Modal */}
        {selectedCafeForModal && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
              <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{selectedCafeForModal.name} - Workers</h2>
                  <p className="text-sm font-medium text-gray-500">Manage verifications and collect payments offline</p>
                </div>
                <button 
                  onClick={() => setSelectedCafeForModal(null)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {loadingCafeWorkers ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
                  </div>
                ) : cafeWorkers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">This cafe has not verified any workers yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 border-b border-gray-100 w-12 text-center">Sel</th>
                          <th className="px-4 py-3 border-b border-gray-100">Worker</th>
                          <th className="px-4 py-3 border-b border-gray-100">Profession</th>
                          <th className="px-4 py-3 border-b border-gray-100">Verified On</th>
                          <th className="px-4 py-3 border-b border-gray-100 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {cafeWorkers.map(worker => (
                          <tr key={worker.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 text-center">
                              {worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' || worker.cafePaymentStatus === 'PAID_ONLINE_BY_CAFE' ? (
                                <input 
                                  type="checkbox" 
                                  checked={selectedWorkersForOffline.includes(worker.id)}
                                  onChange={() => toggleWorkerSelection(worker.id)}
                                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                                />
                              ) : (
                                <span className="text-green-500"><CheckCircle2 className="w-4 h-4 mx-auto" /></span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-gray-900">{worker.userId?.name || 'Unknown User'}</div>
                              <div className="text-xs text-gray-500">{worker.userId?.email || 'No Email'}</div>
                            </td>
                            <td className="px-4 py-3 font-medium">{worker.workerType}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {new Date(worker.verifiedAt || "").toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {worker.cafePaymentStatus === 'COLLECTED_BY_ADMIN' || worker.cafePaymentStatus === 'COLLECTED_OFFLINE_BY_ADMIN' ? (
                                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">Offline</span>
                              ) : worker.cafePaymentStatus === 'PAID_ONLINE_BY_CAFE' ? (
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">Paid Online</span>
                              ) : worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' ? (
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Pending</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {selectedWorkersForOffline.length > 0 && (
                <div className="bg-white border-t border-gray-100 p-4 px-6 flex justify-between items-center shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                  <div>
                    <span className="text-sm text-gray-500 font-bold uppercase tracking-wider block mb-1">Selected Total</span>
                    <span className="font-black text-xl text-primary">Rs {selectedWorkersForOffline.length * 19}</span>
                  </div>
                  <button 
                    onClick={handleCollectOffline}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md shadow-green-500/20"
                  >
                    <IndianRupee className="w-4 h-4" />
                    Mark Collected (Offline)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
