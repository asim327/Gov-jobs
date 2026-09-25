import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/common/JobCard';
import { PAKISTAN_CITIES, JOB_CATEGORIES, PROVINCES } from '../data/mockData';
import { Job, JobType, WorkplaceType, JobSector } from '../types';

export const JobsPage: React.FC = () => {
  const { jobs } = useJobs();
  const [searchParams, setSearchParams] = useSearchParams();
  const context = useOutletContext<{ openApplyModal?: (job: Job) => void }>();

  // Filter States initialized from URL params
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [province, setProvince] = useState(searchParams.get('province') || '');
  const [sector, setSector] = useState<string>(searchParams.get('sector') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [jobType, setJobType] = useState<string>(searchParams.get('jobType') || '');
  const [workplace, setWorkplace] = useState<string>(searchParams.get('workplace') || '');
  const [bpsGrade, setBpsGrade] = useState(searchParams.get('bps') || '');
  const [minExp, setMinExp] = useState<number>(
    searchParams.get('minExp') ? parseInt(searchParams.get('minExp')!) : -1
  );
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'recent');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Sync state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    if (province) params.set('province', province);
    if (sector && sector !== 'all') params.set('sector', sector);
    if (category) params.set('category', category);
    if (jobType) params.set('jobType', jobType);
    if (workplace) params.set('workplace', workplace);
    if (bpsGrade) params.set('bps', bpsGrade);
    if (minExp >= 0) params.set('minExp', minExp.toString());
    if (sortBy && sortBy !== 'recent') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
    setCurrentPage(1);
  }, [keyword, location, province, sector, category, jobType, workplace, bpsGrade, minExp, sortBy, setSearchParams]);

  const clearAllFilters = () => {
    setKeyword('');
    setLocation('');
    setProvince('');
    setSector('all');
    setCategory('');
    setJobType('');
    setWorkplace('');
    setBpsGrade('');
    setMinExp(-1);
    setSortBy('recent');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    keyword ||
      location ||
      province ||
      sector !== 'all' ||
      category ||
      jobType ||
      workplace ||
      bpsGrade ||
      minExp >= 0
  );

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (!job.published) return false;

      // Keyword match (title, company, skills, description)
      if (keyword.trim()) {
        const query = keyword.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesComp = job.companyOrDept.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        const matchesSkill = job.skillsRequired?.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesComp && !matchesDesc && !matchesSkill) {
          return false;
        }
      }

      // Location match
      if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      // Province match
      if (province && job.province !== province) {
        return false;
      }

      // Sector match
      if (sector !== 'all' && job.sector !== sector) {
        return false;
      }

      // Category match
      if (category && job.category !== category) {
        return false;
      }

      // Job Type match
      if (jobType && job.jobType !== jobType) {
        return false;
      }

      // Workplace match
      if (workplace && job.workplaceType !== workplace) {
        return false;
      }

      // BPS Grade match
      if (bpsGrade && job.bpsGrade !== bpsGrade) {
        return false;
      }

      // Experience match
      if (minExp >= 0 && job.experienceYears > minExp) {
        return false;
      }

      return true;
    });
  }, [jobs, keyword, location, province, sector, category, jobType, workplace, bpsGrade, minExp]);

  // Sorting
  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs];
    if (sortBy === 'recent') {
      list.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    } else if (sortBy === 'deadline') {
      list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === 'salary_high') {
      list.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (sortBy === 'salary_low') {
      list.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    } else if (sortBy === 'views') {
      list.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    }
    return list;
  }, [filteredJobs, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / pageSize) || 1;
  const paginatedJobs = sortedJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const filterSidebarContent = (
    <div className="space-y-6 text-sm">
      {/* Sector Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Sector
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          {(['all', 'government', 'private'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSector(s)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all ${
                sector === s
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {s === 'all' ? 'All' : s === 'government' ? 'Govt' : 'Private'}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
        >
          <option value="">All Categories</option>
          {JOB_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          City / Location
        </label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
        >
          <option value="">All Cities</option>
          {PAKISTAN_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Province */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Province / Region
        </label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
        >
          <option value="">All Provinces</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Workplace Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Workplace Mode
        </label>
        <div className="flex flex-wrap gap-1.5">
          {['', 'On-site', 'Remote', 'Hybrid'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setWorkplace(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                workplace === mode
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {mode || 'Any'}
            </button>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Employment Type
        </label>
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
        >
          <option value="">Any Employment Type</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Temporary">Temporary</option>
          <option value="Freelance">Freelance</option>
        </select>
      </div>

      {/* Government BPS Grade */}
      {(sector === 'government' || sector === 'all') && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Government BPS Scale
          </label>
          <select
            value={bpsGrade}
            onChange={(e) => setBpsGrade(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="">Any BPS Grade</option>
            <option value="BPS-16">BPS-16</option>
            <option value="BPS-17">BPS-17 (Gazetted Officer)</option>
            <option value="BPS-18">BPS-18 (Senior Scale)</option>
            <option value="BPS-19">BPS-19</option>
            <option value="BPS-20">BPS-20</option>
          </select>
        </div>
      )}

      {/* Max Experience Requirement Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Maximum Experience Required
        </label>
        <select
          value={minExp}
          onChange={(e) => setMinExp(parseInt(e.target.value))}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
        >
          <option value={-1}>Any Experience Level</option>
          <option value={0}>Fresh Graduates (0 years)</option>
          <option value={2}>Up to 2 years</option>
          <option value={5}>Up to 5 years</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <Search className="w-4 h-4 text-emerald-600 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by title, skills, organization, or keywords..."
              className="w-full bg-transparent text-sm focus:outline-hidden text-slate-900 dark:text-slate-100"
            />
            {keyword && (
              <button onClick={() => setKeyword('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between md:justify-start">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Filter className="w-4 h-4 text-emerald-600" />
              Filters {hasActiveFilters && '(Active)'}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="recent">Most Recent</option>
                <option value="deadline">Deadline (Closing Soon)</option>
                <option value="salary_high">Salary (High to Low)</option>
                <option value="salary_low">Salary (Low to High)</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-400">Active Filters:</span>
            {keyword && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Keyword: "{keyword}"
                <button onClick={() => setKeyword('')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>
              </span>
            )}
            {sector !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 capitalize">
                Sector: {sector}
                <button onClick={() => setSector('all')}><X className="w-3 h-3 hover:text-emerald-900" /></button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Category: {category}
                <button onClick={() => setCategory('')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                City: {location}
                <button onClick={() => setLocation('')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>
              </span>
            )}
            {workplace && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Workplace: {workplace}
                <button onClick={() => setWorkplace('')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>
              </span>
            )}
            {bpsGrade && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Grade: {bpsGrade}
                <button onClick={() => setBpsGrade('')}><X className="w-3 h-3 hover:text-emerald-900" /></button>
              </span>
            )}
            {minExp >= 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Exp: ≤ {minExp} yrs
                <button onClick={() => setMinExp(-1)}><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-600 hover:underline font-bold ml-1"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Left Sidebar + Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Filter Jobs</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {filteredJobs.length} Results
              </span>
            </div>
            {filterSidebarContent}
          </div>
        </aside>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              Showing {sortedJobs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(currentPage * pageSize, sortedJobs.length)} of {sortedJobs.length} jobs
            </span>
          </div>

          {/* Job Cards */}
          {sortedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {paginatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={context?.openApplyModal}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No matching jobs found
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any job listings matching your specified criteria. Try clearing some filters or searching with different keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs lg:hidden animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-base">
                  <Filter className="w-5 h-5 text-emerald-600" />
                  <span>Filter Options</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterSidebarContent}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
              >
                Show {filteredJobs.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
