import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext.jsx';
import OrderCard from '../../components/OrderCard.jsx';
import { ShoppingBag, Search, Filter } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
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
      alert('Failed to override order status');
    }
  };

  const filteredOrders =
    statusFilter === 'ALL'
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Global Fulfillment</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">All Platform Orders</h1>
        <p className="text-xs text-stone-500 mt-1">Platform-wide order oversight and status management.</p>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        {['ALL', 'PENDING', 'ACCEPTED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map(
          (st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          )
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-stone-200 animate-pulse p-4"></div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center text-xs text-stone-500">
          No orders match this status.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              userRole="ADMIN"
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
