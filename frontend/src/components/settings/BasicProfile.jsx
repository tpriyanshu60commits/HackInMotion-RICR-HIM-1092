import { useState, useEffect } from 'react';
import { User, CheckCircle2, Upload } from 'lucide-react';
import useStore from '../../store/useStore';
import { profileAPI, usersAPI } from '../../services/api';
import { cn } from '../../utils/utils';

export const BasicProfile = () => {
  const user = useStore((state) => state.user);
  const updateUserProfile = useStore((state) => state.updateUserProfile);

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.healthProfile?.age || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [gender, setGender] = useState(user?.gender || 'Prefer not to say');
  const [isUploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await profileAPI.updateBasicProfile({ name });

      await usersAPI.updateExtendedProfile({
        phone,
        height: height ? Number(height) : 0,
        weight: weight ? Number(weight) : 0,
        gender,
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
          Basic Profile
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Update your personal information and profile picture.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="relative w-32 h-32 rounded-full border border-white/20 bg-white/5 overflow-hidden flex items-center justify-center group shadow-xl">
            {user?.profileImage?.url ? (
              <img
                src={user.profileImage.url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={48} className="text-gray-500" />
            )}

            {/* Hover overlay */}
            <label
              className={cn(
                'absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer transition-opacity opacity-0 group-hover:opacity-100',
                isUploadingImage && 'opacity-100 bg-black/80 cursor-default'
              )}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
              />
              {isUploadingImage ? (
                <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Upload size={20} className="text-white mb-1" />
                  <span className="text-xs text-white font-medium">Upload</span>
                </>
              )}
            </label>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-white">{user?.name || 'User'}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSave} className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email (Read Only)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                min="0"
                max="120"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors appearance-none"
              >
                <option value="Male" className="bg-gray-900">
                  Male
                </option>
                <option value="Female" className="bg-gray-900">
                  Female
                </option>
                <option value="Other" className="bg-gray-900">
                  Other
                </option>
                <option value="Prefer not to say" className="bg-gray-900">
                  Prefer not to say
                </option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                'flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-sm w-full md:w-auto min-w-[140px]',
                saveSuccess
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
              )}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 size={18} /> Saved
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
