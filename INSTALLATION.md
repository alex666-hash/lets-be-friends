# Let's Be Friends - Installation Guide

## Quick Start

### 1. Clone or Download the Project
```bash
cd "Let's Be Friends"
```

### 2. Backend Setup

#### Step 1: Install Node.js
Download from https://nodejs.org/ (v16 or higher recommended)

#### Step 2: Navigate to Backend
```bash
cd backend
```

#### Step 3: Install Dependencies
```bash
npm install
```

#### Step 4: Setup Environment Variables
Create a `.env` file in the `backend` folder with the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lets-be-friends
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRE=7d

# Google OAuth Setup
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth Setup
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Cloudinary (for image storage)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password

FRONTEND_URL=http://localhost:5173
```

#### Step 5: Setup MongoDB
- **Option A**: Local MongoDB
  - Download from https://www.mongodb.com/try/download/community
  - Install and run MongoDB service
  
- **Option B**: MongoDB Atlas (Cloud)
  - Go to https://www.mongodb.com/cloud/atlas
  - Create a free account
  - Create a cluster
  - Get connection string and update `MONGODB_URI`

#### Step 6: Start Backend Server
```bash
npm run dev
```

You should see: `✓ MongoDB connected` and `🚀 Server running on port 5000`

### 3. Frontend Setup

#### Step 1: Open New Terminal
Keep the backend running, open another terminal window

#### Step 2: Navigate to Frontend
```bash
cd frontend
```

#### Step 3: Install Dependencies
```bash
npm install
```

#### Step 4: Start Frontend Server
```bash
npm run dev
```

You should see: `VITE v4.x.x ready in xxx ms`

### 4. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## Setting Up OAuth (Optional but Recommended)

### Google OAuth
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:5000/api/auth/google/callback` to authorized redirect URIs
6. Copy Client ID and Client Secret to `.env`

### Facebook OAuth
1. Go to https://developers.facebook.com/
2. Create a new app
3. Add Facebook Login product
4. Configure authorized redirect URIs
5. Copy App ID and App Secret to `.env`

## Setting Up Cloudinary (For Image Uploads)

1. Go to https://cloudinary.com/
2. Sign up for free account
3. Go to Dashboard
4. Copy Cloud Name, API Key, and API Secret
5. Add to `.env`

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
```

### MongoDB Connection Error
- Check if MongoDB service is running
- Verify connection string in `.env`
- For Atlas, ensure IP is whitelisted

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -r node_modules
npm install
```

### CORS Errors
Ensure `FRONTEND_URL` in `.env` matches your frontend URL (default: http://localhost:5173)

## Testing the Application

### 1. Create Account
- Click "Register"
- Fill in email, password, and name
- Click "Create Account"

### 2. Complete Profile
- Add bio, gender, interests
- Add location (city, country)
- Set age and distance preferences
- Upload photos

### 3. Face Verification
- Grant camera access
- Capture 2+ face photos
- Submit for verification

### 4. View Matches
- See potential matches based on location and preferences
- Click heart to like/match
- View compatibility percentage

### 5. Chat
- Go to Messages tab
- Chat with matches
- System will flag inappropriate content

## Default Test Credentials

```
Email: test@example.com
Password: password123
```

(Create your own account after first setup)

## Project Structure

```
Let's Be Friends/
├── backend/
│   ├── models/          (Database schemas)
│   ├── routes/          (API endpoints)
│   ├── controllers/      (Business logic)
│   ├── middleware/      (Auth, validation)
│   ├── utils/           (Helper functions)
│   ├── config/          (Passport, etc)
│   ├── server.js        (Main server file)
│   └── .env             (Configuration)
│
└── frontend/
    ├── src/
    │   ├── pages/       (React pages)
    │   ├── components/  (React components)
    │   ├── store/       (Zustand stores)
    │   ├── utils/       (API calls)
    │   ├── App.jsx      (Main app)
    │   └── main.jsx     (Entry point)
    ├── index.html       (HTML template)
    └── vite.config.js   (Vite config)
```

## Features You Can Test

✅ User Registration (Email)
✅ User Login
✅ Profile Setup
✅ Face Verification (Camera)
✅ Location-Based Matching
✅ Like/Dislike System
✅ Messaging with Content Moderation
✅ Achievement System
✅ User Verification Badges

## Next Steps

1. **Deploy to Production**
   - Backend: Heroku, Railway, or DigitalOcean
   - Frontend: Vercel, Netlify, or similar

2. **Enhance Features**
   - Add real-time chat with Socket.io
   - Add video calling
   - Add payment system for premium features
   - Add more OAuth providers

3. **Customize**
   - Change colors and branding
   - Add more achievements
   - Enhance matching algorithm
   - Add more content filters

## Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review error messages in browser console
3. Check server logs in terminal
4. Verify all environment variables are set correctly

Happy Dating! 💕
