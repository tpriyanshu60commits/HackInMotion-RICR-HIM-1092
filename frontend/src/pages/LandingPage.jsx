import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { FeatureStrip } from '../components/landing/FeatureStrip';

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#0f172a] text-white overflow-x-hidden font-sans">
      
      {/* Full viewport background image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=2074)' }}
      ></div>
      
      {/* Dark overlay for readability */}
      <div 
        className="fixed inset-0 z-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55))' }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <Hero />
        <FeatureStrip />
      </div>

    </div>
  );
};

