import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { PortfolioProvider } from './context/PortfolioContext';
import { AtomicCanvas } from './components/AtomicCanvas';
import { Navbar } from './components/Navbar';
import { ServicesBar } from './components/ServicesBar';
import { HeroSection } from './components/HeroSection';
import { RotaryCarousel } from './components/RotaryCarousel';
import { ContentMatrix2x2 } from './components/ContentMatrix2x2';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ContactModal } from './components/ContactModal';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { ProjectItem } from './types';

function PortfolioApp() {
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);

  // Sync routing on URL changes
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smooth scroll handler for nav items
  const handleNavigate = (sectionId: string) => {
    if (isAdminView) {
      navigateToHome();
    }
    setActiveSection(sectionId);

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'about') {
      const el = document.getElementById('about');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'projects') {
      const el = document.getElementById('projects-carousel-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'contact') {
      const el = document.getElementById('contact');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll listener to update active section indicator
  useEffect(() => {
    if (isAdminView) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const projectsEl = document.getElementById('projects-carousel-section');
      const aboutEl = document.getElementById('about');
      const contactEl = document.getElementById('contact');

      if (contactEl && scrollY >= contactEl.offsetTop - 300) {
        setActiveSection('contact');
      } else if (aboutEl && scrollY >= aboutEl.offsetTop - 300) {
        setActiveSection('about');
      } else if (projectsEl && scrollY >= projectsEl.offsetTop - 300) {
        setActiveSection('projects');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminView]);

  if (isAdminView) {
    return <AdminDashboard onNavigateHome={navigateToHome} />;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f8fafc] text-slate-800 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        {/* Soft Lavender Glow Top Center */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[500px] rounded-full bg-gradient-to-b from-indigo-200/35 via-purple-100/25 to-transparent blur-3xl" />
        {/* Soft Cyan Glow Left */}
        <div className="absolute top-[30%] -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-sky-200/25 via-cyan-100/20 to-transparent blur-3xl" />
        {/* Soft Indigo Glow Bottom Right */}
        <div className="absolute top-[65%] -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-l from-purple-200/20 via-indigo-100/15 to-transparent blur-3xl" />
        {/* Subtle grid pattern overlay for precision look */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f018_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f018_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Interactive HTML5 Atomic Canvas Layer */}
      <AtomicCanvas interactive={true} className="z-0" />

      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onNavigateAdmin={navigateToAdmin}
      />

      {/* Main Vertical Content Flow */}
      <main className="relative z-10 flex flex-col">
        {/* Floating Services Bar */}
        <ServicesBar />

        {/* Hero Section (Top Viewport) */}
        <HeroSection
          onViewWork={() => handleNavigate('projects')}
          onDownloadCV={() => setIsResumeModalOpen(true)}
        />

        {/* 3D Project Carousel Section (Middle Viewport) */}
        <RotaryCarousel onSelectProject={(project) => setSelectedProject(project)} />

        {/* Structured Content Grid (2x2 Matrix - Lower Viewport) */}
        <ContentMatrix2x2
          onSelectProject={(project) => setSelectedProject(project)}
          onOpenContact={() => setIsContactModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer onNavigateAdmin={navigateToAdmin} />

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
      <Analytics />
    </PortfolioProvider>
  );
}
