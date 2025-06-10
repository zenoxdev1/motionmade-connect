const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");

// Create database file in server directory
const dbPath = path.join(__dirname, "motionconnect.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Create tables
const createTables = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      full_name TEXT NOT NULL,
      avatar_url TEXT,
      instrument TEXT,
      provider TEXT NOT NULL DEFAULT 'email',
      google_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // User tracks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      file_url TEXT,
      duration INTEGER,
      genre TEXT,
      is_public BOOLEAN DEFAULT 1,
      play_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // User connections table
  db.exec(`
    CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requester_id INTEGER NOT NULL,
      requested_id INTEGER NOT NULL,
      status TEXT CHECK(status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (requester_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (requested_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(requester_id, requested_id)
    )
  `);

  // Collaborations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS collaborations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      creator_id INTEGER NOT NULL,
      max_members INTEGER DEFAULT 10,
      genre TEXT,
      status TEXT CHECK(status IN ('open', 'in_progress', 'completed')) DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Collaboration members table
  db.exec(`
    CREATE TABLE IF NOT EXISTS collaboration_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collaboration_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (collaboration_id) REFERENCES collaborations (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(collaboration_id, user_id)
    )
  `);

  console.log("✅ Database tables created successfully");
};

// Initialize database
const initDatabase = () => {
  try {
    createTables();

    // Create demo user if it doesn't exist
    const existingDemo = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get("demo@motionconnect.com");

    if (!existingDemo) {
      const passwordHash = bcrypt.hashSync("password123", 10);
      const stmt = db.prepare(`
        INSERT INTO users (email, password_hash, full_name, instrument, provider)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run(
        "demo@motionconnect.com",
        passwordHash,
        "Demo User",
        "guitar",
        "email",
      );
      console.log("✅ Demo user created: demo@motionconnect.com / password123");
    }

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
};

// User operations
const userOperations = {
  create: (userData) => {
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash, full_name, instrument, provider, google_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    try {
      const info = stmt.run(
        userData.email,
        userData.passwordHash,
        userData.fullName,
        userData.instrument,
        userData.provider || "email",
        userData.googleId,
      );

      return { id: info.lastInsertRowid, ...userData };
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Email already exists");
      }
      throw error;
    }
  },

  findByEmail: (email) => {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email);
  },

  findById: (id) => {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(id);
  },

  findByGoogleId: (googleId) => {
    const stmt = db.prepare("SELECT * FROM users WHERE google_id = ?");
    return stmt.get(googleId);
  },

  update: (id, userData) => {
    const fields = Object.keys(userData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(userData);

    const stmt = db.prepare(
      `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    );
    return stmt.run(...values, id);
  },
};

// Session operations
const sessionOperations = {
  create: (userId, token, expiresAt) => {
    const stmt = db.prepare(`
      INSERT INTO user_sessions (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `);

    return stmt.run(userId, token, expiresAt);
  },

  findByToken: (token) => {
    const stmt = db.prepare(`
      SELECT s.*, u.* FROM user_sessions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP
    `);
    return stmt.get(token);
  },

  deleteByToken: (token) => {
    const stmt = db.prepare("DELETE FROM user_sessions WHERE token = ?");
    return stmt.run(token);
  },

  deleteExpired: () => {
    const stmt = db.prepare(
      "DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP",
    );
    return stmt.run();
  },
};

// Track operations
const trackOperations = {
  create: (trackData) => {
    const stmt = db.prepare(`
      INSERT INTO tracks (user_id, title, description, file_url, duration, genre, is_public)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      trackData.userId,
      trackData.title,
      trackData.description,
      trackData.fileUrl,
      trackData.duration,
      trackData.genre,
      trackData.isPublic,
    );

    return { id: info.lastInsertRowid, ...trackData };
  },

  findByUserId: (userId) => {
    const stmt = db.prepare(
      "SELECT * FROM tracks WHERE user_id = ? ORDER BY created_at DESC",
    );
    return stmt.all(userId);
  },

  findPublic: (limit = 20) => {
    const stmt = db.prepare(`
      SELECT t.*, u.full_name as artist_name, u.avatar_url as artist_avatar
      FROM tracks t 
      JOIN users u ON t.user_id = u.id 
      WHERE t.is_public = 1 
      ORDER BY t.created_at DESC 
      LIMIT ?
    `);
    return stmt.all(limit);
  },
};

module.exports = {
  db,
  initDatabase,
  userOperations,
  sessionOperations,
  trackOperations,
};
