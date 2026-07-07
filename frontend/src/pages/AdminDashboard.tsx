import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ShieldCheck, Store, Users, CheckCircle2, User, FileText, BarChart2, AlertTriangle, RefreshCw } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

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
  cafePaymentReceipt?: string;
}

function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"cafes" | "workers" | "users" | "analytics" | "moderation" | "disputes">("analytics");
  
  const [cafes, setCafes] = useState<CafeData[]>([]);
  const [workers, setWorkers] = useState<WorkerData[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
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
      else if (activeTab === "users") endpoint = "/api/v1/admin/users";
      else if (activeTab === "analytics") endpoint = "/api/v1/admin/stats";
      else if (activeTab === "moderation") endpoint = "/api/v1/admin/reports";
      else if (activeTab === "disputes") endpoint = "/api/v1/disputes";

      const res = await fetch(`${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (activeTab === "cafes") setCafes(data);
        else if (activeTab === "workers") setWorkers(data);
        else if (activeTab === "users") setUsers(data);
        else if (activeTab === "analytics") setStats(data);
        else if (activeTab === "moderation") setReports(data);
        else if (activeTab === "disputes") setDisputes(data);
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

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const toastId = toast.loading("Updating role...");
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        toast.update(toastId, { render: "Role updated successfully!", type: "success", isLoading: false, autoClose: 3000 });
        fetchData();
      } else {
        toast.update(toastId, { render: "Failed to update role", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      toast.update(toastId, { render: "An error occurred", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleUpdateReport = async (reportId: string, status: string, action: string) => {
    const toastId = toast.loading("Applying moderation action...");
    try {
      const res = await fetch(`/api/v1/admin/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, action })
      });
      if (res.ok) {
        toast.update(toastId, { render: "Action applied and user notified", type: "success", isLoading: false, autoClose: 3000 });
        fetchData();
      } else {
        toast.update(toastId, { render: "Failed to apply action", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      toast.update(toastId, { render: "An error occurred", type: "error", isLoading: false, autoClose: 3000 });
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

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Master Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage the platform, users, moderation, and view analytics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 gap-2">
              <button 
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "analytics" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <BarChart2 className="w-4 h-4" /> Analytics
              </button>
              <button 
                onClick={() => setActiveTab("moderation")}
                className={`px-4 py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "moderation" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <AlertTriangle className="w-4 h-4" /> Moderation
              </button>
              <button 
                onClick={() => setActiveTab("disputes")}
                className={`px-4 py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "disputes" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Disputes
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                className={`px-4 py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "users" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <User className="w-4 h-4" /> Users & Roles
              </button>
              <button 
                onClick={() => setActiveTab("cafes")}
                className={`px-4 py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "cafes" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Store className="w-4 h-4" /> Cafe Managers
              </button>
              <button 
                onClick={() => setActiveTab("workers")}
                className={`px-4 py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === "workers" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Users className="w-4 h-4" /> All Workers
              </button>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
              </div>
            ) : activeTab === "analytics" && stats ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Users", value: stats.totals.totalUsers, icon: <User className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50" },
                    { label: "Verified Workers", value: stats.totals.totalWorkers, icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, bg: "bg-green-50" },
                    { label: "Cafe Owners", value: stats.totals.totalCafes, icon: <Store className="w-5 h-5 text-purple-500" />, bg: "bg-purple-50" },
                    { label: "Jobs Posted", value: stats.totals.totalJobs, icon: <FileText className="w-5 h-5 text-amber-500" />, bg: "bg-amber-50" },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg}`}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">User Growth Over Time</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.growthData}>
                          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                          <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend />
                          <Line type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="workers" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Distribution Comparison</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.growthData}>
                          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                          <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend />
                          <Bar dataKey="users" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="workers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === "disputes" ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Dispute Resolution Center</h3>
                  <button onClick={fetchData} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4 border-b border-gray-100">Issue Details</th>
                        <th className="px-6 py-4 border-b border-gray-100">Raised By</th>
                        <th className="px-6 py-4 border-b border-gray-100">Against</th>
                        <th className="px-6 py-4 border-b border-gray-100 text-center">Status</th>
                        <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {disputes.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No open disputes! Everything is peaceful.</td>
                        </tr>
                      ) : (
                        disputes.map((dispute) => (
                          <tr key={dispute.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-gray-900">{dispute.reason}</div>
                              <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded mr-2">{dispute.requestType}</span>
                              <p className="line-clamp-2 max-w-xs mt-1">{dispute.description}</p>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                              <span className="font-bold">{dispute.raisedBy?.name}</span><br/>{dispute.raisedBy?.email}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                              {dispute.againstUser ? (
                                <><span className="font-bold">{dispute.againstUser.name}</span><br/>{dispute.againstUser.email}</>
                              ) : "N/A"}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {dispute.status === 'RESOLVED' ? (
                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded font-bold text-xs border border-green-200">Resolved</span>
                              ) : dispute.status === 'CLOSED' ? (
                                <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded font-bold text-xs">Closed</span>
                              ) : (
                                <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded font-bold text-xs border border-amber-200">{dispute.status}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {dispute.status !== 'RESOLVED' && dispute.status !== 'CLOSED' && (
                                <div className="flex gap-2 justify-end">
                                  <button onClick={() => {
                                    const res = window.prompt("Enter resolution message for both parties:");
                                    if (res) handleResolveDispute(dispute.id, res);
                                  }} className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded transition-colors">Resolve</button>
                                </div>
                              )}
                              {dispute.status === 'RESOLVED' && dispute.resolution && (
                                <div className="text-[10px] text-gray-400 mt-1 max-w-[150px] ml-auto truncate" title={dispute.resolution}>
                                  {dispute.resolution}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === "moderation" ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Platform Moderation Queue</h3>
                  <button onClick={fetchData} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4 border-b border-gray-100">Target</th>
                        <th className="px-6 py-4 border-b border-gray-100">Reason</th>
                        <th className="px-6 py-4 border-b border-gray-100">Reported By</th>
                        <th className="px-6 py-4 border-b border-gray-100 text-center">Status</th>
                        <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reports.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No pending reports! The platform is clean.</td>
                        </tr>
                      ) : (
                        reports.map((report) => (
                          <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-gray-900">{report.targetName}</div>
                              <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{report.targetModel}</span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="line-clamp-2 max-w-xs">{report.reason}</p>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                              {report.reportedBy?.name || report.reporterName}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {report.status === 'Resolved' ? (
                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded font-bold text-xs border border-green-200">Resolved</span>
                              ) : report.status === 'Dismissed' ? (
                                <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded font-bold text-xs">Dismissed</span>
                              ) : (
                                <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded font-bold text-xs border border-amber-200">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {report.status === 'Pending' && (
                                <div className="flex gap-2 justify-end">
                                  <button onClick={() => handleUpdateReport(report._id, 'Resolved', 'warn')} className="px-3 py-1 bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs font-bold rounded transition-colors">Warn User</button>
                                  <button onClick={() => handleUpdateReport(report._id, 'Resolved', 'ban')} className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold rounded transition-colors">Ban User</button>
                                  <button onClick={() => handleUpdateReport(report._id, 'Dismissed', 'dismiss')} className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold rounded transition-colors">Dismiss</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === "users" ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4 border-b border-gray-100">User Details</th>
                        <th className="px-6 py-4 border-b border-gray-100">Joined On</th>
                        <th className="px-6 py-4 border-b border-gray-100">Current Role</th>
                        <th className="px-6 py-4 border-b border-gray-100 text-right">Update Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">No users found.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                                {(u.name || "?").charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900">{u.name || "Unknown"}</div>
                                <div className="text-xs text-gray-500">{u.email || u.phone}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                                {u.accountType}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <select 
                                className="bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg focus:ring-primary focus:border-primary px-3 py-2 outline-none font-bold cursor-pointer"
                                value={u.accountType}
                                onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                              >
                                <option value="user">User</option>
                                <option value="hirer">Hirer</option>
                                <option value="worker">Worker</option>
                                <option value="cafe">Cafe Owner</option>
                                <option value="admin">Admin</option>
                                <option value="banned">Banned</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === "cafes" ? (
              <div className="flex flex-col gap-6 animate-in fade-in duration-500">
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
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
            ) : null}
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
                              <div className="flex flex-col items-center gap-1">
                                {worker.cafePaymentStatus === 'COLLECTED_BY_ADMIN' || worker.cafePaymentStatus === 'COLLECTED_OFFLINE_BY_ADMIN' ? (
                                  <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">Offline</span>
                                ) : worker.cafePaymentStatus === 'PAID_ONLINE_BY_CAFE' ? (
                                  <>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">Paid Online</span>
                                    {worker.cafePaymentReceipt && (
                                      <a href={worker.cafePaymentReceipt} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-primary hover:underline flex items-center justify-center gap-1 mt-1">
                                        <FileText className="w-3 h-3" /> View Receipt
                                      </a>
                                    )}
                                  </>
                                ) : worker.cafePaymentStatus === 'PENDING_ADMIN_COLLECTION' ? (
                                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Pending</span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </div>
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
                      <CheckCircle2 className="w-4 h-4" />
                      Verify & Mark Collected
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
