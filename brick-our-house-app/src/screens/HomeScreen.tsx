import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Building, PaintRoller, ShoppingCart } from 'lucide-react';

export default function HomeScreen({ onOpenStudio, onNavigate }: { onOpenStudio: () => void, onNavigate: (tab: string) => void }) {
  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Header section with an image and gradient mask */}
      <div className="relative h-72 w-full bg-zinc-900 rounded-b-[2rem] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
          alt="Modern House facade"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-medium text-white mb-2 leading-tight"
          >
            Build your dream<br />brick home.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-100 text-sm font-medium uppercase tracking-widest"
          >
            Riverside Estate Phase 2
          </motion.p>
        </div>
      </div>

      <div className="px-6 relative -mt-4">
        {/* Call to action card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 flex flex-col gap-5"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-500 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles size={12} /> New Feature
            </div>
            <h2 className="text-xl font-display font-medium text-zinc-700">Visualize with 3D Studio</h2>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              Design a custom brick facade in real-time. Change colors, styles, and trim instantly.
            </p>
          </div>
          <button 
            onClick={onOpenStudio}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-full py-4 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-between transition-colors shadow-lg shadow-primary-500/20"
          >
            Open 3D Studio
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>

      <div className="px-6 mt-8">
        <h3 className="text-xl font-display font-medium text-zinc-700 mb-4">Our Services</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Workers", icon: Building, color: "bg-zinc-50 border border-zinc-100 text-zinc-700", action: () => onNavigate('workers') },
            { title: "Projects", icon: PaintRoller, color: "bg-zinc-50 border border-zinc-100 text-zinc-700", action: () => onNavigate('projects') },
            { title: "Estimates", icon: Sparkles, color: "bg-zinc-50 border border-zinc-100 text-zinc-700", action: onOpenStudio },
            { title: "Materials", icon: ShoppingCart, color: "bg-zinc-50 border border-zinc-100 text-zinc-700", action: () => onNavigate('materials') }
          ].map((service, i) => (
             <motion.div 
               key={service.title}
               onClick={service.action}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 + (i * 0.1) }}
               className="bg-white rounded-[24px] p-5 shadow-sm border border-zinc-100 flex flex-col gap-4 cursor-pointer hover:bg-zinc-50 transition-colors"
             >
               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${service.color}`}>
                 <service.icon size={22} />
               </div>
               <span className="font-bold text-zinc-900 text-sm tracking-wide">{service.title}</span>
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
