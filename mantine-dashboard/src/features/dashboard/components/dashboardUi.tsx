import { Badge, Box, Group, Progress, Text } from '@mantine/core';
import { IconBrandMeta, IconBrandYoutubeFilled } from '@tabler/icons-react';
import type { ReactElement } from 'react';
import { formatChannelLabel, healthConfig } from '../services/dashboard.utils';

const badgeColor: Record<string, string> = {
  healthy: 'teal',
  watch: 'blue',
  risk: 'violet',
  critical: 'pink',
  'not started': 'gray',
  'on hold': 'grape',
  'in progress': 'blue',
  'awaiting feedback': 'violet',
  testing: 'cyan',
  completed: 'teal',
  low: 'gray',
  normal: 'blue',
  high: 'violet',
  urgent: 'pink',
  available: 'teal',
  'partially available': 'blue',
};

function ChannelIcon({ channel }: { channel: string }): ReactElement | null {
  const normalizedChannel = String(channel ?? '')
    .trim()
    .toLowerCase();

  if (normalizedChannel.includes('google')) {
    return (
      <Box className="channel-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="channel-mark__svg">
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
      </Box>
    );
  } else if (normalizedChannel.includes('youtube')) {
    return (
      <Box className="channel-mark" aria-hidden="true">
        <IconBrandYoutubeFilled size={20} stroke={1.8} color="#FF0000" />
      </Box>
    );
  } else if (normalizedChannel.includes('facebook')) {
    return (
      <Box className="channel-mark" aria-hidden="true">
        <IconBrandMeta size={20} stroke={1.8} color="#0866FF" />
      </Box>
    );
  }

  return (
    <Box className="channel-mark" aria-hidden="true">
      <Text c="dimmed" fw={500} lh={1}>
        —
      </Text>
    </Box>
  );
}

export function ChannelCell({ channel }: { channel: string }) {
  const label = formatChannelLabel(channel);

  return (
    <Box title={label}>
      <ChannelIcon channel={channel} />
    </Box>
  );
}

export function ChannelDetail({ channel }: { channel: string }) {
  const label = formatChannelLabel(channel);

  return (
    <Group gap="sm" wrap="nowrap">
      <ChannelIcon channel={channel} />
      <Text fw={700}>{label}</Text>
    </Group>
  );
}

export function AssigneeChips({ assignees }: { assignees: string[] | string }) {
  const values = Array.isArray(assignees)
    ? assignees.filter(Boolean)
    : String(assignees ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

  if (values.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        Unassigned
      </Text>
    );
  }

  const [primaryAssignee, ...otherAssignees] = values;
  const overflowCount = otherAssignees.length;
  const fullLabel = values.join(', ');
  const primaryFirstName = primaryAssignee.split(' ')[0] || primaryAssignee;

  return (
    <Text
      className="task-queue-truncate assignee-text"
      title={fullLabel}
      aria-label={fullLabel}
    >
      {overflowCount > 0 ? `${primaryFirstName}, +${overflowCount}` : primaryFirstName}
    </Text>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const normalizedValue = value.trim().toLowerCase().replace(/[_-]+/g, ' ');

  return (
    <Badge radius="xl" variant="light" color={badgeColor[normalizedValue] || 'gray'}>
      {value}
    </Badge>
  );
}

export function HealthBar({ health, score }: { health: string; score?: number }) {
  const config = healthConfig[health as keyof typeof healthConfig] || {
    value: 50,
    color: 'gray',
  };

  const progressValue = typeof score === 'number' ? score : config.value;

  return (
    <Box className="health-cell" title={health}>
      <Progress
        value={progressValue}
        color={config.color}
        radius="xl"
        size="sm"
        className="health-cell__progress"
      />
      <Text size="xs" c="dimmed" mt={6}>
        {health}
      </Text>
    </Box>
  );
}
