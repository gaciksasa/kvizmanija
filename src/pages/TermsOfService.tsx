import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export const TermsOfService: React.FC = () => {
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

        <h1 className="text-2xl font-bold mb-6 text-center">Uslovi korišćenja</h1>

        <div className="space-y-4 text-gray-300 text-sm">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Prihvatanje uslova</h2>
            <p>Korišćenjem aplikacije Kviz Manija prihvatate ove uslove korišćenja. Ako se ne slažete sa uslovima, molimo vas da ne koristite aplikaciju.</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Opis usluge</h2>
            <p>Kviz Manija je besplatna kviz aplikacija namenjena zabavi i testiranju opšteg znanja. Aplikacija nudi pitanja iz različitih kategorija sa sistemom bodovanja i tabelom najboljih rezultata.</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Korisnički nalog</h2>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Odgovorni ste za tačnost podataka pri registraciji</li>
              <li>Vaša lozinka je vaša odgovornost — ne delite je sa drugima</li>
              <li>Jedan korisnik može imati samo jedan nalog</li>
            </ul>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Pravila ponašanja</h2>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Zabranjeno je korišćenje automatizovanih alata za igranje</li>
              <li>Zabranjeno je namerno manipulisanje rezultatima</li>
              <li>Zadržavamo pravo da uklonimo naloge koji krše pravila</li>
            </ul>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Ograničenje odgovornosti</h2>
            <p>Aplikacija se pruža "kakva jeste" bez garancija. Ne odgovaramo za prekide u radu servisa ili gubitak podataka.</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2">Izmene uslova</h2>
            <p>Zadržavamo pravo da izmenimo ove uslove u bilo kom trenutku. Nastavak korišćenja nakon izmena podrazumeva prihvatanje novih uslova.</p>
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
