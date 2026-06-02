import { Link } from "react-router-dom";
import { Briefcase, ShieldCheck, Users, ArrowRight, CheckCircle2 } from "lucide-react";

function HeroSection() {
  return (
    <div className="relative overflow-hidden w-full border border-primary-100/50 rounded-3xl bg-white shadow-xl shadow-primary/5 mt-4 mb-12">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100/30 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="flex flex-col lg:flex-row items-center p-6 sm:p-12 lg:p-16 gap-12 lg:gap-8">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider uppercase text-primary">Dynamic Worker Marketplace</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            Build your house <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">effortlessly.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 font-medium max-w-lg mb-8 leading-relaxed">
            Browse verified contractors, agriculture workers, and domestic helpers. Empowering communities with transparent hiring and dynamic scheduling.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              to="/workers"
              className="group inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 duration-200 w-full sm:w-auto"
            >
              Find Workers
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl text-sm font-bold shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all hover:-translate-y-0.5 duration-200 w-full sm:w-auto"
            >
              Join as Worker
            </Link>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-semibold text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Verified Profiles
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Transparent Pricing
            </div>
          </div>
        </div>

        {/* Right Cards Layout */}
        <div className="w-full lg:w-1/2 relative z-10 flex flex-col gap-5 sm:px-4 lg:px-8">
          
          <div className="group flex items-start gap-5 p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary shadow-inner border border-primary-200/50">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary transition-colors">All Worker Types</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Construction, agriculture, and domestic workers all accessible in one unified platform.
              </p>
            </div>
          </div>

          <div className="group flex items-start gap-5 p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 lg:-ml-8">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-50 flex items-center justify-center text-secondary shadow-inner border border-secondary-200/50">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-secondary transition-colors">Hire Seamlessly</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Connect instantly with professionals. Review their experience, rates, and previous jobs before hiring.
              </p>
            </div>
          </div>

          <div className="group flex items-start gap-5 p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary shadow-inner border border-primary-200/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary transition-colors">Trust & Safety</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Workers update their availability statuses in real-time. Verified badges ensure you hire with confidence.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HeroSection;
