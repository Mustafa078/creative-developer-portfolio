import React from 'react';
import { X, Printer, Briefcase, Code } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { profile, experience, skills } = usePortfolio();

  if (!isOpen || !profile) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="resume-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="resume-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.25)] border border-slate-200/80 animate-scale-up"
      >
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Curriculum Vitae Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Content */}
        <div className="mt-6 space-y-6 text-slate-800">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-sm font-semibold text-indigo-600 mt-0.5">
                {profile.titlePrefix || 'Senior Full-Stack Architect'}
              </p>
            </div>
            <div className="text-xs text-slate-500 sm:text-right space-y-1">
              <div>{profile.email}</div>
              <div>{profile.location}</div>
              <div className="text-emerald-600 font-medium">● {profile.status || 'Available for projects'}</div>
            </div>
          </div>

          {/* Professional Bio */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
            {profile.bio || profile.tagline}
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Work Experience</span>
            </h2>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-indigo-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-xs font-semibold text-indigo-600">{exp.period}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {exp.company} • {exp.location}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(exp.technologies || []).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Competencies */}
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>Technical Skills & Proficiency</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800">{skill.name}</span>
                  <span className="font-mono text-indigo-600 text-[11px] font-bold">
                    {skill.level}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
