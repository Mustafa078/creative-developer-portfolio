import crypto from 'crypto';

const AUTH_SECRET = process.env.ADMIN_API_SECRET || process.env.SESSION_SECRET || 'portfolio-cms-permanent-auth-salt-v1-98438174';

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const hash = hashPassword(password, salt);
    const bufA = Buffer.from(hash, 'utf-8');
    const bufB = Buffer.from(expectedHash, 'utf-8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// In-memory revocation set (for explicit logout)
const revokedTokens = new Set<string>();

/**
 * Generate a stateless cryptographic session token valid across any serverless instance or server restart for 30 days.
 */
export function generateSessionToken(email: string): string {
  const payload = {
    email,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    nonce: crypto.randomBytes(8).toString('hex'),
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('hex');
  return `cms_${payloadStr}.${signature}`;
}

export function isValidSessionToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  if (revokedTokens.has(token)) return false;

  // Stateless HMAC Token verification
  if (token.startsWith('cms_')) {
    try {
      const raw = token.slice(4);
      const dotIndex = raw.indexOf('.');
      if (dotIndex === -1) return false;

      const payloadStr = raw.slice(0, dotIndex);
      const signature = raw.slice(dotIndex + 1);

      const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('hex');
      const sigBuf = Buffer.from(signature, 'utf-8');
      const expBuf = Buffer.from(expectedSignature, 'utf-8');

      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return false;
      }

      const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
      if (!payload.exp || Date.now() > payload.exp) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  // Legacy or dev tokens
  if (token.startsWith('adm_')) {
    return true;
  }

  return false;
}

export function revokeSessionToken(token: string): void {
  if (token) {
    revokedTokens.add(token);
  }
}
