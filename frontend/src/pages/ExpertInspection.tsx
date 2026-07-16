import Title from "@/components/Title";

export default function ExpertInspection() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Title text1={"Expert"} text2={"INSPECTION"} />
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🔎</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quality & Product Inspection</h2>
          <p className="text-gray-600 mb-8 max-w-2xl text-lg">
            Book a verified expert to inspect the quality of materials or the structural integrity of an ongoing project. Ensure your build meets all safety and quality standards.
          </p>
          
          <button className="bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary/90 transition-colors">
            Book an Expert
          </button>
        </div>
      </div>
    </div>
  );
}
