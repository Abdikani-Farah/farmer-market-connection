import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext.jsx';
import { Users, Search, ShieldCheck, CheckCircle2, XCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      if (res.data.success) {
        fetchUsers();
      }
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.location && u.location.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">User Management</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Platform Users & Accounts</h1>
        <p className="text-xs text-stone-500 mt-1">Manage registered farmers, buyers, and administrators.</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name, email, or region..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-emerald-600"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {['ALL', 'FARMER', 'BUYER', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                roleFilter === r
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-64 bg-white rounded-2xl border border-stone-200 animate-pulse"></div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200 font-bold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center font-bold text-stone-700">
                          {u.profileImage ? (
                            <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            u.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{u.name}</div>
                          <div className="text-[11px] text-stone-400">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${
                          u.role === 'FARMER'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-stone-700">{u.location || 'Somalia'}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-stone-700">{u.phone || '—'}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          u.isActive !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.isActive !== false ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u._id, u.isActive !== false)}
                          className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                            u.isActive !== false
                              ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                              : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                          }`}
                        >
                          {u.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
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
