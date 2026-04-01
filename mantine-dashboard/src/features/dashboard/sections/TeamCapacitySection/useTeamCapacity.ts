import { useEffect, useMemo, useState } from 'react';
import { fetchPage } from '@/features/dashboard/services/dashboardApi';
import {
  type DevResource,
  type RawDevResource,
  mapDevResource,
  isWithinScheduleAndTime,
  TEAM_CAPACITY_CONSTANTS,
} from './teamCapacity.utils';

type TaskLike = {
  status: string;
  assignees: string[];
};

const { IN_PROGRESS } = TEAM_CAPACITY_CONSTANTS;

export function useTeamCapacity(tasks: TaskLike[]) {
  const [resources, setResources] = useState<DevResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowTick(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchPage(1, 'team-resource/production_h5', 'limit=50');
        if (cancelled) return;

        const data = Array.isArray(response?.data)
          ? (response.data as RawDevResource[])
          : [];
        const mapped: DevResource[] = [];

        for (const item of data) {
          const resource = mapDevResource(item);
          if (resource) mapped.push(resource);
        }

        setResources(mapped);
      } catch (err: any) {
        if (cancelled) return;
        setError(String(err?.message || 'Failed to load team capacity'));
        setResources([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadResources();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableResources = useMemo(() => {
    const inProgressAssignees = new Set<string>();
    const now = new Date(nowTick);

    for (const task of tasks) {
      if (task.status !== IN_PROGRESS) continue;

      for (const assignee of task.assignees) {
        inProgressAssignees.add(assignee);
      }
    }

    const available: DevResource[] = [];

    for (const resource of resources) {
      if (resource.status === IN_PROGRESS) continue;
      if (inProgressAssignees.has(resource.name)) continue;
      if (
        !isWithinScheduleAndTime(resource.schedule, resource.time, resource.timeZone, now)
      ) {
        continue;
      }

      available.push(resource);
    }

    return available;
  }, [resources, tasks, nowTick]);

  return {
    availableResources,
    totalHeadcount: resources.length,
    isLoading,
    error,
  };
}
