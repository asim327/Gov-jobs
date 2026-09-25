import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Laptop,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/common/JobCard';
import { Job } from '../types';

export const PrivateJobsPage: React.FC = () => {
  const { jobs, companies } = useJobs();
  const context = useOutletContext<{ openApplyModal?: (job: Job) => void }>();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [workplaceFilter, setWorkplaceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const privateJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (!j.published || j.sector !== 'private') return false;

      if (categoryFilter !== 'all' && j.category !== categoryFilter) {
        return false;
      }

      if (workplaceFilter !== 'all' && j.workplaceType !== workplaceFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          j.title.toLowerCase().includes(q) ||
          j.companyOrDept.toLowerCase().includes(q) ||
          j.skillsRequired?.some((s) => s.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [jobs, categoryFilter, workplaceFilter, searchQuery]);

  const categories = [
    'all',
    'Software & IT',
    'Banking & Finance',
    'Telecommunications',
    'Engineering & Technical',
    'Medical & Healthcare',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-linear-to-r from-sky-900 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30 uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-sky-400" />
            Corporate & Tech Employment Portal
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Private Sector Careers in Pakistan
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Leading opportunities in software engineering, banking, telecom, industrial manufacturing, and high-growth venture-backed startups.
          </p>
        </div>
      </div>

      {/* Quick Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 w-full md:w-96 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-sky-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search private vacancies or skills..."
            className="w-full bg-transparent text-xs font-medium focus:outline-hidden text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {cat === 'all' ? 'All Industries' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workplace Type Selector */}
      <div className="flex items-center gap-2 text-xs font-bold">
        <span className="text-slate-400">Mode:</span>
        {['all', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
          <button
            key={mode}
            onClick={() => setWorkplaceFilter(mode)}
            className={`px-3 py-1 rounded-full border transition-all ${
              workplaceFilter === mode
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            {mode === 'all' ? 'All Workplace Types' : mode}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>{privateJobs.length} Corporate & Tech Jobs Available</span>
        </div>

        {privateJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {privateJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={context?.openApplyModal}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Building2 className="w-10 h-10 text-sky-600 mx-auto" />
            <h3 className="font-bold text-base">No private sector jobs matched</h3>
            <p className="text-xs text-slate-500">
              Clear your filters or choose another category to see available listings.
            </p>
          </div>
        )}
      </div>

      {/* Top Tech & Corporate Employers Strip */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600" />
            Top Hiring Employers
          </h3>
          <Link to="/companies" className="text-xs font-bold text-sky-600 hover:underline">
            View All Companies →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {companies.map((c) => (
            <Link
              key={c.id}
              to={`/companies/${c.id}`}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:shadow-xs transition-all text-center flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {c.logo}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate w-full">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
