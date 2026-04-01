import { Box, Card, Grid, RingProgress, Stack, Text, Title } from '@mantine/core';
import type { CSSProperties } from 'react';
import { TicketClosedSkeleton } from './TicketClosedSkeleton';
import { useTicketClosed } from './useTicketClosed';

export function TicketClosedSection() {
  const { ticketClosed, isLoading, error } = useTicketClosed();

  const completed = ticketClosed.completed;
  const total = ticketClosed.total;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Grid.Col span={{ base: 12, md: 6, xl: 3 }}>
      <Card withBorder radius="md" padding="lg" h="100%">
        {isLoading ? (
          <TicketClosedSkeleton />
        ) : (
          <>
            <Text className="section-kicker">Delivery Progress</Text>
            <Title order={3} mt={4}>
              Ticket Closed
            </Title>

            <Box mt="xl">
              <Box className="ticket-card">
                <RingProgress
                  size={220}
                  thickness={18}
                  roundCaps
                  sections={[{ value: completionRate, color: 'grape.7' }]}
                  rootColor="gray.2"
                  style={
                    {
                      '--rp-size': '220px',
                      '--rp-label-offset': '36px',
                    } as CSSProperties
                  }
                  label={
                    <Stack gap={2} align="center">
                      <Text size="sm" c="dimmed">
                        Completed
                      </Text>
                      <Title order={1}>{completed}</Title>
                    </Stack>
                  }
                />
              </Box>

              <Text c="dimmed" size="sm" mt="xl">
                {completed} tickets have been closed in this dashboard view, out of{' '}
                {total} tracked items across closed and open workload.
              </Text>

              {error ? (
                <Text c="red" size="sm" mt="sm">
                  {error}
                </Text>
              ) : null}
            </Box>
          </>
        )}
      </Card>
    </Grid.Col>
  );
}
