import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  fullName: string;
  userType: "WORKER" | "HIRER" | "CAFE" | "ADMIN";
  avatarUrl?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  useEffect(() => {
    if (token && user) {
      
      // Auto-fetch the latest user data from backend to stay in sync
      fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Token invalid");
      })
      .then(freshUser => {
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      })
      .catch(() => {
        // If token invalid, logout
        logout();
      });
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
