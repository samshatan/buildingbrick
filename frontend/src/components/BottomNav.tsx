import React from 'react';
import { NavLink } from "react-router-dom";
import { Home, Search, Briefcase, User, ShoppingCart } from "lucide-react";

function BottomNav() {
  const navItems = [
    { label: "Home", to: "/", icon: <Home className="w-5 h-5 mb-1" /> },
    { label: "Workers", to: "/workers", icon: <Search className="w-5 h-5 mb-1" /> },
    { label: "Jobs", to: "/requests", icon: <Briefcase className="w-5 h-5 mb-1" /> },
    { label: "Materials", to: "/materials", icon: <ShoppingCart className="w-5 h-5 mb-1" /> },
    { label: "Profile", to: "/profile", icon: <User className="w-5 h-5 mb-1" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-50 pwa-bottom-nav">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(40);
            }}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default React.memo(BottomNav);
