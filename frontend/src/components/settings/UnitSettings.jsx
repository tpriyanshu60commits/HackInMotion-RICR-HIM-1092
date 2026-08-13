
import { Thermometer } from 'lucide-react';
import useStore from '../../store/useStore';

export const UnitSettings = () => {
  const temperatureUnit = useStore(state => state.temperatureUnit);
  const setTemperatureUnit = useStore(state => state.setTemperatureUnit);

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
    </div>
  );
};
