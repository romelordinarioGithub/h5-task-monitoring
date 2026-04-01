export type RawDevResource = {
  user_id?: number | string;
  fullname?: string;
  running_timer?: boolean;
  last_week?: string | number;
  schedule?: string;
  time?: string;
  time_zone?: string;
};

export type DevResource = {
  id: number;
  name: string;
  team: string;
  status: string;
  utilization: number;
  trend: 'high' | 'low';
  schedule: string;
  time: string;
  timeZone: string;
};

const TEAM_NAME = 'H5 Team';
const IN_PROGRESS = 'In Progress';
const AVAILABLE = 'Available';

const DAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const DAY_ALIASES: Record<string, string> = {
  sun: 'sunday',
  sunday: 'sunday',
  mon: 'monday',
  monday: 'monday',
  tue: 'tuesday',
  tues: 'tuesday',
  tuesday: 'tuesday',
  wed: 'wednesday',
  weds: 'wednesday',
  wednesday: 'wednesday',
  thu: 'thursday',
  thur: 'thursday',
  thurs: 'thursday',
  thursday: 'thursday',
  fri: 'friday',
  friday: 'friday',
  sat: 'saturday',
  saturday: 'saturday',
};

export const EXCLUDED_USER_IDS = new Set<number>([1, 24, 858, 890, 891]);

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeDayName(value: string): string {
  return DAY_ALIASES[normalizeWhitespace(value).toLowerCase()] ?? '';
}

function normalizeTimeToken(value: string): string {
  return normalizeWhitespace(value)
    .replace(/\s*:\s*(AM|PM)$/i, ' $1')
    .replace(/\s*(AM|PM)$/i, ' $1')
    .toUpperCase();
}

function parseTimeToMinutes(value: string): number | null {
  const cleaned = normalizeTimeToken(value);
  const match = cleaned.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3];

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;

  if (meridiem === 'AM') {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return hour * 60 + minute;
}

function parseTimeRange(range: string): { start: number; end: number } | null {
  const cleaned = normalizeWhitespace(range);
  const parts = cleaned.split(/\s*-\s*/);

  if (parts.length !== 2) return null;

  const start = parseTimeToMinutes(parts[0]);
  const end = parseTimeToMinutes(parts[1]);

  if (start === null || end === null) return null;

  return { start, end };
}

function parseScheduleDays(schedule: string): Set<number> {
  const result = new Set<number>();
  const cleaned = normalizeWhitespace(schedule);

  if (!cleaned) return result;

  const lower = cleaned.toLowerCase();

  if (lower === 'weekdays') {
    result.add(1);
    result.add(2);
    result.add(3);
    result.add(4);
    result.add(5);
    return result;
  }

  if (lower === 'weekends') {
    result.add(0);
    result.add(6);
    return result;
  }

  if (cleaned.includes('-')) {
    const [rawStart, rawEnd] = cleaned.split(/\s*-\s*/);
    const startName = normalizeDayName(rawStart);
    const endName = normalizeDayName(rawEnd);

    const start = DAY_INDEX[startName];
    const end = DAY_INDEX[endName];

    if (start === undefined || end === undefined) return result;

    let current = start;
    result.add(current);

    while (current !== end) {
      current = (current + 1) % 7;
      result.add(current);
    }

    return result;
  }

  for (const part of cleaned.split(',')) {
    const normalized = normalizeDayName(part);
    const day = DAY_INDEX[normalized];
    if (day !== undefined) result.add(day);
  }

  return result;
}

function getZonedNow(timeZone: string, now: Date) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone || 'Asia/Manila',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);

    const weekday = parts.find((part) => part.type === 'weekday')?.value?.toLowerCase();
    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);

    const dayIndex = weekday ? DAY_INDEX[weekday] : undefined;

    return {
      dayIndex: dayIndex ?? -1,
      minutes: hour * 60 + minute,
    };
  } catch {
    const fallback = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const parts = fallback.formatToParts(now);
    const weekday = parts.find((part) => part.type === 'weekday')?.value?.toLowerCase();
    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);

    const dayIndex = weekday ? DAY_INDEX[weekday] : undefined;

    return {
      dayIndex: dayIndex ?? -1,
      minutes: hour * 60 + minute,
    };
  }
}

export function isWithinScheduleAndTime(
  schedule: string,
  time: string,
  timeZone: string,
  now: Date = new Date(),
): boolean {
  const scheduledDays = parseScheduleDays(schedule);
  if (scheduledDays.size === 0) return false;

  const parsedRange = parseTimeRange(time);
  if (!parsedRange) return false;

  const { start, end } = parsedRange;
  const { dayIndex, minutes } = getZonedNow(timeZone, now);

  if (dayIndex < 0) return false;

  const isOvernight = start > end;

  if (!isOvernight) {
    return scheduledDays.has(dayIndex) && minutes >= start && minutes <= end;
  }

  const previousDayIndex = (dayIndex + 6) % 7;

  const isSameDayWindow = scheduledDays.has(dayIndex) && minutes >= start;
  const isCarryOverWindow = scheduledDays.has(previousDayIndex) && minutes <= end;

  return isSameDayWindow || isCarryOverWindow;
}

export function mapDevResource(item: RawDevResource): DevResource | null {
  const id = Number(item?.user_id);
  if (!Number.isFinite(id) || EXCLUDED_USER_IDS.has(id)) return null;

  const name = normalizeWhitespace(String(item?.fullname ?? ''));
  if (!name) return null;

  const parsedUtilization = Number.parseFloat(String(item?.last_week ?? '0'));
  const utilization = Number.isFinite(parsedUtilization)
    ? Math.round(parsedUtilization)
    : 0;

  const status = item?.running_timer === true ? IN_PROGRESS : AVAILABLE;

  return {
    id,
    name,
    team: TEAM_NAME,
    status,
    utilization,
    trend: utilization >= 60 ? 'high' : 'low',
    schedule: normalizeWhitespace(String(item?.schedule ?? '')),
    time: normalizeWhitespace(String(item?.time ?? '')),
    timeZone:
      normalizeWhitespace(String(item?.time_zone ?? 'Asia/Manila')) || 'Asia/Manila',
  };
}

export const TEAM_CAPACITY_CONSTANTS = {
  IN_PROGRESS,
  AVAILABLE,
};
