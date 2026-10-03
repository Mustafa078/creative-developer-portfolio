import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PersonalInfo, ProjectItem, SkillItem, ExperienceItem, ServiceItem } from '../types';

interface PortfolioContextType {
  profile: PersonalInfo | null;
  projects: ProjectItem[];
  skills: SkillItem[];
  experience: ExperienceItem[];
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
  dbStatus: {
    database: string;
    isMongo: boolean;
    mongoUriConfigured?: boolean;
    maskedUri?: string | null;
    lastError?: string | null;
  };
  reconnectDatabase: () => Promise<boolean>;
  adminToken: string | null;
  adminUser: { email: string } | null;
  setAdminToken: (token: string | null) => void;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  updateAdminCredentials: (
    currentPassword: string,
    newEmail: string,
    newPassword?: string
  ) => Promise<{ success: boolean; error?: string }>;
  refreshData: () => Promise<void>;
  updateProfile: (data: Partial<PersonalInfo>) => Promise<boolean>;
  addProject: (data: Partial<ProjectItem>) => Promise<boolean>;
  updateProject: (id: string, data: Partial<ProjectItem>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  addSkill: (data: Partial<SkillItem>) => Promise<boolean>;
  updateSkill: (id: string, data: Partial<SkillItem>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
  addExperience: (data: Partial<ExperienceItem>) => Promise<boolean>;
  updateExperience: (id: string, data: Partial<ExperienceItem>) => Promise<boolean>;
  deleteExperience: (id: string) => Promise<boolean>;
  sendContactMessage: (msg: { name: string; email: string; message: string }) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PersonalInfo | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{ database: string; isMongo: boolean }>({
    database: 'Checking...',
    isMongo: false,
  });

  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    return localStorage.getItem('portfolio_cms_admin_token') || null;
  });

  const [adminUser, setAdminUser] = useState<{ email: string } | null>(() => {
    const saved = localStorage.getItem('portfolio_cms_admin_email');
    return saved ? { email: saved } : null;
  });

  const setAdminToken = (token: string | null) => {
    setAdminTokenState(token);
    if (token) {
      localStorage.setItem('portfolio_cms_admin_token', token);
    } else {
      localStorage.removeItem('portfolio_cms_admin_token');
      localStorage.removeItem('portfolio_cms_admin_email');
      setAdminUser(null);
    }
  };

  const getHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }
    return headers;
  }, [adminToken]);

  // Fetch admin credentials if token exists
  useEffect(() => {
    if (adminToken) {
      fetch('/api/admin/credentials', {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          if (res.status === 401) {
            throw new Error('UNAUTHORIZED');
          }
          return null;
        })
        .then((data) => {
          if (data?.email) {
            setAdminUser({ email: data.email });
            localStorage.setItem('portfolio_cms_admin_email', data.email);
          }
        })
        .catch((err) => {
          if (err.message === 'UNAUTHORIZED') {
            setAdminToken(null);
          }
        });
    }
  }, [adminToken]);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profRes, projRes, skillsRes, expRes, servRes, statusRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/projects'),
        fetch('/api/skills'),
        fetch('/api/experience'),
        fetch('/api/services'),
        fetch('/api/status'),
      ]);

      if (profRes.ok) setProfile(await profRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (expRes.ok) setExperience(await expRes.json());
      if (servRes.ok) setServices(await servRes.json());
      if (statusRes.ok) {
        const s = await statusRes.json();
        setDbStatus({
          database: s.database,
          isMongo: s.isMongo,
          mongoUriConfigured: s.mongoUriConfigured,
          maskedUri: s.maskedUri,
          lastError: s.lastError,
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch portfolio data from MongoDB API:', err);
      setError('Unable to fetch portfolio data from API. Please verify server.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reconnectDatabase = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/database/reconnect', {
        method: 'POST',
        headers: getHeaders(),
      });
      const data = await res.json();
      setDbStatus({
        database: data.database,
        isMongo: data.isMongo,
        mongoUriConfigured: data.mongoUriConfigured,
        maskedUri: data.maskedUri,
        lastError: data.lastError,
      });
      if (data.isMongo) {
        await refreshData();
      }
      return data.isMongo;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        setAdminUser({ email: data.admin?.email || email });
        localStorage.setItem('portfolio_cms_admin_email', data.admin?.email || email);
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch {
      return { success: false, error: 'Could not contact server' };
    }
  };

  const logoutAdmin = async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } catch {
        // ignore
      }
    }
    setAdminToken(null);
  };

  const updateAdminCredentials = async (
    currentPassword: string,
    newEmail: string,
    newPassword?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ currentPassword, newEmail, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          setAdminToken(data.token);
        }
        if (data.admin?.email) {
          setAdminUser({ email: data.admin.email });
          localStorage.setItem('portfolio_cms_admin_email', data.admin.email);
        }
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed updating admin credentials' };
    } catch {
      return { success: false, error: 'Network error updating credentials' };
    }
  };

  const updateProfile = async (data: Partial<PersonalInfo>): Promise<boolean> => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resData = await res.json();
        setProfile(resData.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addProject = async (data: Partial<ProjectItem>): Promise<boolean> => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateProject = async (id: string, data: Partial<ProjectItem>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addSkill = async (data: Partial<SkillItem>): Promise<boolean> => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateSkill = async (id: string, data: Partial<SkillItem>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addExperience = async (data: Partial<ExperienceItem>): Promise<boolean> => {
    try {
      const res = await fetch('/api/experience', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateExperience = async (id: string, data: Partial<ExperienceItem>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/experience/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteExperience = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        setExperience((prev) => prev.filter((e) => e.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const sendContactMessage = async (msg: { name: string; email: string; message: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const resetToDefaults = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: getHeaders(),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        skills,
        experience,
        services,
        loading,
        error,
        dbStatus,
        adminToken,
        adminUser,
        setAdminToken,
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
        sendContactMessage,
        resetToDefaults,
        reconnectDatabase,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
