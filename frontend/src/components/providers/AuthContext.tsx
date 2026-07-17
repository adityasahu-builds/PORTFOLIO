"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "editor";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Call `/me` on load to restore session if cookies exist
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/auth/me");
      if (res.data?.success && res.data?.data?.user) {
        setUser(res.data.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      // Clean tokens locally
      localStorage.removeItem("accessToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { usernameOrEmail, password });
      
      if (res.data?.success && res.data?.data) {
        const { user: loggedInUser, accessToken } = res.data.data;
        setUser(loggedInUser);
        localStorage.setItem("accessToken", accessToken);
        router.push("/admin/dashboard");
      } else {
        throw new Error(res.data?.message || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to log in.";
      setUser(null);
      localStorage.removeItem("accessToken");
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("accessToken");
      setIsLoading(false);
      router.push("/admin/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
