import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext.jsx';
import { Tractor, ShieldCheck, Search, CheckCircle, XCircle, MapPin, Layers } from 'lucide-react';

export default function AdminFarms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchFarms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/farms');
      if (res.data.success) {
        setFarms(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleToggleVerification = async (farmId, currentStatus) => {
    try {
      const res = await api.put(`/admin/farms/${farmId}/verify`, { isVerified: !currentStatus });
      if (res.data.success) {
        fetchFarms();
      }
    } catch (err) {
      alert('Failed to update verification');
    }
  };

  const filteredFarms = farms.filter((f) => {
    return (
      f.farmName.toLowerCase().includes(search.toLowerCase()) ||
      (f.farmer?.name && f.farmer.name.toLowerCase().includes(search.toLowerCase())) ||
      (f.location && f.location.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Farm Certification</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Enrolled Farms & Growers</h1>
        <p className="text-xs text-stone-500 mt-1">Review farm documentations, acreage, and manage verification badges.</p>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farm name, farmer, or agricultural region..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-emerald-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="h-64 bg-white rounded-2xl border border-stone-200 animate-pulse"></div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200 font-bold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-6 py-4">Farm</th>
                  <th className="px-6 py-4">Farmers / Owners</th>
                  <th className="px-6 py-4">Location / District</th>
                  <th className="px-6 py-4">Size & Crops</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredFarms.map((farm) => (
                  <tr key={farm._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                          <Tractor className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{farm.farmName}</div>
                          <div className="text-[11px] text-stone-400">{farm.products?.length || 0} Listed Harvests</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-900">{farm.farmer?.name || 'Unknown'}</div>
                      <div className="text-[11px] text-stone-400">{farm.farmer?.phone}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-stone-700">{farm.location || 'Local Farm'}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-800">{farm.farmSize || 'Standard'}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-xs">
                        {(farm.crops || []).join(', ') || 'Various Produce'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          farm.isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {farm.isVerified ? (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <span>Unverified</span>
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleVerification(farm._id, farm.isVerified)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                          farm.isVerified
                            ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs'
                        }`}
                      >
                        {farm.isVerified ? 'Revoke Badge' : 'Grant Verification'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
