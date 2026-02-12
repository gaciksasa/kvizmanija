# Kviz Manija

Kviz aplikacija sa sistemom bodovanja po tezini pitanja, odbrojavanjem vremena i rang listom.

## Kako radi

Igrac dobija 30 pitanja (5 lakih, 10 srednjih, 15 teskih) i ima 90 sekundi da odgovori na sto vise pitanja. Kviz se zavrsava kada istekne vreme ili kada se odgovori na sva pitanja.

### Bodovanje

| Tezina | Broj pitanja | Poeni po tacnom |
|--------|-------------|-----------------|
| Lako   | 5           | 250             |
| Srednje| 10          | 350             |
| Tesko  | 15          | 500             |

Ako igrac odgovori na svih 30 pitanja pre isteka vremena, dobija bonus od **50 poena po preostaloj sekundi**.

Maksimalan moguci rezultat: 1250 + 3500 + 7500 + bonus = **12250 + bonus**

### Kategorije

Istorija, Geografija, Nauka, Sport, Muzika, Film, Umetnost, Tehnologija — ili mesavina svih.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **State:** Zustand
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **Auth:** Email, Google, Facebook (OAuth)
- **Deploy:** Vercel

## Pokretanje

```bash
npm install
cp .env.example .env.local
# Popuni VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY
npm run dev
```

Aplikacija: http://localhost:5173

## Supabase setup

1. Kreiraj projekat na [supabase.com](https://supabase.com)
2. U SQL Editor-u pokreni sledece tabele:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  auth_provider TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE quiz_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  accuracy FLOAT NOT NULL,
  time_taken INTEGER,
  answers JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. U Authentication > Providers ukljuci Google i/ili Facebook OAuth
4. Kopiraj Project URL i Anon Key iz Project Settings > API u `.env.local`

## Struktura

```
src/
├── assets/        Slike, zvukovi
├── components/    QuestionCard, Button, Input, Header, Footer
├── pages/         Home, Login, Register, Quiz, Results, Leaderboard, Admin
├── services/      Supabase klijent
├── store/         Zustand (auth, quiz, leaderboard)
├── types/         TypeScript tipovi i konstante
└── utils/         Zvukovi (correct, wrong, clock, finish, start)
```

## Admin panel

Dostupan samo za admin email. Omogucava dodavanje, izmenu i brisanje pitanja kroz modal formu. Tabela pitanja je sortabilna i filtrirajuca po kategoriji, tezini i tekstu.

## Deploy na Vercel

```bash
npm run build
npx vercel --prod
```

Environment varijable (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) dodati u Vercel > Settings > Environment Variables.

U Supabase > Authentication > URL Configuration dodati Vercel URL kao dozvoljen redirect.

## Licenca

MIT
