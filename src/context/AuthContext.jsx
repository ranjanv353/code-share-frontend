import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_IS_LOGGED_IN_KEY, AUTH_USER_KEY } from "../constants.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(AUTH_IS_LOGGED_IN_KEY) === "true";
  });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email, password) => {
    setIsLoggedIn(true);
    setUser({ email });
    localStorage.setItem(AUTH_IS_LOGGED_IN_KEY, "true");
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ email }));
    navigate("/dashboard");
  };

  const logout = () => {
  setIsLoggedIn(false);
  setUser(null);
  localStorage.clear(); 
  console.log("Logged out! Navigating to /");
  navigate('/');
};

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
