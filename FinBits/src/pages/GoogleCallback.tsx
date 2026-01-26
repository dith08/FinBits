import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('user_id');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Google login gagal: ' + decodeURIComponent(errorParam));
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (token) {
      authService.handleGoogleCallback(token, userId || '');
      navigate('/dashboard');
    } else {
      setError('Token tidak ditemukan');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="text-red-400">
            <p className="text-xl mb-2">{error}</p>
            <p className="text-gray-500 text-sm">Redirecting ke login...</p>
          </div>
        ) : (
          <div className="text-white">
            <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl">Memproses login...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;