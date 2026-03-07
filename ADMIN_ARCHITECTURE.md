# Admin System Architecture & Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     DATING WEBSITE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐       ┌─────────────────────┐   │
│  │   FRONTEND (React)   │       │   BACKEND (Node.js) │   │
│  ├──────────────────────┤       ├─────────────────────┤   │
│  │                      │       │                     │   │
│  │ Pages:               │◄────►│ API Routes:         │   │
│  │ • Login              │ HTTP  │ • /auth             │   │
│  │ • Register           │       │ • /users            │   │
│  │ • Dashboard          │       │ • /matches          │   │
│  │ • Messages           │       │ • /messages         │   │
│  │ • AdminDashboard ⭐  │       │ • /admin ⭐        │   │
│  │                      │       │                     │   │
│  │ Store:               │       │ Models:             │   │
│  │ • authStore          │       │ • User (+ role)     │   │
│  │ • matchStore         │       │ • Match             │   │
│  │                      │       │ • Message           │   │
│  │ API:                 │       │ • Achievement       │   │
│  │ • AdminAPI ⭐       │       │                     │   │
│  └──────────────────────┘       └─────────────────────┘   │
│         Port: 5173                   Port: 5000             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MONGODB DATABASE                        │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Collections:                                         │  │
│  │ • Users (+ role field)                              │  │
│  │ • Matches                                           │  │
│  │ • Messages                                          │  │
│  │ • Achievements                                      │  │
│  │ • Items                                             │  │
│  │ • ContentModerationLog                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication & Authorization Flow

```
1. USER REGISTERS/LOGINS
   ↓
   ┌─────────────────────────────┐
   │ Email + Password            │
   └────────────┬────────────────┘
                │
                ▼
   ┌─────────────────────────────┐
   │ Backend: /auth/register     │
   │ or /auth/login              │
   └────────────┬────────────────┘
                │
                ▼
   ┌─────────────────────────────┐
   │ Hash Password (bcryptjs)    │
   │ Create JWT Token            │
   │ Return Token + User Data    │
   └────────────┬────────────────┘
                │
                ▼
   ┌─────────────────────────────┐
   │ Frontend: Store JWT in      │
   │ localStorage                │
   │ Store User in authStore     │
   └────────────┬────────────────┘
                │
                ▼
   ┌─────────────────────────────┐
   │ Include JWT in Headers:     │
   │ "Authorization: Bearer ..." │
   └────────────┬────────────────┘
                │
                ▼
   ┌─────────────────────────────┐
   │ ADMIN ROUTES:               │
   │ Middleware checks:          │
   │ 1. JWT valid?               │
   │ 2. User role = admin/owner? │
   │ 3. Allow access             │
   └─────────────────────────────┘
```

---

## 👥 Role Hierarchy

```
                    ┌─────────┐
                    │  OWNER  │ ⭐ Full Control
                    │ @gmail  │  Delete users
                    │         │  Change roles
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │  ADMIN   │ ⭐ Moderate
                    │          │  Ban users
                    │          │  View logs
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │   USER   │ Browse/Chat
                    │          │ Limited access
                    └─────────┘
```

---

## 🔄 Admin Dashboard Data Flow

```
┌──────────────────────────────────────┐
│  Admin User Opens Dashboard          │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Check User Role (adminAuth)         │
├──────────────────────────────────────┤
│  role === 'admin' || role === 'owner'?
│  ✅ YES → Continue                  │
│  ❌ NO → Access Denied               │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Load Dashboard Data                 │
├──────────────────────────────────────┤
│  • GET /api/admin/stats              │
│  • GET /api/admin/users              │
│  • GET /api/admin/moderation/logs    │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Display Three Tabs                  │
├──────────────────────────────────────┤
│  1. Dashboard (Statistics)           │
│  2. Users (Management)               │
│  3. Moderation (Violations)          │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Admin Actions:                      │
├──────────────────────────────────────┤
│  • Ban User: POST /admin/users/ban   │
│  • Delete User: DELETE /admin/users  │
│  • Change Role: PUT /admin/users/... │
│  • Search/Filter Users               │
└──────────────────────────────────────┘
```

---

## 📊 Database Schema - User Model

```
User Collection
├── _id: ObjectId
├── email: String (unique)
├── password: String (hashed)
├── username: String
├── firstName: String
├── lastName: String
├── dateOfBirth: Date
├── gender: String
├── interestedIn: String
├── bio: String
├── avatar: String (URL)
├── photos: [String]
├── location: {
│   type: "Point",
│   coordinates: [longitude, latitude]
├── city: String
├── state: String
├── country: String
├── shareLocation: Boolean
├── isVerified: Boolean
├── faceVerified: Boolean
├── role: String (user|admin|owner) ⭐ NEW
├── isActive: Boolean
├── isBanned: Boolean
├── banReason: String
├── bannedDate: Date
├── authProviders: {
│   google: String,
│   facebook: String,
│   tiktok: String,
│   instagram: String
├── contentWarnings: Number
├── achievements: [ObjectId]
├── items: [ObjectId]
├── points: Number
├── level: Number
└── createdAt: Date
```

---

## 🌐 API Endpoints Structure

```
/api/admin
├─ GET    /stats                      - Platform statistics
├─ GET    /users                      - List all users
├─ GET    /users/:userId              - User details
├─ POST   /users/:userId/ban          - Ban user
├─ POST   /users/:userId/unban        - Unban user
├─ PUT    /users/:userId/role         - Change role (owner)
├─ DELETE /users/:userId              - Delete user (owner)
├─ POST   /users/:userId/reset-warnings - Clear warnings
└─ GET    /moderation/logs            - View logs
```

---

## 🔐 Middleware Protection

```
┌──────────────────────────────┐
│  Request to /api/admin/*     │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│  adminAuth Middleware        │
├──────────────────────────────┤
│  1. Extract JWT token        │
│  2. Verify token signature   │
│  3. Decode user ID           │
│  4. Fetch user from DB       │
│  5. Check role:              │
│     - 'admin' ✅             │
│     - 'owner' ✅             │
│     - 'user'  ❌ Reject      │
└────────────┬─────────────────┘
             │
             ▼
         ✅ ALLOWED or ❌ DENIED
```

---

## 🎯 Request/Response Flow

```
EXAMPLE: Get All Users

┌─────────────────┐
│  FRONTEND       │
│  AdminAPI.      │
│  getAllUsers()  │
└────────┬────────┘
         │
         │ GET /api/admin/users
         │ Authorization: Bearer JWT_TOKEN
         │
         ▼
┌─────────────────────┐
│  BACKEND            │
│  adminAuth Check    │
│  ✅ Token valid     │
│  ✅ Role = admin    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  adminController    │
│  getAllUsers()      │
│  • Query: {}        │
│  • Find in MongoDB  │
│  • Exclude pwd      │
│  • Return users     │
└────────┬────────────┘
         │
         │ Response:
         │ {
         │   success: true,
         │   data: [...]
         │ }
         │
         ▼
┌─────────────────┐
│  FRONTEND       │
│  Display list   │
│  Update state   │
└─────────────────┘
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────────┐
│         SECURITY ARCHITECTURE                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. FRONTEND LAYER                                  │
│     ├─ ProtectedRoute component                     │
│     ├─ Check user authentication                    │
│     ├─ Check user role for /admin access           │
│     └─ Prevent unauthorized navigation              │
│                                                     │
│  2. REQUEST LAYER                                   │
│     ├─ CORS protection                              │
│     ├─ Helmet security headers                      │
│     ├─ Input validation (Joi)                       │
│     └─ Rate limiting (recommended)                  │
│                                                     │
│  3. AUTHENTICATION LAYER                            │
│     ├─ JWT token verification                       │
│     ├─ Token expiration (7 days)                    │
│     ├─ Bearer token extraction                      │
│     └─ Token signature validation                   │
│                                                     │
│  4. AUTHORIZATION LAYER                             │
│     ├─ adminAuth middleware                         │
│     ├─ ownerAuth middleware                         │
│     ├─ Role verification in DB                      │
│     └─ Endpoint-level checks                        │
│                                                     │
│  5. DATA LAYER                                      │
│     ├─ Password hashing (bcryptjs)                  │
│     ├─ MongoDB geospatial indexing                  │
│     ├─ No password in responses                     │
│     └─ Audit logging (moderation)                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📱 Component Hierarchy

```
App.jsx
├─ ToastContainer
├─ Router
│  ├─ Public Routes
│  │  ├─ /login
│  │  └─ /register
│  └─ Protected Routes
│     ├─ /profile-setup
│     ├─ /verification
│     ├─ /dashboard (Dashboard.jsx)
│     │  └─ [Admin Panel Button] ⭐
│     ├─ /messages
│     └─ /admin (AdminDashboard.jsx) ⭐
│        ├─ Header
│        ├─ Navigation Tabs
│        ├─ Dashboard Tab (Stats Cards)
│        ├─ Users Tab (User Table)
│        └─ Moderation Tab (Logs)
```

---

## 🔀 State Management

```
Frontend State Management

Zustand Stores:
├─ authStore
│  ├─ token
│  ├─ user (now includes role!)
│  ├─ register()
│  ├─ login()
│  ├─ logout()
│  └─ fetchCurrentUser()
│
├─ matchStore
│  ├─ matches
│  ├─ potentialMatches
│  ├─ getMatches()
│  ├─ findPotentialMatches()
│  └─ createMatch()
│
└─ [Potential: adminStore] (for admin features)
   ├─ users
   ├─ stats
   ├─ logs
   ├─ getAllUsers()
   ├─ getPlatformStats()
   └─ getModerationLogs()
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│              PRODUCTION DEPLOYMENT                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────┐        ┌──────────────┐        │
│  │ Frontend      │        │  Backend     │        │
│  │ (Vercel/     │◄──────►│ (Heroku/     │        │
│  │  Netlify)     │ HTTPS  │  Railway)    │        │
│  └───────────────┘        └──────┬───────┘        │
│                                   │                │
│  Admin URL:                       │                │
│  yourdomain.com/admin             │                │
│                                   │                │
│                          ┌────────▼────────┐      │
│                          │ MongoDB Atlas   │      │
│                          │ (Cloud DB)      │      │
│                          │ Collections:    │      │
│                          │ • users         │      │
│                          │ • matches       │      │
│                          │ • messages      │      │
│                          │ • etc.          │      │
│                          └─────────────────┘      │
│                                                    │
└─────────────────────────────────────────────────────┘
```

---

## 📈 Typical Admin Workflow

```
1. LOGIN
   Email: jason.martin999666@gmail.com
   Password: OwnerPassword123!
   ↓
2. DASHBOARD
   View statistics
   - Total users: 150
   - Violations: 8
   - Verified: 120
   ↓
3. USERS TAB
   Search for problematic user
   Review user details
   ↓
4. ACTION
   Ban user or change role
   ↓
5. MODERATION TAB
   View violation logs
   Track user history
   ↓
6. REPEAT
   Monitor other users
```

---

## 📊 File Organization

```
Project Structure:

backend/
├─ models/
│  └─ User.js (UPDATED)
├─ middleware/
│  └─ auth.js (UPDATED) ⭐
├─ controllers/
│  └─ adminController.js (NEW) ⭐
├─ routes/
│  └─ admin.js (NEW) ⭐
├─ setup-owner.js (NEW) ⭐
└─ server.js (UPDATED)

frontend/
├─ src/pages/
│  ├─ AdminDashboard.jsx (NEW) ⭐
│  └─ Dashboard.jsx (UPDATED)
├─ src/utils/
│  └─ api.js (UPDATED) ⭐
└─ src/App.jsx (UPDATED)

Documentation/ ⭐
├─ START_HERE_ADMIN.md
├─ README_ADMIN.md
├─ SETUP_OWNER.md
├─ ADMIN_GUIDE.md
├─ ADMIN_IMPLEMENTATION.md
├─ ADMIN_CHECKLIST.md
├─ ADMIN_DOCS_INDEX.md
└─ ADMIN_ARCHITECTURE.md (this file)
```

---

**Architecture Diagram Created**: March 8, 2024
**Version**: 1.0
**Status**: Complete
