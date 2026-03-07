#!/bin/bash
# Let's Be Friends - Deployment Quick Start Script

echo "🚀 Let's Be Friends - Deployment Setup"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Create GitHub Repository${NC}"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository: 'lets-be-friends'"
echo "3. Clone to your computer"
echo ""
echo "Run these commands:"
echo "git clone https://github.com/YOUR_USERNAME/lets-be-friends.git"
echo "cd lets-be-friends"
echo ""

echo -e "${BLUE}Step 2: Prepare Files${NC}"
echo "Copy these folders to your repo:"
echo "- backend/"
echo "- frontend/"
echo "- .gitignore"
echo ""
echo "Create backend/.env with:"
cat > backend/.env.example << 'EOF'
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lets-be-friends
JWT_SECRET=your-random-secret-key-change-this
NODE_ENV=production
PORT=5000
CLOUDINARY_NAME=your-cloudinary
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
FACEBOOK_APP_ID=your-facebook-id
FACEBOOK_APP_SECRET=your-facebook-secret
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=https://your-frontend-url.com
EOF

echo "Created backend/.env.example"
echo ""

echo -e "${BLUE}Step 3: Push to GitHub${NC}"
echo "Run these commands:"
echo "git add ."
echo "git commit -m 'Let's Be Friends - Dating Website'"
echo "git push -u origin main"
echo ""

echo -e "${BLUE}Step 4: Deploy Backend${NC}"
echo "Option A: Railway (Recommended)"
echo "1. Go to https://railway.app"
echo "2. Connect GitHub repo"
echo "3. Create MongoDB database"
echo "4. Deploy backend from /backend folder"
echo "5. Add environment variables"
echo ""
echo "Option B: Heroku"
echo "1. Go to https://heroku.com"
echo "2. Create new app"
echo "3. Connect GitHub repo"
echo "4. Add BuildPacks: heroku/nodejs"
echo "5. Set environment variables"
echo "6. Deploy"
echo ""

echo -e "${BLUE}Step 5: Deploy Frontend${NC}"
echo "Option A: Vercel (Recommended)"
echo "1. Go to https://vercel.com"
echo "2. Import GitHub repo"
echo "3. Set root directory: frontend"
echo "4. Add VITE_API_URL env variable"
echo "5. Deploy"
echo ""
echo "Option B: Netlify"
echo "1. Go to https://netlify.com"
echo "2. Connect GitHub repo"
echo "3. Build command: npm run build"
echo "4. Publish directory: dist"
echo "5. Deploy"
echo ""

echo -e "${BLUE}Step 6: Configure Domains${NC}"
echo "Get your deployed URLs and configure:"
echo "- OAuth callback URLs"
echo "- CORS origins"
echo "- API URLs"
echo ""

echo -e "${GREEN}✅ Deployment Ready!${NC}"
echo ""
echo "Quick Links:"
echo "- Railway: https://railway.app"
echo "- Vercel: https://vercel.com"
echo "- Heroku: https://heroku.com"
echo "- MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
echo "- Cloudinary: https://cloudinary.com"
echo ""
echo "Need help? See DEPLOY_ONLINE.md"
