import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Lock, Mail, User, Phone, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PAKISTAN_CITIES } from '../data/mockData';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('hamza.tariq@example.pk');
  const [password, setPassword] = useState('demo12345');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      showToast('Signed in successfully!', 'success');
      navigate(redirect);
    } else {
      showToast('Account not found or disabled. Please try demo credentials.', 'error');
    }
  };

  const handleQuickDemoUser = () => {
    loginAsDemoUser();
    showToast('Signed in as Demo Candidate (Hamza Tariq).', 'success');
    navigate(redirect);
  };

  const handleQuickDemoAdmin = () => {
    loginAsDemoAdmin();
    showToast('Signed in as Portal Administrator.', 'success');
    navigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Sign In to CareerHub
          </h1>
          <p className="text-xs text-slate-500">
            Access your application pipeline, saved vacancies, and CV builder.
          </p>
        </div>

        {/* Demo Fast-Action Buttons */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4" /> Quick One-Click Demo Access
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
            Test candidate features or admin features instantly:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleQuickDemoUser}
              className="py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
            >
              Demo Candidate
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="py-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-black transition-colors"
            >
              Demo Admin Portal
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1">Email Address</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Password</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <Link to="/forgot-password" className="text-emerald-600 hover:underline">
              Forgot password?
            </Link>
            <span className="text-slate-400">Simulation environment</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            Sign In to Account
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const success = register(name, email, phone, city);
    if (success) {
      showToast('Registration successful! Welcome to CareerHub.', 'success');
      navigate('/dashboard');
    } else {
      showToast('An account with this email already exists.', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Create Candidate Account
          </h1>
          <p className="text-xs text-slate-500">
            Join thousands of Pakistani professionals advancing their careers.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ayesha Siddiqui"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.pk"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Mobile Number (WhatsApp)</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 0000000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">City / Region</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              {PAKISTAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1">Create Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors mt-2"
          >
            Complete Registration
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    showToast('Password reset link simulated and sent.', 'info');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-4">
        <h2 className="text-xl font-bold">Reset Password</h2>
        {submitted ? (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              A simulation reset email has been dispatched to <strong>{email}</strong>. For this demonstration environment, you can sign in directly using the Demo accounts.
            </p>
            <Link
              to="/login"
              className="block w-full text-center py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-slate-500">
              Enter your registered email address to receive password recovery instructions.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.pk"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
            >
              Send Recovery Email
            </button>
            <div className="text-center pt-2">
              <Link to="/login" className="text-slate-500 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
