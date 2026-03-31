import LoginPage from '@/features/auth/components/LoginPage'
import AuthLoader from '@/features/auth/components/AuthLoader'
import { useAuth } from '@/features/auth/providers/AuthProvider'
import DashboardApp from '@/features/dashboard/components/DashboardApp'

export default function App() {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return <AuthLoader />
  }

  if (!user) {
    return <LoginPage />
  }

  return <DashboardApp />
}
