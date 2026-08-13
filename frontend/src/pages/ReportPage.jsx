import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReports } from '../hooks/useReports';
import useStore from '../store/useStore';
import { ReportForm } from '../components/report/ReportForm';
import { ReportCard } from '../components/report/ReportCard';
import { ReportDetail } from '../components/report/ReportDetail';
import { GlassCard, cn } from '../components/common/GlassCard';
import { AlertCircle, FileText, Globe2, PlusCircle } from 'lucide-react';

export const ReportPage = () => {
  const { user } = useStore();
  const { 
    reports, 
    myReports, 
    loading, 
    error, 
    fetchAllReports, 
    fetchMyReports, 
    createReport, 
    upvoteReport, 
    escalateToCMHelp 
  } = useReports();

  const [activeTab, setActiveTab] = useState('nearby'); // 'new', 'mine', 'nearby'
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAcceptedMessage, setShowAcceptedMessage] = useState(false);

  useEffect(() => {
    const acceptedId = searchParams.get('id');
    const isAccepted = searchParams.get('accepted');
    if (isAccepted === 'true' && acceptedId) {
      setSelectedReportId(acceptedId);
      setShowAcceptedMessage(true);
      // Clean up URL
      searchParams.delete('accepted');
      searchParams.delete('id');
      setSearchParams(searchParams);
      
      // Hide message after 5 seconds
      setTimeout(() => setShowAcceptedMessage(false), 5000);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    fetchAllReports();
    if (user?._id) {
      fetchMyReports(user._id);
    }
  }, [user, fetchAllReports, fetchMyReports]);

  const handleSubmitReport = async (formData) => {
    formData.append('createdBy', user?._id || 'anonymous');
    const res = await createReport(formData, user?._id);
    if (res.success) {
      setActiveTab('mine');
    }
  };

  const selectedReport = selectedReportId 
    ? [...reports, ...myReports].find(r => r._id === selectedReportId)
    : null;

  const TABS = [
    { id: 'nearby', label: 'Nearby Reports', icon: Globe2 },
    { id: 'mine', label: 'My Reports', icon: FileText },
    { id: 'new', label: 'New Report', icon: PlusCircle },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header & Navigation */}
      {!selectedReportId && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-2">
              <AlertCircle className="text-green-500" />
              Community Reports
            </h1>
            <p className="text-text-muted mt-1">
              Report and track local environmental issues.
            </p>
          </div>

          <GlassCard className="p-1.5 flex bg-surface/30">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-green-500/20 text-green-400 shadow-sm"
                    : "text-text-muted hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </GlassCard>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium animate-fade-in">
          {error}
        </div>
      )}

      {showAcceptedMessage && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium animate-fade-in flex items-center gap-2">
          <AlertCircle size={18} />
          Report has been successfully marked as CM Accepted!
        </div>
      )}

      {/* Main Content Area */}
      {selectedReportId && selectedReport ? (
        <ReportDetail 
          report={selectedReport}
          onBack={() => setSelectedReportId(null)}
          onUpvote={(id) => upvoteReport(id, user?._id)}
          onEscalate={(id) => escalateToCMHelp(id, user?._id)}
          currentUserId={user?._id}
        />
      ) : (
        <div className="animate-fade-in">
          {activeTab === 'new' && (
            <div className="max-w-2xl mx-auto">
              <ReportForm onSubmit={handleSubmitReport} loading={loading} />
            </div>
          )}

          {activeTab === 'nearby' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.length === 0 && !loading && (
                <div className="col-span-full py-12 text-center text-text-muted">
                  No reports found in your area.
                </div>
              )}
              {reports.map(report => (
                <ReportCard 
                  key={report._id} 
                  report={report} 
                  onUpvote={(id) => upvoteReport(id, user?._id)}
                  currentUserId={user?._id}
                  onClick={() => setSelectedReportId(report._id)}
                />
              ))}
            </div>
          )}

          {activeTab === 'mine' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!user && (
                <div className="col-span-full py-12 text-center text-text-muted">
                  Please log in to view your reports.
                </div>
              )}
              {user && myReports.length === 0 && !loading && (
                <div className="col-span-full py-12 text-center text-text-muted">
                  You haven't submitted any reports yet.
                </div>
              )}
              {user && myReports.map(report => (
                <ReportCard 
                  key={report._id} 
                  report={report} 
                  currentUserId={user?._id}
                  onClick={() => setSelectedReportId(report._id)}
                />
              ))}
            </div>
          )}

          {loading && reports.length === 0 && (
            <div className="flex justify-center py-12">
              <span className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPage;
