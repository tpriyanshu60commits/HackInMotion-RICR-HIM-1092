import { useState, useEffect } from 'react';
import { Bell, Volume2, VolumeX, Mic, CheckCircle2 } from 'lucide-react';
import useStore from '../../store/useStore';
import { profileAPI } from '../../services/api';
import { cn } from '../../utils/utils';

export const NotificationSettings = () => {
  const user = useStore(state => state.user);
  const updateUserProfile = useStore(state => state.updateUserProfile);
  
  const [isMuted, setIsMuted] = useState(user?.notificationSettings?.isMuted || false);
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(user?.notificationSettings?.voiceAlertsEnabled || false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user && user.notificationSettings) {
      setIsMuted(user.notificationSettings.isMuted || false);
      setVoiceAlertsEnabled(user.notificationSettings.voiceAlertsEnabled || false);
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await profileAPI.updateNotificationSettings({ isMuted, voiceAlertsEnabled });
      const fullProfile = await profileAPI.getProfile();
      updateUserProfile(fullProfile.data.data);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save notification settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
          <Bell size={24} className="text-green-400" />
          Notifications
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Manage how and when VerdantX alerts you.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Sound Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-4">
            <div className={cn("p-2 rounded-lg", !isMuted ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400")}>
              {!isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Alert Sounds</h3>
              <p className="text-xs text-gray-400 mt-1">Play a chime when a new live alert arrives.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={!isMuted} onChange={(e) => setIsMuted(!e.target.checked)} />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        {/* Voice Alerts Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-4">
            <div className={cn("p-2 rounded-lg", voiceAlertsEnabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400")}>
              <Mic size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Voice Alerts</h3>
              <p className="text-xs text-gray-400 mt-1">Read high-priority alerts out loud (Web Speech API).</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={voiceAlertsEnabled} onChange={(e) => setVoiceAlertsEnabled(e.target.checked)} />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
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
