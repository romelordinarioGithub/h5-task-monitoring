import { useEffect, useState } from 'react';
import { env } from '@/shared/config/env';
import {
  Badge,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconArrowUpRight, IconMoonStars, IconSun } from '@tabler/icons-react';
import { useDashboard } from '../../providers/DashboardProvider';
import { fetchNeedsAttentionTasks } from '../../services/dashboardQueries';

type HeroSectionProps = {
  isDark: boolean;
  onToggleMode: () => void;
};

export function HeroSection({ isDark, onToggleMode }: HeroSectionProps) {
  const { selectedTeam } = useDashboard();
  const [needsAttentionCount, setNeedsAttentionCount] = useState(0);
  const [isLoadingNeedsAttention, setIsLoadingNeedsAttention] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadNeedsAttention() {
      setIsLoadingNeedsAttention(true);

      try {
        const total = await fetchNeedsAttentionTasks(selectedTeam, controller.signal);
        if (cancelled) return;
        setNeedsAttentionCount(total);
      } catch {
        if (cancelled || controller.signal.aborted) return;
        setNeedsAttentionCount(0);
      } finally {
        if (!cancelled) {
          setIsLoadingNeedsAttention(false);
        }
      }
    }

    void loadNeedsAttention();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedTeam]);

  return (
    <Paper className="hero-card" p="xl" radius="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text className="section-kicker">Operations Workspace</Text>
          <Group gap="sm" align="center" wrap="nowrap">
            <Title order={1}>Team Dashboard</Title>
            {isLoadingNeedsAttention ? (
              <Skeleton height={28} width={168} radius="xl" />
            ) : needsAttentionCount > 0 ? (
              <Badge size="lg" variant="light" color="violet" radius="xl">
                {needsAttentionCount === 1
                  ? `${needsAttentionCount} item needs attention`
                  : `${needsAttentionCount} items need attention`}
              </Badge>
            ) : null}
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
            href={env.adweaveURL}
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
