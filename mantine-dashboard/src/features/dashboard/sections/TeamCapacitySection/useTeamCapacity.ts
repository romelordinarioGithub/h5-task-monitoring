import { useEffect, useMemo, useState } from 'react';
import { fetchTeamResources } from '@/features/dashboard/services/dashboardQueries';
import { getDashboardTeamConfig } from '@/features/dashboard/services/dashboard.config';
import type { DashboardTeamKey, RawDevResource } from '../../services/dashboard.types';
import {
  type DevResource,
  mapDevResource,
  isWithinScheduleAndTime,
  TEAM_CAPACITY_CONSTANTS,
} from './teamCapacity.utils';

type TaskLike = {
  status: string;
  assignees: string[];
};

const { IN_PROGRESS } = TEAM_CAPACITY_CONSTANTS;
const teamResourcesCache = new Map<DashboardTeamKey, DevResource[]>();

export function useTeamCapacity(tasks: TaskLike[], selectedTeam: DashboardTeamKey) {
  const [resources, setResources] = useState<DevResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const excludedUserIds = useMemo(
    () => new Set(getDashboardTeamConfig(selectedTeam).excludedUserIds),
    [selectedTeam],
  );

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
    const controller = new AbortController();

    async function loadResources() {
      const cachedResources = teamResourcesCache.get(selectedTeam) ?? null;

      if (cachedResources) {
        setResources(cachedResources);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const response = await fetchTeamResources(selectedTeam, controller.signal);
        if (cancelled) return;

        const data = Array.isArray(response?.data)
          ? (response.data as RawDevResource[])
          : [];

        const mapped: DevResource[] = [];

        for (const item of data) {
          const resource = mapDevResource(item, excludedUserIds, selectedTeam);
          if (resource) mapped.push(resource);
        }

        teamResourcesCache.set(selectedTeam, mapped);
        setResources(mapped);
      } catch (err: unknown) {
        if (cancelled) return;

        setError(err instanceof Error ? err.message : 'Failed to load team capacity');
        if (!teamResourcesCache.has(selectedTeam)) {
          setResources([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadResources();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [excludedUserIds, selectedTeam]);

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

  const assigneeOptions = useMemo(() => {
    return [...new Set(resources.map((resource) => resource.name).filter(Boolean))];
  }, [resources]);

  return {
    availableResources,
    assigneeOptions,
    totalHeadcount: resources.length,
    isLoading,
    error,
  };
}
