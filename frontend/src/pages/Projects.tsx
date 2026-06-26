import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from "@/components/Title";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Briefcase, MapPin, ChevronRight, Clock, CheckCircle, FileText } from 'lucide-react';

function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error('Please login to view your projects.');
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/v1/jobs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          let jobsData = data.data || data.jobs || data || [];
          
          if (user?.userType !== 'ADMIN') {
            jobsData = jobsData.filter((j: any) => 
              j.workerId?._id === user?.id || 
              j.hirerUserId?._id === user?.id || 
              j.workerId === user?.id || 
              j.hirerUserId === user?.id
            );
          }

          const mappedProjects = jobsData.map((job: any) => {
            const isCompleted = job.status === 'COMPLETED';
            let timeline = [];
            
            if (job.status === 'REQUESTED') {
              timeline = [
                { date: "Start", label: "Job Requested", done: true },
                { date: "Next", label: "Awaiting Assignment", done: false },
                { date: "Final", label: "Job Completed", done: false }
              ];
            } else if (job.status === 'ACCEPTED') {
              timeline = [
                { date: "Contract", label: "Worker Assigned", done: true },
                { date: "Current", label: "Awaiting Start", done: false },
                { date: "Final", label: "Job Completed", done: false }
              ];
            } else if (job.status === 'ONGOING') {
              timeline = [
                { date: "Contract", label: "Worker Assigned", done: true },
                { date: "Current", label: "Work in Progress", done: true },
                { date: "Final", label: "Job Completed", done: false }
              ];
            } else {
              timeline = [
                { date: "Contract", label: "Worker Assigned", done: true },
                { date: "Current", label: "Work in Progress", done: true },
                { date: "Final", label: "Job Completed", done: true }
              ];
            }

            let imageUrl = null;
            if (job.requestId?.images && job.requestId.images.length > 0) {
              imageUrl = job.requestId.images[0];
            }

            return {
              id: job.id || job._id,
              title: job.requestId?.title || `Job Contract #${job._id?.substring(0, 5)}`,
              status: isCompleted ? "Completed" : "In Progress",
              image: imageUrl,
              location: job.requestId?.location || "Remote / Unspecified",
              completion: isCompleted ? 100 : (job.status === 'ONGOING' ? 50 : 10),
              description: `Agreed Rate: Rs ${job.agreedRate || 'Pending'}\n\n${job.requestId?.description || 'No description provided.'}`,
              timeline: timeline
            };
          });

          setProjects(mappedProjects);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [token, navigate, user]);

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedProject(null)}
            className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Back to Projects
          </button>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                  selectedProject.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {selectedProject.status}
                </span>
                <h1 className="text-3xl font-black text-gray-900 mt-4 mb-2">{selectedProject.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <MapPin className="w-4 h-4" /> {selectedProject.location}
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Details</h3>
              <p className="text-gray-600 font-medium whitespace-pre-wrap leading-relaxed">{selectedProject.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Project Timeline</h3>
              <div className="space-y-6">
                {selectedProject.timeline.map((step: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {step.done ? <CheckCircle className="w-5 h-5" /> : index + 1}
                      </div>
                      {index !== selectedProject.timeline.length - 1 && (
                        <div className={`w-0.5 h-full my-1 ${step.done ? 'bg-primary' : 'bg-gray-100'}`}></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{step.date}</p>
                      <p className={`text-lg font-bold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Title text1={"My"} text2={"PROJECTS"} />
          <p className="text-sm text-gray-500 font-medium mt-2">
            Track your ongoing and completed work assignments.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-500 font-medium">You don't have any active or completed projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedProject(project)}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-6">
                  <MapPin className="w-4 h-4" /> {project.location}
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progress</span>
                    <span className="text-xs font-bold text-gray-900">{project.completion}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${project.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                      style={{ width: `${project.completion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
