import { useEffect, useMemo, useRef, useState } from 'react';
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
import { useDashboard } from '../../providers/DashboardProvider';
import {
  AssigneeChips,
  ChannelCell,
  HealthBar,
  StatusBadge,
} from '../../components/dashboardUi';
import { TaskViewLazySkeleton, TaskViewSectionSkeleton } from './TaskViewSkeleton';

export function TaskViewSection() {
  const {
    filteredTasks,
    selectedTaskName,
    selectedTeam,
    filters,
    filterOptions,
    taskTableHeight,
    taskTableAreaRef,
    setSelectedTaskName,
    setFilters,
    totalTaskCount,
    isTasksLoading,
    isLoadingMoreTasks,
    isTeamCapacityLoading,
    isTaskNameFilterPending,
    taskError,
    hasMoreTasks,
    loadMoreTasks,
  } = useDashboard();

  const hasFinishedFirstLoadRef = useRef(false);
  const hasUserScrolledTableRef = useRef(false);
  const [selectedTaskNameOption, setSelectedTaskNameOption] = useState<string | null>(
    null,
  );
  const pauseLazyLoadForTaskName =
    Boolean(selectedTaskNameOption) && filters.taskName === selectedTaskNameOption;
  const taskNameOptions = useMemo(
    () => Array.from(new Set(filteredTasks.map((task) => task.name).filter(Boolean))),
    [filteredTasks],
  );

  useEffect(() => {
    if (!filters.taskName.trim()) {
      setSelectedTaskNameOption(null);
    }
  }, [filters.taskName]);

  useEffect(() => {
    hasUserScrolledTableRef.current = false;
  }, [
    selectedTeam,
    filters.taskName,
    filters.taskType,
    filters.channel,
    filters.health,
    filters.status,
    filters.priority,
    filters.assignee,
  ]);

  useEffect(() => {
    if (!isTasksLoading) {
      hasFinishedFirstLoadRef.current = true;
    }
  }, [isTasksLoading]);

  useEffect(() => {
    const resolveTableViewport = () => {
      const tableArea = taskTableAreaRef.current;
      if (!tableArea) return null;

      const candidates = [
        tableArea.querySelector<HTMLElement>('.mantine-ScrollArea-viewport'),
        tableArea.querySelector<HTMLElement>('[data-mantine-scroll-area-viewport]'),
        tableArea.querySelector<HTMLElement>('.mantine-Table-scrollContainer'),
        tableArea,
      ].filter((node): node is HTMLElement => Boolean(node));

      const scrollingCandidate = candidates.find((node) => {
        const style = window.getComputedStyle(node);
        return (
          style.overflowY === 'auto' ||
          style.overflowY === 'scroll' ||
          style.overflow === 'auto' ||
          style.overflow === 'scroll'
        );
      });

      return scrollingCandidate ?? candidates[0] ?? null;
    };

    const viewport = resolveTableViewport();

    if (!viewport) return;

    const tryLoadMore = () => {
      if (pauseLazyLoadForTaskName) return;
      if (isTasksLoading || isLoadingMoreTasks || !hasMoreTasks) return;

      const remaining =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      if (!hasUserScrolledTableRef.current) return;

      if (remaining <= 180) {
        loadMoreTasks();
      }
    };

    const handleViewportScroll = () => {
      hasUserScrolledTableRef.current = true;
      tryLoadMore();
    };

    viewport.addEventListener('scroll', handleViewportScroll, { passive: true });

    return () => {
      viewport.removeEventListener('scroll', handleViewportScroll);
    };
  }, [
    hasMoreTasks,
    isLoadingMoreTasks,
    isTasksLoading,
    loadMoreTasks,
    pauseLazyLoadForTaskName,
    taskTableAreaRef,
    filteredTasks.length,
  ]);

  useEffect(() => {
    const resolveTableViewport = () => {
      const tableArea = taskTableAreaRef.current;
      if (!tableArea) return null;

      return (
        tableArea.querySelector<HTMLElement>('.mantine-ScrollArea-viewport') ??
        tableArea.querySelector<HTMLElement>('[data-mantine-scroll-area-viewport]') ??
        tableArea.querySelector<HTMLElement>('.mantine-Table-scrollContainer') ??
        tableArea
      );
    };

    const viewport = resolveTableViewport();
    if (!viewport) return;

    if (pauseLazyLoadForTaskName) return;
    if (isTasksLoading || isLoadingMoreTasks || !hasMoreTasks) return;

    const isOverflowing = viewport.scrollHeight > viewport.clientHeight + 1;

    // Guard: for short first pages (<= limit) we keep fetching until
    // the viewport can scroll, then switch to scroll-triggered loading.
    if (!isOverflowing) {
      loadMoreTasks();
    }
  }, [
    filteredTasks.length,
    hasMoreTasks,
    isLoadingMoreTasks,
    isTasksLoading,
    loadMoreTasks,
    pauseLazyLoadForTaskName,
    taskTableAreaRef,
    taskTableHeight,
  ]);

  const isInitialLoading =
    isTasksLoading && !taskError && !hasFinishedFirstLoadRef.current;
  const isFilterPending =
    !taskError &&
    !isInitialLoading &&
    (isTaskNameFilterPending || (isTasksLoading && !isLoadingMoreTasks));
  const showFilterPendingSkeleton = isFilterPending;
  const showLoadMoreSkeleton =
    !taskError &&
    !showFilterPendingSkeleton &&
    (isTasksLoading || isLoadingMoreTasks);
  const showNoTasksMatchMessage =
    filteredTasks.length === 0 &&
    !taskError &&
    !showFilterPendingSkeleton &&
    !showLoadMoreSkeleton;

  return (
    <Box className="dashboard-work-main">
      <Card withBorder radius="md" padding="lg" className="task-view-card">
        {isInitialLoading ? (
          <TaskViewSectionSkeleton />
        ) : (
          <>
            <Text className="section-kicker">Task Queue</Text>
            <Title order={2} mt={4}>
              Task View
            </Title>

            <Badge color="gray" variant="light" radius="xl" mt="sm">
              {filteredTasks.length} of {totalTaskCount} tasks
            </Badge>

            {filters.taskType !== 'All' ? (
              <Badge color="grape" variant="light" radius="xl" mt="sm">
                Filtered by {filters.taskType}
              </Badge>
            ) : null}

            <SimpleGrid cols={{ base: 1, md: 2, xl: 6 }} mt="lg" className="task-filters">
              <Autocomplete
                label="Task Name"
                data={taskNameOptions}
                placeholder="Search a task"
                value={filters.taskName}
                onChange={(value) => {
                  setFilters((current) => ({ ...current, taskName: value }));

                  if (selectedTaskNameOption && value !== selectedTaskNameOption) {
                    setSelectedTaskNameOption(null);
                  }
                }}
                onOptionSubmit={(value) => {
                  setFilters((current) => ({ ...current, taskName: value }));
                  setSelectedTaskNameOption(value);
                }}
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
                data={filterOptions.assignee}
                placeholder={isTeamCapacityLoading ? 'Loading devs...' : 'Type a dev name'}
                value={filters.assignee}
                onChange={(value) =>
                  setFilters((current) => ({ ...current, assignee: value }))
                }
                disabled={isTeamCapacityLoading}
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
                  <colgroup>
                    <col className="task-col-name" />
                    <col className="task-col-type" />
                    <col className="task-col-channel" />
                    <col className="task-col-health" />
                    <col className="task-col-status" />
                    <col className="task-col-priority" />
                    <col className="task-col-assignee" />
                  </colgroup>
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
                    {taskError ? (
                      <Table.Tr>
                        <Table.Td colSpan={7}>
                          <Text c="red" ta="center" py="xl">
                            {taskError}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ) : showFilterPendingSkeleton ? (
                      <TaskViewLazySkeleton />
                    ) : (
                      <>
                        {filteredTasks.map((task) => (
                          <Table.Tr
                            key={task.id}
                            className={
                              selectedTaskName === task.name ? 'task-row-selected' : ''
                            }
                            onClick={() => setSelectedTaskName(task.name)}
                          >
                            <Table.Td>
                              <Text
                                fw={600}
                                className="task-queue-truncate"
                                title={task.name}
                              >
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
                              <HealthBar health={task.health} score={task.healthScore} />
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

                        {showLoadMoreSkeleton ? (
                          <TaskViewLazySkeleton />
                        ) : null}

                        {showNoTasksMatchMessage ? (
                          <Table.Tr>
                            <Table.Td colSpan={7}>
                              <Text c="dimmed" ta="center" py="xl">
                                No tasks match the selected filters.
                              </Text>
                            </Table.Td>
                          </Table.Tr>
                        ) : null}
                      </>
                    )}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
}
