
import { MapPin, ThumbsUp, Calendar, Clock } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { StatusBadge } from './StatusBadge';

export const ReportCard = ({ report, onUpvote, currentUserId, onClick }) => {
  const isOwner = report.createdBy === currentUserId;
  const isCommunityVerified = report.upvotes >= 5;

  const getDaysLeft = () => {
    if (!report.deadline) return null;
    const daysLeft = Math.ceil((new Date(report.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0 && report.status === 'Escalated') {
      const escalatedDays = Math.abs(daysLeft);
      return `Escalated ${escalatedDays} day${escalatedDays > 1 ? 's' : ''} ago`;
    }
    return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  };

  const getTimeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const daysLeftText = getDaysLeft();
  const timeAgo = getTimeAgo(report.createdAt);

  return (
    <GlassCard className="flex flex-col gap-4 p-4 hover:border-white/20 transition-all cursor-pointer group" onClick={onClick}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2 py-1 rounded-full bg-surface-hover text-text-main text-xs font-medium capitalize">
              {report.category}
            </span>
            <StatusBadge status={report.status} />
            {isCommunityVerified && (
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-medium">
                Community Verified
              </span>
            )}
          </div>
          <h3 className="font-semibold text-lg text-white group-hover:text-green-400 transition-colors line-clamp-1">
            {report.title}
          </h3>
          <p className="text-sm text-text-muted mt-1 line-clamp-2">
            {report.description}
          </p>
        </div>
        {report.photoUrl && (
          <img 
            src={report.photoUrl} 
            alt="Report" 
            className="w-20 h-20 rounded-lg object-cover shrink-0 border border-border"
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-[200px]">{report.location?.address}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock size={14} className="shrink-0" />
            <span>Reported {timeAgo}</span>
          </div>
          {report.status !== 'Resolved' && daysLeftText && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400/80">
              <Calendar size={14} className="shrink-0" />
              <span>{daysLeftText}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isOwner && onUpvote && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpvote(report._id);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover text-sm font-medium transition-colors border border-border group/btn"
            >
              <ThumbsUp size={14} className="group-hover/btn:text-green-400 group-hover/btn:-translate-y-0.5 transition-all" />
              {report.upvotes}
            </button>
          )}
          {isOwner && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface text-sm font-medium border border-border text-text-muted">
              <ThumbsUp size={14} />
              {report.upvotes}
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
