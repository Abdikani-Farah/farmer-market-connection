import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext.jsx';
import { ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [unverifiedFarms, setUnverifiedFarms] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);

    try {
      const [statsRes, farmsRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/farms'),
        api.get('/admin/orders'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (farmsRes.data.success) {
        setUnverifiedFarms(
          farmsRes.data.data
            .filter((farm) => !farm.isVerified)
            .slice(0, 4)
        );
      }

      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.data.slice(0, 5));
      }

    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyFarm = async (farmId) => {
    try {
      const res = await api.put(
        `/admin/farms/${farmId}/verify`,
        { isVerified: true }
      );

      if (res.data.success) {
        fetchAdminData();
      }

    } catch (err) {
      alert('Failed to verify farm');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-stone-200 rounded w-1/4 mb-6"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-28 bg-white rounded-2xl border border-stone-200 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
          Admin Dashboard
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Dashboard
        </h1>

        <p className="text-xs text-stone-500 mt-1">
          Manage users, farms, products and orders.
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-2">
        <Link
          to="/admin/farms"
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          Farms
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-4 py-2 rounded-xl text-xs font-bold"
        >
          Categories
        </Link>

        <Link
          to="/admin/users"
          className="bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-4 py-2 rounded-xl text-xs font-bold"
        >
          Users
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-4 py-2 rounded-xl text-xs font-bold"
        >
          Orders
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <div className="text-xs font-bold text-stone-500">
            Gross Volume
          </div>

          <div className="text-2xl font-black text-emerald-800 mt-1">
            ${stats?.totalGrossVolume
              ? stats.totalGrossVolume.toFixed(2)
              : '0.00'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <div className="text-xs font-bold text-stone-500">
            Users
          </div>

          <div className="text-2xl font-black text-stone-900 mt-1">
            {stats?.totalUsers || 0}
          </div>

          <div className="text-[10px] text-stone-400 mt-1">
            {stats?.totalFarmers || 0} Farmers •{' '}
            {stats?.totalBuyers || 0} Buyers
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <div className="text-xs font-bold text-stone-500">
            Farms
          </div>

          <div className="text-2xl font-black text-stone-900 mt-1">
            {stats?.totalFarms || 0}
          </div>

          <div className="text-[10px] text-stone-400 mt-1">
            {stats?.verifiedFarms || 0} Verified
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <div className="text-xs font-bold text-stone-500">
            Products
          </div>

          <div className="text-2xl font-black text-stone-900 mt-1">
            {stats?.totalProducts || 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <div className="text-xs font-bold text-stone-500">
            Orders
          </div>

          <div className="text-2xl font-black text-emerald-800 mt-1">
            {stats?.totalOrders || 0}
          </div>

          <div className="text-[10px] text-stone-400 mt-1">
            {stats?.pendingOrders || 0} Pending
          </div>
        </div>

      </div>

      {/* Farms and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Farms */}
        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />

              <h2 className="text-lg font-bold text-stone-900">
                Farms
              </h2>
            </div>

            <Link
              to="/admin/farms"
              className="text-xs font-bold text-emerald-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {unverifiedFarms.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center text-xs text-stone-500">
              No farms waiting for verification.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">

              {unverifiedFarms.map((farm) => (
                <div
                  key={farm._id}
                  className="p-4 flex items-center justify-between gap-4"
                >

                  <div>
                    <h3 className="font-bold text-sm text-stone-900">
                      {farm.farmName}
                    </h3>

                    <p className="text-xs text-stone-500">
                      Farmer: {farm.farmer?.name}
                    </p>

                    <p className="text-xs text-stone-500">
                      {farm.location}
                    </p>
                  </div>

                  <button
                    onClick={() => handleVerifyFarm(farm._id)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Verify
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Orders */}
        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />

              <h2 className="text-lg font-bold text-stone-900">
                Recent Orders
              </h2>
            </div>

            <Link
              to="/admin/orders"
              className="text-xs font-bold text-emerald-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center text-xs text-stone-500">
              No recent orders.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">

              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 flex items-center justify-between gap-3"
                >

                  <div>
                    <div className="font-bold text-xs text-stone-700">
                      #{order._id.slice(-6).toUpperCase()}
                    </div>

                    <div className="text-xs text-stone-500 mt-1">
                      Buyer: {order.buyer?.name}
                    </div>

                    <div className="text-xs text-stone-500">
                      Farmer: {order.farmer?.name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-800">
                      ${order.totalAmount?.toFixed(2)}
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {order.status}
                    </span>
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}