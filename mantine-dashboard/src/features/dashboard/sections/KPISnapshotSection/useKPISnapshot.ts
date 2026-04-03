import type { ComponentType } from 'react';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useDashboard } from '../../providers/DashboardProvider';
import { getDashboardKPITaskTypes } from '@/features/dashboard/services/dashboard.config';
import { normalizeApiKey } from '@/features/dashboard/services/dashboard.utils';
import { fetchWeeklyKPISnapshot } from '@/features/dashboard/services/dashboardQueries';

export type TaskType = {
  name: string;
  count: number;
  icon: ComponentType<{ size?: number | string }>;
};

export function useKPISnapshot() {
  const { selectedTeam } = useDashboard();

  const initialTaskTypes = useMemo<TaskType[]>(
    () =>
      getDashboardKPITaskTypes(selectedTeam).map((item) => ({
        name: item.name,
        count: 0,
        icon: item.icon,
      })),
    [selectedTeam],
  );

  const [taskTypes, setTaskTypes] = useState<TaskType[]>(initialTaskTypes);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function loadKPISnapshot() {
      setIsLoading(true);
      setError(null);

      try {
        const totalsByApiKey = await fetchWeeklyKPISnapshot(
          selectedTeam,
          controller.signal,
        );

        if (!mounted) return;

        const nextTaskTypes = getDashboardKPITaskTypes(selectedTeam).map((taskType) => ({
          name: taskType.name,
          icon: taskType.icon,
          count: totalsByApiKey[normalizeApiKey(taskType.apiKey)] ?? 0,
        }));

        setTaskTypes(nextTaskTypes);
      } catch (error: unknown) {
        if (axios.isCancel(error)) return;
        if (!mounted) return;

        setError(error instanceof Error ? error.message : 'Failed to load KPI snapshot');
        setTaskTypes(initialTaskTypes);
      } finally {
        if (mounted && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadKPISnapshot();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [initialTaskTypes, selectedTeam]);

  const totalTaskCount = useMemo(
    () => taskTypes.reduce<number>((sum, item) => sum + item.count, 0),
    [taskTypes],
  );

  return {
    taskTypes,
    totalTaskCount,
    isLoading,
    error,
  };
}
