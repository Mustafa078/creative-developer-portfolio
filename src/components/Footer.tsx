import React from 'react';
import { ArrowUp, Database, Github, Linkedin, Twitter, Dribbble, Instagram, Globe, Mail, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC<{ onNavigateAdmin?: () => void }> = ({ onNavigateAdmin }) => {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'twitter':
      case 'x':
        return <Twitter className="w-4 h-4" />;
      case 'dribbble':
        return <Dribbble className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'globe':
      case 'website':
        return <Globe className="w-4 h-4" />;
      case 'mail':
        return <Mail className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      <div className="pt-8 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <span className="font-semibold text-slate-700">{profile?.name || 'Developer'}</span>
          <span className="hidden sm:inline">•</span>
          <span>Full-Stack Portfolio CMS</span>

          {profile?.socialLinks && profile.socialLinks.length > 0 && (
            <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-2 pl-0 sm:pl-3 sm:border-l sm:border-slate-200">
              {profile.socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  title={social.platform}
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          )}
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
