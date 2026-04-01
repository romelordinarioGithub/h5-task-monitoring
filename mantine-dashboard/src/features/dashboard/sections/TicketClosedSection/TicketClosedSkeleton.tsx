import { Box, Skeleton, Stack } from '@mantine/core';

export function TicketClosedSkeleton() {
  return (
    <>
      <Box>
        <Skeleton height={14} width={120} />
        <Skeleton height={22} width={160} mt={4} />
      </Box>

      <Box mt={66}>
        <Box className="ticket-card">
          <Skeleton height={240} width={240} radius="50%" />
        </Box>

        <Stack gap={8} mt={68}>
          <Skeleton height={14} width="96%" />
          <Skeleton height={14} width="74%" />
        </Stack>
      </Box>
    </>
  );
}
