import { Badge, Box, Group, Progress, Text } from '@mantine/core';

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

const healthConfig: Record<string, { value: number; color: string }> = {
  Healthy: { value: 86, color: 'teal' },
  Watch: { value: 62, color: 'blue' },
  Risk: { value: 38, color: 'violet' },
  Critical: { value: 16, color: 'pink' },
};

function ChannelIcon({ channel }: { channel: string }) {
  if (channel === 'Google Display') {
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
  }

  return (
    <Box className="channel-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="channel-mark__svg">
        <path
          fill="#0866FF"
          d="M19.18 7.24c-1.15 0-2.08.93-3.28 2.45-.62.79-1.27 1.77-1.9 2.79-.65-1.02-1.3-2-1.92-2.79-1.2-1.52-2.12-2.45-3.27-2.45-2.2 0-3.81 2.14-3.81 4.44 0 1.34.52 2.66 1.46 3.72.92 1.04 2.1 1.59 3.38 1.59.94 0 1.84-.32 2.67-.96.55-.43 1.06-.99 1.49-1.56.43.57.94 1.13 1.49 1.56.83.64 1.73.96 2.67.96 1.28 0 2.46-.55 3.38-1.59.94-1.06 1.46-2.38 1.46-3.72 0-2.3-1.61-4.44-3.82-4.44Zm-8.44 7.3c-.62.49-1.22.73-1.82.73-1.44 0-2.64-1.49-2.64-3.15 0-1.48.94-2.77 2.06-2.77.48 0 1.13.42 2.08 1.62.48.61.98 1.35 1.47 2.14-.34.5-.73 1-1.15 1.43Zm8.5.73c-.6 0-1.2-.24-1.82-.73-.42-.43-.81-.93-1.15-1.43.49-.79.99-1.53 1.47-2.14.95-1.2 1.6-1.62 2.08-1.62 1.12 0 2.06 1.29 2.06 2.77 0 1.66-1.2 3.15-2.64 3.15Z"
        />
      </svg>
    </Box>
  );
}

export function ChannelCell({ channel }: { channel: string }) {
  return (
    <Box title={channel}>
      <ChannelIcon channel={channel} />
    </Box>
  );
}

export function ChannelDetail({ channel }: { channel: string }) {
  return (
    <Group gap="sm" wrap="nowrap">
      <ChannelIcon channel={channel} />
      <Text fw={700}>{channel}</Text>
    </Group>
  );
}

export function AssigneeChips({ assignees }: { assignees: string[] }) {
  const [primaryAssignee, ...otherAssignees] = assignees;
  const overflowCount = otherAssignees.length;
  const fullLabel = assignees.join(', ');
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

export function HealthBar({ health }: { health: string }) {
  const config = healthConfig[health] || { value: 50, color: 'gray' };

  return (
    <Box className="health-cell" title={health}>
      <Progress
        value={config.value}
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
