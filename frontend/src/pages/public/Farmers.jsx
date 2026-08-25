import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../context/AuthContext.jsx';
import FarmerCard from '../../components/FarmerCard.jsx';
import { Search, ShieldCheck, Tractor, RotateCcw } from 'lucide-react';

export default function Farmers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const search = searchParams.get('search') || '';
  const region = searchParams.get('region') || '';
  const verifiedOnly = searchParams.get('verified') || '';

  useEffect(() => {
    const fetchFarms = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (search) params.set('search', search);
        if (region) params.set('region', region);
        if (verifiedOnly === 'true') params.set('isVerified', 'true');

        const res = await api.get(`/farms?${params.toString()}`);

        if (res.data.success) {
          setFarms(res.data.data);
        }
      } catch (err) {
        setError('Failed to load farmer directory.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [searchParams]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);

    if (!val) next.delete(key);
    else next.set(key, val);

    setSearchParams(next);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-9">

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-[#0c2e17] text-white rounded-[2rem] p-7 sm:p-11 shadow-lg border border-[#144924]">

        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-emerald-400/10 blur-2xl" />

        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-xs font-bold uppercase tracking-wider text-[#86efac]">
            Producer Directory
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Registered & Verified Farmers
          </h1>

          <p className="text-stone-300 text-sm leading-relaxed max-w-xl">
            Connect directly with growers and farm managers across agricultural regions. Inspect farm acreage, cultivated
            crops, verified credentials, and real customer reviews.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ECF1E4] shadow-sm flex flex-col lg:flex-row gap-3 items-center justify-between">

        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />

          <input
            type="text"
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder="Search farm name, crops, farmer name..."
            className="w-full bg-[#F4F7F0]/70 border border-[#ECF1E4] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#1A2E05] focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">

          <input
            type="text"
            value={region}
            onChange={(e) => updateParam('region', e.target.value)}
            placeholder="Region (e.g. Shabelle)..."
            className="bg-[#F4F7F0]/70 border border-[#ECF1E4] rounded-full px-4 py-2.5 text-xs text-[#1A2E05] focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all flex-1 lg:w-48"
          />

          <button
            onClick={() =>
              updateParam(
                'verified',
                verifiedOnly === 'true' ? '' : 'true'
              )
            }
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              verifiedOnly === 'true'
                ? 'bg-[#22C55E] text-white shadow-md shadow-green-200/50 scale-[1.02]'
                : 'bg-[#F4F7F0] text-[#1A2E05] hover:bg-[#E2E8D8] border border-[#ECF1E4]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Only</span>
          </button>

          {(search || region || verifiedOnly) && (
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full text-stone-500 hover:text-[#1A2E05] hover:bg-[#F4F7F0] transition-all hover:rotate-[-30deg]"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Farmers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-stone-200 h-72 animate-pulse p-4 space-y-4 shadow-sm"
            >
              <div className="bg-stone-200 h-32 rounded-xl" />
              <div className="bg-stone-200 h-4 rounded w-3/4" />
              <div className="bg-stone-200 h-4 rounded w-1/2" />
              <div className="bg-stone-200 h-8 rounded-xl w-full mt-3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-10 text-center bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm shadow-sm">
          {error}
        </div>
      ) : farms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Tractor className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-stone-800">
            No farms match your search
          </h3>

          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search criteria or browse all registered growers.
          </p>

          <button
            onClick={handleReset}
            className="text-xs font-bold text-emerald-800 bg-emerald-50 px-5 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <div
              key={farm._id}
              className="transition-transform duration-300 hover:-translate-y-1"
            >
              <FarmerCard farm={farm} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}