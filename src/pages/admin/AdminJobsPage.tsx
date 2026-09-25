import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Calendar,
} from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Job, JobSector, WorkplaceType, JobType } from '../../types';
import { PAKISTAN_CITIES, JOB_CATEGORIES, BPS_SCALES } from '../../data/mockData';

export const AdminJobsPage: React.FC = () => {
  const {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    togglePublishJob,
    toggleFeatureJob,
    duplicateJob,
  } = useJobs();

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<'all' | 'government' | 'private'>('all');
  const [publishFilter, setPublishFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(searchParams.get('create') === 'true');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    companyOrDept: '',
    sector: 'government',
    location: 'Islamabad',
    province: 'Federal',
    category: 'Administration & Management',
    jobType: 'Full Time',
    workplaceType: 'On-site',
    salaryFormatted: 'PKR 85,000 - 110,000',
    educationRequired: "Bachelor's / Master's degree in relevant discipline",
    experienceYears: 2,
    genderEligibility: 'Both Male & Female',
    deadline: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
    description: '',
    bpsGrade: 'BPS-17',
    departmentCadre: 'Federal',
    challanFee: 'Rs. 300/-',
    ageLimit: '22 - 30 Years + 5 Years General Relaxation',
    quotaAllocation: 'Merit: 1, Punjab: 2, Sindh (R): 1',
    published: true,
    featured: false,
    urgent: false,
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (sectorFilter !== 'all' && j.sector !== sectorFilter) return false;
      if (publishFilter === 'published' && !j.published) return false;
      if (publishFilter === 'draft' && j.published) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          j.title.toLowerCase().includes(q) ||
          j.companyOrDept.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.bpsGrade?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [jobs, sectorFilter, publishFilter, searchQuery]);

  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      companyOrDept: '',
      sector: 'government',
      location: 'Islamabad',
      province: 'Federal',
      category: 'Administration & Management',
      jobType: 'Full Time',
      workplaceType: 'On-site',
      salaryFormatted: 'PKR 85,000 - 110,000',
      educationRequired: "Bachelor's / Master's degree in relevant discipline",
      experienceYears: 2,
      genderEligibility: 'Both Male & Female',
      deadline: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
      description: '',
      bpsGrade: 'BPS-17',
      departmentCadre: 'Federal',
      challanFee: 'Rs. 300/-',
      ageLimit: '22 - 30 Years + 5 Years General Relaxation',
      quotaAllocation: 'Merit: 1, Punjab: 2',
      published: true,
      featured: false,
      urgent: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({ ...job });
    setModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.companyOrDept) return;

    if (editingJob) {
      updateJob(editingJob.id, formData);
    } else {
      addJob(formData as any);
    }
    setModalOpen(false);
  };

  const handleExtendDeadline = (job: Job) => {
    const nextDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    updateJob(job.id, { deadline: nextDate });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Vacancies & Circulars ({jobs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, update, toggle visibility, and configure public sector & corporate listings.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job title, dept, BPS..."
            className="w-full bg-transparent text-xs font-medium focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto text-xs font-bold">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            <option value="all">All Sectors</option>
            <option value="government">Government Only</option>
            <option value="private">Private Only</option>
          </select>

          <select
            value={publishFilter}
            onChange={(e) => setPublishFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Designation & Org</th>
                <th className="py-3 px-4">Sector / Scale</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                      {job.title}
                    </span>
                    <span className="text-slate-500 font-semibold">{job.companyOrDept}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-semibold text-[11px] ${
                        job.sector === 'government'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                      }`}
                    >
                      {job.sector === 'government' ? job.bpsGrade || 'Govt' : 'Corporate'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{job.location}</td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-slate-700 dark:text-slate-300 block">{job.deadline}</span>
                    <button
                      onClick={() => handleExtendDeadline(job)}
                      className="text-[10px] text-emerald-600 hover:underline font-bold"
                      title="Extend deadline by 30 days"
                    >
                      +30 Days
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => togglePublishJob(job.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        job.published
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {job.published ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleFeatureJob(job.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        job.featured ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:text-amber-400'
                      }`}
                      title={job.featured ? 'Remove featured' : 'Mark featured'}
                    >
                      <Star className={`w-4 h-4 ${job.featured ? 'fill-current' : ''}`} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => duplicateJob(job.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      title="Duplicate job"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(job)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600"
                      title="Edit job"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setJobToDelete(job)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                      title="Delete job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 space-y-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {editingJob ? 'Edit Vacancy Posting' : 'Post New Job Vacancy'}
            </h2>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold block mb-1">Position Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Assistant Director (Admin & Finance)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Company / Ministry / Commission *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyOrDept}
                    onChange={(e) => setFormData({ ...formData, companyOrDept: e.target.value })}
                    placeholder="e.g. Federal Public Service Commission"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Sector *</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value as JobSector })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="government">Government & Public Sector</option>
                    <option value="private">Private Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Primary City</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {JOB_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Remuneration / Pay Scale</label>
                  <input
                    type="text"
                    value={formData.salaryFormatted}
                    onChange={(e) => setFormData({ ...formData, salaryFormatted: e.target.value })}
                    placeholder="e.g. PKR 90,000 - 130,000 / BPS-17 Scale"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                {/* Government Specific inputs */}
                {formData.sector === 'government' && (
                  <>
                    <div>
                      <label className="font-bold block mb-1">BPS Scale</label>
                      <select
                        value={formData.bpsGrade || 'BPS-17'}
                        onChange={(e) => setFormData({ ...formData, bpsGrade: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      >
                        {BPS_SCALES.map((bps) => (
                          <option key={bps} value={bps}>{bps}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Cadre Jurisdiction</label>
                      <select
                        value={formData.departmentCadre || 'Federal'}
                        onChange={(e) => setFormData({ ...formData, departmentCadre: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      >
                        <option value="Federal">Federal</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="KPK">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Treasury Challan Fee</label>
                      <input
                        type="text"
                        value={formData.challanFee || ''}
                        onChange={(e) => setFormData({ ...formData, challanFee: e.target.value })}
                        placeholder="e.g. Rs. 300/- (NBP Head of Account)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Age Limit</label>
                      <input
                        type="text"
                        value={formData.ageLimit || ''}
                        onChange={(e) => setFormData({ ...formData, ageLimit: e.target.value })}
                        placeholder="e.g. 22 - 30 Years + 5 Years Relaxation"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold block mb-1">Quota Distribution</label>
                      <input
                        type="text"
                        value={formData.quotaAllocation || ''}
                        onChange={(e) => setFormData({ ...formData, quotaAllocation: e.target.value })}
                        placeholder="e.g. Merit: 1, Punjab: 3, Sindh Rural: 1, Minorities: 1"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </>
                )}

                <div className="sm:col-span-2">
                  <label className="font-bold block mb-1">Educational Qualification Required</label>
                  <input
                    type="text"
                    value={formData.educationRequired}
                    onChange={(e) => setFormData({ ...formData, educationRequired: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold block mb-1">Detailed Description & Notice Text</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Full duties, syllabus references, and eligibility guidelines..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Published Live</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Featured Opportunity</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formData.urgent}
                    onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Urgent Recruitment</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors"
                >
                  {editingJob ? 'Update Vacancy' : 'Publish Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!jobToDelete}
        title="Delete Vacancy Posting?"
        message={`Are you sure you want to permanently remove "${jobToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete Vacancy"
        danger
        onConfirm={() => {
          if (jobToDelete) {
            deleteJob(jobToDelete.id);
            setJobToDelete(null);
          }
        }}
        onCancel={() => setJobToDelete(null)}
      />
    </div>
  );
};
