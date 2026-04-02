import { Group, Paper, SimpleGrid, Skeleton } from '@mantine/core';

export function FocusedViewSkeleton() {
  return (
    <>
      <Skeleton height={14} width={110} />
      <Skeleton height={22} width={180} mt={4} />

      <Paper className="selected-task-hero" p="lg" radius="md" mt="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Skeleton height={12} width={108} />
          <Skeleton height={20} width={76} radius="xl" />
        </Group>

        <Skeleton height={28} width="58%" mt="md" />
        <Skeleton height={14} width="92%" mt="md" />
        <Skeleton height={14} width="74%" mt={8} />

        <Group gap={8} mt="md">
          <Skeleton height={24} width={88} radius="xl" />
          <Skeleton height={24} width={108} radius="xl" />
          <Skeleton height={24} width={82} radius="xl" />
        </Group>
      </Paper>

      <SimpleGrid cols={2} mt="md">
        {Array.from({ length: 4 }, (_, idx) => (
          <Paper key={`focused-skeleton-${idx}`} withBorder radius="md" p="md">
            <Skeleton height={10} width={84} />
            <Skeleton height={18} width="68%" mt={10} />
          </Paper>
        ))}
      </SimpleGrid>
    </>
  );
}
