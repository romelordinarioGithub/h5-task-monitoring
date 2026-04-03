import { useEffect, type PropsWithChildren } from 'react';
import AuthLoader from '@/features/auth/components/AuthLoader';
import LoginPage from '@/features/auth/components/LoginPage';
import { useAuth } from '@/features/auth/providers/AuthProvider';

function buildAppPath(pathSegment = ''): string {
  const normalizedSegment = String(pathSegment).replace(/^\/+|\/+$/g, '');
  return normalizedSegment ? `/${normalizedSegment}` : '/';
}

function getFirstAppSegment(pathname?: string): string {
  const normalizedPathname = String(pathname ?? '').trim();
  if (!normalizedPathname) return '';

  const [firstSegment = ''] = normalizedPathname
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean);
  return firstSegment.toLowerCase();
}

export default function ProtectedView({ children }: PropsWithChildren) {
  const { user, authLoading } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (authLoading || user) return;

    const firstSegment = getFirstAppSegment(window.location.pathname);
    if (firstSegment === 'login') return;

    const currentSearch = window.location.search ?? '';
    const currentHash = window.location.hash ?? '';
    window.history.replaceState(null, '', `${buildAppPath('login')}${currentSearch}${currentHash}`);
  }, [authLoading, user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (authLoading || !user) return;

    const firstSegment = getFirstAppSegment(window.location.pathname);
    if (firstSegment !== 'login') return;

    const currentSearch = window.location.search ?? '';
    const currentHash = window.location.hash ?? '';
    window.history.replaceState(null, '', `${buildAppPath()}${currentSearch}${currentHash}`);
  }, [authLoading, user]);

  if (authLoading) {
    return <AuthLoader />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
