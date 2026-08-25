import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../context/AuthContext.jsx';
import { getImageUrl } from '../../api/axios.js';
import ProductCard from '../../components/ProductCard.jsx';
import {
  MapPin,
  Star,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  Layers,
  Sprout,
  Tractor,
  Package,
  ArrowLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

export default function FarmerDetails() {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarm = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/farms/${id}`);
        if (res.data.success) {
          setFarm(res.data.data);
        }
      } catch (err) {
        setError('Farm profile could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-6">
        <div className="h-64 bg-stone-200 rounded-3xl"></div>
        <div className="h-8 bg-stone-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (error || !farm) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">{error || 'Farm Not Found'}</h2>
        <Link
          to="/farmers"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Farmers Directory</span>
        </Link>
      </div>
    );
  }

  const {
    farmName,
    farmer,
    description,
    location,
    region,
    district,
    farmSize,
    crops = [],
    images = [],
    isVerified,
    products = [],
    reviews = [],
    rating = 4.9,
    reviewCount = 0,
  } = farm;

  const bannerImage =
    images && images.length > 0
      ? getImageUrl(images[0])
      : 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&auto=format&fit=crop&q=80';

  const avatar =
    farmer?.profileImage ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-emerald-700">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/farmers" className="hover:text-emerald-700">
          Farmers Directory
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-stone-800">{farmName}</span>
      </div>

      {/* Hero Farm Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-md bg-stone-900">
        <div className="h-64 sm:h-80 w-full relative">
          <img src={bannerImage} alt={farmName} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent"></div>
        </div>

        {/* Overlay Farmer Info */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-white shrink-0">
              <img src={avatar} alt={farmer?.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">{farmName}</h1>
                {isVerified && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="text-sm text-emerald-200 font-medium mt-0.5">Operated by {farmer?.name}</div>
              <div className="flex items-center gap-3 text-xs text-stone-300 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{location || [district, region].filter(Boolean).join(', ')}</span>
                </span>
                {farmSize && (
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{farmSize}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-bold text-amber-300">
                <Star className="w-4 h-4 fill-amber-300" />
                <span>{rating}</span>
              </div>
              <div className="text-[11px] text-stone-300">{reviewCount} Verified Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Farm Specs & Description */}
        <div className="lg:col-span-8 space-y-8">
          {/* Farm Description */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-stone-900">About {farmName}</h2>
            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
              {description || 'Dedicated to cultivating high standard, sustainable agricultural produce for wholesale and direct consumer markets.'}
            </p>

            {/* Cultivated Crops */}
            {crops && crops.length > 0 && (
              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Key Crops Cultivated</h3>
                <div className="flex flex-wrap gap-2">
                  {crops.map((crop, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1"
                    >
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{crop}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Farm Available Harvests / Products */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">Available Harvests ({products.length})</h2>
                <p className="text-xs text-stone-500">Produce currently available for order from this farm.</p>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 text-center text-stone-500 text-xs">
                This farm currently has no published harvest batches. Please check back later.
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="text-xl font-bold text-stone-900">Buyer Reviews</h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl">
                {reviews.length} Verified Submissions
              </span>
            </div>

            {reviews.length > 0 ? (
              <div className="divide-y divide-stone-100">
                {reviews.map((rev) => (
                  <div key={rev._id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-stone-900">{rev.buyer?.name || 'Verified Customer'}</div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400">No reviews yet for this farmer.</p>
            )}
          </div>
        </div>

        {/* Right Column: Contact & Farm Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
            <h3 className="font-bold text-stone-900 text-base">Direct Producer Contact</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <div className="text-stone-400 font-semibold text-[10px] uppercase">Phone</div>
                  <div className="font-bold text-stone-800">{farmer?.phone || '+252 61 7123456'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <div className="text-stone-400 font-semibold text-[10px] uppercase">Email</div>
                  <div className="font-bold text-stone-800">{farmer?.email || 'farmer@market.com'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <div className="text-stone-400 font-semibold text-[10px] uppercase">Location</div>
                  <div className="font-bold text-stone-800">
                    {location || [district, region].filter(Boolean).join(', ')}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/marketplace"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Package className="w-4 h-4" />
                <span>Explore Other Regional Farms</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
