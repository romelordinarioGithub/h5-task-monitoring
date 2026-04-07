import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type RefObject,
  type SetStateAction,
} from 'react';
import axios from 'axios';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import {
  DEFAULT_DASHBOARD_TEAM,
  getDashboardTeamBySlug,
  getDashboardKPITaskTypeByName,
  getDashboardKPITaskTypeLabel,
  getDashboardTeamSlug,
} from '../services/dashboard.config';
import { fetchTaskViewPage } from '../services/dashboardQueries';
import type { DashboardTeamKey } from '../services/dashboard.types';
import { formatChannelLabel } from '../services/dashboard.utils';
import { mapRawTaskToTask, type Task } from '../sections/TaskViewSection/taskView.utils';
import { useTeamCapacity } from '../sections/TeamCapacitySection/useTeamCapacity';
import type { DevResource } from '../sections/TeamCapacitySection/teamCapacity.utils';
import { clearTaskFilterStorage, getStorage, setStorage } from '@/shared/lib/storage';

type Filters = {
  taskName: string;
  taskType: string;
  channel: string;
  health: string;
  status: string;
  priority: string;
  assignee: string;
};

type DashboardContextValue = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
  selectedTaskName: string;
  setSelectedTaskName: Dispatch<SetStateAction<string>>;
  selectedTeam: DashboardTeamKey;
  setSelectedTeam: Dispatch<SetStateAction<DashboardTeamKey>>;
  taskTableHeight: number | null;
  taskTableAreaRef: RefObject<HTMLDivElement | null>;
  resourceSectionRef: RefObject<HTMLDivElement | null>;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  filterOptions: {
    channel: Array<{ value: string; label: string }>;
    health: string[];
    status: string[];
    priority: string[];
    assignee: string[];
  };
  filteredTasks: Task[];
  selectedTask: Task | null;
  availableResources: DevResource[];
  totalHeadcount: number;
  isTeamCapacityLoading: boolean;
  totalTaskCount: number;
  isTasksLoading: boolean;
  isLoadingMoreTasks: boolean;
  isTaskNameFilterPending: boolean;
  taskError: string | null;
  hasMoreTasks: boolean;
  loadMoreTasks: () => void;
  utilizationMeta: {
    high: {
      label: string;
      color: string;
      Icon: typeof IconArrowUpRight;
    };
    low: {
      label: string;
      color: string;
      Icon: typeof IconArrowDownRight;
    };
  };
};

const TASK_HEALTH_OPTIONS = ['All', 'Healthy', 'Watch', 'Risk', 'Critical'];
const TASK_STATUS_OPTIONS = [
  'All',
  'Not Started',
  'On Hold',
  'In Progress',
  'Awaiting Feedback',
  'Client Review',
  'For Handover',
  'Testing',
  'Completed',
];
const TASK_PRIORITY_OPTIONS = ['All', 'Low', 'Normal', 'High', 'Urgent'];
const DEFAULT_TASK_FILTER = {
  taskType: 'All',
  channel: 'All',
  health: 'All',
  status: 'All',
  priority: 'All',
} as const;

const DashboardContext = createContext<DashboardContextValue | null>(null);

function buildAppPath(pathSegment = ''): string {
  const normalizedSegment = String(pathSegment).replace(/^\/+|\/+$/g, '');
  return normalizedSegment ? `/${normalizedSegment}` : '/';
}

function resolveTeamSlugFromPathname(pathname?: string): string {
  const normalizedPathname = String(pathname ?? '').trim();
  if (!normalizedPathname) return '';

  const [firstSegment = ''] = normalizedPathname
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean);

  return firstSegment.toLowerCase();
}

function resolveInitialDashboardTeam(): DashboardTeamKey {
  if (typeof window === 'undefined') {
    return DEFAULT_DASHBOARD_TEAM;
  }

  const slugFromPath = resolveTeamSlugFromPathname(window.location.pathname);
  const teamFromPath = getDashboardTeamBySlug(slugFromPath);
  if (teamFromPath) return teamFromPath;

  const slugFromStorage = getStorage().teamSlug;
  const teamFromStorage = getDashboardTeamBySlug(slugFromStorage);
  if (teamFromStorage) return teamFromStorage;

  return DEFAULT_DASHBOARD_TEAM;
}

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function DashboardProvider({ children }: PropsWithChildren) {
  const DEFAULT_TASK_TABLE_HEIGHT = 420;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<DashboardTeamKey>(resolveInitialDashboardTeam);
  const [selectedTaskName, setSelectedTaskName] = useState('');
  const [taskTableHeight, setTaskTableHeight] = useState<number | null>(
    DEFAULT_TASK_TABLE_HEIGHT,
  );

  const taskTableAreaRef = useRef<HTMLDivElement | null>(null);
  const resourceSectionRef = useRef<HTMLDivElement | null>(null);

  const [filters, setFilters] = useState<Filters>(() => {
    const storedTaskFilter = typeof window === 'undefined' ? null : getStorage().taskFilter;

    return {
      taskName: '',
      taskType: storedTaskFilter?.taskType ?? DEFAULT_TASK_FILTER.taskType,
      channel: storedTaskFilter?.channel ?? DEFAULT_TASK_FILTER.channel,
      health: storedTaskFilter?.health ?? DEFAULT_TASK_FILTER.health,
      status: storedTaskFilter?.status ?? DEFAULT_TASK_FILTER.status,
      priority: storedTaskFilter?.priority ?? DEFAULT_TASK_FILTER.priority,
      assignee: '',
    };
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTaskCount, setTotalTaskCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [isLoadingMoreTasks, setIsLoadingMoreTasks] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);
  const previousSelectedTeamRef = useRef<DashboardTeamKey | null>(null);
  const hasInitializedTaskFilterPersistenceRef = useRef(false);

  const normalizedTaskName = filters.taskName.trim();
  const debouncedTaskName = useDebouncedValue(normalizedTaskName, 400);
  const isTaskNameFilterPending = normalizedTaskName !== debouncedTaskName;
  const normalizedDebouncedTaskName = debouncedTaskName.trim().toLowerCase();
  const hasExactLoadedTaskNameMatch = useMemo(
    () =>
      Boolean(normalizedDebouncedTaskName) &&
      tasks.some((task) => task.name.trim().toLowerCase() === normalizedDebouncedTaskName),
    [normalizedDebouncedTaskName, tasks],
  );

  const serverTaskType = useMemo(() => {
    if (filters.taskType === 'All') return '';

    const matched = getDashboardKPITaskTypeByName(selectedTeam, filters.taskType);
    return matched?.queryValue ?? matched?.apiKey ?? '';
  }, [filters.taskType, selectedTeam]);

  const hasActiveServerSideFilters = useMemo(
    () =>
      Boolean(serverTaskType) ||
      filters.channel !== 'All' ||
      filters.status !== 'All' ||
      filters.priority !== 'All',
    [filters.channel, filters.priority, filters.status, serverTaskType],
  );
  const shouldKeepTaskSearchClientSide =
    Boolean(normalizedDebouncedTaskName) &&
    hasExactLoadedTaskNameMatch &&
    !hasActiveServerSideFilters;
  const effectiveServerTaskNameSearch = shouldKeepTaskSearchClientSide ? '' : debouncedTaskName;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedTeam,
    effectiveServerTaskNameSearch,
    serverTaskType,
    filters.channel,
    filters.status,
    filters.priority,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const isLoadMore = currentPage > 1;

    if (currentPage === 1 && shouldKeepTaskSearchClientSide) {
      setTaskError(null);
      setIsTasksLoading(false);
      setIsLoadingMoreTasks(false);
      return () => {
        cancelled = true;
        controller.abort();
      };
    }

    async function loadTasks() {
      if (isLoadMore) {
        setIsLoadingMoreTasks(true);
      } else {
        setIsTasksLoading(true);
      }

      setTaskError(null);

      try {
        const response = await fetchTaskViewPage(
          selectedTeam,
          {
            page: currentPage,
            limit: 20,
            search: effectiveServerTaskNameSearch || undefined,
            taskType: serverTaskType || undefined,
            channel: filters.channel,
            status: filters.status,
            priority: filters.priority,
          },
          controller.signal,
        );

        if (cancelled) return;

        const mapped = (response.data ?? [])
          .map((item, index) => mapRawTaskToTask(item, index))
          .filter((item): item is Task => Boolean(item))
          .map((task) => {
            const label = getDashboardKPITaskTypeLabel(selectedTeam, task.typeKey);
            return {
              ...task,
              type: label || task.type,
            };
          });

        setTasks((current) => (isLoadMore ? [...current, ...mapped] : mapped));
        setTotalTaskCount(Number(response?.total ?? 0));
        setTotalPages(Number(response?.totalPages ?? 1));
      } catch (error: unknown) {
        if (axios.isCancel(error) || cancelled) return;

        setTaskError(error instanceof Error ? error.message : 'Failed to load tasks');

        if (!isLoadMore) {
          setTasks([]);
          setTotalTaskCount(0);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) {
          setIsTasksLoading(false);
          setIsLoadingMoreTasks(false);
        }
      }
    }

    void loadTasks();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    currentPage,
    effectiveServerTaskNameSearch,
    selectedTeam,
    shouldKeepTaskSearchClientSide,
    serverTaskType,
    filters.channel,
    filters.status,
    filters.priority,
  ]);

  const filteredTasks = useMemo(() => {
    const normalizedTaskName = debouncedTaskName.toLowerCase();
    const normalizedChannelFilter = filters.channel.trim().toLowerCase();

    return tasks.filter((task) => {
      if (
        normalizedTaskName &&
        !task.name.toLowerCase().includes(normalizedTaskName)
      ) {
        return false;
      }

      if (filters.health !== 'All' && task.health !== filters.health) {
        return false;
      }

      if (filters.taskType !== 'All' && task.type !== filters.taskType) {
        return false;
      }

      if (
        filters.channel !== 'All' &&
        task.channel.trim().toLowerCase() !== normalizedChannelFilter
      ) {
        return false;
      }

      if (filters.status !== 'All' && task.status !== filters.status) {
        return false;
      }

      if (filters.priority !== 'All' && task.priority !== filters.priority) {
        return false;
      }

      if (
        filters.assignee.trim() &&
        !task.assignees.some((assignee) =>
          assignee.toLowerCase().includes(filters.assignee.trim().toLowerCase()),
        )
      ) {
        return false;
      }

      return true;
    });
  }, [
    debouncedTaskName,
    filters.assignee,
    filters.channel,
    filters.health,
    filters.priority,
    filters.status,
    filters.taskType,
    tasks,
  ]);

  const {
    availableResources,
    assigneeOptions: teamCapacityAssigneeOptions,
    totalHeadcount,
    isLoading: isTeamCapacityLoading,
  } = useTeamCapacity(filteredTasks, selectedTeam);

  const filterOptions = useMemo(
    () => ({
      channel: [
        { value: 'All', label: 'All' },
        ...Array.from(new Set(tasks.map((task) => task.channel).filter(Boolean))).map(
          (channel) => ({
            value: channel,
            label: formatChannelLabel(channel),
          }),
        ),
      ],
      health: TASK_HEALTH_OPTIONS,
      status: TASK_STATUS_OPTIONS,
      priority: TASK_PRIORITY_OPTIONS,
      assignee: teamCapacityAssigneeOptions,
    }),
    [tasks, teamCapacityAssigneeOptions],
  );

  const selectedTask =
    filteredTasks.find((task) => task.name === selectedTaskName) ??
    filteredTasks[0] ??
    null;

  const hasMoreTasks = currentPage < totalPages;

  const loadMoreTasks = useCallback(() => {
    if (isTasksLoading || isLoadingMoreTasks || !hasMoreTasks) return;
    setCurrentPage((current) => current + 1);
  }, [hasMoreTasks, isLoadingMoreTasks, isTasksLoading]);

  const utilizationMeta = {
    high: { label: 'High utilization', color: 'teal', Icon: IconArrowUpRight },
    low: { label: 'Under utilized', color: 'red', Icon: IconArrowDownRight },
  };

  useEffect(() => {
    if (!selectedTask) {
      setSelectedTaskName('');
      return;
    }

    if (!filteredTasks.some((task) => task.name === selectedTaskName)) {
      setSelectedTaskName(selectedTask.name);
    }
  }, [filteredTasks, selectedTask, selectedTaskName]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const slugFromPath = resolveTeamSlugFromPathname(window.location.pathname);
      const teamFromPath = getDashboardTeamBySlug(slugFromPath);
      if (!teamFromPath) return;
      setSelectedTeam((current) => (current === teamFromPath ? current : teamFromPath));
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const selectedTeamSlug = getDashboardTeamSlug(selectedTeam);
    const currentPathTeamSlug = resolveTeamSlugFromPathname(window.location.pathname);

    if (currentPathTeamSlug !== selectedTeamSlug) {
      const currentSearch = window.location.search ?? '';
      const currentHash = window.location.hash ?? '';
      window.history.replaceState(
        null,
        '',
        `${buildAppPath(selectedTeamSlug)}${currentSearch}${currentHash}`,
      );
    }

    setStorage({ teamSlug: selectedTeamSlug });
  }, [selectedTeam]);

  useEffect(() => {
    const previousSelectedTeam = previousSelectedTeamRef.current;
    previousSelectedTeamRef.current = selectedTeam;

    if (!previousSelectedTeam || previousSelectedTeam === selectedTeam) {
      return;
    }

    clearTaskFilterStorage();

    setFilters((current) => ({
      ...current,
      taskName: '',
      taskType: DEFAULT_TASK_FILTER.taskType,
      channel: DEFAULT_TASK_FILTER.channel,
      health: DEFAULT_TASK_FILTER.health,
      status: DEFAULT_TASK_FILTER.status,
      priority: DEFAULT_TASK_FILTER.priority,
      assignee: '',
    }));
    setSelectedTaskName('');
  }, [selectedTeam]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hasInitializedTaskFilterPersistenceRef.current) {
      hasInitializedTaskFilterPersistenceRef.current = true;
      return;
    }

    setStorage({
      taskFilter: {
        taskType: filters.taskType,
        channel: filters.channel,
        health: filters.health,
        status: filters.status,
        priority: filters.priority,
      },
    });
  }, [filters.channel, filters.health, filters.priority, filters.status, filters.taskType]);

  useLayoutEffect(() => {
    const updateTaskTableHeight = () => {
      const tableArea = taskTableAreaRef.current;
      const resourceSection = resourceSectionRef.current;

      if (!tableArea || !resourceSection) return false;

      const top = tableArea.getBoundingClientRect().top;
      const sideBottom = resourceSection.getBoundingClientRect().bottom;
      const bottom = sideBottom;
      const rawHeight = Math.floor(bottom - top);
      const nextHeight =
        Number.isFinite(rawHeight) && rawHeight > 0
          ? Math.max(320, rawHeight)
          : DEFAULT_TASK_TABLE_HEIGHT;

      if (!Number.isFinite(nextHeight)) return false;

      setTaskTableHeight((current) => (current === nextHeight ? current : nextHeight));
      return true;
    };

    let frame = 0;
    let cancelled = false;
    const runWithRetry = (maxAttempts = 10) => {
      let attempts = 0;

      const tick = () => {
        if (cancelled) return;

        const measured = updateTaskTableHeight();
        if (!measured && attempts < maxAttempts) {
          attempts += 1;
          frame = requestAnimationFrame(tick);
        }
      };

      frame = requestAnimationFrame(tick);
    };

    runWithRetry(16);
    const delayedFrame = window.setTimeout(() => runWithRetry(8), 120);
    const lateFrame = window.setTimeout(() => runWithRetry(8), 360);
    const resourceSection = resourceSectionRef.current;

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && resourceSection
        ? new ResizeObserver(() => {
            updateTaskTableHeight();
          })
        : null;

    if (resourceSection && resizeObserver) {
      resizeObserver.observe(resourceSection);
    }

    window.addEventListener('resize', updateTaskTableHeight);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(delayedFrame);
      window.clearTimeout(lateFrame);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateTaskTableHeight);
    };
  }, [
    sidebarCollapsed,
    filteredTasks.length,
    isTasksLoading,
    isLoadingMoreTasks,
    isTeamCapacityLoading,
    totalHeadcount,
  ]);

  const value: DashboardContextValue = {
    sidebarCollapsed,
    setSidebarCollapsed,
    selectedTaskName,
    setSelectedTaskName,
    selectedTeam,
    setSelectedTeam,
    taskTableHeight,
    taskTableAreaRef,
    resourceSectionRef,
    filters,
    setFilters,
    filterOptions,
    filteredTasks,
    selectedTask,
    availableResources,
    totalHeadcount,
    isTeamCapacityLoading,
    totalTaskCount,
    isTasksLoading,
    isLoadingMoreTasks,
    isTaskNameFilterPending,
    taskError,
    hasMoreTasks,
    loadMoreTasks,
    utilizationMeta,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }

  return context;
}
