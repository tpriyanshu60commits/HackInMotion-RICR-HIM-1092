import React from 'react';
import { User } from 'lucide-react';
import useStore from '../../store/useStore';

export const BasicProfile = () => {
  const userName = useStore(state => state.userName);
  const setUserName = useStore(state => state.setUserName);
  
  const userAge = useStore(state => state.userAge);
  const setUserAge = useStore(state => state.setUserAge);

  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
          <User size={24} className="text-green-400" />
          Basic Identity
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Manage your personal details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Name</label>
          <input 
            type="text" 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g. Rahul"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Age</label>
          <input 
            type="number" 
            value={userAge}
            onChange={(e) => setUserAge(e.target.value)}
            placeholder="e.g. 35"
            min="1"
            max="120"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all"
          />
        </div>
      </div>
    </div>
  );
};
