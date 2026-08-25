import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Sprout, UserPlus, User, Mail, Phone, Lock, MapPin, Tractor, ShoppingBag, AlertCircle } from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'FARMER' ? 'FARMER' : 'BUYER';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: defaultRole,
    location: 'Afgooye River Agricultural Corridor',
    farmName: '',
    farmDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await register(form);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/buyer/dashboard');
      }
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md mx-auto">
              <Sprout className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Create Your Account</h1>
          <p className="text-xs text-stone-500">Join the direct farm-to-buyer agricultural network</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 bg-stone-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'BUYER' })}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              form.role === 'BUYER'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>I Am a Buyer</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'FARMER' })}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              form.role === 'FARMER'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Tractor className="w-4 h-4 text-emerald-700" />
            <span>I Am a Farmer</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="E.g. Ahmed Hassan"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ahmed@farm.com"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+252 61 7123456"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Location / District</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Afgooye, Jowhar, Mogadishu"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Farmer Specific Farm Setup Fields */}
            {form.role === 'FARMER' && (
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3 pt-3">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Tractor className="w-4 h-4 text-emerald-700" />
                  <span>Farm Information</span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Farm Name</label>
                  <input
                    type="text"
                    value={form.farmName}
                    onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                    placeholder="E.g. Shabelle Valley Agro Farm"
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-emerald-600"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : `Register as ${form.role}`}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-700 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
