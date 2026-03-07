import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useMatchStore from '../store/matchStore';
import useAuthStore from '../store/authStore';
import { FiHeart, FiX, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { potentialMatches, findPotentialMatches, createMatch } = useMatchStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      await findPotentialMatches();
    } catch (error) {
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex < potentialMatches.length) {
      const match = potentialMatches[currentIndex];
      try {
        await createMatch(match.user._id);
        toast.success('Match created!');
        nextCard();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error creating match');
      }
    }
  };

  const nextCard = () => {
    if (currentIndex < potentialMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading matches...</p>
        </div>
      </div>
    );
  }

  const currentMatch = potentialMatches[currentIndex];

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Let's Be Friends</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/messages')}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90"
            >
              Messages
            </button>
            {(user?.role === 'admin' || user?.role === 'owner') && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            >
              Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {potentialMatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No more matches available</p>
            <button
              onClick={loadMatches}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {currentMatch && (
                <>
                  {/* Image */}
                  <div className="relative h-96 bg-gray-200">
                    <img
                      src={currentMatch.user.photos?.[0] || currentMatch.user.avatar || 'https://via.placeholder.com/400x500'}
                      alt={currentMatch.user.firstName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                      <p className="text-sm font-semibold text-dark">
                        {Math.round(currentMatch.compatibility)}% Match
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-dark">
                      {currentMatch.user.firstName}, {new Date().getFullYear() - new Date(currentMatch.user.dateOfBirth).getFullYear()}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                      <FiMapPin size={18} />
                      <span>{currentMatch.user.city}, {currentMatch.user.country}</span>
                    </div>
                    <p className="text-gray-700 mt-4">{currentMatch.user.bio}</p>

                    {/* Badges */}
                    <div className="flex gap-2 mt-4">
                      {currentMatch.user.isVerified && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          ✓ Verified
                        </span>
                      )}
                      {currentMatch.user.faceVerified && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          ✓ Face Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t px-6 py-4 flex justify-center gap-6">
                    <button
                      onClick={nextCard}
                      className="flex items-center justify-center w-14 h-14 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                    >
                      <FiX size={24} />
                    </button>
                    <button
                      onClick={handleLike}
                      className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full hover:bg-opacity-90 transition transform hover:scale-110"
                    >
                      <FiHeart size={24} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Progress */}
            <div className="mt-6 text-center text-gray-600">
              <p>{currentIndex + 1} of {potentialMatches.length}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
