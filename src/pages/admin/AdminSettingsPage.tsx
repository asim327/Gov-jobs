import React, { useState } from 'react';
import { Settings, RefreshCw, Download, Upload, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';
import { resetAllStorageToDefaults } from '../../services/storage';

export const AdminSettingsPage: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useJobs();
  const { showToast } = useToast();

  const [siteName, setSiteName] = useState(siteSettings.siteName);
  const [supportEmail, setSupportEmail] = useState(siteSettings.supportEmail);
  const [supportPhone, setSupportPhone] = useState(siteSettings.supportPhone);
  const [showAnnouncement, setShowAnnouncement] = useState(siteSettings.showAnnouncement);
  const [announcementText, setAnnouncementText] = useState(siteSettings.announcementText);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteName,
      supportEmail,
      supportPhone,
      showAnnouncement,
      announcementText,
    });
    showToast('Platform settings saved successfully.', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo jobs, users, and applications to initial state?')) {
      resetAllStorageToDefaults();
      showToast('Database reset to fresh Pakistani demo seed data. Reloading...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const handleExportData = () => {
    const data = {
      jobs: localStorage.getItem('careerhub_jobs'),
      users: localStorage.getItem('careerhub_users'),
      applications: localStorage.getItem('careerhub_applications'),
      companies: localStorage.getItem('careerhub_companies'),
      departments: localStorage.getItem('careerhub_departments'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careerhub_pakistan_backup_${Date.now()}.json`;
    a.click();
    showToast('System data backup exported.', 'success');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Portal Configuration & Maintenance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize platform branding, official announcements, and manage LocalStorage demo persistence.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding & Contact Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Platform Identity & Support Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Platform Brand Title</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Official Inquiries Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold block mb-1">Toll-Free Helpline / UAN</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100">
              National Announcement Ribbon
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
              <input
                type="checkbox"
                checked={showAnnouncement}
                onChange={(e) => setShowAnnouncement(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Display Banner</span>
            </label>
          </div>

          <div className="text-xs">
            <label className="font-bold block mb-1">Announcement Copy</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Save Portal Settings
          </button>
        </div>
      </form>

      {/* Demo Maintenance & Reset */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 text-rose-600">
          <ShieldAlert className="w-4 h-4" />
          Maintenance & Storage Diagnostics
        </h3>
        <p className="text-xs text-slate-500">
          CareerHub stores all jobs, users, and tracking pipelines securely in your browser's LocalStorage. You can backup or reset to default mock records anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Data Backup (JSON)
          </button>

          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset to Initial Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
