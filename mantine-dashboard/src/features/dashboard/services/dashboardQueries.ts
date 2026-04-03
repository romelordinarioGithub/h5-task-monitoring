import { getDashboardKPITaskTypes, getDashboardTeamConfig } from './dashboard.config';
import { fetchPage, type PaginatedResponse } from './dashboardApi';
import type { DashboardTeamKey, RawData, RawDevResource } from './dashboard.types';
import { normalizeFilterQueryValue } from './dashboard.utils';

export type TaskViewQuery = {
  page?: number;
  limit?: number;
  search?: string;
  taskType?: string;
  channel?: string;
  status?: string;
  priority?: string;
};

export function buildTaskViewQuery(query: TaskViewQuery): string {
  const params = new URLSearchParams();

  params.set('rel_type', 'task');
  params.set('filter', 'weekly');
  params.set('sort', 'asc');

  if (query.limit) params.set('limit', String(query.limit));
  if (query.search?.trim()) {
    const normalizedSearch = query.search.trim();
    params.set('search', normalizedSearch);
    params.set('task_name', normalizedSearch);
  }
  if (query.taskType?.trim()) params.set('task_type', query.taskType.trim());
  if (query.channel && query.channel !== 'All') params.set('channel', query.channel);
  if (query.status && query.status !== 'All') {
    params.set('status', normalizeFilterQueryValue(query.status));
  }
  if (query.priority && query.priority !== 'All') {
    params.set('priority', normalizeFilterQueryValue(query.priority));
  }

  return params.toString();
}

/** KPI Snapshot Section */
export async function fetchWeeklyKPISnapshot(
  team: DashboardTeamKey,
  signal?: AbortSignal,
): Promise<Record<string, number>> {
  const teamPath = getDashboardTeamConfig(team).path;
  const kpiTaskTypes = getDashboardKPITaskTypes(team);

  const responses = await Promise.all(
    kpiTaskTypes.map(async ({ apiKey, queryValue }) => {
      const response = await fetchPage<RawData>(
        1,
        `dashboard/${teamPath}`,
        buildTaskViewQuery({
          taskType: queryValue ?? apiKey,
          limit: 15,
        }),
        signal,
      );

      return [apiKey, Number(response?.total ?? 0)] as const;
    }),
  );

  return responses.reduce<Record<string, number>>((acc, [apiKey, total]) => {
    acc[apiKey] = total;
    return acc;
  }, {});
}

/** Recent Updates Section */
export async function fetchWeeklyRecentUpdatesPage(
  team: DashboardTeamKey,
  page: number,
  signal?: AbortSignal,
): Promise<PaginatedResponse<RawData>> {
  const teamPath = getDashboardTeamConfig(team).path;

  return fetchPage<RawData>(
    page,
    `dashboard/${teamPath}`,
    'rel_type=task&filter=weekly&sort=desc',
    signal,
  );
}

/** Ticket Closed Section */
export async function fetchWeeklyTicketTotals(
  team: DashboardTeamKey,
  signal?: AbortSignal,
): Promise<{ total: number; completed: number }> {
  const teamPath = getDashboardTeamConfig(team).path;

  const [allResponse, completedResponse] = await Promise.all([
    fetchPage<RawData>(1, `dashboard/${teamPath}`, 'rel_type=task&filter=weekly', signal),
    fetchPage<RawData>(
      1,
      `dashboard/${teamPath}`,
      'rel_type=task&filter=weekly&status=completed,testing',
      signal,
    ),
  ]);

  return {
    total: Number(allResponse?.total ?? 0),
    completed: Number(completedResponse?.total ?? 0),
  };
}

/** Team Capacity Section */
export async function fetchTeamResources(
  team: DashboardTeamKey,
  signal?: AbortSignal,
): Promise<PaginatedResponse<RawDevResource>> {
  const teamPath = getDashboardTeamConfig(team).path;
  return fetchPage<RawDevResource>(1, `team-resource/${teamPath}`, 'limit=30', signal);
}

/** Task View Section */
export async function fetchTaskViewPage(
  team: DashboardTeamKey,
  query: TaskViewQuery,
  signal?: AbortSignal,
): Promise<PaginatedResponse<RawData>> {
  const teamPath = getDashboardTeamConfig(team).path;
  const page = query.page ?? 1;

  return fetchPage<RawData>(
    page,
    `dashboard/${teamPath}`,
    buildTaskViewQuery(query),
    signal,
  );
}
