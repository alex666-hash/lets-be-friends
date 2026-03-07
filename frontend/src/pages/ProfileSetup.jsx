import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { userAPI } from '../utils/api';
import { FiCamera, FiMapPin, FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [profileData, setProfileData] = useState({
    bio: '',
    gender: '',
    interestedIn: '',
    city: '',
    state: '',
    country: '',
    preferences: {
      ageRange: { min: 18, max: 65 },
      distanceRange: 50
    }
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent],
          [child]: value
        }
      });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos([...photos, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update profile
      const response = await userAPI.updateProfile(profileData);
      setUser(response.data.user);

      // Upload photos
      if (photos.length > 0) {
        const formData = new FormData();
        photos.forEach(photo => formData.append('photos', photo));
        await userAPI.uploadPhotos(formData);
      }

      toast.success('Profile setup complete!');
      navigate('/verification');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to setup profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8">Help us find your perfect match</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">About You</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>

            {/* Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Gender</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Interested In</label>
                <select
                  name="interestedIn"
                  value={profileData.interestedIn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select...</option>
                  <option value="male">Men</option>
                  <option value="female">Women</option>
                  <option value="everyone">Everyone</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FiMapPin /> Location
              </label>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <input
                  type="text"
                  name="state"
                  value={profileData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
                <FiHeart /> Dating Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age Range: {profileData.preferences.ageRange.min} - {profileData.preferences.ageRange.max}
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      name="preferences.min"
                      min="18"
                      max="65"
                      value={profileData.preferences.ageRange.min}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        preferences: {
                          ...profileData.preferences,
                          ageRange: { ...profileData.preferences.ageRange, min: parseInt(e.target.value) }
                        }
                      })}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      name="preferences.max"
                      min="18"
                      max="65"
                      value={profileData.preferences.ageRange.max}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        preferences: {
                          ...profileData.preferences,
                          ageRange: { ...profileData.preferences.ageRange, max: parseInt(e.target.value) }
                        }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search Distance: {profileData.preferences.distanceRange} km
                  </label>
                  <input
                    type="range"
                    name="preferences.distanceRange"
                    min="1"
                    max="200"
                    value={profileData.preferences.distanceRange}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences,
                        distanceRange: parseInt(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FiCamera /> Add Photos
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full"
              />
              {photos.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">{photos.length} photo(s) selected</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Continue to Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
