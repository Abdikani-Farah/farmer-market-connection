import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, CheckCircle, Package, Tractor, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../api/axios.js';

export default function FarmerCard({ farm }) {
  if (!farm) return null;

  const {
    _id,
    farmName,
    farmer,
    location,
    region,
    district,
    farmSize,
    crops = [],
    images = [],
    isVerified,
    productCount = 0,
    rating = 4.9,
    reviewCount = 0,
  } = farm;

  const farmerName = farmer?.name || 'Verified Farmer';
  const defaultImage =
    images && images.length > 0
      ? getImageUrl(images[0])
      : 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80';

  const avatar =
    farmer?.profileImage ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-2xl border border-[#ECF1E4] shadow-xs hover:shadow-md hover:border-[#22C55E]/40 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Farm Banner */}
      <div className="relative h-40 overflow-hidden bg-stone-100">
        <img
          src={defaultImage}
          alt={farmName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isVerified && (
          <span className="absolute top-3 right-3 bg-[#15803D]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Farm</span>
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between -mt-6">
        <div>
          {/* Avatar and Top Info */}
          <div className="flex items-end justify-between mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md overflow-hidden border-2 border-[#22C55E] shrink-0">
              <img src={avatar} alt={farmerName} className="w-full h-full object-cover rounded-xl" />
            </div>

            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-900">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span>{rating}</span>
              {reviewCount > 0 && <span className="text-stone-400 font-normal">({reviewCount})</span>}
            </div>
          </div>

          {/* Titles */}
          <Link to={`/farmers/${_id}`}>
            <h3 className="font-bold text-[#1A2E05] text-lg group-hover:text-[#22C55E] transition-colors">
              {farmName}
            </h3>
          </Link>
          <div className="text-xs font-semibold text-[#15803D] flex items-center gap-1 mt-0.5">
            <span>By {farmerName}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-stone-500 mt-2">
            <MapPin className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
            <span className="truncate">{location || [district, region].filter(Boolean).join(', ') || 'Local Farm'}</span>
          </div>

          {/* Crops / Tags */}
          {crops && crops.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {crops.slice(0, 3).map((crop, idx) => (
                <span
                  key={idx}
                  className="bg-[#F4F7F0] text-[#1A2E05] text-[11px] font-semibold px-2 py-0.5 rounded-md"
                >
                  {crop}
                </span>
              ))}
              {crops.length > 3 && (
                <span className="bg-[#F4F7F0] text-stone-500 text-[11px] font-semibold px-1.5 py-0.5 rounded-md">
                  +{crops.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer info & Button */}
        <div className="mt-5 pt-3 border-t border-[#ECF1E4] flex items-center justify-between">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#22C55E]" />
            <span className="font-bold text-stone-800">{productCount}</span>
            <span>Harvests</span>
          </div>

          <Link
            to={`/farmers/${_id}`}
            className="inline-flex items-center gap-1 bg-[#F0FDF4] hover:bg-[#22C55E] text-[#166534] hover:text-white font-bold text-xs px-3.5 py-2 rounded-full transition-all shadow-xs"
          >
            <span>View Farm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
