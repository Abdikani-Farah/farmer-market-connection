import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Smartphone, Wallet, X } from 'lucide-react';
import { api } from '../context/AuthContext.jsx';

const paymentOptions = [
  {
    value: 'EVC_PLUS',
    label: 'EVC Plus',
    description: 'Hormuud mobile wallet',
    activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-900',
  },
  {
    value: 'SAAD',
    label: 'SAAD',
    description: 'Somtel mobile wallet',
    activeClass: 'border-sky-500 bg-sky-50 text-sky-900',
  },
  {
    value: 'E_DAHAB',
    label: 'e-Dahab',
    description: 'Telesom mobile wallet',
    activeClass: 'border-amber-500 bg-amber-50 text-amber-900',
  },
];

export default function PaymentModal({ order, onClose, onSubmitted }) {
  const [paymentMethod, setPaymentMethod] = useState(order?.paymentMethod || 'EVC_PLUS');
  const [paymentPhone, setPaymentPhone] = useState(order?.paymentPhone || order?.buyer?.phone || '');
  const [paymentReference, setPaymentReference] = useState(order?.paymentReference || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!order) return null;

  const selectedMethod = paymentOptions.find((option) => option.value === paymentMethod);
  const farmerName = order.farmer?.name || 'your farmer';
  const farmerPhone = order.farmer?.phone || 'the farmer\'s registered number';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await api.post(`/orders/${order._id}/payment`, {
        paymentMethod,
        paymentPhone,
        paymentReference,
      });

      if (response.data.success) {
        setSuccess(true);
        onSubmitted?.(response.data.data);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not submit payment details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-3xl border border-[#ECF1E4] bg-white p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-stone-400 hover:bg-[#F4F7F0] hover:text-stone-700"
          aria-label="Close payment window"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EE] text-[#15803D]">
              <CheckCircle className="h-10 w-10 text-[#22C55E]" />
            </div>
            <h2 className="text-xl font-bold text-[#1A2E05]">Payment details submitted</h2>
            <p className="text-xs leading-relaxed text-stone-600">
              Your {selectedMethod?.label} reference was sent to {farmerName}. The payment will show as paid after the
              farmer verifies it.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-full bg-[#22C55E] py-3 text-xs font-bold text-white transition-colors hover:bg-[#16A34A]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#15803D]">Mobile Wallet Payment</div>
              <h2 className="mt-1 text-xl font-bold text-[#1A2E05]">Pay order #{order._id.slice(-6).toUpperCase()}</h2>
              <p className="mt-1 text-xs text-stone-500">Choose a wallet, transfer the amount, then submit its reference.</p>
            </div>

            <div className="rounded-2xl border border-[#DCFCE7] bg-[#F4F7F0] p-4 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-stone-600">Amount to transfer</span>
                <span className="text-xl font-extrabold text-[#166534]">${Number(order.totalAmount).toFixed(2)}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-stone-600">
                <Smartphone className="h-4 w-4 text-[#22C55E]" />
                <span>
                  Send to <strong className="text-[#1A2E05]">{farmerName}</strong>: {farmerPhone}
                </span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A2E05]">Choose payment service</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {paymentOptions.map((option) => {
                  const isSelected = paymentMethod === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPaymentMethod(option.value)}
                      className={`rounded-xl border p-3 text-left transition-colors ${
                        isSelected ? option.activeClass : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <Wallet className="mb-1 h-4 w-4" />
                      <span className="block text-xs font-extrabold">{option.label}</span>
                      <span className="block text-[10px] opacity-75">{option.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A2E05]">Your mobile-wallet number</label>
              <input
                type="tel"
                required
                value={paymentPhone}
                onChange={(event) => setPaymentPhone(event.target.value)}
                placeholder="e.g. +252 61 0000000"
                className="w-full rounded-xl border border-[#ECF1E4] bg-[#F4F7F0] px-3.5 py-2.5 text-sm text-[#1A2E05] outline-none focus:border-[#22C55E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A2E05]">Transaction reference</label>
              <input
                type="text"
                required
                value={paymentReference}
                onChange={(event) => setPaymentReference(event.target.value)}
                placeholder="Enter the reference from your wallet"
                className="w-full rounded-xl border border-[#ECF1E4] bg-[#F4F7F0] px-3.5 py-2.5 text-sm text-[#1A2E05] outline-none focus:border-[#22C55E]"
              />
              <p className="text-[11px] text-stone-500">Payment stays pending until the farmer confirms the transfer.</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#22C55E] py-3.5 text-sm font-bold text-white shadow-md shadow-green-200/50 transition-colors hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Wallet className="h-4 w-4" />
              <span>{submitting ? 'Submitting payment…' : `Submit ${selectedMethod?.label} payment`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
