import { ArrowLeft, MapPin, Calendar, Clock, ThumbsUp } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { cn } from '../../utils/utils';
import { StatusBadge } from './StatusBadge';
import { EscalationBanner } from './EscalationBanner';

const STEPS = [
  {
    id: 'Pending',
    label: 'Reported',
    description: 'Report has been received and is awaiting review.',
  },
  {
    id: 'In Review',
    label: 'Under Review',
    description: 'Authorities are currently reviewing the issue.',
  },
  { id: 'Resolved', label: 'Resolved', description: 'The issue has been successfully resolved.' },
  {
    id: 'Escalated',
    label: 'Escalated',
    description: '7-day SLA missed. Escalated to higher authorities.',
  },
  {
    id: 'CM Accepted',
    label: 'CM Accepted',
    description: 'CM Help has accepted the escalation and is taking action.',
  },
];

export const ReportDetail = ({ report, onBack, onUpvote, onEscalate, currentUserId }) => {
  if (!report) return null;

  const isOwner = report.createdBy === currentUserId;
  const isCommunityVerified = report.upvotes >= 5;

  const getStepStatus = (stepId) => {
    const statusOrder = ['Pending', 'In Review', 'Resolved', 'Escalated', 'CM Accepted'];
    const currentIdx = statusOrder.indexOf(report.status);
    const stepIdx = statusOrder.indexOf(stepId);

    if ((report.status === 'Escalated' || report.status === 'CM Accepted') && stepId === 'Resolved')
      return 'upcoming'; // Skip resolved if escalated
    if (report.status === 'Resolved' && (stepId === 'Escalated' || stepId === 'CM Accepted'))
      return 'upcoming'; // Skip escalated if resolved

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Reports</span>
      </button>

      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-surface-hover text-text-main text-sm font-medium capitalize">
                {report.category}
              </span>
              <StatusBadge status={report.status} />
              {isCommunityVerified && (
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-medium">
                  Community Verified
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-white leading-tight">{report.title}</h1>
            <p className="text-text-main whitespace-pre-wrap">{report.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div className="flex items-start gap-2 text-sm text-text-muted">
                <MapPin size={16} className="shrink-0 mt-0.5 text-green-400" />
                <span>{report.location?.address}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-text-muted">
                <Calendar size={16} className="shrink-0 mt-0.5 text-green-400" />
                <span>Reported on {new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              {report.deadline && report.status !== 'Resolved' && (
                <div className="flex items-start gap-2 text-sm text-amber-400">
                  <Clock size={16} className="shrink-0 mt-0.5" />
                  <span>Deadline: {new Date(report.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => !isOwner && onUpvote(report._id)}
                disabled={isOwner}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border',
                  isOwner
                    ? 'bg-surface border-border text-text-muted cursor-default'
                    : 'bg-surface hover:bg-surface-hover border-border text-white group'
                )}
              >
                <ThumbsUp
                  size={16}
                  className={
                    !isOwner
                      ? 'group-hover:text-green-400 group-hover:-translate-y-0.5 transition-all'
                      : ''
                  }
                />
                {report.upvotes} {report.upvotes === 1 ? 'Upvote' : 'Upvotes'}
              </button>
            </div>
          </div>

          {report.photoUrl && (
            <div className="w-full md:w-1/3 shrink-0">
              <img
                src={report.photoUrl}
                alt="Report Evidence"
                className="w-full aspect-square object-cover rounded-xl border border-border shadow-lg"
              />
            </div>
          )}
        </div>
      </GlassCard>

      {/* Escalation Banner */}
      <EscalationBanner report={report} onEscalate={onEscalate} isOwner={isOwner} />

      {/* Timeline Stepper */}
      <div className="pl-2">
        <h3 className="text-lg font-bold text-white mb-6">Status Timeline</h3>
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {STEPS.map((step) => {
            const status = getStepStatus(step.id);
            if (
              status === 'upcoming' &&
              step.id === 'Resolved' &&
              (report.status === 'Escalated' || report.status === 'CM Accepted')
            )
              return null;
            if (
              status === 'upcoming' &&
              (step.id === 'Escalated' || step.id === 'CM Accepted') &&
              report.status === 'Resolved'
            )
              return null;
            if (
              status === 'upcoming' &&
              step.id === 'CM Accepted' &&
              report.status !== 'Escalated' &&
              report.status !== 'CM Accepted'
            )
              return null; // Don't show CM Accepted step unless escalated

            return (
              <div
                key={step.id}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-colors',
                    status === 'completed'
                      ? 'bg-green-500'
                      : status === 'current'
                        ? step.id === 'Escalated'
                          ? 'bg-red-500'
                          : step.id === 'CM Accepted'
                            ? 'bg-purple-500'
                            : 'bg-blue-500'
                        : 'bg-surface border-border'
                  )}
                >
                  {status === 'completed' && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                  {status === 'current' && (
                    <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  )}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl border border-border shadow-sm">
                  <h4
                    className={cn(
                      'font-bold mb-1',
                      status === 'completed'
                        ? 'text-white'
                        : status === 'current'
                          ? step.id === 'Escalated'
                            ? 'text-red-400'
                            : step.id === 'CM Accepted'
                              ? 'text-purple-400'
                              : 'text-blue-400'
                          : 'text-text-muted'
                    )}
                  >
                    {step.label}
                  </h4>
                  <p className="text-sm text-text-muted">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
