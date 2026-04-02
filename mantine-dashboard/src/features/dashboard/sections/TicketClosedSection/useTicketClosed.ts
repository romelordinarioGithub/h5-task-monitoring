import { useEffect, useState } from 'react';
import { useDashboard } from '../../providers/DashboardProvider';
import { fetchWeeklyTicketTotals } from '@/features/dashboard/services/dashboardQueries';

export type TicketClosed = {
  completed: number;
  total: number;
};

const DEFAULT_TICKET_CLOSED: TicketClosed = {
  completed: 0,
  total: 0,
};

export function useTicketClosed() {
  const { selectedTeam } = useDashboard();

  const [ticketClosed, setTicketClosed] = useState<TicketClosed>(DEFAULT_TICKET_CLOSED);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTicketClosed() {
      setIsLoading(true);
      setError(null);

      try {
        const ticketTotals = await fetchWeeklyTicketTotals(selectedTeam);

        if (cancelled) return;
        setTicketClosed(ticketTotals);
      } catch (err: unknown) {
        if (cancelled) return;

        setError(err instanceof Error ? err.message : 'Failed to load ticket closed');
        setTicketClosed(DEFAULT_TICKET_CLOSED);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadTicketClosed();

    return () => {
      cancelled = true;
    };
  }, [selectedTeam]);

  return {
    ticketClosed,
    isLoading,
    error,
  };
}
