import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import again from '../assets/again.png';
import tabela from '../assets/tabela.png';

export const Rules: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
      <div className="card max-w-lg w-full">
        <img
          src={logo}
          alt="Kviz Manija"
          className="w-64 mx-auto mb-6 cursor-pointer"
          onClick={() => navigate('/')}
        />

        <h1 className="text-2xl font-bold mb-6 text-center">Pravila igre</h1>

        <div className="space-y-4 text-gray-300">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Cilj igre</h2>
            <p>Odgovori tačno na što više pitanja i sakupi najviše poena! Uporedi svoje znanje sa drugima na tabeli najboljih rezultata.</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Pitanja</h2>
            <p>Svaka igra ima najviše 30 pitanja raspoređenih po težini:</p>
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>5 lakih pitanja</li>
              <li>10 srednje teških pitanja</li>
              <li>15 teških pitanja</li>
            </ul>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Bodovanje</h2>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Lako pitanje: <span className="text-primary font-semibold">250 poena</span></li>
              <li>Srednje pitanje: <span className="text-primary font-semibold">350 poena</span></li>
              <li>Teško pitanje: <span className="text-primary font-semibold">500 poena</span></li>
            </ul>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Vreme</h2>
            <p>Imaš <span className="text-primary font-semibold">90 sekundi</span> da odgovoriš na sva pitanja. Za svaku preostalu sekundu dobijaš <span className="text-green-400 font-semibold">+50 bonus poena</span>!</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Kategorije</h2>
            <p>Biraj između 8 kategorija ili igraj sve zajedno: Istorija, Geografija, Nauka, Sport, Muzika, Film, Umetnost i Tehnologija.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => navigate('/')}
            className="hover:scale-105 transition-all cursor-pointer active:scale-95"
          >
            <img src={again} alt="Igraj opet" className="h-[60px] mx-auto" />
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="hover:scale-105 transition-all cursor-pointer active:scale-95"
          >
            <img src={tabela} alt="Leaderboard" className="h-[60px] mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};
