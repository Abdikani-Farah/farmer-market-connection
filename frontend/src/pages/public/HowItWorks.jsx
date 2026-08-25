import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Search,
  ShoppingBag,
  CheckCircle2,
  Truck,
  Award,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Farmers Register & List Products',
      desc: 'Farmers create their agricultural profile, list their farm location, and post active harvest batches with transparent pricing per kilogram/unit.',
      icon: Sprout,
    },
    {
      num: '02',
      title: 'Buyers Discover Local Produce',
      desc: 'Buyers browse the marketplace, search by crop variety, filter by farm region, and compare direct farm prices without intermediaries.',
      icon: Search,
    },
    {
      num: '03',
      title: 'Buyers Place Orders',
      desc: 'Buyers request specific quantities, set desired delivery addresses or select farm pickup, and submit their purchase order.',
      icon: ShoppingBag,
    },
    {
      num: '04',
      title: 'Farmers Fulfill Orders',
      desc: 'The farmer receives the request, accepts or coordinates packing, and updates harvest progress in their farmer portal.',
      icon: CheckCircle2,
    },
    {
      num: '05',
      title: 'Products Are Delivered',
      desc: 'Fresh agricultural produce is transported directly from the grower to the destination with live status tracking.',
      icon: Truck,
    },
    {
      num: '06',
      title: 'Buyer Reviews Farmer',
      desc: 'Upon delivery confirmation, the buyer rates produce freshness and writes a verified review to support the grower community.',
      icon: Award,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Sprout className="w-3.5 h-3.5" />
          <span>Operational Blueprint</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
          How Farmer Market Connection Works
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Our platform establishes direct transactional relationships between agricultural growers and buyers,
          eliminating middlemen and ensuring quality, freshness, and equitable market prices.
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-3xl font-black text-stone-200 font-mono">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to start buying or selling?</h2>
          <p className="text-xs sm:text-sm text-emerald-200">
            Join hundreds of local farmers and wholesale buyers already transacting on the platform.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            to="/register?role=FARMER"
            className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-5 py-3 rounded-xl text-xs transition-colors"
          >
            Sell As Farmer
          </Link>
          <Link
            to="/marketplace"
            className="bg-stone-800 hover:bg-stone-700 text-white font-semibold px-5 py-3 rounded-xl text-xs border border-stone-700 transition-colors"
          >
            Explore Produce
          </Link>
        </div>
      </div>
    </div>
  );
}
