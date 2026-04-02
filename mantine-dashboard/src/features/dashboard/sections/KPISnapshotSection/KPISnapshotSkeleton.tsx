import { Box, Grid, Group, Paper, Skeleton } from '@mantine/core';

export function KPISnapshotSkeleton() {
  return (
    <>
      <Box>
        <Skeleton height={14} width={140} />
        <Skeleton height={22} width={180} mt={4} />
      </Box>

      <Grid gutter="md" mt="lg">
        {Array.from({ length: 6 }, (_, idx) => (
          <Grid.Col key={`kpi-skeleton-${idx}`} span={{ base: 12, md: 6, xl: 4 }}>
            <Paper p="lg" radius="md" withBorder>
              <Group justify="space-between" align="flex-start">
                <Skeleton height={42} width={42} radius="md" />
                <Skeleton height={22} width={74} radius="xl" />
              </Group>

              <Skeleton height={16} width="62%" mt="md" />

              <Group align="end" gap={6} mt="sm">
                <Skeleton height={36} width={56} />
                <Skeleton height={14} width={38} mb={6} />
              </Group>

              <Skeleton height={8} radius="xl" mt="md" />
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}
