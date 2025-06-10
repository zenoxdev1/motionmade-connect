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
        if (token) {
          // Validate token and get user data
          const userData = await validateToken(token);
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem("authToken");
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
      console.log("Attempting sign up with:", { ...data, password: "***" });
      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log("Sign up response:", result);

      if (result.success) {
        const { user: userData, token } = result.data;
        localStorage.setItem("authToken", token);
        setUser(userData);
        console.log("Sign up successful, user set:", userData);
      } else {
        console.error("Sign up failed:", result.error);
        throw new Error(result.error || "Signup failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      console.log("Attempting sign in with:", { email, password: "***" });
      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("Sign in response:", result);

      if (result.success) {
        const { user: userData, token } = result.data;
        localStorage.setItem("authToken", token);
        setUser(userData);
        console.log("Sign in successful, user set:", userData);
      } else {
        console.error("Sign in failed:", result.error);
        throw new Error(result.error || "Sign in failed");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      // Initialize Google OAuth
      if (typeof window !== "undefined" && window.google) {
        const google = window.google;

        // Configure Google OAuth
        google.accounts.id.initialize({
          client_id:
            import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id",
          callback: async (response: any) => {
            try {
              // Send the credential to your backend
              const apiResponse = await fetch(`${API_BASE_URL}/auth/google`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ credential: response.credential }),
              });

              const authResponse = await apiResponse.json();

              if (authResponse.success) {
                const { user: userData, token } = authResponse.data;
                localStorage.setItem("authToken", token);
                setUser(userData);
              } else {
                throw new Error(authResponse.error || "Google sign in failed");
              }
            } catch (error) {
              console.error("Google sign in error:", error);
              throw error;
            } finally {
              setLoading(false);
            }
          },
        });

        // Prompt the user to select an account
        google.accounts.id.prompt();
      } else {
        // Fallback for when Google SDK is not loaded
        const mockGoogleUser = {
          id: "google_" + Date.now(),
          email: "user@gmail.com",
          fullName: "Google User",
          avatar: "https://via.placeholder.com/40",
          provider: "google" as const,
          createdAt: new Date().toISOString(),
        };

        const token = "mock_google_token_" + Date.now();
        localStorage.setItem("authToken", token);
        setUser(mockGoogleUser);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      localStorage.removeItem("authToken");
      setUser(null);

      // Sign out from Google if applicable
      if (typeof window !== "undefined" && window.google) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (error) {
      console.error("Sign out error:", error);
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

// Validate auth token
async function validateToken(token: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      return result.data.user;
    }

    return null;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

// Extend Window interface for Google OAuth
declare global {
  interface Window {
    google?: any;
  }
}
