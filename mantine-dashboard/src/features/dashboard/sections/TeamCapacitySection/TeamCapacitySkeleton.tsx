import { Box, Group, Paper, ScrollArea, SimpleGrid, Skeleton } from '@mantine/core';

export function TeamCapacitySkeleton() {
  return (
    <>
      <Box>
        <Skeleton height={14} width={110} />
        <Skeleton height={22} width={220} mt={4} />
      </Box>
      <Paper withBorder radius="md" p="md" mt="lg" className="resource-summary-card">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div style={{ flex: 1 }}>
            <Skeleton height={16} width={180} />
            <Group align="end" gap={8} mt="md">
              <Skeleton height={40} width={48} />
              <Skeleton height={16} width={120} mb={7} />
            </Group>
          </div>

          <Skeleton height={40} width={40} radius="md" />
        </Group>

        <Skeleton height={16} radius="xl" mt="lg" />

        <SimpleGrid cols={2} spacing="sm" mt="md">
          <Paper radius="md" p="sm" className="resource-summary-card__stat">
            <Skeleton height={12} width="70%" />
            <Group gap={8} mt={8}>
              <Skeleton circle height={28} width={28} />
              <Skeleton height={24} width={40} />
            </Group>
          </Paper>

          <Paper radius="md" p="sm" className="resource-summary-card__stat">
            <Skeleton height={12} width="70%" />
            <Group gap={8} mt={8}>
              <Skeleton circle height={28} width={28} />
              <Skeleton height={24} width={40} />
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
          {Array.from({ length: 4 }, (_, idx) => (
            <Paper key={`resource-skeleton-${idx}`} withBorder radius="md" p="md">
              <Skeleton height={18} width="65%" />
              <Skeleton height={14} width="45%" mt={8} />
              <Skeleton height={40} mt={14} />
              <Skeleton height={22} width="48%" mt={12} />
            </Paper>
          ))}
        </SimpleGrid>
      </ScrollArea>
    </>
  );
}
