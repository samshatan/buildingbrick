import { workerSubscriptionPlan } from "@/data/marketplaceData";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NewsLetterBox() {
  const { user } = useAuth();
  
  if (user) return null;

  return (
    <div className="relative overflow-hidden border border-gray-200 rounded-3xl bg-white shadow-xl shadow-primary/5 my-12">
      {/* Decorative Gradients */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-100/40 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary-100/30 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 px-6 py-16 md:py-20 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Ready to grow your business?
        </h2>
        <p className="text-lg text-gray-600 font-medium mb-10 max-w-xl mx-auto leading-relaxed">
          Register as a professional worker for a simple one-time fee of <span className="font-bold text-primary">Rs {workerSubscriptionPlan.fee}</span> and get access to thousands of clients in your area.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="group inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 duration-200 w-full sm:w-auto"
          >
            Start Registration
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl text-sm font-bold shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all hover:-translate-y-0.5 duration-200 w-full sm:w-auto"
          >
            <MessageSquare className="w-4 h-4" />
            Talk to Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewsLetterBox;
