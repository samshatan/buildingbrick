import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, CheckCircle2, ChevronLeft, Calendar, FileText, Camera } from 'lucide-react';

export default function ProjectsScreen() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: "Lincoln Park Exterior",
      status: "In Progress",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      location: "Chicago, IL",
      completion: 65,
      description: "Full exterior remasonry and window trim repair using classic Chicago Common brick.",
      timeline: [
        { date: "Oct 12", label: "Foundation Check", done: true },
        { date: "Oct 20", label: "Brick Delivery", done: true },
        { date: "Nov 02", label: "Masonry Work", done: false },
        { date: "Nov 15", label: "Final Inspection", done: false }
      ]
    },
    {
      id: 2,
      title: "Heritage Brick Resurfacing",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      location: "Evanston, IL",
      completion: 100,
      description: "Restoration of 1920s heritage facade and tuckpointing.",
      timeline: []
    },
    {
      id: 3,
      title: "Modern Facade Update",
      status: "Planning",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
      location: "Oak Park, IL",
      completion: 15,
      description: "Updating the front facade with modern dark brick and large windows.",
      timeline: []
    }
  ];

  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return null;

    return (
      <div className="flex flex-col h-full bg-zinc-50 relative pb-24">
        <div className="h-56 bg-zinc-200 relative">
           <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent opacity-80" />
           <button 
             onClick={() => setSelectedProject(null)}
             className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"
           >
             <ChevronLeft size={24} />
           </button>
           <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-400 mb-2">
                 <MapPin size={12} /> {project.location}
              </div>
              <h1 className="text-3xl font-display font-medium text-white leading-tight mb-2">{project.title}</h1>
           </div>
        </div>

        <div className="flex-1 px-6 pt-6 flex flex-col gap-6 relative bg-zinc-50 rounded-t-[24px] -mt-4">
           {/* Progress Widget */}
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-100">
             <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-zinc-900 text-sm">{project.status}</span>
                <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">{project.completion}%</span>
             </div>
             <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${project.completion === 100 ? 'bg-zinc-900' : 'bg-primary-500'}`} style={{ width: `${project.completion}%` }} />
             </div>
           </div>

           {/* Tabs / Actions */}
           <div className="grid grid-cols-3 gap-2">
             <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-zinc-100 text-zinc-500 hover:text-primary-500 hover:border-primary-100 transition-colors">
               <FileText size={20} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Docs</span>
             </button>
             <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-zinc-100 text-zinc-500 hover:text-primary-500 hover:border-primary-100 transition-colors">
               <Camera size={20} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Photos</span>
             </button>
             <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-zinc-100 text-zinc-500 hover:text-primary-500 hover:border-primary-100 transition-colors">
               <Calendar size={20} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Schedule</span>
             </button>
           </div>

           {/* Timeline */}
           {project.timeline.length > 0 && (
             <div>
                <h3 className="text-sm font-bold text-zinc-900 tracking-wide mb-4">Project Timeline</h3>
                <div className="flex flex-col px-2">
                  {project.timeline.map((step, i) => (
                    <div key={i} className="flex gap-4 relative pb-6 last:pb-0">
                       {i !== project.timeline.length - 1 && (
                         <div className={`absolute top-6 left-[11px] w-[2px] h-full -ml-[1px] ${step.done ? 'bg-primary-500' : 'bg-zinc-200'}`} />
                       )}
                       <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${step.done ? 'bg-primary-500 border-primary-500 text-white' : 'bg-zinc-50 border-zinc-200'}`}>
                         {step.done && <CheckCircle2 size={12} />}
                       </div>
                       <div className="-mt-0.5">
                         <h4 className={`text-sm font-bold ${step.done ? 'text-zinc-900' : 'text-zinc-400'}`}>{step.label}</h4>
                         <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{step.date}</span>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full px-6 pt-12 pb-24">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-display font-medium text-zinc-700 mb-2"
      >
        Projects
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-zinc-500 mb-8 font-bold text-xs uppercase tracking-widest"
      >
        Track your remodeling progress
      </motion.p>
      
      <div className="flex flex-col gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            onClick={() => setSelectedProject(project.id)}
            className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 flex flex-col gap-5 relative overflow-hidden cursor-pointer hover:border-zinc-200 transition-colors"
          >
            {/* Project Image */}
            <div className="w-full h-48 rounded-[24px] overflow-hidden relative">
               <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
                 {project.status === "Completed" ? (
                   <><CheckCircle2 size={14} className="text-zinc-900"/> Completed</>
                 ) : (
                   <><Clock size={14} className={project.status === "Planning" ? "text-zinc-500" : "text-primary-500"}/> {project.status}</>
                 )}
               </div>
            </div>

            {/* Project Details */}
            <div>
               <h3 className="text-xl font-display font-medium text-zinc-900 mb-2">{project.title}</h3>
               <div className="flex items-center text-sm font-medium text-zinc-500 gap-1.5 mb-6">
                 <MapPin size={14} />
                 {project.location}
               </div>

               {/* Progress Bar */}
               <div className="flex flex-col gap-3">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-700">
                    <span>Progress</span>
                    <span>{project.completion}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${project.completion}%` }}
                      transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                      className={`h-full rounded-full ${project.completion === 100 ? 'bg-zinc-900' : 'bg-primary-500'}`}
                    />
                 </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
