import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ShareModalProps {
  title: string;
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ title, url, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast('Link copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Could not copy link.', 'error');
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Check out this job opportunity on CareerHub Pakistan: ${title} - ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-lg">Share Job Opportunity</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 mb-4">
          Share this vacancy with friends, colleagues, or student study groups:
        </p>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 bg-transparent text-xs font-mono text-slate-700 dark:text-slate-300 outline-hidden px-2 select-all"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors"
          >
            💬 Share on WhatsApp
          </button>
          <button
            onClick={handleLinkedIn}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 transition-colors"
          >
            💼 Share on LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
};
