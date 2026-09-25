import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Bookmark, Trash2, ArrowLeft, Briefcase, Search } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/common/JobCard';
import { Job } from '../types';

export const SavedJobsPage: React.FC = () => {
  const { savedJobIds, jobs, saveJobToggle } = useJobs();
  const context = useOutletContext<{ openApplyModal?: (job: Job) => void }>();

  const savedJobsList = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Bookmarked Opportunities
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Saved Jobs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            You have {savedJobsList.length} vacancies saved for future application review.
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" /> Browse More Jobs
        </Link>
      </div>

      {savedJobsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedJobsList.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApplyClick={context?.openApplyModal}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No saved jobs yet
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            When you see a job you like, click the bookmark icon to save it for quick access and deadline reminders.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Explore Jobs Now
          </Link>
        </div>
      )}
    </div>
  );
};
