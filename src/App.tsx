import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';

// Layouts
import { MainLayout } from './components/layouts/MainLayout';
import { AdminLayout } from './components/layouts/AdminLayout';

// Public & Candidate Pages
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { GovernmentJobsPage } from './pages/GovernmentJobsPage';
import { PrivateJobsPage } from './pages/PrivateJobsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CvBuilderPage } from './pages/CvBuilderPage';
import { CoverLetterGeneratorPage } from './pages/CoverLetterGeneratorPage';
import { CareerResourcesPage } from './pages/CareerResourcesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationTrackerPage } from './pages/ApplicationTrackerPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { JobAlertsPage } from './pages/JobAlertsPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/AuthPages';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCompaniesPage } from './pages/admin/AdminCompaniesPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// 404 Fallback
const NotFoundPage: React.FC = () => (
  <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
    <div className="text-6xl font-black text-emerald-600">404</div>
    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Page Not Found</h2>
    <p className="text-xs text-slate-500">
      The requested route does not exist or may have been relocated.
    </p>
    <Link
      to="/"
      className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
    >
      Return to Homepage
    </Link>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <JobProvider>
            <BrowserRouter>
              <Routes>
                {/* Public & Candidate Experience */}
                <Route element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="jobs" element={<JobsPage />} />
                  <Route path="jobs/:id" element={<JobDetailsPage />} />
                  <Route path="government-jobs" element={<GovernmentJobsPage />} />
                  <Route path="private-jobs" element={<PrivateJobsPage />} />
                  <Route path="companies" element={<CompaniesPage />} />
                  <Route path="cv-builder" element={<CvBuilderPage />} />
                  <Route path="cover-letter" element={<CoverLetterGeneratorPage />} />
                  <Route path="career-resources" element={<CareerResourcesPage />} />
                  <Route path="career-resources/:id" element={<ArticleDetailPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="applications" element={<ApplicationTrackerPage />} />
                  <Route path="saved-jobs" element={<SavedJobsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="job-alerts" element={<JobAlertsPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* Administration Console */}
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="jobs" element={<AdminJobsPage />} />
                  <Route path="applications" element={<AdminApplicationsPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="companies" element={<AdminCompaniesPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </JobProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
