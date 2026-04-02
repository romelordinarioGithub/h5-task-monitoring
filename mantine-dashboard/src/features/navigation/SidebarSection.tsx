import {
  AppShell,
  Badge,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconDeviceDesktop, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import type {
  DashboardTeamConfig,
  DashboardTeamKey,
} from '@/features/dashboard/services/dashboard.types';
import './SidebarSection.css';

type SidebarSectionProps = {
  teams: DashboardTeamConfig[];
  selectedTeam: DashboardTeamKey;
  sidebarCollapsed: boolean;
  onSelectTeam: (team: DashboardTeamKey) => void;
  onToggleSidebar: () => void;
};

export function SidebarSection({
  teams,
  selectedTeam,
  sidebarCollapsed,
  onSelectTeam,
  onToggleSidebar,
}: SidebarSectionProps) {
  return (
    <AppShell.Navbar className="dashboard-navbar">
      <AppShell.Section p="md">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ThemeIcon size={38} radius="md" variant="light" color="grape">
              <IconDeviceDesktop size={20} />
            </ThemeIcon>
            <div className="brand-copy">
              <Text className="dashboard-brand-kicker">AdWeave</Text>
              <Title order={3} className="dashboard-brand-title">
                Monitoring
              </Title>
            </div>
          </Group>

          <UnstyledButton
            className={
              sidebarCollapsed ? 'sidebar-toggle-collapsed' : 'sidebar-toggle-expanded'
            }
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            title={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            <ThemeIcon variant="subtle" color="gray" radius="md">
              <IconLayoutSidebarLeftExpand size={18} />
            </ThemeIcon>
          </UnstyledButton>
        </Group>
      </AppShell.Section>

      <AppShell.Section grow p="md">
        <Text className="sidebar-label">Teams</Text>

        <Stack gap="xs" mt="sm">
          {teams.map((team) => {
            const isActive = team.key === selectedTeam;

            return (
              <Paper
                key={team.key}
                className={`team-card ${isActive ? 'is-active' : ''} ${team.disabled ? 'is-disabled' : ''}`}
                p="sm"
                radius="md"
                title={team.name}
                onClick={() => {
                  if (!team.disabled) {
                    onSelectTeam(team.key);
                  }
                }}
                style={{ cursor: team.disabled ? 'not-allowed' : 'pointer' }}
              >
                <Group gap="sm">
                  <ThemeIcon
                    radius="md"
                    variant={isActive ? 'filled' : 'light'}
                    color={team.disabled ? 'gray' : isActive ? 'grape' : 'gray'}
                  >
                    <team.icon size={16} />
                  </ThemeIcon>

                  <Text fw={600} className="team-card-label">
                    {team.name}
                  </Text>

                  {team.disabled ? (
                    <Badge
                      className="team-card-badge"
                      size="xs"
                      variant="light"
                      color="gray"
                      radius="xl"
                      ml="auto"
                    >
                      Soon
                    </Badge>
                  ) : null}
                </Group>
              </Paper>
            );
          })}
        </Stack>
      </AppShell.Section>

      <AppShell.Section p="md">
        <Paper className="sidebar-foot" p="md" radius="md">
          <Badge color="grape" variant="light" radius="xl">
            {teams.length} teams
          </Badge>
          <Text mt="sm" size="sm" c="dimmed">
            Internal navigation for monitoring ownership and team views.
          </Text>
        </Paper>
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
