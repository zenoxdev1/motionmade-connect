const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
  initDatabase,
  userOperations,
  sessionOperations,
  trackOperations,
} = require("./database");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Initialize database
initDatabase();

// Utility functions
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const generateTokenExpiry = () => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // 7 days from now
  return expiry.toISOString();
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Access token required" });
  }

  try {
    const session = sessionOperations.findByToken(token);
    if (!session) {
      return res
        .status(403)
        .json({ success: false, error: "Invalid or expired token" });
    }

    req.user = {
      id: session.id,
      email: session.email,
      fullName: session.full_name,
      instrument: session.instrument,
      provider: session.provider,
      avatar: session.avatar_url,
      createdAt: session.created_at,
    };
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: "Invalid token" });
  }
};

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Motion Connect API is running" });
});

// Sign up
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { fullName, email, password, instrument } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Full name, email, and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = userOperations.create({
      email,
      passwordHash,
      fullName,
      instrument,
      provider: "email",
    });

    // Create session
    const token = generateToken();
    const expiresAt = generateTokenExpiry();
    sessionOperations.create(user.id, token, expiresAt);

    // Return user data (excluding password hash)
    const userData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      instrument: user.instrument,
      provider: "email",
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Sign in
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = userOperations.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Create session
    const token = generateToken();
    const expiresAt = generateTokenExpiry();
    sessionOperations.create(user.id, token, expiresAt);

    // Return user data (excluding password hash)
    const userData = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      instrument: user.instrument,
      provider: user.provider,
      avatar: user.avatar_url,
      createdAt: user.created_at,
    };

    res.json({
      success: true,
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Google OAuth (simplified - in production, use proper OAuth flow)
app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    // In a real app, you'd verify the Google JWT credential here
    // For demo purposes, we'll create a mock Google user

    const mockGoogleUser = {
      email: "google.user@gmail.com",
      fullName: "Google User",
      googleId: "google_" + Date.now(),
      avatar: "https://via.placeholder.com/40",
    };

    let user = userOperations.findByEmail(mockGoogleUser.email);

    if (!user) {
      // Create new Google user
      user = userOperations.create({
        email: mockGoogleUser.email,
        passwordHash: null,
        fullName: mockGoogleUser.fullName,
        instrument: null,
        provider: "google",
        googleId: mockGoogleUser.googleId,
      });
    }

    // Create session
    const token = generateToken();
    const expiresAt = generateTokenExpiry();
    sessionOperations.create(user.id, token, expiresAt);

    const userData = {
      id: user.id,
      email: user.email,
      fullName: user.full_name || user.fullName,
      instrument: user.instrument,
      provider: "google",
      avatar: mockGoogleUser.avatar,
      createdAt: user.created_at || new Date().toISOString(),
    };

    res.json({
      success: true,
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      error: "Google authentication failed",
    });
  }
});

// Sign out
app.post("/api/auth/signout", authenticateToken, (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      sessionOperations.deleteByToken(token);
    }

    res.json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    console.error("Signout error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Validate token
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

// Get user tracks
app.get("/api/tracks", authenticateToken, (req, res) => {
  try {
    const tracks = trackOperations.findByUserId(req.user.id);
    res.json({
      success: true,
      data: tracks,
    });
  } catch (error) {
    console.error("Get tracks error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tracks",
    });
  }
});

// Get public tracks
app.get("/api/tracks/public", (req, res) => {
  try {
    const tracks = trackOperations.findPublic(20);
    res.json({
      success: true,
      data: tracks,
    });
  } catch (error) {
    console.error("Get public tracks error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch public tracks",
    });
  }
});

// Clean up expired sessions periodically
setInterval(
  () => {
    sessionOperations.deleteExpired();
  },
  1000 * 60 * 60,
); // Every hour

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Motion Connect API server running on port ${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   Health: GET /api/health`);
  console.log(`   Sign up: POST /api/auth/signup`);
  console.log(`   Sign in: POST /api/auth/signin`);
  console.log(`   Google OAuth: POST /api/auth/google`);
  console.log(`   Validate token: GET /api/auth/me`);
});
