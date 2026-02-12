# 🎯 Pub Quiz Srbija

Interaktivna **mobile-first** aplikacija za pub quiz sa pitanjima relevantnim za Srbiju. Testira se znanje kroz zabavne i edukativne pitanja, korisnike se rangiraju na leaderboard-u, a sva pitanja se centralno upravljaju kroz admin panel.

## ✨ Glavne Karakteristike

| Karakteristika | Opis |
|---|---|
| 📱 **Mobile First** | Optimizovana za sve uređaje |
| 🎮 **Interactive Quiz** | 10 pitanja sa vremenom od 30 sekundi po pitanju |
| 👥 **Auth** | Email, Google, Facebook prijave/registracije |
| 🏆 **Leaderboard** | Real-time rang lista sa top igračima |
| ⚙️ **Admin Panel** | Upravljanje pitanjima (dodaj, izmeni, obriši) |
| 🌍 **Vercel Ready** | Deployovano sa Vercel + Supabase |
| 🎨 **Tailwind CSS** | Moderan UI sa Tailwind utility classes |

## 🛠️ Stack

Frontend: React 19.2 + TypeScript, Vite, React Router, Tailwind CSS, Zustand, Supabase JS
Backend: Supabase (PostgreSQL), Supabase Auth
Deployment: Vercel (frontend), Supabase (database)

## 🚀 Quick Start

### 1. Instaliraj Dependencije

```bash
npm install
```

### 2. Konfiguracija Supabase

**2.1. Kreiraj Supabase Projekat**

1. Idi na https://supabase.com
2. Klikni "New project"
3. Ispuni: Naziv, Password, Region: Europe
4. Čekaj ~2-3 minuta

**2.2. Setup SQL Tabela**

1. Idi u **SQL Editor → New query**
2. Kopiraj i pokreni SQL iz .env.example fajla

**2.3. Setup OAuth (Google/Facebook)**

1. Idi u **Authentication → Providers**
2. Za Google: Kreiraj OAuth app na Google Cloud Console
3. Za Facebook: Kreiraj app na Facebook Developers
4. Kopiraj ID i Secret u Supabase

**2.4. Env Variables**

1. Idi u **Project Settings → API**
2. Kreiraj `.env.local` u projektu:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Pokreni Aplikaciju

```bash
npm run dev
```

Otvori http://localhost:5173 🎉

## 📁 Struktura Projekta

```
src/
├── components/          # Reusable komponente
├── pages/              # Full page komponente
├── services/           # Supabase client
├── store/              # Zustand stores
├── types/              # TypeScript tipovi
├── utils/              # Helpers
├── index.css           # Tailwind CSS
├── App.tsx             # Main app sa rutama
└── main.tsx            # Entry point
```

## 🎮 Korišćenje

**Korisnik:**
1. Registruj se (email ili Google/Facebook)
2. Klikni "Kreni sa igrom"
3. Odgovori na 10 pitanja (30 sekundi po pitanju)
4. Pogledaj rezultate i leaderboard

**Administrator:**
1. Prijavi se sa email računom
2. Idi u Admin panel
3. Dodaj/izmeni/obriši pitanja

## 📦 Deployment na Vercel

```bash
npm run build
npm install -g vercel
vercel
```

Dodaj env variables u Vercel settings i `vercel --prod`

## 📚 Resursi

- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)

## 📝 License

MIT License
```
