import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, Shield, Activity, CloudRain, Wind } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-text-main transition-colors duration-500">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/20 blur-[120px] mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] mix-blend-multiply pointer-events-none dark:mix-blend-lighten" />

      {/* Navbar */}
      <nav className="glass border-b-0 rounded-none md:rounded-b-3xl mx-0 md:mx-8 mt-0 md:mt-4 px-6 py-4 flex items-center justify-between z-10 sticky top-0 md:static">
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-2xl tracking-tight">
          <Leaf className="text-primary-500" size={32} />
          <span>VerdantX</span>
        </div>
        <div className="flex gap-4">
          <Link to="/dashboard" className="px-5 py-2.5 rounded-full font-semibold text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors hidden sm:block">
            Log In
          </Link>
          <Link to="/dashboard" className="px-6 py-2.5 rounded-full font-semibold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary-500/30 text-primary-700 dark:text-primary-300 font-medium text-sm mb-8 animate-fade-in-up">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
          </span>
          Live Air Quality Monitoring
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-blue-600 dark:from-primary-300 dark:to-blue-400 leading-tight">
          Environmental Intelligence <br className="hidden md:block"/> for the Air You Breathe.
        </h1>
        
        <p className="text-xl md:text-2xl text-text-muted max-w-2xl mb-12 font-medium leading-relaxed">
          Convert real-time environmental data into understandable risk profiles and actionable health guidance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/dashboard" className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-xl shadow-primary-500/30 transition-all transform hover:scale-105 flex items-center justify-center gap-3 text-lg">
            Launch Dashboard
          </Link>
          <button className="px-8 py-4 rounded-full font-bold text-text-main glass hover:bg-surface-hover transition-all flex items-center justify-center gap-3 text-lg">
            How it works
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full text-left">
          <GlassCard className="flex flex-col gap-4 border-t-4 border-t-emerald-500">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">Personalized Risk</h3>
            <p className="text-text-muted">Dynamic safety guidance tailored to your health profile and sensitivities.</p>
          </GlassCard>
          
          <GlassCard className="flex flex-col gap-4 border-t-4 border-t-blue-500">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold">Real-time Analytics</h3>
            <p className="text-text-muted">Track AQI, PM2.5, PM10, and weather patterns with beautiful interactive charts.</p>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4 border-t-4 border-t-primary-500">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <Wind size={24} />
            </div>
            <h3 className="text-xl font-bold">Route Planning</h3>
            <p className="text-text-muted">Analyze environmental exposure risks along your daily commute routes.</p>
          </GlassCard>
        </div>
      </main>
      
      <footer className="glass rounded-none border-x-0 border-b-0 py-8 text-center text-text-muted mt-auto z-10">
        <p className="font-medium">© {new Date().getFullYear()} VerdantX Environmental Risk Platform. Built with React + Tailwind.</p>
      </footer>
    </div>
  );
};
