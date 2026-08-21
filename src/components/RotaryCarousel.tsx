import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { projects } from '../data';
import { ProjectItem } from '../types';

interface RotaryCarouselProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const RotaryCarousel: React.FC<RotaryCarouselProps> = ({ onSelectProject }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const dragDistanceRef = useRef<number>(0);

  const totalProjects = projects.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalProjects);
  }, [totalProjects]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  }, [totalProjects]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Drag & Swipe handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    dragDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    dragDistanceRef.current = e.clientX - startXRef.current;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDistanceRef.current > 60) {
      prevSlide();
    } else if (dragDistanceRef.current < -60) {
      nextSlide();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    dragDistanceRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    dragDistanceRef.current = e.touches[0].clientX - startXRef.current;
  };

  const handleTouchEnd = () => {
    if (dragDistanceRef.current > 50) {
      prevSlide();
    } else if (dragDistanceRef.current < -50) {
      nextSlide();
    }
  };

  // Calculate 3D transformation for each card relative to active index
  const getCardTransform = (index: number) => {
    // Relative offset [-2, -1, 0, 1, 2]
    let offset = (index - activeIndex) % totalProjects;
    if (offset > totalProjects / 2) offset -= totalProjects;
    if (offset < -totalProjects / 2) offset += totalProjects;

    const isActive = offset === 0;
    const isAdjacent = Math.abs(offset) === 1;
    const isDistant = Math.abs(offset) >= 2;

    // Curved arc calculations
    const rotateY = offset * -28; // Degree of rotation along cylinder
    const translateX = offset * 280; // Horizontal spread in px
    const translateZ = isActive ? 120 : isAdjacent ? -40 : -180; // Depth in px
    const scale = isActive ? 1.05 : isAdjacent ? 0.88 : 0.74;
    const opacity = isActive ? 1 : isAdjacent ? 0.75 : 0.45;
    const zIndex = 30 - Math.abs(offset) * 10;
    const brightness = isActive ? 100 : isAdjacent ? 85 : 65;

    return {
      style: {
        transform: `perspective(1200px) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex,
        filter: `brightness(${brightness}%)`,
      },
      isActive,
      offset,
    };
  };

  return (
    <section
      id="projects-carousel-section"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none overflow-hidden"
    >
      {/* 3D Carousel Stage */}
      <div
        id="carousel-stage"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-[380px] sm:h-[440px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {projects.map((project, index) => {
          const { style, isActive } = getCardTransform(index);

          return (
            <div
              key={project.id}
              id={`carousel-card-${project.id}`}
              onClick={() => {
                if (isActive) {
                  onSelectProject(project);
                } else {
                  setActiveIndex(index);
                }
              }}
              style={style}
              className={`absolute w-[290px] sm:w-[360px] md:w-[410px] aspect-[16/11] rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-500 ease-out cursor-pointer overflow-hidden ${
                isActive
                  ? 'bg-slate-950 text-white shadow-[0_20px_60px_rgba(99,102,241,0.25)] ring-2 ring-indigo-500/80 border border-indigo-400/40'
                  : 'bg-slate-900 text-slate-300 shadow-xl border border-slate-800'
              }`}
            >
              {/* Background Thumbnail Image with dark gradient overlay */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-40 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-purple-500/20" />
                )}
              </div>

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 text-[11px] font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                  {project.featured ? 'Featured Project' : project.category}
                </span>

                <button
                  id={`card-action-${project.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject(project);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-slate-800/80 text-slate-400'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="relative z-10 mt-auto">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5 drop-shadow-sm">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4 font-normal">
                  {project.tagline}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 text-[11px] font-medium rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/60 backdrop-blur-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Navigation Buttons */}
        <button
          id="carousel-btn-prev"
          aria-label="Previous Project"
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg border border-slate-700/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          id="carousel-btn-next"
          aria-label="Next Project"
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg border border-slate-700/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Curved Rotary Platform Base */}
      <div className="relative -mt-4 sm:-mt-6 flex flex-col items-center">
        {/* Glow Curved Arc */}
        <div className="w-[85%] max-w-4xl h-8 rounded-[100%] bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent blur-sm" />
        <div className="w-[70%] max-w-2xl h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent -mt-4" />

        {/* Rotary Pagination Dots */}
        <div id="carousel-dots" className="flex items-center gap-2 mt-4">
          {projects.map((_, idx) => (
            <button
              key={idx}
              id={`carousel-dot-${idx}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === idx
                  ? 'w-6 h-2 bg-indigo-600'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
