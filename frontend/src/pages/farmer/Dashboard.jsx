import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, useAuth } from '../../context/AuthContext.jsx';
import { getImageUrl } from '../../api/axios.js';
import OrderCard from '../../components/OrderCard.jsx';
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  Tractor,
  Star,
  Layers,
  AlertCircle,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes, productsRes, farmRes] = await Promise.all([
        api.get('/farmer/stats'),
        api.get('/farmer/orders'),
        api.get('/farmer/products'),
        api.get('/farmer/farm'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (ordersRes.data.success) setRecentOrders(ordersRes.data.data.slice(0, 4));
      if (productsRes.data.success) setProducts(productsRes.data.data.slice(0, 4));
      if (farmRes.data.success) setFarm(farmRes.data.data);
    } catch (err) {
      console.error('Failed to load farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
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
      {/* Top Banner / Welcome */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase mb-2">
            <Tractor className="w-3.5 h-3.5" />
            <span>Farmer Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            {farm?.farmName || 'Your Farm'} • {user?.location || 'Somalia'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/farmer/products?new=true"
            className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Harvest</span>
          </Link>
          <Link
            to="/farmer/orders"
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors border border-emerald-700"
          >
            Manage All Orders
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Revenue</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Completed orders</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Active Harvests</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{stats?.totalProducts || 0}</div>
            <div className="text-[10px] text-stone-400 mt-0.5">Published listings</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Pending Orders</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{stats?.pendingOrders || 0}</div>
            <div className="text-[10px] text-amber-700 mt-0.5">Awaiting your response</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Completed Orders</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">{stats?.completedOrders || 0}</div>
            <div className="text-[10px] text-stone-400 mt-0.5">Successfully fulfilled</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Split: Recent Orders & Active Harvests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Incoming Orders */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold text-stone-900">Recent Customer Orders</h2>
            </div>
            <Link
              to="/farmer/orders"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  userRole="FARMER"
                  onUpdateStatus={handleUpdateOrderStatus}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center text-stone-400 text-xs">
              No orders received yet. Keep your harvest inventory updated to attract buyers!
            </div>
          )}
        </div>

        {/* Right: Quick Products List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold text-stone-900">Your Harvest Catalog</h2>
            </div>
            <Link
              to="/farmer/products"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
              {products.map((p) => (
                <div key={p._id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={getImageUrl(p.images?.[0]) || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200'}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-stone-900">{p.name}</h3>
                      <div className="text-[11px] text-stone-500">
                        ${p.price}/{p.unit} • {p.quantity} {p.unit} in stock
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.availability && p.quantity > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {p.availability && p.quantity > 0 ? 'Active' : 'Out of Stock'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-3">
              <p className="text-xs text-stone-500">You haven't listed any agricultural products yet.</p>
              <Link
                to="/farmer/products?new=true"
                className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Harvest</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
