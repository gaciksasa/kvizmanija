import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user && event === 'SIGNED_IN') {
          navigate('/');
        }
      }
    );

    return () => authListener?.subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (userData) {
          setUser(userData);
        } else {
          // Auto-create profile if missing
          const name = data.user.email?.split('@')[0] || 'Korisnik';
          const newUser = {
            id: data.user.id,
            email: data.user.email || email,
            name,
            auth_provider: 'email' as const,
            created_at: new Date().toISOString(),
          };
          await supabase.from('users').upsert(newUser);
          setUser(newUser);
        }

        navigate('/');
      }
    } catch (err) {
      setError('Greška pri prijavi');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError('Greška pri Google prijavi');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError('Greška pri Facebook prijavi');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Prijava 🔐</h1>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            type="email"
            placeholder="petar@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Lozinka"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full mb-4"
          >
            Prijavi se
          </Button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">Ili</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full btn border-2 border-gray-600 hover:bg-gray-700 flex items-center justify-center gap-2"
          >
            🔗 Prijavi se sa Google
          </button>

          <button
            onClick={handleFacebookLogin}
            className="w-full btn border-2 border-gray-600 hover:bg-gray-700 flex items-center justify-center gap-2"
          >
            📘 Prijavi se sa Facebook
          </button>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Nemaš nalog?{' '}
          <a href="/register" className="text-primary font-semibold hover:underline">
            Registruj se
          </a>
        </p>
      </div>
    </div>
  );
};
