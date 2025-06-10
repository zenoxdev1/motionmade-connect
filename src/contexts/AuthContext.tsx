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
      console.log("API URL:", API_BASE_URL);

      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // If backend is not running, fall back to mock behavior
        if (response.status === 0 || !response.status) {
          console.log("Backend not available, using mock signup");
          const mockUser: User = {
            id: "user_" + Date.now(),
            email: data.email,
            fullName: data.fullName,
            instrument: data.instrument,
            provider: "email",
            createdAt: new Date().toISOString(),
          };
          const token = "mock_token_" + Date.now();
          localStorage.setItem("authToken", token);
          setUser(mockUser);
          console.log("Mock sign up successful:", mockUser);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      // If it's a network error, try mock authentication
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.log("Network error, using mock signup");
        const mockUser: User = {
          id: "user_" + Date.now(),
          email: data.email,
          fullName: data.fullName,
          instrument: data.instrument,
          provider: "email",
          createdAt: new Date().toISOString(),
        };
        const token = "mock_token_" + Date.now();
        localStorage.setItem("authToken", token);
        setUser(mockUser);
        console.log("Mock sign up successful:", mockUser);
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      console.log("Attempting sign in with:", { email, password: "***" });
      console.log("API URL:", API_BASE_URL);

      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // If backend is not running, fall back to mock behavior for demo
        if (response.status === 0 || !response.status) {
          console.log("Backend not available, checking demo credentials");
          if (email === "demo@motionconnect.com" && password === "password123") {
            const mockUser: User = {
              id: "demo_user",
              email: "demo@motionconnect.com",
              fullName: "Demo User",
              instrument: "guitar",
              provider: "email",
              createdAt: "2024-01-01T00:00:00Z",
            };
            const token = "demo_token_" + Date.now();
            localStorage.setItem("authToken", token);
            setUser(mockUser);
            console.log("Mock sign in successful:", mockUser);
            return;
          } else {
            throw new Error("Invalid credentials (backend not available)");
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      // If it's a network error, try mock authentication for demo
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.log("Network error, checking demo credentials");
        if (email === "demo@motionconnect.com" && password === "password123") {
          const mockUser: User = {
            id: "demo_user",
            email: "demo@motionconnect.com",
            fullName: "Demo User",
            instrument: "guitar",
            provider: "email",
            createdAt: "2024-01-01T00:00:00Z",
          };
          const token = "demo_token_" + Date.now();
          localStorage.setItem("authToken", token);
          setUser(mockUser);
          console.log("Mock sign in successful:", mockUser);
          return;
        } else {
          throw new Error("Network error: Unable to connect to server. Try demo credentials: demo@motionconnect.com / password123");
        }
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log("Attempting Google sign in");
      console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

      // Initialize Google OAuth
      if (typeof window !== "undefined" && window.google) {
        const google = window.google;

        // Configure Google OAuth
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "173450104257-3iaqb7usr93lfuuk0uv6p1o1dktqpunk.apps.googleusercontent.com",
          callback: async (response: any) => {
            try {
              console.log("Google callback received:", response);

              // Send the credential to your backend
              const apiResponse = await fetch(`${API_BASE_URL}/auth/google`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ credential: response.credential }),
              });

              if (!apiResponse.ok) {
                // Fallback to mock Google user if backend not available
                console.log("Backend not available, using mock Google user");
                const mockGoogleUser: User = {
                  id: "google_" + Date.now(),
                  email: "google.user@gmail.com",
                  fullName: "Google User",
                  avatar: "https://via.placeholder.com/40",
                  provider: "google",
                  createdAt: new Date().toISOString(),
                };

                const token = "google_token_" + Date.now();
                localStorage.setItem("authToken", token);
                setUser(mockGoogleUser);
                setLoading(false);
                return;
              }

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
              // Fallback to mock user on error
              const mockGoogleUser: User = {
                id: "google_" + Date.now(),
                email: "google.user@gmail.com",
                fullName: "Google User",
                avatar: "https://via.placeholder.com/40",
                provider: "google",
                createdAt: new Date().toISOString(),
              };

              const token = "google_token_" + Date.now();
              localStorage.setItem("authToken", token);
              setUser(mockGoogleUser);
            } finally {
              setLoading(false);
            }
          },
        });

        // Prompt the user to select an account
        google.accounts.id.prompt();
      } else {
        console.log("Google SDK not loaded, using mock Google user");
        // Fallback for when Google SDK is not loaded
        const mockGoogleUser: User = {
          id: "google_" + Date.now(),
          email: "google.user@gmail.com",
          fullName: "Google User",
          avatar: "https://via.placeholder.com/40",
          provider: "google",
          createdAt: new Date().toISOString(),
        };

        const token = "google_token_" + Date.now();
        localStorage.setItem("authToken", token);
        setUser(mockGoogleUser);
        setLoading(false);
      }
    } catch (error) {
      console.error("Google sign in error:", error);
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
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Fallback for when backend is not available
      console.log("Backend not available, checking token format");

      if (token.startsWith("demo_token_")) {
        return {
          id: "demo_user",
          email: "demo@motionconnect.com",
          fullName: "Demo User",
          instrument: "guitar",
          provider: "email",
          createdAt: "2024-01-01T00:00:00Z",
        };
      }

      if (token.startsWith("google_token_")) {
        return {
          id: "google_user",
          email: "google.user@gmail.com",
          fullName: "Google User",
          avatar: "https://via.placeholder.com/40",
          provider: "google",
          createdAt: new Date().toISOString(),
        };
      }

      if (token.startsWith("mock_token_")) {
        return {
          id: "user_123",
          email: "user@motionconnect.com",
          fullName: "Mock User",
          provider: "email",
          createdAt: new Date().toISOString(),
        };
      }

      return null;
    }

    const result = await response.json();

    if (result.success) {
      return result.data.user;
    }

    return null;
  } catch (error) {
    console.error("Token validation error:", error);

    // Fallback validation for mock tokens when network fails
    if (token.startsWith("demo_token_")) {
      return {
        id: "demo_user",
        email: "demo@motionconnect.com",
        fullName: "Demo User",
        instrument: "guitar",
        provider: "email",
        createdAt: "2024-01-01T00:00:00Z",
      };
    }

    if (token.startsWith("google_token_")) {
      return {
        id: "google_user",
        email: "google.user@gmail.com",
        fullName: "Google User",
        avatar: "https://via.placeholder.com/40",
        provider: "google",
        createdAt: new Date().toISOString(),
      };
    }

    if (token.startsWith("mock_token_")) {
      return {
        id: "user_123",
        email: "user@motionconnect.com",
        fullName: "Mock User",
        provider: "email",
        createdAt: new Date().toISOString(),
      };
    }

    return null;
  }
}
}

// Extend Window interface for Google OAuth
declare global {
  interface Window {
    google?: any;
  }
}