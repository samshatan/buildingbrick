/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import StudioScreen from './screens/StudioScreen';
import MaterialsScreen from './screens/MaterialsScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import ProfileScreen from './screens/ProfileScreen';
import WorkersScreen from './screens/WorkersScreen';
import AuthScreen from './screens/AuthScreen';
import type { Tab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen key="home" onOpenStudio={() => setActiveTab('studio')} onNavigate={(tab) => setActiveTab(tab as Tab)} />;
      case 'studio': return <StudioScreen key="studio" />;
      case 'materials': return <MaterialsScreen key="materials" />;
      case 'workers': return <WorkersScreen key="workers" />;
      case 'projects': return <ProjectsScreen key="projects" />;
      case 'profile': return isAuthenticated ? <ProfileScreen key="profile" onLogout={() => setIsAuthenticated(false)} /> : <AuthScreen key="auth" onLogin={() => setIsAuthenticated(true)} />;
      default: return <HomeScreen key="default" onOpenStudio={() => setActiveTab('studio')} onNavigate={(tab) => setActiveTab(tab as Tab)} />;
    }
  };

  return (
    <div className="w-full flex justify-center min-h-screen items-center sm:p-4 md:p-8 bg-zinc-950">
      <div className="w-full h-screen sm:max-w-[400px] sm:h-[844px] bg-zinc-50 sm:rounded-[3rem] shadow-2xl relative overflow-hidden ring-4 ring-zinc-800">
        <div className="absolute inset-0 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto no-scrollbar"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
          <BottomNav activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
