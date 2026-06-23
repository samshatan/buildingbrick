import { Home, Cuboid, FolderOpen, Users, User, ShoppingCart } from 'lucide-react';
import type { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs: { id: Tab; icon: any; label: string }[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'studio', icon: Cuboid, label: 'Studio' },
    { id: 'materials', icon: ShoppingCart, label: 'Materials' },
    { id: 'workers', icon: Users, label: 'Workers' },
    { id: 'projects', icon: FolderOpen, label: 'Projects' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 bg-white/90 backdrop-blur-xl border-t border-zinc-100 flex items-center justify-around px-2 sm:px-6 z-50 rounded-b-[inherit]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="group flex flex-col items-center justify-center gap-1 sm:gap-1.5 w-12 sm:w-16"
          >
            <div
              className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-zinc-400 group-hover:text-zinc-600 group-hover:bg-zinc-50'
              }`}
            >
              <Icon size={20} className="sm:w-6 sm:h-6" strokeWidth={isActive ? 2 : 1.5} />
            </div>
            <span
              className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                isActive ? 'text-primary-500' : 'text-zinc-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
