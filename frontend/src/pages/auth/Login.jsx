import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Sprout, LogIn, Lock, Mail, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from);
      } else if (res.user.role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/buyer/dashboard');
      }
    } else {
      setErrorMsg(res.message || 'Invalid email or password');
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setErrorMsg(null);

    const res = await login(demoEmail, 'password123');
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'FARMER') navigate('/farmer/dashboard');
      else if (res.user.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/buyer/dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md mx-auto">
              <Sprout className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Welcome Back</h1>
          <p className="text-xs text-stone-500">Sign in to your Farmer Market Connection account</p>
        </div>

        {/* 1-Click Quick Demo Sign-In Cards */}
  

        {/* Login Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700">Password</label>
                <span className="text-[11px] text-emerald-700 hover:underline cursor-pointer">Forgot?</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-emerald-700 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
