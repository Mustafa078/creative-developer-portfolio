import { Router, Request, Response } from 'express';
import { isDbConnected, memoryStore, resetDatabaseToDefaults, getDbDiagnostics, connectDB } from '../db.js';
import { ProfileModel } from '../models/Profile.js';
import { ProjectModel } from '../models/Project.js';
import { SkillModel } from '../models/Skill.js';
import { ExperienceModel } from '../models/Experience.js';
import { ContactMessageModel } from '../models/ContactMessage.js';
import { AdminUserModel } from '../models/AdminUser.js';
import {
  generateSalt,
  hashPassword,
  verifyPassword,
  generateSessionToken,
  isValidSessionToken,
  revokeSessionToken,
} from '../auth.js';

export const apiRouter = Router();

// Middleware to check admin token
const requireAdmin = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || (req.headers['x-admin-token'] as string) || (req.query.token as string);

  if (token && isValidSessionToken(token)) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Session invalid or expired. Please sign in.' });
};

// Helper to get current admin record
async function getAdminRecord() {
  if (isDbConnected()) {
    let admin = await (AdminUserModel as any).findOne();
    if (!admin) {
      admin = await (AdminUserModel as any).create({
        email: memoryStore.admin.email,
        passwordHash: memoryStore.admin.passwordHash,
        salt: memoryStore.admin.salt,
      });
    }
    return admin;
  }
  return memoryStore.admin;
}

// --- SYSTEM & STATUS ---
apiRouter.get('/status', (req: Request, res: Response) => {
  const diagnostics = getDbDiagnostics();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    ...diagnostics,
  });
});

apiRouter.post('/database/reconnect', async (req: Request, res: Response) => {
  try {
    const connected = await connectDB();
    const diagnostics = getDbDiagnostics();
    res.json({
      success: connected,
      message: connected ? 'Connected to MongoDB Atlas successfully!' : 'MongoDB connection failed',
      ...diagnostics,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADMIN AUTHENTICATION WITH EDITABLE EMAIL & PASSWORD ---

apiRouter.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const admin = await getAdminRecord();

    const isEmailValid = admin.email.toLowerCase().trim() === email.toLowerCase().trim();
    const isPasswordValid = verifyPassword(password, admin.salt, admin.passwordHash);

    if (isEmailValid && isPasswordValid) {
      const token = generateSessionToken(admin.email);
      return res.json({
        success: true,
        token,
        admin: { email: admin.email },
        message: 'Authenticated successfully',
      });
    }

    return res.status(401).json({ success: false, error: 'Invalid admin email or password' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/admin/credentials', requireAdmin, async (req: Request, res: Response) => {
  try {
    const admin = await getAdminRecord();
    return res.json({ email: admin.email });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/credentials', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ success: false, error: 'Current password is required to make security updates' });
    }

    const admin = await getAdminRecord();

    // Verify current password
    if (!verifyPassword(currentPassword, admin.salt, admin.passwordHash)) {
      return res.status(403).json({ success: false, error: 'Incorrect current password' });
    }

    const updatedEmail = newEmail ? newEmail.trim() : admin.email;
    let newSalt = admin.salt;
    let newHash = admin.passwordHash;

    if (newPassword && newPassword.trim().length > 0) {
      if (newPassword.trim().length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long' });
      }
      newSalt = generateSalt();
      newHash = hashPassword(newPassword.trim(), newSalt);
    }

    // Update in-memory store
    memoryStore.admin.email = updatedEmail;
    memoryStore.admin.salt = newSalt;
    memoryStore.admin.passwordHash = newHash;

    // Update in MongoDB
    if (isDbConnected()) {
      await (AdminUserModel as any).findOneAndUpdate(
        {},
        {
          email: updatedEmail,
          salt: newSalt,
          passwordHash: newHash,
        },
        { upsert: true }
      );
    }

    // Generate fresh session token
    const token = generateSessionToken(updatedEmail);

    return res.json({
      success: true,
      message: 'Admin credentials successfully updated in database',
      token,
      admin: { email: updatedEmail },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (token) {
    revokeSessionToken(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

apiRouter.post('/seed', requireAdmin, async (req: Request, res: Response) => {
  try {
    await resetDatabaseToDefaults();
    res.json({ success: true, message: 'Database reset and seeded with initial portfolio items' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROFILE CRUD ---
apiRouter.get('/profile', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      let profile = await (ProfileModel as any).findOne();
      if (!profile) {
        profile = await (ProfileModel as any).create(memoryStore.profile);
      }
      return res.json(profile);
    }
    return res.json(memoryStore.profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message, fallback: memoryStore.profile });
  }
});

apiRouter.put('/profile', requireAdmin, async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    memoryStore.profile = { ...memoryStore.profile, ...updateData };

    if (isDbConnected()) {
      const updated = await (ProfileModel as any).findOneAndUpdate({}, updateData, { new: true, upsert: true });
      return res.json({ success: true, data: updated });
    }
    return res.json({ success: true, data: memoryStore.profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROJECTS CRUD ---
apiRouter.get('/projects', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const projects = await (ProjectModel as any).find().sort({ order: 1, createdAt: -1 });
      return res.json(projects);
    }
    return res.json(memoryStore.projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message, fallback: memoryStore.projects });
  }
});

apiRouter.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const project = await (ProjectModel as any).findOne({ id });
      if (!project) return res.status(404).json({ error: 'Project not found' });
      return res.json(project);
    }
    const project = memoryStore.projects.find((p) => p.id === id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    return res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/projects', requireAdmin, async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    if (!projectData.id) {
      projectData.id = projectData.title ? projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `proj-${Date.now()}`;
    }

    const existingIndex = memoryStore.projects.findIndex((p) => p.id === projectData.id);
    if (existingIndex >= 0) {
      memoryStore.projects[existingIndex] = { ...memoryStore.projects[existingIndex], ...projectData };
    } else {
      memoryStore.projects.unshift(projectData);
    }

    if (isDbConnected()) {
      const created = await (ProjectModel as any).create(projectData);
      return res.status(201).json({ success: true, data: created });
    }
    return res.status(201).json({ success: true, data: projectData });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const index = memoryStore.projects.findIndex((p) => p.id === id);
    if (index >= 0) {
      memoryStore.projects[index] = { ...memoryStore.projects[index], ...updateData };
    }

    if (isDbConnected()) {
      const updated = await (ProjectModel as any).findOneAndUpdate({ id }, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: 'Project not found' });
      return res.json({ success: true, data: updated });
    }

    if (index === -1) return res.status(404).json({ error: 'Project not found' });
    return res.json({ success: true, data: memoryStore.projects[index] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    memoryStore.projects = memoryStore.projects.filter((p) => p.id !== id);

    if (isDbConnected()) {
      await (ProjectModel as any).findOneAndDelete({ id });
    }
    return res.json({ success: true, message: 'Project removed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- SKILLS CRUD ---
apiRouter.get('/skills', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const skills = await (SkillModel as any).find().sort({ order: 1, level: -1 });
      return res.json(skills);
    }
    return res.json(memoryStore.skills);
  } catch (err: any) {
    res.status(500).json({ error: err.message, fallback: memoryStore.skills });
  }
});

apiRouter.post('/skills', requireAdmin, async (req: Request, res: Response) => {
  try {
    const skillData = req.body;
    if (!skillData.id) {
      skillData.id = skillData.name ? skillData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `skill-${Date.now()}`;
    }

    memoryStore.skills.push(skillData);

    if (isDbConnected()) {
      const created = await (SkillModel as any).create(skillData);
      return res.status(201).json({ success: true, data: created });
    }
    return res.status(201).json({ success: true, data: skillData });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/skills/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const index = memoryStore.skills.findIndex((s) => s.id === id);
    if (index >= 0) {
      memoryStore.skills[index] = { ...memoryStore.skills[index], ...updateData };
    }

    if (isDbConnected()) {
      const updated = await (SkillModel as any).findOneAndUpdate({ id }, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: 'Skill not found' });
      return res.json({ success: true, data: updated });
    }

    if (index === -1) return res.status(404).json({ error: 'Skill not found' });
    return res.json({ success: true, data: memoryStore.skills[index] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/skills/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    memoryStore.skills = memoryStore.skills.filter((s) => s.id !== id);

    if (isDbConnected()) {
      await (SkillModel as any).findOneAndDelete({ id });
    }
    return res.json({ success: true, message: 'Skill deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- EXPERIENCE CRUD ---
apiRouter.get('/experience', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const experience = await (ExperienceModel as any).find().sort({ order: 1, createdAt: -1 });
      return res.json(experience);
    }
    return res.json(memoryStore.experience);
  } catch (err: any) {
    res.status(500).json({ error: err.message, fallback: memoryStore.experience });
  }
});

apiRouter.post('/experience', requireAdmin, async (req: Request, res: Response) => {
  try {
    const expData = req.body;
    if (!expData.id) {
      expData.id = `exp-${Date.now()}`;
    }
    memoryStore.experience.unshift(expData);

    if (isDbConnected()) {
      const created = await (ExperienceModel as any).create(expData);
      return res.status(201).json({ success: true, data: created });
    }
    return res.status(201).json({ success: true, data: expData });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/experience/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const index = memoryStore.experience.findIndex((e) => e.id === id);
    if (index >= 0) {
      memoryStore.experience[index] = { ...memoryStore.experience[index], ...updateData };
    }

    if (isDbConnected()) {
      const updated = await (ExperienceModel as any).findOneAndUpdate({ id }, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: 'Experience entry not found' });
      return res.json({ success: true, data: updated });
    }

    if (index === -1) return res.status(404).json({ error: 'Experience entry not found' });
    return res.json({ success: true, data: memoryStore.experience[index] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/experience/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    memoryStore.experience = memoryStore.experience.filter((e) => e.id !== id);

    if (isDbConnected()) {
      await (ExperienceModel as any).findOneAndDelete({ id });
    }
    return res.json({ success: true, message: 'Experience item deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- SERVICES ---
apiRouter.get('/services', (req: Request, res: Response) => {
  res.json(memoryStore.services);
});

// --- CONTACT INQUIRIES ---
apiRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    memoryStore.contactMessages.unshift(newMessage);

    if (isDbConnected()) {
      await (ContactMessageModel as any).create({ name, email, message, read: false });
    }

    return res.status(201).json({ success: true, message: 'Message recorded successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/contact', requireAdmin, async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const messages = await (ContactMessageModel as any).find().sort({ createdAt: -1 });
      return res.json(messages);
    }
    return res.json(memoryStore.contactMessages);
  } catch (err: any) {
    res.status(500).json({ error: err.message, fallback: memoryStore.contactMessages });
  }
});

apiRouter.delete('/contact/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    memoryStore.contactMessages = memoryStore.contactMessages.filter((m) => m.id !== id);

    if (isDbConnected()) {
      await (ContactMessageModel as any).findByIdAndDelete(id);
    }
    return res.json({ success: true, message: 'Message removed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
