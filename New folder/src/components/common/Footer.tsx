import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Mail, Phone, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { useJobs } from '../../context/JobContext';

export const Footer: React.FC = () => {
  const { siteSettings } = useJobs();

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Top Banner Notice */}
      <div className="bg-emerald-950/80 border-b border-emerald-900/50 py-3 px-4 text-xs text-center text-emerald-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Official Source Notice:</strong> CareerHub Pakistan provides verified public notice aggregations and career planning tools. Government jobs must be completed via official commission channels (FPSC, PPSC, SPSC, KPPSC, BPSC).
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Career<span className="text-emerald-400">Hub</span> Pakistan
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Connecting qualified Pakistani professionals, engineers, educators, and civil service aspirants with leading public sector departments and private enterprises across all provinces.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Islamabad Capital Territory, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteSettings.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteSettings.contactNumber}</span>
              </div>
            </div>
          </div>

          {/* Government Jobs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Government Jobs
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/government-jobs?cadre=Federal" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  Federal Govt Jobs (FPSC)
                </Link>
              </li>
              <li>
                <Link to="/government-jobs?cadre=Punjab" className="hover:text-emerald-400 transition-colors">
                  Punjab Govt Jobs (PPSC)
                </Link>
              </li>
              <li>
                <Link to="/government-jobs?cadre=Sindh" className="hover:text-emerald-400 transition-colors">
                  Sindh Govt Jobs (SPSC)
                </Link>
              </li>
              <li>
                <Link to="/government-jobs?cadre=KPK" className="hover:text-emerald-400 transition-colors">
                  KPK Govt Jobs (KPPSC)
                </Link>
              </li>
              <li>
                <Link to="/government-jobs?bps=BPS-17" className="hover:text-emerald-400 transition-colors">
                  BPS-17 Gazetted Posts
                </Link>
              </li>
              <li>
                <Link to="/government-jobs?bps=BPS-18" className="hover:text-emerald-400 transition-colors">
                  BPS-18 Scale Posts
                </Link>
              </li>
            </ul>
          </div>

          {/* Private Sector & Cities */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Private Careers
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/jobs?category=Software%20%26%20IT" className="hover:text-emerald-400 transition-colors">
                  Software & IT Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Banking%20%26%20Finance" className="hover:text-emerald-400 transition-colors">
                  Banking & Islamic Finance
                </Link>
              </li>
              <li>
                <Link to="/jobs?category=Engineering%20%26%20Technical" className="hover:text-emerald-400 transition-colors">
                  Engineering & Technical
                </Link>
              </li>
              <li>
                <Link to="/jobs?location=Islamabad" className="hover:text-emerald-400 transition-colors">
                  Jobs in Islamabad & Rawalpindi
                </Link>
              </li>
              <li>
                <Link to="/jobs?location=Lahore" className="hover:text-emerald-400 transition-colors">
                  Jobs in Lahore
                </Link>
              </li>
              <li>
                <Link to="/jobs?location=Karachi" className="hover:text-emerald-400 transition-colors">
                  Jobs in Karachi
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Career Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/cv-builder" className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold text-emerald-400">
                  CV Builder (3 Templates) <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/cover-letter" className="hover:text-emerald-400 transition-colors">
                  Cover Letter Generator
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-emerald-400 transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/career-resources" className="hover:text-emerald-400 transition-colors">
                  Career Guides & Salary Benchmarks
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-emerald-400 transition-colors">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors text-slate-500">
                  Admin Demo Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CareerHub Pakistan. Built for Pakistani Job Seekers & Aspirants.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Pakistan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
