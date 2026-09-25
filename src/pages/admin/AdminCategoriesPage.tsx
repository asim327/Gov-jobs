import React, { useState } from 'react';
import { Tag, Plus, Trash2, Award, Globe } from 'lucide-react';
import { JOB_CATEGORIES, BPS_SCALES, PROVINCES } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const AdminCategoriesPage: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<string[]>(JOB_CATEGORIES);
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim() || categories.includes(newCat.trim())) return;
    setCategories([...categories, newCat.trim()]);
    setNewCat('');
    showToast('New industry category added to schema.', 'success');
  };

  const handleRemove = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
    showToast(`Removed category ${cat}.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Taxonomies & Classification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage job categories, civil service cadres, and government pay scales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Categories */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            Industry Categories ({categories.length})
          </h3>

          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Add industry category..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
            >
              Add
            </button>
          </form>

          <div className="space-y-2">
            {categories.map((c) => (
              <div
                key={c}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">{c}</span>
                <button
                  onClick={() => handleRemove(c)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Civil Service BPS Scales & Cadres Reference */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Standard BPS Pay Scales
            </h3>
            <div className="flex flex-wrap gap-2">
              {BPS_SCALES.map((bps) => (
                <span
                  key={bps}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800"
                >
                  {bps}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              Provinces & Quota Jurisdictions
            </h3>
            <div className="flex flex-wrap gap-2">
              {PROVINCES.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
