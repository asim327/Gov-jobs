import React, { useState } from 'react';
import {
  X,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Building,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { applyToJob } = useJobs();

  const [notes, setNotes] = useState('');
  const [selectedCv, setSelectedCv] = useState('careerhub-default-cv');
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen || !job || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const success = applyToJob(
      job,
      notes,
      selectedCv,
      job.contactEmail || job.companyOrDept
    );

    setSubmitting(false);
    if (success) {
      setSubmittedSuccess(true);
    }
  };

  const handleOfficialRedirect = () => {
    if (job.officialApplicationUrl) {
      window.open(job.officialApplicationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClose = () => {
    setSubmittedSuccess(false);
    setNotes('');
    setAcceptedDisclaimer(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Application Tracker Submission
            </span>
            <h2 className="text-xl font-bold mt-1">{job.title}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1 font-medium">
                <Building className="w-3.5 h-3.5" />
                {job.companyOrDept}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          {submittedSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold">Application Added to Tracker!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Your application entry has been safely logged in your CareerHub Application Tracker. You can monitor interview milestones, add interview notes, and log replies.
              </p>

              {job.officialApplicationUrl && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-left text-xs text-amber-900 dark:text-amber-200 space-y-2 mt-4">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Important: Official Submission Required
                  </div>
                  <p>
                    {job.sector === 'government'
                      ? 'Government recruitment authorities (FPSC, PPSC, Federal Ministries) require direct submission through their official website along with bank treasury challan.'
                      : 'This employer accepts official applications via their corporate career portal.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleOfficialRedirect}
                    className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
                  >
                    Continue to Official Application Portal <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Official Source Notice if Government */}
              {job.sector === 'government' && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                    Official Government Vacancy Notice
                  </div>
                  <p>
                    CareerHub Pakistan is an independent informational and preparation portal. Government jobs require submission via the official commission or department channel. Logging this job will keep it in your pipeline tracker.
                  </p>
                </div>
              )}

              {/* Applicant Profile Snapshot */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Applicant Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs block">Full Name</span>
                    <span className="font-semibold">{currentUser.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Email Address</span>
                    <span className="font-semibold">{currentUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Phone Number</span>
                    <span className="font-semibold">{currentUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Location</span>
                    <span className="font-semibold">{currentUser.city}</span>
                  </div>
                </div>
              </div>

              {/* Select CV */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Select Resume / CV
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedCv === 'careerhub-default-cv'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cv"
                      value="careerhub-default-cv"
                      checked={selectedCv === 'careerhub-default-cv'}
                      onChange={() => setSelectedCv('careerhub-default-cv')}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        CareerHub Profile CV
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        Generated from your profile credentials and skills
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedCv === 'custom-cv-upload'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cv"
                      value="custom-cv-upload"
                      checked={selectedCv === 'custom-cv-upload'}
                      onChange={() => setSelectedCv('custom-cv-upload')}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm">
                        <FileText className="w-4 h-4 text-sky-600" />
                        Custom Uploaded Resume
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        {currentUser.name.replace(/\s+/g, '_')}_CV.pdf (Ready)
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Application Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Application Tracker Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Deposited Challan in NBP F-6 branch on Sept 20, prepared for descriptive test..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Required Documents Checklist */}
              {job.requiredDocuments && job.requiredDocuments.length > 0 && (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Required Credentials & Documents Checklist:
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                    {job.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  required
                  checked={acceptedDisclaimer}
                  onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  I understand that this action logs my application in my personal tracker. If this vacancy requires an external or official commission submission, I will complete the respective official form before the deadline (<strong>{job.deadline}</strong>).
                </span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !acceptedDisclaimer}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? 'Recording...' : 'Add to Application Tracker'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
