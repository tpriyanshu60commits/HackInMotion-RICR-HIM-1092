import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { environmentService } from '../services/api';
import useStore from '../store/useStore';
import { LocationSearch } from '../components/common/LocationSearch';



const getAqiStyle = (aqi) => {
  if (aqi <= 50) {
    return {
      color: 'text-green-400',
      dot: 'bg-green-500',
      shadow: 'shadow-[0_0_8px_rgba(34,197,94,0.4)]'
    };
  }

  if (aqi <= 100) {
    return {
      color: 'text-yellow-500',
      dot: 'bg-yellow-500',
      shadow: 'shadow-[0_0_8px_rgba(234,179,8,0.4)]'
    };
  }

  if (aqi <= 150) {
    return {
      color: 'text-orange-500',
      dot: 'bg-orange-500',
      shadow: 'shadow-[0_0_8px_rgba(249,115,22,0.4)]'
    };
  }

  return {
    color: 'text-red-500',
    dot: 'bg-red-500',
    shadow: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]'
  };
};

export const Compare = () => {
  const globalLocation = useStore((state) => state.location);
  const initialCity1 = globalLocation?.name?.split(',')[0].trim() || "Rewa";

  const [selectedCity1, setSelectedCity1] = useState(initialCity1);
  const [selectedCity2, setSelectedCity2] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        if (selectedCity1 && selectedCity2) {
          const cities = `${selectedCity1},${selectedCity2}`;
          const res = await environmentService.compareCities(cities);
          if (active) setComparisonData({ data: res.data.data });
        } else if (selectedCity1) {
          const res = await environmentService.getCurrentByCity(selectedCity1);
          if (active) setComparisonData({ data: [res.data.data] });
        } else if (selectedCity2) {
          const res = await environmentService.getCurrentByCity(selectedCity2);
          if (active) setComparisonData({ data: [res.data.data] });
        } else {
          if (active) setComparisonData({ data: [] });
        }
        if (active) setError(null);
      } catch (err) {
        console.error("Failed to fetch comparison data:", err);
        if (active) setError("Failed to fetch comparison data. Please try again.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [selectedCity1, selectedCity2]);

  // Use actual fetched data or fallback to empty array
  const comparisonCities = comparisonData?.data || [];

  return (
    <div
      className="min-h-full relative px-2 lg:px-4 py-8 animate-fade-in flex flex-col items-center justify-start"
      
    >
      {/* Main Comparison Module */}
      <div className="w-full max-w-[1150px] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-7">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Compare Cities
            </h1>

            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Compare environmental conditions between locations
            </p>
          </div>

        </div>

        {/* City Selectors */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 z-50">

          {/* Selector 1 */}
          <div className="flex-1 w-full relative z-50">
            <div className="[&>div>input]:bg-black/40 [&>div>input]:border [&>div>input]:border-white/10 [&>div>input]:rounded-lg [&>div>input]:px-10 [&>div>input]:py-3 [&>div>input]:text-white [&>div>input]:placeholder:text-gray-600 focus-within:[&>div>input]:border-white/30 hover:[&>div>input]:bg-white/[0.04]">
              <LocationSearch 
                initialQuery={initialCity1}
                retainSelection={true}
                onLocationSelect={(loc) => {
                  setIsLoading(true);
                  setSelectedCity1(loc.name.split(',')[0].trim());
                }} 
              />
            </div>
          </div>

          {/* VS */}
          <div className="
            text-[11px]
            md:text-xs
            font-bold
            text-gray-500
            shrink-0
            uppercase
            tracking-widest
            px-1
            md:px-2
          ">
            VS
          </div>

          {/* Selector 2 */}
          <div className="flex-1 w-full relative z-50">
            <div className="[&>div>input]:bg-black/40 [&>div>input]:border [&>div>input]:border-white/10 [&>div>input]:rounded-lg [&>div>input]:px-10 [&>div>input]:py-3 [&>div>input]:text-white [&>div>input]:placeholder:text-gray-600 focus-within:[&>div>input]:border-white/30 hover:[&>div>input]:bg-white/[0.04]">
              <LocationSearch 
                initialQuery=""
                retainSelection={true}
                onLocationSelect={(loc) => {
                  setIsLoading(true);
                  setSelectedCity2(loc.name.split(',')[0].trim());
                }} 
              />
            </div>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="
          flex
          flex-col
          md:flex-row
          items-stretch
          justify-center
          gap-6
          md:gap-10
          relative
        ">

          {isLoading && !comparisonData ? (
             <div className="text-center text-gray-400 py-10 w-full">Loading comparison...</div>
          ) : error ? (
             <div className="text-center text-red-400 py-10 w-full">{error}</div>
          ) : (
            comparisonCities.map((data, idx) => {
              if (data.error) {
                return (
                  <div key={idx} className="flex-1 bg-white/[0.025] backdrop-blur-sm border border-red-500/20 rounded-xl p-7 md:p-8 flex flex-col items-center justify-center">
                    <p className="text-red-400 font-semibold mb-2">Unavailable</p>
                    <p className="text-gray-400 text-sm">{data.city}: {data.error}</p>
                  </div>
                );
              }

              const aqiStyle = getAqiStyle(data.aqi);

              return (
                <div
                  key={idx}
                  className="
                    flex-1
                    min-w-0

                    bg-white/[0.025]
                    backdrop-blur-sm

                    border
                    border-white/[0.07]

                    hover:border-white/[0.16]
                    hover:bg-white/[0.045]

                    rounded-xl

                    p-7
                    md:p-8

                    hover:scale-[1.015]
                    hover:-translate-y-[2px]

                    transition-all
                    duration-300
                    ease-out

                    hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]

                    flex
                    flex-col

                    cursor-default
                    group
                  "
                >

                  {/* City Header */}
                  <div className="
                    flex
                    items-center
                    gap-3
                    mb-7
                    pb-5
                    border-b
                    border-white/[0.06]
                  ">
                    <div className="
                      w-9
                      h-9
                      rounded-full
                      bg-white/[0.04]
                      border
                      border-white/[0.07]
                      flex
                      items-center
                      justify-center
                      shrink-0
                      group-hover:bg-green-400/10
                      group-hover:border-green-400/20
                      transition-all
                    ">
                      <MapPin
                        size={19}
                        className="
                          text-gray-400
                          group-hover:text-green-400
                          transition-colors
                        "
                      />
                    </div>

                    <span className="
                      text-base
                      md:text-lg
                      font-semibold
                      text-white
                      tracking-wide
                    ">
                      {data.city && data.city !== 'Unknown Location' ? data.city : (idx === 0 ? selectedCity1 : selectedCity2)}
                      {data.country ? `, ${data.country}` : ''}
                    </span>
                  </div>

                  {/* AQI Block */}
                  <div className="
                    mb-9
                    flex
                    flex-col
                  ">
                    <span className="
                      text-xs
                      font-semibold
                      text-gray-400
                      uppercase
                      tracking-widest
                      mb-2
                    ">
                      AQI
                    </span>

                    <div className="
                      flex
                      items-end
                      gap-4
                    ">
                      <span className="
                        text-5xl
                        md:text-6xl
                        font-black
                        text-white
                        leading-none
                        tracking-tighter
                      ">
                        {data.aqi}
                      </span>

                      <div className="
                        flex
                        items-center
                        gap-2
                        mb-1.5
                      ">
                        <span
                          className={`
                            w-2
                            h-2
                            rounded-full
                            ${aqiStyle.dot}
                            ${aqiStyle.shadow}
                          `}
                        />

                        <span
                          className={`
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            ${aqiStyle.color}
                          `}
                        >
                          {data.risk?.label || data.riskLevel?.label || 'UNKNOWN'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metric Rows */}
                  <div className="
                    space-y-1
                    flex-1
                    flex
                    flex-col
                  ">

                    {/* PM2.5 */}
                    <div className="
                      flex
                      items-center
                      justify-between
                      py-3
                      border-b
                      border-white/[0.05]
                      group-hover:bg-white/[0.02]
                      -mx-2
                      px-3
                      rounded
                      transition-colors
                    ">
                      <span className="
                        text-sm
                        font-medium
                        text-gray-300
                        uppercase
                      ">
                        PM2.5
                      </span>

                      <span className="
                        text-base
                        font-semibold
                        text-gray-100
                      ">
                        {data.pm25}{' '}
                        <span className="
                          text-xs
                          text-gray-500
                          font-medium
                        ">
                          µg/m³
                        </span>
                      </span>
                    </div>

                    {/* PM10 */}
                    <div className="
                      flex
                      items-center
                      justify-between
                      py-3
                      border-b
                      border-white/[0.05]
                      group-hover:bg-white/[0.02]
                      -mx-2
                      px-3
                      rounded
                      transition-colors
                    ">
                      <span className="
                        text-sm
                        font-medium
                        text-gray-300
                        uppercase
                      ">
                        PM10
                      </span>

                      <span className="
                        text-base
                        font-semibold
                        text-gray-100
                      ">
                        {data.pm10}{' '}
                        <span className="
                          text-xs
                          text-gray-500
                          font-medium
                        ">
                          µg/m³
                        </span>
                      </span>
                    </div>

                    {/* Temperature */}
                    <div className="
                      flex
                      items-center
                      justify-between
                      py-3
                      border-b
                      border-white/[0.05]
                      group-hover:bg-white/[0.02]
                      -mx-2
                      px-3
                      rounded
                      transition-colors
                    ">
                      <span className="
                        text-sm
                        font-medium
                        text-gray-300
                      ">
                        Temperature
                      </span>

                      <span className="
                        text-base
                        font-semibold
                        text-gray-100
                      ">
                        {data.temperature}°C
                      </span>
                    </div>

                    {/* Humidity */}
                    <div className="
                      flex
                      items-center
                      justify-between
                      py-3
                      border-b
                      border-transparent
                      group-hover:bg-white/[0.02]
                      -mx-2
                      px-3
                      rounded
                      transition-colors
                    ">
                      <span className="
                        text-sm
                        font-medium
                        text-gray-300
                      ">
                        Humidity
                      </span>

                      <span className="
                        text-base
                        font-semibold
                        text-gray-100
                      ">
                        {data.humidity}%
                      </span>
                    </div>

                  </div>

                </div>
              );
            })
          )}

          {!isLoading && comparisonCities.length === 1 && (
            <div className="flex-1 bg-white/[0.015] backdrop-blur-sm border border-white/[0.07] border-dashed rounded-xl p-7 md:p-8 flex items-center justify-center min-h-[400px]">
              <p className="text-gray-500 font-medium tracking-wide">Search a city to compare</p>
            </div>
          )}

          {/* Center VS Indicator */}
          <div className="
            hidden
            md:flex
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-9
            h-9
            rounded-full
            bg-[#0A0F0D]
            border
            border-white/10
            items-center
            justify-center
            z-10
            shadow-[0_0_15px_rgba(0,0,0,0.5)]
          ">
            <span className="
              text-[10px]
              font-black
              text-gray-400
              tracking-widest
            ">
              VS
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};