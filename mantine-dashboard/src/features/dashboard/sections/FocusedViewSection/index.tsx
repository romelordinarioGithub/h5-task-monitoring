import { Box, Card, Group, Paper, SimpleGrid, Text, Title, UnstyledButton } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import { useDashboard } from '../../providers/DashboardProvider';
import { ChannelDetail, StatusBadge } from '../../components/dashboardUi';

export function FocusedViewSection() {
  const { selectedTask } = useDashboard();

  return (
    <Card withBorder radius="md" padding="lg">
      <Text className="section-kicker">Focused View</Text>
      <Title order={3} mt={4}>
        Selected Task Detail
      </Title>
      <Paper className="selected-task-hero" p="lg" radius="md" mt="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
            Active Selection
          </Text>
          <UnstyledButton
            className="selected-task-link"
            aria-label="Open selected task link"
            title="Open selected task link"
          >
            <Group gap={6} wrap="nowrap" className="selected-task-link__inner">
              <Text size="xs" fw={700} tt="uppercase">
                Task Link
              </Text>
              <IconArrowUpRight size={16} />
            </Group>
          </UnstyledButton>
        </Group>
        <Title order={3} mt="sm">
          {selectedTask.name}
        </Title>
        <Text c="dimmed" mt="sm">
          Focused task details for review, blockers, handoff notes, and delivery updates.
        </Text>
        <Group gap={8} mt="md">
          <StatusBadge value={selectedTask.health} />
          <StatusBadge value={selectedTask.status} />
          <StatusBadge value={selectedTask.priority} />
        </Group>
      </Paper>

      <SimpleGrid cols={2} mt="md">
        <Paper withBorder radius="md" p="md">
          <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
            Channel
          </Text>
          <Box mt={6}>
            <ChannelDetail channel={selectedTask.channel} />
          </Box>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
            Assigned Dev
          </Text>
          <Text fw={700} mt={6}>
            {selectedTask.assignee}
          </Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
            Task Type
          </Text>
          <Text fw={700} mt={6}>
            {selectedTask.type}
          </Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
            Priority
          </Text>
          <Text fw={700} mt={6}>
            {selectedTask.priority}
          </Text>
        </Paper>
      </SimpleGrid>
    </Card>
  );
}
