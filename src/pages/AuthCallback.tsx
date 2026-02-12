import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase OAuth callback će automatski pozvati checkAuth
    // Redirekcija nakon što je auth završen
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <p className="text-2xl font-bold text-gray-300">Autentifikacija u toku...</p>
        <p className="text-gray-400 mt-2">Čekaj malo...</p>
      </div>
    </div>
  );
};
