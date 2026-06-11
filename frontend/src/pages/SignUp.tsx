import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { workerCategories } from "@/data/marketplaceData";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Mail, Lock, User, UserPlus, ArrowRight, Briefcase, UserCircle, X, Search, CheckCircle2, Phone } from "lucide-react";
import { useGoogleLogin } from '@react-oauth/google';

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('/api/v1/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });
        const result = await res.json().catch(() => null);
        if (!res.ok) {
          toast.error(result?.message || 'Google signup failed');
          return;
        }
        login(result.token, result.user);
        toast.success('Account created successfully!');
        if (result.user.userType === 'WORKER') {
          navigate('/verification-required');
        } else {
          navigate('/');
        }
      } catch (err) {
        toast.error('Unable to sign up with Google.');
      }
    },
    onError: () => toast.error('Google Sign-In failed'),
  });
  const [data, setData] = useState({
    fullName: '',
    email: '', // used for email or mobile
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [accountType, setAccountType] = useState<'worker' | 'hirer'>('worker');
  const [workerTypes, setWorkerTypes] = useState<string[]>([]);
  const [professionSearch, setProfessionSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (accountType === 'worker' && workerTypes.length === 0) {
        toast.error('Please select at least one worker type.');
        setIsLoading(false);
        return;
      }
      
      if (accountType === 'worker' && !profileFile) {
        toast.error('Profile photo is mandatory for workers.');
        setIsLoading(false);
        return;
      }
      
      const identifier = accountType === 'worker' ? data.phone.trim() : data.email.trim();
      const isPhone = /^[0-9]+$/.test(identifier);
      if (accountType === 'worker') {
        if (identifier.length !== 10) {
          toast.error('Mobile number must be exactly 10 digits.');
          setIsLoading(false);
          return;
        }
      } else {
        if (isPhone && identifier.length !== 10) {
          toast.error('Mobile number must be exactly 10 digits.');
          setIsLoading(false);
          return;
        } else if (!isPhone && !identifier.includes('@')) {
          toast.error('Please enter a valid email or 10-digit mobile number.');
          setIsLoading(false);
          return;
        }
      }
      
      // Send OTP first
      const res = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier, type: 'signup' })
      });
      const resData = await res.json().catch(() => null);
      
      if (!res.ok) {
        toast.error(resData?.message || 'Failed to send OTP.');
        setIsLoading(false);
        return;
      }
      
      toast.success(resData?.message || 'OTP sent! Please check your email or messages.');
      setShowOtpModal(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Unable to process right now. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      const identifier = accountType === 'worker' ? data.phone.trim() : data.email.trim();
      formData.append('name', data.fullName.trim());
      formData.append('identifier', identifier);
      if (accountType === 'worker' && data.email.trim()) {
        formData.append('optionalEmail', data.email.trim());
      }
      formData.append('otp', otp.trim());
      formData.append('password', data.password);
      formData.append('accountType', accountType);
      
      if (accountType === 'worker' && workerTypes.length > 0) {
        formData.append('category', workerTypes.join(', '));
      }
      
      if (profileFile) {
        formData.append('photo', profileFile);
      }

      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        const message = result?.message || result?.error || 'Something went wrong';
        toast.error(message);
        return;
      }

      if (!result?.token || !result?.user) {
        toast.error('Unexpected response from server.');
        return;
      }
      
      login(result.token, result.user);
      toast.success('Account created successfully!');
      if (result.user.userType === 'WORKER') {
        navigate('/verification-required');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Unable to create account right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="w-full max-w-lg space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-primary/5 border border-primary/10">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 bg-primary/10 flex items-center justify-center rounded-2xl mb-6">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
            Create an account
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Join the community and get started today.
          </p>
        </div>

        {!showOtpModal ? (
          <form className="mt-8 space-y-5" aria-labelledby="signup-heading" onSubmit={handleSubmit}>
          
          {/* Account Type Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">I want to join as a</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAccountType('worker')}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  accountType === 'worker' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Briefcase className={`h-6 w-6 mb-2 ${accountType === 'worker' ? 'text-primary' : 'text-gray-400'}`} />
                <span className="font-bold text-sm text-gray-900">Worker</span>
                <span className="text-xs font-medium mt-1 text-center">Offer your services</span>
              </button>
              
              <button
                type="button"
                onClick={() => setAccountType('hirer')}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  accountType === 'hirer' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <UserCircle className={`h-6 w-6 mb-2 ${accountType === 'hirer' ? 'text-primary' : 'text-gray-400'}`} />
                <span className="font-bold text-sm text-gray-900">Hirer</span>
                <span className="text-xs font-medium mt-1 text-center">Hire professionals</span>
              </button>
            </div>
          </div>

          {accountType === 'worker' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-gray-700">
                What are your professions?
              </label>
              
              {/* Selected Professions (Pills) */}
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

              {/* Input for searching/adding professions */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Type to search professions..."
                  value={professionSearch}
                  onChange={(e) => setProfessionSearch(e.target.value)}
                  className="block w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                />
                
                {/* Autocomplete Dropdown Panel */}
                {professionSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {(() => {
                      const options = workerCategories
                        .flatMap(c => c.types)
                        .filter(type => 
                          type.toLowerCase().includes(professionSearch.toLowerCase()) && 
                          !workerTypes.includes(type)
                        );
                        
                      if (options.length === 0) {
                        return <div className="p-3 text-sm text-gray-500 text-center font-medium">No matching professions found</div>;
                      }

                      return options.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setWorkerTypes([...workerTypes, type]);
                            setProfessionSearch('');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors border-b border-gray-50 last:border-0"
                        >
                          {type}
                        </button>
                      ));
                    })()}
                  </div>
                )}
              </div>

              {/* Photo Upload for Worker */}
              <div className="space-y-3 pt-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Profile Photo (Required)
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Upload a square image for best results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={data.fullName}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="John Doe"
                />
              </div>
            </div>
          </div>

          {accountType === 'worker' ? (
            <>
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  Mobile Number (Required)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={data.phone}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="9876543210"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={data.email}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="name@example.com or 9876543210"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={data.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={data.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Account
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleVerifyOtp}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Verify your Contact</h3>
              <p className="text-sm text-gray-500 mt-2">
                We've sent a 6-digit OTP to <span className="font-bold text-gray-700">{accountType === 'worker' ? data.phone : data.email}</span>.
              </p>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 text-center">
                Enter Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="block w-full text-center tracking-[0.5em] text-2xl py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Verify & Create Account
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="w-full mt-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Change Contact Details
            </button>
          </form>
        )}

        {accountType === 'hirer' && (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => googleLogin()}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200"
              >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                </svg>
                Google
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:text-primary-600 hover:underline transition-all">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
