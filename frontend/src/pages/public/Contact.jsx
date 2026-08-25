import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Support & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">Get in Touch With Our Team</h1>
        <p className="text-stone-600 text-sm">
          Have questions regarding farm registration, bulk order logistics, or platform verification? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-lg space-y-6">
            <h2 className="text-xl font-bold">Agricultural Support Center</h2>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Our regional coordinators are situated across major agricultural belts to assist growers with onboarding and order dispatch.
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Central Agricultural Hub</span>
                  <span className="text-emerald-200">Afgooye & Jowhar Corridors / Mogadishu Center</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block text-white">Direct Farmer Line</span>
                  <span className="text-emerald-200">+252 61 500-FARM</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block text-white">Email Address</span>
                  <span className="text-emerald-200">support@farmermarket.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">Message Received!</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Thank you for contacting Farmer Market Connection. Our team will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900">Send an Inquiry</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="E.g. Farmer registration assistance or bulk buying"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Your Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help your farm or business?"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-emerald-600 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
