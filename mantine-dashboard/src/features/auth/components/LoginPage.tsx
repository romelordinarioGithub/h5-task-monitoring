import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconDeviceDesktop, IconMoonStars, IconSun } from '@tabler/icons-react';
import { useAuth } from '../providers/AuthProvider';
import { useThemeMode } from '@/app/providers/ThemeModeProvider';
import '@/features/dashboard/components/DashboardApp.css';
import './LoginPage.css';
import { env } from '@/shared/config/env';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.27-2.09 3.57-5.17 3.57-8.64Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.76-2.1-6.7-4.93H1.3v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.32A7.2 7.2 0 0 1 4.92 12c0-.8.14-1.57.38-2.32v-3.1H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.42l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.33.6 4.57 1.76l3.43-3.43C17.94 1.15 15.24 0 12 0A12 12 0 0 0 1.3 6.58l4 3.1c.93-2.83 3.57-4.91 6.7-4.91Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { loginWithGoogle, loginError, signInLoading, authLoading } = useAuth();
  const { isDark, toggleMode } = useThemeMode();

  return (
    <Box className={`dashboard-shell login-shell ${isDark ? 'theme-dark' : ''}`}>
      <Box className="login-layout">
        <Paper className="login-brand-panel" p="xl" radius="md">
          <Group justify="space-between" align="flex-start">
            <Group gap="sm">
              <ThemeIcon size={42} radius="md" variant="light" color="grape">
                <IconDeviceDesktop size={22} />
              </ThemeIcon>
              <div>
                <Text className="dashboard-brand-kicker">AdWeave</Text>
                <Title order={2} className="dashboard-brand-title">
                  Monitoring
                </Title>
              </div>
            </Group>
            <UnstyledButton
              className="hero-mode-toggle hero-mode-toggle--icon"
              onClick={toggleMode}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to night mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to night mode'}
            >
              <ThemeIcon
                variant="light"
                color={isDark ? 'yellow' : 'grape'}
                radius="md"
                size={28}
              >
                {isDark ? <IconSun size={15} /> : <IconMoonStars size={15} />}
              </ThemeIcon>
            </UnstyledButton>
          </Group>

          <Stack gap="md" mt="xl">
            <Text className="section-kicker login-kicker">Operations Workspace</Text>
            <Title order={1} className="login-title">
              Sign in to H5 Task Monitoring
            </Title>
            <Text c="dimmed" maw={460} className="login-copy">
              Access the internal dashboard for task visibility, current workload, and
              team capacity review.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 3 }} mt="xl" spacing="sm">
            <Paper className="login-preview-card" p="md" radius="md">
              <Text className="section-kicker">Task Queue</Text>
              <Title order={3}>Task visibility</Title>
              <Text c="dimmed" size="sm">
                Review queued work, filters, and focused task details after sign-in.
              </Text>
            </Paper>
            <Paper className="login-preview-card" p="md" radius="md">
              <Text className="section-kicker">Delivery</Text>
              <Title order={3}>Delivery tracking</Title>
              <Text c="dimmed" size="sm">
                Follow ticket closure progress and recent activity updates in one place.
              </Text>
            </Paper>
            <Paper className="login-preview-card" p="md" radius="md">
              <Text className="section-kicker">Capacity</Text>
              <Title order={3}>Team capacity</Title>
              <Text c="dimmed" size="sm">
                Check available dev resources once access is granted.
              </Text>
            </Paper>
          </SimpleGrid>
        </Paper>

        <Card withBorder radius="md" padding="xl" className="login-card">
          <Text className="section-kicker">Google Access</Text>
          <Title order={2} mt={6}>
            Continue with your Google email
          </Title>
          <Text c="dimmed" mt="sm">
            Sign in with your authorized Google account. Sessions expire automatically
            after 12 hours.
          </Text>

          <Stack gap="md" mt={60}>
            <Button
              size="md"
              radius="md"
              color="grape"
              leftSection={
                signInLoading ? <Loader size="xs" color="gray" /> : <GoogleMark />
              }
              onClick={() => void loginWithGoogle()}
              disabled={signInLoading || authLoading}
            >
              {signInLoading ? 'Verifying company account...' : 'Continue with Google'}
            </Button>

            {loginError ? (
              <Text size="sm" c="red">
                {loginError}
              </Text>
            ) : null}

            <Text size="sm" c="dimmed">
              Only authorized @{env.allowedEmailDomain} accounts should be allowed.
            </Text>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
