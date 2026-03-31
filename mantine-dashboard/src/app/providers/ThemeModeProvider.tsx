import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { getAppStorage, setAppStorage } from '@/shared/lib/appStorage'

export type ThemeMode = 'light' | 'dark'

type ThemeModeContextValue = {
  mode: ThemeMode
  isDark: boolean
  toggleMode: () => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    return getAppStorage().themeMode
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isDark = mode === 'dark'

    setAppStorage({ themeMode: mode })
    document.documentElement.classList.toggle('theme-dark', isDark)
  }, [mode])

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      toggleMode: () => setMode((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [mode],
  )

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext)

  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider')
  }

  return context
}
