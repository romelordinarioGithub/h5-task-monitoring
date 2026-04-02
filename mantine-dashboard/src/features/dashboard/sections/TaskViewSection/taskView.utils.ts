import type { RawData } from '@/features/dashboard/services/dashboard.types';
import {
  formatAssigneeNames,
  getTaskHealthFromDueDate,
  normalizeApiKey,
  normalizeTaskLabel,
  normalizeTaskPriority,
  normalizeTaskStatus,
} from '@/features/dashboard/services/dashboard.utils';

export type Task = {
  id: string;
  name: string;
  type: string;
  typeKey: string;
  channel: string;
  health: string;
  healthScore: number;
  status: string;
  priority: string;
  assignees: string[];
  assignee: string;
  link?: string;
  dueDate?: string;
  deliveryDate?: string;
};

export function mapRawTaskToTask(item: RawData, index: number): Task | null {
  const name = String(item?.name ?? '').trim();
  if (!name) return null;

  const assignees = formatAssigneeNames(item?.assignees);
  const typeKey = normalizeApiKey(String(item?.task_type ?? '').replace(/_/g, ' '));
  const taskHealth = getTaskHealthFromDueDate(item?.due_date);

  return {
    id: String(item?.link ?? `${name}-${index}`),
    name,
    type: normalizeTaskLabel(item?.task_type),
    typeKey,
    channel: String(item?.channel ?? 'Unknown').trim() || 'Unknown',
    health: taskHealth.label,
    healthScore: taskHealth.score,
    status: normalizeTaskStatus(item?.status),
    priority: normalizeTaskPriority(item?.priority),
    assignees,
    assignee: assignees.join(', '),
    link: String(item?.link ?? '').trim() || undefined,
    dueDate: String(item?.due_date ?? '').trim() || undefined,
    deliveryDate: String(item?.delivery_date ?? '').trim() || undefined,
  };
}
