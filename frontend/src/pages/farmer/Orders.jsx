import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext.jsx';
import OrderCard from '../../components/OrderCard.jsx';
import { ShoppingBag, Filter, Clock, CheckCircle, Package, AlertCircle } from 'lucide-react';

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/farmer/orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch incoming orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleConfirmPayment = async (orderId) => {
    try {
      const res = await api.patch(`/orders/${orderId}/payment/confirm`);
      if (res.data.success) {
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm payment');
    }
  };

  const filteredOrders =
    filterStatus === 'ALL'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const statusCounts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === 'PENDING').length,
    ACCEPTED: orders.filter((o) => o.status === 'ACCEPTED').length,
    PROCESSING: orders.filter((o) => o.status === 'PROCESSING').length,
    OUT_FOR_DELIVERY: orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length,
    COMPLETED: orders.filter((o) => o.status === 'COMPLETED' || o.status === 'DELIVERED').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Fulfillment Hub</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Manage Customer Orders</h1>
        <p className="text-xs text-stone-500 mt-1">Review incoming buyer requests, update harvest/delivery progress, and track fulfillment.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {[
          { key: 'ALL', label: 'All Orders' },
          { key: 'PENDING', label: 'Pending Requests' },
          { key: 'ACCEPTED', label: 'Accepted' },
          { key: 'PROCESSING', label: 'In Packing' },
          { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
          { key: 'COMPLETED', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterStatus === tab.key
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterStatus === tab.key ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {statusCounts[tab.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-stone-200 animate-pulse p-4"></div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-800">No orders in this category</h3>
          <p className="text-xs text-stone-500">
            {filterStatus === 'ALL'
              ? 'No customer orders have been received yet.'
              : `There are currently no orders with status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              userRole="FARMER"
              onUpdateStatus={handleUpdateStatus}
              onConfirmPayment={handleConfirmPayment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
