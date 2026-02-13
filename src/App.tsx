import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Header } from './components/Header';
import logo from './assets/logo.png';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Quiz } from './pages/Quiz';
import { Results } from './pages/Results';
import { Leaderboard } from './pages/Leaderboard';
import { Admin } from './pages/Admin';
import { AuthCallback } from './pages/AuthCallback';
import { Rules } from './pages/Rules';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';

function App() {
  const { checkAuth, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img src={logo} alt="Kviz Manija" className="w-64 mx-auto mb-6" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
