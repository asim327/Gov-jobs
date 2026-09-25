import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Building, Search, MapPin, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { useJobs } from '../context/JobContext';

export const CompaniesPage: React.FC = () => {
  const { companies, departments, jobs } = useJobs();
  const [tab, setTab] = useState<'all' | 'private' | 'government'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntities = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      type: 'company' | 'department';
      logo?: string;
      description: string;
      location: string;
      categoryOrCadre: string;
      website: string;
      openCount: number;
    }> = [];

    if (tab === 'all' || tab === 'private') {
      companies.forEach((c) => {
        const count = jobs.filter((j) => j.companyOrDept === c.name && j.published).length;
        list.push({
          id: c.id,
          name: c.name,
          type: 'company',
          logo: c.logo,
          description: c.description,
          location: c.headquarters || c.location || 'Pakistan',
          categoryOrCadre: c.industry,
          website: c.website,
          openCount: count,
        });
      });
    }

    if (tab === 'all' || tab === 'government') {
      departments.forEach((d) => {
        const count = jobs.filter((j) => j.companyOrDept.includes(d.name) && j.published).length;
        list.push({
          id: d.id,
          name: d.name,
          type: 'department',
          logo: d.logo,
          description: d.description,
          location: d.jurisdiction,
          categoryOrCadre: `${d.cadre || d.jurisdiction} Cadre`,
          website: d.officialWebsite || d.website || '',
          openCount: count,
        });
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.categoryOrCadre.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
      );
    }

    return list;
  }, [companies, departments, jobs, tab, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-linear-to-r from-slate-900 via-emerald-950 to-slate-950 text-white shadow-xl space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20 uppercase tracking-wider">
          <Building2 className="w-4 h-4 text-emerald-400" />
          Pakistani Employers & Public Authorities
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Browse Companies & Government Departments
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Discover top national enterprises, multinational tech offices, federal ministries, and provincial recruitment commissions across Pakistan.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-full sm:w-auto">
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'all'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Organizations ({companies.length + departments.length})
          </button>
          <button
            onClick={() => setTab('private')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'private'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Private Sector ({companies.length})
          </button>
          <button
            onClick={() => setTab('government')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'government'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Govt Departments ({departments.length})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-72 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, industry, city..."
            className="w-full bg-transparent text-xs font-medium focus:outline-hidden"
          />
        </div>
      </div>

      {/* Grid of Employers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEntities.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-3xl flex items-center justify-center border border-slate-200/80 dark:border-slate-700 shrink-0 shadow-xs">
                  {item.logo || (item.type === 'department' ? '🏛️' : '💼')}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.type === 'department'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                  }`}
                >
                  {item.type === 'department' ? 'Govt Department' : 'Private Enterprise'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {item.categoryOrCadre}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.location}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <Link
                to={`/jobs?keyword=${encodeURIComponent(item.name.split(' ')[0])}`}
                className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                {item.openCount > 0 ? `${item.openCount} Open Jobs` : 'View Jobs'} <ArrowRight className="w-3 h-3" />
              </Link>

              {item.website && (
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
