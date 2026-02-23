import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("tb_session") || "null");
    if (session?.accessToken) {
      setUser(session.user);
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem("tb_session", JSON.stringify(data));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("tb_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
