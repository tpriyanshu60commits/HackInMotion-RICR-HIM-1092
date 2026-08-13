import { useState, useEffect } from 'react';
import { Globe, Check, CheckCircle2 } from 'lucide-react';
import useStore from '../../store/useStore';
import { profileAPI } from '../../services/api';
import { cn } from '../../utils/utils';

export const LanguageSettings = () => {
  const user = useStore(state => state.user);
  const updateUserProfile = useStore(state => state.updateUserProfile);

  const [language, setLanguage] = useState(user?.preferences?.language || 'en');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user && user.preferences) {
      setLanguage(user.preferences.language || 'en');
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await profileAPI.updatePreferences({ language });
      const fullProfile = await profileAPI.getProfile();
      updateUserProfile(fullProfile.data.data);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save language settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
  ];

  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
          <Globe size={24} className="text-green-400" />
          Language & Region
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Select your preferred language for alerts and interface.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
              language === lang.code 
                ? "bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20" 
                : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <div>
              <div className="font-semibold text-white">{lang.native}</div>
              <div className="text-xs text-gray-400">{lang.name}</div>
            </div>
            {language === lang.code && <Check size={20} className="text-green-400" />}
          </button>
        ))}
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
