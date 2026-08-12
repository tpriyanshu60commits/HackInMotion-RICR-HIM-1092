import React from 'react';
import { RefreshCw, Lightbulb, Users, Leaf } from 'lucide-react';

const features = [
  {
    icon: RefreshCw,
    title: 'Real-time Data',
    description: 'Live air quality, weather and environmental data'
  },
  {
    icon: Lightbulb,
    title: 'Smart Insights',
    description: 'AI-powered insights & actionable recommendations'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Connect, share and make an impact'
  },
  {
    icon: Leaf,
    title: 'Sustainable Future',
    description: 'Together we build a cleaner tomorrow'
  }
];

export const FeatureStrip = () => {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] flex flex-col md:flex-row overflow-hidden">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index} 
              className={`flex-1 p-6 md:p-8 flex items-start gap-4 hover:bg-white/5 transition-colors ${
                index !== features.length - 1 ? 'border-b md:border-b-0 md:border-r border-white/10' : ''
              }`}
            >
              <div className="bg-emerald-500/20 p-3 rounded-full shrink-0 mt-1">
                <Icon className="text-emerald-400 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
