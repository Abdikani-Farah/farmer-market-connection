import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../../context/AuthContext.jsx';
import OrderCard from '../../components/OrderCard.jsx';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Search,
  Package,
  Sprout,
  DollarSign,
} from 'lucide-react';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBuyerData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/buyer/stats'),
        api.get('/buyer/orders'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (ordersRes.data.success) setRecentOrders(ordersRes.data.data.slice(0, 4));
    } catch (err) {
      console.error('Error fetching buyer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyerData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchBuyerData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order status');
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
      {/* Welcome Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buyers Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Browse freshly listed crops, track active shipments, and support local farming families.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/marketplace"
            className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Order Fresh Harvests</span>
          </Link>
          <Link
            to="/buyer/orders"
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors border border-emerald-700"
          >
            Order History
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Purchases</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              ${stats?.totalSpent ? stats.totalSpent.toFixed(2) : '0.00'}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Total spent on produce</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Orders</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{stats?.totalOrders || 0}</div>
            <div className="text-[10px] text-stone-400 mt-0.5">All time orders</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Active Deliveries</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{stats?.activeOrders || 0}</div>
            <div className="text-[10px] text-amber-700 mt-0.5">In harvesting or dispatch</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Received Harvests</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">{stats?.completedOrders || 0}</div>
            <div className="text-[10px] text-stone-400 mt-0.5">Delivered to you</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">Recent Purchase Orders</h2>
          <Link
            to="/buyer/orders"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                userRole="BUYER"
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3">
            <p className="text-xs text-stone-500">You have not placed any produce orders yet.</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1 bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
            >
              <Search className="w-4 h-4" />
              <span>Explore Direct Marketplace</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
