import Title from "@/components/Title";

export default function Insurance() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Title text1={"Worker"} text2={"INSURANCE"} />
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🛡️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Protect Yourself While You Work</h2>
          <p className="text-gray-600 mb-8 max-w-2xl text-lg">
            We offer exclusive health and accident insurance plans for our verified workers. Secure your future and get peace of mind on the job.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Health Cover Plus</h3>
            <p className="text-gray-600">Comprehensive medical and accident coverage up to $50,000.</p>
          </div>

          <button className="bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary/90 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
