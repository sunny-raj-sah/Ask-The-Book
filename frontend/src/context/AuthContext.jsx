import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiRequest } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener(
      "auth:unauthorized",
      handleUnauthorized
    );

    const token = localStorage.getItem("accessToken");

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthLoading(false);
    } else {
      apiRequest("/api/auth/me")
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          setUser(null);
        })
        .finally(() => {
          setIsAuthLoading(false);
        });
    }

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("accessToken", data.token);
    setUser(data.user);

    return data;
  };

  const signup = async (name, email, password) => {
    const data = await apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    localStorage.setItem("accessToken", data.token);
    setUser(data.user);

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}