import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Layout,
  User,
  GraduationCap,
  Briefcase,
  Languages,
  Award,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../services/storage';
import { CVData } from '../types';

const INITIAL_CV: CVData = {
  id: 'cv-default',
  template: 'modern',
  fullName: 'Muhammad Hamza Tariq',
  title: 'Full Stack Engineer & Software Consultant',
  email: 'hamza.tariq@example.pk',
  phone: '+92 300 1234567',
  city: 'Islamabad, Pakistan',
  summary:
    'Dedicated Software Engineer with 4+ years of hands-on experience designing robust web services, microservices, and React frontends. Proven track record delivering scalable enterprise systems across Pakistan and remote teams.',
  skills: [
    'React',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Tailwind CSS',
    'REST APIs',
    'Git & CI/CD',
    'System Architecture',
  ],
  education: [
    {
      degree: 'BS in Computer Science (4 Years)',
      institution: 'National University of Sciences and Technology (NUST)',
      year: '2018 - 2022',
      gradeOrCgpa: '3.72 / 4.00 CGPA',
    },
    {
      degree: 'Higher Secondary School Certificate (F.Sc Pre-Engineering)',
      institution: 'Punjab Group of Colleges, Rawalpindi',
      year: '2016 - 2018',
      gradeOrCgpa: 'Grade A+ (First Division)',
    },
  ],
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'Systems Limited',
      period: '2023 - Present',
      description:
        'Led architecture of fintech web platform serving 100k+ transactions monthly. Mentored 4 junior engineers and improved deployment velocity by 40%.',
    },
    {
      role: 'Full Stack Developer',
      company: 'Techlogix Pakistan',
      period: '2022 - 2023',
      description:
        'Engineered responsive React portals and secure Node.js APIs for enterprise corporate clients in telecom and healthcare.',
    },
  ],
  languages: ['Urdu (Native)', 'English (Professional Fluent)', 'Punjabi (Conversational)'],
  certifications: [
    'AWS Certified Solutions Architect - Associate',
    'Full Stack Web Development Certification - Coursera',
  ],
};

export const CvBuilderPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [cvData, setCvData] = useState<CVData>(() => {
    return getStorageItem<CVData>(STORAGE_KEYS.SAVED_CVS, INITIAL_CV);
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newCert, setNewCert] = useState('');

  // Persist CV
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.SAVED_CVS, cvData);
  }, [cvData]);

  // Sync profile data helper
  const syncWithProfile = () => {
    if (!currentUser) return;
    setCvData((prev) => ({
      ...prev,
      fullName: currentUser.name || prev.fullName,
      email: currentUser.email || prev.email,
      phone: currentUser.phone || prev.phone,
      city: currentUser.city || prev.city,
      title: currentUser.title || prev.title,
      summary: currentUser.bio || prev.summary,
      skills: currentUser.skills && currentUser.skills.length > 0 ? currentUser.skills : prev.skills,
      education:
        currentUser.education && currentUser.education.length > 0
          ? currentUser.education
          : prev.education,
      experience:
        currentUser.experience && currentUser.experience.length > 0
          ? currentUser.experience
          : prev.experience,
    }));
    showToast('Loaded information from your user profile.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  // Education Helpers
  const addEducation = () => {
    setCvData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: 'Degree Title', institution: 'University or College Name', year: '2020 - 2024', gradeOrCgpa: 'CGPA or Division' },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index),
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((edu, idx) => (idx === index ? { ...edu, [field]: value } : edu)),
    }));
  };

  // Experience Helpers
  const addExperience = () => {
    setCvData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: 'Job Title', company: 'Company Name', period: '2023 - Present', description: 'Summary of contributions and impact.' },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index),
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, idx) => (idx === index ? { ...exp, [field]: value } : exp)),
    }));
  };

  // Skills, Languages, Certs
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setCvData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setCvData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const handleAddLanguage = () => {
    if (!newLang.trim()) return;
    setCvData((prev) => ({ ...prev, languages: [...prev.languages, newLang.trim()] }));
    setNewLang('');
  };

  const handleRemoveLanguage = (lang: string) => {
    setCvData((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang) }));
  };

  const handleAddCert = () => {
    if (!newCert.trim()) return;
    setCvData((prev) => ({ ...prev, certifications: [...prev.certifications, newCert.trim()] }));
    setNewCert('');
  };

  const handleRemoveCert = (cert: string) => {
    setCvData((prev) => ({ ...prev, certifications: prev.certifications.filter((c) => c !== cert) }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Template Chooser */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Pakistani Standard CV Builder
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Build Your Professional Resume
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Format your credentials according to private enterprise requirements or formal Federal / Provincial public service standards.
          </p>
        </div>

        {/* Template & Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {currentUser && (
            <button
              onClick={syncWithProfile}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Sync Profile
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Download / Print PDF
          </button>
        </div>
      </div>

      {/* Template Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-print">
        <span className="text-xs font-bold text-slate-400 mr-2">Template:</span>
        <button
          onClick={() => setCvData((prev: CVData) => ({ ...prev, template: 'modern' }))}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            cvData.template === 'modern'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Corporate Modern
        </button>
        <button
          onClick={() => setCvData((prev: CVData) => ({ ...prev, template: 'government' }))}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            cvData.template === 'government'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Government & Formal Public Sector
        </button>
        <button
          onClick={() => setCvData((prev: CVData) => ({ ...prev, template: 'minimal' }))}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            cvData.template === 'minimal'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Tech Minimalist
        </button>
      </div>

      {/* Mobile Tab Toggle between Edit and Preview */}
      <div className="lg:hidden flex rounded-xl border border-slate-200 dark:border-slate-800 p-1 bg-white dark:bg-slate-900 no-print">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'edit'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Edit Information
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'preview'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Preview Resume
        </button>
      </div>

      {/* Main Split Grid: Editor (Left) & Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Column */}
        <div
          className={`lg:col-span-6 space-y-6 no-print ${
            activeTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" /> Personal Particulars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={cvData.fullName}
                  onChange={(e) => setCvData({ ...cvData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Target Title / Role</label>
                <input
                  type="text"
                  value={cvData.title}
                  onChange={(e) => setCvData({ ...cvData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={cvData.email}
                  onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Mobile / WhatsApp</label>
                <input
                  type="text"
                  value={cvData.phone}
                  onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 block mb-1">City, Province</label>
                <input
                  type="text"
                  value={cvData.city}
                  onChange={(e) => setCvData({ ...cvData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Professional Summary</label>
                <textarea
                  rows={3}
                  value={cvData.summary}
                  onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" /> Educational Background
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </button>
            </div>

            <div className="space-y-3">
              {cvData.education.map((edu: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"
                    title="Remove degree"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Degree / Certificate Name"
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Board / University"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Years (e.g. 2018 - 2022)"
                      value={edu.year}
                      onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="CGPA / Division"
                      value={edu.gradeOrCgpa}
                      onChange={(e) => updateEducation(idx, 'gradeOrCgpa', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" /> Work Experience
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            <div className="space-y-3">
              {cvData.experience.map((exp: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"
                    title="Remove experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Designation / Role"
                      value={exp.role}
                      onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Company / Department"
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Period (e.g. 2022 - Present)"
                      value={exp.period}
                      onChange={(e) => updateExperience(idx, 'period', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Key responsibilities and achievements..."
                    value={exp.description}
                    onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Skills, Languages, Certs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" /> Skills & Competencies
            </h3>

            {/* Skills */}
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1.5">Key Skills</span>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="e.g. Python, Financial Modeling, AutoCAD"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cvData.skills.map((s: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                  >
                    {s}
                    <button onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-rose-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 block mb-1.5">Languages</span>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                  placeholder="e.g. Urdu (Native), English (Fluent)"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cvData.languages.map((l: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                  >
                    {l}
                    <button onClick={() => handleRemoveLanguage(l)} className="text-slate-400 hover:text-rose-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Column (Always formatted for A4 print output) */}
        <div
          className={`lg:col-span-6 ${
            activeTab === 'edit' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="sticky top-24">
            <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-3xl shadow-inner border border-slate-300 dark:border-slate-700 no-print mb-3 flex items-center justify-between text-xs font-bold">
              <span>A4 Resume Live Preview</span>
              <span className="text-emerald-700 dark:text-emerald-300">Ready to Print</span>
            </div>

            {/* CV DOCUMENT RENDER CONTAINER */}
            <div
              id="cv-print-area"
              className={`w-full bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10 min-h-[840px] text-xs leading-relaxed transition-all ${
                cvData.template === 'government'
                  ? 'font-serif'
                  : cvData.template === 'minimal'
                  ? 'font-mono'
                  : 'font-sans'
              }`}
            >
              {/* Header */}
              <div
                className={`pb-4 mb-5 border-b ${
                  cvData.template === 'modern'
                    ? 'border-emerald-600'
                    : cvData.template === 'government'
                    ? 'border-black text-center'
                    : 'border-slate-300'
                }`}
              >
                <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-950">
                  {cvData.fullName}
                </h2>
                <p className="text-sm font-semibold text-emerald-800 mt-0.5">{cvData.title}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-600 mt-2">
                  <span>{cvData.email}</span>
                  <span>•</span>
                  <span>{cvData.phone}</span>
                  <span>•</span>
                  <span>{cvData.city}</span>
                </div>
              </div>

              {/* Summary */}
              {cvData.summary && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 pb-0.5 border-b border-slate-200">
                    Profile Summary
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-[11.5px]">{cvData.summary}</p>
                </div>
              )}

              {/* Experience */}
              {cvData.experience && cvData.experience.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 pb-0.5 border-b border-slate-200">
                    Professional Experience
                  </h4>
                  <div className="space-y-3">
                    {cvData.experience.map((exp: any, idx: number) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex items-baseline justify-between font-bold text-[12px] text-slate-900">
                          <span>{exp.role}</span>
                          <span className="text-[11px] text-slate-500 font-normal">{exp.period}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-800">{exp.company}</div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {cvData.education && cvData.education.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 pb-0.5 border-b border-slate-200">
                    Academic Qualifications
                  </h4>
                  <div className="space-y-2.5">
                    {cvData.education.map((edu: any, idx: number) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex items-baseline justify-between font-bold text-[12px] text-slate-900">
                          <span>{edu.degree}</span>
                          <span className="text-[11px] text-slate-500 font-normal">{edu.year}</span>
                        </div>
                        <div className="flex items-baseline justify-between text-[11px] text-slate-600">
                          <span>{edu.institution}</span>
                          <span className="font-semibold text-emerald-800">{edu.gradeOrCgpa}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {cvData.skills && cvData.skills.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 pb-0.5 border-b border-slate-200">
                    Core Competencies & Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cvData.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium border border-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {cvData.languages && cvData.languages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1 pb-0.5 border-b border-slate-200">
                    Languages
                  </h4>
                  <p className="text-[11px] text-slate-700">{cvData.languages.join(' • ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
