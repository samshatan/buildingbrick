import { Briefcase, FileText, UserCheck } from "lucide-react";

function OurPolicy() {
  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">How it works</h2>
        <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto">Get your projects done in three simple steps.</p>
      </div>
      
      <div className="grid sm:grid-cols-3 gap-8 lg:gap-12 text-center px-4 max-w-5xl mx-auto">
        <div className="flex flex-col items-center group">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
            <FileText className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">1. Post your request</h3>
          <p className="text-gray-600 font-medium leading-relaxed">Describe the work, location, and requirements in minutes.</p>
        </div>
        
        <div className="flex flex-col items-center group">
          <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-secondary/20 transition-all duration-300">
            <UserCheck className="w-8 h-8 text-secondary group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">2. Hire with confidence</h3>
          <p className="text-gray-600 font-medium leading-relaxed">Compare ratings, experience, and verify worker availability.</p>
        </div>
        
        <div className="flex flex-col items-center group">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
            <Briefcase className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">3. Track job status</h3>
          <p className="text-gray-600 font-medium leading-relaxed">Workers update their working status for complete transparency.</p>
        </div>
      </div>
    </div>
  );
}

export default OurPolicy;
