import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext.jsx';
import {
  Tractor,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Save,
} from 'lucide-react';

export default function FarmerFarmProfile() {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const fetchFarm = async () => {
    try {
      const res = await api.get('/farmer/farm');

      if (res.data.success && res.data.data) {
        const data = res.data.data;

        setFarm(data);

        setForm({
          farmName: data.farmName || '',
          description: data.description || '',
          location: data.location || '',
          region: data.region || '',
          district: data.district || '',
          farmSize: data.farmSize || '',
          crops: (data.crops || []).join(', '),
          images: (data.images || []).join('\n'),
        });
      }
    } catch (err) {
      console.error('Error fetching farm:', err);
      setErrorMsg('Failed to load farm profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarm();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const payload = {
      farmName: form.farmName,
      description: form.description,
      location: form.location,
      region: form.region,
      district: form.district,
      farmSize: form.farmSize,

      crops: form.crops
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),

      images: form.images
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      const res = await api.put('/farmer/farm', payload);

      if (res.data.success) {
        setFarm(res.data.data);
        setSuccessMsg('Farm profile updated successfully.');
      }
    } catch (err) {
      console.error('Error updating farm:', err);

      setErrorMsg(
        err.response?.data?.message || 'Failed to update farm profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
        <div className="h-8 bg-stone-200 rounded w-