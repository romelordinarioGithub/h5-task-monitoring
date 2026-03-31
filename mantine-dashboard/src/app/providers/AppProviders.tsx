import type { PropsWithChildren } from 'react'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { appTheme } from '@/shared/config/theme'
import { AuthProvider } from '@/features/auth/providers/AuthProvider'
import { ThemeModeProvider } from '@/app/providers/ThemeModeProvider'

function MantineProviders({ children }: PropsWithChildren) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider theme={appTheme} forceColorScheme="light">
        <AuthProvider>{children}</AuthProvider>
      </MantineProvider>
    </>
  )
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeModeProvider>
      <MantineProviders>{children}</MantineProviders>
    </ThemeModeProvider>
  )
}
