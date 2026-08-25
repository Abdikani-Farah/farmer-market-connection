import React from 'react';
import { Sprout, ShieldCheck, Heart, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-100 shadow-sm">
          <Sprout className="w-4 h-4" />
          <span>Our Agricultural Mission</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
          Empowering Local Farmers & Nourishing Communities
        </h1>

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Farmer Market Connection was founded to bridge the critical gap between hardworking regional growers and
          commercial/residential food buyers.
        </p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Our Story
            </span>

            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-900">
              Direct From Soil To Table
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-stone-600 text-sm leading-relaxed">
              In traditional agricultural supply chains, farmers often receive only a fraction of market value for their
              hard work due to multiple layers of intermediaries and opaque brokerage.
            </p>

            <p className="text-stone-600 text-sm leading-relaxed">
              Our platform equips every grower with a digital storefront, transparent pricing tools, direct buyer
              communication, and reliable fulfillment workflows.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="group p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl font-black text-emerald-800">100%</div>
              <div className="text-xs text-stone-600 font-semibold mt-2">
                Direct Field Pricing
              </div>
            </div>

            <div className="group p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl font-black text-emerald-800">0%</div>
              <div className="text-xs text-stone-600 font-semibold mt-2">
                Hidden Broker Markups
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-emerald-100 rounded-[2rem] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative rounded-[1.75rem] overflow-hidden shadow-xl border border-stone-200 bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80"
              alt="Farmer in the field"
              className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="relative overflow-hidden bg-stone-50 p-8 sm:p-12 rounded-[2rem] border border-stone-200 shadow-sm">

        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-100/40 rounded-full blur-3xl" />

        <div className="relative space-y-10">

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-stone-200 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
              Our Values
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-stone-900">
              Our Core Principles
            </h2>

            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Every feature in our platform is guided by these commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="group bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <h3 className="font-bold text-base text-stone-900">
                Producer Integrity
              </h3>

              <p className="text-xs text-stone-500 leading-relaxed">
                Every farm profile is reviewed by administrators to ensure authentic grower identity and verified quality.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                <Heart className="w-5 h-5" />
              </div>

              <h3 className="font-bold text-base text-stone-900">
                Community First
              </h3>

              <p className="text-xs text-stone-500 leading-relaxed">
                Supporting rural farming families in Lower and Middle Shabelle, keeping capital circulating in local agriculture.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                <Target className="w-5 h-5" />
              </div>

              <h3 className="font-bold text-base text-stone-900">
                Food Security & Freshness
              </h3>

              <p className="text-xs text-stone-500 leading-relaxed">
                Minimizing storage lag so consumers enjoy nutritional, field-fresh produce harvested the very same day.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}