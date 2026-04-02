import type { RawData } from '@/features/dashboard/services/dashboard.types';
import {
  formatAssigneeNames,
  normalizeTaskStatus,
} from '@/features/dashboard/services/dashboard.utils';

export type RecentActivity = {
  key: string;
  task: string;
  toStatus: string;
  actor: string;
};

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

export function createRecentActivityKey(
  page: number,
  index: number,
  task: string,
): string {
  return `recent:${page}:${index}:${slugify(task)}`;
}

function formatActors(assignees?: RawData['assignees']): string {
  const names = formatAssigneeNames(assignees);

  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;

  const last = names[names.length - 1];
  return `${names.slice(0, -1).join(', ')} & ${last}`;
}

export function mapRecentActivity(
  item: RawData,
  context: { page: number; index: number },
): RecentActivity | null {
  const task = String(item?.name ?? '').trim();
  if (!task) return null;

  return {
    key: createRecentActivityKey(context.page, context.index, task),
    task,
    toStatus: normalizeTaskStatus(item?.status),
    actor: formatActors(item?.assignees),
  };
}
