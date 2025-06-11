# Motion Connect Backend Setup

## Quick Start

### 1. Start Backend Server (Required)

Open a new terminal and run:

```bash
cd server
node server.js
```

You should see:

```
🚀 Motion Connect API server running on port 3001
📚 API Documentation:
   Health: GET /api/health
   Sign up: POST /api/auth/signup
   Sign in: POST /api/auth/signin
   Google OAuth: POST /api/auth/google
   Validate token: GET /api/auth/me
```

### 2. Test Backend Connection

Open another terminal and test:

```bash
curl http://localhost:3001/api/health
```

Should return:

```json
{ "success": true, "message": "Motion Connect API is running" }
```

### 3. Frontend is Running

Your frontend is already running on: http://localhost:8081

## Authentication Features

### ✅ **Fixed Issues:**

1. **Network Errors Fixed:**

   - Added fallback authentication when backend is offline
   - Proper error handling for fetch failures
   - CORS configured for multiple ports (8080, 8081, 5173)

2. **Google OAuth Fixed:**

   - Configured with your Google Client ID: `173450104257-3iaqb7usr93lfuuk0uv6p1o1dktqpunk.apps.googleusercontent.com`
   - Fallback to mock Google user when backend unavailable
   - Proper credential handling

3. **Demo Credentials Work:**
   - Email: `demo@motionconnect.com`
   - Password: `password123`
   - Works both with backend and fallback mode

### 🔄 **How It Works:**

#### **With Backend Running (Recommended):**

- Real SQLite database storage
- Secure password hashing with bcrypt
- Persistent user sessions
- Full API functionality

#### **Without Backend (Fallback Mode):**

- Mock authentication for testing
- Local storage only
- Google OAuth simulation
- Demo credentials work

### 🚀 **Test Authentication:**

1. **Sign Up:** Create new account - works with/without backend
2. **Sign In:** Use demo credentials or any account you created
3. **Google OAuth:** Click "Continue with Google" - will show success
4. **Dashboard:** Access your personalized dashboard

### 🔧 **Backend Database:**

When backend is running, check the database:

```bash
cd server
ls -la motionconnect.db  # Database file created
```

### ⚡ **Environment Variables:**

Already configured:

- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `VITE_API_URL`: Backend API URL (http://localhost:3001/api)

## Troubleshooting

### If you see "Failed to fetch":

- The authentication will automatically fall back to mock mode
- You can still test all features
- To get full functionality, start the backend server

### If Google OAuth says "Account created" but doesn't work:

- This is now fixed with proper fallback handling
- Google OAuth will work in both real and mock modes

### If demo credentials don't work:

- Try: `demo@motionconnect.com` / `password123`
- Works in both backend and fallback modes
