import { MapPin, ShieldAlert, ArrowRight, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { workerSubscriptionPlan } from "@/data/marketplaceData";

function VerificationRequired() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-amber-50 p-8 text-center border-b border-amber-100">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-600 mb-6 shadow-inner">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-amber-900 tracking-tight mb-3">Action Required!</h1>
          <p className="text-amber-700 font-medium leading-relaxed">
            Your account has been created, but you must complete in-person verification before you can apply for jobs.
          </p>
        </div>

        <div className="p-8 space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">1</span>
              Visit a local Cyber Cafe
            </h3>
            <p className="text-sm text-gray-600 pl-10">
              Go to any authorized cyber cafe near you. Tell them you are here for <strong>BrickOurHouse Worker Verification</strong>.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">2</span>
              Provide your details
            </h3>
            <div className="text-sm text-gray-600 pl-10 space-y-2">
               <p>Give the cafe owner the Email Address or Phone Number you just used to sign up.</p>
               <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-500">
                 <li>Bring valid Government ID for verification.</li>
                 <li>Bring any relevant certification or license.</li>
               </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">3</span>
              Pay subscription fee
            </h3>
            <p className="text-sm text-gray-600 pl-10">
              Pay the one-time subscription fee of <strong className="text-primary">Rs {workerSubscriptionPlan.fee}</strong> directly to the cafe owner. Once paid, they will instantly activate your profile.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
             <Printer className="w-6 h-6 text-gray-400 shrink-0 mt-0.5" />
             <div>
                <p className="font-bold text-gray-900 text-sm mb-1">Get your certificate</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  After successful verification, the cafe owner will print a physical "Verified Worker" certificate for you to keep.
                </p>
             </div>
          </div>

        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <Link 
            to="/profile"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-all shadow-md"
          >
            Go to My Profile
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default VerificationRequired;
