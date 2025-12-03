import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { getAdminPassword } from '../utils/firebaseService';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fetch password from Firebase
      const dbPassword = await getAdminPassword();
      // Fallback to env var or default if DB is empty
      const adminPassword = dbPassword || import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
      
      if (password === adminPassword) {
        sessionStorage.setItem('isAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <Lock className="text-indigo-500" size={24} />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-slate-500 text-sm">Enter your secure password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors text-center tracking-widest placeholder-slate-700"
                placeholder="••••••••"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs text-center bg-red-500/5 py-2 rounded border border-red-500/10">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <a href="/" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
