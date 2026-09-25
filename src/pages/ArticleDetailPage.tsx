import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Calendar, ArrowLeft, Share2, Printer, Check, Copy } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useToast } from '../context/ToastContext';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articles } = useJobs();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Article Not Found</h2>
        <Link to="/career-resources" className="text-emerald-600 font-bold hover:underline">
          ← Back to Resources
        </Link>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Article link copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Could not copy link.', 'error');
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div className="no-print">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Guides
        </button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            {article.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readingTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <div>
            <span>By </span>
            <strong className="text-slate-800 dark:text-slate-200">{article.author}</strong>
            <span> • Published on {article.date}</span>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy share link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print article"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
        {article.content}
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between no-print">
        <Link
          to="/career-resources"
          className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Explore More Career Guides
        </Link>
        <Link
          to="/jobs"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
        >
          Search Open Jobs Now
        </Link>
      </div>
    </article>
  );
};
