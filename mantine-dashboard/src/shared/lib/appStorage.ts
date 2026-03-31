export const APP_STORAGE_KEY = 'aw-md-storage'

export type AppStorageValue = {
  expiration: number | null
  token: string | null
  email: string | null
  themeMode: 'light' | 'dark'
}

const EMPTY_STORAGE: AppStorageValue = {
  expiration: null,
  token: null,
  email: null,
  themeMode: 'light',
}

function readStorage(): AppStorageValue {
  if (typeof window === 'undefined') {
    return EMPTY_STORAGE
  }

  try {
    const raw = window.localStorage.getItem(APP_STORAGE_KEY)
    if (!raw) return EMPTY_STORAGE

    const parsed = JSON.parse(raw)
    return {
      expiration: Number.isFinite(parsed?.expiration) ? parsed.expiration : null,
      token: typeof parsed?.token === 'string' ? parsed.token : null,
      email: typeof parsed?.email === 'string' ? parsed.email : null,
      themeMode: parsed?.themeMode === 'dark' ? 'dark' : 'light',
    }
  } catch {
    return EMPTY_STORAGE
  }
}

function writeStorage(nextValue: AppStorageValue): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(nextValue))
}

export function getAppStorage(): AppStorageValue {
  return readStorage()
}

export function setAppStorage(patch: Partial<AppStorageValue>): AppStorageValue {
  const current = readStorage()
  const nextValue = { ...current, ...patch }
  writeStorage(nextValue)
  return nextValue
}

export function clearAppStorage(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(APP_STORAGE_KEY)
}

