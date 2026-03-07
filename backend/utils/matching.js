const geolib = require('geolib');

/**
 * Calculate compatibility score between two users
 */
const calculateCompatibility = (user1, user2) => {
  let score = 50; // Base score
  
  // Age compatibility
  if (user1.preferences.ageRange) {
    const user2Age = new Date().getFullYear() - user2.dateOfBirth.getFullYear();
    if (user2Age >= user1.preferences.ageRange.min && 
        user2Age <= user1.preferences.ageRange.max) {
      score += 10;
    }
  }
  
  // Location compatibility
  if (user1.location && user2.location) {
    const distance = geolib.getDistance(
      { latitude: user1.location.coordinates[1], longitude: user1.location.coordinates[0] },
      { latitude: user2.location.coordinates[1], longitude: user2.location.coordinates[0] }
    ) / 1000; // Convert to km
    
    if (distance <= user1.preferences.distanceRange) {
      score += 15;
    } else if (distance <= user1.preferences.distanceRange * 1.5) {
      score += 5;
    }
  }
  
  // Mutual interest
  if (user1.interestedIn === 'everyone' || user1.interestedIn === user2.gender) {
    score += 10;
  }
  
  // Verification status boost
  if (user1.isVerified && user2.isVerified) {
    score += 10;
  }
  
  if (user1.faceVerified && user2.faceVerified) {
    score += 5;
  }
  
  // Profile completeness
  const user2ProfileScore = calculateProfileCompleteness(user2) / 100 * 10;
  score += user2ProfileScore;
  
  return Math.min(100, score);
};

/**
 * Calculate profile completeness percentage
 */
const calculateProfileCompleteness = (user) => {
  const fields = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'gender',
    'interestedIn',
    'bio',
    'avatar',
    'city',
    'country'
  ];
  
  let completed = 0;
  fields.forEach(field => {
    if (user[field]) completed++;
  });
  
  if (user.photos && user.photos.length > 0) completed++;
  
  return (completed / (fields.length + 1)) * 100;
};

/**
 * Find matches for a user based on location and preferences
 */
const findMatches = async (userId, User) => {
  const currentUser = await User.findById(userId);
  
  if (!currentUser || !currentUser.location) {
    return [];
  }
  
  // Find users within preferred distance
  const maxDistance = currentUser.preferences?.distanceRange || 50;
  
  const potentialMatches = await User.find({
    _id: { $ne: userId },
    isActive: true,
    isBanned: false,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: currentUser.location.coordinates
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    }
  }).limit(50);
  
  // Filter and score matches
  const matches = potentialMatches
    .filter(user => {
      // Check age preferences
      if (currentUser.preferences?.ageRange) {
        const userAge = new Date().getFullYear() - user.dateOfBirth?.getFullYear();
        if (userAge < currentUser.preferences.ageRange.min || 
            userAge > currentUser.preferences.ageRange.max) {
          return false;
        }
      }
      
      // Check gender preference
      if (currentUser.interestedIn !== 'everyone' && 
          currentUser.interestedIn !== user.gender) {
        return false;
      }
      
      return true;
    })
    .map(user => ({
      user,
      compatibility: calculateCompatibility(currentUser, user)
    }))
    .sort((a, b) => b.compatibility - a.compatibility);
  
  return matches;
};

module.exports = {
  calculateCompatibility,
  calculateProfileCompleteness,
  findMatches
};
