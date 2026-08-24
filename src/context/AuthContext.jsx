import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import authApi from "@/api/authApi";
import { AUTH_STORAGE_KEY, onSessionExpired } from "@/api/axiosClient";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);
  const [initializing, setInitializing] = useState(true);
  const toast = useToast();

  // Persist to localStorage whenever auth changes.
  useEffect(() => {
    if (auth) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [auth]);

  // Refresh profile once on load so role/name are current, and to confirm
  // a stored token is still valid.
  useEffect(() => {
    let cancelled = false;
    async function verify() {
      if (!auth?.token) {
        setInitializing(false);
        return;
      }
      try {
        const profile = await authApi.getProfile();
        if (!cancelled) {
          setAuth((prev) => (prev ? { ...prev, ...profile } : prev));
        }
      } catch {
        // interceptor already clears storage on 401; local state follows
        if (!cancelled) setAuth(null);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }
    verify();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global 401 handler: clear session and let the router's ProtectedRoute
  // send the user to /login.
  useEffect(() => {
    return onSessionExpired(() => {
      setAuth(null);
      toast.info("Your session has expired. Please log in again.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    // Expected shape: { userId, firstName, email, role, token }
    setAuth(data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    return authApi.register(payload);
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
  }, []);

  const updateLocalUser = useCallback((partial) => {
    setAuth((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(auth?.token),
      userId: auth?.userId ?? null,
      firstName: auth?.firstName ?? null,
      email: auth?.email ?? null,
      role: auth?.role ?? null,
      token: auth?.token ?? null,
      initializing,
      login,
      register,
      logout,
      updateLocalUser,
    }),
    [auth, initializing, login, register, logout, updateLocalUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
