import { PersonalInfo, ServiceItem, ProjectItem, SkillItem, ExperienceItem, SocialLink } from './types';
import fintrackImg from './assets/images/fintrack_ui_1787296090376.jpg';
import travelistaImg from './assets/images/travelista_ui_1787296109465.jpg';
import studysphereImg from './assets/images/studysphere_ui_1787296128949.jpg';

// Illustrated developer avatar SVG matching the exact style of the uploaded reference
const generalAvatarPlaceholder = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="70%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#090d16" />
    </radialGradient>
    <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <linearGradient id="innerCollar" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>
    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa" />
      <stop offset="100%" stop-color="#fdba74" />
    </linearGradient>
    <clipPath id="avatarCircle">
      <circle cx="150" cy="150" r="148" />
    </clipPath>
  </defs>

  <!-- Circular background -->
  <g clip-path="url(#avatarCircle)">
    <rect width="300" height="300" fill="url(#bgGrad)" />

    <!-- Ambient background ring -->
    <circle cx="150" cy="140" r="115" fill="none" stroke="#6366f1" stroke-width="1.5" opacity="0.3" stroke-dasharray="4,4" />

    <!-- Body / Torso / Shirt -->
    <path d="M70 310 C70 230 105 205 150 205 C195 205 230 230 230 310 Z" fill="url(#shirtGrad)" />
    
    <!-- Shirt Collar details -->
    <polygon points="150,238 126,205 174,205" fill="#1e1b4b" opacity="0.6" />
    <path d="M126 205 L150 242 L132 245 Z" fill="url(#innerCollar)" />
    <path d="M174 205 L150 242 L168 245 Z" fill="url(#innerCollar)" />

    <!-- Neck -->
    <rect x="135" y="172" width="30" height="42" rx="8" fill="#fbcfe8" />
    <rect x="135" y="172" width="30" height="42" rx="8" fill="#fdba74" opacity="0.9" />

    <!-- Ears -->
    <circle cx="106" cy="148" r="14" fill="#fdba74" />
    <circle cx="194" cy="148" r="14" fill="#fdba74" />

    <!-- Head / Face -->
    <ellipse cx="150" cy="145" rx="44" ry="50" fill="url(#skinGrad)" />

    <!-- Eyes -->
    <ellipse cx="134" cy="144" rx="4.5" ry="5" fill="#0f172a" />
    <ellipse cx="166" cy="144" rx="4.5" ry="5" fill="#0f172a" />
    <!-- Eye highlights -->
    <circle cx="132.5" cy="142.5" r="1.5" fill="#ffffff" />
    <circle cx="164.5" cy="142.5" r="1.5" fill="#ffffff" />

    <!-- Eyebrows -->
    <path d="M125 133 Q134 130 142 134" fill="none" stroke="#1e293b" stroke-width="2.8" stroke-linecap="round" />
    <path d="M158 134 Q166 130 175 133" fill="none" stroke="#1e293b" stroke-width="2.8" stroke-linecap="round" />

    <!-- Nose -->
    <path d="M150 145 L148 155 L153 155" fill="none" stroke="#ea580c" stroke-width="1.8" stroke-linecap="round" opacity="0.5" />

    <!-- Smile -->
    <path d="M140 165 Q150 174 160 165" fill="none" stroke="#1e293b" stroke-width="2.6" stroke-linecap="round" />

    <!-- Hair (Styled dark modern cut) -->
    <path d="M102 142 C100 100 120 78 150 78 C185 78 202 100 198 142 C194 116 182 104 150 104 C120 104 106 118 102 142 Z" fill="#0f172a" />
    <path d="M102 135 C110 105 130 92 165 92 C190 92 200 105 198 128 C185 106 160 102 135 110 C120 114 110 124 102 135 Z" fill="#1e293b" />
    <!-- Side hair tufts -->
    <path d="M105 130 L108 148 L114 135 Z" fill="#0f172a" />
    <path d="M195 130 L192 148 L186 135 Z" fill="#0f172a" />
  </g>
</svg>
`)}`;

export const personalInfo: PersonalInfo = {
  name: 'Developer',
  greeting: "Hi, I'm Developer",
  titlePrefix: 'Creative Developer Building',
  titleHighlight: 'Digital',
  titleSuffix: 'Experiences',
  tagline: 'I design and build modern, fast, and accessible web applications with clean code, intuitive interfaces, and engaging interactive experiences.',
  bio: 'Lead front-end architect and UI engineer specializing in high-performance React architectures, interactive design systems, and responsive 3D web experiences.',
  email: 'developer@example.com',
  location: 'Global / Remote',
  status: 'Available for work',
  avatar: generalAvatarPlaceholder,
  resumeUrl: '#',
};

export const services: ServiceItem[] = [
  {
    id: 'web-dev',
    title: 'Web Development',
    shortDesc: 'Scalable, performant web applications',
    fullDesc: 'Custom enterprise web applications, single-page application architectures, sub-second load times, and performance profiling.',
    icon: 'Code2',
    accentColor: 'from-violet-500/20 to-purple-500/10 text-purple-600',
    tags: ['Custom web apps', 'SPA architecture', 'Performance optimization', 'Web Vitals'],
  },
  {
    id: 'frontend-dev',
    title: 'Frontend Development',
    shortDesc: 'Modern interfaces with clean, efficient code',
    fullDesc: 'State-of-the-art UI architectures built with React 19, Next.js App Router, Tailwind CSS, TypeScript, and fluid animations.',
    icon: 'Layout',
    accentColor: 'from-blue-500/20 to-sky-500/10 text-blue-600',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'Interactive UI/UX', 'Framer Motion'],
  },
  {
    id: 'backend-dev',
    title: 'Backend Development',
    shortDesc: 'Robust APIs and secure server-side solutions',
    fullDesc: 'High-throughput RESTful and GraphQL APIs, distributed database schemas, caching layers, and secure authentication flows.',
    icon: 'Server',
    accentColor: 'from-cyan-500/20 to-teal-500/10 text-cyan-700',
    tags: ['REST & GraphQL APIs', 'PostgreSQL', 'Node.js', 'Authentication', 'Microservices'],
  },
  {
    id: 'uiux-design',
    title: 'UI/UX & Interactive Design',
    shortDesc: 'Engaging experiences that connect',
    fullDesc: 'Crafting thoughtful design systems, wireframing user journeys, designing tactile micro-interactions, and component libraries.',
    icon: 'PenTool',
    accentColor: 'from-indigo-500/20 to-pink-500/10 text-indigo-600',
    tags: ['Wireframing', 'Design Systems', 'Micro-animations', 'Component Design'],
  },
];

export const projects: ProjectItem[] = [
  {
    id: 'fintrack',
    title: 'FinTrack Dashboard',
    category: 'Fintech & Analytics',
    tagline: 'Modern financial dashboard with analytics, budgets, and real-time insights.',
    description: 'A comprehensive wealth management platform providing real-time portfolio tracking, AI-assisted budget forecasting, custom metric widgets, and transaction categorization with interactive chart visualizers.',
    image: fintrackImg,
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts'],
    year: '2024',
    featured: true,
    liveUrl: 'https://example.com/fintrack',
    githubUrl: 'https://github.com/example/fintrack',
    metrics: [
      { label: 'Active Users', value: '45,000+' },
      { label: 'Latency', value: '<80ms' },
      { label: 'Crash Rate', value: '0.01%' },
    ],
    keyFeatures: [
      'Real-time streaming portfolio telemetry & market feeds',
      'Dynamic budget forecasting and expense grouping',
      'Sub-millisecond data aggregation via Web Workers',
      'Adaptive light & dark mode interface with export to PDF',
    ],
  },
  {
    id: 'studysphere',
    title: 'StudySphere',
    category: 'EdTech & Collaboration',
    tagline: 'Collaboration platform for students with real-time chat and resources.',
    description: 'A seamless virtual study lounge featuring peer video rooms, markdown notes synchronization, collaborative whiteboard sessions, and an integrated flashcard knowledge graph.',
    image: studysphereImg,
    tags: ['Next.js', 'Socket.io', 'PostgreSQL', 'Tailwind CSS'],
    year: '2024',
    featured: true,
    liveUrl: 'https://example.com/studysphere',
    githubUrl: 'https://github.com/example/studysphere',
    metrics: [
      { label: 'Concurrent Rooms', value: '1,200+' },
      { label: 'Sync Latency', value: '24ms' },
      { label: 'Uptime', value: '99.98%' },
    ],
    keyFeatures: [
      'Low-latency WebSocket multi-user synchronization',
      'Real-time shared markdown document editing with version history',
      'Interactive flashcard study algorithm',
      'Integrated resource repository with smart search',
    ],
  },
  {
    id: 'travelista',
    title: 'Travelista',
    category: 'Travel & Booking',
    tagline: 'Travel booking experience with beautiful UI and smooth interactions.',
    description: 'An immersive travel discovery and itinerary builder featuring fluid spatial animations, interactive map routing, dynamic currency conversion, and instant package reservations.',
    image: travelistaImg,
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Mapbox'],
    year: '2024',
    featured: true,
    liveUrl: 'https://example.com/travelista',
    githubUrl: 'https://github.com/example/travelista',
    metrics: [
      { label: 'Bookings Processed', value: '$2.4M' },
      { label: 'Lighthouse Score', value: '98/100' },
      { label: 'Conversion Lift', value: '+34%' },
    ],
    keyFeatures: [
      'Kinetic page transitions and micro-interaction feedback',
      'Multi-currency live exchange calculation engine',
      'Interactive 3D itinerary map with route checkpoints',
      'Instant offline travel pass caching',
    ],
  },
  {
    id: 'devblog',
    title: 'DevBlog',
    category: 'Content Platform',
    tagline: 'Minimal blog platform for developers with syntax highlighting.',
    description: 'A clean, high-performance publishing platform for engineering teams featuring rich code block execution, reader bookmarks, RSS generation, and automated OG image creation.',
    image: studysphereImg,
    tags: ['Next.js', 'Tailwind CSS', 'MDX', 'TypeScript'],
    year: '2023',
    featured: false,
    liveUrl: 'https://example.com/devblog',
    githubUrl: 'https://github.com/example/devblog',
    metrics: [
      { label: 'Monthly Readers', value: '80,000+' },
      { label: 'Page Load', value: '0.4s' },
    ],
    keyFeatures: [
      'Static-first MDX compilation for ultra-fast reading',
      'Interactive syntax highlighted code sandboxes',
      'Full-text fuzzy search with zero runtime footprint',
    ],
  },
  {
    id: 'taskflow-api',
    title: 'TaskFlow API',
    category: 'Backend Architecture',
    tagline: 'RESTful task management API with authentication & rate-limiting.',
    description: 'A scalable task management service built on Node.js and PostgreSQL with OAuth 2.0, Redis token caching, multi-tenant workspace isolation, and automated webhooks.',
    image: fintrackImg,
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    year: '2023',
    featured: false,
    liveUrl: 'https://example.com/taskflow',
    githubUrl: 'https://github.com/example/taskflow',
    metrics: [
      { label: 'Requests / Sec', value: '15,000' },
      { label: 'Test Coverage', value: '96%' },
    ],
    keyFeatures: [
      'Role-based access control (RBAC) with scoped tokens',
      'Redis-powered token bucket rate limiting',
      'Automated OpenAPI 3.0 documentation generation',
    ],
  },
];

export const skills: SkillItem[] = [
  { id: 'ts', name: 'TypeScript', level: 95, category: 'frontend', icon: 'Code', color: 'from-blue-600 to-indigo-600' },
  { id: 'react', name: 'React', level: 90, category: 'frontend', icon: 'Layers', color: 'from-cyan-500 to-blue-500' },
  { id: 'next', name: 'Next.js', level: 90, category: 'frontend', icon: 'Globe', color: 'from-slate-800 to-slate-600' },
  { id: 'tailwind', name: 'Tailwind CSS', level: 85, category: 'frontend', icon: 'Sparkles', color: 'from-teal-400 to-cyan-500' },
  { id: 'node', name: 'Node.js', level: 85, category: 'backend', icon: 'Server', color: 'from-emerald-500 to-green-600' },
  { id: 'postgres', name: 'PostgreSQL', level: 80, category: 'backend', icon: 'Database', color: 'from-indigo-500 to-blue-600' },
];

export const allSkillsList = [
  { name: 'TypeScript', level: 95, category: 'Frontend', experience: '5+ years' },
  { name: 'React / Next.js', level: 90, category: 'Frontend', experience: '5+ years' },
  { name: 'Tailwind CSS', level: 85, category: 'Styling', experience: '4+ years' },
  { name: 'Node.js & Express', level: 85, category: 'Backend', experience: '4+ years' },
  { name: 'PostgreSQL & Drizzle', level: 80, category: 'Database', experience: '3+ years' },
  { name: 'Framer Motion & Three.js', level: 82, category: 'Animation', experience: '3+ years' },
  { name: 'Docker & CI/CD', level: 78, category: 'DevOps', experience: '3+ years' },
  { name: 'REST & GraphQL APIs', level: 88, category: 'Backend', experience: '4+ years' },
];

export const experienceTimeline: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Senior Frontend Developer',
    company: 'TechNova Solutions',
    location: 'Remote',
    type: 'Full-time',
    period: 'Jan 2023 – Present',
    isCurrent: true,
    description: 'Led architecture and migration of core customer-facing SaaS dashboards to Next.js 14 and React 18, improving Core Web Vitals by 42% and establishing component design systems across 8 squads.',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Turborepo'],
  },
  {
    id: 'exp-2',
    role: 'Frontend Developer',
    company: 'PixelCraft Labs',
    location: 'San Francisco, CA',
    type: 'Full-time',
    period: 'Jul 2021 – Dec 2022',
    isCurrent: false,
    description: 'Engineered high-concurrency client applications, dynamic chart widgets using D3/Recharts, and collaborative canvas interfaces with WebSocket event synchronization.',
    technologies: ['React', 'Redux Toolkit', 'Tailwind CSS', 'D3.js', 'REST APIs'],
  },
  {
    id: 'exp-3',
    role: 'Web Developer Intern',
    company: 'InnovateX',
    location: 'New York, NY',
    type: 'Internship',
    period: 'Jan 2021 – Jun 2021',
    isCurrent: false,
    description: 'Developed responsive landing pages, automated client onboarding workflows, and reduced bundle size by 35% through tree-shaking and lazy-loading optimizations.',
    technologies: ['JavaScript', 'HTML5/CSS3', 'React', 'Git', 'Webpack'],
  },
];

export const socialLinks: SocialLink[] = [
  { platform: 'GitHub', url: 'https://github.com', icon: 'Github', handle: '@developer' },
  { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', handle: 'in/developer' },
  { platform: 'Twitter / X', url: 'https://x.com', icon: 'Twitter', handle: '@dev_engineer' },
  { platform: 'Dribbble', url: 'https://dribbble.com', icon: 'Dribbble', handle: 'developer-ui' },
];
