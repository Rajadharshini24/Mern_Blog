// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // 1️⃣ Load user from localStorage for instant UI render
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      // 2️⃣ Fetch fresh user from backend
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();
        const freshUser = res.data.user || res.data; // adjust depending on your API
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      } catch (err) {
        console.error("Auth fetch failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;