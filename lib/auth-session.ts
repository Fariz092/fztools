export interface UserSession {
  username: string;
  initials: string;
  avatarColor: string;
  registeredAt: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bannerType?: 'video' | 'image';
  isVerified?: boolean;
  stats?: {
    quotesCreated: number;
    conversions: number;
    memesGenerated: number;
  };
}

const AUTH_STORAGE_KEY = 'fztools_user_session';
export const AUTH_CHANGE_EVENT = 'fztools_auth_change';

const AVATAR_COLORS = [
  'bg-lime-400 text-black',
  'bg-yellow-300 text-black',
  'bg-pink-400 text-black',
  'bg-cyan-300 text-black',
  'bg-orange-400 text-black',
  'bg-emerald-400 text-black',
  'bg-violet-400 text-white',
];

export function computeInitials(username: string): string {
  const clean = username.trim().replace(/^@+/, '');
  if (!clean) return 'FZ';
  const parts = clean.split(/[._\s-]+/).filter(Boolean);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (clean.length === 1) return clean.toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

export function pickAvatarColor(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getStoredUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function saveUserSession(session: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: session }));
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: null }));
}
