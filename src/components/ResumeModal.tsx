import React from 'react';
import { X, Printer, Download, Sparkles, CheckCircle2, Briefcase, GraduationCap, Code } from 'lucide-react';
import { personalInfo, experienceTimeline, skills } from '../data';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
                {personalInfo.name}
              </h1>
              <p className="text-sm font-semibold text-indigo-600 mt-0.5">
                Lead Front-End Architect & Creative Developer
              </p>
            </div>
            <div className="text-xs text-slate-500 sm:text-right space-y-0.5">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.location}</p>
              <p className="text-emerald-600 font-medium">Available for select contracts & full-time</p>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {personalInfo.bio}
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Work Experience</span>
            </h2>
            <div className="space-y-4">
              {experienceTimeline.map((exp) => (
                <div key={exp.id} className="border-l-2 border-indigo-200 pl-4 py-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-bold text-slate-800">{exp.role}</h3>
                    <span className="text-xs text-slate-500 font-mono">{exp.period}</span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600">
                    {exp.company} • {exp.location}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exp.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Skills */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>Technical Skills</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <span className="font-bold text-indigo-600 font-mono">{s.level}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Education</span>
            </h2>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex justify-between items-baseline font-bold text-slate-800">
                <span>B.Tech in Computer Science & Engineering</span>
                <span className="font-mono text-slate-500 font-normal">2017 – 2021</span>
              </div>
              <p className="text-slate-500 mt-0.5">Visvesvaraya Technological University • First Class with Distinction</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
