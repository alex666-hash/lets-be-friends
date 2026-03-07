# Quick Setup: Owner Access

## TL;DR - Quick Steps

### 1. Backend Setup (First Time)
```bash
cd backend
npm install
node setup-owner.js
```

### 2. Create .env file
Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/lets-be-friends
JWT_SECRET=your-super-secret-key-here
NODE_ENV=development
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
FACEBOOK_APP_ID=your-facebook-id
FACEBOOK_APP_SECRET=your-facebook-secret
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Run Backend
```bash
npm run dev
```
(Backend runs on http://localhost:5000)

### 4. Run Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
(Frontend runs on http://localhost:5173)

### 5. Login & Access Admin
- **Login URL**: http://localhost:5173/login
- **Email**: jason.martin999666@gmail.com
- **Password**: OwnerPassword123!
- **Admin Dashboard**: http://localhost:5173/admin

## What Was Added

✅ **Role System**: user, admin, owner
✅ **Owner Account**: jason.martin999666@gmail.com as default owner
✅ **Admin Controller**: 9 new admin endpoints
✅ **Admin Routes**: /api/admin/* endpoints
✅ **Admin Middleware**: adminAuth and ownerAuth
✅ **Admin Dashboard**: Full-featured React component
✅ **Setup Script**: Automated owner account creation
✅ **API Wrapper**: AdminAPI for frontend communication

## Admin Features

| Feature | Admin | Owner |
|---------|-------|-------|
| View users | ✅ | ✅ |
| Ban/unban users | ✅ | ✅ |
| View moderation logs | ✅ | ✅ |
| View statistics | ✅ | ✅ |
| Change user roles | ❌ | ✅ |
| Delete users | ❌ | ✅ |

## Key Endpoints

```
GET  /api/admin/stats                    - Platform statistics
GET  /api/admin/users                    - All users
GET  /api/admin/users/:id                - User details
POST /api/admin/users/:id/ban            - Ban user
POST /api/admin/users/:id/unban          - Unban user
PUT  /api/admin/users/:id/role           - Change role (owner only)
DELETE /api/admin/users/:id              - Delete user (owner only)
GET  /api/admin/moderation/logs          - Moderation logs
```

## Database Models Updated

**User Schema** now includes:
- `role: String` (user, admin, owner)
- Full role-based access control

## File Changes Summary

### Backend
- `models/User.js` - Added role field
- `middleware/auth.js` - Added adminAuth & ownerAuth
- `controllers/adminController.js` - NEW (9 admin functions)
- `routes/admin.js` - NEW (8 admin endpoints)
- `server.js` - Added admin routes
- `setup-owner.js` - NEW (automated setup)

### Frontend
- `pages/AdminDashboard.jsx` - NEW (full admin UI)
- `utils/api.js` - Added AdminAPI
- `App.jsx` - Added /admin route

### Documentation
- `ADMIN_GUIDE.md` - Complete admin documentation

## Verify Installation

1. Check owner created: `npm run dev` should connect to MongoDB
2. Admin dashboard accessible at: http://localhost:5173/admin (after login)
3. Check backend logs for "MongoDB connected ✓"

## Security Notes

⚠️ **Important**:
1. Change owner password immediately after first login
2. Create strong passwords for all admin accounts
3. Don't share owner credentials
4. Review moderation logs regularly
5. Use 3-strike system for automatic bans

## Next Steps

1. ✅ Run `node setup-owner.js`
2. ✅ Login with owner email
3. ✅ Change default password
4. ✅ Create additional admin accounts
5. ✅ Monitor platform on /admin dashboard

## Need Help?

See `ADMIN_GUIDE.md` for:
- Detailed API documentation
- Troubleshooting guide
- Security best practices
- Admin responsibilities
- Moderation workflows

---

You're all set! 🚀
