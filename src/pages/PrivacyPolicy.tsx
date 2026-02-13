import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export const PrivacyPolicy: React.FC = () => {
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

        <h1 className="text-2xl font-bold mb-6 text-center">Politika privatnosti</h1>

        <div className="space-y-4 text-gray-300 text-sm">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Koje podatke prikupljamo</h2>
            <p>Kada se registrujete, prikupljamo vaše ime, email adresu i lozinku. Ako koristite Google prijavu, pristupamo vašem imenu i email adresi sa Google naloga.</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Kako koristimo podatke</h2>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Autentifikacija i pristup nalogu</li>
              <li>Prikazivanje rezultata na tabeli najboljih</li>
              <li>Poboljšanje korisničkog iskustva</li>
            </ul>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Čuvanje podataka</h2>
            <p>Vaši podaci se čuvaju na Supabase platformi sa enkripcijom. Ne delimo vaše podatke sa trećim stranama u komercijalne svrhe.</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Kolačići</h2>
            <p>Koristimo samo neophodne kolačiće za autentifikaciju i sesiju. Ne koristimo kolačiće za praćenje ili reklame.</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Vaša prava</h2>
            <p>Možete zatražiti brisanje svog naloga i svih povezanih podataka kontaktiranjem na email adresu navedenu u podešavanjima aplikacije.</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Izmene</h2>
            <p>Zadržavamo pravo da ažuriramo ovu politiku. O svim značajnim izmenama bićete obavešteni putem aplikacije.</p>
          </div>

          <p className="text-gray-500 text-xs text-center">Poslednje ažuriranje: februar 2026.</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full text-center text-gray-400 hover:text-white transition-colors"
        >
          &larr; Nazad
        </button>
      </div>
    </div>
  );
};
