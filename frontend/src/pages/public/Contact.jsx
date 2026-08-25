import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  MessageSquare,
  Clock3,
  ArrowUpRight,
} from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  retrn (
    <div className="min-h-screen bg-[#fafbf8] text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* ================= HEADER ================= */}
        <div className="relative text-center max-w-3xl mx-auto mb-12">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-100/60 blur-3xl rounded-full pointer-events-none" />

          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.15em]">
              <MessageSquare className="w-3.5 h-3.5" />
              Support & Inquiries
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-900">
              Let's build a better
              <span className="text-emerald-700"> farm-to-market</span>
              {' '}connection.
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-500 leading-7">
              Whether you're a farmer, buyer, or business partner, our team is
              here to help you get the most from Farmer Market Connection.
            </p>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* ================= LEFT SIDE ================= */}
          <div className="lg:col-span-5 flex flex-col gap-5">

            {/* Main Support Card */}
            <div className="relative overflow-hidden bg-emerald-950 rounded-[2rem] p-7 sm:p-8 text-white shadow-xl shadow-emerald-950/10">

              {/* Decorative circles */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-emerald-800/50" />
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full border border-emerald-800/50" />

              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-emerald-800 flex items-center justify-center mb-6">
                  <MessageSquare className="w-5 h-5 text-emerald-300" />
                </div>

                <h2 className="text-2xl font-bold mb-3">
                  We're here to help.
                </h2>

                <p className="text-sm text-emerald-100/70 leading-6 max-w-md">
                  Need help with registration, orders, verification, or
                  connecting with farmers and buyers? Reach out to our team.
                </p>

                <div className="mt-8 space-y-5">

                  {/* Location */}
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                      <MapPin className="w-4 h-4 text-emerald-300" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white">
                        Agricultural Hub
                      </p>
                      <p className="text-xs text-emerald-200/70 mt-1 leading-5">
                        Afgooye & Jowhar Corridors
                        <br />
                        Mogadishu Center
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                      <Phone className="w-4 h-4 text-emerald-300" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white">
                        Direct Farmer Line
                      </p>
                      <p className="text-xs text-emerald-200/70 mt-1">
                        +252 61 500-FARM
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                      <Mail className="w-4 h-4 text-emerald-300" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white">
                        Email Support
                      </p>
                      <p className="text-xs text-emerald-200/70 mt-1">
                        support@farmermarket.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-white border border-stone-200 rounded-[1.75rem] p-6 shadow-sm">
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock3 className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-stone-900">
                      Average response time
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Usually within 24 hours
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="w-4 h-4 text-stone-300" />
              </div>
            </div>
          </div>

          {/* ================= FORM SIDE ================= */}
          <div className="lg:col-span-7">
            <div className="h-full bg-white border border-stone-200 rounded-[2rem] shadow-sm p-6 sm:p-8 lg:p-10">

              {submitted ? (
                <div className="h-full min-h-[480px] flex items-center justify-center">
                  <div className="text-center max-w-md">

                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse" />

                      <div className="relative w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-stone-900">
                      Message received!
                    </h3>

                    <p className="text-sm text-stone-500 leading-6 mt-3">
                      Thank you for reaching out to Farmer Market Connection.
                      Our team will review your message and get back to you
                      within 24 hours.
                    </p>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-7 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-700/20"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Form Header */}
                  <div className="border-b border-stone-100 pb-6">
                    <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-emerald-700 mb-2">
                      Contact our team
                    </p>

                    <h2 className="text-2xl font-black text-stone-900">
                      Send us a message
                    </h2>

                    <p className="text-xs text-stone-500 mt-2">
                      Tell us what you need and we'll get back to you shortly.
                    </p>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Enter your name"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700">
                        Email Address
                      </label>

                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>

                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-700">
                      Subject
                    </label>

                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      placeholder="What can we help you with?"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700">
                        Your Message
                      </label>

                      <span className="text-[10px] text-stone-400">
                        Be as detailed as possible
                      </span>
                    </div>

                    <textarea
                      rows={6}
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Tell us how we can help your farm or business..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="group w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    <span>Send Message</span>
                  </button>

                  <p className="text-center text-[10px] text-stone-400">
                    By submitting this form, you agree to be contacted by our
                    support team.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM TRUST ================= */}
        <div className="mt-10 text-center">
          <p className="text-xs text-stone-400">
            Connecting farmers, buyers, and communities across Somalia.
          </p>
        </div>

      </div>
    </div>
  );
}