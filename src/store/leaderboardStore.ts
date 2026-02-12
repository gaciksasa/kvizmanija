import { create } from 'zustand';
import { type LeaderboardEntry } from '../types';
import { supabase } from '../services/supabase';

interface LeaderboardState {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  fetchLeaderboard: (category?: string) => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],
  loading: false,
  error: null,

  fetchLeaderboard: async (category?: string) => {
    try {
      set({ loading: true });
      let query = supabase
        .from('quiz_games')
        .select('id, user_id, score, accuracy, time_taken, created_at, users(name, avatar_url)')
        .order('score', { ascending: false })
        .limit(10);

      if (category && category !== 'sve') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ entries: (data || []) as unknown as LeaderboardEntry[], loading: false });
    } catch (error) {
      set({ error: 'Greška pri učitavanju leaderboard-a', loading: false });
    }
  },
}));
