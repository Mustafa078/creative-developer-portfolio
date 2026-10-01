import crypto from 'crypto';

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
}

// In-memory active session tokens set
const activeTokens = new Set<string>();

export function generateSessionToken(email: string): string {
  const token = `adm_${crypto.randomBytes(24).toString('hex')}_${Date.now()}`;
  activeTokens.add(token);
  return token;
}

export function isValidSessionToken(token: string): boolean {
  if (!token) return false;
  return activeTokens.has(token);
}

export function revokeSessionToken(token: string): void {
  activeTokens.delete(token);
}
