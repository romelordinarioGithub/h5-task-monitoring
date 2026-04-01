import {
  createContext,
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
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { taskTypes } from '../sections/KPISnapshotSection/api';
import { tasks, type Task } from '../sections/TaskViewSection/api';

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
  taskTableHeight: number | null;
  taskTableAreaRef: RefObject<HTMLDivElement | null>;
  resourceSectionRef: RefObject<HTMLDivElement | null>;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  totalTaskCount: number;
  resourceTaskCounts: Record<string, number>;
  filterOptions: {
    taskType: string[];
    channel: string[];
    health: string[];
    status: string[];
    priority: string[];
    assignee: string[];
  };
  filteredTasks: typeof tasks;
  selectedTask: Task;
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

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: PropsWithChildren) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTaskName, setSelectedTaskName] = useState(tasks[0].name);
  const [taskTableHeight, setTaskTableHeight] = useState<number | null>(null);
  const taskTableAreaRef = useRef<HTMLDivElement | null>(null);
  const resourceSectionRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<Filters>({
    taskName: '',
    taskType: 'All',
    channel: 'All',
    health: 'All',
    status: 'All',
    priority: 'All',
    assignee: '',
  });

  const totalTaskCount = useMemo(
    () => taskTypes.reduce((sum, item) => sum + item.count, 0),
    [],
  );

  const resourceTaskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((task) => {
      task.assignees.forEach((assignee) => {
        counts[assignee] = (counts[assignee] || 0) + 1;
      });
    });
    return counts;
  }, []);

  const filterOptions = useMemo(
    () => ({
      taskType: ['All', ...new Set(tasks.map((task) => task.type))],
      channel: ['All', ...new Set(tasks.map((task) => task.channel))],
      health: ['All', ...new Set(tasks.map((task) => task.health))],
      status: ['All', ...new Set(tasks.map((task) => task.status))],
      priority: ['All', ...new Set(tasks.map((task) => task.priority))],
      assignee: ['All', ...new Set(tasks.flatMap((task) => task.assignees))],
    }),
    [],
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (
          filters.taskName.trim() &&
          !task.name.toLowerCase().includes(filters.taskName.trim().toLowerCase())
        ) {
          return false;
        }
        if (filters.taskType !== 'All' && task.type !== filters.taskType) return false;
        if (filters.channel !== 'All' && task.channel !== filters.channel) return false;
        if (filters.health !== 'All' && task.health !== filters.health) return false;
        if (filters.status !== 'All' && task.status !== filters.status) return false;
        if (filters.priority !== 'All' && task.priority !== filters.priority)
          return false;
        if (
          filters.assignee.trim() &&
          !task.assignees.some((assignee) =>
            assignee.toLowerCase().includes(filters.assignee.trim().toLowerCase()),
          )
        ) {
          return false;
        }
        return true;
      }),
    [filters],
  );

  const selectedTask =
    filteredTasks.find((task) => task.name === selectedTaskName) ??
    filteredTasks[0] ??
    tasks[0];

  const utilizationMeta = {
    high: { label: 'High utilization', color: 'teal', Icon: IconArrowUpRight },
    low: { label: 'Under utilized', color: 'red', Icon: IconArrowDownRight },
  };

  useEffect(() => {
    if (filteredTasks.length === 0) return;
    if (!filteredTasks.some((task) => task.name === selectedTaskName)) {
      setSelectedTaskName(filteredTasks[0].name);
    }
  }, [filteredTasks, selectedTaskName]);

  useLayoutEffect(() => {
    const updateTaskTableHeight = () => {
      const tableArea = taskTableAreaRef.current;
      const resourceSection = resourceSectionRef.current;
      if (!tableArea || !resourceSection) return;

      const top = tableArea.getBoundingClientRect().top;
      const bottom = resourceSection.getBoundingClientRect().bottom;
      const nextHeight = Math.max(280, Math.floor(bottom - top));
      setTaskTableHeight((current) => (current === nextHeight ? current : nextHeight));
    };

    const frame = requestAnimationFrame(updateTaskTableHeight);
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
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateTaskTableHeight);
    };
  }, [sidebarCollapsed]);

  const value: DashboardContextValue = {
    sidebarCollapsed,
    setSidebarCollapsed,
    selectedTaskName,
    setSelectedTaskName,
    taskTableHeight,
    taskTableAreaRef,
    resourceSectionRef,
    filters,
    setFilters,
    totalTaskCount,
    resourceTaskCounts,
    filterOptions,
    filteredTasks,
    selectedTask,
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
