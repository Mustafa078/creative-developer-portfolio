import React, { useState } from 'react';
import { Code2, Layout, Server, PenTool, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { services } from '../data';
import { ServiceItem } from '../types';

export const ServicesBar: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-5 h-5 text-indigo-600" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-sky-500" />;
      case 'Server':
        return <Server className="w-5 h-5 text-teal-600" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-purple-600" />;
      default:
        return <Code2 className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getBgClass = (id: string) => {
    switch (id) {
      case 'web-dev':
        return 'bg-indigo-50/90 border-indigo-100/60';
      case 'frontend-dev':
        return 'bg-sky-50/90 border-sky-100/60';
      case 'backend-dev':
        return 'bg-teal-50/90 border-teal-100/60';
      case 'uiux-design':
        return 'bg-purple-50/90 border-purple-100/60';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <section id="services-bar-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-6">
      {/* Floating Glassmorphism Single Bar */}
      <div
        id="floating-services-bar"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] ring-1 ring-slate-100/70"
      >
        {services.map((service) => (
          <div
            key={service.id}
            id={`service-pill-${service.id}`}
            onClick={() => setSelectedService(service)}
            className="group flex items-center gap-3.5 p-3.5 sm:p-4 hover:bg-slate-50/70 transition-all duration-200 cursor-pointer rounded-2xl"
          >
            {/* Icon Bubble */}
            <div
              className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl border ${getBgClass(
                service.id
              )} transition-transform duration-200 group-hover:scale-105 shadow-2xs`}
            >
              {getIcon(service.icon)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors truncate">
                {service.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
                {service.shortDesc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Service Details Modal Popup */}
      {selectedService && (
        <div
          id="service-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="w-full max-w-lg p-6 rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-1 ring-slate-200/60 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedService.accentColor}`}
                >
                  {getIcon(selectedService.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedService.title}</h3>
                  <p className="text-xs text-slate-500">{selectedService.shortDesc}</p>
                </div>
              </div>
              <button
                id="close-service-modal"
                onClick={() => setSelectedService(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed">{selectedService.fullDesc}</p>

              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-4 mb-2">
                Core Competencies & Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedService.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                id="close-service-action"
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
