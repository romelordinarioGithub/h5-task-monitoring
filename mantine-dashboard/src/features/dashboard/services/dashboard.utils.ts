import type { RawDataAssignee } from './dashboard.types';

export function normalizeApiKey(value?: string | null): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_\s-]+/g, ' ')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')');
}

export function normalizeFilterQueryValue(value?: string | null): string {
  return String(value ?? '')
    .split(',')
    .map((item) => normalizeApiKey(item).replace(/\s+/g, '_'))
    .filter(Boolean)
    .join(',');
}

export function normalizeTaskLabel(value?: string | null): string {
  const normalized = String(value ?? '')
    .trim()
    .replace(/[_-]+/g, ' ')
    .toLowerCase();

  if (!normalized) return 'Unknown';

  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizeTaskStatus(value?: string | null): string {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ');

  switch (normalized) {
    case 'not started':
      return 'Not Started';
    case 'on hold':
      return 'On Hold';
    case 'in progress':
      return 'In Progress';
    case 'awaiting feedback':
      return 'Awaiting Feedback';
    case 'testing':
      return 'Testing';
    case 'completed':
      return 'Completed';
    default:
      return normalized
        ? normalized.replace(/\b\w/g, (char) => char.toUpperCase())
        : 'Unknown';
  }
}

export function normalizeTaskPriority(value?: string | null): string {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ');

  switch (normalized) {
    case 'urgent':
      return 'Urgent';
    case 'high':
      return 'High';
    case 'normal':
      return 'Normal';
    case 'low':
      return 'Low';
    default:
      return normalized
        ? normalized.replace(/\b\w/g, (char) => char.toUpperCase())
        : 'Unknown';
  }
}

export function formatAssigneeNames(assignees?: RawDataAssignee[]): string[] {
  return (assignees ?? [])
    .map((assignee) => String(assignee?.name ?? '').trim())
    .filter(Boolean);
}

export const healthConfig = {
  Healthy: { value: 86, color: 'teal' },
  Watch: { value: 62, color: 'blue' },
  Risk: { value: 38, color: 'violet' },
  Critical: { value: 16, color: 'pink' },
} as const;

export type TaskHealth = keyof typeof healthConfig;

export function getTaskHealthFromDueDate(dueDateStr?: string | null): {
  score: number;
  label: TaskHealth;
} {
  if (!dueDateStr) {
    return {
      score: healthConfig.Healthy.value,
      label: 'Healthy',
    };
  }

  const now = new Date();
  const dueDate = new Date(dueDateStr);

  if (Number.isNaN(dueDate.getTime())) {
    return {
      score: healthConfig.Healthy.value,
      label: 'Healthy',
    };
  }

  const msPerHour = 60 * 60 * 1000;
  const timeLeft = dueDate.getTime() - now.getTime();
  const hoursLeft = timeLeft / msPerHour;

  if (hoursLeft <= 8) {
    return {
      score: healthConfig.Critical.value,
      label: 'Critical',
    };
  }

  if (hoursLeft <= 24) {
    return {
      score: healthConfig.Risk.value,
      label: 'Risk',
    };
  }

  if (hoursLeft <= 72) {
    return {
      score: healthConfig.Watch.value,
      label: 'Watch',
    };
  }

  return {
    score: healthConfig.Healthy.value,
    label: 'Healthy',
  };
}
