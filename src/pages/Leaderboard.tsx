import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { CATEGORIES } from '../types';
import again from '../assets/again.png';
import pravila from '../assets/pravila.png';
import logo from '../assets/logo.png';

export const Leaderboard: React.FC = () => {
  const { user } = useAuthStore();
  const { entries, loading, fetchLeaderboard } = useLeaderboardStore();
  const [activeCategory, setActiveCategory] = useState('sve');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchLeaderboard(activeCategory);
  }, [user, navigate, activeCategory, fetchLeaderboard]);

  const formatTime = (seconds: number) => {
    if (!seconds) return '-';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-lg mx-auto">
        <img
          src={logo}
          alt="Kviz Manija"
          className="w-64 mx-auto mb-4 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <h1 className="text-2xl font-bold mb-4 text-center">🏆 Top 10</h1>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition ${
                activeCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Učitavam...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Nema rezultata za ovu kategoriju.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`card flex items-center gap-3 py-3 px-4 ${
                  entry.user_id === user.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <span className="text-lg w-8 text-center font-bold">
                  {index === 0
                    ? '🥇'
                    : index === 1
                    ? '🥈'
                    : index === 2
                    ? '🥉'
                    : `${index + 1}.`}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {entry.users?.name || 'Nepoznat'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {entry.accuracy.toFixed(0)}% · {formatTime(entry.time_taken)}
                  </p>
                </div>
                <span className="text-lg font-bold text-primary">{entry.score}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => navigate('/')}
            className="hover:scale-105 transition-all cursor-pointer active:scale-95"
          >
            <img src={again} alt="Igraj opet" className="h-[60px] mx-auto" />
          </button>

          <button
            onClick={() => navigate('/rules')}
            className="hover:scale-105 transition-all cursor-pointer active:scale-95"
          >
            <img src={pravila} alt="Pravila" className="h-[60px] mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};
