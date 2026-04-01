import { RawData } from '../../services/dashboard.types';

export type RecentActivity = {
  key: string;
  task: string;
  // fromStatus: string;
  toStatus: string;
  actor: string;
  // time: string;
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
  if (!Array.isArray(assignees) || assignees.length === 0) return '';

  const names = assignees
    .map((assignee) => String(assignee?.name ?? '').trim())
    .filter(Boolean);

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
  const toStatus = String(item?.status ?? 'Unknown').trim() || 'Unknown';
  const actor = formatActors(item?.assignees);

  return {
    key: createRecentActivityKey(context.page, context.index, task),
    task,
    // fromStatus: 'In Progress',
    toStatus,
    actor,
    // time: 'xx ago',
  };
}
