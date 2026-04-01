import { getStorage, setStorage } from '@/shared/lib/storage';

export function getStoredEmail(): string | null {
  return getStorage().email;
}

export function setStoredEmail(email: string | null): void {
  setStorage({ email });
}

export function getStoredToken(): string | null {
  return getStorage().token;
}

export function setStoredToken(token: string | null): void {
  setStorage({ token });
}

export function clearStoredToken(): void {
  setStorage({ token: null });
}

export function getSessionExpiration(): number | null {
  return getStorage().sessionExpiration;
}

export function setSessionExpiration(sessionExpiration: number | null): void {
  setStorage({ sessionExpiration });
}

export function isSessionExpired(): boolean {
  const sessionExpiration = getSessionExpiration();
  return !!sessionExpiration && Date.now() >= sessionExpiration;
}

export function persistSession(email: string, sessionExpiration: number): void {
  setStorage({
    email,
    sessionExpiration,
  });
}

export function clearAuthStorage(): void {
  const current = getStorage();

  setStorage({
    email: null,
    token: null,
    sessionExpiration: null,
    themeMode: current.themeMode,
  });
}
