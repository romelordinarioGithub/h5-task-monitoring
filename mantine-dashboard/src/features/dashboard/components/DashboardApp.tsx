import { AppShell } from '@mantine/core';
import { DashboardHeroSection } from '../sections/DashboardHeroSection';
import { DashboardMetricsSection } from '../sections/DashboardMetricsSection';
import { DashboardWorkSection } from '../sections/DashboardWorkSection';
import { DashboardProvider, useDashboard } from '../providers/DashboardProvider';
import { teams } from '../mock/dashboardData.mock';
import { SidebarSection } from '@/features/navigation/components/SidebarSection';
import { useThemeMode } from '@/app/providers/ThemeModeProvider';
import './DashboardApp.css';

function DashboardAppContent() {
  const { isDark, toggleMode } = useThemeMode();
  const { sidebarCollapsed, setSidebarCollapsed } = useDashboard();

  return (
    <AppShell
      className={`dashboard-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${isDark ? 'theme-dark' : ''}`}
      navbar={{ width: sidebarCollapsed ? 92 : 292, breakpoint: 'md' }}
      padding="lg"
    >
      <SidebarSection
        teams={teams}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
      />

      <AppShell.Main className="dashboard-main-area">
        <DashboardHeroSection isDark={isDark} onToggleMode={toggleMode} />
        <DashboardMetricsSection />
        <DashboardWorkSection />
      </AppShell.Main>
    </AppShell>
  );
}

export default function DashboardApp() {
  return (
    <DashboardProvider>
      <DashboardAppContent />
    </DashboardProvider>
  );
}
