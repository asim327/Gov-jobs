export type JobSector = 'government' | 'private';

export type JobType = 'Full Time' | 'Part Time' | 'Contract' | 'Internship' | 'Temporary' | 'Freelance';

export type WorkplaceType = 'On-site' | 'Remote' | 'Hybrid';

export type GenderPreference = 'Both' | 'Male' | 'Female' | 'Transgender/Any';

export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Accepted'
  | 'Offer'
  | 'Selected'
  | 'Rejected'
  | 'Withdrawn';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  province?: string;
  role: 'user' | 'admin';
  avatar?: string;
  status: 'active' | 'disabled';
  createdAt: string;
  // Profile details
  title?: string;
  bio?: string;
  education?: any[];
  experience?: any[];
  skills?: string[];
  certifications?: any[];
  languages?: string[];
  preferredCategory?: string;
  preferredLocation?: string;
  preferredJobType?: JobType;
  expectedSalary?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies?: string;
  link?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface CV {
  id: string;
  userId: string;
  title: string;
  template: 'modern' | 'professional' | 'simple';
  updatedAt: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    province: string;
    address?: string;
    summary: string;
    website?: string;
    linkedin?: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  languages: string[];
  achievements: string[];
  references: ReferenceItem[];
}

export interface CoverLetter {
  id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  recipientName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  content: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  sector: JobSector; // 'government' | 'private'
  companyOrDept: string;
  companyId?: string;
  departmentId?: string;
  logo: string;
  location: string;
  province: string;
  jobType: JobType;
  workplaceType: WorkplaceType;
  category: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryFormatted: string;
  educationRequired: string;
  experienceYears: number; // minimum years required
  experienceFormatted: string;
  vacancies: number;
  ageLimitMin?: number;
  ageLimitMax?: number;
  ageLimitFormatted?: string;
  ageLimit?: string;
  challanFee?: string;
  quotaAllocation?: string;
  genderEligibility?: string;
  gender: GenderPreference;
  bpsGrade?: string; // BPS-16, BPS-17, BPS-18 etc for government jobs
  governmentCadre?: 'Federal' | 'Punjab' | 'Sindh' | 'KPK' | 'Balochistan' | 'AJK' | 'GB';
  departmentCadre?: string;
  skillsRequired: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  howToApply: string;
  officialApplicationUrl?: string; // For government and direct career sites
  requiredDocuments: string[];
  contactEmail?: string;
  contactPhone?: string;
  postedDate: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD
  featured: boolean;
  urgent: boolean;
  published: boolean;
  viewsCount: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  province: string;
  website: string;
  description: string;
  benefits: string[];
  openPositionsCount?: number;
  headquarters?: string;
}

export interface GovernmentDepartment {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  jurisdiction: 'Federal' | 'Punjab' | 'Sindh' | 'KPK' | 'Balochistan' | 'AJK' | 'GB';
  category: string;
  website: string;
  description: string;
  openPositionsCount?: number;
  cadre?: string;
  officialWebsite?: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  companyOrDept: string;
  sector: JobSector;
  logo: string;
  location: string;
  appliedDate: string;
  deadline: string;
  status: ApplicationStatus;
  notes: string;
  interviewDate?: string;
  contactPerson?: string;
  applicationUrl?: string;
  cvUsedId?: string;
  applicantName?: string;
  applicantEmail?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'matching_job' | 'application_update' | 'deadline' | 'saved_expiring' | 'profile_reminder' | 'system';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  keyword?: string;
  category?: string;
  location?: string;
  sector?: 'all' | 'government' | 'private';
  jobType?: string;
  salaryMin?: number;
  education?: string;
  bpsGrade?: string;
  active: boolean;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'CV Tips' | 'Interview Preparation' | 'Government Job Guide' | 'Career Advice' | 'Salary Guide' | 'Skills Development' | 'Fresh Graduate Guide' | string;
  author: string;
  date: string;
  readingTime: string;
  summary: string;
  content: string;
  featured: boolean;
  coverImage?: string;
  tags: string[];
}

export interface SiteSettings {
  siteName: string;
  supportEmail: string;
  contactNumber: string;
  supportPhone?: string;
  announcementText: string;
  showAnnouncement?: boolean;
  maintenanceMode: boolean;
}

export interface CVData {
  id: string;
  template: 'modern' | 'government' | 'minimal';
  fullName: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  summary: string;
  skills: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gradeOrCgpa: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  languages: string[];
  certifications: string[];
}

