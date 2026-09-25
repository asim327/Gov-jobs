import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Send,
  Bookmark,
  BellRing,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/common/JobCard';

export const DashboardPage: React.FC = () => {
  const { currentUser, calculateProfileCompletion, isAuthenticated } = useAuth();
  const { applications, savedJobIds, jobAlerts, jobs, getRecommendedJobs } = useJobs();
  const navigate = useNavigate();

  if (!isAuthenticated || !currentUser) {
    navigate('/login?redirect=/dashboard');
    return null;
  }

  const completion = calculateProfileCompletion(currentUser);
  const myApplications = applications.filter((a) => a.userId === currentUser.id);

  // Pipeline metrics
  const appliedCount = myApplications.filter((a) => a.status === 'Applied').length;
  const reviewCount = myApplications.filter((a) => a.status === 'Under Review').length;
  const interviewCount = myApplications.filter((a) => a.status === 'Interview').length;
  const acceptedCount = myApplications.filter((a) => a.status === 'Accepted').length;

  const recommended = getRecommendedJobs().slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20">
            <span>Welcome back, {currentUser.name}!</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Job Candidate Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            Monitor your job application pipeline, manage credentials, and explore personalized job openings across Pakistan.
          </p>
        </div>

        {/* Profile Completion Widget */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 w-full md:w-64 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>Profile Strength</span>
            <span className="text-emerald-300">{completion}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
            <span>{completion === 100 ? 'All Set!' : 'Incomplete'}</span>
            <Link to="/profile" className="text-emerald-300 font-bold hover:underline">
              Update Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Tracked Applications</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">{myApplications.length}</div>
          <Link to="/applications" className="text-xs text-sky-600 font-semibold hover:underline block mt-1">
            View pipeline →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Interviews & Tests</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">{interviewCount}</div>
          <span className="text-xs text-slate-400 block mt-1">Scheduled appointments</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Saved Jobs</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">{savedJobIds.length}</div>
          <Link to="/saved-jobs" className="text-xs text-emerald-600 font-semibold hover:underline block mt-1">
            Browse bookmarks →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Job Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">{jobAlerts.length}</div>
          <Link to="/job-alerts" className="text-xs text-purple-600 font-semibold hover:underline block mt-1">
            Manage alerts →
          </Link>
        </div>
      </div>

      {/* Application Status Pipeline Ribbon */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Application Progress Tracker
          </h2>
          <Link to="/applications" className="text-xs font-bold text-emerald-600 hover:underline">
            Open Full Pipeline →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 block">Applied</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100 block mt-1">
              {appliedCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <span className="text-amber-800 dark:text-amber-300 block">Under Review</span>
            <span className="text-xl font-bold text-amber-700 dark:text-amber-400 block mt-1">
              {reviewCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
            <span className="text-purple-800 dark:text-purple-300 block">Interview / Test</span>
            <span className="text-xl font-bold text-purple-700 dark:text-purple-400 block mt-1">
              {interviewCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <span className="text-emerald-800 dark:text-emerald-300 block">Accepted / Offer</span>
            <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400 block mt-1">
              {acceptedCount}
            </span>
          </div>
        </div>

        {/* Quick List of Active Applications */}
        {myApplications.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2">
            {myApplications.slice(0, 3).map((app) => (
              <div key={app.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                    {app.logo || '💼'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{app.jobTitle}</h4>
                    <span className="text-slate-500 block">{app.companyOrDept} • Applied on {app.appliedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {app.status}
                  </span>
                  <Link
                    to="/applications"
                    className="text-emerald-600 font-bold hover:underline hidden sm:inline-block"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500">
            No applications logged yet. Explore jobs and click "Apply" to record them in your tracker.
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Recommended Career Opportunities
          </h2>
          <Link to="/jobs" className="text-xs font-bold text-emerald-600 hover:underline">
            View All Jobs →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommended.map(({ job, reason }) => (
            <div key={job.id} className="relative">
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-t-xl border-t border-x border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                {reason}
              </div>
              <div className="-mt-px">
                <JobCard job={job} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
