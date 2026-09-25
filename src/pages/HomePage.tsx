import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  TrendingUp,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  BookOpen,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/common/JobCard';
import { PAKISTAN_CITIES, JOB_CATEGORIES } from '../data/mockData';
import { Job } from '../types';

export const HomePage: React.FC = () => {
  const { jobs, companies, departments, articles, getRecommendedJobs, createJobAlert } = useJobs();
  const navigate = useNavigate();
  const context = useOutletContext<{ openApplyModal?: (job: Job) => void }>();

  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Statistics calculation
  const totalJobsCount = jobs.filter((j) => j.published).length;
  const govJobsCount = jobs.filter((j) => j.published && j.sector === 'government').length;
  const privateJobsCount = jobs.filter((j) => j.published && j.sector === 'private').length;
  const companiesCount = companies.length + departments.length;
  const newJobsThisWeek = jobs.filter((j) => {
    const postTime = new Date(j.postedDate).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return postTime >= sevenDaysAgo;
  }).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (city.trim()) params.set('location', city.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const latestJobs = jobs
    .filter((j) => j.published)
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, 6);

  const governmentJobs = jobs
    .filter((j) => j.published && j.sector === 'government')
    .slice(0, 6);

  const privateJobs = jobs
    .filter((j) => j.published && j.sector === 'private')
    .slice(0, 6);

  const closingSoonJobs = jobs
    .filter((j) => {
      if (!j.published) return false;
      const today = new Date().toISOString().split('T')[0];
      const diff = (new Date(j.deadline).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 10;
    })
    .slice(0, 4);

  const recommended = getRecommendedJobs().slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    createJobAlert({
      userId: 'guest-' + Date.now(),
      name: `Newsletter Alert for ${newsletterEmail}`,
      sector: 'all',
      active: true,
    });
    setNewsletterSubscribed(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-radial-[at_top_right] from-emerald-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0596690a_1px,transparent_1px),linear-gradient(to_bottom,#0596690a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Pakistan's Premier Career & Public Sector Portal
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Next <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-200">Career Opportunity</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover verified government gazetted vacancies, civil services, tech careers, and corporate opportunities across all provinces of Pakistan.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto pt-4">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2 text-slate-900 dark:text-slate-100"
            >
              <div className="flex-1 w-full flex items-center gap-3 px-3 py-2">
                <Search className="w-5 h-5 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, skills, BPS grade or company..."
                  className="w-full bg-transparent text-sm font-medium focus:outline-hidden text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700" />

              <div className="w-full sm:w-56 flex items-center gap-2 px-3 py-2">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium focus:outline-hidden text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="" className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                    All Pakistan Cities
                  </option>
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search Jobs</span>
              </button>
            </form>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-medium text-slate-300">
              <span className="text-slate-400 font-semibold">Quick Filters:</span>
              <Link
                to="/government-jobs"
                className="px-3 py-1 rounded-full bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
              >
                🏛️ Government Jobs
              </Link>
              <Link
                to="/private-jobs"
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
              >
                💼 Private Jobs
              </Link>
              <Link
                to="/jobs?workplace=Remote"
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
              >
                🌐 Remote Jobs
              </Link>
              <Link
                to="/jobs?jobType=Internship"
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
              >
                🎓 Internships
              </Link>
              <Link
                to="/jobs?sort=recent"
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
              >
                ⚡ Latest Jobs
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">{totalJobsCount}+</span>
            <span className="text-xs text-slate-400 font-semibold mt-1 block">Total Active Jobs</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">{govJobsCount}</span>
            <span className="text-xs text-slate-400 font-semibold mt-1 block">Government Vacancies</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">{privateJobsCount}</span>
            <span className="text-xs text-slate-400 font-semibold mt-1 block">Private Careers</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">{companiesCount}</span>
            <span className="text-xs text-slate-400 font-semibold mt-1 block">Companies & Depts</span>
          </div>
          <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-xs text-center">
            <span className="text-2xl sm:text-3xl font-black text-white block">{newJobsThisWeek}</span>
            <span className="text-xs text-emerald-200 font-semibold mt-1 block">New This Week</span>
          </div>
        </div>
      </section>

      {/* RECOMMENDED JOBS (MATCHING USER PROFILE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Matching Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              Recommended Jobs For You
            </h2>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View all jobs <ArrowRight className="w-4 h-4" />
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
                <JobCard
                  job={job}
                  onApplyClick={context?.openApplyModal}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GOVERNMENT JOBS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-b from-emerald-50/70 to-teal-50/30 dark:from-emerald-950/20 dark:to-slate-900/50 border border-emerald-200/80 dark:border-emerald-900/40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Federal & Provincial Public Sector
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
                Latest Government Vacancies
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                FPSC, PPSC, SPSC, KPPSC, BPSC, Police, WAPDA, NADRA and Armed Forces civilian recruitments.
              </p>
            </div>
            <Link
              to="/government-jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-colors shrink-0"
            >
              Explore All Govt Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {governmentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={context?.openApplyModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Browse by Popular Categories
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Explore job openings tailored to your specific field of study or professional experience.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {JOB_CATEGORIES.slice(0, 8).map((cat) => {
            const count = jobs.filter((j) => j.category === cat && j.published).length;
            return (
              <Link
                key={cat}
                to={`/jobs?category=${encodeURIComponent(cat)}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                    {cat}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                    {count} Open Positions
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PRIVATE SECTOR HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              Corporate & Technology
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              Top Private Sector Openings
            </h2>
          </div>
          <Link
            to="/private-jobs"
            className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            All private jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {privateJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApplyClick={context?.openApplyModal}
            />
          ))}
        </div>
      </section>

      {/* POPULAR CITIES IN PAKISTAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Jobs by Major Pakistani Cities
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Find jobs located in provincial capitals and commercial industrial hubs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {PAKISTAN_CITIES.slice(0, 10).map((cityName) => {
            const count = jobs.filter((j) => j.location.includes(cityName) && j.published).length;
            return (
              <Link
                key={cityName}
                to={`/jobs?location=${encodeURIComponent(cityName)}`}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-xs transition-all text-center group"
              >
                <MapPin className="w-5 h-5 text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{cityName}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {count} Jobs
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED COMPANIES & COMMISSIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Featured Employers & Departments
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Top corporate hiring firms and federal recruitment commissions.
            </p>
          </div>
          <Link
            to="/companies"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            All companies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {companies.slice(0, 4).map((comp) => (
            <Link
              key={comp.id}
              to={`/companies/${comp.id}`}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mb-3 border border-slate-200/60 dark:border-slate-700">
                  {comp.logo}
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                  {comp.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {comp.description}
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {comp.openPositionsCount || 2} Open Jobs
                </span>
                <span className="text-slate-400 flex items-center gap-0.5">
                  View <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* JOBS CLOSING SOON */}
      {closingSoonJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Deadlines Closing Soon
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {closingSoonJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                compact
                onApplyClick={context?.openApplyModal}
              />
            ))}
          </div>
        </section>
      )}

      {/* CAREER RESOURCES & GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              Career Advisory
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              Career Resources & Guides
            </h2>
          </div>
          <Link
            to="/career-resources"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            All guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((art) => (
            <Link
              key={art.id}
              to={`/career-resources/${art.id}`}
              className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="h-40 bg-linear-to-tr from-emerald-800 to-teal-600 p-6 flex flex-col justify-end text-white relative">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md w-fit mb-2">
                  {art.category}
                </span>
                <span className="text-xs text-emerald-100">{art.readingTime}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
                    {art.summary}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>By {art.author.split('(')[0]}</span>
                  <span>{art.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* JOB ALERTS / NEWSLETTER SIGNUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-r from-emerald-800 to-teal-900 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-300">
              <BellRing className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Get Instant Pakistani Job Alerts in Your Inbox
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Stay ahead of competitive examination deadlines, FPSC challan updates, and top tech vacancies. No spam, only genuine verified posts.
            </p>

            {newsletterSubscribed ? (
              <div className="p-4 rounded-2xl bg-white/15 border border-white/20 text-white flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>You have successfully subscribed to CareerHub job alerts!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-colors shrink-0"
                >
                  Subscribe for Free
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
