import { useState, useEffect } from 'react';
import { aiHealthAPI } from '../../services/api';
import { cn } from '../../utils/utils';
import { Save, RefreshCw, UploadCloud, X, ChevronDown } from 'lucide-react';
import ConditionSelector from './ConditionSelector';

export const AIHealthProfileForm = () => {
  const [profile, setProfile] = useState({
    ageGroup: 'adult',
    conditions: [],
    sensitivityLevel: 'medium',
    outdoorActivity: 'mostly indoors',
    activityTimeWindow: '',
    medicationReminder: false,
    primaryCity: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await aiHealthAPI.getHealthProfile();
      if (res.data?.data) {
        setProfile(res.data.data);
      }
    } catch (error) {
      console.log('No profile found or error fetching', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleConditionsChange = (selectedConditions) => {
    setProfile(prev => ({ ...prev, conditions: selectedConditions }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await aiHealthAPI.saveHealthProfile(profile);
      await handleGenerateReport(); 
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile or generate report:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      await aiHealthAPI.saveHealthProfile(profile); 
      
      let payload = new FormData();
      if (images.length > 0) {
        images.forEach((img) => payload.append('images', img));
      }

      await aiHealthAPI.generateHealthReport(payload);
      window.dispatchEvent(new Event('healthReportGenerated'));
      setImages([]); // Clear images after successful generation
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="text-white p-4">Loading profile...</div>;

  return (
    <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">AI Health Profile</h2>
      <p className="text-xs text-gray-300 mb-6 leading-relaxed">
        Personalize your daily AI-generated health and environmental risk report.
      </p>
      
      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-400 mb-1">Age Group</label>
            <div className="relative">
              <select name="ageGroup" value={profile.ageGroup} onChange={handleChange} className="appearance-none w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-white/20 focus:bg-white/[0.04] cursor-pointer">
                <option value="child" className="bg-[#1a1c23]">Child</option>
                <option value="adult" className="bg-[#1a1c23]">Adult</option>
                <option value="senior" className="bg-[#1a1c23]">Senior</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-gray-400 mb-1">Sensitivity Level</label>
            <div className="relative">
              <select name="sensitivityLevel" value={profile.sensitivityLevel} onChange={handleChange} className="appearance-none w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-white/20 focus:bg-white/[0.04] cursor-pointer">
                <option value="low" className="bg-[#1a1c23]">Low</option>
                <option value="medium" className="bg-[#1a1c23]">Medium</option>
                <option value="high" className="bg-[#1a1c23]">High</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className="z-20 relative">
          <label className="block text-xs font-semibold text-gray-400 mb-1">Health Conditions</label>
          <ConditionSelector 
            selectedConditions={profile.conditions} 
            onChange={handleConditionsChange} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="relative">
            <label className="block text-xs font-semibold text-gray-400 mb-1">Outdoor Activity</label>
            <div className="relative">
              <select name="outdoorActivity" value={profile.outdoorActivity} onChange={handleChange} className="appearance-none w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-white/20 focus:bg-white/[0.04] cursor-pointer">
                <option value="mostly indoors" className="bg-[#1a1c23]">Mostly Indoors</option>
                <option value="commute" className="bg-[#1a1c23]">Commute</option>
                <option value="jogging" className="bg-[#1a1c23]">Jogging</option>
                <option value="sports" className="bg-[#1a1c23]">Sports</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Primary City</label>
            <input type="text" name="primaryCity" value={profile.primaryCity} onChange={handleChange} placeholder="e.g. London" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-white/20 focus:bg-white/[0.04]" />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 pb-2">
          <input type="checkbox" id="medicationReminder" name="medicationReminder" checked={profile.medicationReminder} onChange={handleChange} className="w-4 h-4 rounded border-gray-300" />
          <label htmlFor="medicationReminder" className="text-sm text-gray-300 cursor-pointer">Medication Reminder (e.g. carry inhaler)</label>
        </div>

        {/* Medical Report Upload Section */}
        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-semibold text-gray-400 mb-2">Medical Reports (Optional)</label>
          <p className="text-xs text-gray-500 mb-3">Upload recent blood tests, prescriptions, or doctor notes. AI will extract relevant findings to refine your health risk analysis.</p>
          
          <div className="w-full relative border-2 border-dashed border-white/10 hover:border-white/30 rounded-xl bg-black/20 hover:bg-black/40 transition-colors p-6 text-center cursor-pointer flex flex-col items-center justify-center">
            <input 
              type="file" 
              multiple 
              accept="image/*,application/pdf" 
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="text-gray-400 mb-2" size={24} />
            <span className="text-sm text-gray-300 font-medium">Click or drag images/PDFs here to upload</span>
          </div>

          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                  <span className="text-xs text-blue-200 truncate max-w-[150px]">{img.name}</span>
                  <button type="button" onClick={() => removeImage(idx)} className="text-blue-400 hover:text-red-400">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-6 gap-4">
          <button type="submit" disabled={saving || generating} className="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium text-sm transition-all shadow-lg shadow-green-500/20 disabled:opacity-50">
            <Save size={18} /> {saving ? 'Saving...' : success ? 'Saved!' : 'Save Settings'}
          </button>

          <button type="button" onClick={handleGenerateReport} disabled={generating || !profile.primaryCity} className="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50">
            <RefreshCw size={18} className={generating ? "animate-spin" : ""} /> 
            {generating && images.length > 0 ? 'Analyzing & Generating...' : generating ? 'Generating...' : 'Generate AI Report'}
          </button>
        </div>
      </form>
    </div>
  );
};
