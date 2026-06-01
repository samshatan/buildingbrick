import { useState, useEffect } from "react";
import { Search, UserCheck, Printer, CheckCircle2, Store, Clock } from "lucide-react";
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
  
  // For printing the certificate
  const [printWorker, setPrintWorker] = useState<WorkerProfile | null>(null);

  useEffect(() => {
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
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cafe Verification Portal</h1>
            <p className="text-gray-500 font-medium">Verify worker documents, collect fees, and print certificates.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8">
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
                  <div key={worker.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
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
                        Status: <span className={worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' ? 'text-amber-600' : 'text-green-600'}>
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
    </div>
  );
}

export default CafeDashboard;
