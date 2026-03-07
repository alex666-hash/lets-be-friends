# Let's Be Friends - Dating Website

A modern, feature-rich web-based dating platform with AI-powered face verification, intelligent matching, and comprehensive safety features.

## Features

### ✨ Core Features
- **Account Creation**: Email, Google, Facebook, TikTok, and Instagram authentication
- **Face AI Verification**: Advanced face recognition for identity verification
- **Location-Based Matching**: Smart matching algorithm based on user location and preferences
- **Real-time Messaging**: Chat with matches with automatic content moderation
- **Achievement System**: Gamification with badges, levels, and rewards
- **Premium Items**: Collectible items and cosmetics system

### 🛡️ Safety & Moderation
- **Automatic Content Moderation**: AI-powered detection of sexual content and offensive language
- **Auto-Ban System**: Automatic account suspension for content violations
- **User Reporting**: Report inappropriate behavior
- **Message Verification**: Real-time message scanning
- **Verification Badges**: Display verified and face-verified users

### 🎮 Gamification
- **Achievement Badges**: Unlock achievements through various activities
- **Point System**: Earn points for profile completion, verification, matches
- **Level System**: Progress through levels
- **Items & Themes**: Unlock and purchase cosmetic items

## Tech Stack

### Backend
- **Node.js** + **Express.js**: REST API server
- **MongoDB**: NoSQL database
- **Passport.js**: OAuth authentication
- **JWT**: Token-based authentication
- **Cloudinary**: Image storage and processing
- **Nodemailer**: Email notifications

### Frontend
- **React 18**: UI framework
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **Axios**: HTTP client
- **React Router**: Navigation

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- OAuth credentials (Google, Facebook, TikTok, Instagram)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
Edit `.env` and add:
- MongoDB URI
- JWT Secret
- OAuth credentials
- Cloudinary credentials
- Email configuration
- Frontend URL

5. **Start the server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/facebook` - Facebook OAuth
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile/update` - Update profile
- `PUT /api/users/location/update` - Update location
- `POST /api/users/avatar/upload` - Upload avatar
- `POST /api/users/photos/upload` - Upload photos
- `GET /api/users/search` - Search users
- `POST /api/users/like` - Like a user

### Matches
- `GET /api/matches` - Get user matches
- `GET /api/matches/potential` - Find potential matches
- `POST /api/matches` - Create match
- `POST /api/matches/block` - Block user
- `POST /api/matches/unblock` - Unblock user

### Messages
- `GET /api/messages/:targetUserId` - Get messages
- `POST /api/messages` - Send message
- `DELETE /api/messages/:messageId` - Delete message
- `PUT /api/messages/:messageId/read` - Mark as read

### Verification
- `POST /api/verification/token/generate` - Generate verification token
- `POST /api/verification/face/submit` - Submit face verification
- `GET /api/verification/status` - Get verification status

### Achievements
- `GET /api/achievements/user` - Get user achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/items` - Get all items
- `POST /api/achievements/unlock` - Unlock achievement
- `POST /api/achievements/item/purchase` - Purchase item

### Moderation
- `POST /api/moderation/report` - Report user
- `GET /api/moderation/logs` - Get moderation logs
- `POST /api/moderation/review` - Review moderation log

## Database Models

### User
- Basic info (name, email, DOB, gender)
- Profile (bio, photos, avatar)
- Location (coordinates, city, country)
- Verification status
- Authentication providers
- Account status (active, banned)
- Achievements, items, points, level
- Likes and matches

### Match
- Two user references
- Compatibility score
- Active status
- Block information
- Last message timestamp

### Message
- Sender and recipient
- Content
- Moderation flags
- Violations detected
- Read status

### Achievement
- Name, description, icon
- Criteria for unlocking
- Reward points

### Item
- Name, description, icon
- Type (badge, theme, frame, effect)
- Rarity level
- Cost and cost type

### ContentModerationLog
- User ID
- Message ID
- Violation type
- Severity level
- Action taken

## Content Moderation

The system includes built-in content moderation that:
1. Scans messages for sexual content, offensive language, and spam
2. Automatically flags inappropriate messages
3. Logs violations in the database
4. Automatically bans users after 3 violations
5. Notifies users of content violations

### Violation Types
- **sexual_content**: Sexual or adult content
- **offensive_language**: Profanity and insults
- **spam**: Suspicious links or patterns
- **harassment**: Threatening or abusive messages

## Matching Algorithm

The matching system calculates compatibility based on:
1. **Age compatibility**: User preferences vs target user's age
2. **Location compatibility**: Distance within user's preference range
3. **Interest compatibility**: Matching gender preferences
4. **Verification boost**: Bonus for verified users
5. **Profile completeness**: Bonus for complete profiles

Scores range from 0-100 with real-time location-based searching.

## Deployment

### Backend (Heroku/Railway)
```bash
# Set environment variables on hosting platform
# Deploy from git
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

## Security Features

- CORS protection
- Helmet for HTTP headers
- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting on auth endpoints
- Input validation with Joi
- MongoDB injection prevention
- XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Made with ❤️ for connecting people worldwide**
