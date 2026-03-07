import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationAPI } from '../utils/api';
import { FiCamera } from 'react-icons/fi';
import { toast } from 'react-toastify';

const FaceVerification = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error('Unable to access camera');
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasRef.current.toBlob((blob) => {
        setPhotos([...photos, blob]);
        toast.success(`Photo ${photos.length + 1} captured`);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (photos.length < 2) {
      toast.error('Please capture at least 2 photos');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append('images', photo, `face_${index}.jpg`);
      });

      const response = await verificationAPI.submitFaceVerification(formData);
      toast.success('Face verification submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Face Verification</h1>
          <p className="text-gray-600 mb-8">Help us verify your identity for a safer community</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Camera */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FiCamera /> Capture Face Photos
              </label>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  autoPlay
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" width={640} height={480} />
              </div>

              <button
                type="button"
                onClick={capturePhoto}
                className="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-opacity-90 mb-4"
              >
                Capture Photo ({photos.length}/2)
              </button>
            </div>

            {/* Preview */}
            {photos.length > 0 && (
              <div>
                <h3 className="font-semibold text-dark mb-4">Captured Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Face ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Please capture clear photos of your face from different angles. We use AI to verify your identity and ensure a safe community.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || photos.length < 2}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Complete Verification'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300"
            >
              Skip for Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FaceVerification;
