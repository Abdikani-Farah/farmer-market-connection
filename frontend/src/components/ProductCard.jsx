import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { getImageUrl } from '../api/axios.js';

export default function ProductCard({ product }) {
  if (!product) return null;

  const {
    _id,
    name,
    price,
    quantity,
    unit = 'kg',
    location,
    images = [],
    farmer,
    farm,
    category,
    availability,
    farmerRating = 4.9,
    farmerReviewCount = 0,
  } = product;

  const defaultImage =
    images && images.length > 0
      ? getImageUrl(images[0])
      : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80';

  const farmerName = farmer?.name || 'Local Producer';
  const isOutOfStock = !availability || quantity <= 0;

  return (
    <div className="bg-white rounded-2xl border border-[#ECF1E4] shadow-xs hover:shadow-md hover:border-[#22C55E]/40 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={defaultImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category Pill */}
        {category?.name && (
          <span className="absolute top-3 left-3 bg-[#1A2E05]/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {category.name}
          </span>
        )}

        {/* Stock Status */}
        <span
          className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs ${
            isOutOfStock
              ? 'bg-rose-600/90 text-white'
              : quantity < 50
              ? 'bg-[#F59E0B]/90 text-white'
              : 'bg-[#22C55E]/90 text-white'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : `${quantity} ${unit} Available`}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="flex items-center gap-1 truncate max-w-[65%]">
              <MapPin className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
              <span className="truncate">{location || farm?.location || 'Direct Farm'}</span>
            </span>
            <span className="flex items-center gap-1 font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span>{farmerRating}</span>
              {farmerReviewCount > 0 && <span className="text-stone-400 text-[10px] font-normal">({farmerReviewCount})</span>}
            </span>
          </div>

          {/* Product Name */}
          <Link to={`/products/${_id}`}>
            <h3 className="font-bold text-[#1A2E05] text-base group-hover:text-[#22C55E] transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Farmer & Farm Name */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-600">
            <UserCheck className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
            <span className="font-semibold text-stone-800">{farmerName}</span>
            {farm?.farmName && <span className="text-stone-400 truncate">• {farm.farmName}</span>}
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-[#ECF1E4] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Direct Price</div>
            <div className="text-lg font-black text-[#15803D]">
              ${Number(price).toFixed(2)}{' '}
              <span className="text-xs text-stone-500 font-normal">/ {unit}</span>
            </div>
          </div>

          <Link
            to={`/products/${_id}`}
            className="inline-flex items-center gap-1.5 bg-[#F0FDF4] hover:bg-[#22C55E] text-[#166534] hover:text-white font-bold text-xs px-4 py-2 rounded-full transition-all shadow-xs"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
