
import { Bell, Volume2, VolumeX, Mic } from 'lucide-react';
import useStore from '../../store/useStore';
import { cn } from '../../utils/utils';

export const NotificationSettings = () => {
  const isMuted = useStore(state => state.isMuted);
  const setIsMuted = useStore(state => state.setIsMuted);
  
  const voiceAlertsEnabled = useStore(state => state.voiceAlertsEnabled);
  const setVoiceAlertsEnabled = useStore(state => state.setVoiceAlertsEnabled);

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
    </div>
  );
};
