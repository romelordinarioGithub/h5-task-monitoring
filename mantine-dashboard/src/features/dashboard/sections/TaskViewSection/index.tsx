import {
  Autocomplete,
  Badge,
  Box,
  Card,
  Select,
  SimpleGrid,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { tasks } from './api';
import { useDashboard } from '../../providers/DashboardProvider';
import {
  AssigneeChips,
  ChannelCell,
  HealthBar,
  StatusBadge,
} from '../../components/dashboardUi';

export function TaskViewSection() {
  const {
    filteredTasks,
    selectedTaskName,
    filters,
    filterOptions,
    taskTableHeight,
    taskTableAreaRef,
    setSelectedTaskName,
    setFilters,
  } = useDashboard();

  return (
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
                    className={selectedTaskName === task.name ? 'task-row-selected' : ''}
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
  );
}
