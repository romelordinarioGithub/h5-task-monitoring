import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { env } from '@/shared/config/env';
import {
  clearAuthStorage,
  getSessionExpiration,
  getStoredEmail,
  persistSession,
} from '@/features/auth/services/authStorage';
import { firebaseAuth } from '@/shared/lib/firebase';

type AuthUser = {
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loginError: string;
  authLoading: boolean;
  signInLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const googleProvider = useMemo(() => {
    const provider = new GoogleAuthProvider();

    if (env.allowedEmailDomain) {
      provider.setCustomParameters({ hd: env.allowedEmailDomain });
    }

    return provider;
  }, []);

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;

    const email = getStoredEmail();
    return email ? { email } : null;
  });

  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [signInLoading, setSignInLoading] = useState(false);

  const logoutTimerRef = useRef<number | null>(null);
  const loginInProgressRef = useRef(false);

  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const forceLogout = useCallback(async () => {
    clearLogoutTimer();
    setUser(null);
    setLoginError('');
    clearAuthStorage();

    try {
      await signOut(firebaseAuth);
    } catch {
      // local cleanup already completed
    }
  }, [clearLogoutTimer]);

  const scheduleAutoLogout = useCallback(
    (sessionExpiration: number) => {
      clearLogoutTimer();

      const remainingMs = sessionExpiration - Date.now();

      if (remainingMs <= 0) {
        void forceLogout();
        return;
      }

      logoutTimerRef.current = window.setTimeout(() => {
        void forceLogout();
      }, remainingMs);
    },
    [clearLogoutTimer, forceLogout],
  );

  const isAllowedEmail = useCallback((email: string | null | undefined) => {
    if (!email) return false;
    if (!env.allowedEmailDomain) return true;
    return email.trim().toLowerCase().endsWith(`@${env.allowedEmailDomain}`);
  }, []);

  const applySession = useCallback(
    (nextUser: AuthUser) => {
      const sessionExpiration = Date.now() + SESSION_MAX_AGE_MS;
      persistSession(nextUser.email, sessionExpiration);
      scheduleAutoLogout(sessionExpiration);
      setUser(nextUser);
      setLoginError('');
    },
    [scheduleAutoLogout],
  );

  const logout = useCallback(async () => {
    await forceLogout();
  }, [forceLogout]);

  const loginWithGoogle = useCallback(async () => {
    setLoginError('');
    setSignInLoading(true);
    loginInProgressRef.current = true;

    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const email = result.user.email || '';

      if (!isAllowedEmail(email)) {
        await signOut(firebaseAuth);
        loginInProgressRef.current = false;
        setLoginError(
          env.allowedEmailDomain
            ? `Please sign in with your @${env.allowedEmailDomain} Google account.`
            : 'Unauthorized account.',
        );
        return;
      }

      applySession({
        email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
    } catch (error: any) {
      const code = String(error?.code || '');

      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request' ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        try {
          await setPersistence(firebaseAuth, browserLocalPersistence);
          await signInWithRedirect(firebaseAuth, googleProvider);
          return;
        } catch (redirectError: any) {
          loginInProgressRef.current = false;
          setLoginError(redirectError?.message || 'Google sign-in failed.');
          return;
        }
      }

      if (code !== 'auth/popup-closed-by-user') {
        setLoginError(error?.message || 'Google sign-in failed.');
      }

      loginInProgressRef.current = false;
    } finally {
      setSignInLoading(false);
    }
  }, [applySession, googleProvider, isAllowedEmail]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loginError,
      authLoading,
      signInLoading,
      loginWithGoogle,
      logout,
    }),
    [authLoading, loginError, loginWithGoogle, logout, signInLoading, user],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      try {
        if (!nextUser?.email) {
          loginInProgressRef.current = false;
          clearLogoutTimer();
          setUser(null);
          clearAuthStorage();
          return;
        }

        if (!isAllowedEmail(nextUser.email)) {
          loginInProgressRef.current = false;
          await forceLogout();
          setLoginError(
            env.allowedEmailDomain
              ? `Please sign in with your @${env.allowedEmailDomain} Google account.`
              : 'Unauthorized account.',
          );
          return;
        }

        const sessionExpiration = getSessionExpiration();

        if (!sessionExpiration) {
          if (loginInProgressRef.current) {
            applySession({
              email: nextUser.email,
              displayName: nextUser.displayName,
              photoURL: nextUser.photoURL,
            });
            loginInProgressRef.current = false;
            return;
          }

          await forceLogout();
          return;
        }

        if (Date.now() >= sessionExpiration) {
          loginInProgressRef.current = false;
          await forceLogout();
          return;
        }

        scheduleAutoLogout(sessionExpiration);
        loginInProgressRef.current = false;
        setUser({
          email: nextUser.email,
          displayName: nextUser.displayName,
          photoURL: nextUser.photoURL,
        });
      } finally {
        setAuthLoading(false);
        setSignInLoading(false);
      }
    });

    return () => {
      unsubscribe();
      clearLogoutTimer();
    };
  }, [applySession, clearLogoutTimer, forceLogout, isAllowedEmail, scheduleAutoLogout]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'aw-md-storage') return;

      const sessionExpiration = getSessionExpiration();
      const email = getStoredEmail();

      if (!email || !sessionExpiration || Date.now() >= sessionExpiration) {
        void forceLogout();
        return;
      }

      setUser({ email });
      scheduleAutoLogout(sessionExpiration);
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [forceLogout, scheduleAutoLogout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
