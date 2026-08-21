import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
  glowColor: string;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface ElectronOrbit {
  radiusX: number;
  radiusY: number;
  tilt: number;
  speed: number;
  angle: number;
  color: string;
}

export const AtomicCanvas: React.FC<{
  className?: string;
  interactive?: boolean;
}> = ({ className = '', interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;

    // Explicitly set width & height matching window dimensions
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking state with smooth linear interpolation (lerp) & magnetic attractor
    const mouse = {
      x: width * 0.5,
      y: height * 0.35,
      targetX: width * 0.5,
      targetY: height * 0.35,
      radius: 180, // Mouse connection radius (180px)
      attractionRadius: 160,
      attractionForce: 0.028,
      isActive: false,
      hasMoved: false,
    };

    // Soft cyan, violet, indigo palette tailored for light mode clarity
    const particlePalette = [
      { fill: 'rgba(99, 102, 241, ', glow: 'rgba(99, 102, 241, 0.45)' }, // Indigo
      { fill: 'rgba(168, 85, 247, ', glow: 'rgba(168, 85, 247, 0.45)' }, // Purple / Violet
      { fill: 'rgba(14, 165, 233, ', glow: 'rgba(14, 165, 233, 0.45)' }, // Cyan / Sky
      { fill: 'rgba(20, 184, 166, ', glow: 'rgba(20, 184, 166, 0.40)' }, // Teal
      { fill: 'rgba(129, 140, 248, ', glow: 'rgba(129, 140, 248, 0.45)' }, // Light Indigo
    ];

    // Responsive particle density calculation
    const calculateParticleCount = (w: number, h: number) => {
      const area = w * h;
      return Math.max(35, Math.min(85, Math.floor(area / 14000)));
    };

    let particleCount = calculateParticleCount(width, height);
    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const pChoice = particlePalette[Math.floor(Math.random() * particlePalette.length)];
        const baseR = Math.random() * 2.2 + 2.0; // 2.0px - 4.2px
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          baseRadius: baseR,
          radius: baseR,
          color: pChoice.fill,
          glowColor: pChoice.glow,
          alpha: Math.random() * 0.35 + 0.45,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    };

    initParticles();

    // Mouse orbital electron orbits for cursor atomic center
    const electronOrbits: ElectronOrbit[] = [
      { radiusX: 54, radiusY: 22, tilt: -Math.PI / 4, speed: 0.045, angle: 0, color: '#6366f1' },
      { radiusX: 54, radiusY: 22, tilt: Math.PI / 4, speed: -0.04, angle: Math.PI, color: '#a855f7' },
      { radiusX: 62, radiusY: 25, tilt: 0, speed: 0.05, angle: Math.PI * 0.5, color: '#0ea5e9' },
    ];

    // Window resize handler matching window.innerWidth / window.innerHeight
    const handleResize = () => {
      if (!canvas) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      if (newWidth !== width || newHeight !== height) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
        particleCount = calculateParticleCount(width, height);
        initParticles();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', handleResize, { passive: true });

    // Global window-attached mouse & touch tracking (works across all text, cards, buttons)
    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
      mouse.hasMoved = true;
    };

    const onMouseLeave = () => {
      mouse.isActive = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isActive = true;
        mouse.hasMoved = true;
      }
    };

    if (interactive) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseleave', onMouseLeave);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
    }

    let globalTick = 0;
    const connectionThreshold = 120; // 120px particle-to-particle proximity threshold
    const mouseConnectionRadius = 180; // 180px mouse-to-particle attraction radius

    // Main animation render loop
    const render = () => {
      if (!isRunning) return;

      globalTick += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Smooth linear interpolation (lerp) for cursor follow
      if (mouse.hasMoved) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        mouse.x = width * 0.5 + Math.sin(globalTick * 0.6) * 60;
        mouse.y = height * 0.35 + Math.cos(globalTick * 0.5) * 35;
      }

      // 1. UPDATE PARTICLES & APPLY GRAVITATIONAL MAGNETIC ATTRACTION
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Magnetic attractor towards mouse
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);

        if (distMouse < mouse.attractionRadius && distMouse > 10) {
          const pull = (1 - distMouse / mouse.attractionRadius) * mouse.attractionForce;
          p.vx += (dxMouse / distMouse) * pull;
          p.vy += (dyMouse / distMouse) * pull;
        }

        // Apply damping to stabilize velocities
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Maintain minimum gentle drift
        const speed = Math.hypot(p.vx, p.vy);
        if (speed < 0.15) {
          const angle = Math.random() * Math.PI * 2;
          p.vx += Math.cos(angle) * 0.06;
          p.vy += Math.sin(angle) * 0.06;
        }

        // Advance particle position
        p.x += p.vx;
        p.y += p.vy;

        // Screen boundary wrap around
        const margin = 20;
        if (p.x < -margin) p.x = width + margin;
        if (p.x > width + margin) p.x = -margin;
        if (p.y < -margin) p.y = height + margin;
        if (p.y > height + margin) p.y = -margin;

        // Subtle radius pulsation
        p.pulsePhase += p.pulseSpeed;
        p.radius = p.baseRadius + Math.sin(p.pulsePhase) * 0.6;
      }

      // 2. DRAW CONNECTING LINES BETWEEN ADJACENT PARTICLES (~120px threshold)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionThreshold) {
            // Distance-based fade out with semi-transparent stroke
            const alpha = (1 - dist / connectionThreshold) * 0.25;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // 3. DRAW DYNAMIC CONNECTION LINES FROM MOUSE CURSOR TO NEARBY PARTICLES (~180px radius)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouseConnectionRadius) {
          const lineAlpha = (1 - dist / mouseConnectionRadius) * 0.55;

          const gradient = ctx.createLinearGradient(p.x, p.y, mouse.x, mouse.y);
          gradient.addColorStop(0, `rgba(14, 165, 233, ${lineAlpha * 0.8})`); // Cyan
          gradient.addColorStop(1, `rgba(99, 102, 241, ${lineAlpha})`); // Indigo

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.2 * (1 - dist / mouseConnectionRadius) + 0.4;
          ctx.stroke();

          // Energetic node halo when close to cursor
          if (dist < 80) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 1.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${lineAlpha * 0.45})`;
            ctx.fill();
          }
        }
      }

      // 4. DRAW PARTICLE NODES (ATOMIC NODES WITH GLOWING RADIAL GRADIENTS)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Soft outer glow halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor;
        ctx.fill();

        // Inner solid atomic nucleus
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }

      // 5. DRAW ATOMIC CORE & BOHR ORBITAL RINGS AT MOUSE CURSOR POINT
      const cx = mouse.x;
      const cy = mouse.y;

      // Radiant energy aura around mouse center
      const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      aura.addColorStop(0, 'rgba(99, 102, 241, 0.16)');
      aura.addColorStop(0.5, 'rgba(168, 85, 247, 0.06)');
      aura.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fillStyle = aura;
      ctx.fill();

      // Rotating elliptical Bohr orbital rings
      const rotSpeed = globalTick * 0.3;
      electronOrbits.forEach((orbit, idx) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orbit.tilt + (idx % 2 === 0 ? rotSpeed : -rotSpeed * 0.8));

        ctx.beginPath();
        ctx.ellipse(0, 0, orbit.radiusX, orbit.radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, 0.28)`;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.restore();

        // Electron animation along orbit
        orbit.angle += orbit.speed;
        const currentTilt = orbit.tilt + (idx % 2 === 0 ? rotSpeed : -rotSpeed * 0.8);
        const rawX = Math.cos(orbit.angle) * orbit.radiusX;
        const rawY = Math.sin(orbit.angle) * orbit.radiusY;

        const eX = cx + rawX * Math.cos(currentTilt) - rawY * Math.sin(currentTilt);
        const eY = cy + rawX * Math.sin(currentTilt) + rawY * Math.cos(currentTilt);

        // Draw Electron Particle with glow
        ctx.beginPath();
        ctx.arc(eX, eY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = orbit.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = orbit.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Central Atomic Nucleus
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#6366f1';
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup resources on component unmount
    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseleave', onMouseLeave);
        window.removeEventListener('touchmove', onTouchMove);
      }
    };
  }, [interactive]);

  return (
    <canvas
      id="atomic-particle-canvas"
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 h-full w-full ${className}`.trim()}
    />
  );
};
