import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from "@/components/Title";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Briefcase, User, FileText, CheckCircle } from 'lucide-react';

function WorkerOnboarding() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    jobTitle: '',
    bio: '',
    skills: '',
    dailyRate: '',
    experienceYears: '',
    location: '',
    address: '',
    aadharCard: '',
    panCard: '',
  });

  useEffect(() => {
    if (!token) {
      toast.error('Please login to access worker onboarding.');
      navigate('/login');
    }
  }, [token, navigate]);

  const updateForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.displayName || !formData.jobTitle)) {
      toast.error('Please fill in your name and job title.');
      return;
    }
    if (step === 2 && (!formData.aadharCard || !formData.panCard)) {
      toast.error('Identity documents are required for verification.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Submitting application...");

    try {
      if (!user?.id) throw new Error("User ID not found");

      // 1. Get worker profile ID
      const workerRes = await fetch(`/api/v1/workers/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!workerRes.ok) throw new Error("Could not find associated worker profile. Ensure you are registered as a worker.");
      const workerData = await workerRes.json();
      const workerId = workerData._id || workerData.id;

      // 2. Update profile
      const updateRes = await fetch(`/api/v1/workers/${workerId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          dailyRate: Number(formData.dailyRate) || 0,
          experienceYears: Number(formData.experienceYears) || 0
        })
      });

      if (!updateRes.ok) throw new Error("Failed to update profile.");

      toast.update(loadingToast, { render: "Application Submitted! Your profile is under review.", type: "success", isLoading: false, autoClose: 3000 });
      navigate('/workers');

    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.update(loadingToast, { render: error.message || "An error occurred.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Title text1={"Worker"} text2={"ONBOARDING"} />
          <p className="text-gray-500 font-medium mt-2">Join our marketplace and start getting hired.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          {/* Progress bar */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
            <div className={`absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-300`} style={{ width: `${(step - 1) * 50}%` }}></div>
            
            {[1, 2, 3].map((s) => (
              <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 text-gray-400'}`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-primary" /> Basic Information
                </h3>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name (as per Aadhar)</label>
                  <input required name="displayName" value={formData.displayName} onChange={updateForm} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" placeholder="John Doe" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Primary Job Title</label>
                  <input required name="jobTitle" value={formData.jobTitle} onChange={updateForm} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" placeholder="e.g. Master Plumber" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Daily Rate ($)</label>
                    <input type="number" name="dailyRate" value={formData.dailyRate} onChange={updateForm} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Experience (Years)</label>
                    <input type="number" name="experienceYears" value={formData.experienceYears} onChange={updateForm} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" placeholder="5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Short Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={updateForm} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" placeholder="Tell clients about yourself..." />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" /> Verification Documents
                </h3>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Aadhar Card Number</label>
                  <input required name="aadharCard" value={formData.aadharCard} onChange={updateForm} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" placeholder="xxxx-xxxx-xxxx" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">PAN Card Number</label>
                  <input required name="panCard" value={formData.panCard} onChange={updateForm} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" placeholder="ABCDE1234F" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">City / Base Location</label>
                  <input required name="location" value={formData.location} onChange={updateForm} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" placeholder="Mumbai, Maharashtra" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-primary" /> Final Review
                </h3>
                
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">By submitting this application, you agree to our terms of service and verify that all provided information is accurate. Your profile will be reviewed by our moderation team before going live on the platform.</p>
                  <p className="text-sm text-gray-600 font-bold mt-4">Profile: {formData.displayName} ({formData.jobTitle})</p>
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)} className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50">
                {step === 3 ? (loading ? 'Submitting...' : 'Submit Application') : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WorkerOnboarding;
