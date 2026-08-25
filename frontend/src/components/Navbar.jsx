import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Sprout,
  ShoppingBag,
  Users,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Package,
  Tractor,
  ShieldCheck,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, login, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleQuickLogin = async (email) => {
    setDemoDropdownOpen(false);
    setMobileMenuOpen(false);
    const result = await login(email, 'password123');
    if (result.success) {
      if (result.user.role === 'FARMER') navigate('/farmer/dashboard');
      else if (result.user.role === 'BUYER') navigate('/buyer/dashboard');
      else if (result.user.role === 'ADMIN') navigate('/admin/dashboard');
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'FARMER') return '/farmer/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/buyer/dashboard';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Farmers', path: '/farmers' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#ECF1E4] shadow-xs">
      {/* Top micro announcement bar */}


      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#22C55E] flex items-center justify-center text-white shadow-md shadow-green-200/60 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#1A2E05] block leading-tight">
                Farmer<span className="text-[#22C55E]">Market</span>
              </span>
              <span className="text-[9px] uppercase font-bold text-[#15803D] tracking-wider block">
                Direct Connection
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-[#166534] bg-[#F0FDF4] border border-[#DCFCE7]'
                    : 'text-[#1A2E05] hover:text-[#22C55E] hover:bg-[#F4F7F0]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white text-sm font-bold shadow-md shadow-green-200/50 transition-all hover:scale-102"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>
                    {user.role === 'FARMER'
                      ? 'Farmer Portal'
                      : user.role === 'ADMIN'
                      ? 'Admin Control'
                      : 'Buyer Dashboard'}
                  </span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#F4F7F0] text-stone-700 transition-colors border border-transparent hover:border-[#ECF1E4]"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F0FDF4] text-[#166534] font-bold flex items-center justify-center text-xs overflow-hidden border-2 border-[#22C55E]">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-sm font-bold text-[#1A2E05] hidden lg:inline">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#ECF1E4] py-2 z-50">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <div className="font-bold text-[#1A2E05] text-sm">{user.name}</div>
                        <div className="text-xs text-stone-500 truncate">{user.email}</div>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-[#F0FDF4] hover:text-[#166534]"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#22C55E]" />
                          Dashboard
                        </Link>
                        {user.role === 'FARMER' && (
                          <>
                            <Link
                              to="/farmer/products"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-[#F0FDF4] hover:text-[#166534]"
                            >
                              <Package className="w-4 h-4 text-[#22C55E]" />
                              My Harvests
                            </Link>
                            <Link
                              to="/farmer/farm"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-[#F0FDF4] hover:text-[#166534]"
                            >
                              <Tractor className="w-4 h-4 text-[#22C55E]" />
                              Farm Profile
                            </Link>
                          </>
                        )}
                        {user.role === 'BUYER' && (
                          <Link
                            to="/buyer/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-[#F0FDF4] hover:text-[#166534]"
                          >
                            <ShoppingBag className="w-4 h-4 text-[#22C55E]" />
                            My Orders
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-stone-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-[#1A2E05] hover:text-[#22C55E] hover:bg-[#F4F7F0] rounded-full transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] rounded-full shadow-md shadow-green-200/50 hover:scale-105 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-[#F4F7F0] focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ECF1E4] bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-base font-semibold ${
                  isActive(link.path)
                    ? 'text-[#166534] bg-[#F0FDF4]'
                    : 'text-[#1A2E05] hover:bg-[#F4F7F0]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#ECF1E4]">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-[#F4F7F0] rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#22C55E] text-white font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-[#1A2E05]">{user.name}</div>
                    <div className="text-xs text-stone-500">{user.email}</div>
                    <span className="text-[10px] uppercase font-bold text-[#15803D]">{user.role}</span>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-full bg-[#22C55E] text-white font-bold text-sm shadow-md shadow-green-200/50"
                >
                  Open Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-2 rounded-full border border-stone-300 text-rose-600 font-semibold text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-full border border-stone-300 text-[#1A2E05] font-bold text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-full bg-[#22C55E] text-white font-bold text-sm shadow-md shadow-green-200/50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
