import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../context/AuthContext.jsx';
import { getImageUrl } from '../../api/axios.js';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function FarmerProducts() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State for Add/Edit
  const [modalOpen, setModalOpen] = useState(searchParams.get('new') === 'true');
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    unit: 'kg',
    location: '',
    harvestDate: new Date().toISOString().split('T')[0],
    description: '',
    availability: true,
  });

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([api.get('/farmer/products'), api.get('/categories')]);

      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) {
        setCategories(catRes.data.data);
        if (catRes.data.data.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: catRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      setError('Failed to fetch your listed products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setImageFile(null);
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      price: '',
      quantity: '',
      unit: 'kg',
      location: 'Afgooye Agricultural Belt',
      harvestDate: new Date().toISOString().split('T')[0],
      description: '',
      availability: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setImageFile(null);
    setFormData({
      name: p.name,
      category: p.category?._id || p.category,
      price: p.price,
      quantity: p.quantity,
      unit: p.unit || 'kg',
      location: p.location || '',
      harvestDate: p.harvestDate ? new Date(p.harvestDate).toISOString().split('T')[0] : '',
      description: p.description || '',
      availability: p.availability !== undefined ? p.availability : true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = new FormData();
    Object.entries({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    }).forEach(([key, value]) => payload.append(key, value));
    if (imageFile) payload.append('image', imageFile);

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setModalOpen(false);
      fetchProductsAndCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving product details.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product listing?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProductsAndCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    }
  };

  const handleToggleAvailability = async (p) => {
    try {
      await api.put(`/products/${p._id}`, { availability: !p.availability });
      fetchProductsAndCategories();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Catalog Management</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Your Agricultural Harvests</h1>
          <p className="text-xs text-stone-500 mt-1">Manage price, available quantities, batch photos and stock status.</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Harvest Batch</span>
        </button>
      </div>

      {/* Product List Table / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-stone-200 h-64 animate-pulse p-4 space-y-4">
              <div className="bg-stone-200 h-32 rounded-xl"></div>
              <div className="bg-stone-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No Harvest Batches Listed Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Add your fresh produce listings so buyers across the region can discover and purchase directly from you.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>List First Product</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200 font-bold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-6 py-4">Produce / Batch</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price / Unit</th>
                  <th className="px-6 py-4">Stock Quantity</th>
                  <th className="px-6 py-4">Availability</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                          <img
                            src={getImageUrl(p.images?.[0]) || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{p.name}</div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{p.location || 'Local Farm'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md font-semibold">
                        {p.category?.name || 'Produce'}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-800 text-sm">
                      ${Number(p.price).toFixed(2)}{' '}
                      <span className="text-xs font-normal text-stone-400">/ {p.unit || 'kg'}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-stone-800">
                        {p.quantity} {p.unit || 'kg'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAvailability(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] transition-colors cursor-pointer ${
                          p.availability && p.quantity > 0
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {p.availability && p.quantity > 0 ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Active / In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Unavailable</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-emerald-800 transition-colors"
                          title="Edit Harvest"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          title="Delete Harvest"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Harvest Details</div>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                {editingProduct ? 'Edit Agricultural Product' : 'Add New Harvest Batch'}
              </h2>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Product / Crop Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g. Fresh Red Tomatoes"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1.20"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Available Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="500"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Measurement Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 font-medium"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="ton">ton (Tons)</option>
                    <option value="crate">crate (Crates)</option>
                    <option value="sack">sack (Sacks)</option>
                    <option value="liter">liter (Liters)</option>
                    <option value="piece">piece (Pieces)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Harvest / Field Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Afgooye, Shabelle"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Harvest Date</label>
                  <input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 font-medium"
                />
                <p className="text-[11px] text-stone-500">Upload a JPG, PNG, or WebP image (maximum 5 MB).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Harvest Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe freshness, farming method, soil quality, or packaging specifications..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 resize-none font-medium"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availability"
                  checked={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="availability" className="text-xs font-semibold text-stone-800">
                  Listing is active and immediately available for ordering
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Harvest' : 'Publish Harvest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
