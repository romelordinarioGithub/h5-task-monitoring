import {
  Badge,
  Box,
  Card,
  Group,
  Paper,
  Progress,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCheck, IconUsersGroup } from '@tabler/icons-react';
import { useDashboard } from '../../providers/DashboardProvider';
import { tasks } from '../TaskViewSection/api';
import { TeamCapacitySkeleton } from './TeamCapacitySkeleton';
import { useTeamCapacity } from './useTeamCapacity';

export function TeamCapacitySection() {
  const { resourceSectionRef, utilizationMeta, resourceTaskCounts } = useDashboard();
  const { availableResources, isLoading, totalHeadcount } = useTeamCapacity(tasks);

  return (
    <Box ref={resourceSectionRef}>
      <Card withBorder radius="md" padding="lg" className="resource-section-card">
        {isLoading ? (
          <TeamCapacitySkeleton />
        ) : (
          <>
            <Text className="section-kicker">Team Capacity</Text>
            <Title order={3} mt={4}>
              Available Dev Resource
            </Title>

            <Paper
              withBorder
              radius="md"
              p="md"
              mt="lg"
              className="resource-summary-card"
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <div>
                  <Text c="dimmed" size="sm">
                    Team availability snapshot
                  </Text>
                  <Group align="end" gap={8} mt="md">
                    <Title order={1} className="resource-stat-card__value">
                      {availableResources.length}
                    </Title>
                    <Text size="sm" c="dimmed" mb={7}>
                      of {totalHeadcount || 0} available
                    </Text>
                  </Group>
                </div>

                <ThemeIcon radius="md" variant="light" color="grape" size={40}>
                  <IconUsersGroup size={18} />
                </ThemeIcon>
              </Group>

              <Progress
                value={
                  totalHeadcount > 0
                    ? Math.round((availableResources.length / totalHeadcount) * 100)
                    : 0
                }
                color="grape"
                radius="xl"
                size="lg"
                mt="lg"
              />

              <SimpleGrid cols={2} spacing="sm" mt="md">
                <Paper radius="md" p="sm" className="resource-summary-card__stat">
                  <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                    Total Team Headcount
                  </Text>
                  <Group gap={8} mt={8}>
                    <ThemeIcon radius="xl" variant="light" color="grape" size={28}>
                      <IconUsersGroup size={14} />
                    </ThemeIcon>
                    <Text fw={700} size="lg">
                      {totalHeadcount || 0}
                    </Text>
                  </Group>
                </Paper>

                <Paper radius="md" p="sm" className="resource-summary-card__stat">
                  <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                    Available Right Now
                  </Text>
                  <Group gap={8} mt={8}>
                    <ThemeIcon radius="xl" variant="light" color="teal" size={28}>
                      <IconCheck size={14} />
                    </ThemeIcon>
                    <Text fw={700} size="lg">
                      {availableResources.length}
                    </Text>
                  </Group>
                </Paper>
              </SimpleGrid>
            </Paper>

            <ScrollArea
              className="resource-roster-scroll"
              h="clamp(320px, 40vh, 520px)"
              mt="lg"
              offsetScrollbars
            >
              <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="sm">
                {availableResources.map((resource) => {
                  const trend = utilizationMeta[resource.trend];
                  const involvementCount = resourceTaskCounts[resource.name] || 0;

                  return (
                    <Paper
                      key={resource.name}
                      withBorder
                      radius="md"
                      p="md"
                      className="resource-dev-stat"
                    >
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <div>
                          <Text fw={700}>{resource.name}</Text>
                          <Text c="dimmed" size="sm" mt={4}>
                            {resource.team}
                          </Text>
                        </div>

                        <ThemeIcon
                          radius="xl"
                          variant="light"
                          color={trend.color}
                          className="resource-dev-stat__trend"
                        >
                          <trend.Icon size={16} />
                        </ThemeIcon>
                      </Group>

                      <Group align="flex-end" gap={8} mt="lg">
                        <Title order={1} className="resource-dev-stat__value">
                          {resource.utilization}%
                        </Title>
                        <Text size="sm" c="dimmed" mb={7}>
                          utilization
                        </Text>
                      </Group>

                      <Badge
                        variant="light"
                        color={trend.color}
                        radius="xl"
                        mt="sm"
                        className="resource-dev-stat__badge"
                      >
                        {trend.label}
                      </Badge>

                      <Text size="sm" c="dimmed" mt="md">
                        Involved in {involvementCount}{' '}
                        {involvementCount === 1 ? 'task' : 'tasks'}
                      </Text>
                    </Paper>
                  );
                })}
              </SimpleGrid>
            </ScrollArea>
          </>
        )}
      </Card>
    </Box>
  );
}
