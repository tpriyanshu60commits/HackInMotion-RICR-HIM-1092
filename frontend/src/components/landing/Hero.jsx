import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Droplets, Thermometer, Wind } from 'lucide-react';
import { AQICard } from './AQICard';
import { StatCard } from './StatCard';

export const Hero = () => {
  return (
    <section className="relative z-10 pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 min-h-[85vh]">
      
      {/* Left Column - Text Content */}
      <div className="flex-1 flex flex-col items-start text-left animate-fade-in-up w-full">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-white text-xs font-medium tracking-wide uppercase">Clean Tech. Clear Future.</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          <span className="text-white block">Empowering a</span>
          <span className="text-emerald-500 block mt-2">Greener <span className="text-white">Tomorrow</span></span>
        </h1>
        
        <p className="text-gray-200 text-lg md:text-xl max-w-[500px] mb-10 leading-relaxed font-medium">
          Real-time environmental intelligence, insights and community-driven solutions for a sustainable planet.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/register" className="px-8 py-4 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-lg flex items-center justify-center text-lg">
            Get Started
          </Link>
          <Link to="/dashboard" className="px-8 py-4 rounded-full font-bold text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all flex items-center justify-center text-lg">
            Explore Dashboard
          </Link>
        </div>
      </div>

      {/* Right Column - Cards */}
      <div className="flex-1 w-full max-w-lg flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <AQICard />
        
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            title="PM2.5" 
            icon={RefreshCw} 
            value="18" 
            unit="µg/m³" 
            statusText="Good" 
            statusColor="bg-emerald-400" 
          />
          <StatCard 
            title="PM10" 
            icon={Wind} 
            value="35" 
            unit="µg/m³" 
            statusText="Good" 
            statusColor="bg-emerald-400" 
          />
          <StatCard 
            title="Temperature" 
            icon={Thermometer} 
            value="28°C" 
            statusText="Feels like 30°C" 
            statusColor="bg-gray-400" 
          />
          <StatCard 
            title="Humidity" 
            icon={Droplets} 
            value="65%" 
            statusText="Moderate" 
            statusColor="bg-amber-400" 
          />
        </div>
      </div>
    </section>
  );
};
