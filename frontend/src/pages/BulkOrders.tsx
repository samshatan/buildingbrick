import Title from "@/components/Title";

export default function BulkOrders() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Title text1={"Bulk"} text2={"ORDERS"} />
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🚚</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wholesale Materials Pricing</h2>
          <p className="text-gray-600 mb-8 max-w-2xl text-lg">
            Need materials in large quantities for a major project? Request a bulk order for special discounted pricing on bricks, cement, sand, and more.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Request a Quote</h3>
            <p className="text-gray-600 mb-4">Tell us what materials you need and in what quantity, and we'll get back to you with our best rates within 24 hours.</p>
            <button className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors">
              Start Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
