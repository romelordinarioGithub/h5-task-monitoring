import { AppShell, Box, Grid, Stack } from '@mantine/core';
import { HeroSection } from '../sections/HeroSection';
import { KPISnapshotSection } from '../sections/KPISnapshotSection';
import { TicketClosedSection } from '../sections/TicketClosedSection';
import { RecentUpdatesSection } from '../sections/RecentUpdatesSection';
import { TaskViewSection } from '../sections/TaskViewSection';
import { FocusedViewSection } from '../sections/FocusedViewSection';
import { TeamCapacitySection } from '../sections/TeamCapacitySection';
import { DashboardProvider, useDashboard } from '../providers/DashboardProvider';
import { dashboardTeams } from '../services/dashboard.config';
import { SidebarSection } from '@/features/navigation/SidebarSection';
import { useThemeMode } from '@/app/providers/ThemeModeProvider';
import './DashboardApp.css';

function DashboardAppContent() {
  const { isDark, toggleMode } = useThemeMode();
  const { sidebarCollapsed, setSidebarCollapsed, selectedTeam, setSelectedTeam } =
    useDashboard();

  return (
    <AppShell
      className={`dashboard-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${isDark ? 'theme-dark' : ''}`}
      navbar={{ width: sidebarCollapsed ? 92 : 292, breakpoint: 'md' }}
      padding="lg"
    >
      <SidebarSection
        teams={dashboardTeams}
        selectedTeam={selectedTeam}
        sidebarCollapsed={sidebarCollapsed}
        onSelectTeam={setSelectedTeam}
        onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
      />

      <AppShell.Main className="dashboard-main-area">
        <HeroSection isDark={isDark} onToggleMode={toggleMode} />

        <Grid mt="lg">
          <KPISnapshotSection />
          <TicketClosedSection />
          <RecentUpdatesSection />
        </Grid>

        <Box mt="lg" className="dashboard-work-layout">
          <TaskViewSection />

          <Box className="dashboard-work-side">
            <Box className="dashboard-side-measure">
              <Stack className="dashboard-side-stack">
                <FocusedViewSection />
                <TeamCapacitySection />
              </Stack>
            </Box>
          </Box>
        </Box>
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
