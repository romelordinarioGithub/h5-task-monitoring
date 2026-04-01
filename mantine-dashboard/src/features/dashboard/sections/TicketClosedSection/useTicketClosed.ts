import { useEffect, useState } from 'react';
import { fetchPage } from '@/features/dashboard/services/dashboardApi';

export type TicketClosed = {
  completed: number;
  total: number;
};

const DEFAULT_TICKET_CLOSED: TicketClosed = {
  completed: 0,
  total: 0,
};

export function useTicketClosed() {
  const [ticketClosed, setTicketClosed] = useState<TicketClosed>(DEFAULT_TICKET_CLOSED);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTicketClosed() {
      setIsLoading(true);
      setError(null);

      try {
        const [allResponse, completedResponse] = await Promise.all([
          fetchPage(1, 'dashboard/production_h5', 'rel_type=task&filter=weekly'),
          fetchPage(
            1,
            'dashboard/production_h5',
            'rel_type=task&filter=weekly&status=completed,testing',
          ),
        ]);

        if (cancelled) return;

        setTicketClosed({
          total: Number(allResponse?.total ?? 0),
          completed: Number(completedResponse?.total ?? 0),
        });
      } catch (err: any) {
        if (cancelled) return;

        setError(String(err?.message || 'Failed to load ticket closed'));
        setTicketClosed(DEFAULT_TICKET_CLOSED);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadTicketClosed();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    ticketClosed,
    isLoading,
    error,
  };
}
