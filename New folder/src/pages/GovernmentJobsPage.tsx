import React, { useState, useMemo } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  Calendar,
  CreditCard,
  Users,
  Search,
  CheckCircle2,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/common/JobCard';
import { Job } from '../types';

export const GovernmentJobsPage: React.FC = () => {
  const { jobs, departments } = useJobs();
  const [searchParams, setSearchParams] = useSearchParams();
  const context = useOutletContext<{ openApplyModal?: (job: Job) => void }>();

  const [cadreFilter, setCadreFilter] = useState(searchParams.get('cadre') || 'all');
  const [bpsFilter, setBpsFilter] = useState(searchParams.get('bps') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const governmentJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (!j.published || j.sector !== 'government') return false;

      if (cadreFilter !== 'all') {
        const matchesCadre =
          j.departmentCadre === cadreFilter ||
          j.province === cadreFilter ||
          (cadreFilter === 'Federal' && (j.departmentCadre === 'Federal' || j.province === 'Federal'));
        if (!matchesCadre) return false;
      }

      if (bpsFilter !== 'all' && j.bpsGrade !== bpsFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          j.title.toLowerCase().includes(q) ||
          j.companyOrDept.toLowerCase().includes(q) ||
          j.bpsGrade?.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [jobs, cadreFilter, bpsFilter, searchQuery]);

  const cadres = [
    { id: 'all', label: 'All Public Posts', icon: '🇵🇰' },
    { id: 'Federal', label: 'Federal (FPSC / Ministries)', icon: '🏛️' },
    { id: 'Punjab', label: 'Punjab Govt (PPSC)', icon: '🌾' },
    { id: 'Sindh', label: 'Sindh Govt (SPSC)', icon: '🌊' },
    { id: 'KPK', label: 'KPK Govt (KPPSC)', icon: '⛰️' },
    { id: 'Balochistan', label: 'Balochistan Govt (BPSC)', icon: '🏜️' },
  ];

  const bpsScales = ['all', 'BPS-16', 'BPS-17', 'BPS-18', 'BPS-19'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner / Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-linear-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified Pakistani Public Sector Portal
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Government Jobs & Gazetted Vacancies
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            Consolidated notices for Federal Public Service Commission (FPSC), Provincial Public Service Commissions, National Testing Services, and autonomous statutory authorities.
          </p>
        </div>
      </div>

      {/* Official Guidelines Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">National Bank Challan</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Submit original treasury challan (Form M-32A) at any NBP/State Bank branch before online application.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3">
          <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Quota Allocation</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Verify provincial domicile quota rules (Merit 7.5%, Punjab 50%, Sindh 19%, KPK 11.5%, Balochistan 6%).
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3">
          <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Age Relaxation</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Standard 5-year general age relaxation applies per Federal and Provincial civil service rules.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-4">
        {/* Cadre Horizontal Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800">
          {cadres.map((c) => (
            <button
              key={c.id}
              onClick={() => setCadreFilter(c.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                cadreFilter === c.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* BPS Grades and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-80 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Search className="w-4 h-4 text-emerald-600 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search department, post, or syllabus..."
              className="w-full bg-transparent text-xs font-medium focus:outline-hidden text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs font-bold">
            <span className="text-slate-400 shrink-0">Scale:</span>
            {bpsScales.map((bps) => (
              <button
                key={bps}
                onClick={() => setBpsFilter(bps)}
                className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
                  bpsFilter === bps
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {bps === 'all' ? 'All Scales' : bps}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Government Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>{governmentJobs.length} Verified Public Sector Vacancies</span>
        </div>

        {governmentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {governmentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={context?.openApplyModal}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <AlertCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base">No government jobs found for this filter</h3>
            <p className="text-xs text-slate-500">
              Try switching your Cadre selection or choosing "All Scales".
            </p>
          </div>
        )}
      </div>

      {/* Government Recruitment Commissions Reference Cards */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Building className="w-5 h-5 text-emerald-600" />
          Primary Government Recruitment Commissions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.slice(0, 4).map((dept) => (
            <div
              key={dept.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-xl flex items-center justify-center mb-2">
                  {dept.logo}
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{dept.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {dept.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                <span className="text-emerald-600 font-semibold">{dept.cadre || dept.jurisdiction} Cadre</span>
                <a
                  href={dept.officialWebsite || dept.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:underline"
                >
                  Official Portal ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
