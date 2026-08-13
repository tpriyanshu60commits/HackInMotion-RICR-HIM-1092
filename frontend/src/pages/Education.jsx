
import { GlassCard } from '../components/common/GlassCard';
import { Leaf, Wind, Sun, BatteryCharging, Droplets, BookOpen, ShieldCheck } from 'lucide-react';

export const Education = () => {
  return (
    <div 
      className="space-y-8 animate-fade-in pb-10"
      
    >
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-text-main drop-shadow-md flex items-center gap-3">
          <BookOpen className="text-primary-500" size={32} />
          Environmental Education & Glossary
        </h1>
        <p className="text-text-main font-medium max-w-2xl text-lg opacity-90 drop-shadow-sm">
          Learn about air quality, clean energy, and how to protect yourself and the planet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AQI Glossary */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary-600">
            <Wind size={24} /> Understanding Pollutants
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-rose-500 pl-4">
              <h3 className="font-bold text-text-main text-lg">PM2.5 (Fine Particulate Matter)</h3>
              <p className="text-text-muted mt-1 leading-relaxed">
                Tiny particles or droplets in the air that are two and one half microns or less in width. They are small enough to travel deeply into the respiratory tract, reaching the lungs.
              </p>
            </div>
            
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-text-main text-lg">PM10 (Coarse Particulate Matter)</h3>
              <p className="text-text-muted mt-1 leading-relaxed">
                Inhalable particles, with diameters that are generally 10 micrometers and smaller. Often consists of dust, pollen, and mold.
              </p>
            </div>
            
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-bold text-text-main text-lg">Carbon Monoxide (CO)</h3>
              <p className="text-text-muted mt-1 leading-relaxed">
                A colorless, odorless gas that can be harmful when inhaled in large amounts. CO is released when something is burned, primarily from vehicles and machinery.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-text-main text-lg">Ground-level Ozone (O3)</h3>
              <p className="text-text-muted mt-1 leading-relaxed">
                Not emitted directly into the air, but created by chemical reactions between oxides of nitrogen (NOx) and volatile organic compounds (VOC) in the presence of sunlight.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Clean Tech & Sustainability */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary-600">
            <Leaf size={24} /> Clean Tech & Sustainability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface/50 p-4 rounded-xl border border-border">
              <Sun size={28} className="text-amber-500 mb-3" />
              <h3 className="font-bold text-text-main mb-1">Solar Energy</h3>
              <p className="text-sm text-text-muted">
                Capturing the sun's energy and converting it into electricity. It's a completely renewable resource that heavily reduces greenhouse gas emissions.
              </p>
            </div>

            <div className="bg-surface/50 p-4 rounded-xl border border-border">
              <Wind size={28} className="text-sky-500 mb-3" />
              <h3 className="font-bold text-text-main mb-1">Wind Power</h3>
              <p className="text-sm text-text-muted">
                Using wind turbines to generate mechanical power or electricity. Offshore wind farms are becoming a major source of clean energy globally.
              </p>
            </div>

            <div className="bg-surface/50 p-4 rounded-xl border border-border">
              <BatteryCharging size={28} className="text-green-500 mb-3" />
              <h3 className="font-bold text-text-main mb-1">EV Transition</h3>
              <p className="text-sm text-text-muted">
                Replacing internal combustion engines with electric vehicles (EVs) significantly lowers local air pollution, especially PM2.5 and CO.
              </p>
            </div>

            <div className="bg-surface/50 p-4 rounded-xl border border-border">
              <Droplets size={28} className="text-blue-500 mb-3" />
              <h3 className="font-bold text-text-main mb-1">Water Conservation</h3>
              <p className="text-sm text-text-muted">
                Smart irrigation and wastewater recycling technologies are crucial for adapting to drought conditions caused by climate change.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Health Protection */}
        <GlassCard className="p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-600">
            <ShieldCheck size={24} /> Health Protection Guidelines
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 font-bold text-text-main">AQI Range</th>
                  <th className="py-3 px-4 font-bold text-text-main">Level of Concern</th>
                  <th className="py-3 px-4 font-bold text-text-main">What To Do</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-surface-hover/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-green-600">0 to 50</td>
                  <td className="py-3 px-4 text-text-main">Good</td>
                  <td className="py-3 px-4 text-text-muted text-sm">Enjoy outdoor activities. Air quality is considered satisfactory.</td>
                </tr>
                <tr className="border-b border-border hover:bg-surface-hover/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-yellow-600">51 to 100</td>
                  <td className="py-3 px-4 text-text-main">Moderate</td>
                  <td className="py-3 px-4 text-text-muted text-sm">Unusually sensitive people should consider reducing prolonged outdoor exertion.</td>
                </tr>
                <tr className="border-b border-border hover:bg-surface-hover/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-orange-500">101 to 150</td>
                  <td className="py-3 px-4 text-text-main">Unhealthy for Sensitive Groups</td>
                  <td className="py-3 px-4 text-text-muted text-sm">People with heart or lung disease, older adults, and children should reduce prolonged outdoors.</td>
                </tr>
                <tr className="border-b border-border hover:bg-surface-hover/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-red-500">151 to 200</td>
                  <td className="py-3 px-4 text-text-main">Unhealthy</td>
                  <td className="py-3 px-4 text-text-muted text-sm">Everyone may begin to experience health effects. Wear a mask (N95) if going outside.</td>
                </tr>
                <tr className="hover:bg-surface-hover/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-purple-600">201+</td>
                  <td className="py-3 px-4 text-text-main">Very Unhealthy / Hazardous</td>
                  <td className="py-3 px-4 text-text-muted text-sm">Health warnings of emergency conditions. Everyone should avoid all outdoor physical activities.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};
