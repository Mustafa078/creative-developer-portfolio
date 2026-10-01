import React from 'react';
import { ArrowUp, Database } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC<{ onNavigateAdmin?: () => void }> = ({ onNavigateAdmin }) => {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      <div className="pt-8 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">{profile?.name || 'Developer'}</span>
          <span>•</span>
          <span>Full-Stack Portfolio CMS with MongoDB & React</span>
        </div>

        <div className="flex items-center gap-4">
          {onNavigateAdmin && (
            <button
              onClick={onNavigateAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </button>
          )}

          <span className="text-slate-400">© {new Date().getFullYear()} All rights reserved.</span>
          <button
            id="btn-back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-600 hover:text-indigo-600 border border-slate-200/80 shadow-2xs transition-all cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
