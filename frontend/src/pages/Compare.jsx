import React from 'react';
import { MapPin } from 'lucide-react';

const COMPARE_DATA = [
  {
    city: "Rewa",
    aqi: 78,
    risk: "MODERATE",
    temp: 28,
    hum: 65,
    wind: 12,
    pm25: 35.4,
    pm10: 82.1,
    trend: "Improving"
  },
  {
    city: "Bhopal",
    aqi: 185,
    risk: "UNHEALTHY",
    temp: 31,
    hum: 45,
    wind: 8,
    pm25: 120.5,
    pm10: 190.2,
    trend: "Worsening"
  },
  {
    city: "Indore",
    aqi: 45,
    risk: "GOOD",
    temp: 26,
    hum: 70,
    wind: 15,
    pm25: 12.1,
    pm10: 30.5,
    trend: "Stable"
  }
];

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
  // Keep the existing two-city comparison behavior
  const comparisonCities = COMPARE_DATA.slice(0, 2);

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

          <button
            className="
              text-xs md:text-sm
              font-semibold
              text-green-400
              hover:text-green-300
              transition-colors
            "
          >
            + Add Location
          </button>
        </div>

        {/* City Selectors */}
        <div className="flex items-center justify-between gap-5 md:gap-8">

          {/* Selector 1 */}
          <div
            className="
              flex-1
              bg-black/40
              border border-white/10
              rounded-lg
              px-4 md:px-5
              py-3
              flex items-center justify-between
              hover:border-white/20
              hover:bg-white/[0.04]
              transition-all
              cursor-pointer
              group
            "
          >
            <span className="
              text-sm md:text-base
              font-medium
              text-white
              group-hover:text-green-400
              transition-colors
            ">
              {comparisonCities[0].city}, India
            </span>

            <span className="text-gray-500 text-[10px]">
              ▼
            </span>
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
          <div
            className="
              flex-1
              bg-black/40
              border border-white/10
              rounded-lg
              px-4 md:px-5
              py-3
              flex items-center justify-between
              hover:border-white/20
              hover:bg-white/[0.04]
              transition-all
              cursor-pointer
              group
            "
          >
            <span className="
              text-sm md:text-base
              font-medium
              text-white
              group-hover:text-green-400
              transition-colors
            ">
              {comparisonCities[1].city}, India
            </span>

            <span className="text-gray-500 text-[10px]">
              ▼
            </span>
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

          {comparisonCities.map((data, idx) => {
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
                    {data.city}, India
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
                        {data.risk}
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
                      {data.temp}°C
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
                      {data.hum}%
                    </span>
                  </div>

                </div>

              </div>
            );
          })}

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