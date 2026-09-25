import React from 'react';
import { ShieldCheck, Building2, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { JobSector, WorkplaceType } from '../../types';

interface JobBadgeProps {
  sector?: JobSector;
  bpsGrade?: string;
  workplaceType?: WorkplaceType;
  deadlineStatus?: 'closing_today' | 'closing_soon' | 'open' | 'expired';
  featured?: boolean;
  urgent?: boolean;
}

export const JobBadge: React.FC<JobBadgeProps> = ({
  sector,
  bpsGrade,
  workplaceType,
  deadlineStatus,
  featured,
  urgent,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
      {featured && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          ★ Featured
        </span>
      )}
      {urgent && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 animate-pulse">
          ⚡ Urgent
        </span>
      )}
      {sector === 'government' && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          Government {bpsGrade ? `• ${bpsGrade}` : ''}
        </span>
      )}
      {sector === 'private' && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-800 dark:text-sky-300 border border-sky-500/20">
          <Building2 className="w-3.5 h-3.5" />
          Private Sector
        </span>
      )}
      {workplaceType && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {workplaceType}
        </span>
      )}
      {deadlineStatus === 'closing_today' && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          Closing Today
        </span>
      )}
      {deadlineStatus === 'closing_soon' && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5" />
          Closing Soon
        </span>
      )}
      {deadlineStatus === 'expired' && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
          Expired
        </span>
      )}
      {deadlineStatus === 'open' && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          Active
        </span>
      )}
    </div>
  );
};
