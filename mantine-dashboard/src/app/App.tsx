import ProtectedView from '@/features/auth/components/ProtectedView';
import DashboardApp from '@/features/dashboard/components/DashboardApp';

export default function App() {
  return (
    <ProtectedView>
      <DashboardApp />
    </ProtectedView>
  );
}
