# OAuth Setup Instructions for Motion Connect

## 🔐 Google OAuth Setup

### 1. Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"

### 2. Configure OAuth Settings

**Application Type:** Web Application

**Authorized JavaScript Origins:**

```
http://localhost:5173
http://localhost:8080
http://localhost:8081
https://yourdomain.com (for production)
```

**Authorized Redirect URIs:**

```
http://localhost:5173/auth/google/callback
http://localhost:8080/auth/google/callback
http://localhost:8081/auth/google/callback
https://yourdomain.com/auth/google/callback (for production)
```

### 3. Get Your Client ID

After creating the OAuth client, you'll get:

- **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
- **Client Secret** (keep this secure for backend use)

### 4. Update Environment Variables

Add to your `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here
```

Replace `your-actual-client-id-here` with your real Google Client ID.

### 5. Add Google SDK to HTML

The Google SDK is already added to `index.html`:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### 6. Test Google Login

1. Start your app: `npm run dev`
2. Go to login/signup page
3. Click "Continue with Google"
4. You should see Google account selection popup

---

## 🎮 Discord OAuth Setup

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name: "Motion Connect"
4. Go to "OAuth2" tab

### 2. Configure OAuth Settings

**Redirects:**

```
http://localhost:5173/auth/discord/callback
http://localhost:8080/auth/discord/callback
http://localhost:8081/auth/discord/callback
https://yourdomain.com/auth/discord/callback (for production)
```

**Scopes:** Select these scopes:

- `identify` (to get user ID, username, discriminator, and avatar)
- `email` (to get user email)

### 3. Get Your Client Credentials

From the "OAuth2" > "General" tab:

- **Client ID** (looks like: `123456789012345678`)
- **Client Secret** (keep this secure for backend use)

### 4. Update Environment Variables

Add to your `.env` file:

```env
VITE_DISCORD_CLIENT_ID=your-discord-client-id-here
```

### 5. Implement Discord OAuth URL

The Discord OAuth URL format:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=identify%20email
```

### 6. Test Discord Login

1. Start your app: `npm run dev`
2. Go to login/signup page
3. Click "Continue with Discord"
4. You should be redirected to Discord authorization

---

## 🔧 Implementation Notes

### Current Implementation (Demo Mode)

The current implementation uses **mock authentication** for demonstration:

- Google OAuth shows immediate success with demo user
- Discord OAuth shows immediate success with demo user
- No actual API calls are made

### For Production Implementation

To implement **real OAuth**, you need to:

1. **Backend API endpoints** to handle OAuth callbacks
2. **Token exchange** with Google/Discord APIs
3. **User creation/linking** in your database
4. **JWT token generation** for session management

### Example Backend Routes Needed

```javascript
// Google OAuth
POST / api / auth / google;
GET / api / auth / google / callback;

// Discord OAuth
POST / api / auth / discord;
GET / api / auth / discord / callback;
```

### Security Best Practices

1. **Never expose Client Secrets** in frontend code
2. **Validate all tokens** on the backend
3. **Use HTTPS** in production
4. **Implement CSRF protection**
5. **Set secure cookie flags**

---

## 🚀 Quick Start

### For Testing (Current Setup)

1. **Your Google Client ID is already configured:**

   ```
   173450104257-3iaqb7usr93lfuuk0uv6p1o1dktqpunk.apps.googleusercontent.com
   ```

2. **Add Discord Client ID to `.env`:**

   ```env
   VITE_DISCORD_CLIENT_ID=your-discord-client-id
   ```

3. **Test the authentication:**
   - Both Google and Discord buttons will work in demo mode
   - Users will be created locally for testing
   - Full functionality available without backend

### For Production

1. Follow the setup steps above for both Google and Discord
2. Implement backend OAuth handling
3. Replace mock authentication with real API calls
4. Deploy with proper environment variables

---

## 📞 Support

If you need help with OAuth setup:

1. Check the console for detailed error messages
2. Verify your Client IDs are correct
3. Ensure redirect URIs match exactly
4. Test in incognito mode to avoid cache issues

The authentication system is designed to work seamlessly in both demo and production modes! 🎵
