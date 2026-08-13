import React, { useState } from 'react';
import { Shield, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '../common/GlassCard';

export const PrivacySettings = () => {
  const [exportStatus, setExportStatus] = useState('idle'); // idle | loading | done

  const handleExport = () => {
    setExportStatus('loading');
    setTimeout(() => {
      setExportStatus('done');
      setTimeout(() => setExportStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
          <Shield size={24} className="text-green-400" />
          Privacy & Data
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Manage your personal data and privacy settings.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Export Data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Export Your Data</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">Download a copy of your health profile, saved locations, and history.</p>
          </div>
          <button 
            onClick={handleExport}
            disabled={exportStatus !== 'idle'}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[140px]",
              exportStatus === 'done' ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
            )}
          >
            {exportStatus === 'loading' ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            ) : exportStatus === 'done' ? (
              <><CheckCircle2 size={16} /> Exported</>
            ) : (
              <><Download size={16} /> Request Data</>
            )}
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl gap-4">
          <div>
            <h3 className="text-sm font-semibold text-red-400">Delete Account</h3>
            <p className="text-xs text-red-400/70 mt-1 max-w-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors">
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};
