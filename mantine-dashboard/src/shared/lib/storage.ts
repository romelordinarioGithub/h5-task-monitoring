export const APP_STORAGE_KEY = 'aw-md-storage';

export type StorageValue = {
  sessionExpiration: number | null;
  token: string | null;
  email: string | null;
  themeMode: 'light' | 'dark';
};

const EMPTY_STORAGE: StorageValue = {
  sessionExpiration: null,
  token: null,
  email: null,
  themeMode: 'light',
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function normalizeStorageValue(parsed: unknown): StorageValue {
  const value = (parsed ?? {}) as Partial<StorageValue> & { expiration?: unknown };

  return {
    sessionExpiration: Number.isFinite(value.sessionExpiration)
      ? Number(value.sessionExpiration)
      : Number.isFinite(value.expiration)
        ? Number(value.expiration)
        : null,
    token: typeof value.token === 'string' ? value.token : null,
    email: typeof value.email === 'string' ? value.email : null,
    themeMode: value.themeMode === 'dark' ? 'dark' : 'light',
  };
}

function readStorage(): StorageValue {
  if (!isBrowser()) {
    return EMPTY_STORAGE;
  }

  try {
    const raw = window.localStorage.getItem(APP_STORAGE_KEY);
    if (!raw) return EMPTY_STORAGE;

    return normalizeStorageValue(JSON.parse(raw));
  } catch {
    return EMPTY_STORAGE;
  }
}

function writeStorage(nextValue: StorageValue): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(nextValue));
}

export function getStorage(): StorageValue {
  return readStorage();
}

export function setStorage(patch: Partial<StorageValue>): StorageValue {
  const current = readStorage();
  const nextValue = { ...current, ...patch };
  writeStorage(nextValue);
  return nextValue;
}

export function clearStorage(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(APP_STORAGE_KEY);
}
