import { AuthSession } from '@/lib/models/auth';

const AUTH_STORAGE_KEY = 'dive-pro-admin-auth';

export function loadStoredAuth(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawSession) return null;

  try {
    const session = JSON.parse(rawSession) as AuthSession;
    if (!session.accessToken || !session.email || !session.expiresAt) return null;
    if (Number.isNaN(Date.parse(session.expiresAt)) || new Date(session.expiresAt) <= new Date()) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function saveStoredAuth(session: AuthSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
