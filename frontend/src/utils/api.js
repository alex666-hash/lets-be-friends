import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getCurrentUser: () => API.get('/auth/me'),
};

export const userAPI = {
  getProfile: (userId) => API.get(`/users/${userId}`),
  updateProfile: (data) => API.put('/users/profile/update', data),
  updateLocation: (data) => API.put('/users/location/update', data),
  uploadAvatar: (formData) => API.post('/users/avatar/upload', formData),
  uploadPhotos: (formData) => API.post('/users/photos/upload', formData),
  searchUsers: (params) => API.get('/users/search', { params }),
  likeUser: (targetUserId) => API.post('/users/like', { targetUserId }),
};

export const matchAPI = {
  getMatches: () => API.get('/matches'),
  findPotentialMatches: () => API.get('/matches/potential'),
  createMatch: (targetUserId) => API.post('/matches', { targetUserId }),
  blockUser: (targetUserId) => API.post('/matches/block', { targetUserId }),
  unblockUser: (targetUserId) => API.post('/matches/unblock', { targetUserId }),
};

export const messageAPI = {
  getMessages: (targetUserId) => API.get(`/messages/${targetUserId}`),
  sendMessage: (data) => API.post('/messages', data),
  deleteMessage: (messageId) => API.delete(`/messages/${messageId}`),
  markAsRead: (messageId) => API.put(`/messages/${messageId}/read`),
};

export const verificationAPI = {
  generateToken: () => API.post('/verification/token/generate'),
  submitFaceVerification: (formData) => API.post('/verification/face/submit', formData),
  getVerificationStatus: () => API.get('/verification/status'),
};

export const achievementAPI = {
  getUserAchievements: () => API.get('/achievements/user'),
  getAllAchievements: () => API.get('/achievements'),
  getAllItems: () => API.get('/achievements/items'),
  unlockAchievement: (achievementId) => API.post('/achievements/unlock', { achievementId }),
  purchaseItem: (itemId) => API.post('/achievements/item/purchase', { itemId }),
};

export const moderationAPI = {
  reportUser: (data) => API.post('/moderation/report', data),
};

export const AdminAPI = {
  getAllUsers: (query) => API.get('/admin/users', { params: query }),
  getUserDetails: (userId) => API.get(`/admin/users/${userId}`),
  banUser: (userId, data) => API.post(`/admin/users/${userId}/ban`, data),
  unbanUser: (userId) => API.post(`/admin/users/${userId}/unban`),
  updateUserRole: (userId, data) => API.put(`/admin/users/${userId}/role`, data),
  deleteUser: (userId) => API.delete(`/admin/users/${userId}`),
  resetUserWarnings: (userId) => API.post(`/admin/users/${userId}/reset-warnings`),
  getModerationLogs: (query) => API.get('/admin/moderation/logs', { params: query }),
  getPlatformStats: () => API.get('/admin/stats'),
};

export default API;
