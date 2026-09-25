import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Bookmark,
  ArrowRight,
  Send,
  Building,
} from 'lucide-react';
import { Job } from '../../types';
import { JobBadge } from './JobBadge';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';

interface JobCardProps {
  job: Job;
  onApplyClick?: (job: Job) => void;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApplyClick, compact = false }) => {
  const { isJobSaved, saveJobToggle, getDeadlineStatus, isJobExpired } = useJobs();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const saved = isJobSaved(job.id);
  const deadlineStatus = getDeadlineStatus(job.deadline);
  const expired = isJobExpired(job);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (expired) return;
    if (!isAuthenticated) {
      navigate('/login?redirect=/jobs/' + job.id);
      return;
    }
    if (onApplyClick) {
      onApplyClick(job);
    } else {
      navigate(`/jobs/${job.id}?apply=true`);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveJobToggle(job.id);
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 ${
        expired
          ? 'opacity-70 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40'
          : job.featured
          ? 'border-emerald-300 dark:border-emerald-800 shadow-md shadow-emerald-500/5 hover:border-emerald-500 hover:shadow-lg'
          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 hover:shadow-md'
      } ${compact ? 'p-4' : 'p-5 md:p-6'}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Logo and Main Details */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
            {job.logo || (job.sector === 'government' ? '🏛️' : '💼')}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5">
              <JobBadge
                sector={job.sector}
                bpsGrade={job.bpsGrade}
                workplaceType={job.workplaceType}
                deadlineStatus={deadlineStatus}
                featured={job.featured}
                urgent={job.urgent}
              />
            </div>
            <Link
              to={`/jobs/${job.id}`}
              className="font-bold text-base md:text-lg text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1"
            >
              {job.title}
            </Link>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {job.companyOrDept}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}, {job.province}
              </span>
            </div>
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          aria-label={saved ? 'Remove from saved' : 'Save job'}
          className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
            saved
              ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Meta Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">{job.jobType}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate font-medium">{job.educationRequired.split('/')[0]}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1 truncate">
          <span className="font-semibold text-emerald-700 dark:text-emerald-400 truncate">
            {job.salaryFormatted}
          </span>
        </div>
      </div>

      {/* Skills tags */}
      {job.skillsRequired && job.skillsRequired.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skillsRequired.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired.length > 3 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded text-slate-400">
              +{job.skillsRequired.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            Deadline: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{job.deadline}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleApply}
            disabled={expired}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold shadow-xs transition-all ${
              expired
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
            }`}
          >
            <Send className="w-3 h-3" />
            {expired ? 'Expired' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};
