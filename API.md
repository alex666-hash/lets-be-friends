# API Documentation - Let's Be Friends

## Base URL
```
http://localhost:5000/api
```

## Authentication
Include JWT token in headers:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register
**POST** `/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isVerified": false,
    "faceVerified": false,
    "points": 0,
    "level": 1
  }
}
```

---

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

---

### Get Current User
**GET** `/auth/me`

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "success": true,
  "user": { ... }
}
```

---

## 👥 User Endpoints

### Get User Profile
**GET** `/users/:userId`

Response (200):
```json
{
  "success": true,
  "user": { ... },
  "profileCompleteness": 85
}
```

---

### Update Profile
**PUT** `/users/profile/update`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Adventure seeker...",
  "gender": "male",
  "interestedIn": "female",
  "dateOfBirth": "1990-01-15",
  "preferences": {
    "ageRange": { "min": 25, "max": 35 },
    "distanceRange": 50
  }
}
```

Response (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... },
  "profileCompleteness": 90
}
```

---

### Update Location
**PUT** `/users/location/update`

Request:
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "city": "New York",
  "state": "NY",
  "country": "USA"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Location updated successfully",
  "user": { ... }
}
```

---

### Upload Avatar
**POST** `/users/avatar/upload`

Headers: `Authorization: Bearer <token>`
Content-Type: `multipart/form-data`

Files:
- `avatar`: image file (max 5MB)

Response (200):
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "user": { ... }
}
```

---

### Upload Photos
**POST** `/users/photos/upload`

Headers: `Authorization: Bearer <token>`
Content-Type: `multipart/form-data`

Files:
- `photos`: multiple image files (max 20 files)

Response (200):
```json
{
  "success": true,
  "message": "Photos uploaded successfully",
  "user": { ... }
}
```

---

### Search Users
**GET** `/users/search`

Query Parameters:
- `firstName` (optional)
- `city` (optional)
- `gender` (optional): 'male', 'female'

Example: `/users/search?city=New+York&gender=female`

Response (200):
```json
{
  "success": true,
  "users": [ { ... }, { ... } ]
}
```

---

### Like User
**POST** `/users/like`

Request:
```json
{
  "targetUserId": "507f1f77bcf86cd799439012"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Like updated successfully"
}
```

---

## 💘 Matching Endpoints

### Get User Matches
**GET** `/matches`

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "success": true,
  "matches": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId1": { ... },
      "userId2": { ... },
      "compatibility": 85,
      "matchedAt": "2024-01-15T10:30:00Z",
      "isActive": true
    }
  ]
}
```

---

### Find Potential Matches
**GET** `/matches/potential`

Response (200):
```json
{
  "success": true,
  "matches": [
    {
      "user": { ... },
      "compatibility": 82
    }
  ]
}
```

---

### Create Match
**POST** `/matches`

Request:
```json
{
  "targetUserId": "507f1f77bcf86cd799439012"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Match created successfully",
  "match": { ... }
}
```

---

### Block User
**POST** `/matches/block`

Request:
```json
{
  "targetUserId": "507f1f77bcf86cd799439012"
}
```

Response (200):
```json
{
  "success": true,
  "message": "User blocked successfully"
}
```

---

## 💬 Message Endpoints

### Get Messages
**GET** `/messages/:targetUserId`

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "success": true,
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "sender": { ... },
      "recipient": { ... },
      "content": "Hey! How are you?",
      "violationsDetected": [],
      "isFlagged": false,
      "createdAt": "2024-01-15T10:35:00Z",
      "readAt": null
    }
  ]
}
```

---

### Send Message
**POST** `/messages`

Request:
```json
{
  "recipientId": "507f1f77bcf86cd799439012",
  "content": "Hey! How are you?"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": { ... }
}
```

Possible Error (400):
```json
{
  "success": false,
  "message": "Message contains prohibited content",
  "violations": ["sexual_content"]
}
```

---

### Delete Message
**DELETE** `/messages/:messageId`

Response (200):
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

### Mark Message as Read
**PUT** `/messages/:messageId/read`

Response (200):
```json
{
  "success": true,
  "message": "Message marked as read"
}
```

---

## ✅ Verification Endpoints

### Generate Verification Token
**POST** `/verification/token/generate`

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "success": true,
  "token": "abc123def456...",
  "message": "Verification token generated"
}
```

---

### Submit Face Verification
**POST** `/verification/face/submit`

Headers: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

Files:
- `images`: 2+ face photos

Response (200):
```json
{
  "success": true,
  "message": "Face verification submitted successfully",
  "user": { 
    "faceVerified": true,
    "isVerified": true,
    "points": 50
  }
}
```

---

### Get Verification Status
**GET** `/verification/status`

Response (200):
```json
{
  "success": true,
  "verification": {
    "isVerified": true,
    "faceVerified": true,
    "verificationDate": "2024-01-15T10:40:00Z",
    "imagesSubmitted": 3
  }
}
```

---

## 🏆 Achievement Endpoints

### Get User Achievements
**GET** `/achievements/user`

Response (200):
```json
{
  "success": true,
  "achievements": [ { ... } ],
  "items": [ { ... } ],
  "points": 150,
  "level": 2
}
```

---

### Get All Achievements
**GET** `/achievements`

Response (200):
```json
{
  "success": true,
  "achievements": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Profile Complete",
      "description": "Complete all profile fields",
      "icon": "https://...",
      "criteria": "profile_complete",
      "rewardPoints": 10
    }
  ]
}
```

---

### Unlock Achievement
**POST** `/achievements/unlock`

Request:
```json
{
  "achievementId": "507f1f77bcf86cd799439015"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Achievement unlocked",
  "user": { 
    "achievements": [ ... ],
    "points": 160,
    "level": 2
  }
}
```

---

### Get All Items
**GET** `/achievements/items`

Response (200):
```json
{
  "success": true,
  "items": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Golden Badge",
      "description": "Rare golden profile badge",
      "icon": "https://...",
      "type": "badge",
      "rarity": "rare",
      "cost": 100,
      "costType": "points"
    }
  ]
}
```

---

### Purchase Item
**POST** `/achievements/item/purchase`

Request:
```json
{
  "itemId": "507f1f77bcf86cd799439016"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Item purchased successfully",
  "user": { ... }
}
```

---

## 🚨 Moderation Endpoints

### Report User
**POST** `/moderation/report`

Request:
```json
{
  "targetUserId": "507f1f77bcf86cd799439012",
  "reason": "sexual_content",
  "details": "User sent inappropriate messages"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Report submitted successfully"
}
```

---

### Get Moderation Logs (Admin)
**GET** `/moderation/logs`

Response (200):
```json
{
  "success": true,
  "logs": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "userId": { ... },
      "messageId": "507f1f77bcf86cd799439014",
      "violationType": "sexual_content",
      "severity": "high",
      "action": "message_deleted",
      "createdAt": "2024-01-15T10:45:00Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Your account is banned"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- Auth endpoints: 5 requests per minute
- API endpoints: 100 requests per minute
- Message endpoints: 50 requests per minute

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

This API is built with RESTful principles and is production-ready!
