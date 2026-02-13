import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { CATEGORIES } from '../types';
import { playStart, playSelected } from '../utils/sounds';
import logo from '../assets/logo.png';
import sprite from '../assets/sprite.jpg';
import tabela from '../assets/tabela.png';
import pravila from '../assets/pravila.png';

const SPRITE_POSITION: Record<string, string> = {
  sve: '0% 0%',
  Istorija: '50% 0%',
  Geografija: '100% 0%',
  Nauka: '0% 46%',
  Sport: '50% 46%',
  Muzika: '100% 46%',
  Film: '0% 92%',
  Umetnost: '50% 92%',
  Tehnologija: '100% 92%',
};

export const Home: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) playStart();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <img src={logo} alt="Kviz Manija" className="w-64 mx-auto mb-6" />
          <p className="text-gray-400 mb-8">
            Testiraj svoje znanje kroz zabavna pitanja!
          </p>
          <div className="space-y-3">
            <Link to="/register" className="block w-full btn btn-primary py-3 text-center">
              Registruj se
            </Link>
            <Link to="/login" className="block w-full btn btn-outline py-3 text-center">
              Prijavi se
            </Link>
            <Link to="/rules" className="block w-full btn btn-outline py-3 text-center">
              Pravila igre
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <img src={logo} alt="Kviz Manija" className="w-64 mx-auto" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { playSelected(); navigate('/quiz', { state: { category: cat.id } }); }}
              className="rounded-xl overflow-hidden hover:scale-105 transition-all cursor-pointer active:scale-95 shadow-[0_0_4px_rgba(255,255,255,0.1)] hover:shadow-[0_0_8px_rgba(255,255,255,0.2)]"
            >
              <div
                className="w-full aspect-[1/0.9] bg-no-repeat"
                style={{
                  backgroundImage: `url(${sprite})`,
                  backgroundSize: '300% 300%',
                  backgroundPosition: SPRITE_POSITION[cat.id],
                }}
              />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/leaderboard')}
            className="hover:scale-105 transition-all cursor-pointer active:scale-95"
          >
            <img src={tabela} alt="Leaderboard" className="h-[60px] mx-auto" />
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
