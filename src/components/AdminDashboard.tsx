import React, { useState, useEffect } from 'react';
import {
  User,
  FolderKanban,
  Code2,
  Briefcase,
  Mail,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
  LogOut,
  RefreshCw,
  Database,
  Eye,
  X,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem, SkillItem, ExperienceItem, ContactMessage } from '../types';

export const AdminDashboard: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const {
    profile,
    projects,
    skills,
    experience,
    dbStatus,
    adminToken,
    adminUser,
    loginAdmin,
    logoutAdmin,
    updateAdminCredentials,
    refreshData,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addExperience,
    updateExperience,
    deleteExperience,
    resetToDefaults,
    reconnectDatabase,
  } = usePortfolio();

  const [isReconnecting, setIsReconnecting] = useState(false);

  // Authentication form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showSetupHint, setShowSetupHint] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active CMS tab
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'experience' | 'messages' | 'settings'>('profile');

  // Notification toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Contact messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    greeting: '',
    titlePrefix: '',
    titleHighlight: '',
    titleSuffix: '',
    tagline: '',
    bio: '',
    email: '',
    location: '',
    status: '',
    avatar: '',
    resumeUrl: '',
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        greeting: profile.greeting || '',
        titlePrefix: profile.titlePrefix || 'Creative Developer Building',
        titleHighlight: profile.titleHighlight || 'Digital',
        titleSuffix: profile.titleSuffix || 'Experiences',
        tagline: profile.tagline || '',
        bio: profile.bio || '',
        email: profile.email || '',
        location: profile.location || '',
        status: profile.status || 'Available for work',
        avatar: profile.avatar || '',
        resumeUrl: profile.resumeUrl || '',
      });
    }
  }, [profile]);

  // Project Modal / Edit state
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    category: '',
    tagline: '',
    description: '',
    image: '',
    tagsString: '',
    year: '2024',
    featured: true,
    liveUrl: '',
    githubUrl: '',
    keyFeaturesString: '',
    metricsString: '',
  });

  // Skill Modal / Edit state
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillForm, setSkillForm] = useState({
    id: '',
    name: '',
    level: 85,
    category: 'frontend',
    experience: '3+ years',
  });

  // Experience Modal / Edit state
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [experienceForm, setExperienceForm] = useState({
    id: '',
    role: '',
    company: '',
    location: '',
    type: 'Full-time',
    period: '',
    isCurrent: false,
    description: '',
    techString: '',
  });

  // Settings: Admin Credential Update State
  const [credForm, setCredForm] = useState({
    currentPassword: '',
    newEmail: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [credLoading, setCredLoading] = useState(false);

  useEffect(() => {
    if (adminUser?.email) {
      setCredForm((prev) => ({ ...prev, newEmail: adminUser.email }));
    }
  }, [adminUser]);

  // Fetch messages if authenticated and in messages tab
  useEffect(() => {
    if (adminToken && activeTab === 'messages') {
      fetchMessages();
    }
  }, [adminToken, activeTab]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/contact', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch {
      showToast('Could not load messages', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showToast('Message deleted');
      }
    } catch {
      showToast('Failed to delete message', 'error');
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);

    const result = await loginAdmin(emailInput, passwordInput);
    setIsAuthenticating(false);

    if (result.success) {
      showToast('Admin CMS unlocked successfully!');
    } else {
      setAuthError(result.error || 'Invalid email or password');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    showToast('Signed out of Admin CMS');
  };

  // Save profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(profileForm);
    if (success) {
      showToast('Profile information updated in MongoDB!');
    } else {
      showToast('Failed to save profile. Check connection.', 'error');
    }
  };

  // Open Project Modal
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      id: '',
      title: '',
      category: 'Web App',
      tagline: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      tagsString: 'React, Tailwind CSS, TypeScript',
      year: new Date().getFullYear().toString(),
      featured: true,
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      keyFeaturesString: 'Feature 1\nFeature 2\nFeature 3',
      metricsString: 'Active Users: 10,000+\nLatency: <50ms',
    });
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setProjectForm({
      id: proj.id,
      title: proj.title,
      category: proj.category,
      tagline: proj.tagline,
      description: proj.description,
      image: proj.image,
      tagsString: (proj.tags || []).join(', '),
      year: proj.year,
      featured: proj.featured,
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      keyFeaturesString: (proj.keyFeatures || []).join('\n'),
      metricsString: (proj.metrics || []).map((m) => `${m.label}: ${m.value}`).join('\n'),
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = projectForm.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const keyFeatures = projectForm.keyFeaturesString
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const metrics = projectForm.metricsString
      .split('\n')
      .map((line) => {
        const parts = line.split(':');
        return {
          label: (parts[0] || '').trim(),
          value: (parts[1] || '').trim(),
        };
      })
      .filter((m) => m.label && m.value);

    const payload: Partial<ProjectItem> = {
      title: projectForm.title,
      category: projectForm.category,
      tagline: projectForm.tagline,
      description: projectForm.description,
      image: projectForm.image,
      tags,
      year: projectForm.year,
      featured: projectForm.featured,
      liveUrl: projectForm.liveUrl,
      githubUrl: projectForm.githubUrl,
      keyFeatures,
      metrics,
    };

    let success = false;
    if (editingProject) {
      success = await updateProject(editingProject.id, payload);
    } else {
      payload.id = projectForm.id || projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      success = await addProject(payload);
    }

    if (success) {
      showToast(editingProject ? 'Project updated in MongoDB!' : 'New project published to MongoDB!');
      setIsProjectModalOpen(false);
    } else {
      showToast('Error saving project.', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    const success = await deleteProject(id);
    if (success) {
      showToast('Project deleted.');
    } else {
      showToast('Failed to delete project.', 'error');
    }
  };

  // Open Skill Modal
  const openNewSkillModal = () => {
    setEditingSkill(null);
    setSkillForm({
      id: '',
      name: '',
      level: 85,
      category: 'frontend',
      experience: '3+ years',
    });
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: SkillItem) => {
    setEditingSkill(skill);
    setSkillForm({
      id: skill.id,
      name: skill.name,
      level: skill.level,
      category: skill.category || 'frontend',
      experience: skill.experience || '3+ years',
    });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<SkillItem> = {
      name: skillForm.name,
      level: Number(skillForm.level),
      category: skillForm.category,
      experience: skillForm.experience,
      icon: 'Code',
    };

    let success = false;
    if (editingSkill) {
      success = await updateSkill(editingSkill.id, payload);
    } else {
      payload.id = skillForm.id || skillForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      success = await addSkill(payload);
    }

    if (success) {
      showToast(editingSkill ? 'Skill updated!' : 'Skill added to MongoDB!');
      setIsSkillModalOpen(false);
    } else {
      showToast('Error saving skill.', 'error');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    const success = await deleteSkill(id);
    if (success) {
      showToast('Skill deleted.');
    } else {
      showToast('Failed to delete skill.', 'error');
    }
  };

  // Open Experience Modal
  const openNewExperienceModal = () => {
    setEditingExperience(null);
    setExperienceForm({
      id: '',
      role: '',
      company: '',
      location: 'Remote',
      type: 'Full-time',
      period: '2023 – Present',
      isCurrent: true,
      description: '',
      techString: 'React, TypeScript, Tailwind CSS',
    });
    setIsExperienceModalOpen(true);
  };

  const openEditExperienceModal = (exp: ExperienceItem) => {
    setEditingExperience(exp);
    setExperienceForm({
      id: exp.id,
      role: exp.role,
      company: exp.company,
      location: exp.location,
      type: exp.type,
      period: exp.period,
      isCurrent: exp.isCurrent ?? false,
      description: exp.description,
      techString: (exp.technologies || []).join(', '),
    });
    setIsExperienceModalOpen(true);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    const technologies = experienceForm.techString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<ExperienceItem> = {
      role: experienceForm.role,
      company: experienceForm.company,
      location: experienceForm.location,
      type: experienceForm.type,
      period: experienceForm.period,
      isCurrent: experienceForm.isCurrent,
      description: experienceForm.description,
      technologies,
    };

    let success = false;
    if (editingExperience) {
      success = await updateExperience(editingExperience.id, payload);
    } else {
      payload.id = `exp-${Date.now()}`;
      success = await addExperience(payload);
    }

    if (success) {
      showToast(editingExperience ? 'Experience updated!' : 'Experience record saved!');
      setIsExperienceModalOpen(false);
    } else {
      showToast('Failed saving experience item.', 'error');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career item?')) return;
    const success = await deleteExperience(id);
    if (success) {
      showToast('Experience entry deleted.');
    } else {
      showToast('Failed to delete experience.', 'error');
    }
  };

  // Reset database
  const handleResetData = async () => {
    if (!confirm('Reset all collections to initial portfolio seed data? This will overwrite recent modifications.')) return;
    const success = await resetToDefaults();
    if (success) {
      showToast('Database reset and re-seeded successfully!');
    } else {
      showToast('Failed to reset database.', 'error');
    }
  };

  // Handle Admin Credentials Update in Settings
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credForm.currentPassword) {
      showToast('Please enter your current password', 'error');
      return;
    }

    if (credForm.newPassword) {
      if (credForm.newPassword.length < 6) {
        showToast('New password must be at least 6 characters', 'error');
        return;
      }
      if (credForm.newPassword !== credForm.confirmNewPassword) {
        showToast('New password and confirmation do not match', 'error');
        return;
      }
    }

    setCredLoading(true);
    const result = await updateAdminCredentials(
      credForm.currentPassword,
      credForm.newEmail,
      credForm.newPassword || undefined
    );
    setCredLoading(false);

    if (result.success) {
      showToast('Admin email and password updated in database!');
      setCredForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    } else {
      showToast(result.error || 'Failed updating admin credentials', 'error');
    }
  };

  // 1. Unauthenticated Login Screen
  if (!adminToken) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 font-sans">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </button>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>CMS Admin</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Sign In</h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with your admin email and password to manage the portfolio
            </p>
          </div>

          {/* Initial Setup Helper (Collapsible) */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowSetupHint(!showSetupHint)}
              className="text-[11px] text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer mx-auto"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showSetupHint ? 'Hide initial setup credentials' : 'First time signing in? Click for default credentials'}</span>
            </button>

            {showSetupHint && (
              <div className="mt-2 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 animate-fade-in">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Default Email: <code className="text-indigo-300 font-mono font-bold bg-slate-900 px-1 py-0.5 rounded">admin@portfolio.com</code>
                  <br />
                  Default Password: <code className="text-indigo-300 font-mono font-bold bg-slate-900 px-1 py-0.5 rounded">admin123</code>
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-indigo-500/20">
                  <span className="text-[10px] text-slate-400">Change these in CMS Settings!</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput('admin@portfolio.com');
                      setPasswordInput('admin123');
                    }}
                    className="text-[11px] text-indigo-300 hover:text-white font-semibold underline cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
              </div>
            )}
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@portfolio.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {isAuthenticating ? 'Signing In...' : 'Sign In to CMS Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin CMS Dashboard
  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white border border-emerald-400/30'
              : 'bg-rose-600 text-white border border-rose-400/30'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-base">
              M
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white">Portfolio CMS</span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                {adminUser?.email ? `Logged in as ${adminUser.email}` : 'MongoDB Dynamic Management'}
              </span>
            </div>
          </div>

          {/* Database indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              dbStatus.isMongo
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{dbStatus.database}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Portfolio</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-xs font-medium text-slate-300 hover:text-rose-300 border border-slate-700/80 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-60 flex-shrink-0">
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Bio</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4" />
                <span>Projects</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4" />
                <span>Skills</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                {skills.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'experience'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Experience</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                {experience.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Inquiries</span>
              </div>
              {messages.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-[10px] text-emerald-400">
                  {messages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & Account</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-950/60 rounded-3xl border border-slate-800 p-5 sm:p-7 shadow-xl">
          {/* TAB 1: PROFILE & BIO */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Profile & Bio Information</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Controls hero headline, personal bio, contact info, and avatar image.
                  </p>
                </div>
                <button
                  onClick={refreshData}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Hero Greeting Pill Text
                    </label>
                    <input
                      type="text"
                      value={profileForm.greeting}
                      onChange={(e) => setProfileForm({ ...profileForm, greeting: e.target.value })}
                      placeholder="Hi, I'm Alex Rivera"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Headline Prefix
                    </label>
                    <input
                      type="text"
                      value={profileForm.titlePrefix}
                      onChange={(e) => setProfileForm({ ...profileForm, titlePrefix: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gradient Highlight Word
                    </label>
                    <input
                      type="text"
                      value={profileForm.titleHighlight}
                      onChange={(e) => setProfileForm({ ...profileForm, titleHighlight: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Headline Suffix
                    </label>
                    <input
                      type="text"
                      value={profileForm.titleSuffix}
                      onChange={(e) => setProfileForm({ ...profileForm, titleSuffix: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tagline (Hero Summary)
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.tagline}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Bio (About Section)
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Availability Status
                    </label>
                    <input
                      type="text"
                      value={profileForm.status}
                      onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Avatar Image URL
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    {profileForm.avatar && (
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                        <img
                          src={profileForm.avatar}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile to MongoDB</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Projects Management</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add, edit, or delete projects. Items with "Featured" enabled appear in the 3D rotary carousel.
                  </p>
                </div>
                <button
                  onClick={openNewProjectModal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No projects in database. Click "Add Project" to publish one.
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700/60">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white truncate">{proj.title}</h4>
                            {proj.featured && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                                Featured
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400">{proj.year}</span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{proj.tagline}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {(proj.tags || []).map((t, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => openEditProjectModal(proj)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === 'skills' && (
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Skills & Competencies</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage technical proficiencies and mastery levels displayed on your portfolio matrix.
                  </p>
                </div>
                <button
                  onClick={openNewSkillModal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-white truncate">{skill.name}</span>
                        <span className="text-xs font-mono font-bold text-indigo-400">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                          {skill.category}
                        </span>
                        {skill.experience && (
                          <span className="text-[11px] text-slate-500">{skill.experience}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => openEditSkillModal(skill)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Experience & Career</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Maintain work history, roles, companies, and achievements.
                  </p>
                </div>
                <button
                  onClick={openNewExperienceModal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-3">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                        <span className="text-xs text-indigo-400">@ {exp.company}</span>
                        {exp.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{exp.period}</span>
                        <span>•</span>
                        <span>{exp.location}</span>
                        <span>•</span>
                        <span>{exp.type}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{exp.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(exp.technologies || []).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => openEditExperienceModal(exp)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INQUIRIES / MESSAGES */}
          {activeTab === 'messages' && (
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Contact Form Inquiries</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Messages submitted by visitors through the contact modal.
                  </p>
                </div>
                <button
                  onClick={fetchMessages}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Refresh messages"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {loadingMessages ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No contact messages received yet. Submit one from the portfolio contact form to test!
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{msg.name}</span>
                          <span className="text-xs text-indigo-400">&lt;{msg.email}&gt;</span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                          {msg.message}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS & ACCOUNT CREDENTIALS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="pb-5 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">Settings & Admin Credentials</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your admin login email & password, inspect storage engine health, or re-seed default data.
                </p>
              </div>

              {/* Editable Admin Email & Password Section */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Admin Account Credentials</h3>
                    <p className="text-xs text-slate-400">
                      Change the email and password used to access this CMS dashboard.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpdateCredentials} className="space-y-4 max-w-xl text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Admin Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={credForm.newEmail}
                      onChange={(e) => setCredForm({ ...credForm, newEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Current Password (Required to make changes)
                    </label>
                    <input
                      type="password"
                      required
                      value={credForm.currentPassword}
                      onChange={(e) => setCredForm({ ...credForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <p className="text-[11px] text-slate-400 mb-3">
                      Leave new password blank if you only want to change your email address.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          New Password (optional)
                        </label>
                        <input
                          type="password"
                          value={credForm.newPassword}
                          onChange={(e) => setCredForm({ ...credForm, newPassword: e.target.value })}
                          placeholder="Min 6 characters"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={credForm.confirmNewPassword}
                          onChange={(e) => setCredForm({ ...credForm, confirmNewPassword: e.target.value })}
                          placeholder="Re-enter new password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={credLoading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>{credLoading ? 'Saving...' : 'Update Admin Credentials'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Database Status Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span>Storage Engine Status</span>
                  </h3>
                  <button
                    type="button"
                    disabled={isReconnecting}
                    onClick={async () => {
                      setIsReconnecting(true);
                      const ok = await reconnectDatabase();
                      setIsReconnecting(false);
                      if (ok) {
                        showToast('Connected to MongoDB Atlas successfully!');
                      } else {
                        showToast('MongoDB connection failed. Check Atlas IP whitelist.', 'error');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isReconnecting ? 'animate-spin' : ''}`} />
                    <span>{isReconnecting ? 'Testing...' : 'Test / Reconnect'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-300 space-y-2">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Active Storage:</span>
                    <span className="font-semibold text-white">{dbStatus.database}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Mongoose Connection:</span>
                    <span className={dbStatus.isMongo ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                      {dbStatus.isMongo ? '● Connected & Synchronized' : '○ In-Memory Mirror (Safe Fallback)'}
                    </span>
                  </div>
                  {dbStatus.maskedUri && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Configured URI:</span>
                      <span className="font-mono text-[11px] text-slate-300">{dbStatus.maskedUri}</span>
                    </div>
                  )}

                  {!dbStatus.isMongo && dbStatus.mongoUriConfigured && (
                    <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                      <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Why is it running in In-Memory mode?</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                        Your <code className="text-amber-300 font-mono">MONGODB_URI</code> is detected, but MongoDB Atlas rejected the connection.
                      </p>
                      {dbStatus.lastError && (
                        <div className="p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-rose-300 mb-2 break-all">
                          {dbStatus.lastError}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-300 leading-relaxed space-y-1">
                        <p className="font-semibold text-amber-300">How to allow connections from MongoDB Atlas:</p>
                        <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
                          <li>Log in to <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">MongoDB Atlas</a></li>
                          <li>In the left sidebar under <strong>Security</strong>, click <strong>Network Access</strong></li>
                          <li>Click <strong>Add IP Address</strong></li>
                          <li>Choose <strong>Allow Access From Anywhere</strong> (<code className="text-indigo-300">0.0.0.0/0</code>)</li>
                          <li>Click <strong>Confirm</strong>, wait ~1 minute, then click <strong>Test / Reconnect</strong> above!</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reset to Default Seed */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span>Reset & Seed Database</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Restore all profile information, sample projects, skills, and experience to default demo data.
                </p>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Reset All to Default Seed
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PROJECT ADD/EDIT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    placeholder="Fintech & Analytics, Travel, etc."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Short Tagline</label>
                <input
                  type="text"
                  required
                  value={projectForm.tagline}
                  onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                  placeholder="One sentence description"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    required
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Year</label>
                  <input
                    type="text"
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={projectForm.tagsString}
                  onChange={(e) => setProjectForm({ ...projectForm, tagsString: e.target.value })}
                  placeholder="React, TypeScript, Tailwind CSS, MongoDB"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Live URL</label>
                  <input
                    type="text"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Key Features (one per line)
                </label>
                <textarea
                  rows={3}
                  value={projectForm.keyFeaturesString}
                  onChange={(e) => setProjectForm({ ...projectForm, keyFeaturesString: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Metrics (e.g. Active Users: 45,000+ [one per line])
                </label>
                <textarea
                  rows={2}
                  value={projectForm.metricsString}
                  onChange={(e) => setProjectForm({ ...projectForm, metricsString: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured-checkbox" className="font-semibold text-slate-300 cursor-pointer">
                  Feature in 3D Rotary Carousel (Highlights top portfolio work)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL ADD/EDIT MODAL */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setIsSkillModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. React, MongoDB, TypeScript"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Proficiency Level ({skillForm.level}%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="styling">Styling / UI</option>
                  <option value="devops">DevOps</option>
                  <option value="tools">Tools / Core</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Experience Note</label>
                <input
                  type="text"
                  value={skillForm.experience}
                  onChange={(e) => setSkillForm({ ...skillForm, experience: e.target.value })}
                  placeholder="e.g. 4+ years"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE ADD/EDIT MODAL */}
      {isExperienceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingExperience ? 'Edit Career Entry' : 'Add Experience Item'}
              </h3>
              <button
                onClick={() => setIsExperienceModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Job Role</label>
                  <input
                    type="text"
                    required
                    value={experienceForm.role}
                    onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                    placeholder="Senior Frontend Developer"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                    placeholder="TechNova"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={experienceForm.location}
                    onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                    placeholder="Remote / SF"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Type</label>
                  <input
                    type="text"
                    value={experienceForm.type}
                    onChange={(e) => setExperienceForm({ ...experienceForm, type: e.target.value })}
                    placeholder="Full-time"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Period</label>
                  <input
                    type="text"
                    value={experienceForm.period}
                    onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                    placeholder="Jan 2023 – Present"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Role Description</label>
                <textarea
                  rows={3}
                  required
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={experienceForm.techString}
                  onChange={(e) => setExperienceForm({ ...experienceForm, techString: e.target.value })}
                  placeholder="React, TypeScript, Tailwind CSS"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="current-job"
                  checked={experienceForm.isCurrent}
                  onChange={(e) => setExperienceForm({ ...experienceForm, isCurrent: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="current-job" className="font-semibold text-slate-300 cursor-pointer">
                  Current Position
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsExperienceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
