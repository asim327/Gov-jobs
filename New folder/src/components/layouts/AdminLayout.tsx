import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Building,
  Tags,
  FileText,
  Settings,
  BellRing,
  ArrowLeft,
  Menu,
  X,
  ShieldAlert,
  Sun,
  Moon,
  Send,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useJobs } from '../../context/JobContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminLayout: React.FC = () => {
  const { currentUser, isAdmin, loginAsDemoAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetAllDemoData } = useJobs();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Job Listings', path: '/admin/jobs', icon: Briefcase },
    { name: 'Applications', path: '/admin/applications', icon: Send },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Companies', path: '/admin/companies', icon: Building2 },
    { name: 'Govt Departments', path: '/admin/departments', icon: Building },
    { name: 'Categories & Taxonomies', path: '/admin/categories', icon: Tags },
    { name: 'Job Alerts', path: '/admin/alerts', icon: BellRing },
    { name: 'Career Articles', path: '/admin/articles', icon: FileText },
    { name: 'Portal Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // If not logged in as admin, show demo switch banner
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Admin Portal Access Restricted</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You are currently browsing as <strong>{currentUser ? currentUser.name : 'Guest'}</strong> ({currentUser ? currentUser.role : 'unauthenticated'}).
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 border border-slate-200 dark:border-slate-700">
            For demonstration purposes, you can switch immediately to the Demo Admin account with one click:
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                loginAsDemoAdmin();
                navigate('/admin');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              Switch to Demo Admin Account
            </button>
            <Link
              to="/"
              className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
                Career<span className="text-emerald-600">Hub</span>
              </span>
              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                ADMIN
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Administration
          </div>
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Sample Data
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Exit to Public Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline-block">
              CareerHub Pakistan Management Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                AD
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-bold block leading-tight">{currentUser?.name}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        isOpen={resetConfirmOpen}
        title="Reset All Sample Data?"
        message="This will restore all default jobs, Pakistani government vacancies, companies, departments, and user applications to the original factory mock dataset."
        confirmLabel="Reset Everything"
        onConfirm={() => {
          resetAllDemoData();
          setResetConfirmOpen(false);
        }}
        onCancel={() => setResetConfirmOpen(false)}
      />
    </div>
  );
};
