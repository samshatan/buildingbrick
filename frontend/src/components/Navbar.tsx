import { NavLink, Link } from "react-router-dom";
import { HiBars3BottomRight } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token, logout } = useAuth();
  const [photo, setPhoto] = useState<string | undefined>(undefined);

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
    { label: "Home", to: "/" },
    { label: "Find Workers", to: "/workers" },
    { label: "Find Jobs", to: "/requests" },
    { label: "Post Work", to: "/hire-request" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
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
            <button
              onClick={logout}
              className="text-xs text-gray-500 hover:text-red-600 font-bold border border-gray-200 px-3 py-1.5 rounded-full cursor-pointer hover:border-red-100 hover:bg-red-50/30 transition-all"
            >
              Logout
            </button>
          </div>
        )}
        <HiBars3BottomRight
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="w-6 h-6 cursor-pointer text-gray-700 hover:text-primary sm:hidden transition-colors"
        />
      </div>

      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-20 ${mobileMenuOpen ? "w-64" : "w-0"
          }`}
      >
        <div className="flex flex-col text-gray-800">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <HiBars3BottomRight className="h-4 rotate-180" />
            <p>Back</p>
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 pl-6 border-b"
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
          {!user ? (
            <>
              <NavLink
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 pl-6 border-b"
                to="/login"
              >
                Login
              </NavLink>
              <NavLink
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 pl-6 border-b"
                to="/signup"
              >
                Join as Worker
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 pl-6 border-b"
                to="/profile"
              >
                Profile Dashboard
              </NavLink>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="py-2 pl-6 border-b text-left text-red-650 hover:bg-red-50 font-bold border-none bg-transparent cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
