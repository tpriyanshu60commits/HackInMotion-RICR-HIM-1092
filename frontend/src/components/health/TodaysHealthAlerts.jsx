import { useState, useEffect } from 'react';
import { aiHealthAPI } from '../../services/api';
import { cn } from '../../utils/utils';
import { AlertTriangle, Info, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const TodaysHealthAlerts = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatestReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiHealthAPI.getLatestHealthReport();
      if (res.data?.data) {
        setReport(res.data.data);
      } else {
        setReport(null);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to fetch health report. Please check your connection.');
      }
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiHealthAPI.generateHealthReport();
      if (res.data?.data) {
        setReport(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLatestReport();
    
    // Listen for the custom event to refresh when a new report is generated
    const handleRefresh = () => fetchLatestReport();
    window.addEventListener('healthReportGenerated', handleRefresh);
    
    return () => {
      window.removeEventListener('healthReportGenerated', handleRefresh);
    };
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-400 text-sm">Loading health alerts...</div>;
  }

  if (error) {
    return (
      <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 shadow-2xl mb-6 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="text-red-400 mb-2" size={24} />
        <h3 className="text-white font-medium mb-1">Report Generation Failed</h3>
        <p className="text-xs text-gray-400 mb-4">{error}</p>
        <button onClick={handleRetryGenerate} className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-500/30 transition">
           Retry Generation
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 shadow-2xl mb-6 flex flex-col items-center justify-center text-center">
        <Info className="text-gray-400 mb-2" size={24} />
        <h3 className="text-white font-medium mb-1">No Health Report Available</h3>
        <p className="text-xs text-gray-400">Complete your AI Health Profile settings to get personalized alerts.</p>
      </div>
    );
  }

  const riskColors = {
    Good: 'bg-green-500/20 text-green-400 border-green-500/30',
    Moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Unhealthy: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Hazardous: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 shadow-2xl mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertTriangle size={18} className="text-blue-400" />
          Today's Health Alerts
        </h3>
        <span className={cn('px-3 py-1 rounded-full text-xs font-semibold border', riskColors[report.riskLevel] || riskColors['Moderate'])}>
          {report.riskLevel} Risk
        </span>
      </div>

      <p className="text-sm text-gray-200 mb-4">{report.summary}</p>
      
      {report.dosAndDonts && report.dosAndDonts.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Top Action</h4>
          <p className="text-sm text-white flex items-start gap-2">
            <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
            {report.dosAndDonts[0]}
          </p>
        </div>
      )}

      <button 
        onClick={() => setExpanded(!expanded)} 
        className="w-full text-center text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1"
      >
        {expanded ? 'Hide full report' : 'View full report'}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="mt-6 space-y-6 border-t border-white/10 pt-6 animate-fade-in-up">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Concern</h4>
            <p className="text-sm text-white">{report.keyConcern}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Do's & Don'ts</h4>
              <ul className="space-y-2">
                {report.dosAndDonts?.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Symptom Watch</h4>
              <ul className="space-y-2">
                {report.symptomWatch?.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-orange-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {report.bestTimeWindow && (
            <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <Clock className="text-blue-400" size={20} />
              <div>
                <h4 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Best Time for Outdoor Activity</h4>
                <p className="text-sm text-white">{report.bestTimeWindow}</p>
              </div>
            </div>
          )}

          {report.cityComparisonNote && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
               <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">City Comparison Note</h4>
               <p className="text-sm text-gray-300">{report.cityComparisonNote}</p>
            </div>
          )}
          
          <div className="text-[10px] text-gray-500 text-right mt-2">
            Generated at: {new Date(report.createdAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};
