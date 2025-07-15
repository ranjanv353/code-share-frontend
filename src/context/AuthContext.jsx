// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        setUser(user);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setUser(null);
        setIsLoggedIn(false);
      });
  }, []);

  const login = async (email, password) => {
    try {
      const user = await Auth.signIn(email, password);
      setUser(user);
      setIsLoggedIn(true);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const googleSignIn = () => Auth.federatedSignIn({ provider: "Google" });

  const signup = async (email, password, name) => {
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: { email, name },
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  const confirmSignUp = async (email, code) => {
    try {
      await Auth.confirmSignUp(email, code);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await Auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  const forgotPassword = async (email) => {
    return Auth.forgotPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        googleSignIn,
        signup,
        confirmSignUp,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
