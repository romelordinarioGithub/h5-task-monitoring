import {
  Badge,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconArrowUpRight, IconMoonStars, IconSun } from '@tabler/icons-react';

type DashboardHeroSectionProps = {
  isDark: boolean;
  onToggleMode: () => void;
};

export function DashboardHeroSection({
  isDark,
  onToggleMode,
}: DashboardHeroSectionProps) {
  return (
    <Paper className="hero-card" p="xl" radius="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text className="section-kicker">Operations Workspace</Text>
          <Group gap="sm" align="center" wrap="nowrap">
            <Title order={1}>Team Dashboard</Title>
            <Badge size="lg" variant="light" color="violet" radius="xl">
              3 items need attention
            </Badge>
          </Group>
          <Text mt="sm" c="dimmed" maw={720}>
            A cleaner daily workspace for checking task volume, reviewing current work,
            and tracking team capacity.
          </Text>
        </div>
        <Stack gap="md" align="flex-end" className="hero-actions">
          <UnstyledButton
            className="hero-mode-toggle hero-mode-toggle--icon"
            onClick={onToggleMode}
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
          <Badge
            component="a"
            href={import.meta.env.VITE_ADWEAVE_URL}
            target="_blank"
            rel="noreferrer"
            leftSection={<IconArrowUpRight size={14} />}
            size="lg"
            color="grape"
            radius="md"
            style={{ cursor: 'pointer' }}
          >
            To Ad-weave
          </Badge>
        </Stack>
      </Group>
    </Paper>
  );
}
