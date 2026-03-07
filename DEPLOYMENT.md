# Deployment Guide - Let's Be Friends

## 📦 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB database set up and accessible
- [ ] OAuth credentials obtained
- [ ] Cloudinary account created
- [ ] Email SMTP configured
- [ ] Frontend built successfully
- [ ] Backend tests passing
- [ ] Security review completed

---

## 🚀 Backend Deployment

### Option 1: Heroku Deployment

#### Prerequisites
- Heroku CLI installed
- Git repository initialized
- Heroku account created

#### Steps

1. **Create Heroku App**
```bash
heroku create your-app-name
```

2. **Set Environment Variables**
```bash
heroku config:set PORT=5000
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret_key
heroku config:set GOOGLE_CLIENT_ID=your_google_id
heroku config:set GOOGLE_CLIENT_SECRET=your_google_secret
heroku config:set FACEBOOK_APP_ID=your_fb_id
heroku config:set FACEBOOK_APP_SECRET=your_fb_secret
heroku config:set CLOUDINARY_NAME=your_cloudinary_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your_email@gmail.com
heroku config:set SMTP_PASSWORD=your_app_password
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
```

3. **Create Procfile** (in backend root)
```
web: npm start
```

4. **Update package.json**
```json
{
  "engines": {
    "node": "16.x"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

5. **Deploy**
```bash
git push heroku main
```

6. **View Logs**
```bash
heroku logs --tail
```

---

### Option 2: Railway.app Deployment

1. **Connect Repository**
   - Go to railway.app
   - Create new project
   - Connect GitHub repository

2. **Add MongoDB Plugin**
   - Click "Add Service"
   - Select "MongoDB"

3. **Set Environment Variables**
   - Go to Variables section
   - Add all variables from .env

4. **Deploy**
   - Automatic deployment on push
   - Check deployment logs

---

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean
   - Click "Create" → "App"
   - Select GitHub repository

2. **Configure**
   - Source: Backend folder
   - Build command: `npm install`
   - Run command: `npm start`

3. **Set Environment Variables**
   - Add all variables from .env

4. **Deploy**
   - Click "Deploy"
   - Monitor deployment

---

## 🎨 Frontend Deployment

### Option 1: Vercel Deployment

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Import GitHub repository
   - Select `frontend` folder

3. **Configure**
   - Framework Preset: Vite
   - Root Directory: ./frontend
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**
   - Set `VITE_API_URL` to your backend URL
   ```
   VITE_API_URL=https://your-backend.herokuapp.com
   ```

5. **Deploy**
   - Click Deploy
   - Domain will be provided

---

### Option 2: Netlify Deployment

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Deploy**
   - Go to netlify.com
   - Drag and drop `dist` folder
   OR
   - Connect GitHub for auto-deployment

3. **Configure**
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Set Environment Variables**
   - Go to Site settings
   - Add `VITE_API_URL`

---

### Option 3: AWS S3 + CloudFront

1. **Build**
```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**
   - AWS Console → S3
   - Create bucket named `your-domain`
   - Enable static website hosting

3. **Upload**
```bash
aws s3 sync dist/ s3://your-domain/
```

4. **Configure CloudFront**
   - Create distribution
   - Origin: S3 bucket
   - Enable HTTPS

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to mongodb.com/cloud/atlas
   - Sign up

2. **Create Cluster**
   - Choose shared cluster (free tier)
   - Select region closest to you
   - Create cluster

3. **Create User**
   - Go to Database Access
   - Create database user
   - Set strong password

4. **Get Connection String**
   - Go to Clusters
   - Click "Connect"
   - Copy connection string
   - Add to `MONGODB_URI`

5. **Whitelist IP**
   - Go to Network Access
   - Add IP Address
   - Or add 0.0.0.0/0 for development

### Self-Hosted MongoDB

1. **Install MongoDB**
```bash
# Windows
msiexec.exe /i mongodb-win32-x86_64-installer.msi

# macOS
brew tap mongodb/brew
brew install mongodb-community

# Linux
sudo apt-get install mongodb
```

2. **Start Service**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

3. **Connection String**
```
mongodb://localhost:27017/lets-be-friends
```

---

## 🔐 Production Security Checklist

### Environment & Configuration
- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled on all endpoints
- [ ] CORS properly configured for your domain
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] Database password is strong

### Database
- [ ] MongoDB authentication enabled
- [ ] Regular backups scheduled
- [ ] IP whitelisting configured
- [ ] Encryption at rest enabled

### API Security
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL/NoSQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF tokens if applicable
- [ ] Helmet.js security headers enabled

### Frontend
- [ ] Build optimized (`npm run build`)
- [ ] Sensitive data not logged
- [ ] API keys not exposed
- [ ] Content Security Policy headers set
- [ ] HTTPS certificate valid

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Log aggregation
- [ ] Performance monitoring
- [ ] Alerts configured

---

## 📊 Monitoring & Logging

### Sentry Integration (Error Tracking)

1. **Install Sentry**
```bash
# Backend
npm install @sentry/node

# Frontend
npm install @sentry/react
```

2. **Configure Backend**
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

3. **Configure Frontend**
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENV
});
```

---

## 🚨 Custom Domain Setup

### 1. Purchase Domain
- GoDaddy, Namecheap, Google Domains

### 2. Update DNS Records
For Vercel/Netlify deployment:
```
CNAME: your-domain.com → your-domain.vercel.app
```

For custom backend:
```
A record: backend.your-domain.com → your-backend-ip
```

### 3. SSL Certificate
- Automatically provided by most platforms
- Or use Let's Encrypt

---

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
        working-directory: ./backend
      
      - name: Run tests
        run: npm test
        working-directory: ./backend
      
      - name: Deploy to Heroku
        uses: AkhileshNS/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "backend"
```

---

## 📈 Scaling Considerations

### As You Grow:

1. **Caching Layer**
   - Add Redis for session/cache
   - Cache frequently accessed data

2. **Database**
   - Enable indexing on frequently queried fields
   - Consider database replication
   - Implement read replicas

3. **Load Balancing**
   - Use load balancer for multiple backend instances
   - Consider services like AWS ELB

4. **CDN**
   - Cloudflare for edge caching
   - Faster asset delivery globally

5. **Microservices**
   - Separate messaging service
   - Separate image processing service
   - Separate moderation service

---

## 🆘 Troubleshooting Deployment

### Backend Issues

**Port already in use**
```bash
# Change port in .env
PORT=3000
```

**MongoDB connection failed**
- Check connection string
- Verify IP whitelisting
- Ensure database is running

**Environment variables not loaded**
- Verify all vars are set in hosting platform
- Restart application after setting vars

### Frontend Issues

**API calls failing**
- Check CORS configuration
- Verify API_URL environment variable
- Check network tab in browser dev tools

**Build failing**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Review build logs for specific errors

---

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Verify all environment variables
4. Test locally first before deploying

Happy deployment! 🎉
