import { useEffect, useState } from "react";
import { BadgeCheck, Briefcase, Camera, Clock, CreditCard, LayoutDashboard, LogOut, Star, ToggleLeft, ToggleRight, UserCircle, X, Search, Edit2, Package } from "lucide-react";
import { workerSubscriptionPlan, workerCategories } from "@/data/marketplaceData";
import { useAuth } from "../context/AuthContext";
import type { WorkerProfileResponse } from "@/components/WorkerCard";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import IdCardModal from "../components/IdCardModal";

function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [workerProfile, setWorkerProfile] = useState<WorkerProfileResponse | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Become Worker State
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [workerTypes, setWorkerTypes] = useState<string[]>([]);
  const [professionSearch, setProfessionSearch] = useState('');
  const [workerPhone, setWorkerPhone] = useState(user?.phone || '');
  const [workerAddress, setWorkerAddress] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  
  // Account Editing State
  const [showAccountEditModal, setShowAccountEditModal] = useState(false);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Worker Editing State
  const [showWorkerEditModal, setShowWorkerEditModal] = useState(false);
  const [isUpdatingWorker, setIsUpdatingWorker] = useState(false);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [workerForm, setWorkerForm] = useState({
    dailyRate: 0,
    experienceYears: 0,
    bio: '',
    skills: '',
    location: ''
  });

  const { login: updateAuthContext } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.userType === "WORKER") {
      fetch(`/api/v1/workers/user/${user.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Profile not found");
          return res.json();
        })
        .then((data: WorkerProfileResponse) => {
          setWorkerProfile(data);
          setIsWorking(data.availabilityStatus === "BUSY");
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const handleBecomeWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (workerTypes.length === 0) {
      toast.error('Please select at least one profession.');
      return;
    }
    if (!workerPhone || !workerAddress) {
      toast.error('Phone and Address are required.');
      return;
    }
    setIsConverting(true);
    try {
      const res = await fetch('/api/v1/users/become-worker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          category: workerTypes.join(', '),
          phone: workerPhone,
          location: workerAddress
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        updateAuthContext(data.token, data.user); // seamlessly upgrade user state
        setShowWorkerModal(false);
      } else {
        toast.error(data.message || 'Failed to convert account.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to server.');
    } finally {
      setIsConverting(false);
    }
  };

  const toggleAvailability = async () => {
    if (!workerProfile || !token) return;

    const newStatus = isWorking ? "AVAILABLE" : "BUSY";
    try {
      const res = await fetch(`/api/v1/workers/${workerProfile.id}/availability`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setIsWorking(!isWorking);
        toast.success(`Status updated to ${newStatus === 'AVAILABLE' ? 'Available' : 'Busy'}`);
      } else {
        toast.error("Failed to update availability.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating availability.");
    }
  };

  const handleOptInInsurance = async () => {
    if (!workerProfile || !token) return;
    const toastId = toast.loading("Processing your request...");
    try {
      const res = await fetch(`/api/v1/workers/${workerProfile.id}/insurance`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      if (res.ok) {
        setWorkerProfile({ ...workerProfile, insuranceStatus: 'PENDING' });
        toast.update(toastId, { render: "Successfully opted into insurance!", type: "success", isLoading: false, autoClose: 3000 });
      } else {
        toast.update(toastId, { render: data.message || "Failed to opt in.", type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "An error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountForm.email && !accountForm.phone) {
      toast.error('Either email or phone must be provided.');
      return;
    }
    setIsUpdatingAccount(true);
    try {
      const res = await fetch('/api/v1/users/account', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(accountForm)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        updateAuthContext(data.token, data.user);
        setShowAccountEditModal(false);
      } else {
        toast.error(data.message || 'Failed to update account.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to server.');
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handleWorkerUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerProfile || !token) return;
    setIsUpdatingWorker(true);
    try {
      const res = await fetch(`/api/v1/workers/${workerProfile.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(workerForm)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Worker profile updated successfully!");
        setWorkerProfile(data);
        setShowWorkerEditModal(false);
      } else {
        toast.error(data.message || 'Failed to update worker profile.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to server.');
    } finally {
      setIsUpdatingWorker(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !workerProfile) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB.");
      return;
    }

    const toastId = toast.loading("Uploading photo...");
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const response = await fetch(`/api/v1/workers/${workerProfile.id}/photo`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ photo: base64String }),
        });

        if (response.ok) {
          const updatedProfile = await response.json();
          setWorkerProfile(updatedProfile);
          toast.update(toastId, { render: "Photo updated successfully!", type: "success", isLoading: false, autoClose: 3000 });
        } else {
          toast.update(toastId, { render: "Failed to update photo.", type: "error", isLoading: false, autoClose: 3000 });
        }
      } catch (err) {
        console.error(err);
        toast.update(toastId, { render: "Error uploading photo.", type: "error", isLoading: false, autoClose: 3000 });
      }
    };
    reader.readAsDataURL(file);
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        
        {/* Left Sidebar Navigation */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
            
            {/* User Mini Profile */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 mb-6">
              <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border border-gray-200 bg-primary/10 flex items-center justify-center shadow-inner">
                  {user.userType === "WORKER" && workerProfile?.photo ? (
                    <img src={workerProfile.photo} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-extrabold text-primary">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {user.userType === "WORKER" && (
                  <label className="absolute -bottom-2 -right-2 bg-white text-primary border border-gray-200 p-2 rounded-full cursor-pointer shadow-md hover:text-primary-600 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
              <h2 className="font-bold text-gray-900 text-lg flex items-center justify-center gap-1.5">
                {user.fullName}
                {user.userType === "WORKER" && workerProfile?.verified && <BadgeCheck className="w-5 h-5 text-green-500" />}
              </h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 mt-2 uppercase tracking-wider">
                {user.userType === "WORKER" ? "Worker Account" : "Hiring Account"}
              </span>
              
              <button
                onClick={() => {
                  setAccountForm({
                    name: user.fullName || '',
                    email: user.email || '',
                    phone: user.phone || ''
                  });
                  setShowAccountEditModal(true);
                }}
                className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-primary hover:border-primary/50 hover:bg-primary/5 font-bold text-xs rounded-lg transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Account
              </button>

              {user.userType === "WORKER" && workerProfile && (
                <>
                  <button
                    onClick={() => {
                      setWorkerForm({
                        dailyRate: workerProfile.dailyRate || 0,
                        experienceYears: workerProfile.experienceYears || 0,
                        bio: workerProfile.bio || '',
                        skills: workerProfile.skills || '',
                        location: workerProfile.location || ''
                      });
                      setShowWorkerEditModal(true);
                    }}
                    className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-primary hover:border-primary/50 hover:bg-primary/5 font-bold text-xs rounded-lg transition-all w-full"
                  >
                    <Briefcase className="w-3.5 h-3.5" /> Edit Worker Details
                  </button>
                  {workerProfile.verified && (
                    <button
                      onClick={() => setShowIdCardModal(true)}
                      className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white hover:from-black hover:to-gray-900 font-bold text-xs rounded-lg transition-all w-full shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> View ID Card
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Nav Links */}
            <nav className="space-y-1.5">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm transition-colors">
                <UserCircle className="w-5 h-5" />
                Profile Settings
              </Link>
              {user.userType === "ADMIN" && (
                <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                  Admin Dashboard
                </Link>
              )}
              {["CAFE", "ADMIN"].includes(user.userType) && (
                <Link to="/cafe-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                  Cafe Dashboard
                </Link>
              )}
              {["WORKER", "HIRER", "ADMIN"].includes(user.userType) && (
                <>
                  <Link to="/requests" state={{ activeTab: user.userType === "WORKER" ? "applications" : undefined }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                    {user.userType === "WORKER" ? "My Job Applications" : "My Work Requests"}
                  </Link>
                  <Link to="/jobs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <Briefcase className="w-5 h-5" />
                    Active Contracts
                  </Link>
                </>
              )}
              {["WORKER", "HIRER", "ADMIN", "CAFE"].includes(user.userType) && (
                <Link to="/material-orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <Package className="w-5 h-5" />
                  My Material Orders
                </Link>
              )}
            </nav>

            <button onClick={() => { logout(); navigate('/'); }} className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          
          {user.userType === "WORKER" && workerProfile ? (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-0.5">Jobs Completed</p>
                    <p className="text-2xl font-extrabold text-gray-900">{workerProfile.jobsCompleted}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-0.5">Overall Rating</p>
                    <p className="text-2xl font-extrabold text-gray-900">{workerProfile.rating?.toFixed(1) || "0.0"}</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-0.5">Experience</p>
                    <p className="text-2xl font-extrabold text-gray-900">{workerProfile.experienceYears} <span className="text-sm font-semibold text-gray-500">Yrs</span></p>
                  </div>
                </div>
              </div>

              {/* Status & Subscription (Only for verified) */}
              {workerProfile.verified ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Working Status Card */}
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-2 h-full ${isWorking ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Availability Status</h3>
                    
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-4">
                      <div>
                        <p className={`font-bold ${isWorking ? 'text-orange-700' : 'text-green-700'}`}>
                          {isWorking ? "Currently Busy" : "Available for Hire"}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Toggle when you accept or finish jobs.</p>
                      </div>
                      <button onClick={toggleAvailability} className="transition-transform hover:scale-105">
                        {isWorking ? (
                          <ToggleRight className="w-10 h-10 text-orange-500" />
                        ) : (
                          <ToggleLeft className="w-10 h-10 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Subscription Card */}
                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-xl text-white">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold">Worker Plan</h3>
                      <CreditCard className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="mb-6">
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-extrabold">Rs {workerSubscriptionPlan.fee}</span>
                        <span className="text-gray-400 font-medium pb-1">/{workerSubscriptionPlan.durationMonths}mo</span>
                      </div>
                      <p className="text-sm text-gray-400 font-medium mt-2">{workerSubscriptionPlan.renewalNote}</p>
                    </div>
                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-colors">
                      Manage Subscription
                    </button>
                  </div>

                  {/* Insurance & Benefits Card */}
                  <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-primary/10 rounded-3xl p-8 border border-primary/20 shadow-sm relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <BadgeCheck className="w-6 h-6 text-primary" /> Worker Insurance & Benefits
                        </h3>
                        <p className="text-gray-600 font-medium max-w-xl">
                          Secure your future! Get health and accidental insurance coverage exclusively for verified workers on our platform.
                        </p>
                      </div>
                      <div className="shrink-0">
                        {workerProfile.insuranceStatus === 'ACTIVE' ? (
                          <div className="px-6 py-3 bg-green-100 text-green-700 font-bold rounded-xl flex items-center gap-2 border border-green-200">
                            <BadgeCheck className="w-5 h-5" /> Active Coverage
                          </div>
                        ) : workerProfile.insuranceStatus === 'PENDING' ? (
                          <div className="px-6 py-3 bg-amber-100 text-amber-700 font-bold rounded-xl flex items-center gap-2 border border-amber-200">
                            <Clock className="w-5 h-5" /> Enrollment Pending
                          </div>
                        ) : (
                          <button 
                            onClick={handleOptInInsurance}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary-600 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                          >
                            Opt-in Now (Free)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200 shadow-sm text-center">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">Verification Required</h3>
                  <p className="text-amber-700 font-medium max-w-lg mx-auto mb-6">
                    You must visit an authorized Cyber Cafe to verify your identity and activate your Worker Plan before you can accept jobs or set your availability.
                  </p>
                  <Link to="/verification-required" className="inline-block px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-sm">
                    View Verification Instructions
                  </Link>
                </div>
              )}
            </>
          ) : user.userType === "ADMIN" ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Briefcase className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Admin</h2>
              <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
                As an Admin, you can manage cyber cafes, monitor verified workers, and reconcile pending balances.
              </p>
              <div className="flex gap-4">
                <Link to="/admin-dashboard" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-md shadow-primary/20">
                  Go to Master Dashboard
                </Link>
              </div>
            </div>
          ) : user.userType === "CAFE" ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Briefcase className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Cafe Partner</h2>
              <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
                As a Cafe Owner, you can search for unverified workers, verify their documents, collect fees, and print official certificates.
              </p>
              <div className="flex gap-4">
                <Link to="/cafe-dashboard" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-md shadow-primary/20">
                  Open Verification Portal
                </Link>
              </div>
            </div>
          ) : (
            // Hirer View
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Briefcase className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your dashboard</h2>
              <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
                As a hiring user, you can browse workers, post public work requests, and manage your active contracts from here.
              </p>
              <div className="flex gap-4">
                <Link to="/workers" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-md shadow-primary/20">
                  Find Workers
                </Link>
                <Link to="/hire-request" className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  Post a Job
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Offer your services?</h3>
                <p className="text-gray-500 text-sm mb-4">Want to start earning by offering your skills on BrickOurHouse?</p>
                <button onClick={() => setShowWorkerModal(true)} className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-sm">
                  Become a Worker
                </button>
              </div>
            </div>
          )}

          {/* Become a Worker Modal */}
          {showWorkerModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Worker</h2>
                <p className="text-gray-500 mb-6">Select your professions to get started.</p>
                
                <form onSubmit={handleBecomeWorker} className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">What are your professions?</label>
                    {workerTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {workerTypes.map(type => (
                          <div key={type} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold shadow-sm">
                            {type}
                            <button type="button" onClick={() => setWorkerTypes(workerTypes.filter(t => t !== type))} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Type to search professions..."
                        value={professionSearch}
                        onChange={(e) => setProfessionSearch(e.target.value)}
                        className="block w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      />
                      {professionSearch && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {(() => {
                            const options = workerCategories
                              .flatMap(c => c.types)
                              .filter(type => type.toLowerCase().includes(professionSearch.toLowerCase()) && !workerTypes.includes(type));
                            if (options.length === 0) return <div className="p-3 text-sm text-gray-500 text-center font-medium">No matching professions</div>;
                            return options.map(type => (
                              <button key={type} type="button" onClick={() => { setWorkerTypes([...workerTypes, type]); setProfessionSearch(''); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors border-b border-gray-50 last:border-0">
                                {type}
                              </button>
                            ));
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      minLength={10}
                      title="Please enter a valid 10-digit mobile number"
                      value={workerPhone}
                      onChange={(e) => setWorkerPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Service Area / Address <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={workerAddress}
                      onChange={(e) => setWorkerAddress(e.target.value)}
                      placeholder="e.g. Downtown Area, City"
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                  
                  <div className="flex gap-3 justify-end pt-4">
                    <button type="button" onClick={() => setShowWorkerModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isConverting} className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-600 rounded-xl transition-colors flex items-center gap-2">
                      {isConverting ? 'Converting...' : 'Become Worker'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Account Edit Modal */}
          {showAccountEditModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Account</h2>
                <p className="text-gray-500 mb-6">Update your basic profile information.</p>
                
                <form onSubmit={handleAccountUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={accountForm.name}
                      onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={accountForm.email}
                      onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={accountForm.phone}
                      onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 font-medium">Note: Either an email address or a phone number must be provided.</p>

                  <div className="flex gap-3 justify-end pt-4">
                    <button type="button" onClick={() => setShowAccountEditModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isUpdatingAccount} className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-600 rounded-xl transition-colors flex items-center gap-2">
                      {isUpdatingAccount ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Worker Edit Modal */}
          {showWorkerEditModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Worker Details</h2>
                <p className="text-gray-500 mb-6">Update your professional information and rate.</p>
                
                <form onSubmit={handleWorkerUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Per Day Rate (Rs)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={workerForm.dailyRate}
                      onChange={(e) => setWorkerForm({ ...workerForm, dailyRate: Number(e.target.value) })}
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Years of Experience</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={workerForm.experienceYears}
                      onChange={(e) => setWorkerForm({ ...workerForm, experienceYears: Number(e.target.value) })}
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Bio</label>
                    <textarea
                      rows={3}
                      value={workerForm.bio}
                      onChange={(e) => setWorkerForm({ ...workerForm, bio: e.target.value })}
                      placeholder="Tell hirers about yourself..."
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Skills</label>
                    <input
                      type="text"
                      value={workerForm.skills}
                      onChange={(e) => setWorkerForm({ ...workerForm, skills: e.target.value })}
                      placeholder="e.g. Plumbing, Wiring, Painting"
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Location</label>
                    <input
                      type="text"
                      value={workerForm.location}
                      onChange={(e) => setWorkerForm({ ...workerForm, location: e.target.value })}
                      placeholder="e.g. Downtown Area, City"
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  
                  <div className="flex gap-3 justify-end pt-4">
                    <button type="button" onClick={() => setShowWorkerEditModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isUpdatingWorker} className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-600 rounded-xl transition-colors flex items-center gap-2">
                      {isUpdatingWorker ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ID Card Modal */}
          {showIdCardModal && user && workerProfile && (
            <IdCardModal
              user={user}
              workerProfile={workerProfile}
              onClose={() => setShowIdCardModal(false)}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
