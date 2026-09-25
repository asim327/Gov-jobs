import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Send,
  Building2,
  Building,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { jobs, companies, departments, applications, togglePublishJob, toggleFeatureJob, deleteJob } = useJobs();
  const { users } = useAuth();

  const totalJobs = jobs.length;
  const publishedJobs = jobs.filter((j) => j.published).length;
  const govJobs = jobs.filter((j) => j.sector === 'government').length;
  const privJobs = jobs.filter((j) => j.sector === 'private').length;
  const totalViews = jobs.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            System Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry and management controls for CareerHub Pakistan.
          </p>
        </div>

        <Link
          to="/admin/jobs?create=true"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Publish New Vacancy
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Vacancies</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">{totalJobs}</div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-emerald-600 font-bold">{publishedJobs} active</span> • {govJobs} Govt / {privJobs} Private
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Registered Users</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">{users.length}</div>
          <div className="text-xs text-slate-500 mt-1">
            Candidates & Administrators
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Logged Applications</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">{applications.length}</div>
          <div className="text-xs text-slate-500 mt-1">
            Across all candidate trackers
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Organizations</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">
            {companies.length + departments.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {departments.length} Commissions / {companies.length} Firms
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/jobs"
          className="p-5 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100/50 transition-colors flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Manage Job Circulars</h3>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400 mt-0.5">Edit, expire, or feature vacancies</p>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </Link>

        <Link
          to="/admin/applications"
          className="p-5 rounded-3xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/80 hover:bg-sky-100/50 transition-colors flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-sm text-sky-900 dark:text-sky-200">Review Applications</h3>
            <p className="text-xs text-sky-700/80 dark:text-sky-400 mt-0.5">Inspect applicant tracker submissions</p>
          </div>
          <ArrowRight className="w-4 h-4 text-sky-600" />
        </Link>

        <Link
          to="/admin/users"
          className="p-5 rounded-3xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/80 hover:bg-purple-100/50 transition-colors flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-sm text-purple-900 dark:text-purple-200">User Administration</h3>
            <p className="text-xs text-purple-700/80 dark:text-purple-400 mt-0.5">Manage permissions and roles</p>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-600" />
        </Link>
      </div>

      {/* Recent Jobs Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Recent Job Postings
          </h2>
          <Link to="/admin/jobs" className="text-xs font-bold text-emerald-600 hover:underline">
            View All ({jobs.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-y border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
              <tr>
                <th className="py-3 px-4">Title & Organization</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentJobs.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      {j.title}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {j.companyOrDept} • {j.location}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize font-semibold">
                    {j.sector === 'government' ? `Govt (${j.bpsGrade || 'Scale'})` : 'Private'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                    {j.deadline}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        j.published
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {j.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => togglePublishJob(j.id)}
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600"
                    >
                      {j.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => toggleFeatureJob(j.id)}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700"
                    >
                      {j.featured ? '★ Featured' : '☆ Feature'}
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
