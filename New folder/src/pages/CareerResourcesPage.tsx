import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, User, ArrowRight, Search, Sparkles } from 'lucide-react';
import { useJobs } from '../context/JobContext';

export const CareerResourcesPage: React.FC = () => {
  const { articles } = useJobs();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Government Exams', 'Tech Careers', 'Salary Trends', 'Resume Tips'];

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Pakistani Career Advisory & Syllabus Guides
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Career Resources & Exam Insights
        </h1>
        <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
          Comprehensive roadmaps for Federal Public Service Commission tests, salary benchmarks across Karachi, Lahore & Islamabad, and engineering career guidance.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Guides' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-72 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-emerald-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles or topics..."
            className="w-full bg-transparent text-xs font-medium focus:outline-hidden"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <Link
            key={art.id}
            to={`/career-resources/${art.id}`}
            className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-emerald-500/50 transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-44 bg-linear-to-tr from-emerald-800 via-teal-700 to-emerald-600 p-6 flex flex-col justify-between text-white relative">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md w-fit">
                  {art.category}
                </span>
                <span className="text-xs text-emerald-100 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {art.readingTime}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {art.author.split('(')[0]}
              </span>
              <span className="font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
