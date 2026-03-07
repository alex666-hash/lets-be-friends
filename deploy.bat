@echo off
REM Let's Be Friends - Deployment Quick Start (Windows)

echo.
echo ======================================
echo   Let's Be Friends - Deployment Setup
echo ======================================
echo.

echo [1/6] GitHub Repository Setup
echo.
echo 1. Go to https://github.com/new
echo 2. Create a new repository: "lets-be-friends"
echo 3. Clone to your computer
echo.
echo Commands to run:
echo git clone https://github.com/YOUR_USERNAME/lets-be-friends.git
echo cd lets-be-friends
echo.
pause

echo [2/6] Copy Project Files
echo.
echo Copy these to your repo:
echo - backend/ folder
echo - frontend/ folder
echo - .gitignore file
echo.
pause

echo [3/6] Create Environment Files
echo.
echo Creating backend\.env.example ...
(
echo MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lets-be-friends
echo JWT_SECRET=your-random-secret-key-change-this
echo NODE_ENV=production
echo PORT=5000
echo CLOUDINARY_NAME=your-cloudinary
echo CLOUDINARY_API_KEY=your-key
echo CLOUDINARY_API_SECRET=your-secret
echo GOOGLE_CLIENT_ID=your-google-id
echo GOOGLE_CLIENT_SECRET=your-google-secret
echo FACEBOOK_APP_ID=your-facebook-id
echo FACEBOOK_APP_SECRET=your-facebook-secret
echo SMTP_USER=your-email@gmail.com
echo SMTP_PASS=your-app-password
echo FRONTEND_URL=https://your-frontend-url.com
) > backend\.env.example

echo Created backend\.env.example
echo Copy this and rename to backend\.env
echo.
pause

echo [4/6] Push to GitHub
echo.
echo Run these commands:
echo git add .
echo git commit -m "Let's Be Friends - Dating Website"
echo git push -u origin main
echo.
pause

echo [5/6] Deploy Backend
echo.
echo Choose one:
echo.
echo OPTION A: Railway (Recommended, Easiest)
echo 1. Go to https://railway.app
echo 2. Click "Start Project"
echo 3. Connect your GitHub repo
echo 4. Create new PostgreSQL or MongoDB
echo 5. Deploy from /backend folder
echo 6. Add environment variables
echo.
echo OPTION B: Heroku
echo 1. Go to https://heroku.com
echo 2. Create new app
echo 3. Connect GitHub repo
echo 4. Set environment variables
echo 5. Deploy
echo.
pause

echo [6/6] Deploy Frontend
echo.
echo Choose one:
echo.
echo OPTION A: Vercel (Recommended, Easiest)
echo 1. Go to https://vercel.com
echo 2. Import your GitHub repo
echo 3. Set root directory to: frontend
echo 4. Add env var: VITE_API_URL=[your-backend-url]
echo 5. Deploy
echo.
echo OPTION B: Netlify
echo 1. Go to https://netlify.com
echo 2. Connect GitHub repo
echo 3. Build command: npm run build
echo 4. Publish directory: dist
echo 5. Deploy
echo.
pause

echo.
echo ======================================
echo   Deployment Setup Complete!
echo ======================================
echo.
echo Important Next Steps:
echo.
echo 1. Create MongoDB Atlas account (free):
echo    https://www.mongodb.com/cloud/atlas
echo.
echo 2. Create Cloudinary account (free):
echo    https://cloudinary.com
echo.
echo 3. Get OAuth credentials (free):
echo    - Google: https://console.cloud.google.com
echo    - Facebook: https://developers.facebook.com
echo.
echo 4. Configure your .env files with:
echo    - Database URL
echo    - API keys
echo    - OAuth credentials
echo.
echo 5. Update OAuth redirect URLs in:
echo    - Google Console
echo    - Facebook App Settings
echo.
echo For detailed help, see: DEPLOY_ONLINE.md
echo.
pause
