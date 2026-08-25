import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../context/AuthContext.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  MapPin,
  Carrot,
} from 'lucide-react';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const availability = searchParams.get('availability') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams(searchParams);
        if (!params.get('limit')) params.set('limit', '12');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.data);
          setPagination(res.data.pagination || { page: 1, totalPages: 1, total: res.data.count });
        }
      } catch (err) {
        setError('Unable to load agricultural products. Please retry.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === null || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c2e17] via-[#144222] to-[#1A2E05] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-lg border border-[#22C55E]/20">
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-[#86efac] mb-2">Agricultural Market</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Direct Harvest Marketplace</h1>
          <p className="text-stone-200 text-sm mt-2 leading-relaxed">
            Browse live harvest batches directly from verified farmers. Real-time availability, clear wholesale pricing,
            and fast farm-to-table delivery.
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block bg-white p-6 rounded-2xl border border-[#ECF1E4] shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-[#ECF1E4]">
            <div className="flex items-center gap-2 font-bold text-[#1A2E05] text-base">
              <SlidersHorizontal className="w-4 h-4 text-[#22C55E]" />
              <span>Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-stone-500 hover:text-[#22C55E] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Search Produce</label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Tomatoes, onions, milk..."
                className="w-full bg-[#F4F7F0]/60 border border-[#ECF1E4] rounded-xl pl-9 pr-3 py-2 text-xs text-stone-800 focus:outline-[#22C55E]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Category</label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => updateFilter('category', '')}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  category === ''
                    ? 'bg-[#22C55E] text-white shadow-xs font-bold'
                    : 'text-[#1A2E05] hover:bg-[#F4F7F0]'
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter('category', cat.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    category.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-[#22C55E] text-white shadow-xs font-bold'
                      : 'text-[#1A2E05] hover:bg-[#F4F7F0]'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.productCount !== undefined && (
                    <span className={`text-[10px] ${category.toLowerCase() === cat.name.toLowerCase() ? 'text-white/80' : 'text-stone-400'}`}>
                      ({cat.productCount})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Location / Region</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#22C55E] absolute left-3 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => updateFilter('location', e.target.value)}
                placeholder="Afgooye, Jowhar, Balcad..."
                className="w-full bg-[#F4F7F0]/60 border border-[#ECF1E4] rounded-xl pl-9 pr-3 py-2 text-xs text-stone-800 focus:outline-[#22C55E]"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Price Range ($/unit)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                value={minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                placeholder="Min $"
                className="w-full bg-[#F4F7F0]/60 border border-[#ECF1E4] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-[#22C55E]"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                value={maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                placeholder="Max $"
                className="w-full bg-[#F4F7F0]/60 border border-[#ECF1E4] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-[#22C55E]"
              />
            </div>
          </div>

          {/* Availability Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Stock Availability</label>
            <select
              value={availability}
              onChange={(e) => updateFilter('availability', e.target.value)}
              className="w-full bg-[#F4F7F0]/60 border border-[#ECF1E4] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-[#22C55E]"
            >
              <option value="">All Products</option>
              <option value="true">In Stock & Ready</option>
            </select>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar: Sort & Filter Toggle (Mobile) */}
          <div className="bg-white p-4 rounded-2xl border border-[#ECF1E4] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-stone-500 font-medium">
              Showing <span className="font-bold text-[#1A2E05]">{pagination.total}</span> agricultural harvest batches
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ECF1E4] text-xs font-semibold text-stone-700 hover:bg-[#F4F7F0]"
              >
                <Filter className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Filter</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <span className="font-semibold text-stone-500">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="bg-[#F4F7F0] border border-[#ECF1E4] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#1A2E05] focus:outline-[#22C55E]"
                >
                  <option value="newest">Newest Harvests</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden bg-white p-5 rounded-2xl border border-[#ECF1E4] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#ECF1E4]">
                <span className="font-bold text-sm text-[#1A2E05]">Filter Produce</span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#22C55E] font-bold cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search harvest..."
                className="w-full bg-[#F4F7F0] border border-[#ECF1E4] rounded-xl px-3 py-2 text-xs"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="bg-[#F4F7F0] border border-[#ECF1E4] rounded-xl px-3 py-2 text-xs font-medium"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  placeholder="Location..."
                  className="bg-[#F4F7F0] border border-[#ECF1E4] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="bg-[#F4F7F0] border border-[#ECF1E4] rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="bg-[#F4F7F0] border border-[#ECF1E4] rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* Product Items List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-[#ECF1E4] h-80 animate-pulse p-4 space-y-4">
                  <div className="bg-stone-200 h-44 rounded-xl"></div>
                  <div className="bg-stone-200 h-4 rounded w-3/4"></div>
                  <div className="bg-stone-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#ECF1E4] p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center mx-auto border border-[#DCFCE7]">
                <Carrot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1A2E05]">No agricultural products found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try adjusting your search keywords, clearing applied filters, or browsing other categories.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] bg-[#F0FDF4] border border-[#DCFCE7] px-4 py-2 rounded-full hover:bg-[#22C55E] hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="p-2 rounded-xl border border-[#ECF1E4] bg-white text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4F7F0] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    p === pagination.page
                      ? 'bg-[#22C55E] text-white shadow-md shadow-green-200/50'
                      : 'bg-white border border-[#ECF1E4] text-[#1A2E05] hover:bg-[#F4F7F0]'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="p-2 rounded-xl border border-[#ECF1E4] bg-white text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4F7F0] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
