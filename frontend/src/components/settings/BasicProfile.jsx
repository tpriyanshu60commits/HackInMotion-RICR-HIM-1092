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

  // ✅ Keep the useEffect from master branch
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
      {/* UI remains unchanged */}
      {/* ... */}
    </div>
  );
};
