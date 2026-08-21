import React from 'react';
import { ArrowRight, Download, Github, Linkedin, Twitter } from 'lucide-react';
import { personalInfo } from '../data';

interface HeroSectionProps {
  onViewWork: () => void;
  onDownloadCV: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onViewWork, onDownloadCV }) => {
  return (
    <section id="hero-section" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
        {/* Left Column (lg:col-span-7): Headline, Intro, Badge & Actions */}
        <div className="lg:col-span-7 w-full flex flex-col justify-center text-left z-10">
          {/* Greeting Pill Badge with Inline Thumbnail Avatar and Status */}
          <div
            id="hero-status-badge"
            className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_2px_12px_rgba(99,102,241,0.06)] mb-6 transition-all duration-300 hover:border-indigo-200 w-fit"
          >
            {/* Small round avatar icon */}
            <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1.5 ring-indigo-500/30 flex-shrink-0 bg-slate-950">
              <img
                src={personalInfo.avatar}
                alt="Developer Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <span id="hero-greeting" className="text-xs sm:text-sm font-semibold text-slate-800">
              {personalInfo.greeting}
            </span>

            <span className="text-slate-300 text-xs">•</span>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Available for work
            </span>
          </div>

          {/* Main Headline */}
          <h1
            id="hero-headline"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]"
          >
            Creative Developer<br />
            Building{' '}
            <span className="bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Digital
            </span>{' '}
            Experiences
          </h1>

          {/* Tagline */}
          <p
            id="hero-tagline"
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal"
          >
            {personalInfo.tagline}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* View Work Button */}
            <button
              id="cta-view-work"
              onClick={onViewWork}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-[0_4px_16px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_22px_rgba(99,102,241,0.45)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 cursor-pointer"
            >
              <span>View Work</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {/* Download CV Button */}
            <button
              id="cta-download-cv"
              onClick={onDownloadCV}
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200 shadow-2xs hover:border-slate-300 transition-all duration-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download CV</span>
            </button>
          </div>
        </div>

        {/* Right Column (lg:col-span-5): Profile Card matching uploaded reference */}
        <div className="lg:col-span-5 w-full flex items-center justify-center lg:justify-end relative py-4 lg:py-0">
          <div
            id="hero-profile-card"
            className="relative w-full max-w-[280px] sm:max-w-[300px] rounded-3xl p-6 bg-white/95 backdrop-blur-xl border border-sky-100 shadow-[0_16px_40px_rgba(56,189,248,0.12),0_4px_16px_rgba(99,102,241,0.08)] ring-1 ring-sky-200/40 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_20px_48px_rgba(56,189,248,0.2)] hover:-translate-y-0.5 group"
          >
            {/* Circular Avatar with Glowing Gradient Border */}
            <div className="relative mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-950">
                  <img
                    id="hero-card-avatar"
                    src={personalInfo.avatar}
                    alt="Developer Avatar"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              {/* Green Available status indicator */}
              <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-white shadow-xs flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-600/30" />
              </span>
            </div>

            {/* Name */}
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {personalInfo.name}
            </h3>

            {/* Role / Subtitle */}
            <p className="text-sm font-medium text-slate-500 mt-1">
              Creative Engineer
            </p>

            {/* Social Links Row */}
            <div className="flex items-center justify-center gap-3.5 mt-5 pt-4 border-t border-slate-100 w-full text-slate-700">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                aria-label="X (Twitter)"
                title="X (Twitter)"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
