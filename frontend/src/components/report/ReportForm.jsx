import React, { useState } from 'react';
import { Camera, MapPin, Upload, X } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

const CATEGORIES = [
  { id: 'garbage', label: 'Garbage Dump' },
  { id: 'water', label: 'Water Pollution' },
  { id: 'air', label: 'Air Pollution' },
];

export const ReportForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    lat: '',
    lng: '',
    address: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            setFormData(prev => ({
              ...prev,
              lat,
              lng,
              address: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
            }));
          } catch (error) {
            setFormData(prev => ({ ...prev, lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
          }
        },
        (error) => {
          alert('Could not detect location. Please enter address manually.');
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Please select an issue category.");
      return;
    }
    if (!photo) {
      alert("Please upload a photo evidence.");
      return;
    }
    if (!formData.title || !formData.address) {
      alert("Please enter title and location.");
      return;
    }
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      let val = formData[key];
      if ((key === 'lat' || key === 'lng') && val === '') val = 0;
      submitData.append(key, val);
    });
    if (photo) submitData.append('photo', photo);
    
    onSubmit(submitData);
  };

  return (
    <GlassCard className="p-6 bg-[#0A0F0D]/80 backdrop-blur-2xl border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-muted">Issue Category</label>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  formData.category === cat.id 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                    : 'bg-[#0A0F0D]/80 border-white/20 text-text-muted hover:bg-black hover:text-white backdrop-blur-md'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="E.g., Large garbage pile on Main St"
            className="w-full bg-[#0A0F0D]/80 border border-white/20 backdrop-blur-md rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-green-500/50 transition-colors"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide more details about the issue..."
            rows={4}
            className="w-full bg-[#0A0F0D]/80 border border-white/20 backdrop-blur-md rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-green-500/50 transition-colors resize-none"
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-muted">Location</label>
            <button 
              type="button" 
              onClick={handleLocationDetect}
              className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"
            >
              <MapPin size={12} /> Detect Location
            </button>
          </div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter address or tap detect..."
            className="w-full bg-[#0A0F0D]/80 border border-white/20 backdrop-blur-md rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-green-500/50 transition-colors"
            required
          />
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Photo Evidence (Required)</label>
          {photoPreview ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border group">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            <label className="w-full h-32 border-2 border-dashed border-white/20 hover:border-green-500/50 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#0A0F0D]/80 hover:bg-black backdrop-blur-md">
              <Camera className="text-text-muted" size={28} />
              <span className="text-sm text-text-muted font-medium">Click to upload photo</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" required />
            </label>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Upload size={18} /> Submit Report</>
          )}
        </button>
      </form>
    </GlassCard>
  );
};
