import React, { createContext, useContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Helper to save Cognito access token & id token in localStorage
  const saveTokens = async () => {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const idToken = session.getIdToken().getJwtToken();
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("idToken", idToken);
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("idToken");
    }
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(async (user) => {
        setUser(user);
        setIsLoggedIn(true);
        await saveTokens();
      })
      .catch(() => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("idToken");
      });
  }, []);

  const login = async (email, password) => {
    try {
      const user = await Auth.signIn(email, password);
      setUser(user);
      setIsLoggedIn(true);
      await saveTokens();
      return user;
    } catch (error) {
      throw error;
    }
  };

  const googleSignIn = async () => {
    await Auth.federatedSignIn({ provider: "Google" });
    await saveTokens();
  };

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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
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
