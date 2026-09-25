import React, { useState } from 'react';
import { Building2, Building, Plus, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { Company, GovernmentDepartment } from '../../types';

export const AdminCompaniesPage: React.FC = () => {
  const { companies, departments } = useJobs();
  const [activeTab, setActiveTab] = useState<'companies' | 'departments'>('companies');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Employers & Public Authorities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of corporate entities, ministries, and recruitment commissions.
          </p>
        </div>
      </div>

      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'companies'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Private Companies ({companies.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'departments'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Government Departments ({departments.length})
        </button>
      </div>

      {activeTab === 'companies' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-2xl flex items-center justify-center">
                  {c.logo || '🏢'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{c.name}</h3>
                  <span className="text-xs text-emerald-600 font-semibold">{c.industry}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between text-slate-400">
                <span>{c.headquarters}</span>
                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Site ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((d) => (
            <div
              key={d.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-2xl flex items-center justify-center">
                  {d.logo || '🏛️'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{d.name}</h3>
                  <span className="text-xs text-emerald-600 font-semibold">{d.cadre} Cadre</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{d.description}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between text-slate-400">
                <span>{d.jurisdiction}</span>
                {d.officialWebsite && (
                  <a
                    href={d.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Official Portal ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
