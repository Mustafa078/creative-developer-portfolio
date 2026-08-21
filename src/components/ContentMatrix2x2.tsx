import React, { useState } from 'react';
import {
  Code,
  FolderKanban,
  Briefcase,
  Send,
  ExternalLink,
  Mail,
  MapPin,
  Check,
  Copy,
  Github,
  Linkedin,
  Twitter,
  Dribbble,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { skills, experienceTimeline, projects, personalInfo, socialLinks, allSkillsList } from '../data';
import { ProjectItem } from '../types';

interface ContentMatrix2x2Props {
  onSelectProject: (project: ProjectItem) => void;
  onOpenContact: () => void;
}

export const ContentMatrix2x2: React.FC<ContentMatrix2x2Props> = ({
  onSelectProject,
  onOpenContact,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllExperience, setShowAllExperience] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <Github className="w-4 h-4" />;
      case 'Linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'Twitter':
        return <Twitter className="w-4 h-4" />;
      case 'Dribbble':
        return <Dribbble className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const featuredProjectsList = projects.slice(0, 3);

  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 2x2 Responsive Grid: grid-cols-1 on mobile/tablet, grid-cols-2 on large screens */}
      <div id="content-2x2-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: Top-Left - Skills Matrix */}
        <div
          id="card-skills-matrix"
          className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 hover:shadow-[0_12px_35px_rgba(99,102,241,0.06)] transition-all duration-300"
        >
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Code className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Skills</h3>
              </div>
              <button
                id="btn-view-all-skills"
                onClick={() => setShowAllSkills(!showAllSkills)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                <span>{showAllSkills ? 'Collapse' : 'View all'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Skills List with Proficiency Progress Bars */}
            <div className="mt-5 space-y-3.5">
              {skills.map((skill) => {
                const getSkillBadge = (id: string) => {
                  switch (id) {
                    case 'ts':
                      return <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">TS</span>;
                    case 'react':
                      return <span className="w-6 h-6 rounded-md bg-sky-500 text-white flex items-center justify-center text-xs font-bold">⚛</span>;
                    case 'next':
                      return <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold">N</span>;
                    case 'tailwind':
                      return <span className="w-6 h-6 rounded-md bg-cyan-500 text-white flex items-center justify-center text-[11px] font-bold">≈</span>;
                    case 'node':
                      return <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">JS</span>;
                    case 'postgres':
                      return <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">SQL</span>;
                    default:
                      return <span className="w-6 h-6 rounded-md bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">DEV</span>;
                  }
                };

                return (
                  <div key={skill.id} id={`skill-item-${skill.id}`} className="group">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <div className="flex items-center gap-2.5">
                        {getSkillBadge(skill.id)}
                        <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-slate-500 font-mono text-xs">{skill.level}%</span>
                    </div>

                    {/* Gradient Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Expanded Skills Breakdown when "View all" is clicked */}
            {showAllSkills && (
              <div className="mt-5 pt-4 border-t border-slate-100 animate-fade-in">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Full Tech Stack & Tools
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {allSkillsList.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <span className="font-medium text-slate-700 truncate">{s.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{s.experience}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: Top-Right - Featured Projects */}
        <div
          id="card-featured-projects"
          className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 hover:shadow-[0_12px_35px_rgba(99,102,241,0.06)] transition-all duration-300"
        >
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Featured Projects</h3>
              </div>
              <button
                id="btn-view-all-projects"
                onClick={() => {
                  const carouselEl = document.getElementById('projects-carousel-section');
                  carouselEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                <span>View all</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Vertical Project Stack with connector line */}
            <div className="mt-5 relative">
              {/* Connector line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-indigo-100 -z-0" />

              <div className="space-y-4">
                {featuredProjectsList.map((proj, idx) => (
                  <div
                    key={proj.id}
                    id={`featured-proj-${proj.id}`}
                    onClick={() => onSelectProject(proj)}
                    className="relative z-10 flex items-center justify-between p-3 rounded-2xl bg-white/60 hover:bg-white border border-slate-100 hover:border-indigo-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Thumbnail or bullet indicator */}
                      <div className="relative flex-shrink-0 w-12 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {proj.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600">
                        {proj.tags[0]}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{proj.year}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Bottom-Left - Experience Timeline */}
        <div
          id="card-experience-timeline"
          className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 hover:shadow-[0_12px_35px_rgba(99,102,241,0.06)] transition-all duration-300"
        >
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Experience</h3>
              </div>
              <button
                id="btn-view-all-experience"
                onClick={() => setShowAllExperience(!showAllExperience)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                <span>{showAllExperience ? 'Summary' : 'View all'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Connected Vertical Timeline Milestones */}
            <div className="mt-5 relative">
              {/* Timeline continuous vertical track */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-400 to-slate-200" />

              <div className="space-y-5">
                {experienceTimeline.map((item) => (
                  <div key={item.id} id={`exp-${item.id}`} className="relative flex items-start gap-4">
                    {/* Node Dot */}
                    <div className="relative z-10 flex-shrink-0 mt-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                          item.isCurrent
                            ? 'bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                            : 'bg-purple-400'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                        <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                          {item.role}
                        </h4>
                        <span className="text-xs font-semibold text-indigo-600/90 whitespace-nowrap">
                          {item.period}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {item.company} • <span className="text-slate-400">{item.location}</span>
                      </p>

                      {showAllExperience && (
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed animate-fade-in">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: Bottom-Right - Contact & Connect */}
        <div
          id="contact"
          className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 hover:shadow-[0_12px_35px_rgba(99,102,241,0.06)] transition-all duration-300"
        >
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Contact & Connect</h3>
              </div>
            </div>

            {/* Split Contact Body */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-5">
              {/* Left Details Column */}
              <div className="sm:col-span-7 space-y-3.5">
                {/* Email with copy */}
                <div
                  id="contact-email-row"
                  onClick={handleCopyEmail}
                  className="group flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700 truncate">
                      {personalInfo.email}
                    </span>
                  </div>
                  <button
                    aria-label="Copy email address"
                    className="p-1 text-slate-400 group-hover:text-indigo-600 transition-colors"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2.5 px-2.5 py-1 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span className="font-medium">{personalInfo.location}</span>
                </div>

                {/* Availability status */}
                <div className="flex items-center gap-2.5 px-2.5 py-1 text-xs text-slate-600">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </div>
                  <span className="font-medium text-emerald-700">Available for new opportunities</span>
                </div>

                {/* Send Direct Message CTA Button */}
                <button
                  id="btn-open-direct-message"
                  onClick={onOpenContact}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold shadow-[0_4px_16px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
                >
                  <span>Send Direct Message</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right Social Links Column */}
              <div className="sm:col-span-5 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Let's connect
                </span>
                <div className="space-y-1.5">
                  {socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-100 shadow-2xs hover:shadow-xs transition-all duration-200 text-xs font-semibold text-slate-700 hover:text-indigo-600"
                    >
                      <div className="flex items-center gap-2">
                        {getSocialIcon(social.icon)}
                        <span>{social.platform}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
