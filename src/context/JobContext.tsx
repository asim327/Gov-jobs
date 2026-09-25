import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Job,
  Company,
  GovernmentDepartment,
  Application,
  NotificationItem,
  JobAlert,
  Article,
  SiteSettings,
  ApplicationStatus,
} from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../services/storage';
import {
  INITIAL_JOBS,
  INITIAL_COMPANIES,
  INITIAL_DEPARTMENTS,
  INITIAL_ARTICLES,
  INITIAL_NOTIFICATIONS,
  INITIAL_JOB_ALERTS,
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface JobContextType {
  jobs: Job[];
  companies: Company[];
  departments: GovernmentDepartment[];
  articles: Article[];
  savedJobIds: string[];
  applications: Application[];
  notifications: NotificationItem[];
  jobAlerts: JobAlert[];
  recentlyViewedIds: string[];
  siteSettings: SiteSettings;
  // Job Actions
  getJobById: (id: string) => Job | undefined;
  saveJobToggle: (jobId: string) => boolean; // returns true if saved, false if unsaved
  isJobSaved: (jobId: string) => boolean;
  recordJobView: (jobId: string) => void;
  // Admin Job CRUD
  createJob: (job: Omit<Job, 'id' | 'viewsCount'> | any) => Job;
  addJob: (job: Omit<Job, 'id' | 'viewsCount'> | any) => Job;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  duplicateJob: (id: string) => void;
  togglePublishJob: (id: string) => void;
  toggleFeatureJob: (id: string) => void;
  expireJobManually: (id: string) => void;
  restoreJobDeadline: (id: string, newDeadline?: string) => void;
  // Application Actions
  applyToJob: (
    job: Job,
    notes?: string,
    cvUsedId?: string,
    contactPerson?: string
  ) => boolean;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, notes?: string) => void;
  deleteApplication: (appId: string) => void;
  // Notification Actions
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  // Job Alert Actions
  createJobAlert: (alert: Omit<JobAlert, 'id' | 'createdAt'>) => void;
  toggleJobAlert: (id: string) => void;
  deleteJobAlert: (id: string) => void;
  // Companies & Depts CRUD
  createCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  createDepartment: (dept: Omit<GovernmentDepartment, 'id'>) => void;
  updateDepartment: (id: string, updates: Partial<GovernmentDepartment>) => void;
  deleteDepartment: (id: string) => void;
  // Articles CRUD
  createArticle: (article: Omit<Article, 'id'>) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  // Settings & Reset
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  resetAllDemoData: () => void;
  // Helpers
  isJobExpired: (job: Job) => boolean;
  getDeadlineStatus: (deadline: string) => 'closing_today' | 'closing_soon' | 'open' | 'expired';
  getRecommendedJobs: () => { job: Job; reason: string }[];
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'CareerHub Pakistan',
  supportEmail: 'support@careerhub.pk',
  contactNumber: '+92 51 9205000',
  announcementText: '🚨 Latest Federal and Provincial recruitment test schedules for 2026 are now open for online submission.',
  maintenanceMode: false,
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<Job[]>(() => {
    return getStorageItem<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    return getStorageItem<Company[]>(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  });

  const [departments, setDepartments] = useState<GovernmentDepartment[]>(() => {
    return getStorageItem<GovernmentDepartment[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    return getStorageItem<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    return getStorageItem<string[]>(STORAGE_KEYS.SAVED_JOBS, ['job-gov-1', 'job-priv-1']);
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    return getStorageItem<Application[]>(STORAGE_KEYS.APPLICATIONS, [
      {
        id: 'app-init-1',
        userId: 'user-demo-1',
        jobId: 'job-priv-1',
        jobTitle: 'Senior Full Stack React / Node.js Engineer',
        companyOrDept: 'Systems Limited',
        sector: 'private',
        logo: '💻',
        location: 'Lahore',
        appliedDate: '2026-09-18',
        deadline: '2026-10-24',
        status: 'Under Review',
        notes: 'Submitted customized CV highlighting 4 years of React and Node.js microservices experience.',
        interviewDate: '2026-10-02',
        contactPerson: 'Talent Acquisition Team (Systems Ltd)',
        applicationUrl: 'https://systemsltd.com/careers',
      },
    ]);
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return getStorageItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  });

  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>(() => {
    return getStorageItem<JobAlert[]>(STORAGE_KEYS.JOB_ALERTS, INITIAL_JOB_ALERTS);
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    return getStorageItem<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, ['job-gov-1', 'job-priv-1', 'job-gov-2']);
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    return getStorageItem<SiteSettings>(STORAGE_KEYS.SITE_SETTINGS, DEFAULT_SETTINGS);
  });

  // Sync state to local storage
  useEffect(() => { setStorageItem(STORAGE_KEYS.JOBS, jobs); }, [jobs]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.COMPANIES, companies); }, [companies]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.DEPARTMENTS, departments); }, [departments]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.ARTICLES, articles); }, [articles]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.SAVED_JOBS, savedJobIds); }, [savedJobIds]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.APPLICATIONS, applications); }, [applications]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.JOB_ALERTS, jobAlerts); }, [jobAlerts]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, recentlyViewedIds); }, [recentlyViewedIds]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.SITE_SETTINGS, siteSettings); }, [siteSettings]);

  // Helpers
  const isJobExpired = (job: Job): boolean => {
    if (!job.deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return job.deadline < today;
  };

  const getDeadlineStatus = (deadline: string): 'closing_today' | 'closing_soon' | 'open' | 'expired' => {
    const today = new Date().toISOString().split('T')[0];
    if (deadline < today) return 'expired';
    if (deadline === today) return 'closing_today';

    const deadlineDate = new Date(deadline).getTime();
    const todayDate = new Date(today).getTime();
    const diffDays = Math.ceil((deadlineDate - todayDate) / (1000 * 60 * 60 * 24));
    if (diffDays <= 5) return 'closing_soon';
    return 'open';
  };

  const getJobById = (id: string): Job | undefined => {
    return jobs.find((j) => j.id === id);
  };

  const isJobSaved = (jobId: string): boolean => {
    return savedJobIds.includes(jobId);
  };

  const saveJobToggle = (jobId: string): boolean => {
    let nextSaved: boolean;
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
      showToast('Job removed from saved list.', 'info');
      nextSaved = false;
    } else {
      setSavedJobIds((prev) => [...prev, jobId]);
      showToast('Job saved successfully.', 'success');
      nextSaved = true;
    }
    return nextSaved;
  };

  const recordJobView = (jobId: string) => {
    // Increment job views count
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, viewsCount: (j.viewsCount || 0) + 1 } : j))
    );
    // Add to recently viewed without duplicate
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== jobId);
      return [jobId, ...filtered].slice(0, 10);
    });
  };

  const applyToJob = (
    job: Job,
    notes: string = '',
    cvUsedId?: string,
    contactPerson?: string
  ): boolean => {
    if (!currentUser) {
      showToast('Please sign in to apply and track your applications.', 'warning');
      return false;
    }

    // Check if already applied
    const existing = applications.find(
      (a) => a.userId === currentUser.id && a.jobId === job.id
    );
    if (existing) {
      showToast('You have already added this application to your tracker.', 'info');
      return false;
    }

    const newApp: Application = {
      id: 'app-' + Date.now(),
      userId: currentUser.id,
      jobId: job.id,
      jobTitle: job.title,
      companyOrDept: job.companyOrDept,
      sector: job.sector,
      logo: job.logo,
      location: job.location,
      appliedDate: new Date().toISOString().split('T')[0],
      deadline: job.deadline,
      status: 'Applied',
      notes,
      cvUsedId,
      contactPerson: contactPerson || job.contactEmail || job.companyOrDept,
      applicationUrl: job.officialApplicationUrl,
    };

    setApplications((prev) => [newApp, ...prev]);

    // Create confirmation notification
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      userId: currentUser.id,
      title: 'Application Recorded in Tracker',
      message: `Your application record for "${job.title}" at ${job.companyOrDept} is now active.`,
      type: 'application_update',
      link: '/applications',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Application added to your tracker.', 'success');
    return true;
  };

  const updateApplicationStatus = (
    appId: string,
    status: ApplicationStatus,
    notes?: string
  ) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            status,
            notes: notes !== undefined ? notes : a.notes,
          };
        }
        return a;
      })
    );
    showToast(`Application status updated to "${status}".`, 'success');
  };

  const deleteApplication = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    showToast('Item deleted successfully.', 'info');
  };

  // Job Alerts
  const createJobAlert = (alertData: Omit<JobAlert, 'id' | 'createdAt'>) => {
    const newAlert: JobAlert = {
      ...alertData,
      id: 'alert-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setJobAlerts((prev) => [newAlert, ...prev]);
    showToast('Job alert created successfully.', 'success');
  };

  const toggleJobAlert = (id: string) => {
    setJobAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    showToast('Job alert updated.', 'info');
  };

  const deleteJobAlert = (id: string) => {
    setJobAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Job alert removed.', 'info');
  };

  // Notifications
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast('Notification deleted.', 'info');
  };

  // Admin Job Actions
  const createJob = (jobData: Omit<Job, 'id' | 'viewsCount'>): Job => {
    const newJob: Job = {
      ...jobData,
      id: 'job-custom-' + Date.now(),
      viewsCount: 0,
    };
    setJobs((prev) => [newJob, ...prev]);
    showToast('Job posting created and published.', 'success');
    return newJob;
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
    showToast('Job listing updated successfully.', 'success');
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setSavedJobIds((prev) => prev.filter((savedId) => savedId !== id));
    showToast('Job deleted successfully.', 'info');
  };

  const duplicateJob = (id: string) => {
    const original = jobs.find((j) => j.id === id);
    if (!original) return;
    const duplicated: Job = {
      ...original,
      id: 'job-copy-' + Date.now(),
      title: `${original.title} (Copy)`,
      postedDate: new Date().toISOString().split('T')[0],
      viewsCount: 0,
    };
    setJobs((prev) => [duplicated, ...prev]);
    showToast('Job duplicated successfully.', 'success');
  };

  const togglePublishJob = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          const nextState = !j.published;
          showToast(`Job ${nextState ? 'published' : 'unpublished'}.`, 'info');
          return { ...j, published: nextState };
        }
        return j;
      })
    );
  };

  const toggleFeatureJob = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          const nextState = !j.featured;
          showToast(`Job ${nextState ? 'marked as Featured' : 'unfeatured'}.`, 'info');
          return { ...j, featured: nextState };
        }
        return j;
      })
    );
  };

  const expireJobManually = (id: string) => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, deadline: yesterday } : j))
    );
    showToast('Job deadline set to expired.', 'warning');
  };

  const restoreJobDeadline = (id: string, newDeadline?: string) => {
    // Default to 30 days from now
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const targetDeadline = newDeadline || nextMonth;
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, deadline: targetDeadline } : j))
    );
    showToast(`Job restored! New deadline: ${targetDeadline}`, 'success');
  };

  // Companies & Depts CRUD
  const createCompany = (company: Omit<Company, 'id'>) => {
    const newComp: Company = { ...company, id: 'comp-' + Date.now() };
    setCompanies((prev) => [...prev, newComp]);
    showToast('Company profile added.', 'success');
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Company updated.', 'success');
  };

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    showToast('Company removed.', 'info');
  };

  const createDepartment = (dept: Omit<GovernmentDepartment, 'id'>) => {
    const newDept: GovernmentDepartment = { ...dept, id: 'dept-' + Date.now() };
    setDepartments((prev) => [...prev, newDept]);
    showToast('Government Department added.', 'success');
  };

  const updateDepartment = (id: string, updates: Partial<GovernmentDepartment>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Department updated.', 'success');
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    showToast('Department removed.', 'info');
  };

  // Articles CRUD
  const createArticle = (art: Omit<Article, 'id'>) => {
    const newArt: Article = { ...art, id: 'art-' + Date.now() };
    setArticles((prev) => [newArt, ...prev]);
    showToast('Career article published.', 'success');
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Article updated.', 'success');
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast('Article removed.', 'info');
  };

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...settings }));
    showToast('Site settings updated.', 'success');
  };

  const resetAllDemoData = () => {
    setJobs(INITIAL_JOBS);
    setCompanies(INITIAL_COMPANIES);
    setDepartments(INITIAL_DEPARTMENTS);
    setArticles(INITIAL_ARTICLES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setJobAlerts(INITIAL_JOB_ALERTS);
    setSavedJobIds(['job-gov-1', 'job-priv-1']);
    setRecentlyViewedIds(['job-gov-1', 'job-priv-1', 'job-gov-2']);
    showToast('All sample jobs and portal data have been reset to factory defaults.', 'info');
  };

  // Job Recommendation System
  const getRecommendedJobs = (): { job: Job; reason: string }[] => {
    if (!currentUser) {
      return jobs.slice(0, 6).map((j) => ({
        job: j,
        reason: 'Trending high-demand opening in Pakistan',
      }));
    }

    const matches: { job: Job; reason: string; score: number }[] = [];

    jobs.forEach((job) => {
      let score = 0;
      let matchedReason = '';

      // Check category match
      if (currentUser.preferredCategory && job.category === currentUser.preferredCategory) {
        score += 35;
        matchedReason = `Matches your ${currentUser.preferredCategory} category preference`;
      }

      // Check location match
      if (currentUser.city && (job.location.toLowerCase().includes(currentUser.city.toLowerCase()) || job.workplaceType === 'Remote')) {
        score += 25;
        if (!matchedReason) {
          matchedReason = `Located in your preferred city (${job.location})`;
        }
      }

      // Check skills match
      if (currentUser.skills && currentUser.skills.length > 0) {
        const commonSkills = job.skillsRequired.filter((skill) =>
          currentUser.skills?.some(
            (userSkill) =>
              userSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );
        if (commonSkills.length > 0) {
          score += commonSkills.length * 15;
          matchedReason = `Matches your skills: ${commonSkills.slice(0, 2).join(', ')}`;
        }
      }

      // Check job type match
      if (currentUser.preferredJobType && job.jobType === currentUser.preferredJobType) {
        score += 10;
      }

      if (score > 20) {
        matches.push({ job, reason: matchedReason, score });
      }
    });

    matches.sort((a, b) => b.score - a.score);

    if (matches.length < 4) {
      // Fill with featured jobs
      const remaining = jobs.filter(
        (j) => !matches.some((m) => m.job.id === j.id) && j.published
      );
      remaining.slice(0, 4 - matches.length).forEach((j) => {
        matches.push({
          job: j,
          reason: j.sector === 'government' ? 'Prominent Public Sector Vacancy' : 'Featured Career Opportunity',
          score: 10,
        });
      });
    }

    return matches.slice(0, 6).map(({ job, reason }) => ({ job, reason }));
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        companies,
        departments,
        articles,
        savedJobIds,
        applications,
        notifications,
        jobAlerts,
        recentlyViewedIds,
        siteSettings,
        getJobById,
        saveJobToggle,
        isJobSaved,
        recordJobView,
        createJob,
        addJob: createJob,
        updateJob,
        deleteJob,
        duplicateJob,
        togglePublishJob,
        toggleFeatureJob,
        expireJobManually,
        restoreJobDeadline,
        applyToJob,
        updateApplicationStatus,
        deleteApplication,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        createJobAlert,
        toggleJobAlert,
        deleteJobAlert,
        createCompany,
        updateCompany,
        deleteCompany,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        createArticle,
        updateArticle,
        deleteArticle,
        updateSiteSettings,
        resetAllDemoData,
        isJobExpired,
        getDeadlineStatus,
        getRecommendedJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
