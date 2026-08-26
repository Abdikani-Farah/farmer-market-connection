import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext.jsx';
import OrderCard from '../../components/OrderCard.jsx';
import PaymentModal from '../../components/PaymentModal.jsx';
import { ShoppingBag, Star, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [error, setError] = useState(null);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/buyer/orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch your orders.');
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
      alert(err.response?.data?.message || 'Error updating order status');
    }
  };

  const handleOpenReviewModal = (order) => {
    setSelectedOrderForReview(order);
    setRating(5);
    setComment('');
    setReviewSuccess(false);
    setReviewError(null);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedOrderForReview) return;
    setSubmittingReview(true);
    setReviewError(null);

    try {
      const farmerId = selectedOrderForReview.farmer?._id || selectedOrderForReview.farmer;
      const res = await api.post('/reviews', {
        farmerId,
        orderId: selectedOrderForReview._id,
        rating: Number(rating),
        comment,
      });

      if (res.data.success) {
        setReviewSuccess(true);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredOrders =
    filterStatus === 'ALL'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Purchase Tracking</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Your Agricultural Orders</h1>
        <p className="text-xs text-stone-500 mt-1">
          Track harvest fulfillment, delivery status, and review growers after order completion.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {['ALL', 'PENDING', 'ACCEPTED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(
          (st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          )
        )}
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
          <h3 className="text-base font-bold text-stone-800">No orders found</h3>
          <p className="text-xs text-stone-500">You do not have any orders under "{filterStatus}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              userRole="BUYER"
              onUpdateStatus={handleUpdateStatus}
              onOpenReviewModal={handleOpenReviewModal}
              onOpenPaymentModal={setSelectedOrderForPayment}
            />
          ))}
        </div>
      )}

      {selectedOrderForPayment && (
        <PaymentModal
          order={selectedOrderForPayment}
          onClose={() => setSelectedOrderForPayment(null)}
          onSubmitted={fetchOrders}
        />
      )}

      {/* --- REVIEW FARMER MODAL --- */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-5">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {reviewSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">Review Submitted!</h3>
                <p className="text-xs text-stone-600">
                  Thank you for rating {selectedOrderForReview?.farmer?.name || 'the farmer'}. Your feedback helps other
                  buyers in the community.
                </p>
                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="mt-2 bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Verified Feedback</div>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">
                    Review {selectedOrderForReview?.farmer?.name || 'Farmer'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Order #{selectedOrderForReview?._id?.slice(-6).toUpperCase()}
                  </p>
                </div>

                {reviewError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{reviewError}</span>
                  </div>
                )}

                {/* Star rating selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 text-stone-300 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-700 ml-2">{rating} / 5 Stars</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Your Feedback & Experience</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe produce freshness, packing quality, and delivery punctuality..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 resize-none font-medium"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-xs"
                >
                  {submittingReview ? 'Submitting Review...' : 'Post Verified Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
