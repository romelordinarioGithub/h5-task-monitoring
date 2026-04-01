import type { PropsWithChildren } from 'react';
import AuthLoader from '@/features/auth/components/AuthLoader';
import LoginPage from '@/features/auth/components/LoginPage';
import { useAuth } from '@/features/auth/providers/AuthProvider';

export default function ProtectedView({ children }: PropsWithChildren) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <AuthLoader />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
