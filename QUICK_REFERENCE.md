# Quick Reference Guide - Let's Be Friends

## 🚀 30-Second Start

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Server running on port 5000

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```

---

## 📋 Essential Commands

### Backend
```bash
npm install              # Install dependencies
npm run dev             # Start development server
npm start               # Production start
```

### Frontend
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

---

## 🔐 Setup Configuration

### 1. Backend `.env` File
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lets-be-friends
JWT_SECRET=your_secret_key_here_change_this
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
FACEBOOK_APP_ID=your_fb_id
FACEBOOK_APP_SECRET=your_fb_secret
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
FRONTEND_URL=http://localhost:5173
```

### 2. MongoDB Setup
**Option A - Local:**
- Download from mongodb.com
- Start service
- Connection: `mongodb://localhost:27017`

**Option B - Cloud (Atlas):**
- Create free account at mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Update `MONGODB_URI`

---

## 📝 Key Files & Their Purpose

| File | Purpose | Key Functions |
|------|---------|---|
| `server.js` | Express server | Start app, load routes |
| `User.js` | User model | Store user data |
| `authController.js` | Auth logic | Register, login |
| `matchController.js` | Matching logic | Find matches, compatibility |
| `messageController.js` | Chat logic | Send, moderate messages |
| `moderation.js` | Content filtering | Detect violations |
| `matching.js` | Algorithm | Calculate compatibility |
| `App.jsx` | React routing | Navigation, layout |
| `Dashboard.jsx` | Main interface | Swipe cards |
| `authStore.js` | State management | User auth state |

---

## 🔗 API Quick Reference

### Auth
```
POST   /api/auth/register          Register user
POST   /api/auth/login             Login user
GET    /api/auth/me                Get current user
```

### Users
```
GET    /api/users/:userId          Get profile
PUT    /api/users/profile/update   Update profile
POST   /api/users/avatar/upload    Upload avatar
POST   /api/users/photos/upload    Upload photos
POST   /api/users/like             Like user
```

### Matches
```
GET    /api/matches                Get matches
GET    /api/matches/potential      Find potential matches
POST   /api/matches                Create match
POST   /api/matches/block          Block user
```

### Messages
```
GET    /api/messages/:userId       Get messages
POST   /api/messages               Send message
DELETE /api/messages/:id           Delete message
PUT    /api/messages/:id/read      Mark as read
```

### Verification
```
POST   /api/verification/token/generate      Generate token
POST   /api/verification/face/submit         Submit face
GET    /api/verification/status              Get status
```

### Achievements
```
GET    /api/achievements/user      Get achievements
POST   /api/achievements/unlock    Unlock achievement
POST   /api/achievements/item/purchase   Buy item
```

---

## 🎨 UI Color Scheme

- **Primary**: `#FF6B6B` (Red) - Buttons, highlights
- **Secondary**: `#4ECDC4` (Teal) - Accents
- **Dark**: `#1A1A2E` - Text
- **Light**: `#F7F7F7` - Backgrounds

---

## 🧪 Test User Creation

### Manual Test
1. Go to http://localhost:5173
2. Click "Register"
3. Fill in form
4. Click "Create Account"
5. Complete profile setup
6. Do face verification
7. Browse matches

### Test Credentials
Once created, use to login

---

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env |
| MongoDB connection failed | Check URI and service running |
| Blank profiles | Complete profile setup first |
| No matches found | Update location in preferences |
| OAuth not working | Check client ID/secret in .env |
| Images not uploading | Configure Cloudinary credentials |

---

## 📊 Feature Matrix

| Feature | Status | Location |
|---------|--------|----------|
| Email Auth | ✅ | authController.js |
| OAuth (Google/FB) | ✅ | passport.js |
| Face Verification | ✅ | verificationController.js |
| Location Matching | ✅ | matching.js |
| Messaging | ✅ | messageController.js |
| Content Moderation | ✅ | moderation.js |
| Auto-Ban | ✅ | moderation.js |
| Achievements | ✅ | achievementController.js |
| Profile Management | ✅ | userController.js |
| Blocking | ✅ | matchController.js |

---

## 🔄 User Lifecycle

```
1. Register → Create user account
2. Verify → Confirm email
3. Setup → Add profile info
4. Verify → Face recognition
5. Browse → Find matches
6. Match → Mutual like
7. Chat → Send messages
8. Connect → Build relationship
```

---

## 💾 Database Schema Quick View

```javascript
// User
{
  email, password, firstName, lastName,
  bio, avatar, photos, gender, interestedIn,
  location, city, country,
  isVerified, faceVerified,
  points, level, achievements, items,
  matches, likes, createdAt
}

// Match
{
  userId1, userId2,
  compatibility, matchedAt,
  isActive, blockedBy
}

// Message
{
  sender, recipient, content,
  isFlagged, violationsDetected,
  isDeleted, createdAt, readAt
}

// Achievement
{
  name, description, icon,
  criteria, rewardPoints
}
```

---

## 🔐 Security Checklist

- [ ] MongoDB password strong
- [ ] JWT_SECRET is complex
- [ ] CORS whitelist updated
- [ ] OAuth IDs/secrets in .env
- [ ] No secrets in code
- [ ] Email SMTP configured
- [ ] Cloudinary API configured
- [ ] HTTPS enabled (production)

---

## 📱 Responsive Breakpoints

- **Mobile**: 0-640px
- **Tablet**: 641-1024px
- **Desktop**: 1025px+

All pages fully responsive using Tailwind CSS

---

## 🎯 Matching Algorithm Weights

```
Age Match        10%
Location         15%
Interest         10%
Verification     10%
Profile Quality  5%
Base Score       50%
= 100% Total
```

---

## 🚨 Moderation Thresholds

- **Violation Level 1**: Warning
- **Violation Level 2**: Monitoring
- **Violation Level 3**: Auto-ban

Violations tracked in messages and user account

---

## 📚 Documentation Files Breakdown

| File | Contains |
|------|----------|
| README.md | Overview & features |
| INSTALLATION.md | Step-by-step setup |
| FEATURES.md | Detailed features |
| API.md | All 32 endpoints |
| DEPLOYMENT.md | Deploy anywhere |
| PROJECT_SUMMARY.md | Technical overview |
| FILE_MANIFEST.md | All files listed |
| This file | Quick reference |

---

## 🔌 API Request Template

```javascript
// Example: Get matches
const getMatches = async () => {
  try {
    const response = await fetch('/api/matches', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data.matches);
  } catch (error) {
    console.error(error);
  }
};
```

---

## 🎮 Gamification Points

- Profile Complete: 10 pts
- First Match: 15 pts
- Email Verified: 50 pts
- Face Verified: 50 pts
- Photo Added: 10 pts
- Bio Written: 5 pts
- OAuth Connected: 10 pts

---

## 📈 Next Steps After Setup

1. **Customize Colors**: Update Tailwind config
2. **Add Logo**: Replace app title
3. **Configure Email**: Test email sending
4. **Setup OAuth**: Get credentials
5. **Configure Cloudinary**: Test uploads
6. **Deploy Backend**: Choose platform
7. **Deploy Frontend**: Choose platform
8. **Setup Domain**: Point to deployment
9. **Launch**: Go live!

---

## 🆘 Emergency Help

### Backend Won't Start
```bash
# Clear cache
rm -rf node_modules
npm cache clean --force
npm install
npm run dev
```

### Frontend Won't Build
```bash
# Clear and reinstall
rm -rf frontend/node_modules
npm install
npm run dev
```

### Database Issues
- Check MongoDB is running
- Verify connection string
- Check IP whitelisting (Atlas)

### Port Conflicts
```bash
# Windows - Find process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📞 Support Resources

- **MongoDB Docs**: docs.mongodb.com
- **Express Docs**: expressjs.com
- **React Docs**: react.dev
- **Tailwind Docs**: tailwindcss.com
- **Heroku Deploy**: devcenter.heroku.com
- **Vercel Deploy**: vercel.com/docs

---

## ✅ Launch Checklist

- [ ] Backend running on 5000
- [ ] Frontend running on 5173
- [ ] MongoDB connected
- [ ] Can register new account
- [ ] Can login
- [ ] Can upload photos
- [ ] Can see matches
- [ ] Can send messages
- [ ] Content moderation working
- [ ] No errors in console

**Once all checks pass, you're ready to deploy! 🚀**

---

*Keep this file handy for quick reference during development!*
