import { useState, useEffect } from 'react';
import Title from "@/components/Title";
import { Briefcase, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/v1/jobs/my-jobs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setJobs(data.data || data.jobs || data || []);
        }
      } catch (error) {
        console.error('Error fetching jobs', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchJobs();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'completed': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Title text1={"Active"} text2={"CONTRACTS"} />
          <p className="text-sm text-gray-500 font-medium mt-2">
            Manage your active contracts and completed jobs.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Contracts</h3>
            <p className="text-gray-500 font-medium">You don't have any active jobs yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, index) => {
              const jobTitle = job.title || job.requestId?.title || `Job Request #${job._id?.substring(0,5) || index + 1}`;
              const status = job.status || 'Pending';
              const date = job.date || job.createdAt?.substring(0, 10) || 'Just now';
              
              return (
                <div key={job._id || index} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{jobTitle}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {date}</span>
                        <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.category || 'General'}</span>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${getStatusColor(status)}`}>
                      {status}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-5 border-t border-gray-50 gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Budget / Rate</p>
                        <p className="text-lg font-black text-gray-900">${job.amount || job.agreedRate || job.totalPrice || 'Negotiable'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      {status?.toLowerCase() === 'ongoing' && (
                        <button className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                          Complete Job
                        </button>
                      )}
                      <button className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;
