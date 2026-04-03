export const APP_STORAGE_KEY = 'aw-md-storage';

export type TaskFilterStorageValue = {
  channel: string;
  health: string;
  status: string;
  priority: string;
  taskType: string;
};

export type StorageValue = {
  sessionExpiration: number | null;
  token: string | null;
  email: string | null;
  themeMode: 'light' | 'dark';
  teamSlug: string | null;
  taskFilter: TaskFilterStorageValue | null;
};

const EMPTY_STORAGE: StorageValue = {
  sessionExpiration: null,
  token: null,
  email: null,
  themeMode: 'light',
  teamSlug: null,
  taskFilter: null,
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function normalizeTaskFilterValue(value: unknown): TaskFilterStorageValue | null {
  if (!value || typeof value !== 'object') return null;

  const filter = value as Partial<TaskFilterStorageValue>;

  return {
    channel: typeof filter.channel === 'string' ? filter.channel : 'All',
    health: typeof filter.health === 'string' ? filter.health : 'All',
    status: typeof filter.status === 'string' ? filter.status : 'All',
    priority: typeof filter.priority === 'string' ? filter.priority : 'All',
    taskType: typeof filter.taskType === 'string' ? filter.taskType : 'All',
  };
}

function normalizeStorageValue(parsed: unknown): StorageValue {
  const value = (parsed ?? {}) as Partial<StorageValue> & {
    expiration?: unknown;
    dashboardTeamSlug?: unknown;
  };

  return {
    sessionExpiration: Number.isFinite(value.sessionExpiration)
      ? Number(value.sessionExpiration)
      : Number.isFinite(value.expiration)
        ? Number(value.expiration)
        : null,
    token: typeof value.token === 'string' ? value.token : null,
    email: typeof value.email === 'string' ? value.email : null,
    themeMode: value.themeMode === 'dark' ? 'dark' : 'light',
    teamSlug:
      typeof value.teamSlug === 'string'
        ? value.teamSlug
        : typeof value.dashboardTeamSlug === 'string'
          ? value.dashboardTeamSlug
          : null,
    taskFilter: normalizeTaskFilterValue(value.taskFilter),
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

export function clearTaskFilterStorage(): StorageValue {
  return setStorage({ taskFilter: null });
}

export function clearStorage(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(APP_STORAGE_KEY);
}
