import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cuboid, ArrowRight, User } from 'lucide-react';

interface AuthScreenProps {
  onLogin: () => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col min-h-full pb-24 bg-zinc-950 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/40 via-zinc-950/80 to-zinc-950 pointer-events-none" />
      
      <div className="flex-1 flex flex-col justify-center px-8 relative z-10 pt-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-10 text-center"
        >
          <div className="w-16 h-16 bg-primary-500 rounded-[20px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20 rotate-3">
             <Cuboid size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-display font-medium text-white mb-2">BrickOurHouse</h1>
          <p className="text-zinc-400 text-sm font-medium">Build your vision, block by block.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 focus:border-primary-500 rounded-xl text-sm font-medium text-white outline-none transition-colors placeholder:text-zinc-600" 
                />
              </div>
            )}
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 focus:border-primary-500 rounded-xl text-sm font-medium text-white outline-none transition-colors placeholder:text-zinc-600" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 focus:border-primary-500 rounded-xl text-sm font-medium text-white outline-none transition-colors placeholder:text-zinc-600" 
              />
            </div>

            {!isLogin && (
               <div className="flex flex-col gap-1.5 mt-2">
                 <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">I am a</label>
                 <div className="flex gap-2">
                   <button className="flex-1 py-3 px-4 bg-primary-500 text-white border border-primary-500 rounded-xl text-xs font-bold transition-colors text-center">User / App</button>
                   <button className="flex-1 py-3 px-4 bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-bold transition-colors text-center">Worker</button>
                 </div>
               </div>
            )}

            <button 
              onClick={onLogin}
              className="w-full py-4 mt-6 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </AnimatePresence>

        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           transition={{ delay: 0.3 }}
           className="mt-8 text-center"
        >
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
