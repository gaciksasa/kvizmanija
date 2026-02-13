import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { isMuted, toggleMute } from '../utils/sounds';
import soundOn from '../assets/sound-on.png';
import soundOff from '../assets/sound-off.png';
import logoutIcon from '../assets/logout.png';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(isMuted());

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleToggleMute = () => {
    const newMuted = toggleMute();
    setMuted(newMuted);
  };

  if (!user) return null;

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
      {user.email === 'info@gacikdesign.com' && (
        <Link
          to="/admin"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/70 text-white hover:bg-gray-800/90 transition shadow-lg"
          title="Admin"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Link>
      )}
      <button
        onClick={handleToggleMute}
        className="hover:scale-110 transition-all cursor-pointer active:scale-95"
        title={muted ? 'Uključi zvuk' : 'Isključi zvuk'}
      >
        <img src={muted ? soundOff : soundOn} alt={muted ? 'Zvuk isključen' : 'Zvuk uključen'} className="h-[36px]" />
      </button>
      <button
        onClick={handleLogout}
        className="hover:scale-110 transition-all cursor-pointer active:scale-95"
        title="Odjavi se"
      >
        <img src={logoutIcon} alt="Odjavi se" className="h-[36px]" />
      </button>
    </div>
  );
};
