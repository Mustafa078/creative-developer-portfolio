import React from 'react';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="relative w-full pt-6 pb-2 px-4 sm:px-6 lg:px-8 z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Monogram "DEV" */}
        <div
          id="brand-logo"
          onClick={() => onNavigate('home')}
          className="cursor-pointer flex items-center gap-2 group select-none"
        >
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
            DEV
          </span>
        </div>

        {/* Center: Floating Pill Nav */}
        <nav
          id="floating-nav"
          aria-label="Main Navigation"
          className="flex items-center gap-1 sm:gap-4 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_4px_25px_rgba(0,0,0,0.04)] ring-1 ring-slate-100/80"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3 py-1 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    id={`active-dot-${item.id}`}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_6px_rgba(99,102,241,0.6)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right dummy spacer for perfect center alignment on desktop */}
        <div className="w-8 sm:w-12" />
      </div>
    </header>
  );
};
