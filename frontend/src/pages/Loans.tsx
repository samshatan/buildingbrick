import Title from "@/components/Title";

export default function Loans() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Title text1={"Worker"} text2={"LOANS"} />
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">💰</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Support for Professionals</h2>
          <p className="text-gray-600 mb-8 max-w-2xl text-lg">
            Access low-interest loans designed specifically for our platform workers. Get funds for new tools, emergencies, or personal needs based on your work history.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Micro-Loans up to $5,000</h3>
            <p className="text-gray-600">Instant approval based on your ratings and completed jobs on the platform.</p>
          </div>

          <button className="bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary/90 transition-colors">
            Check Eligibility
          </button>
        </div>
      </div>
    </div>
  );
}
