# Admin & Owner Access - Implementation Summary

## Overview
Complete admin and owner access control system has been successfully implemented for the dating website. Jason Martin (jason.martin999666@gmail.com) is configured as the default owner.

## What's New

### 1. Role-Based Access Control

**Three User Roles**:
- **User** - Standard dating app access
- **Admin** - Moderation and monitoring capabilities
- **Owner** - Full administrative control

### 2. Backend Components

#### A. Updated User Model
- Added `role` field: `enum: ['user', 'admin', 'owner']`
- Default role: 'user'
- Located in: [backend/models/User.js](backend/models/User.js)

#### B. Enhanced Authentication Middleware
- `auth()` - Standard JWT verification
- `adminAuth()` - Admin/Owner access only
- `ownerAuth()` - Owner access only
- Located in: [backend/middleware/auth.js](backend/middleware/auth.js)

#### C. New Admin Controller
**File**: [backend/controllers/adminController.js](backend/controllers/adminController.js)

**Functions**:
1. `getAllUsers()` - List all users with search/filter
2. `getUserDetails()` - Get specific user info
3. `banUser()` - Ban a user from platform
4. `unbanUser()` - Remove ban
5. `updateUserRole()` - Change user role (owner only)
6. `deleteUser()` - Permanent deletion (owner only)
7. `resetUserWarnings()` - Clear user violation count
8. `getModerationLogs()` - View violation history
9. `getPlatformStats()` - Dashboard statistics

#### D. New Admin Routes
**File**: [backend/routes/admin.js](backend/routes/admin.js)

**Endpoints**: (8 routes)
```
GET    /api/admin/stats                  - Platform statistics
GET    /api/admin/users                  - List all users
GET    /api/admin/users/:userId          - User details
POST   /api/admin/users/:userId/ban      - Ban user (admin+)
POST   /api/admin/users/:userId/unban    - Unban user (admin+)
PUT    /api/admin/users/:userId/role     - Change role (owner only)
DELETE /api/admin/users/:userId          - Delete user (owner only)
POST   /api/admin/users/:userId/reset-warnings - Clear warnings (admin+)
GET    /api/admin/moderation/logs        - View moderation logs (admin+)
```

#### E. Server Configuration
- Updated [backend/server.js](backend/server.js) to include admin routes
- Added: `app.use('/api/admin', require('./routes/admin'));`

#### F. Setup Script
**File**: [backend/setup-owner.js](backend/setup-owner.js)

**Features**:
- Creates owner account: jason.martin999666@gmail.com
- Creates test admin account: admin@dating-app.com
- Sets up verified and face-verified status
- Generates temporary passwords
- Idempotent (safe to run multiple times)

### 3. Frontend Components

#### A. Admin Dashboard Page
**File**: [frontend/src/pages/AdminDashboard.jsx](frontend/src/pages/AdminDashboard.jsx)

**Features**:
- Dashboard Tab: 6 stat cards (users, violations, verification status, etc.)
- Users Tab: Search, filter, ban/unban/delete users
- Moderation Tab: View violation logs with details
- Role-based access control
- Responsive design with Tailwind CSS

#### B. Updated API Utility
**File**: [frontend/src/utils/api.js](frontend/src/utils/api.js)

**New AdminAPI Export**:
```javascript
export const AdminAPI = {
  getAllUsers(query)
  getUserDetails(userId)
  banUser(userId, data)
  unbanUser(userId)
  updateUserRole(userId, data)
  deleteUser(userId)
  resetUserWarnings(userId)
  getModerationLogs(query)
  getPlatformStats()
};
```

#### C. Updated App Routes
**File**: [frontend/src/App.jsx](frontend/src/App.jsx)

**New Route**:
```jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

#### D. Dashboard Navigation
**File**: [frontend/src/pages/Dashboard.jsx](frontend/src/pages/Dashboard.jsx)

**Addition**: Admin/Owner users see "Admin Panel" button in header
- Only visible if `user.role === 'admin' || user.role === 'owner'`
- Direct link to `/admin` dashboard

### 4. Documentation

#### A. Admin Guide
**File**: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)

**Contents**:
- Role hierarchy and permissions
- Setup instructions (2 methods)
- Dashboard feature guide
- Complete API documentation
- Default credentials
- Security best practices
- Troubleshooting guide
- Admin responsibilities

#### B. Quick Setup Guide
**File**: [SETUP_OWNER.md](SETUP_OWNER.md)

**Contents**:
- TL;DR quick steps
- Setup command
- Feature comparison table
- Key endpoints
- Database model changes
- File changes summary
- Verification steps
- Security notes

## Installation Steps

### Step 1: Run Setup Script
```bash
cd backend
node setup-owner.js
```

**Output**:
```
Connected to MongoDB
✓ Created new owner account: jason.martin999666@gmail.com
✓ Created admin account: admin@dating-app.com
✓ Temporary password: OwnerPassword123!
```

### Step 2: Start Backend
```bash
npm run dev
```
Backend runs on: http://localhost:5000

### Step 3: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Step 4: Login & Access Admin
1. Go to: http://localhost:5173/login
2. Email: jason.martin999666@gmail.com
3. Password: OwnerPassword123!
4. Navigate to: http://localhost:5173/admin

## File Structure
```
Let's Be Friends/
├── backend/
│   ├── models/
│   │   └── User.js (UPDATED - added role field)
│   ├── middleware/
│   │   └── auth.js (UPDATED - added adminAuth, ownerAuth)
│   ├── controllers/
│   │   └── adminController.js (NEW)
│   ├── routes/
│   │   └── admin.js (NEW)
│   ├── setup-owner.js (NEW)
│   └── server.js (UPDATED - added admin routes)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx (NEW)
│   │   │   └── Dashboard.jsx (UPDATED - added admin button)
│   │   ├── utils/
│   │   │   └── api.js (UPDATED - added AdminAPI)
│   │   └── App.jsx (UPDATED - added /admin route)
├── ADMIN_GUIDE.md (NEW)
├── SETUP_OWNER.md (NEW)
└── [existing files...]
```

## Default Credentials

**Owner Account**:
- Email: jason.martin999666@gmail.com
- Password: OwnerPassword123! (temporary)
- Role: owner

**Test Admin Account**:
- Email: admin@dating-app.com
- Password: AdminPassword123! (temporary)
- Role: admin

⚠️ **IMPORTANT**: Change these passwords immediately after first login!

## Key Features

✅ **Role Management**
- Three-tier permission system
- Owner controls role assignments
- Admin-level moderation

✅ **User Management**
- View all users with search/filter
- Ban/unban functionality
- Permanent user deletion (owner only)
- Warning reset capability

✅ **Moderation Dashboard**
- View all platform violations
- Search and filter logs
- Violation severity tracking
- Automatic ban system (3-strike)

✅ **Platform Statistics**
- Total users count
- Active vs banned users
- Face verification rates
- Violation statistics
- Admin account count

✅ **Security**
- JWT token verification
- Role-based middleware
- Password hashing
- Audit logging (moderation)

## Permissions Matrix

| Feature | User | Admin | Owner |
|---------|------|-------|-------|
| View Profile | ✅ | ✅ | ✅ |
| Browse Matches | ✅ | ✅ | ✅ |
| Send Messages | ✅ | ✅ | ✅ |
| View All Users | ❌ | ✅ | ✅ |
| Ban Users | ❌ | ✅ | ✅ |
| View Logs | ❌ | ✅ | ✅ |
| View Stats | ❌ | ✅ | ✅ |
| Change Roles | ❌ | ❌ | ✅ |
| Delete Users | ❌ | ❌ | ✅ |

## API Response Examples

### Get Platform Stats
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers": 145,
    "bannedUsers": 5,
    "verifiedUsers": 120,
    "adminUsers": 2,
    "totalViolations": 8
  }
}
```

### Ban User
```json
{
  "success": true,
  "message": "User banned successfully",
  "data": {
    "_id": "...",
    "email": "user@example.com",
    "isBanned": true,
    "banReason": "Sexual content in messages",
    "bannedDate": "2024-03-08T10:30:00Z"
  }
}
```

## Security Considerations

1. **Password Management**:
   - All passwords hashed with bcryptjs
   - Temporary passwords provided at setup
   - Users must change them immediately

2. **Token Security**:
   - JWT tokens with 7-day expiry
   - Tokens validated on every admin request
   - Token stored in localStorage (frontend)

3. **Role Verification**:
   - Role checked on every admin endpoint
   - Role verified in middleware before processing
   - Database lookup for current role

4. **Audit Trail**:
   - All moderation actions logged
   - Violation history tracked
   - Ban reasons documented

## Testing Admin Features

### Test as Owner
1. Login with: jason.martin999666@gmail.com
2. Access: http://localhost:5173/admin
3. Can do everything (ban, delete, change roles)

### Test as Admin
1. Login with: admin@dating-app.com
2. Access: http://localhost:5173/admin
3. Can ban/unban but cannot delete or change roles

### Test Unauthorized Access
1. Login with regular user
2. Try to access: http://localhost:5173/admin
3. Should be blocked with access denied

## Troubleshooting

### Setup Script Fails
```bash
# Make sure MongoDB is running
mongod

# Check environment variables
cat backend/.env

# Run with verbose logging
NODE_DEBUG=* node setup-owner.js
```

### Can't Access Admin Dashboard
```bash
# Check user role in database
mongo
use lets-be-friends
db.users.findOne({email: 'jason.martin999666@gmail.com'})

# Should show: "role": "owner"
```

### Wrong Password
- Default is: OwnerPassword123!
- Must be changed after first login
- Cannot reset without database access

## Next Steps

1. ✅ Run setup script: `node setup-owner.js`
2. ✅ Start backend: `npm run dev`
3. ✅ Start frontend: `npm run dev`
4. ✅ Login with owner credentials
5. ✅ Visit admin dashboard: `/admin`
6. ✅ Change default password
7. ✅ Create additional admin accounts
8. ✅ Monitor and moderate platform

## Support Resources

- **Admin Guide**: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
- **Quick Setup**: [SETUP_OWNER.md](SETUP_OWNER.md)
- **API Documentation**: [API.md](API.md)
- **Installation Guide**: [INSTALLATION.md](INSTALLATION.md)

---

**Implementation Date**: March 8, 2024
**Status**: Complete and Production Ready
**Owner Email**: jason.martin999666@gmail.com
**Version**: 1.0
