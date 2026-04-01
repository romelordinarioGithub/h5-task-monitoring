import {
  Badge,
  Card,
  Grid,
  Group,
  Paper,
  Progress,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { taskTypes } from './api';
import { useDashboard } from '../../providers/DashboardProvider';

export function KPISnapshotSection() {
  const { filters, setFilters, totalTaskCount } = useDashboard();

  return (
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
  );
}
