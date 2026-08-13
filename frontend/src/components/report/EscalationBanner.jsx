import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../common/GlassCard';

export const EscalationBanner = ({ report, onEscalate, isOwner }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (report.status !== 'Escalated') return null;

  const handleEscalate = async () => {
    setLoading(true);
    await onEscalate(report._id);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className={cn(
      "w-full rounded-xl p-4 mt-4 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300",
      report.cmHelpForwarded ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20"
    )}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={cn(
          "shrink-0 mt-0.5",
          report.cmHelpForwarded ? "text-amber-400" : "text-red-400"
        )} size={20} />
        <div>
          <h4 className={cn(
            "font-semibold text-sm",
            report.cmHelpForwarded ? "text-amber-400" : "text-red-400"
          )}>
            {report.cmHelpForwarded ? "Escalated to CM Help" : "7-Day Deadline Exceeded"}
          </h4>
          <p className="text-sm text-text-muted mt-1">
            {report.cmHelpForwarded 
              ? "This issue has been formally escalated to the CM Help desk for urgent resolution."
              : "This report has not been resolved within the 7-day SLA window."}
          </p>
        </div>
      </div>
      
      {!report.cmHelpForwarded && isOwner && (
        <button
          onClick={handleEscalate}
          disabled={loading || success}
          className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {success ? (
            <><CheckCircle2 size={16} /> Forwarded</>
          ) : loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Forward to CM Help"
          )}
        </button>
      )}
    </div>
  );
};
