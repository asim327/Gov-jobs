import React, { useState } from 'react';
import { Send, Search, Trash2, CheckCircle2, User, Building, Clock, MapPin } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { ApplicationStatus } from '../../types';

export const AdminApplicationsPage: React.FC = () => {
  const { applications, updateApplicationStatus, deleteApplication } = useJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredApps = applications.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.jobTitle.toLowerCase().includes(q) ||
        app.companyOrDept.toLowerCase().includes(q) ||
        app.applicantName?.toLowerCase().includes(q) ||
        app.applicantEmail?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Candidate Applications ({applications.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review applicant submissions, notes, and progress stages across all tracked posts.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, job, email..."
            className="w-full bg-transparent text-xs font-medium focus:outline-hidden"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold w-full sm:w-auto"
        >
          <option value="all">All Stages</option>
          <option value="Applied">Applied</option>
          <option value="Under Review">Under Review</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Target Job & Dept</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      {app.applicantName}
                    </span>
                    <span className="text-slate-500">{app.applicantEmail}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      {app.jobTitle}
                    </span>
                    <span className="text-slate-500">{app.companyOrDept}</span>
                  </td>
                  <td className="py-3 px-4 capitalize font-semibold">{app.sector}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{app.appliedDate}</td>
                  <td className="py-3 px-4">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                      }
                      className="text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteApplication(app.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
