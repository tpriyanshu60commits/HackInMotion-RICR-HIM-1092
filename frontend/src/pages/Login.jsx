import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import useStore from '../store/useStore';
import api from '../services/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token, ...userData } = res.data.data;
        localStorage.setItem('auth_token', token);
        setUser(userData);
        navigate('/landing', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background p-4 transition-colors">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/20 blur-[120px] pointer-events-none" />

      <GlassCard className="w-full max-w-md p-8 z-10 animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <Leaf className="text-primary-600 dark:text-primary-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-text-main tracking-tight">Welcome Back</h2>
          <p className="text-text-muted text-sm mt-1">Sign in to your VerdantX account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-text-main placeholder-text-muted"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-text-main"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 hover:underline">
            Create one
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
