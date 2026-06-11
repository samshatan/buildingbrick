import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ShieldAlert, ArrowRight, CheckCircle2, CreditCard, UploadCloud, User, MapPin, Users, Briefcase, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function VerificationRequired() {
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [workerProfileId, setWorkerProfileId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("INCOMPLETE");

  const [formData, setFormData] = useState({
    address: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    alternateMobile: "",
    experienceYears: "",
    dailyRate: "",
    termsAccepted: false,
    aadharCard: "",
    panCard: "",
    bankPassbook: "",
    onboardingFeePaid: false
  });

  useEffect(() => {
    // Check for success param from PhonePe redirect
    const urlParams = new URLSearchParams(window.location.search);
    const isSuccess = urlParams.get('success');

    if (user && token && user.userType === "WORKER") {
      fetch(`/api/v1/workers/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data._id) {
            setWorkerProfileId(data._id);
            setVerificationStatus(data.verificationStatus || "INCOMPLETE");
            setFormData(prev => ({
              ...prev,
              address: data.address || "",
              fatherName: data.fatherName || "",
              motherName: data.motherName || "",
              spouseName: data.spouseName || "",
              alternateMobile: data.alternateMobile || "",
              experienceYears: data.experienceYears || "",
              dailyRate: data.dailyRate || "",
              termsAccepted: data.termsAccepted || false,
              aadharCard: data.aadharCard || "",
              panCard: data.panCard || "",
              bankPassbook: data.bankPassbook || "",
              onboardingFeePaid: data.onboardingFeePaid || false
            }));
            
            // Auto-advance if already paid or pending
            if (isSuccess || data.verificationStatus === 'PENDING' || data.verificationStatus === 'VERIFIED') {
              setStep(4);
            } else if (data.onboardingFeePaid) {
              setStep(4);
            }
          }
        })
        .catch(err => console.error("Failed to fetch worker profile:", err));
    }
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
        toast.success(`Document loaded successfully.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async (dataToSave: any) => {
    if (!workerProfileId) {
      toast.error("Profile ID not found. Please refresh the page.");
      return false;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/workers/${workerProfileId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToSave)
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationStatus(data.verificationStatus);
        setIsLoading(false);
        return true;
      } else {
        toast.error(data.message || "Failed to update profile");
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      toast.error("Network error");
      setIsLoading(false);
      return false;
    }
  };

  const handleNextStep1 = async () => {
    if (!formData.address || !formData.dailyRate) {
      toast.error("Please fill all required fields (Address, Daily Rate)");
      return;
    }
    const success = await saveProfile({
      address: formData.address,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      spouseName: formData.spouseName,
      alternateMobile: formData.alternateMobile,
      experienceYears: formData.experienceYears,
      dailyRate: formData.dailyRate
    });
    if (success) setStep(2);
  };

  const handleNextStep2 = async () => {
    if (!formData.aadharCard || !formData.panCard || !formData.bankPassbook) {
      toast.error("Please upload all required documents");
      return;
    }
    if (!formData.termsAccepted) {
      toast.error("You must accept the terms and conditions");
      return;
    }
    const success = await saveProfile({
      aadharCard: formData.aadharCard,
      panCard: formData.panCard,
      bankPassbook: formData.bankPassbook,
      termsAccepted: formData.termsAccepted
    });
    if (success) setStep(3);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/payment/phonepe/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ workerProfileId })
      });
      const data = await res.json();
      
      if (res.ok && data.success && data.url) {
        // Redirect to PhonePe Checkout
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Payment initiation failed.");
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("Network error during payment.");
      setIsLoading(false);
    }
  };

  const handleOfflinePayment = async () => {
    setIsLoading(true);
    const success = await saveProfile({ paymentPreference: 'OFFLINE' });
    if (success) {
      toast.success("Offline payment selected.");
      setStep(4);
    } else {
      setIsLoading(false);
    }
  };

  if (step === 4 || verificationStatus === 'PENDING' || verificationStatus === 'VERIFIED') {
    return (
      <div className="min-h-screen bg-gray-50/50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your profile and documents have been successfully submitted and the onboarding fee has been paid. 
            <br/><br/>
            <strong>Your profile will be verified by our website admins or an authorized cyber cafe owner soon.</strong>
          </p>
          <Link to="/" className="w-full inline-flex items-center justify-center py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-gray-50/50 py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-primary/5 p-6 md:p-8 border-b border-primary/10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 font-medium">Please provide your details to verify your account and start accepting jobs.</p>
          
          {/* Progress Bar */}
          <div className="mt-6 flex items-center gap-2">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200'} transition-colors duration-300`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'} transition-colors duration-300`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-200'} transition-colors duration-300`} />
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
            <span className={step >= 1 ? 'text-primary' : ''}>Personal Info</span>
            <span className={step >= 2 ? 'text-primary' : ''}>Documents</span>
            <span className={step >= 3 ? 'text-primary' : ''}>Payment</span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-400 m-4" />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name (Permanent)</label>
                  <div className="text-lg font-bold text-gray-900">{user?.fullName}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <MapPin className="w-5 h-5 text-primary" /> Location Details
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Home Address *</label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Enter your full residential address" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Users className="w-5 h-5 text-primary" /> Family Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Father's Name</label>
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mother's Name</label>
                    <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Spouse Name (If married)</label>
                    <input type="text" name="spouseName" value={formData.spouseName} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Alternate Mobile</label>
                    <input type="tel" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Briefcase className="w-5 h-5 text-primary" /> Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Work Experience (Years)</label>
                    <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Daily Wage Expectation (Rs) *</label>
                    <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" min="0" />
                  </div>
                </div>
              </div>

              <button onClick={handleNextStep1} disabled={isLoading || !workerProfileId} className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? "Saving..." : !workerProfileId ? "Loading profile..." : "Continue to Documents"} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p>Please upload clear images of your original documents. These will be verified by our team.</p>
              </div>

              <div className="space-y-5">
                {/* Aadhar */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                  <UploadCloud className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="font-bold text-gray-900 mb-1">Aadhar Card *</p>
                  <p className="text-xs text-gray-500 mb-4">Front and back combined in one image if possible</p>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'aadharCard')} className="hidden" id="aadhar-upload" />
                  <label htmlFor="aadhar-upload" className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800">
                    Choose File
                  </label>
                  {formData.aadharCard && <p className="mt-3 text-xs font-bold text-green-600 flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4"/> Uploaded</p>}
                </div>

                {/* PAN */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                  <UploadCloud className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="font-bold text-gray-900 mb-1">PAN Card *</p>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'panCard')} className="hidden" id="pan-upload" />
                  <label htmlFor="pan-upload" className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800">
                    Choose File
                  </label>
                  {formData.panCard && <p className="mt-3 text-xs font-bold text-green-600 flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4"/> Uploaded</p>}
                </div>

                {/* Bank Passbook */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                  <UploadCloud className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="font-bold text-gray-900 mb-1">Bank Passbook (Front Page) *</p>
                  <p className="text-xs text-gray-500 mb-4">For receiving payments directly to your account</p>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'bankPassbook')} className="hidden" id="bank-upload" />
                  <label htmlFor="bank-upload" className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800">
                    Choose File
                  </label>
                  {formData.bankPassbook && <p className="mt-3 text-xs font-bold text-green-600 flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4"/> Uploaded</p>}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input type="checkbox" id="terms" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  I accept the <a href="#" className="font-bold text-primary hover:underline">Terms & Requirements</a>. I confirm that all the information provided above is true and accurate to the best of my knowledge.
                </label>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">
                  Back
                </button>
                <button onClick={handleNextStep2} disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-all">
                  {isLoading ? "Saving..." : "Continue to Payment"} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-center py-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-12 h-12 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Fee</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                A one-time nominal fee is required to process your application and verify your documents online.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-sm mx-auto mb-8">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Verification Fee</span>
                  <span className="font-bold text-gray-900">Rs 19.00</span>
                </div>
                <div className="flex justify-between items-center text-lg font-black text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-primary">Rs 19.00</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button onClick={handlePayment} disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/30">
                  {isLoading ? "Processing..." : "Pay Rs 19 Online"}
                </button>
                <button onClick={handleOfflinePayment} disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20">
                  Pay at Cyber Cafe Later
                </button>
                <button onClick={() => setStep(2)} disabled={isLoading} className="w-full py-3 bg-transparent text-gray-500 font-bold hover:text-gray-700 transition-colors">
                  Go Back
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
