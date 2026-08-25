import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext.jsx';
import {
  Users,
  Tractor,
  Package,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [unverifiedFarms, setUnverifiedFarms] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, farmsRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/farms'),
        api.get('/admin/orders'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (farmsRes.data.success) {
        setUnverifiedFarms(farmsRes.data.data.filter((f) => !f.isVerified).slice(0, 4));
      }
      if (ordersRes.data.success) setRecentOrders(ordersRes.data.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyFarm = async (farmId) => {
    try {
      const res = await api.put(`/admin/farms/${farmId}/verify`, { isVerified: true });
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to verify farm');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
        <div className="h-8 bg-stone-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-stone-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-emerald-400 text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Marketplace Overview</h1>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Global metrics, farm verification queues, category taxonomies, and transactional flows.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/farms"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            Verify Farms
          </Link>
          <Link
            to="/admin/categories"
            className="bg-stone-800 hover:bg-stone-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors border border-stone-700"
          >
            Categories
          </Link>
          <Link
            to="/admin/users"
            className="bg-stone-800 hover:bg-stone-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors border border-stone-700"
          >
            Users
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Gross Volume</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            ${stats?.totalGrossVolume ? stats.totalGrossVolume.toFixed(2) : '0.00'}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Platform GMV</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Registered Users</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{stats?.totalUsers || 0}</div>
          <div className="text-[10px] text-stone-400 mt-0.5">
            {stats?.totalFarmers || 0} Farmers • {stats?.totalBuyers || 0} Buyers
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Farms Enrolled</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{stats?.totalFarms || 0}</div>
          <div className="text-[10px] text-stone-400 mt-0.5">{stats?.verifiedFarms || 0} Verified</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Harvest Listings</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{stats?.totalProducts || 0}</div>
          <div className="text-[10px] text-stone-400 mt-0.5">Agricultural products</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Orders</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{stats?.totalOrders || 0}</div>
          <div className="text-[10px] text-stone-400 mt-0.5">{stats?.pendingOrders || 0} Pending</div>
        </div>
      </div>

      {/* Split: Farms Verification Queue & Global Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Verification Queue */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold text-stone-900">Farm Verification Queue</h2>
            </div>
            <Link
              to="/admin/farms"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Manage All Farms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {unverifiedFarms.length > 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
              {unverifiedFarms.map((farm) => (
                <div key={farm._id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">{farm.farmName}</h3>
                    <div className="text-xs text-stone-500">
                      Farmer: <span className="font-semibold text-stone-700">{farm.farmer?.name}</span> •{' '}
                      {farm.location}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      Crops: {(farm.crops || []).join(', ')}
                    </div>
                  </div>

                  <button
                    onClick={() => handleVerifyFarm(farm._id)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Grant Verification
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center text-xs text-stone-400">
              No pending farm verifications in the queue.
            </div>
          )}
        </div>

        {/* Right: Global Orders Activity */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold text-stone-900">Recent Marketplace Orders</h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
              {recentOrders.map((ord) => (
                <div key={ord._id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-mono font-bold text-stone-700">
                      #{ord._id.slice(-6).toUpperCase()}
                    </div>
                    <div className="text-stone-500">
                      Buyer: <span className="font-semibold text-stone-800">{ord.buyer?.name}</span> → Farmer:{' '}
                      <span className="font-semibold text-stone-800">{ord.farmer?.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-emerald-800">${ord.totalAmount?.toFixed(2)}</div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center text-xs text-stone-400">
              No recent orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
