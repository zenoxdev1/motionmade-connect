import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  instrument?: string;
  provider: "email" | "google";
  createdAt: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  instrument?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API endpoints
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Check if backend is available
let BACKEND_AVAILABLE = false;

// Test backend availability
const testBackend = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    BACKEND_AVAILABLE = response.ok;
    console.log("Backend availability:", BACKEND_AVAILABLE);
  } catch (error) {
    BACKEND_AVAILABLE = false;
    console.log("Backend not available, using local mode");
  }
};
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            setUser(user);
            console.log("✅ Restored user session:", user);
          } catch (error) {
            console.error("Error parsing stored user data:", error);
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (data: SignUpData): Promise<void> => {
    setLoading(true);
    try {
      console.log("Sign up attempt:", { ...data, password: "***" });

      // Always use local storage for now to avoid network issues
      const mockUser: User = {
        id: "user_" + Date.now(),
        email: data.email,
        fullName: data.fullName,
        instrument: data.instrument,
        provider: "email",
        createdAt: new Date().toISOString(),
      };

      const token = "local_token_" + Date.now();

      // Store user data in localStorage for persistence
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(mockUser));

      // Store in list of all users for later sign in
      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      allUsers.push(mockUser);
      localStorage.setItem("allUsers", JSON.stringify(allUsers));

      setUser(mockUser);
      console.log("✅ Sign up successful:", mockUser);
    } catch (error) {
      console.error("❌ Sign up error:", error);
      throw new Error("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      console.log("Sign in attempt:", { email, password: "***" });

      // Check demo credentials first
      if (email === "demo@motionconnect.com" && password === "password123") {
        const demoUser: User = {
          id: "demo_user",
          email: "demo@motionconnect.com",
          fullName: "Demo User",
          instrument: "guitar",
          provider: "email",
          createdAt: "2024-01-01T00:00:00Z",
        };

        const token = "demo_token_" + Date.now();
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(demoUser));
        setUser(demoUser);
        console.log("✅ Demo sign in successful:", demoUser);
        return;
      }

      // Check if user exists in localStorage (from previous signup)
      const savedUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const existingUser = savedUsers.find((u: any) => u.email === email);

      if (existingUser) {
        // For simplicity, accept any password for saved users in demo mode
        const token = "local_token_" + Date.now();
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(existingUser));
        setUser(existingUser);
        console.log("✅ Local sign in successful:", existingUser);
        return;
      }

      // If no match found
      throw new Error(
        "Invalid email or password. Try demo credentials: demo@motionconnect.com / password123",
      );
    } catch (error) {
      console.error("❌ Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log("Google sign in - using local simulation");

      // Simulate Google OAuth success with a mock user
      const googleUser: User = {
        id: "google_" + Date.now(),
        email: "google.user@gmail.com",
        fullName: "Google User",
        avatar: "https://via.placeholder.com/40",
        provider: "google",
        createdAt: new Date().toISOString(),
      };

      const token = "google_token_" + Date.now();
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(googleUser));
      setUser(googleUser);

      console.log("✅ Google sign in successful:", googleUser);
    } catch (error) {
      console.error("❌ Google sign in error:", error);
      throw new Error("Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setUser(null);
      console.log("✅ Sign out successful");
    } catch (error) {
      console.error("❌ Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Extend Window interface for Google OAuth
declare global {
  interface Window {
    google?: any;
  }
}
