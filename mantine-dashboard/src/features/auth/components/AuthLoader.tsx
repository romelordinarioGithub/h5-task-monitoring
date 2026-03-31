import { Center, Loader, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconShieldLock } from '@tabler/icons-react';
import { useThemeMode } from '@/app/providers/ThemeModeProvider';
import '@/features/dashboard/components/DashboardApp.css';

export default function AuthLoader() {
  const { isDark } = useThemeMode();

  return (
    <Center
      className={`dashboard-shell ${isDark ? 'theme-dark' : ''}`}
      style={{ minHeight: '100vh' }}
    >
      <Stack align="center" gap="md">
        <ThemeIcon size={60} radius="md" variant="light" color="grape">
          <IconShieldLock size={30} />
        </ThemeIcon>
        <Loader color="grape" type="dots" size="lg" />
        <Text c="dimmed" size="md">
          Restoring session...
        </Text>
      </Stack>
    </Center>
  );
}
