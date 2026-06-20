import { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";

const AuthContext = createContext();

// Custom hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking existing session

  // On app load, check localStorage for an existing session
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Persist user + token, update state
  const saveUserSession = (data) => {
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      profilePicture: data.profilePicture,
    };
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  // Login
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    saveUserSession(data);
    return data;
  };

  // Register
  const register = async (formData) => {
    const data = await authService.register(formData);
    saveUserSession(data);
    return data;
  };

  // Update profile (after editing in Profile page)
  const updateUser = (data) => {
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      profilePicture: data.profilePicture,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  // Logout — clear everything
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};