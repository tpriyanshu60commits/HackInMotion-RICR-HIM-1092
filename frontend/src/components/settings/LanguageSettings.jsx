import { useState, useEffect } from 'react';
import { Globe, Check, CheckCircle2, Volume2, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useStore from '../../store/useStore';
import { profileAPI } from '../../services/api';
import { cn } from '../../utils/utils';

export const LanguageSettings = () => {
  const user = useStore((state) => state.user);
  const updateUserProfile = useStore((state) => state.updateUserProfile);
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(user?.preferences?.language || 'en');
  const [alertVoiceLanguage, setAlertVoiceLanguage] = useState(
    user?.preferences?.alertVoiceLanguage || 'en'
  );
  const [region, setRegion] = useState(user?.preferences?.region || 'IN');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user && user.preferences) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(user.preferences.language || 'en');
      setAlertVoiceLanguage(user.preferences.alertVoiceLanguage || 'en');
      setRegion(user.preferences.region || 'IN');
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await profileAPI.updatePreferences({ language, alertVoiceLanguage, region });
      const fullProfile = await profileAPI.getProfile();
      updateUserProfile(fullProfile.data.data);

      // Update site language immediately
      i18n.changeLanguage(language);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save language settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  const interfaceLanguages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  ];

  const voiceLanguages = [
    { code: 'en', name: 'English (US)', native: 'English (US)' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'es', name: 'Spanish', native: 'Español' },
  ];

  const regions = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
  ];

  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
          <Globe size={24} className="text-green-400" />
          {t('settings.languageAndRegion', 'Language & Region')}
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          {t(
            'settings.configureDesc',
            'Configure your interface language, voice alert language, and region settings.'
          )}
        </p>
      </div>

      <div className="space-y-8">
        {/* Interface Language */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Globe size={16} className="text-gray-400" />
            {t('settings.interfaceLanguage', 'Interface Language')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {interfaceLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl border text-left transition-all',
                  language === lang.code
                    ? 'bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
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
        </div>

        {/* Alert Voice Language */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Volume2 size={16} className="text-gray-400" />
            {t('settings.voiceAlertLanguage', 'Alert Voice Language')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {voiceLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setAlertVoiceLanguage(lang.code)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border text-left transition-all',
                  alertVoiceLanguage === lang.code
                    ? 'bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                )}
              >
                <div>
                  <div className="font-medium text-white text-sm">{lang.native}</div>
                  <div className="text-xs text-gray-400">{lang.name}</div>
                </div>
                {alertVoiceLanguage === lang.code && <Check size={16} className="text-green-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            {t('settings.region', 'Region')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {regions.map((reg) => (
              <button
                key={reg.code}
                onClick={() => setRegion(reg.code)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border text-left transition-all',
                  region === reg.code
                    ? 'bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                )}
              >
                <div className="font-medium text-white text-sm">{reg.name}</div>
                {region === reg.code && <Check size={16} className="text-green-400" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all text-sm',
            saveSuccess
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : isSaving
                ? 'bg-white/10 text-gray-400 border border-white/10'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
          )}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
          ) : saveSuccess ? (
            <CheckCircle2 size={18} />
          ) : null}
          {isSaving
            ? t('settings.saving', 'Saving...')
            : saveSuccess
              ? t('settings.saved', 'Saved!')
              : t('settings.saveChanges', 'Save Changes')}
        </button>
      </div>
    </div>
  );
};
