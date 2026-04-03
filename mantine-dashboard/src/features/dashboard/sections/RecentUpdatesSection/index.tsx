import { Card, Grid, Group, Paper, ScrollArea, Stack, Text, Title } from '@mantine/core';
import { StatusBadge } from '../../components/dashboardUi';
import {
  RecentUpdatesLazySkeleton,
  RecentUpdatesSectionSkeleton,
} from './RecentUpdatesSkeleton';
import { useRecentUpdates } from './useRecentUpdates';

export function RecentUpdatesSection() {
  const {
    activities,
    error,
    isInitialLoading,
    isLoadingMore,
    viewportRef,
    onScrollPositionChange,
  } = useRecentUpdates();

  return (
    <Grid.Col span={{ base: 12, md: 3 }} className="top-row-recent">
      <Card withBorder radius="md" padding="lg" className="top-panel-card recent-updates-card">
        {isInitialLoading ? (
          <RecentUpdatesSectionSkeleton />
        ) : (
          <>
            <Text className="section-kicker">Recent Updates</Text>
            <Title order={3} mt={4}>
              Recent Activity
            </Title>

            <ScrollArea
              h={440}
              mt="lg"
              offsetScrollbars
              className="recent-activity-scroll"
              viewportRef={viewportRef}
              onScrollPositionChange={onScrollPositionChange}
            >
              <Stack gap="sm" className="recent-activity-list">
                {activities.map((activity) => (
                  <Paper
                    key={activity.key}
                    p="md"
                    radius="md"
                    withBorder
                    className="recent-activity-item"
                  >
                    <div className="recent-activity-copy">
                      <Group
                        align="flex-start"
                        wrap="nowrap"
                        className="recent-activity-header"
                      >
                        <Text fw={600} size="sm" className="recent-activity-title">
                          {activity.task}
                        </Text>
                      </Group>

                      <Text
                        size="sm"
                        c="dimmed"
                        mt={6}
                        className="recent-activity-description"
                      >
                        {activity.actor ? (
                          <>
                            Updated by <strong>{activity.actor}</strong>.
                          </>
                        ) : (
                          'Task update recorded.'
                        )}
                      </Text>

                      <Group gap={6} mt="sm" className="recent-activity-badges">
                        <StatusBadge value={activity.toStatus} />
                      </Group>
                    </div>
                  </Paper>
                ))}

                {isLoadingMore ? <RecentUpdatesLazySkeleton /> : null}

                {activities.length === 0 ? (
                  <Text c="dimmed" size="sm">
                    No recent activity found.
                  </Text>
                ) : null}

                {error ? (
                  <Text c="red" size="sm">
                    {error}
                  </Text>
                ) : null}
              </Stack>
            </ScrollArea>
          </>
        )}
      </Card>
    </Grid.Col>
  );
}
