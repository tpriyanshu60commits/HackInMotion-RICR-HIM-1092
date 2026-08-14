import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { cn } from '../utils/utils';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden relative selection:bg-green-500/30">
      {/* Background gradients similar to LandingPage */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
        {/* Animated icon container */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full scale-110 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative bg-white/5 border border-white/10 p-6 rounded-full backdrop-blur-xl">
            <AlertTriangle className="w-16 h-16 text-green-400" />
          </div>
        </div>

        {/* 404 Header */}
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-white to-blue-300">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Page Not Found</h2>

        {/* Description */}
        <p className="text-gray-400 max-w-md text-base md:text-lg mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => window.history.back()}
            className={cn(
              'px-6 py-3 rounded-xl font-medium transition-all duration-300',
              'flex items-center justify-center gap-2',
              'bg-white/5 hover:bg-white/10 text-white border border-white/10'
            )}
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className={cn(
              'px-6 py-3 rounded-xl font-medium transition-all duration-300',
              'flex items-center justify-center gap-2',
              'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
            )}
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
