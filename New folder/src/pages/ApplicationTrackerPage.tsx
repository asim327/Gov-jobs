import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  ExternalLink,
  Kanban,
  List,
  Plus,
  CheckCircle2,
  XCircle,
  Building,
  MapPin,
  FileText,
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { ApplicationStatus, Application } from '../types';

const STAGES: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Accepted',
  'Rejected',
];

export const ApplicationTrackerPage: React.FC = () => {
  const { applications, updateApplicationStatus, deleteApplication } = useJobs();
  const { currentUser } = useAuth();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('Applied');

  const myApplications = applications.filter((a) => a.userId === (currentUser?.id || 'user-demo-1'));

  const handleEditClick = (app: Application) => {
    setEditingApp(app);
    setEditNotes(app.notes || '');
    setEditStatus(app.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    updateApplicationStatus(editingApp.id, editStatus, editNotes);
    setEditingApp(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Pipeline Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Application Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track interview dates, exam preparation notes, and status changes for your job applications.
          </p>
        </div>

        {/* View mode toggle & Action */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <Link
            to="/jobs"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Find More Jobs
          </Link>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageApps = myApplications.filter((a) => a.status === stage);
            return (
              <div
                key={stage}
                className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 flex flex-col min-w-[220px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{stage}</span>
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px]">
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="space-y-3 flex-1">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-2.5 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                          {app.jobTitle}
                        </h4>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="text-slate-400 hover:text-rose-500 shrink-0"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <Building className="w-3 h-3" />
                          <span className="truncate">{app.companyOrDept}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{app.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>Applied: {app.appliedDate}</span>
                        </div>
                      </div>

                      {app.notes && (
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-2">
                          "{app.notes}"
                        </div>
                      )}

                      {/* Quick Move Status / Edit */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                          }
                          className="text-[11px] font-semibold bg-transparent border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-hidden"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              Move: {s}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleEditClick(app)}
                          className="text-emerald-600 hover:underline text-[11px] font-bold"
                        >
                          Notes
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageApps.length === 0 && (
                    <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Position & Organization</th>
                  <th className="p-4">Sector</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {myApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {app.jobTitle}
                      </div>
                      <div className="text-slate-500 font-semibold">{app.companyOrDept} • {app.location}</div>
                    </td>
                    <td className="p-4 capitalize">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        app.sector === 'government' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                      }`}>
                        {app.sector}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{app.appliedDate}</td>
                    <td className="p-4">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                        }
                        className="text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">{app.notes || '—'}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(app)}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="text-rose-500 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Notes Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              Update Application Record
            </h3>
            <p className="text-xs text-slate-500">
              {editingApp.jobTitle} at {editingApp.companyOrDept}
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Status Stage</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Preparation & Interview Notes</label>
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record roll number slip receipt, test date, syllabus notes..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
