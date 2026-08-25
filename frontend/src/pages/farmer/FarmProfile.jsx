import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext.jsx';
import {
  Tractor,
  MapPin,
  Layers,
  Sprout,
  Image as ImageIcon,
  Save,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function FarmerFarmProfile() {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [form, setForm] = useState({
    farmName: '',
    description: '',
    location: '',
    region: '',
    district: '',
    farmSize: '',
    crops: '',
    images: '',
  });

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const res = await api.get('/farmer/farm');
        if (res.data.success && res.data.data) {
          const f = res.data.data;
          setFarm(f);
          setForm({
            farmName: f.farmName || '',
            description: f.description || '',
            location: f.location || '',
            region: f.region || '',
            district: f.district || '',
            farmSize: f.farmSize || '',
            crops: (f.crops || []).join(', '),
            images: (f.images || []).join('\n'),
          });
        }
      } catch (err) {
        setErrorMsg('Failed to load farm profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload = {
      farmName: form.farmName,
      description: form.description,
      location: form.location,
      region: form.region,
      district: form.district,
      farmSize: form.farmSize,
      crops: form.crops
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      images: form.images
        .split('\n')
        .map((img) => img.trim())
        .filter(Boolean),
    };

    try {
      const res = await api.put('/farmer/farm', payload);
      if (res.data.success) {
        setFarm(res.data.data);
        setSuccessMsg('Farm profile updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error updating farm profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-xs text-stone-500">Loading farm profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Farm Identity</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Farm & Production Profile</h1>
        <p className="text-xs text-stone-500 mt-1">
          This profile information is visible to buyers on your farm storefront.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base">{farm?.farmName || 'Your Farm Profile'}</h2>
              <div className="flex items-center gap-1 text-xs text-stone-500">
                {farm?.isVerified ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified by Platform
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold">Verification Pending Review</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Official Farm Name</label>
            <input
              type="text"
              required
              value={form.farmName}
              onChange={(e) => setForm({ ...form, farmName: e.target.value })}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Farm Size (e.g. 25 Hectares)</label>
            <input
              type="text"
              value={form.farmSize}
              onChange={(e) => setForm({ ...form, farmSize: e.target.value })}
              placeholder="e.g. 15 Hectares"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Location Summary</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Afgooye River Agricultural Corridor"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Region</label>
            <input
              type="text"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              placeholder="Lower Shabelle"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">District</label>
            <input
              type="text"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              placeholder="Afgooye"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600 font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700">
            Crops Cultivated (Comma separated: Tomatoes, Watermelon, Onions, Maize)
          </label>
          <input
            type="text"
            value={form.crops}
            onChange={(e) => setForm({ ...form, crops: e.target.value })}
            placeholder="Tomatoes, Watermelon, Onions, Maize, Sesame"
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600 font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700">Farm Description & Agricultural Story</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your soil, irrigation system, sustainable practices, and produce availability..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600 resize-none font-medium"
          ></textarea>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700">
            Farm Photo Image URLs (One URL per line)
          </label>
          <textarea
            rows={3}
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-emerald-600 resize-none font-medium"
          ></textarea>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Update Farm Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
