import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart, Users, Target, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Sprout className="w-3.5 h-3.5" />
          <span>Our Agricultural Mission</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
          Empowering Local Farmers & Nourishing Communities
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Farmer Market Connection was founded to bridge the critical gap between hardworking regional growers and
          commercial/residential food buyers.
        </p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Direct From Soil To Table</h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            In traditional agricultural supply chains, farmers often receive only a fraction of market value for their
            hard work due to multiple layers of intermediaries and opaque brokerage.
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            Our platform equips every grower with a digital storefront, transparent pricing tools, direct buyer
            communication, and reliable fulfillment workflows.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
              <div className="text-2xl font-black text-emerald-800">100%</div>
              <div className="text-xs text-stone-600 font-semibold mt-1">Direct Field Pricing</div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
              <div className="text-2xl font-black text-emerald-800">0%</div>
              <div className="text-xs text-stone-600 font-semibold mt-1">Hidden Broker Markups</div>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-stone-200">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80"
            alt="Farmer in the field"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-stone-100/70 p-8 sm:p-12 rounded-3xl border border-stone-200 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Our Core Principles</h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">Every feature in our platform is guided by these commitments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Producer Integrity</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every farm profile is reviewed by administrators to ensure authentic grower identity and verified quality.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Community First</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Supporting rural farming families in Lower and Middle Shabelle, keeping capital circulating in local agriculture.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900">Food Security & Freshness</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Minimizing storage lag so consumers enjoy nutritional, field-fresh produce harvested the very same day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
