import {
  Badge,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  Paper,
  Progress,
  RingProgress,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import type { CSSProperties } from 'react';
import { recentActivities, taskTypes } from '../mock/dashboardData.mock';
import { useDashboard } from '../providers/DashboardProvider';
import { StatusBadge } from '../components/dashboardUi';

export function DashboardMetricsSection() {
  const {
    filters,
    setFilters,
    totalTaskCount,
    completionRate,
    ticketClosedCount,
    throughputTotal,
  } = useDashboard();

  return (
    <Grid mt="lg">
      <Grid.Col span={{ base: 12, xl: 6 }}>
        <Card withBorder radius="md" padding="lg" h="100%">
          <Text className="section-kicker">KPI Snapshot</Text>
          <Title order={3} mt={4}>
            Task Type Summary
          </Title>
          <Grid gutter="md" mt="lg">
            {taskTypes.map((type) => {
              const share = Math.round((type.count / totalTaskCount) * 100);
              const Icon = type.icon;
              const isActive = filters.taskType === type.name;
              return (
                <Grid.Col key={type.name} span={{ base: 12, md: 6, xl: 4 }}>
                  <Paper
                    className={`stat-card ${isActive ? 'is-active' : ''}`}
                    p="lg"
                    radius="md"
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        taskType: current.taskType === type.name ? 'All' : type.name,
                      }))
                    }
                  >
                    <Group justify="space-between" align="flex-start">
                      <ThemeIcon size={42} radius="md" variant="light" color="grape">
                        <Icon size={20} />
                      </ThemeIcon>
                      <Badge color="gray" variant="light" radius="xl">
                        {share}% load
                      </Badge>
                    </Group>
                    <Text fw={600} mt="md">
                      {type.name}
                    </Text>
                    <Group align="end" gap={6} mt="sm">
                      <Title order={1} className="stat-card-value">
                        {type.count}
                      </Title>
                      <Text mb={6} c="dimmed">
                        tasks
                      </Text>
                    </Group>
                    <Progress value={share} color="grape" radius="xl" mt="md" />
                  </Paper>
                </Grid.Col>
              );
            })}
          </Grid>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6, xl: 3 }}>
        <Card withBorder radius="md" padding="lg" h="100%">
          <Text className="section-kicker">Delivery Progress</Text>
          <Title order={3} mt={4}>
            Ticket Closed
          </Title>
          <Box mt="lg" className="ticket-card">
            <RingProgress
              size={220}
              thickness={18}
              roundCaps
              sections={[{ value: completionRate, color: 'grape.7' }]}
              rootColor="gray.2"
              style={
                {
                  '--rp-size': '220px',
                  '--rp-label-offset': '36px',
                } as CSSProperties
              }
              label={
                <Stack gap={2} align="center">
                  <Text size="sm" c="dimmed">
                    Completed
                  </Text>
                  <Title order={1}>{ticketClosedCount}</Title>
                </Stack>
              }
            />
            <Text c="dimmed" size="sm">
              {ticketClosedCount} tickets have been closed in this dashboard view, out of{' '}
              {throughputTotal} tracked items across closed and open workload.
            </Text>
          </Box>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6, xl: 3 }}>
        <Card withBorder radius="md" padding="lg" h="100%">
          <Text className="section-kicker">Recent Updates</Text>
          <Title order={3} mt={4}>
            Recent Activity
          </Title>
          <ScrollArea h={360} mt="lg" offsetScrollbars className="recent-activity-scroll">
            <Stack gap="sm" className="recent-activity-list">
              {recentActivities.map((activity) => (
                <Paper
                  key={`${activity.task}-${activity.time}`}
                  p="md"
                  radius="md"
                  withBorder
                  className="recent-activity-item"
                >
                  <div className="recent-activity-copy">
                    <Group
                      justify="space-between"
                      align="flex-start"
                      wrap="nowrap"
                      className="recent-activity-header"
                    >
                      <Text fw={600} size="sm" className="recent-activity-title">
                        {activity.task}
                      </Text>
                      <Text size="xs" c="dimmed" className="recent-activity-time">
                        {activity.time}
                      </Text>
                    </Group>
                    <Text
                      size="sm"
                      c="dimmed"
                      mt={6}
                      className="recent-activity-description"
                    >
                      Status changed from <strong>{activity.fromStatus}</strong> to{' '}
                      <strong>{activity.toStatus}</strong> by {activity.actor}.
                    </Text>
                    <Group gap={6} mt="sm" className="recent-activity-badges">
                      <StatusBadge value={activity.fromStatus} />
                      <StatusBadge value={activity.toStatus} />
                    </Group>
                  </div>
                </Paper>
              ))}
            </Stack>
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
