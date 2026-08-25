import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../context/AuthContext.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import FarmerCard from '../../components/FarmerCard.jsx';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Truck,
  TrendingUp,
  Award,
  Users,
  Sprout,
  CheckCircle2,
  Carrot,
  Apple,
  Wheat,
  Milk,
  Egg,
  Beef,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

const categoryIcons = {
  Vegetables: Carrot,
  Fruits: Apple,
  Grains: Wheat,
  Dairy: Milk,
  Poultry: Egg,
  Livestock: Beef,
  Seeds: Sprout,
  Other: Package,
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredFarms, setFeaturedFarms] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catRes, prodRes, farmRes, statsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=8&sort=newest'),
          api.get('/farms?limit=3'),
          api.get('/stats'),
        ]);

        if (catRes.data.success) setCategories(catRes.data.data);
        if (prodRes.data.success) setFeaturedProducts(prodRes.data.data);
        if (farmRes.data.success) setFeaturedFarms(farmRes.data.data);
        if (statsRes.data.success) setStats(statsRes.data.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0c2e17] via-[#144222] to-[#1A2E05] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle background graphic overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#86efac] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                <Sprout className="w-4 h-4 text-[#4ade80]" />
                <span>Next-Gen Agricultural Connection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                Connect With Farmers. <br className="hidden sm:inline" />
                <span className="text-[#4ade80]">Buy Fresh.</span> <span className="text-[#FBBF24]">Sell Better.</span>
              </h1>

              <p className="text-lg sm:text-xl text-stone-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Discover fresh agricultural harvests directly from certified local farmers. Direct pricing, wholesale quantities, and zero intermediary markups.
              </p>

              {/* Integrated Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-2xl mx-auto lg:mx-0 bg-white/95 backdrop-blur-xs p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 border border-white/20"
              >
                <div className="relative flex-1 flex items-center px-3">
                  <Search className="w-5 h-5 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tomatoes, watermelons, maize, farm location..."
                    className="w-full py-2.5 text-stone-900 placeholder-stone-400 text-sm focus:outline-hidden bg-transparent font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/30 cursor-pointer hover:scale-102"
                >
                  <span>Search Harvests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/marketplace"
                  className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all shadow-lg shadow-green-500/30 hover:scale-105"
                >
                  Explore Marketplace
                </Link>
                <Link
                  to="/register?role=FARMER"
                  className="bg-stone-900/80 hover:bg-stone-800 text-white border border-stone-600 font-bold px-7 py-3.5 rounded-full text-sm transition-all hover:border-[#22C55E]"
                >
                  Sell Your Products
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4ade80]" /> Direct Farm Verification
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4ade80]" /> Transparent Pricing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4ade80]" /> Direct Buyer Orders
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#22C55E]/30">
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=1000&auto=format&fit=crop&q=80"
                  alt="Fresh farm produce"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>

                {/* Floating Micro Highlights */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs text-stone-800 p-4 rounded-2xl shadow-xl flex items-center justify-between border border-[#ECF1E4]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#166534] flex items-center justify-center font-bold border border-[#DCFCE7]">
                      <Sprout className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#1A2E05]">Direct From Afgooye & Jowhar</div>
                      <div className="text-[11px] text-stone-500">Over 5,000+ kg freshly harvested daily</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#166534] bg-[#F0FDF4] border border-[#DCFCE7] px-2.5 py-1 rounded-full">
                    100% Fresh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-1">Browse By Sector</div>
            <h2 className="text-3xl font-extrabold text-[#1A2E05]">Agricultural Categories</h2>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-bold text-[#15803D] hover:text-[#22C55E] inline-flex items-center gap-1.5"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const IconComponent = categoryIcons[cat.name] || Sprout;
            return (
              <Link
                key={cat._id}
                to={`/marketplace?category=${encodeURIComponent(cat.name)}`}
                className="bg-white rounded-2xl p-4 border border-[#ECF1E4] hover:border-[#22C55E] hover:shadow-md transition-all text-center flex flex-col items-center justify-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#166534] group-hover:bg-[#22C55E] group-hover:text-white transition-all flex items-center justify-center mb-3 shadow-xs border border-[#DCFCE7]">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#1A2E05] text-xs sm:text-sm group-hover:text-[#22C55E] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-stone-400 mt-1 font-medium">
                  {cat.productCount !== undefined ? `${cat.productCount} items` : 'Explore'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-1">Fresh Off The Field</div>
            <h2 className="text-3xl font-extrabold text-[#1A2E05]">Featured Agricultural Harvests</h2>
          </div>
          <Link
            to="/marketplace"
            className="text-sm font-bold text-[#15803D] hover:text-[#22C55E] inline-flex items-center gap-1.5"
          >
            <span>Explore All Harvests</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-[#ECF1E4] h-80 animate-pulse p-4 space-y-4">
                <div className="bg-stone-200 h-44 rounded-xl"></div>
                <div className="bg-stone-200 h-4 rounded w-3/4"></div>
                <div className="bg-stone-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#ECF1E4]">
            <p className="text-stone-500 text-sm">No products listed currently. Check back shortly!</p>
          </div>
        )}
      </section>

      {/* 4. FEATURED FARMERS */}
      <section className="bg-[#F4F7F0]/80 py-16 border-y border-[#ECF1E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-1">Verified Producers</div>
              <h2 className="text-3xl font-extrabold text-[#1A2E05]">Featured Local Farmers & Farms</h2>
            </div>
            <Link
              to="/farmers"
              className="text-sm font-bold text-[#15803D] hover:text-[#22C55E] inline-flex items-center gap-1.5"
            >
              <span>View All Farmers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredFarms.map((farm) => (
              <FarmerCard key={farm._id} farm={farm} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-1">Simple Workflow</div>
          <h2 className="text-3xl font-extrabold text-[#1A2E05]">How Farmer Market Connection Works</h2>
          <p className="text-sm text-stone-500 mt-2 font-medium">
            A seamless six-step cycle engineered for direct farmer-to-buyer transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Farmers List Products',
              desc: 'Registered farmers publish harvest batches with quantities, units, locations, and direct field pricing.',
              icon: Sprout,
            },
            {
              step: '02',
              title: 'Buyers Discover Products',
              desc: 'Commercial buyers, markets, and households search, filter, and inspect verified farm profiles.',
              icon: Search,
            },
            {
              step: '03',
              title: 'Buyers Place Orders',
              desc: 'Buyers request desired harvest quantities, specify delivery location, and submit direct orders.',
              icon: Package,
            },
            {
              step: '04',
              title: 'Farmers Fulfill Orders',
              desc: 'Farmers review, accept order requests, harvest fresh produce, and pack batches for dispatch.',
              icon: CheckCircle2,
            },
            {
              step: '05',
              title: 'Products Are Delivered',
              desc: 'Harvests are transported directly from the farm to the customer with live status updates.',
              icon: Truck,
            },
            {
              step: '06',
              title: 'Buyer Reviews Farmer',
              desc: 'Upon successful delivery, buyers rate produce quality and write authentic farmer reviews.',
              icon: Award,
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-[#ECF1E4] shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-[#22C55E]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6 text-[#22C55E]" />
                    </div>
                    <span className="text-2xl font-black text-stone-200 font-mono">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A2E05] mb-2">{item.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. BENEFITS */}
      <section className="bg-gradient-to-br from-[#0c2e17] to-[#1A2E05] text-white rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 py-16 relative overflow-hidden shadow-xl border border-[#22C55E]/20">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#22C55E]/20 text-[#86efac] border border-[#22C55E]/40 text-xs font-bold uppercase tracking-wider">
            <span>Marketplace Value</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Why Connect Direct Through Farmer Market?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Eliminating unnecessary middlemen ensures farmers earn fair compensation for their harvest while buyers
            receive fresher, certified quality produce at competitive prices.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {[
              { title: 'Direct Farmer Connection', desc: 'Communicate directly with registered growers.' },
              { title: 'Better Market Access', desc: 'Expanded buyer reach across regional markets.' },
              { title: 'Transparent Pricing', desc: 'Clear price per kilogram with zero hidden fees.' },
              { title: 'Verified Farm Profiles', desc: 'Admin-inspected farms and genuine buyer ratings.' },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-[#4ade80] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">{b.title}</div>
                  <div className="text-xs text-emerald-200 mt-0.5">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/register?role=FARMER"
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all shadow-lg shadow-green-500/30 hover:scale-105"
            >
              Register As Farmer
            </Link>
            <Link
              to="/marketplace"
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-7 py-3.5 rounded-full text-sm border border-white/30 transition-colors"
            >
              Browse All Produce
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
