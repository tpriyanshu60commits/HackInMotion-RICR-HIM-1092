
import useStore from '../../store/useStore';
import { cn } from '../../utils/utils';

export const WeatherBackground = ({ children }) => {
  const weatherCondition = useStore((state) => state.weatherCondition);
  const currentAQI = useStore((state) => state.currentAQI);
  
  const allBackgrounds = [
    'clear-day', 'clear-night',
    'cloudy-day', 'cloudy-night',
    'rainy-day', 'rainy-night',
    'stormy-day', 'stormy-night',
    'foggy-day', 'foggy-night',
    'snowy-day', 'snowy-night'
  ];

  // Fallback to clear-day if somehow an invalid condition gets in
  const activeBg = allBackgrounds.includes(weatherCondition) ? weatherCondition : 'clear-day';

  return (
    <div className="relative min-h-screen w-full transition-colors duration-1000 overflow-hidden">
      {/* Dynamic Image Backgrounds with Cross-fade */}
      {allBackgrounds.map((bgName) => {
        const isActive = activeBg === bgName;
        return (
          <div 
            key={bgName}
            className={cn(
              "absolute inset-0 -z-30 transition-opacity duration-1000 bg-cover bg-center bg-fixed",
              isActive ? "opacity-90" : "opacity-0"
            )}
            style={{ backgroundImage: `url('/images/weather/${bgName}.jpg')` }}
          />
        );
      })}

      {/* AQI Dust/Smog Overlay (Layered below the scrim) */}
      {currentAQI >= 150 && (
        <div 
          className="absolute inset-0 -z-25 pointer-events-none transition-opacity duration-1000 opacity-60 mix-blend-multiply"
          style={{ 
            backgroundColor: '#8b6f4e', // brownish tint for pollution
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      )}

      {/* Persistent Scrim Layer for Readability */}
      <div 
        className="absolute inset-0 -z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.65) 100%)' }}
      />
      
      {/* Weather overlay effects (e.g., subtle rain, clouds) */}
      {activeBg.startsWith('rainy') && (
        <div className="absolute inset-0 -z-10 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjIwIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-repeat" 
             style={{ backgroundSize: '4px 30px', animation: 'rain 0.5s linear infinite' }} />
      )}
      
      {activeBg.startsWith('cloudy') && (
        <div className="absolute top-0 left-0 right-0 h-64 -z-10 opacity-20 bg-gradient-to-b from-white to-transparent" />
      )}

      {/* Main Content */}
      <div className="relative z-0 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
