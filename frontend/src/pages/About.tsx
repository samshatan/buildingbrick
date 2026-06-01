import { Users, Briefcase, ShieldCheck, HeartHandshake } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Building stronger communities through <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">trusted work</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed font-medium">
            BrickOurHouse connects skilled workers with people who need trusted help. From construction and agriculture to domestic services, our marketplace makes hiring simple, transparent, and fair for everyone.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">For Hiring Users</h3>
            <p className="text-gray-600 leading-relaxed font-medium mb-4">
              Find the right person for the job instantly. Browse verified profiles, check ratings, and post work requests in minutes. We take the stress out of hiring for your home and business.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <Briefcase className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">For Skilled Workers</h3>
            <p className="text-gray-600 leading-relaxed font-medium mb-4">
              Build your digital resume, showcase your skills, and let opportunities come to you. Update your availability in real-time and grow your reputation through verified reviews.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-br from-primary-900 to-primary-950 rounded-3xl p-10 md:p-16 text-white text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-10 h-10 text-primary-300 mb-4" />
              <h4 className="text-lg font-bold mb-2">Trust & Safety</h4>
              <p className="text-primary-100/80 text-sm font-medium">Verified profiles and community reviews ensure peace of mind.</p>
            </div>
            <div className="flex flex-col items-center">
              <HeartHandshake className="w-10 h-10 text-primary-300 mb-4" />
              <h4 className="text-lg font-bold mb-2">Fair Opportunity</h4>
              <p className="text-primary-100/80 text-sm font-medium">Equal access to jobs for workers across all skill sectors.</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-10 h-10 text-primary-300 mb-4" />
              <h4 className="text-lg font-bold mb-2">Community First</h4>
              <p className="text-primary-100/80 text-sm font-medium">Building local connections that strengthen neighborhoods.</p>
            </div>
            <div className="flex flex-col items-center">
              <Briefcase className="w-10 h-10 text-primary-300 mb-4" />
              <h4 className="text-lg font-bold mb-2">Simplicity</h4>
              <p className="text-primary-100/80 text-sm font-medium">Easy-to-use tools that get you from searching to working faster.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;
