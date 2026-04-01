import { Box, Group, Paper, ScrollArea, Skeleton, Stack } from '@mantine/core';

export function RecentUpdatesSectionSkeleton() {
  return (
    <>
      <Box>
        <Skeleton height={16} width={140} />
        <Skeleton height={26} width={180} mt={8} />
      </Box>

      <ScrollArea h={360} mt="lg" offsetScrollbars className="recent-activity-scroll">
        <Stack gap="sm" className="recent-activity-list">
          {Array.from({ length: 4 }, (_, idx) => (
            <Paper key={`activity-skeleton-${idx}`} p="md" radius="md" withBorder>
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Skeleton height={16} width="62%" />
                {/* <Skeleton height={12} width={52} /> */}
              </Group>

              <Skeleton height={12} mt={10} width="92%" />
              <Skeleton height={12} mt={8} width="78%" />

              <Group gap={6} mt="sm">
                {/* <Skeleton height={22} width={84} radius="xl" /> */}
                <Skeleton height={22} width={84} radius="xl" />
              </Group>
            </Paper>
          ))}
        </Stack>
      </ScrollArea>
    </>
  );
}

export function RecentUpdatesLazySkeleton() {
  return (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Skeleton height={16} width="58%" />
        {/* <Skeleton height={12} width={48} /> */}
      </Group>

      <Skeleton height={12} mt={10} width="90%" />
      <Skeleton height={12} mt={8} width="74%" />

      <Group gap={6} mt="sm">
        {/* <Skeleton height={22} width={84} radius="xl" /> */}
        <Skeleton height={22} width={84} radius="xl" />
      </Group>
    </Paper>
  );
}
