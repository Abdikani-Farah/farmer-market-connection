import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  Star,
  ChevronRight,
  Wallet,
} from 'lucide-react';

const paymentLabels = {
  EVC_PLUS: 'EVC Plus',
  SAAD: 'SAAD',
  E_DAHAB: 'e-Dahab',
};

const paymentBadges = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
  SUBMITTED: 'bg-sky-100 text-sky-800 border-sky-300',
  PAID: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  FAILED: 'bg-rose-100 text-rose-800 border-rose-300',
  REFUNDED: 'bg-stone-100 text-stone-700 border-stone-300',
};

export default function OrderCard({
  order,
  userRole,
  onUpdateStatus,
  onOpenReviewModal,
  onOpenPaymentModal,
  onConfirmPayment,
}) {
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  const {
    _id,
    createdAt,
    status,
    paymentStatus,
    paymentMethod,
    paymentReference,
    totalAmount,
    items = [],
    buyer,
    farmer,
    deliveryAddress,
    deliveryMethod,
    notes,
  } = order;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getStatusBadge = (st) => {
    switch (st) {
      case 'PENDING':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: Clock, label: 'Pending Approval' };
      case 'ACCEPTED':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle, label: 'Farmer Accepted' };
      case 'PROCESSING':
        return { bg: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: Package, label: 'Harvesting & Packing' };
      case 'READY_FOR_DELIVERY':
        return { bg: 'bg-teal-100 text-teal-800 border-teal-300', icon: Package, label: 'Ready for Dispatch' };
      case 'OUT_FOR_DELIVERY':
        return { bg: 'bg-purple-100 text-purple-800 border-purple-300', icon: Truck, label: 'Out for Delivery' };
      case 'DELIVERED':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle, label: 'Delivered' };
      case 'COMPLETED':
        return { bg: 'bg-emerald-700 text-white border-emerald-800', icon: CheckCircle, label: 'Completed' };
      case 'REJECTED':
        return { bg: 'bg-rose-100 text-rose-800 border-rose-300', icon: XCircle, label: 'Farmer Declined' };
      case 'CANCELLED':
        return { bg: 'bg-stone-100 text-stone-700 border-stone-300', icon: AlertCircle, label: 'Cancelled' };
      default:
        return { bg: 'bg-stone-100 text-stone-700 border-stone-200', icon: Clock, label: st };
    }
  };

  const badge = getStatusBadge(status);
  const StatusIcon = badge.icon;

  const handleAction = async (newStatus) => {
    if (!onUpdateStatus) return;
    setUpdating(true);
    await onUpdateStatus(_id, newStatus);
    setUpdating(false);
  };

  const handlePaymentConfirmation = async () => {
    if (!onConfirmPayment) return;
    setUpdating(true);
    await onConfirmPayment(_id);
    setUpdating(false);
  };

  const paymentLabel = paymentStatus === 'SUBMITTED' ? 'Awaiting farmer confirmation' : paymentStatus || 'PENDING';

  return (
    <div className="bg-white rounded-2xl border border-[#ECF1E4] shadow-xs hover:shadow-md transition-shadow overflow-hidden">
      {/* Card Header */}
      <div className="p-5 bg-[#F4F7F0]/60 border-b border-[#ECF1E4] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#166534] bg-[#F0FDF4] px-2.5 py-1 rounded-lg border border-[#DCFCE7]">
            #{_id.slice(-6).toUpperCase()}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${badge.bg}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Parties involved */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F4F7F0]/50 p-3.5 rounded-2xl border border-[#ECF1E4]">
          <div>
            <span className="text-stone-400 font-semibold uppercase tracking-wider block text-[10px]">
              {userRole === 'FARMER' ? 'Buyer Contact' : 'Farmer Contact'}
            </span>
            <div className="font-bold text-[#1A2E05] mt-0.5">
              {userRole === 'FARMER' ? buyer?.name || 'Customer' : farmer?.name || 'Local Farmer'}
            </div>
            <div className="text-stone-500">{userRole === 'FARMER' ? buyer?.phone : farmer?.phone}</div>
          </div>

          <div>
            <span className="text-stone-400 font-semibold uppercase tracking-wider block text-[10px]">
              Delivery Location
            </span>
            <div className="text-stone-700 mt-0.5 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
              <span className="line-clamp-2">{deliveryAddress || 'Direct Farm Pickup'}</span>
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Order Items</div>
          <div className="divide-y divide-[#ECF1E4]">
            {items.map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#166534] font-bold flex items-center justify-center text-xs border border-[#DCFCE7]">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A2E05]">{item.productName || 'Harvest Item'}</div>
                    <div className="text-xs text-stone-500">
                      {item.quantity} {item.unit || 'kg'} &times; ${Number(item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-[#1A2E05]">
                  ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {notes && (
          <div className="text-xs bg-amber-50 border border-amber-200/60 p-2.5 rounded-xl text-amber-900">
            <span className="font-semibold">Special Instructions:</span> {notes}
          </div>
        )}

        {/* Payment */}
        <div className="rounded-2xl border border-[#ECF1E4] bg-[#F4F7F0]/60 p-3.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[#1A2E05]">
              <Wallet className="h-4 w-4 text-[#22C55E]" />
              <span className="font-bold">Payment</span>
              {paymentMethod && <span className="text-stone-500">via {paymentLabels[paymentMethod] || paymentMethod}</span>}
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                paymentBadges[paymentStatus] || paymentBadges.PENDING
              }`}
            >
              {paymentLabel}
            </span>
          </div>
          {paymentReference && (
            <div className="mt-2 text-[11px] text-stone-500">
              Transfer reference: <span className="font-mono font-semibold text-stone-700">{paymentReference}</span>
            </div>
          )}
        </div>

        {/* Total & Action Buttons */}
        <div className="pt-3 border-t border-[#ECF1E4] flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-500 font-medium">Total Order Value</div>
            <div className="text-xl font-extrabold text-[#166534]">${Number(totalAmount).toFixed(2)}</div>
          </div>

          <div className="flex items-center gap-2">
            {/* Farmer Actions */}
            {userRole === 'FARMER' && (
              <>
                {status === 'PENDING' && (
                  <>
                    <button
                      disabled={updating}
                      onClick={() => handleAction('ACCEPTED')}
                      className="px-4 py-2 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs shadow-md shadow-green-200/50 transition-colors"
                    >
                      Accept Order
                    </button>
                    <button
                      disabled={updating}
                      onClick={() => handleAction('REJECTED')}
                      className="px-4 py-2 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors"
                    >
                      Decline
                    </button>
                  </>
                )}

                {status === 'ACCEPTED' && (
                  <button
                    disabled={updating}
                    onClick={() => handleAction('PROCESSING')}
                    className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
                  >
                    Start Harvesting / Packing
                  </button>
                )}

                {status === 'PROCESSING' && (
                  <button
                    disabled={updating}
                    onClick={() => handleAction('READY_FOR_DELIVERY')}
                    className="px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
                  >
                    Mark Ready for Dispatch
                  </button>
                )}

                {status === 'READY_FOR_DELIVERY' && (
                  <button
                    disabled={updating}
                    onClick={() => handleAction('OUT_FOR_DELIVERY')}
                    className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors"
                  >
                    Dispatch / Out for Delivery
                  </button>
                )}

                {status === 'OUT_FOR_DELIVERY' && (
                  <button
                    disabled={updating}
                    onClick={() => handleAction('DELIVERED')}
                    className="px-4 py-2 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs transition-colors shadow-md shadow-green-200/50"
                  >
                    Confirm Delivered
                  </button>
                )}
              </>
            )}

            {/* Buyer Actions */}
            {userRole === 'BUYER' && (
              <>
                {!['REJECTED', 'CANCELLED'].includes(status) && paymentStatus !== 'PAID' && onOpenPaymentModal && (
                  <button
                    disabled={updating}
                    onClick={() => onOpenPaymentModal(order)}
                    className="px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-md shadow-sky-200/50"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{paymentStatus === 'SUBMITTED' ? 'Update Payment' : 'Pay by Mobile Wallet'}</span>
                  </button>
                )}

                {status === 'PENDING' && (
                  <button
                    disabled={updating}
                    onClick={() => handleAction('CANCELLED')}
                    className="px-4 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs transition-colors"
                  >
                    Cancel Request
                  </button>
                )}

                {(status === 'DELIVERED' || status === 'OUT_FOR_DELIVERY') && (
                  <button
                    disabled={updating}
                    onClick={() => handleAction('COMPLETED')}
                    className="px-4 py-2 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs transition-colors shadow-md shadow-green-200/50"
                  >
                    Confirm Received & Complete
                  </button>
                )}

                {(status === 'DELIVERED' || status === 'COMPLETED') && onOpenReviewModal && (
                  <button
                    onClick={() => onOpenReviewModal(order)}
                    className="px-4 py-2 rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-md shadow-amber-200/50"
                  >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>Review Farmer</span>
                  </button>
                )}
              </>
            )}

            {userRole === 'FARMER' && paymentStatus === 'SUBMITTED' && onConfirmPayment && (
              <button
                disabled={updating}
                onClick={handlePaymentConfirmation}
                className="px-4 py-2 rounded-full bg-[#166534] hover:bg-[#14532D] disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-md shadow-green-200/50"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Confirm Payment</span>
              </button>
            )}

            {/* Admin Actions */}
            {userRole === 'ADMIN' && (
              <div className="flex items-center gap-1.5">
                <select
                  value={status}
                  onChange={(e) => handleAction(e.target.value)}
                  className="text-xs bg-[#F4F7F0] border border-[#ECF1E4] rounded-xl px-2.5 py-1.5 font-bold text-[#1A2E05]"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="READY_FOR_DELIVERY">READY_FOR_DELIVERY</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
