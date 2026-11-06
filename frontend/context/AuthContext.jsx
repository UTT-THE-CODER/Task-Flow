import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // If a token exists, ask the backend who the user is
  useEffect(() => {
    async function loadUser() {
      if (localStorage.getItem("token")) {
        try {
          const res = await getMe();
          setUser(res.data.user || res.data);
        } catch {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function login(email, password) {
    const res = await loginUser({ email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
