import {
  Autocomplete,
  Badge,
  Box,
  Card,
  Group,
  Paper,
  Progress,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconArrowUpRight, IconCheck, IconUsersGroup } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { tasks } from '../mock/dashboardData.mock';
import { useDashboard } from '../providers/DashboardProvider';
import {
  AssigneeChips,
  ChannelCell,
  ChannelDetail,
  HealthBar,
  StatusBadge,
} from '../components/dashboardUi';

export function DashboardWorkSection() {
  const {
    filteredTasks,
    selectedTaskName,
    selectedTask,
    filters,
    filterOptions,
    taskTableHeight,
    taskTableAreaRef,
    resourceSectionRef,
    availableResources,
    utilizationMeta,
    resourceTaskCounts,
    setSelectedTaskName,
    setFilters,
  } = useDashboard();
  const alwaysShowScrollbar = useMediaQuery('(pointer: fine)');

  return (
    <Box mt="lg" className="dashboard-work-layout">
      <Box className="dashboard-work-main">
        <Card withBorder radius="md" padding="lg" className="task-view-card">
          <Text className="section-kicker">Task Queue</Text>
          <Title order={2} mt={4}>
            Task View
          </Title>
          <Badge color="gray" variant="light" radius="xl" mt="sm">
            {filteredTasks.length} of {tasks.length} tasks
          </Badge>
          {filters.taskType !== 'All' ? (
            <Badge color="grape" variant="light" radius="xl" mt="sm">
              Filtered by {filters.taskType}
            </Badge>
          ) : null}

          <SimpleGrid cols={{ base: 1, md: 2, xl: 6 }} mt="lg" className="task-filters">
            <Autocomplete
              label="Task Name"
              data={tasks.map((task) => task.name)}
              placeholder="Search a task"
              value={filters.taskName}
              onChange={(event) =>
                setFilters((current) => ({ ...current, taskName: event }))
              }
              autoComplete="off"
            />
            <Select
              label="Channel"
              data={filterOptions.channel}
              value={filters.channel}
              onChange={(value) =>
                setFilters((current) => ({ ...current, channel: value || 'All' }))
              }
              allowDeselect={false}
            />
            <Select
              label="Health"
              data={filterOptions.health}
              value={filters.health}
              onChange={(value) =>
                setFilters((current) => ({ ...current, health: value || 'All' }))
              }
              allowDeselect={false}
            />
            <Select
              label="Status"
              data={filterOptions.status}
              value={filters.status}
              onChange={(value) =>
                setFilters((current) => ({ ...current, status: value || 'All' }))
              }
              allowDeselect={false}
            />
            <Select
              label="Priority"
              data={filterOptions.priority}
              value={filters.priority}
              onChange={(value) =>
                setFilters((current) => ({ ...current, priority: value || 'All' }))
              }
              allowDeselect={false}
            />
            <Autocomplete
              label="Assigned Dev"
              data={filterOptions.assignee.filter((value) => value !== 'All')}
              placeholder="Type a dev name"
              value={filters.assignee}
              onChange={(event) =>
                setFilters((current) => ({ ...current, assignee: event }))
              }
              autoComplete="off"
            />
          </SimpleGrid>

          <Box
            ref={taskTableAreaRef}
            mt="lg"
            className="task-table-scroll"
            style={taskTableHeight ? { height: `${taskTableHeight}px` } : undefined}
          >
            <Table.ScrollContainer minWidth={920} h="100%">
              <Table highlightOnHover verticalSpacing="md" className="task-table">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Task Name</Table.Th>
                    <Table.Th>Task Type</Table.Th>
                    <Table.Th>Channel</Table.Th>
                    <Table.Th>Health</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Priority</Table.Th>
                    <Table.Th>Assigned Dev</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredTasks.map((task) => (
                    <Table.Tr
                      key={task.name}
                      className={
                        selectedTaskName === task.name ? 'task-row-selected' : ''
                      }
                      onClick={() => setSelectedTaskName(task.name)}
                    >
                      <Table.Td>
                        <Text fw={600} className="task-queue-truncate">
                          {task.name}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text className="task-queue-truncate">{task.type}</Text>
                      </Table.Td>
                      <Table.Td>
                        <ChannelCell channel={task.channel} />
                      </Table.Td>
                      <Table.Td>
                        <HealthBar health={task.health} />
                      </Table.Td>
                      <Table.Td>
                        <StatusBadge value={task.status} />
                      </Table.Td>
                      <Table.Td>
                        <StatusBadge value={task.priority} />
                      </Table.Td>
                      <Table.Td>
                        <AssigneeChips assignees={task.assignees} />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {filteredTasks.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text c="dimmed" ta="center" py="xl">
                          No tasks match the selected filters.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : null}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Box>
        </Card>
      </Box>

      <Box className="dashboard-work-side">
        <Box className="dashboard-side-measure">
          <Stack className="dashboard-side-stack">
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
                  Focused task details for review, blockers, handoff notes, and delivery
                  updates.
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

            <Box ref={resourceSectionRef}>
              <Card withBorder radius="md" padding="lg" className="resource-section-card">
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
                          of 21 available
                        </Text>
                      </Group>
                    </div>
                    <ThemeIcon radius="md" variant="light" color="grape" size={40}>
                      <IconUsersGroup size={18} />
                    </ThemeIcon>
                  </Group>

                  <Progress
                    value={Math.round((availableResources.length / 21) * 100)}
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
                          21
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
                  h={taskTableHeight || 360}
                  mt="lg"
                  offsetScrollbars
                >
                  <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="sm">
                    {availableResources.map((resource) =>
                      (() => {
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
                            <Group
                              justify="space-between"
                              align="flex-start"
                              wrap="nowrap"
                            >
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
                      })(),
                    )}
                  </SimpleGrid>
                </ScrollArea>
              </Card>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
