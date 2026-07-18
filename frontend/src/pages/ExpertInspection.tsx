import { useState } from "react";
import Title from "@/components/Title";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function ExpertInspection() {
  const { token } = useAuth();
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to book an expert.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/v1/expert-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projectDetails: details,
          location: location
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book expert');
      }

      setSuccess(true);
      toast.success("Expert inspection request submitted successfully!");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Title text1={"Expert"} text2={"INSPECTION"} />
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          
          {success ? (
            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Expert Booked!</h3>
              <p className="text-gray-600 mb-6">We've received your request. An administrator will review your details and contact you to schedule the inspection.</p>
              <Link to="/" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors">
                Back to Home
              </Link>
            </div>
          ) : !showForm ? (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🔎</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quality & Product Inspection</h2>
              <p className="text-gray-600 mb-8 max-w-2xl text-lg">
                Book a verified expert to inspect the quality of materials or the structural integrity of an ongoing project. Ensure your build meets all safety and quality standards.
              </p>
              
              <button 
                onClick={() => setShowForm(true)}
                className="bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary/90 transition-colors"
              >
                Book an Expert
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Inspection Details</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">What needs inspection?</label>
                  <textarea
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="E.g., Need structural integrity check for new roof, or material quality check."
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                  <textarea
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where is the site located?"
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all min-h-[80px]"
                  />
                </div>
              </div>

              {!token ? (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-4 text-amber-800 text-sm font-medium">
                  You must be logged in to submit a request. <Link to="/login" className="underline font-bold">Log in here</Link>.
                </div>
              ) : null}

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading || !token}
                  className="bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
