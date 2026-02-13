import { create } from 'zustand';
import { type User } from '../types';
import { supabase } from '../services/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, error: null });
    } catch (error) {
      set({ error: 'Greška pri odjavi' });
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          set({ user: data as User, loading: false });
        } else {
          // Auto-create profile if missing
          const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Korisnik';
          const avatar_url = user.user_metadata?.avatar_url || null;
          const provider = user.app_metadata?.provider || 'email';

          const newUser = {
            id: user.id,
            email: user.email || '',
            name,
            avatar_url,
            auth_provider: provider === 'email' ? 'email' : provider === 'google' ? 'google' : 'facebook',
          };

          await supabase.from('users').upsert(newUser);
          set({ user: { ...newUser, created_at: new Date().toISOString() } as User, loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      await supabase.auth.signOut();
      set({ user: null, loading: false });
    }
  },
}));
