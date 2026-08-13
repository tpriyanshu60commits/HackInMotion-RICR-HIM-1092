import { useState, useEffect } from 'react';
import { Thermometer, CheckCircle2 } from 'lucide-react';
import useStore from '../../store/useStore';
import { profileAPI } from '../../services/api';
import { cn } from '../../utils/utils';

export const UnitSettings = () => {
  const user = useStore(state => state.user);
  const updateUserProfile = useStore(state => state.updateUserProfile);

  const [temperatureUnit, setTemperatureUnit] = useState(user?.preferences?.temperatureUnit || 'celsius');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user && user.preferences) {
      setTemperatureUnit(user.preferences.temperatureUnit || 'celsius');
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await profileAPI.updatePreferences({ temperatureUnit });
      const fullProfile = await profileAPI.getProfile();
      updateUserProfile(fullProfile.data.data);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save unit settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
          <Thermometer size={24} className="text-green-400" />
          Units & Measurements
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Customize how environmental data is displayed.
        </p>
      </div>

      <div className="space-y-6">
        
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Temperature Unit</label>
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/10 w-full sm:w-64 relative">
            <button
              onClick={() => setTemperatureUnit('celsius')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg z-10 transition-colors ${temperatureUnit === 'celsius' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Celsius (°C)
            </button>
            <button
              onClick={() => setTemperatureUnit('fahrenheit')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg z-10 transition-colors ${temperatureUnit === 'fahrenheit' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Fahrenheit (°F)
            </button>
            {/* Sliding highlight */}
            <div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-lg shadow-sm transition-transform duration-300 ease-in-out"
              style={{ transform: temperatureUnit === 'fahrenheit' ? 'translateX(100%)' : 'translateX(0)' }}
            ></div>
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
