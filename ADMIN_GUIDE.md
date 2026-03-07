# Admin & Owner Access Guide

## Overview
The dating application now includes a comprehensive admin and owner access system for platform management, user moderation, and statistics tracking.

## Role Hierarchy

### Owner
- **Email**: jason.martin999666@gmail.com (by default)
- **Permissions**:
  - All admin permissions
  - Change user roles (promote to admin/owner or demote to user)
  - Delete user accounts permanently
  - Full access to all admin functions

### Admin
- **Permissions**:
  - View all users and their details
  - Ban/unban users
  - View and manage moderation logs
  - View platform statistics
  - Reset user warnings
  - Cannot change roles or delete users (owner only)

### User
- **Permissions**:
  - Standard dating app features
  - Cannot access any admin functions

## Setting Up the Owner Account

### Method 1: Automatic Setup (Recommended)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the setup script:
   ```bash
   node setup-owner.js
   ```

3. The script will:
   - Connect to MongoDB
   - Create or update the owner account
   - Create a test admin account
   - Display credentials in the console

### Method 2: Manual Setup

1. Start your MongoDB server
2. Run the Node.js REPL:
   ```bash
   node
   ```

3. Execute:
   ```javascript
   const mongoose = require('mongoose');
   const bcrypt = require('bcryptjs');
   const User = require('./models/User');

   mongoose.connect('mongodb://localhost:27017/lets-be-friends');

   async function setup() {
     const hashedPassword = await bcrypt.hash('YourPassword123!', 10);
     const user = await User.create({
       email: 'jason.martin999666@gmail.com',
       password: hashedPassword,
       username: 'owner',
       role: 'owner',
       isVerified: true,
       faceVerified: true
     });
     console.log('Owner created:', user);
   }

   setup();
   ```

## Admin Dashboard Features

### Dashboard Tab
- **Total Users**: Count of all registered users
- **Active Users**: Non-banned users
- **Banned Users**: Users with active bans
- **Verified Users**: Users who passed face verification
- **Total Violations**: Content moderation violations
- **Admin Users**: Number of admin accounts

### Users Tab
- **Search Functionality**: Find users by email or username
- **Filter by Role**: View users by role (admin, user, owner)
- **User Actions**:
  - Ban User: Prevent access to the platform
  - Unban User: Restore access for banned users
  - Delete User: Permanently remove user (owner only)

### Moderation Tab
- **Violation Logs**: Track all content violations
- **Severity Levels**: View violation severity
- **User History**: See which users have violations
- **Automatic Banning**: 3-strike system triggers automatic ban

## API Endpoints

### Admin Routes (Require Admin or Owner Access)

#### Get Platform Statistics
```
GET /api/admin/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "bannedUsers": 5,
    "verifiedUsers": 120,
    "adminUsers": 2,
    "totalViolations": 8,
    "activeUsers": 145
  }
}
```

#### Get All Users
```
GET /api/admin/users?role=user&search=john&status=active
Authorization: Bearer <token>

Query Parameters:
- role: 'user' | 'admin' | 'owner'
- search: Search term for email/username
- status: 'banned' | 'active' | 'inactive'

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "email": "user@example.com",
      "username": "john123",
      "role": "user",
      "isBanned": false,
      "faceVerified": true,
      ...
    }
  ]
}
```

#### Get User Details
```
GET /api/admin/users/:userId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Ban User (Admin+)
```
POST /api/admin/users/:userId/ban
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "reason": "Sexual content in messages"
}

Response:
{
  "success": true,
  "message": "User banned successfully",
  "data": { ... }
}
```

#### Unban User (Admin+)
```
POST /api/admin/users/:userId/unban
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "User unbanned successfully",
  "data": { ... }
}
```

#### Update User Role (Owner Only)
```
PUT /api/admin/users/:userId/role
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "role": "admin"
}

Roles: 'user' | 'admin' | 'owner'

Response:
{
  "success": true,
  "message": "User role updated",
  "data": { ... }
}
```

#### Delete User (Owner Only)
```
DELETE /api/admin/users/:userId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "User deleted permanently"
}
```

#### Reset User Warnings (Admin+)
```
POST /api/admin/users/:userId/reset-warnings
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "User warnings reset",
  "data": { ... }
}
```

#### Get Moderation Logs
```
GET /api/admin/moderation/logs?userId=...&type=sexual_content&page=1&limit=50
Authorization: Bearer <token>

Query Parameters:
- userId: Filter by user
- type: Violation type
- page: Page number (default: 1)
- limit: Results per page (default: 50)

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": { ... },
      "violationType": "sexual_content",
      "reason": "Explicit language in message",
      "severity": "high",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

## Accessing the Admin Dashboard

1. **Login** with your owner/admin account
2. **Navigate** to: `http://localhost:5173/admin`
3. The dashboard will verify your role and show appropriate controls

## Default Credentials

After running `setup-owner.js`:

### Owner Account
- **Email**: jason.martin999666@gmail.com
- **Password**: OwnerPassword123! (temporary - change immediately)

### Admin Account (Test)
- **Email**: admin@dating-app.com
- **Password**: AdminPassword123! (temporary - change immediately)

## Security Best Practices

1. **Change Passwords**: Always change default passwords immediately after setup
2. **Role Assignment**: Only assign admin roles to trusted personnel
3. **Owner Account**: Protect the owner account with a strong password
4. **Token Security**: JWT tokens are secure; don't share them
5. **Audit Logs**: Review moderation logs regularly
6. **User Reports**: Investigate user reports for violations
7. **Ban Carefully**: Document reasons for user bans
8. **Verification**: Ensure admins verify face before granting full access

## Moderation Workflow

1. **Detection**: Content moderation system detects violations
2. **Logging**: Violation logged in ContentModerationLog
3. **Escalation**: 
   - 1st violation: Warning logged
   - 2nd violation: Warning logged
   - 3rd violation: Automatic ban applied
4. **Admin Review**: Admins can review logs and override
5. **Appeals**: Users can contact owner for ban appeals

## Admin Responsibilities

### Daily Tasks
- Review new moderation violations
- Ban users violating terms
- Respond to user reports
- Monitor platform statistics

### Weekly Tasks
- Review user activity trends
- Check for ban appeals
- Verify face verification queue
- Audit admin account activities

### Monthly Tasks
- Generate platform reports
- Review role assignments
- Update security measures
- Plan feature improvements

## Troubleshooting

### "Admin access required" Error
- Check that user's role is 'admin' or 'owner'
- Verify JWT token is valid
- Re-login to get fresh token

### Owner Account Not Created
- Verify MongoDB is running
- Check .env has correct MONGODB_URI
- Run: `npm install` in backend first
- Check console for specific errors

### Can't Access Admin Dashboard
- Verify URL is `/admin` (not `/admin-dashboard`)
- Check browser console for errors
- Verify user is logged in
- Check user role in database: `db.users.findOne({email: '...'})`

## Environment Variables Required

```
MONGODB_URI=mongodb://localhost:27017/lets-be-friends
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Next Steps

1. Run `node setup-owner.js` to create accounts
2. Login with owner credentials
3. Change password in profile settings
4. Create additional admin accounts as needed
5. Start monitoring the platform

## Support

For issues or questions about admin features:
1. Check the troubleshooting section above
2. Review API.md for endpoint details
3. Check backend logs for errors
4. Contact the development team

---

**Last Updated**: March 2024
**Version**: 1.0
