import { motion, AnimatePresence } from 'motion/react';
import { Settings, HelpCircle, Bell, ChevronRight, LogOut, Shield, Briefcase, User as UserIcon, Store, ChevronLeft, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { Role } from '../types';

interface ProfileScreenProps {
  onLogout: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const [role, setRole] = useState<Role>('user');
  const [activePage, setActivePage] = useState<string | null>(null);
  const [activeNotificationTab, setActiveNotificationTab] = useState<'All' | 'Projects' | 'Messages'>('All');

  const getRoleIcon = () => {
    switch(role) {
      case 'admin': return <Shield size={16} />;
      case 'cafe_owner': return <Store size={16} />;
      case 'worker': return <Briefcase size={16} />;
      default: return <UserIcon size={16} />;
    }
  };

  const getRoleMenuItems = () => {
    const common = [
      { icon: Bell, label: "Notifications" },
      { icon: Settings, label: "Settings" },
      { icon: HelpCircle, label: "Help & Support" },
    ];

    switch(role) {
      case 'admin':
        return [
          { icon: Shield, label: "Platform Moderation" },
          { icon: Briefcase, label: "Manage Roles" },
          ...common
        ];
      case 'cafe_owner':
        return [
          { icon: Briefcase, label: "My Job Postings" },
          { icon: Store, label: "My Business Profile" },
          ...common
        ];
      case 'worker':
        return [
          { icon: Briefcase, label: "My Jobs & Earnings" },
          ...common
        ];
      default:
        return [
          { icon: Store, label: "Saved Workers" },
          ...common
        ];
    }
  };

  const menuItems = getRoleMenuItems();

  const renderSubPage = () => {
    let content = (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
          <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
            <Settings size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-wide mb-1">Coming Soon</h3>
            <p className="text-sm font-medium text-zinc-500">The {activePage} section is currently under development.</p>
          </div>
      </div>
    );

    if (activePage === "Settings") {
       content = (
         <div className="flex flex-col gap-6">
           {['Push Notifications', 'Email Alerts', 'Dark Mode', 'Biometric Login'].map((setting, i) => (
             <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
               <span className="font-bold text-zinc-700 text-sm tracking-wide">{setting}</span>
               <div className={`w-12 h-6 rounded-full flex items-center p-1 ${i === 2 ? 'bg-zinc-200' : 'bg-primary-500'}`}>
                 <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${i === 2 ? 'translate-x-0' : 'translate-x-6'}`} />
               </div>
             </div>
           ))}
         </div>
       );
    } else if (activePage === "Saved Workers") {
       content = (
          <div className="flex flex-col gap-4">
             {[1,2].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 border border-zinc-100 rounded-[24px] bg-zinc-50 shadow-sm">
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                    <img src={`https://images.unsplash.com/photo-${i === 1 ? '1507003211169-0a1dd7228f2d' : '1573496359142-b8d87734a5a2'}?auto=format&fit=crop&w=150&q=80`} alt="Worker" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h4 className="font-bold text-zinc-900 text-sm tracking-wide">{i === 1 ? 'Marcus Johnson' : 'Sarah Chen'}</h4>
                     <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mt-0.5">{i === 1 ? 'Master Mason' : 'Contractor'}</p>
                  </div>
                </div>
             ))}
          </div>
       );
    } else if (activePage === "Notifications") {
       let notifs = [];
       if (activeNotificationTab === 'All' || activeNotificationTab === 'Projects') {
         notifs.push(
           <div key="n1" className="p-5 border border-primary-100 bg-primary-50 rounded-[24px] shadow-sm relative overflow-hidden flex gap-4">
             <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
               <AlertCircle size={18} className="text-primary-600" />
             </div>
             <div>
               <h4 className="font-bold text-primary-900 text-sm tracking-wide mb-1">Project Updated</h4>
               <p className="text-xs text-primary-700 font-medium">Your project "Riverside Estate" remodeling was marked as ongoing by Sarah Chen.</p>
               <span className="text-[10px] font-bold text-primary-400 mt-2 block">10 MINS AGO</span>
             </div>
           </div>
         );
         notifs.push(
           <div key="n2" className="p-5 border border-zinc-100 bg-white rounded-[24px] shadow-sm flex gap-4">
             <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
               <CheckCircle2 size={18} className="text-emerald-500" />
             </div>
             <div>
               <h4 className="font-bold text-zinc-900 text-sm tracking-wide mb-1">Phase Complete</h4>
               <p className="text-xs text-zinc-500 font-medium">Foundation work for "Oak Park Cafe" has been signed off.</p>
               <span className="text-[10px] font-bold text-zinc-400 mt-2 block">2 HOURS AGO</span>
             </div>
           </div>
         );
       }
       
       if (activeNotificationTab === 'All' || activeNotificationTab === 'Messages') {
         notifs.push(
           <div key="n3" className="p-5 border border-zinc-100 bg-white rounded-[24px] shadow-sm flex gap-4">
             <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
               <MessageSquare size={18} className="text-zinc-500" />
             </div>
             <div>
               <h4 className="font-bold text-zinc-900 text-sm tracking-wide mb-1">New Message from Marcus</h4>
               <p className="text-xs text-zinc-500 font-medium">"I've attached the final estimate for the brickwork we discussed."</p>
               <span className="text-[10px] font-bold text-zinc-400 mt-2 block">1 DAY AGO</span>
             </div>
           </div>
         );
       }

       content = (
          <div className="flex flex-col -mx-6 px-6 h-full">
            <div className="flex gap-2 pb-4 mb-4 border-b border-zinc-100">
              {['All', 'Projects', 'Messages'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveNotificationTab(tab as any)}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    activeNotificationTab === tab 
                      ? "bg-zinc-800 text-white" 
                      : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 pb-8">
               {notifs}
               {notifs.length === 0 && (
                 <div className="text-center py-8 text-zinc-500 text-sm">No new notifications.</div>
               )}
            </div>
          </div>
       );
    } else if (activePage === "Help & Support") {
       content = (
          <div className="flex flex-col gap-6">
             <div className="flex flex-col gap-2">
               <h4 className="font-bold text-zinc-900 tracking-wide text-sm">Frequently Asked Questions</h4>
               {["How do I reset my password?", "How do I contact a worker?", "What are the payment terms?"].map((q, i) => (
                 <div key={i} className="p-4 border border-zinc-100 rounded-2xl bg-zinc-50 flex justify-between items-center cursor-pointer hover:bg-zinc-100 transition-colors">
                   <span className="font-bold text-zinc-700 text-xs">{q}</span>
                   <ChevronRight size={16} className="text-zinc-400" />
                 </div>
               ))}
             </div>
             <button className="w-full py-4 mt-4 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors shadow-lg shadow-primary-500/20">
               Contact Support
             </button>
          </div>
       );
    } else if (activePage === "Platform Moderation") {
       content = (
          <div className="flex flex-col gap-4">
             {[
               { target: "John Doe (Worker)", reason: "Inappropriate communication", status: "Pending Review" },
               { target: "River Cafe (Business)", reason: "Spam postings", status: "Action Required" }
             ].map((report, i) => (
                <div key={i} className="flex flex-col gap-3 p-4 border border-zinc-100 rounded-[24px] bg-zinc-50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-red-400"></div>
                  <div>
                     <h4 className="font-bold text-zinc-900 text-sm tracking-wide">{report.target}</h4>
                     <p className="text-xs text-zinc-500 font-medium mt-1">Reason: {report.reason}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-red-100">{report.status}</span>
                    <button className="ml-auto px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors">Review</button>
                  </div>
                </div>
             ))}
          </div>
       );
    } else if (activePage === "Manage Roles") {
       content = (
          <div className="flex flex-col gap-4">
             <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-full flex items-center mb-2">
                <input type="text" placeholder="Search users by email..." className="bg-transparent outline-none flex-1 px-2 text-sm font-medium text-zinc-700 placeholder:text-zinc-400" />
             </div>
             {[ { name: "Emily Stone", current: "Worker" }, { name: "Mike's Cafe", current: "User" } ].map((u, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-zinc-100 rounded-[24px] shadow-sm">
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm tracking-wide">{u.name}</h4>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Role: {u.current}</p>
                  </div>
                  <button className="px-3 py-1.5 border border-primary-200 text-primary-600 text-[10px] font-bold uppercase tracking-wider rounded-full hover:bg-primary-50 transition-colors">Change Role</button>
                </div>
             ))}
          </div>
       );
    } else if (activePage === "My Job Postings") {
       content = (
          <div className="flex flex-col gap-4">
             <button className="w-full py-4 mb-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors shadow-lg shadow-primary-500/20">
               + Create New Job
             </button>
             {[ { title: "Barista Wanted", type: "Full-Time", applicants: 12, active: true }, { title: "Masonry Repair", type: "Contract", applicants: 0, active: true } ].map((job, i) => (
                <div key={i} className="p-5 border border-zinc-100 rounded-[24px] shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                     <h4 className="font-bold text-zinc-900 text-lg tracking-wide">{job.title}</h4>
                     <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md ${job.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-zinc-100 text-zinc-500'}`}>{job.active ? 'Active' : 'Closed'}</span>
                  </div>
                  <div className="text-xs text-zinc-500 font-medium">{job.type}</div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                     <span className="text-xs font-bold text-primary-500">{job.applicants} Applicants</span>
                     <button className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-900 transition-colors">Manage</button>
                  </div>
                </div>
             ))}
          </div>
       );
    } else if (activePage === "My Business Profile") {
       content = (
          <div className="flex flex-col gap-4">
             <div className="w-24 h-24 rounded-[32px] bg-zinc-100 mx-auto flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-zinc-100 mb-2 overflow-hidden">
                <Store size={32} className="text-zinc-400" />
             </div>
             
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Business Name</label>
               <input type="text" defaultValue="Riverside Cafe" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-primary-500 transition-colors" />
             </div>
             
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Location</label>
               <input type="text" defaultValue="Chicago, IL" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-primary-500 transition-colors" />
             </div>

             <button className="w-full py-4 mt-6 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors shadow-lg shadow-zinc-900/20">
               Save Changes
             </button>
          </div>
       );
    } else if (activePage === "My Jobs & Earnings") {
       content = (
          <div className="flex flex-col gap-6">
             <div className="bg-primary-50 border border-primary-100 rounded-[32px] p-6 text-center">
                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">Total Earnings (This Month)</p>
                <h3 className="text-4xl font-display font-medium text-primary-900">$1,240.00</h3>
             </div>
             
             <div>
                <h4 className="font-bold text-zinc-900 tracking-wide text-sm mb-3 ml-1">Recent Jobs</h4>
                <div className="flex flex-col gap-3">
                   {[ { name: "Cafe Remodel Prep", amount: 450, date: "Oct 12, 2023" }, { name: "Brick Cleaning", amount: 200, date: "Oct 8, 2023" } ].map((j, i) => (
                      <div key={i} className="p-4 border border-zinc-100 rounded-[24px] bg-white shadow-sm flex items-center justify-between">
                         <div>
                            <h5 className="font-bold text-zinc-900 text-sm tracking-wide">{j.name}</h5>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{j.date}</p>
                         </div>
                         <div className="text-right">
                            <span className="font-display font-medium text-lg text-emerald-600">+${j.amount}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       );
    }

    return (
      <div className="flex flex-col h-full px-6 pt-12 pb-24 relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button 
            onClick={() => setActivePage(null)}
            className="w-12 h-12 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-700 hover:bg-zinc-50 transition-colors shrink-0"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-display font-medium text-zinc-700 truncate">
            {activePage}
          </h1>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 flex-1 overflow-y-auto custom-scrollbar"
        >
          {content}
        </motion.div>
      </div>
    );
  };

  if (activePage) {
    return renderSubPage();
  }

  return (
    <div className="flex flex-col min-h-full px-6 pt-12 pb-24">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-end mb-8"
      >
        <h1 className="text-4xl font-display font-medium text-zinc-700">
          Profile
        </h1>
        
        {/* Role Switcher for Demo */}
        <div className="bg-white rounded-full p-1 border border-zinc-200 shadow-sm flex text-[10px] font-bold uppercase tracking-wider">
          <button onClick={() => setRole('user')} className={`px-2 py-1 rounded-full ${role === 'user' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-50'}`}>User</button>
          <button onClick={() => setRole('worker')} className={`px-2 py-1 rounded-full ${role === 'worker' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-50'}`}>Worker</button>
          <button onClick={() => setRole('cafe_owner')} className={`px-2 py-1 rounded-full ${role === 'cafe_owner' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-50'}`}>Owner</button>
          <button onClick={() => setRole('admin')} className={`px-2 py-1 rounded-full ${role === 'admin' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-50'}`}>Admin</button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 flex items-center gap-5 mb-8"
      >
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-display font-medium text-3xl uppercase relative overflow-hidden ring-4 ring-white shadow-sm border border-zinc-100 shrink-0">
           <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-zinc-900 tracking-wide truncate">Emily Stone</h2>
          <p className="text-sm font-medium text-zinc-500 mt-0.5 truncate">emily.stone@example.com</p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-2">
            {getRoleIcon()}
            {role.replace('_', ' ')}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[32px] p-3 shadow-sm border border-zinc-100 mb-6"
      >
        {menuItems.map((item, index) => (
          <div 
            key={item.label}
            onClick={() => setActivePage(item.label)}
            className={`flex flex-row items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-zinc-100' : ''}`}
          >
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-700">
                  <item.icon size={22} />
               </div>
               <span className="font-bold text-zinc-900 tracking-wide text-sm">{item.label}</span>
             </div>
             <ChevronRight size={20} className="text-zinc-300" />
          </div>
        ))}
      </motion.div>

      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onLogout}
        className="mt-4 flex items-center justify-center gap-2 bg-transparent text-primary-500 border-2 border-primary-100 rounded-full py-4 font-bold active:bg-primary-50 text-xs uppercase tracking-widest transition-colors shadow-sm"
      >
        <LogOut size={16} /> Log Out
      </motion.button>
    </div>
  );
}
