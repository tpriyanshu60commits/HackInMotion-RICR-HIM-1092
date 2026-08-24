import { useState, useEffect, useRef } from 'react';
import { User, CheckCircle2, Upload, Camera, Image, Trash2 } from 'lucide-react';
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
  const [isRemovingImage, setRemovingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const menuRef = useRef(null);

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

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowPhotoMenu(false);
      }
    };
    if (showPhotoMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPhotoMenu]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setShowPhotoMenu(false);
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
      // Reset input values so the same file can be selected again
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    setShowPhotoMenu(false);
    setRemovingImage(true);
    try {
      const res = await usersAPI.removeProfileImage();
      if (res.data.success) {
        const fullProfile = await profileAPI.getProfile();
        updateUserProfile(fullProfile.data.data);
      }
    } catch (error) {
      console.error('Failed to remove image:', error);
    } finally {
      setRemovingImage(false);
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

  const hasProfileImage = !!(user?.profileImage?.url);

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
          <div className="relative" ref={menuRef}>
            {/* Avatar circle */}
            <div
              className={cn(
                'relative w-32 h-32 rounded-full border border-white/20 bg-white/5 overflow-hidden flex items-center justify-center group shadow-xl cursor-pointer transition-all',
                (isUploadingImage || isRemovingImage) && 'pointer-events-none'
              )}
              onClick={() => {
                if (!isUploadingImage && !isRemovingImage) {
                  setShowPhotoMenu((prev) => !prev);
                }
              }}
            >
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-gray-500" />
              )}

              {/* Loading overlay */}
              {(isUploadingImage || isRemovingImage) && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span className="text-[10px] text-white/70 mt-1.5">
                    {isUploadingImage ? 'Uploading...' : 'Removing...'}
                  </span>
                </div>
              )}

              {/* Hover overlay (only when not loading) */}
              {!isUploadingImage && !isRemovingImage && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white mb-1" />
                  <span className="text-[10px] text-white font-medium">Change Photo</span>
                </div>
              )}
            </div>

            {/* Dropdown Menu */}
            {showPhotoMenu && (
              <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] z-50 w-52 bg-gray-900/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-fade-in-up">
                {/* Camera option */}
                <button
                  type="button"
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors text-left"
                  onClick={() => {
                    setShowPhotoMenu(false);
                    if (cameraInputRef.current) cameraInputRef.current.click();
                  }}
                >
                  <Camera size={16} className="text-green-400 shrink-0" />
                  <span>Take Photo</span>
                </button>

                {/* Gallery option */}
                <button
                  type="button"
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors text-left border-t border-white/5"
                  onClick={() => {
                    setShowPhotoMenu(false);
                    if (galleryInputRef.current) galleryInputRef.current.click();
                  }}
                >
                  <Image size={16} className="text-blue-400 shrink-0" />
                  <span>Choose from Gallery</span>
                </button>

                {/* Remove option - only if image exists */}
                {hasProfileImage && (
                  <button
                    type="button"
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left border-t border-white/5"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 size={16} className="shrink-0" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
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
