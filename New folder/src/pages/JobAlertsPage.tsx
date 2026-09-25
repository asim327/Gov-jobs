import React, { useState } from 'react';
import { BellRing, Plus, Trash2, Power, Check, AlertCircle } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { PAKISTAN_CITIES, JOB_CATEGORIES } from '../data/mockData';
import { JobAlert, JobSector } from '../types';

export const JobAlertsPage: React.FC = () => {
  const { jobAlerts, createJobAlert, toggleJobAlert, deleteJobAlert } = useJobs();
  const { currentUser } = useAuth();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [sector, setSector] = useState<'all' | JobSector>('all');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [bpsGrade, setBpsGrade] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createJobAlert({
      userId: currentUser?.id || 'user-demo-1',
      name: name.trim(),
      sector,
      category: category || undefined,
      location: location || undefined,
      bpsGrade: bpsGrade || undefined,
      active: true,
    });

    setName('');
    setCategory('');
    setLocation('');
    setBpsGrade('');
    setCreateModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Subscription Feed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Job Alerts ({jobAlerts.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Receive real-time notifications whenever matching vacancies are published.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Alert
        </button>
      </div>

      {jobAlerts.length > 0 ? (
        <div className="space-y-3">
          {jobAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {alert.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      alert.active
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {alert.active ? 'Active' : 'Paused'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                    Sector: {alert.sector}
                  </span>
                  {alert.category && <span>• Category: {alert.category}</span>}
                  {alert.location && <span>• City: {alert.location}</span>}
                  {alert.bpsGrade && <span>• Scale: {alert.bpsGrade}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleJobAlert(alert.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    alert.active
                      ? 'border-emerald-200 dark:border-emerald-800 text-emerald-700 hover:bg-emerald-50'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {alert.active ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteJobAlert(alert.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BellRing className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-base">No active job alerts configured</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create an alert for your preferred province, BPS scale, or industry to get notified as soon as recruitment drives open.
          </p>
        </div>
      )}

      {/* Create Alert Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Create Tailored Job Alert
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Alert Name / Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Islamabad IT & React Vacancies"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Target Sector</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="all">All Sectors (Govt & Private)</option>
                  <option value="government">Government & Public Sector</option>
                  <option value="private">Private Enterprises</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Category (Optional)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="">Any Category</option>
                  {JOB_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">City / Region (Optional)</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="">Any City</option>
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {sector !== 'private' && (
                <div>
                  <label className="font-bold block mb-1">Government Scale (Optional)</label>
                  <select
                    value={bpsGrade}
                    onChange={(e) => setBpsGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="">Any Scale</option>
                    <option value="BPS-16">BPS-16</option>
                    <option value="BPS-17">BPS-17 (Gazetted)</option>
                    <option value="BPS-18">BPS-18</option>
                    <option value="BPS-19">BPS-19</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
