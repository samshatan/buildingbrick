import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { 
  HiBars3BottomRight, 
  HiXMark,
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlinePlusCircle,
  HiOutlineInformationCircle,
  HiOutlineEnvelope,
  HiOutlineUser,
  HiMagnifyingGlass,
  HiOutlineShoppingCart
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token } = useAuth();
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      (document.activeElement as HTMLElement)?.blur();
      navigate(`/workers?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (user && user.userType === "WORKER") {
      fetch(`/api/v1/workers/user/${user.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Worker profile not found");
          return res.json();
        })
        .then((data) => {
          if (data && data.photo) {
            setPhoto(data.photo);
          } else {
            setPhoto(undefined);
          }
        })
        .catch((err) => {
          console.warn("Could not retrieve navbar worker profile photo:", err.message);
          setPhoto(undefined);
        });
    } else {
      setPhoto(undefined);
    }
  }, [user, token]);

  const navItems = [
    { label: "Home", to: "/", icon: HiOutlineHome },
    { label: "Find Workers", to: "/workers", icon: HiOutlineUsers },
    { label: "Find Jobs", to: "/requests", icon: HiOutlineBriefcase },
    { label: "Post Work", to: "/hire-request", icon: HiOutlinePlusCircle },
    { label: "Materials", to: "/materials", icon: HiOutlineShoppingCart },
    { label: "About", to: "/about", icon: HiOutlineInformationCircle },
    { label: "Contact", to: "/contact", icon: HiOutlineEnvelope },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between font-medium bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <img src="/logo.jpg" alt="BrickOurHouse Logo" className="h-12 sm:h-14 w-auto object-contain rounded-full shadow-sm" />
        <span className="font-extrabold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
          BrickOurHouse
        </span>
      </Link>

      <nav className="hidden sm:flex gap-8 text-sm text-gray-600">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <p className="font-semibold">{item.label}</p>
            <hr className="w-3/4 border-none h-[2px] rounded-full bg-primary hidden" />
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-primary text-sm font-semibold transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="hidden sm:inline-flex bg-gradient-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all hover:scale-105 duration-200 cursor-pointer"
            >
              Join as Worker
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <NotificationBell />
            <Link to="/profile" className="relative transition-all hover:scale-105 duration-200">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary bg-primary-50 flex items-center justify-center shadow-sm">
                {photo ? (
                  <img src={photo} alt={user?.fullName || (user as any)?.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-extrabold text-primary uppercase">
                    {(user?.fullName || (user as any)?.name || "User").charAt(0)}
                  </span>
                )}
              </div>
            </Link>
          </div>
        )}
        <HiBars3BottomRight
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="w-6 h-6 cursor-pointer text-gray-700 hover:text-primary sm:hidden transition-colors"
        />
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 h-screen overflow-hidden bg-white transition-all duration-300 z-50 shadow-2xl flex flex-col ${mobileMenuOpen ? "w-[85vw] max-w-[320px]" : "w-0"
          }`}
      >
        <div className="flex flex-col h-full min-w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
              <img src="/logo.jpg" alt="BrickOurHouse" className="h-10 w-auto rounded-full shadow-sm" />
              <span className="font-extrabold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BrickOurHouse
              </span>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <HiMagnifyingGlass className="absolute left-3 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for workers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-400"
              />
            </form>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-primary-50 flex items-center justify-center shadow-sm">
                  {photo ? (
                    <img src={photo} alt={user?.fullName || (user as any)?.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-extrabold text-primary uppercase">
                      {(user?.fullName || (user as any)?.name || "User").charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 truncate max-w-[180px]">
                    {user?.fullName || (user as any)?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-500 capitalize font-medium">
                    {user.userType?.toLowerCase() || 'Member'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                to={item.to}
              >
                <item.icon className="w-5 h-5 opacity-80" />
                {item.label}
              </NavLink>
            ))}
            
            {user && (
              <NavLink
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all mt-2 ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                to="/profile"
              >
                <HiOutlineUser className="w-5 h-5 opacity-80" />
                Profile Dashboard
              </NavLink>
            )}
          </div>

          {/* Footer Actions */}
          {!user && (
            <div className="p-5 border-t border-gray-100 bg-white">
              <div className="flex flex-col gap-3">
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  to="/signup"
                  className="w-full text-center py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Join as Worker
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default React.memo(Navbar);
