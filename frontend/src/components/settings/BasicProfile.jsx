import { useState, useEffect } from 'react';
import { User, CheckCircle2 } from 'lucide-react';
import useStore from '../../store/useStore';
import { profileAPI, usersAPI } from '../../services/api';
import { cn } from '../../utils/utils';

export const BasicProfile = () => {
  const user = useStore(state => state.user);
  const updateUserProfile = useStore(state => state.updateUserProfile);

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.healthProfile?.age || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [gender, setGender] = useState(user?.gender || 'Prefer not to say');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAge(user.healthProfile?.age || '');
      setPhone(user.phone || '');
      setHeight(user.height || '');
      setWeight(user.weight || '');
      setGender(user.gender || 'Prefer not to say');
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await usersAPI.uploadProfileImage(formData);
      if (res.data.success) {
        const fullProfile = await profileAPI.getProfile();
        updateUserProfile(fullProfile.data.data);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await profileAPI.updateBasicProfile({ name });
      
      // Update extended profile
      await usersAPI.updateExtendedProfile({
        phone,
        height: height ? Number(height) : 0,
        weight: weight ? Number(weight) : 0,
        gender
      });

      if (age) {
        await profileAPI.updateHealthProfile({ age: Number(age) });
      }
      
      const fullProfile = await profileAPI.getProfile();
      updateUserProfile(fullProfile.data.data);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save basic profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
          <User size={24} className="text-green-400" />
          Basic Identity
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Manage your personal details.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="shrink-0 flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center">
              {user?.profileImage?.url ? (
                <img src={user.profileImage.url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-green-400">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
              <span className="text-xs font-semibold text-white">Change</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
          {uploadingImage && <span className="text-xs text-green-400 font-medium">Uploading...</span>}
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Age</label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 35"
              min="1"
              max="120"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 9876543210"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Height (cm)</label>
            <input 
              type="number" 
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 175"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Weight (kg)</label>
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 70"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all appearance-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all text-sm",
            saveSuccess ? "bg-green-500/20 text-green-400 border border-green-500/30" :
            isSaving ? "bg-white/10 text-gray-400 border border-white/10" :
            "bg-white/10 hover:bg-white/20 text-white border border-white/10"
          )}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
          ) : saveSuccess ? (
            <CheckCircle2 size={18} />
          ) : null}
          {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
