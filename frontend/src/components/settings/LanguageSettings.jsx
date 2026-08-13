import React from 'react';
import { Globe, Check } from 'lucide-react';
import useStore from '../../store/useStore';
import { cn } from '../common/GlassCard';

export const LanguageSettings = () => {
  const language = useStore(state => state.language);
  const setLanguage = useStore(state => state.setLanguage);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
  ];

  return (
    <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
          <Globe size={24} className="text-green-400" />
          Language & Region
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Select your preferred language for alerts and interface.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
              language === lang.code 
                ? "bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20" 
                : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <div>
              <div className="font-semibold text-white">{lang.native}</div>
              <div className="text-xs text-gray-400">{lang.name}</div>
            </div>
            {language === lang.code && <Check size={20} className="text-green-400" />}
          </button>
        ))}
      </div>
    </div>
  );
};
