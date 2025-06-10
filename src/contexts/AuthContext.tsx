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

// Mock API endpoints - replace with your actual backend
const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3001/api";

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
      // In a real app, this would be an API call
      const response = await mockApiCall("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.success) {
        const { user: userData, token } = response.data;
        localStorage.setItem("authToken", token);
        setUser(userData);
      } else {
        throw new Error(response.error || "Signup failed");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const response = await mockApiCall("/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        const { user: userData, token } = response.data;
        localStorage.setItem("authToken", token);
        setUser(userData);
      } else {
        throw new Error(response.error || "Sign in failed");
      }
    } catch (error) {
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
            process.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id",
          callback: async (response: any) => {
            try {
              // Send the credential to your backend
              const authResponse = await mockApiCall("/auth/google", {
                method: "POST",
                body: JSON.stringify({ credential: response.credential }),
              });

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

// Mock API function - replace with your actual API calls
async function mockApiCall(endpoint: string, options: any = {}) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const url = `${API_BASE_URL}${endpoint}`;

  // Mock responses for different endpoints
  if (endpoint === "/auth/signup") {
    const { fullName, email, password, instrument } = JSON.parse(options.body);

    // Mock validation
    if (!email || !password || !fullName) {
      return { success: false, error: "Missing required fields" };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters",
      };
    }

    // Mock user creation
    const user: User = {
      id: "user_" + Date.now(),
      email,
      fullName,
      instrument,
      provider: "email",
      createdAt: new Date().toISOString(),
    };

    const token = "mock_token_" + Date.now();

    return {
      success: true,
      data: { user, token },
    };
  }

  if (endpoint === "/auth/signin") {
    const { email, password } = JSON.parse(options.body);

    // Mock validation
    if (email === "demo@motionconnect.com" && password === "password123") {
      const user: User = {
        id: "demo_user",
        email: "demo@motionconnect.com",
        fullName: "Demo User",
        instrument: "guitar",
        provider: "email",
        createdAt: "2024-01-01T00:00:00Z",
      };

      const token = "demo_token_" + Date.now();

      return {
        success: true,
        data: { user, token },
      };
    }

    return { success: false, error: "Invalid email or password" };
  }

  if (endpoint === "/auth/google") {
    // Mock Google OAuth response
    const user: User = {
      id: "google_user_" + Date.now(),
      email: "user@gmail.com",
      fullName: "Google User",
      avatar: "https://via.placeholder.com/40",
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    const token = "google_token_" + Date.now();

    return {
      success: true,
      data: { user, token },
    };
  }

  return { success: false, error: "Endpoint not found" };
}

// Validate auth token
async function validateToken(token: string): Promise<User | null> {
  try {
    // In a real app, you'd validate the token with your backend
    // For now, we'll just check if it's a valid format and not expired
    if (
      token.startsWith("mock_token_") ||
      token.startsWith("demo_token_") ||
      token.startsWith("google_token_")
    ) {
      // Mock user data based on token type
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
          email: "user@gmail.com",
          fullName: "Google User",
          avatar: "https://via.placeholder.com/40",
          provider: "google",
          createdAt: new Date().toISOString(),
        };
      }

      // Default mock user for other tokens
      return {
        id: "user_123",
        email: "user@motionconnect.com",
        fullName: "Test User",
        provider: "email",
        createdAt: new Date().toISOString(),
      };
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
