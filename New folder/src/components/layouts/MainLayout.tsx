import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { ApplyModal } from '../common/ApplyModal';
import { useJobs } from '../../context/JobContext';
import { Job } from '../../types';
import { Megaphone, X } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { siteSettings } = useJobs();
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [activeApplyJob, setActiveApplyJob] = useState<Job | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Announcement ticker */}
      {siteSettings.announcementText && !announcementDismissed && (
        <div className="bg-emerald-700 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2 max-w-7xl mx-auto overflow-hidden">
            <Megaphone className="w-4 h-4 shrink-0 animate-bounce" />
            <span className="truncate">{siteSettings.announcementText}</span>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="p-1 rounded-md hover:bg-emerald-800 transition-colors shrink-0"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <Header />

      {/* Page Content */}
      <main className="flex-1">
        <Outlet context={{ openApplyModal: (job: Job) => setActiveApplyJob(job) }} />
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Global Apply Modal */}
      <ApplyModal
        job={activeApplyJob}
        isOpen={!!activeApplyJob}
        onClose={() => setActiveApplyJob(null)}
      />
    </div>
  );
};
