import Title from "@/components/Title";

export default function FullHouseConstruction() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Title text1={"Full House"} text2={"CONSTRUCTION"} />
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🏗️</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Build Your Dream Home</h2>
          <p className="text-gray-600 mb-8 max-w-2xl text-lg">
            Get end-to-end construction services. From design and approvals to execution and handover, we manage everything.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-500">✓</span> What's included
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Architectural Design & Planning</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Material Procurement</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Labor Management</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Quality Assurance</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Timely Handover</li>
            </ul>
          </div>

          <button className="bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary/90 transition-colors">
            Get Free Estimate
          </button>
        </div>
      </div>
    </div>
  );
}
