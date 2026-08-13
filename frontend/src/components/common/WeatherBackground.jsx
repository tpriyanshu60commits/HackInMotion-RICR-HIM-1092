
import useStore from '../../store/useStore';
import { cn } from '../../utils/utils';

export const WeatherBackground = ({ children }) => {
  const weatherCondition = useStore((state) => state.weatherCondition);
  const theme = useStore((state) => state.theme);
  
  const backgrounds = {
    clear: {
      light: 'from-sky-300 via-blue-200 to-indigo-100',
      dark: 'from-slate-900 via-indigo-950 to-blue-900',
      nature: 'from-sky-300 via-green-200 to-emerald-100',
      ocean: 'from-blue-300 via-cyan-200 to-sky-100',
    },
    cloudy: {
      light: 'from-slate-300 via-gray-200 to-slate-100',
      dark: 'from-gray-900 via-slate-800 to-gray-700',
      nature: 'from-slate-300 via-green-100 to-gray-100',
      ocean: 'from-slate-300 via-cyan-100 to-gray-100',
    },
    rain: {
      light: 'from-indigo-300 via-slate-400 to-gray-300',
      dark: 'from-slate-900 via-indigo-900 to-blue-950',
      nature: 'from-indigo-200 via-green-400 to-emerald-800',
      ocean: 'from-indigo-300 via-cyan-600 to-blue-900',
    },
    storm: {
      light: 'from-slate-500 via-gray-600 to-slate-400',
      dark: 'from-gray-950 via-slate-900 to-indigo-950',
      nature: 'from-slate-700 via-green-900 to-emerald-950',
      ocean: 'from-slate-700 via-cyan-900 to-blue-950',
    },
    snow: {
      light: 'from-blue-100 via-white to-slate-100',
      dark: 'from-slate-800 via-blue-900 to-gray-800',
      nature: 'from-blue-100 via-white to-green-100',
      ocean: 'from-blue-100 via-white to-cyan-100',
    }
  };

  const getGradient = () => {
    const style = backgrounds[weatherCondition] || backgrounds.clear;
    return style[theme] || style.light;
  };

  return (
    <div className="relative min-h-screen w-full transition-colors duration-1000 overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br -z-20 transition-all duration-1000",
          getGradient()
        )}
      />
      
      {/* Weather overlay effects (e.g., subtle rain, clouds) */}
      {weatherCondition === 'rain' && (
        <div className="absolute inset-0 -z-10 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-repeat" 
             style={{ backgroundSize: '4px 30px', animation: 'rain 0.5s linear infinite' }} />
      )}
      
      {weatherCondition === 'cloudy' && (
        <div className="absolute top-0 left-0 right-0 h-64 -z-10 opacity-20 bg-gradient-to-b from-white to-transparent" />
      )}

      {/* Main Content */}
      <div className="relative z-0 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
