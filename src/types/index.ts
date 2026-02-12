export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  auth_provider: 'email' | 'google' | 'facebook';
  created_at: string;
}

export interface Question {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  options: string[];
  correct_answer: string;
  description: string;
  created_by: string;
  created_at: string;
}

export interface QuizAnswer {
  id?: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  created_at?: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  accuracy: number;
  time_taken: number;
  created_at: string;
  users: {
    name: string;
    avatar_url: string | null;
  };
}

export interface QuizGame {
  id?: string;
  user_id: string;
  category: string;
  score: number;
  total_questions: number;
  accuracy: number;
  time_taken: number; // seconds
  answers: QuizAnswer[];
  created_at?: string;
}

export const CATEGORIES = [
  { id: 'sve', label: 'Sve', icon: '🎯' },
  { id: 'Istorija', label: 'Istorija', icon: '📜' },
  { id: 'Geografija', label: 'Geografija', icon: '🌍' },
  { id: 'Nauka', label: 'Nauka', icon: '🔬' },
  { id: 'Sport', label: 'Sport', icon: '⚽' },
  { id: 'Muzika', label: 'Muzika', icon: '🎵' },
  { id: 'Film', label: 'Film', icon: '🎬' },
  { id: 'Umetnost', label: 'Umetnost', icon: '🎨' },
  { id: 'Tehnologija', label: 'Tehnologija', icon: '💻' },
] as const;
