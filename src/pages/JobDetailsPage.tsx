import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Building,
  Briefcase,
  GraduationCap,
  Calendar,
  Bookmark,
  Share2,
  Printer,
  Send,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Eye,
  Clock,
  Building2,
  Award,
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { JobBadge } from '../components/common/JobBadge';
import { ApplyModal } from '../components/common/ApplyModal';
import { ShareModal } from '../components/common/ShareModal';
import { JobCard } from '../components/common/JobCard';
import { Job } from '../types';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { getJobById, isJobSaved, saveJobToggle, recordJobView, getDeadlineStatus, isJobExpired, jobs } = useJobs();
  const { isAuthenticated } = useAuth();

  const [job, setJob] = useState<Job | undefined>(undefined);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getJobById(id);
      setJob(found);
      if (found) {
        recordJobView(found.id);
      }
    }
  }, [id, getJobById, recordJobView]);

  useEffect(() => {
    // If URL has ?apply=true, open modal automatically
    if (searchParams.get('apply') === 'true' && job) {
      if (isAuthenticated) {
        setApplyModalOpen(true);
      } else {
        navigate(`/login?redirect=/jobs/${job.id}?apply=true`);
      }
    }
  }, [searchParams, job, isAuthenticated, navigate]);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Job Not Found</h2>
        <p className="text-sm text-slate-500">The job posting you are looking for may have been archived or removed.</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Available Jobs
        </Link>
      </div>
    );
  }

  const saved = isJobSaved(job.id);
  const deadlineStatus = getDeadlineStatus(job.deadline);
  const expired = isJobExpired(job);

  const relatedJobs = jobs
    .filter((j) => j.id !== job.id && (j.category === job.category || j.sector === job.sector) && j.published)
    .slice(0, 3);

  const handleApplyClick = () => {
    if (expired) return;
    if (!isAuthenticated) {
      navigate(`/login?redirect=/jobs/${job.id}?apply=true`);
      return;
    }
    setApplyModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500 no-print">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </button>

        <div className="flex items-center gap-1">
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link to={job.sector === 'government' ? '/government-jobs' : '/private-jobs'} className="hover:underline capitalize">
            {job.sector} Jobs
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs">{job.title}</span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-3xl sm:text-4xl shadow-xs shrink-0">
              {job.logo || (job.sector === 'government' ? '🏛️' : '💼')}
            </div>
            <div className="space-y-1">
              <JobBadge
                sector={job.sector}
                bpsGrade={job.bpsGrade}
                workplaceType={job.workplaceType}
                deadlineStatus={deadlineStatus}
                featured={job.featured}
                urgent={job.urgent}
              />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-200 font-bold">
                  <Building className="w-4 h-4 text-emerald-600" />
                  {job.companyOrDept}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location}, {job.province}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  {job.viewsCount || 1} Views
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 no-print">
            <button
              onClick={() => saveJobToggle(job.id)}
              className={`p-3 rounded-xl border transition-colors ${
                saved
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={saved ? 'Remove bookmark' : 'Bookmark job'}
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Share job opportunity"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handlePrint}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print official circular"
            >
              <Printer className="w-5 h-5" />
            </button>

            <button
              onClick={handleApplyClick}
              disabled={expired}
              className={`flex-1 md:flex-initial px-6 py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                expired
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
              {expired ? 'Deadline Expired' : 'Apply Now'}
            </button>
          </div>
        </div>

        {/* Quick Spec Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 block">Remuneration</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
              {job.salaryFormatted}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 block">Experience</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
              {job.experienceYears === 0 ? 'Fresh Graduates' : `${job.experienceYears}+ Years`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 block">Education</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
              {job.educationRequired.split('/')[0]}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 block">Application Deadline</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block truncate">
              {job.deadline}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 block">Gender Eligibility</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
              {job.genderEligibility}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 block">Employment Type</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
              {job.jobType}
            </span>
          </div>
        </div>
      </div>

      {/* Main Details Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Description, Requirements, Application Steps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Government Public Notice Disclaimer Box */}
          {job.sector === 'government' && (
            <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4" />
                Gazetted Public Sector Circular
              </div>
              <p className="leading-relaxed">
                This recruitment is regulated by the respective civil service rules and Federal/Provincial recruitment commissions.
                Ensure you hold a valid National Identity Card (CNIC), verified domicile certificate, and original educational transcripts before applying.
              </p>
            </div>
          )}

          {/* Job Overview & Description */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Job Overview & Purpose
            </h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Key Duties & Responsibilities
              </h2>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Required Skills */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              Candidate Eligibility & Qualifications
            </h2>

            {/* Educational credentials */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Educational Qualification:
              </span>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {job.educationRequired}
              </p>
            </div>

            {/* Skills */}
            {job.skillsRequired && job.skillsRequired.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  Required Competencies & Skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, idx) => (
                    <Link
                      key={idx}
                      to={`/jobs?keyword=${encodeURIComponent(skill)}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      {skill}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* How to Apply / Official Procedure */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Application Guidelines & Procedure
            </h2>

            {job.sector === 'government' ? (
              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Deposit Challan Fee:</strong> Download Challan form from the commission portal and deposit {job.challanFee || 'applicable fee'} in National Bank of Pakistan (NBP) or State Bank under Head of Account.
                  </li>
                  <li>
                    <strong>Online Submission:</strong> Visit the official web portal ({job.companyOrDept}) and fill in CNIC, academic grades, and Challan deposit details before <strong>{job.deadline}</strong>.
                  </li>
                  <li>
                    <strong>Document Verification:</strong> Shortlisted candidates will be invited for written descriptive test and document scrutiny. Keep attested copies of degrees and domicile ready.
                  </li>
                </ol>

                {job.officialApplicationUrl && (
                  <div className="pt-3">
                    <a
                      href={job.officialApplicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Open Official Application Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  Interested candidates matching the credentials above should submit their updated resume through the CareerHub portal or via the employer's official careers link.
                </p>
                {job.officialApplicationUrl && (
                  <a
                    href={job.officialApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Apply on Company Career Website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Meta details, Quota & Organization info */}
        <div className="space-y-6">
          {/* Government Specific Specs Card */}
          {job.sector === 'government' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Public Service Metrics
              </h3>

              <div className="space-y-3 text-xs">
                {job.bpsGrade && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Pay Scale</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{job.bpsGrade}</span>
                  </div>
                )}

                {job.ageLimit && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Age Limit</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{job.ageLimit}</span>
                  </div>
                )}

                {job.challanFee && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Treasury Challan</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{job.challanFee}</span>
                  </div>
                )}

                {job.quotaAllocation && (
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-500 block">Domicile / Quota Seats:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      {job.quotaAllocation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Organization Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              About The Organization
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl border border-slate-200 dark:border-slate-700">
                {job.logo || '🏢'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{job.companyOrDept}</h4>
                <span className="text-xs text-slate-500 block">{job.location}, Pakistan</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Official vacancies and notifications verified through published gazettes or authorized career links.
            </p>

            {job.contactEmail && (
              <div className="text-xs text-slate-500">
                <span>Inquiries: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{job.contactEmail}</span>
              </div>
            )}
          </div>

          {/* Application Tracker Fast-Action */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-lg space-y-3 no-print">
            <h3 className="font-bold text-base">Track this Application</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Log this post into your personal CareerHub pipeline to record interview dates, preparation notes, and status updates.
            </p>
            <button
              onClick={handleApplyClick}
              disabled={expired}
              className="w-full py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md hover:bg-emerald-50 transition-colors"
            >
              {expired ? 'Deadline Passed' : 'Add to Application Tracker'}
            </button>
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      {relatedJobs.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6 no-print">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Similar Career Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedJobs.map((relJob) => (
              <JobCard
                key={relJob.id}
                job={relJob}
                onApplyClick={() => navigate(`/jobs/${relJob.id}?apply=true`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />

      <ShareModal
        title={job.title}
        url={window.location.href}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
};
