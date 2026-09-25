import React, { useState } from 'react';
import { Sparkles, Copy, Check, Printer, FileText, Send, Building, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CoverLetterGeneratorPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [jobTitle, setJobTitle] = useState('Assistant Director (BPS-17)');
  const [organization, setOrganization] = useState('Ministry of Federal Education & Professional Training');
  const [recipient, setRecipient] = useState('The Director General (Recruitment)');
  const [tone, setTone] = useState<'government' | 'corporate' | 'tech'>('government');
  const [keySkills, setKeySkills] = useState('Public administration, policy analysis, IT systems oversight');
  const [copied, setCopied] = useState(false);

  const generateLetterContent = () => {
    const applicantName = currentUser?.name || 'Muhammad Hamza Tariq';
    const applicantEmail = currentUser?.email || 'hamza.tariq@example.pk';
    const applicantPhone = currentUser?.phone || '+92 300 1234567';
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    if (tone === 'government') {
      return `Date: ${today}

To:
${recipient}
${organization}
Islamabad, Islamic Republic of Pakistan

Subject: APPLICATION FOR APPOINTMENT TO THE POST OF ${jobTitle.toUpperCase()}

Respected Sir / Madam,

With utmost respect and reference to the official advertisement published in the national press regarding vacancies for the subject post in ${organization}, I respectfully submit my candidature for your kind consideration.

I possess the requisite academic qualifications and verified credentials conforming to the prescribed recruitment criteria. My academic foundation and practical background in ${keySkills} have prepared me to discharge public sector responsibilities with integrity, diligence, and accountability.

I have deposited the prescribed treasury challan under the designated head of account and enclose herewith attested documentary proofs of my educational certificates, national identity card (CNIC), and provincial domicile.

Should I be afforded the honor of selection, I assure you of my unwavering commitment to public service and the highest standards of administrative discipline.

Thanking you in anticipation.

Yours obediently,

${applicantName}
Mobile: ${applicantPhone}
Email: ${applicantEmail}
Domicile: Punjab / Federal Quota`;
    }

    if (tone === 'tech') {
      return `Date: ${today}

Dear Hiring Team at ${organization},

I am excited to submit my application for the role of ${jobTitle}. Having monitored ${organization}'s impressive technical contributions across Pakistan, I am eager to bring my expertise in ${keySkills} to your high-performing team.

Throughout my career, I have focused on solving intricate architectural problems, shipping maintainable code, and optimizing software delivery. I thrive in agile engineering cultures where innovation and customer empathy are prioritized.

I would welcome the opportunity to discuss how my technical acumen can contribute to upcoming software initiatives at ${organization}.

Thank you for your consideration.

Warm regards,

${applicantName}
Phone: ${applicantPhone}
Email: ${applicantEmail}`;
    }

    // Default corporate
    return `Date: ${today}

Dear ${recipient},
${organization}

Subject: Application for the Position of ${jobTitle}

I am writing to express my enthusiastic interest in the ${jobTitle} opening currently available at ${organization}. With a solid professional background and demonstrated competencies in ${keySkills}, I am confident in my ability to make an immediate, positive impact on your organization.

In my previous roles, I have consistently delivered measurable outcomes, fostered productive stakeholder relationships, and maintained operational excellence. I am particularly drawn to ${organization}'s reputation for market leadership and high professional standards.

Enclosed is my resume providing further details regarding my achievements and qualifications. I welcome the opportunity to meet with you for an interview.

Thank you for your time and consideration.

Sincerely,

${applicantName}
Phone: ${applicantPhone}
Email: ${applicantEmail}`;
  };

  const currentContent = generateLetterContent();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      showToast('Cover letter copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Could not copy text.', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Pakistani Career Tools
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Cover Letter Generator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate formal Pakistani gazetted applications, official civil service letters, or modern corporate cover notes in seconds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-5 no-print">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Application Parameters
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Target Format / Sector Tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTone('government')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    tone === 'government'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  Govt & Public
                </button>
                <button
                  type="button"
                  onClick={() => setTone('corporate')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    tone === 'corporate'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  Corporate
                </button>
                <button
                  type="button"
                  onClick={() => setTone('tech')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    tone === 'tech'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  Tech & Startup
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Designation / Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Company / Ministry / Commission
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Addressed To / Recipient Title
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Key Skills / Qualifications Highlight
              </label>
              <textarea
                rows={3}
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Output Document */}
        <div className="lg:col-span-7">
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl min-h-[600px] text-xs leading-relaxed font-serif whitespace-pre-line">
            {currentContent}
          </div>
        </div>
      </div>
    </div>
  );
};
