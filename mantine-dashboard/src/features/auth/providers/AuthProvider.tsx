import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react'
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { env } from '@/shared/config/env'
import { getAppStorage, setAppStorage } from '@/shared/lib/appStorage'
import { firebaseAuth } from '@/shared/lib/firebase'

type AuthUser = {
  email: string
  displayName?: string | null
  photoURL?: string | null
}

type AuthContextValue = {
  user: AuthUser | null
  loginError: string
  authLoading: boolean
  signInLoading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const googleProvider = useMemo(() => {
    const provider = new GoogleAuthProvider()

    if (env.allowedEmailDomain) {
      provider.setCustomParameters({ hd: env.allowedEmailDomain })
    }

    return provider
  }, [])

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null

    const email = getAppStorage().email
    return email ? { email } : null
  })
  const [loginError, setLoginError] = useState('')
  const [authLoading, setAuthLoading] = useState(true)
  const [signInLoading, setSignInLoading] = useState(false)
  const logoutTimerRef = useRef<number | null>(null)
  const loginInProgressRef = useRef(false)

  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current)
      logoutTimerRef.current = null
    }
  }, [])

  const forceLogout = useCallback(async () => {
    clearLogoutTimer()
    setUser(null)
    setLoginError('')
    setAppStorage({ email: null, token: null, expiration: null })

    try {
      await signOut(firebaseAuth)
    } catch {
      // no-op: local cleanup already completed
    }
  }, [clearLogoutTimer])

  const scheduleAutoLogout = useCallback(
    (expiration: number) => {
      clearLogoutTimer()

      const remainingMs = expiration - Date.now()
      if (remainingMs <= 0) {
        void forceLogout()
        return
      }

      logoutTimerRef.current = window.setTimeout(() => {
        void forceLogout()
      }, remainingMs)
    },
    [clearLogoutTimer, forceLogout],
  )

  const isAllowedEmail = useCallback((email: string | null | undefined) => {
    if (!email) return false
    if (!env.allowedEmailDomain) return true
    return email.trim().toLowerCase().endsWith(`@${env.allowedEmailDomain}`)
  }, [])

  const applySession = useCallback(
    (nextUser: { email: string; displayName?: string | null; photoURL?: string | null }) => {
      const expiration = Date.now() + env.sessionMaxAgeMs
      setAppStorage({ email: nextUser.email, expiration })
      scheduleAutoLogout(expiration)
      setUser(nextUser)
      setLoginError('')
    },
    [scheduleAutoLogout],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loginError,
      authLoading,
      signInLoading,
      loginWithGoogle: async () => {
        setLoginError('')
        setSignInLoading(true)
        loginInProgressRef.current = true

        try {
          await setPersistence(firebaseAuth, browserLocalPersistence)
          const result = await signInWithPopup(firebaseAuth, googleProvider)
          const email = result.user.email || ''

          if (!isAllowedEmail(email)) {
            await signOut(firebaseAuth)
            loginInProgressRef.current = false
            setLoginError(
              env.allowedEmailDomain
                ? `Please sign in with your @${env.allowedEmailDomain} Google account.`
                : 'Unauthorized account.',
            )
            return
          }

          applySession({
            email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          })
        } catch (error: any) {
          const code = String(error?.code || '')
          if (
            code === 'auth/popup-blocked' ||
            code === 'auth/popup-closed-by-user' ||
            code === 'auth/cancelled-popup-request' ||
            code === 'auth/operation-not-supported-in-this-environment'
          ) {
            try {
              await setPersistence(firebaseAuth, browserLocalPersistence)
              await signInWithRedirect(firebaseAuth, googleProvider)
              return
            } catch (redirectError: any) {
              loginInProgressRef.current = false
              setLoginError(redirectError?.message || 'Google sign-in failed.')
              return
            }
          }

          if (code !== 'auth/popup-closed-by-user') {
            setLoginError(error?.message || 'Google sign-in failed.')
          }
          loginInProgressRef.current = false
        } finally {
          setSignInLoading(false)
        }
      },
      logout: async () => forceLogout(),
    }),
    [applySession, authLoading, forceLogout, googleProvider, isAllowedEmail, loginError, signInLoading, user],
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      try {
        if (!nextUser?.email) {
          loginInProgressRef.current = false
          clearLogoutTimer()
          setUser(null)
          setAppStorage({ email: null, token: null, expiration: null })
          return
        }

        if (!isAllowedEmail(nextUser.email)) {
          loginInProgressRef.current = false
          await forceLogout()
          setLoginError(
            env.allowedEmailDomain
              ? `Please sign in with your @${env.allowedEmailDomain} Google account.`
              : 'Unauthorized account.',
          )
          return
        }

        const { expiration } = getAppStorage()
        if (!expiration) {
          if (loginInProgressRef.current) {
            applySession({
              email: nextUser.email,
              displayName: nextUser.displayName,
              photoURL: nextUser.photoURL,
            })
            loginInProgressRef.current = false
            return
          }

          await forceLogout()
          return
        }

        if (Date.now() >= expiration) {
          loginInProgressRef.current = false
          await forceLogout()
          return
        }

        scheduleAutoLogout(expiration)
        loginInProgressRef.current = false
        setUser({
          email: nextUser.email,
          displayName: nextUser.displayName,
          photoURL: nextUser.photoURL,
        })
      } finally {
        setAuthLoading(false)
        setSignInLoading(false)
      }
    })

    return () => {
      unsubscribe()
      clearLogoutTimer()
    }
  }, [applySession, clearLogoutTimer, forceLogout, isAllowedEmail, scheduleAutoLogout])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'aw-md-storage') return

      const { expiration } = getAppStorage()
      if (!expiration || Date.now() >= expiration) {
        void forceLogout()
        return
      }

      scheduleAutoLogout(expiration)
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [forceLogout, scheduleAutoLogout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
