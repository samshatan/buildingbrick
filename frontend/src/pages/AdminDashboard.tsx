import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ShieldCheck, Store, Users, CheckCircle2, IndianRupee, User, ArrowUpRight } from "lucide-react";

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
  const [newCafeEmail, setNewCafeEmail] = useState("");
  const [promoting, setPromoting] = useState(false);

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

  const collectPayment = async (cafeId: string) => {
    if (!window.confirm("Mark all pending balances from this cafe as collected?")) return;

    const toastId = toast.loading("Processing collection...");
    try {
      const res = await fetch(`/api/v1/admin/cafes/${cafeId}/collect-payment`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.update(toastId, { render: "Payment collected!", type: "success", isLoading: false, autoClose: 3000 });
        fetchData(); // Refresh data
      } else {
        toast.update(toastId, { render: "Failed to collect payment.", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "An error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleMakeCafeOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCafeEmail) return;

    setPromoting(true);
    const toastId = toast.loading("Promoting user to Cafe Owner...");
    try {
      const res = await fetch(`/api/v1/admin/make-cafe`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ email: newCafeEmail })
      });
      const data = await res.json();
      if (res.ok) {
        toast.update(toastId, { render: data.message, type: "success", isLoading: false, autoClose: 3000 });
        setNewCafeEmail("");
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
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
                  type="email" 
                  placeholder="Enter user's email address..." 
                  value={newCafeEmail}
                  onChange={(e) => setNewCafeEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <button 
                onClick={handleMakeCafeOwner}
                disabled={promoting || !newCafeEmail}
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
                           onClick={() => collectPayment(cafe._id)}
                           disabled={cafe.pendingBalance === 0}
                           className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                         >
                           <IndianRupee className="w-3.5 h-3.5" />
                           Mark Collected
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
                         <div className="font-bold text-gray-900">{worker.userId.name}</div>
                         <div className="text-xs text-gray-500">{worker.userId.email}</div>
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
                         {worker.cafePaymentStatus === 'COLLECTED_BY_ADMIN' && (
                           <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Settled</span>
                         )}
                         {worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' && (
                           <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Pending</span>
                         )}
                         {worker.cafePaymentStatus === 'NONE' && (
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
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{u.name}</h3>
                      <p className="text-sm text-gray-500">{u.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                        {u.accountType}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setNewCafeEmail(u.email);
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
    </div>
  );
}

export default AdminDashboard;
