import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext.jsx';
import { Layers, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({ name: '', description: '', image: '', icon: '' });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditingCategory(null);
    setForm({ name: '', description: '', image: '', icon: '' });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingCategory(c);
    setForm({
      name: c.name,
      description: c.description || '',
      image: c.image || '',
      icon: c.icon || '',
    });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, form);
      } else {
        await api.post('/categories', form);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Taxonomy Setup</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Agricultural Categories</h1>
          <p className="text-xs text-stone-500 mt-1">Configure produce sectors, taxonomies, and visual classifications.</p>
        </div>

        <button
          onClick={openAdd}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {loading ? (
        <div className="h-64 bg-white rounded-2xl border border-stone-200 animate-pulse"></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <div
              key={c._id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-stone-900">{c.name}</h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">{c.description || 'Agricultural sector'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400 font-semibold">
                {c.productCount !== undefined ? `${c.productCount} Harvest Batches` : 'Active'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-stone-900">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h2>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Category Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="E.g. Vegetables, Grains, Dairy"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short summary of this agricultural sector..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs focus:outline-emerald-600 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs"
              >
                {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
