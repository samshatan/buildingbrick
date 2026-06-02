import { useState, useEffect } from "react";
import { Search, UserCheck, Printer, CheckCircle2, Store, Clock, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { workerSubscriptionPlan } from "@/data/marketplaceData";

interface WorkerProfile {
  id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  displayName: string;
  workerType: string;
  verified: boolean;
  verifiedAt?: string;
  cafePaymentStatus?: string;
}

function CafeDashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<"pending" | "verified">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [unverifiedQueue, setUnverifiedQueue] = useState<WorkerProfile[]>([]);
  const [verifiedHistory, setVerifiedHistory] = useState<WorkerProfile[]>([]);
  const [queueLoading, setQueueLoading] = useState(true);
  
  // Selection state for payment
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // For printing the certificate
  const [printWorker, setPrintWorker] = useState<WorkerProfile | null>(null);

  useEffect(() => {
    setSelectedWorkers([]);
    if (activeTab === "pending") {
      fetchUnverifiedQueue();
    } else {
      fetchVerifiedHistory();
    }
  }, [activeTab]);

  const fetchUnverifiedQueue = async () => {
    try {
      const res = await fetch(`/api/v1/cafes/workers/unverified`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUnverifiedQueue(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQueueLoading(false);
    }
  };

  const fetchVerifiedHistory = async () => {
    setQueueLoading(true);
    try {
      const res = await fetch(`/api/v1/cafes/workers/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVerifiedHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQueueLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/cafes/workers/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      } else {
        const err = await res.json();
        toast.error(err.message || "No workers found.");
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  const verifyWorker = async (workerId: string) => {
    if (!window.confirm("Are you sure you have collected Rs 118 and verified their documents?")) return;

    const loadingToast = toast.loading("Verifying worker...");
    try {
      const res = await fetch(`/api/v1/cafes/workers/verify/${workerId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        toast.update(loadingToast, { render: "Worker verified successfully!", type: "success", isLoading: false, autoClose: 3000 });
        
        // Update local state
        setSearchResults(prev => prev.map(w => w.id === workerId ? data.worker : w));
        setUnverifiedQueue(prev => prev.filter(w => w.id !== workerId)); // Remove from queue
        setPrintWorker(data.worker); // Open print view
      } else {
        const err = await res.json();
        toast.update(loadingToast, { render: err.message || "Verification failed.", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.update(loadingToast, { render: "An error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleWorkerSelection = (workerId: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId) ? prev.filter(id => id !== workerId) : [...prev, workerId]
    );
  };

  const handlePayOnline = async () => {
    if (selectedWorkers.length === 0) return;
    setProcessingPayment(true);
    const toastId = toast.loading("Processing payment...");
    
    try {
      const res = await fetch(`/api/v1/cafes/workers/pay-online`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ workerIds: selectedWorkers })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.update(toastId, { render: data.message || "Payment successful!", type: "success", isLoading: false, autoClose: 3000 });
        setShowPaymentModal(false);
        setSelectedWorkers([]);
        fetchVerifiedHistory(); // Refresh history
      } else {
        toast.update(toastId, { render: data.message || "Payment failed.", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "An error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setProcessingPayment(false);
    }
  };

  // Compute Recent Activity
  const recentActivity = [...verifiedHistory.map(w => ({
    id: w.id,
    title: `Worker Verified`,
    desc: w.userId.name,
    date: new Date(w.verifiedAt || Date.now()).getTime(),
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
  }))].sort((a, b) => b.date - a.date).slice(0, 8);

  if (printWorker) {
    return (
      <div className="min-h-screen bg-white p-8 sm:p-12 font-serif flex flex-col items-center justify-center">
        {/* Printable Area - styled as an A4 certificate */}
        <div className="relative w-full max-w-3xl mx-auto border-[12px] border-double border-gray-900 bg-white p-12 min-h-[850px] shadow-2xl print:shadow-none print:w-[210mm] print:h-[297mm] print:min-h-0 print:m-0 print:border-[8px]">
          
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
            <Store className="w-96 h-96" />
          </div>

          {/* Certificate Header */}
          <div className="relative z-10 text-center border-b-4 border-gray-900 pb-10 mb-12">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-gray-900" />
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase mb-4 font-sans">BrickOurHouse</h1>
            <p className="text-2xl font-bold text-gray-700 tracking-[0.2em] uppercase">Official Worker Certificate</p>
            <p className="text-sm text-gray-500 mt-2 font-sans">Verification ID: {printWorker.id.slice(-8).toUpperCase()}</p>
          </div>

          {/* Certificate Body */}
          <div className="relative z-10 space-y-10">
            <div className="text-center px-8">
              <p className="text-xl text-gray-600 italic mb-4">This is to certify that</p>
              <h2 className="text-4xl font-bold text-gray-900 border-b-2 border-gray-300 inline-block px-12 pb-2 mb-4">
                {printWorker.userId.name}
              </h2>
              <p className="text-lg text-gray-700 mt-4">
                has successfully completed the identity verification process and is officially registered as a <strong>{printWorker.workerType}</strong> on the BrickOurHouse platform.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 bg-gray-50/80 p-8 rounded-lg border border-gray-200 mt-12 font-sans">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Email</h3>
                <p className="text-lg font-bold text-gray-900">{printWorker.userId.email}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Status</h3>
                <p className="text-lg font-bold text-green-700 tracking-widest uppercase">Verified Active</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Verification</h3>
                <p className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Authorizing Partner</h3>
                <p className="text-lg font-bold text-gray-900">{user?.fullName} (Cafe ID: {user?.id.slice(-6).toUpperCase()})</p>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="relative z-10 grid grid-cols-2 gap-8 mt-24 px-8 font-sans">
            <div className="text-center">
              <div className="border-b border-gray-400 w-48 mx-auto mb-2"></div>
              <p className="text-sm font-bold text-gray-600">Worker Signature</p>
            </div>
            <div className="text-center">
              <div className="border-b border-gray-400 w-48 mx-auto mb-2 relative">
                {/* Simulated stamp/seal */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-16 border-4 border-red-700/40 rounded-full flex items-center justify-center rotate-12 opacity-80 pointer-events-none">
                  <span className="text-[10px] font-black text-red-700/60 uppercase tracking-tighter">Verified</span>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-600">Authorized Cafe Signatory</p>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-12 left-0 w-full text-center px-12 z-10">
            <p className="text-xs text-gray-400 font-sans">
              This document is issued by an authorized partner of BrickOurHouse. Verify authenticity at www.brickourhouse.com/verify.
              Subscription fee of Rs {workerSubscriptionPlan.fee} has been collected.
            </p>
          </div>
        </div>

        {/* Action Buttons (Hidden on print) */}
        <div className="mt-12 flex justify-center gap-4 print:hidden font-sans">
           <button 
             onClick={() => setPrintWorker(null)}
             className="px-8 py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
           >
             Close Certificate
           </button>
           <button 
             onClick={handlePrint}
             className="px-8 py-4 bg-primary text-white font-bold rounded-xl flex items-center gap-3 hover:bg-primary-600 shadow-xl shadow-primary/20 transition-colors text-lg"
           >
             <Printer className="w-6 h-6" />
             Print Official Certificate
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cafe Verification Portal</h1>
            <p className="text-gray-500 font-medium">Verify worker documents, collect fees, and print certificates.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-4 px-2 font-bold text-sm transition-colors relative ${
              activeTab === "pending" ? "text-primary" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Verification
            </div>
            {activeTab === "pending" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("verified")}
            className={`pb-4 px-2 font-bold text-sm transition-colors relative ${
              activeTab === "verified" ? "text-primary" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Verified Workers
            </div>
            {activeTab === "verified" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
            )}
          </button>
        </div>

        {activeTab === "pending" ? (
          <>
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
           <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Enter worker's email or phone number..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-all shadow-md disabled:opacity-70"
              >
                {loading ? "Searching..." : "Search Worker"}
              </button>
           </form>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4">
             <h2 className="text-xl font-bold text-gray-900 mb-4">Search Results</h2>
             {searchResults.map((worker) => (
               <div key={worker.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-extrabold text-primary">
                     {worker.userId.name.charAt(0)}
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       {worker.userId.name}
                       {worker.verified && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                     </h3>
                     <p className="text-gray-500 text-sm font-medium">{worker.userId.email} • {worker.workerType}</p>
                   </div>
                 </div>

                 <div>
                   {worker.verified ? (
                     <button 
                       onClick={() => setPrintWorker(worker)}
                       className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-black transition-all"
                     >
                       <Printer className="w-4 h-4" />
                       Reprint Certificate
                     </button>
                   ) : (
                     <button 
                       onClick={() => verifyWorker(worker.id)}
                       className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-green-600 transition-all shadow-md shadow-green-500/20"
                     >
                       <UserCheck className="w-4 h-4" />
                       Verify & Collect Rs 118
                     </button>
                   )}
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* Pending Verification Queue */}
        {searchResults.length === 0 && !loading && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Pending Verifications Queue
            </h2>
            
            {queueLoading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
              </div>
            ) : unverifiedQueue.length > 0 ? (
              <div className="space-y-4">
                {unverifiedQueue.map((worker) => (
                  <div key={worker.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-xl font-extrabold text-amber-600">
                        {worker.userId.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {worker.userId.name}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">{worker.userId.email} • {worker.workerType}</p>
                      </div>
                    </div>
                    <div>
                      <button 
                        onClick={() => verifyWorker(worker.id)}
                        className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-green-600 transition-all shadow-md shadow-green-500/20"
                      >
                        <UserCheck className="w-4 h-4" />
                        Verify & Collect Rs 118
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Queue is empty</h3>
                <p className="text-gray-500">There are no unverified workers waiting at the moment.</p>
              </div>
            )}
          </div>
        )}
          </>
        ) : (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Verified History
            </h2>
            
            {queueLoading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary"></div>
              </div>
            ) : verifiedHistory.length > 0 ? (
              <div className="space-y-4">
                {verifiedHistory.map((worker) => (
                  <div key={worker.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow relative">
                    {worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' && (
                      <div className="absolute top-4 left-4 sm:static sm:top-auto sm:left-auto">
                        <input 
                          type="checkbox" 
                          checked={selectedWorkers.includes(worker.id)}
                          onChange={() => toggleWorkerSelection(worker.id)}
                          className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                        />
                      </div>
                    )}
                    <div className={`flex items-center gap-4 ${worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' ? 'ml-8 sm:ml-0' : ''}`}>
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-xl font-extrabold text-green-600">
                        {worker.userId.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {worker.userId.name}
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">{worker.userId.email} • {worker.workerType}</p>
                        <p className="text-xs text-gray-400 mt-1">Verified on: {new Date(worker.verifiedAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status: <span className={
                          worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' ? 'text-amber-600' : 
                          worker.cafePaymentStatus === 'PAID_ONLINE_BY_CAFE' ? 'text-blue-600' : 
                          'text-green-600'
                        }>
                          {worker.cafePaymentStatus?.replace(/_/g, ' ') || 'COLLECTED'}
                        </span>
                      </div>
                      <button 
                        onClick={() => setPrintWorker(worker)}
                        className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all"
                      >
                        <Printer className="w-4 h-4" />
                        Reprint Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Printer className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No verified workers yet</h3>
                <p className="text-gray-500">Workers you verify will appear here for your records.</p>
              </div>
            )}
          </div>
        )}
          </div>

        {/* Recent Activity Sidebar */}
        <div className="space-y-6 hidden xl:block">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-8">
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

        {/* Floating Action Bar for Payment */}
        {selectedWorkers.length > 0 && activeTab === "verified" && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 px-6 z-40 animate-in slide-in-from-bottom-10">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Selected for Payment</p>
                <p className="text-xl font-black text-gray-900">{selectedWorkers.length} Workers <span className="text-gray-400 font-medium">|</span> <span className="text-primary">Rs {selectedWorkers.length * 118}</span></p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedWorkers([])}
                  className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary/30"
                >
                  Pay Online
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Online Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
              <div className="p-6 border-b border-gray-100 bg-gray-50 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-extrabold text-2xl">₹</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Secure Online Payment</h2>
                <p className="text-gray-500 font-medium text-sm">Pay verification fees directly to Admin</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 font-bold text-sm">Total Workers</span>
                    <span className="text-gray-900 font-bold">{selectedWorkers.length}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 font-bold text-sm">Fee per Worker</span>
                    <span className="text-gray-900 font-bold">Rs 118</span>
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                    <span className="text-gray-900 font-black text-lg">Total Amount</span>
                    <span className="text-primary font-black text-2xl">Rs {selectedWorkers.length * 118}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                  <p className="font-bold mb-1 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Admin Bank Details</p>
                  <p>UPI ID: admin@brickourhouse</p>
                  <p>Name: BrickOurHouse Official</p>
                </div>
                
                <p className="text-xs text-gray-500 text-center font-medium">
                  By clicking confirm, you acknowledge that you have transferred the amount to the Admin's account. This will update the status immediately.
                </p>

                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    disabled={processingPayment}
                    className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePayOnline}
                    disabled={processingPayment}
                    className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-600 shadow-md shadow-primary/20 transition-all disabled:opacity-50"
                  >
                    {processingPayment ? "Processing..." : "Confirm Payment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CafeDashboard;
