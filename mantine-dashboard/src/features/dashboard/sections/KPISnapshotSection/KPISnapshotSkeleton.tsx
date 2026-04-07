import { Box, Group, Paper, Skeleton } from '@mantine/core';

export function KPISnapshotSkeleton() {
  return (
    <>
      <Box>
        <Skeleton height={14} width={140} />
      </Box>

      <Group justify="space-between" align="center" mt={4} className="kpi-carousel-header">
        <Skeleton height={32} width={188} />

        <Group gap="xs" wrap="nowrap" className="kpi-carousel-controls">
          <Skeleton height={24} width={126} radius="xl" className="kpi-carousel-count" />
          <Group gap={8} wrap="nowrap">
            <Skeleton height={42} width={42} radius="xl" className="kpi-carousel-arrow" />
            <Skeleton height={42} width={42} radius="xl" className="kpi-carousel-arrow" />
          </Group>
        </Group>
      </Group>

      <div className="kpi-carousel-stage">
        <div className="kpi-carousel-grid">
          {Array.from({ length: 6 }, (_, idx) => (
            <Paper key={`kpi-skeleton-${idx}`} className="stat-card kpi-carousel-card" p="lg" radius="md">
              <Group justify="space-between" align="flex-start">
                <Skeleton height={42} width={42} radius="md" className="kpi-carousel-icon" />
                <Skeleton height={22} width={74} radius="xl" className="kpi-carousel-load" />
              </Group>

              <Skeleton height={16} width="62%" mt="md" />

              <Group align="end" gap={6} mt="sm">
                <Skeleton height={36} width={56} />
                <Skeleton height={14} width={38} mb={6} />
              </Group>

              <Skeleton height={8} radius="xl" mt="md" />
            </Paper>
          ))}
        </div>
      </div>

      <Group justify="center" gap={8} mt="md" className="kpi-carousel-dots">
        {Array.from({ length: 3 }, (_, idx) => (
          <Skeleton key={`kpi-dot-skeleton-${idx}`} height={10} width={10} radius="xl" />
        ))}
      </Group>
    </>
  );
}
