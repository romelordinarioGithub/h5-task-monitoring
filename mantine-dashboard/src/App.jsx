import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Autocomplete,
  AppShell,
  Badge,
  Button,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  Paper,
  Progress,
  RingProgress,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core'
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconBrush,
  IconCheck,
  IconChecklist,
  IconCode,
  IconDeviceDesktop,
  IconFolderSymlink,
  IconLayoutSidebarLeftExpand,
  IconMessageCircle,
  IconMoonStars,
  IconPlayerTrackNext,
  IconSun,
  IconUsersGroup,
} from '@tabler/icons-react'
import './App.css'

const teams = [
  { name: 'H5 Team', icon: IconCode, disabled: false },
  { name: 'Design Team', icon: IconBrush, disabled: true },
  { name: 'Video Dev Team', icon: IconPlayerTrackNext, disabled: true },
  { name: 'QA Team', icon: IconChecklist, disabled: true },
]

const taskTypes = [
  { name: 'Concept build', count: 14, icon: IconCode },
  { name: 'Studio Setup', count: 9, icon: IconDeviceDesktop },
  { name: 'Migration', count: 6, icon: IconFolderSymlink },
  { name: 'Build Consultation', count: 11, icon: IconMessageCircle },
  { name: 'Exports', count: 8, icon: IconPlayerTrackNext },
  { name: 'Others (h5)', count: 5, icon: IconBrush },
]

const taskSeeds = [
  {
    title: 'Retail campaign kickoff build',
    type: 'Concept build',
    channel: 'Google Display',
    health: 'Healthy',
    status: 'In Progress',
    priority: 'High',
    assignees: ['Mika Santos', 'Rica Flores'],
  },
  {
    title: 'Creative package setup',
    type: 'Studio Setup',
    channel: 'Meta Static',
    health: 'Watch',
    status: 'Awaiting Feedback',
    priority: 'Normal',
    assignees: ['Paolo Reyes', 'Aira Mendoza'],
  },
  {
    title: 'Legacy unit migration',
    type: 'Migration',
    channel: 'Meta Static',
    health: 'Critical',
    status: 'Testing',
    priority: 'High',
    assignees: ['Ken Dela Cruz', 'Theo Ramos', 'Trish Gomez'],
  },
  {
    title: 'Handoff review',
    type: 'Build Consultation',
    channel: 'Google Display',
    health: 'Watch',
    status: 'Not Started',
    priority: 'Low',
    assignees: ['Aira Mendoza'],
  },
  {
    title: 'Final asset export package',
    type: 'Exports',
    channel: 'Meta Static',
    health: 'Healthy',
    status: 'Completed',
    priority: 'Normal',
    assignees: ['Noel Garcia', 'Bea Santiago'],
  },
  {
    title: 'Special h5 support request',
    type: 'Others (h5)',
    channel: 'Google Display',
    health: 'Risk',
    status: 'On Hold',
    priority: 'Urgent',
    assignees: ['Lea Navarro'],
  },
  {
    title: 'Launch banner concept pack',
    type: 'Concept build',
    channel: 'Meta Static',
    health: 'Watch',
    status: 'Testing',
    priority: 'High',
    assignees: ['Rica Flores', 'Mika Santos'],
  },
  {
    title: 'Placement configuration update',
    type: 'Studio Setup',
    channel: 'Google Display',
    health: 'Healthy',
    status: 'In Progress',
    priority: 'Normal',
    assignees: ['Paul Medina', 'Carlo Ong'],
  },
  {
    title: 'Template rebuild conversion',
    type: 'Migration',
    channel: 'Google Display',
    health: 'Healthy',
    status: 'In Progress',
    priority: 'Normal',
    assignees: ['Nina Bautista'],
  },
  {
    title: 'Pre-build advisory session',
    type: 'Build Consultation',
    channel: 'Meta Static',
    health: 'Healthy',
    status: 'Completed',
    priority: 'Low',
    assignees: ['Arvin Santos', 'Ken Dela Cruz'],
  },
  {
    title: 'Holiday resize concept pack',
    type: 'Concept build',
    channel: 'Google Display',
    health: 'Watch',
    status: 'In Progress',
    priority: 'Normal',
    assignees: ['Bea Santiago'],
  },
  {
    title: 'Feed-driven unit preparation',
    type: 'Studio Setup',
    channel: 'Meta Static',
    health: 'Risk',
    status: 'Testing',
    priority: 'High',
    assignees: ['Carlo Ong', 'Paul Medina'],
  },
  {
    title: 'Archive-to-live ad conversion',
    type: 'Migration',
    channel: 'Google Display',
    health: 'Critical',
    status: 'In Progress',
    priority: 'Urgent',
    assignees: ['Trish Gomez', 'Ken Dela Cruz'],
  },
  {
    title: 'QA checklist alignment',
    type: 'Build Consultation',
    channel: 'Meta Static',
    health: 'Healthy',
    status: 'Awaiting Feedback',
    priority: 'Low',
    assignees: ['Theo Ramos', 'Aira Mendoza'],
  },
]

const tasks = Array.from({ length: 56 }, (_, index) => {
  const seed = taskSeeds[index % taskSeeds.length]
  const assignees = seed.assignees ?? [seed.assignee]
  return {
    name: `${seed.type} - ${seed.title} ${index + 1}`,
    type: seed.type,
    channel: seed.channel,
    health: seed.health,
    status: seed.status,
    priority: seed.priority,
    assignees,
    assignee: assignees.join(', '),
  }
})

const recentActivities = [
  ['Concept build - Retail campaign kickoff build', 'In Progress', 'Testing', 'Mika Santos', '5 mins ago'],
  ['Studio Setup - Creative package setup', 'Awaiting Feedback', 'In Progress', 'Paolo Reyes', '18 mins ago'],
  ['Migration - Legacy unit migration', 'Testing', 'Completed', 'Ken Dela Cruz', '34 mins ago'],
  ['Others - Special h5 support request', 'On Hold', 'In Progress', 'Lea Navarro', '52 mins ago'],
  ['Exports - Final asset export package', 'In Progress', 'Completed', 'Noel Garcia', '1 hour ago'],
].map(([task, fromStatus, toStatus, actor, time]) => ({
  task,
  fromStatus,
  toStatus,
  actor,
  time,
}))

const devResources = [
  {
    name: 'Mika Santos',
    team: 'h5 team',
    capacity: 'Available for 2 tasks',
    skill: 'Rich media builds',
    status: 'Available',
    utilization: 84,
    trend: 'high',
  },
  {
    name: 'Paolo Reyes',
    team: 'video dev team',
    capacity: 'Available for 1 task',
    skill: 'Video packaging',
    status: 'Partially Available',
    utilization: 68,
    trend: 'high',
  },
  {
    name: 'Aira Mendoza',
    team: 'Design team',
    capacity: 'Available for consultation',
    skill: 'Creative setup support',
    status: 'Available',
    utilization: 34,
    trend: 'low',
  },
  {
    name: 'Ken Dela Cruz',
    team: 'QA team',
    capacity: 'Available for testing queue',
    skill: 'QA validation',
    status: 'Available',
    utilization: 27,
    trend: 'low',
  },
  {
    name: 'Noel Garcia',
    team: 'H5 Team',
    capacity: 'Available for 2 tasks',
    skill: 'Exports support',
    status: 'Available',
    utilization: 79,
    trend: 'high',
  },
  {
    name: 'Rica Flores',
    team: 'H5 Team',
    capacity: 'Available for 1 task',
    skill: 'Concept builds',
    status: 'Partially Available',
    utilization: 72,
    trend: 'high',
  },
  {
    name: 'Paul Medina',
    team: 'Video Dev Team',
    capacity: 'Available tomorrow',
    skill: 'Placement setup',
    status: 'Available',
    utilization: 31,
    trend: 'low',
  },
  {
    name: 'Nina Bautista',
    team: 'Design Team',
    capacity: 'Available for 2 reviews',
    skill: 'Creative QA',
    status: 'Available',
    utilization: 22,
    trend: 'low',
  },
  {
    name: 'Arvin Santos',
    team: 'QA Team',
    capacity: 'Available for QA queue',
    skill: 'Testing coverage',
    status: 'Available',
    utilization: 29,
    trend: 'low',
  },
  {
    name: 'Bea Santiago',
    team: 'H5 Team',
    capacity: 'Available for 1 task',
    skill: 'Resizes and variants',
    status: 'Partially Available',
    utilization: 66,
    trend: 'high',
  },
  {
    name: 'Carlo Ong',
    team: 'Video Dev Team',
    capacity: 'Available after handoff',
    skill: 'Feed-driven units',
    status: 'Available',
    utilization: 38,
    trend: 'low',
  },
  {
    name: 'Trish Gomez',
    team: 'Migration Team',
    capacity: 'Available for migration',
    skill: 'Archive to live',
    status: 'Available',
    utilization: 24,
    trend: 'low',
  },
  {
    name: 'Theo Ramos',
    team: 'QA Team',
    capacity: 'Available for 2 test passes',
    skill: 'Checklist validation',
    status: 'Available',
    utilization: 41,
    trend: 'low',
  },
  {
    name: 'Lea Navarro',
    team: 'H5 Team',
    capacity: 'Available for support queue',
    skill: 'Special h5 support',
    status: 'Partially Available',
    utilization: 64,
    trend: 'high',
  },
  {
    name: 'Alden Cruz',
    team: 'Design Team',
    capacity: 'Available for consultation',
    skill: 'Design system support',
    status: 'Available',
    utilization: 19,
    trend: 'low',
  },
]

const badgeColor = {
  Healthy: 'teal',
  Watch: 'blue',
  Risk: 'violet',
  Critical: 'pink',
  'Not Started': 'gray',
  'On Hold': 'grape',
  'In Progress': 'blue',
  'Awaiting Feedback': 'violet',
  Testing: 'cyan',
  Completed: 'teal',
  Low: 'gray',
  Normal: 'blue',
  High: 'violet',
  Urgent: 'pink',
  Available: 'teal',
  'Partially Available': 'blue',
}

const healthConfig = {
  Healthy: { value: 86, color: 'teal' },
  Watch: { value: 62, color: 'blue' },
  Risk: { value: 38, color: 'violet' },
  Critical: { value: 16, color: 'pink' },
}

function ChannelIcon({ channel }) {
  if (channel === 'Google Display') {
    return (
      <Box className="channel-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="channel-mark__svg">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.27-2.09 3.57-5.17 3.57-8.64Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.76-2.1-6.7-4.93H1.3v3.1A12 12 0 0 0 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.3 14.32A7.2 7.2 0 0 1 4.92 12c0-.8.14-1.57.38-2.32v-3.1H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.42l4-3.1Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.77c1.76 0 3.33.6 4.57 1.76l3.43-3.43C17.94 1.15 15.24 0 12 0A12 12 0 0 0 1.3 6.58l4 3.1c.93-2.83 3.57-4.91 6.7-4.91Z"
          />
        </svg>
      </Box>
    )
  }

  return (
    <Box className="channel-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="channel-mark__svg">
        <path
          fill="#0866FF"
          d="M19.18 7.24c-1.15 0-2.08.93-3.28 2.45-.62.79-1.27 1.77-1.9 2.79-.65-1.02-1.3-2-1.92-2.79-1.2-1.52-2.12-2.45-3.27-2.45-2.2 0-3.81 2.14-3.81 4.44 0 1.34.52 2.66 1.46 3.72.92 1.04 2.1 1.59 3.38 1.59.94 0 1.84-.32 2.67-.96.55-.43 1.06-.99 1.49-1.56.43.57.94 1.13 1.49 1.56.83.64 1.73.96 2.67.96 1.28 0 2.46-.55 3.38-1.59.94-1.06 1.46-2.38 1.46-3.72 0-2.3-1.61-4.44-3.82-4.44Zm-8.44 7.3c-.62.49-1.22.73-1.82.73-1.44 0-2.64-1.49-2.64-3.15 0-1.48.94-2.77 2.06-2.77.48 0 1.13.42 2.08 1.62.48.61.98 1.35 1.47 2.14-.34.5-.73 1-1.15 1.43Zm8.5.73c-.6 0-1.2-.24-1.82-.73-.42-.43-.81-.93-1.15-1.43.49-.79.99-1.53 1.47-2.14.95-1.2 1.6-1.62 2.08-1.62 1.12 0 2.06 1.29 2.06 2.77 0 1.66-1.2 3.15-2.64 3.15Z"
        />
      </svg>
    </Box>
  )
}

function ChannelCell({ channel }) {
  return (
    <Box title={channel}>
      <ChannelIcon channel={channel} />
    </Box>
  )
}

function ChannelDetail({ channel }) {
  return (
    <Group gap="sm" wrap="nowrap">
      <ChannelIcon channel={channel} />
      <Text fw={700}>{channel}</Text>
    </Group>
  )
}

function AssigneeChips({ assignees }) {
  const [primaryAssignee, ...otherAssignees] = assignees
  const overflowCount = otherAssignees.length
  const fullLabel = assignees.join(', ')
  const primaryFirstName = primaryAssignee.split(' ')[0] || primaryAssignee

  return (
    <Text
      className="task-queue-truncate assignee-text"
      title={fullLabel}
      aria-label={fullLabel}
    >
      {overflowCount > 0 ? `${primaryFirstName}, +${overflowCount}` : primaryFirstName}
    </Text>
  )
}

function statusBadge(value) {
  return (
    <Badge radius="xl" variant="light" color={badgeColor[value] || 'gray'}>
      {value}
    </Badge>
  )
}

function HealthBar({ health }) {
  const config = healthConfig[health] || { value: 50, color: 'gray' }

  return (
    <Box className="health-cell" title={health}>
      <Progress
        value={config.value}
        color={config.color}
        radius="xl"
        size="sm"
        className="health-cell__progress"
      />
      <Text size="xs" c="dimmed" mt={6}>
        {health}
      </Text>
    </Box>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.27-2.09 3.57-5.17 3.57-8.64Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.76-2.1-6.7-4.93H1.3v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.32A7.2 7.2 0 0 1 4.92 12c0-.8.14-1.57.38-2.32v-3.1H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.42l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.33.6 4.57 1.76l3.43-3.43C17.94 1.15 15.24 0 12 0A12 12 0 0 0 1.3 6.58l4 3.1c.93-2.83 3.57-4.91 6.7-4.91Z"
      />
    </svg>
  )
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [nightMode, setNightMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('adweave-night-mode') === 'true'
  })
  const [sessionEmail, setSessionEmail] = useState(() => {
    if (typeof window === 'undefined') return ''
    return window.localStorage.getItem('adweave-auth-email') || ''
  })
  const [loginEmail, setLoginEmail] = useState('')
  const [loginError, setLoginError] = useState('')
  const [selectedTaskName, setSelectedTaskName] = useState(tasks[0].name)
  const [taskTableHeight, setTaskTableHeight] = useState(null)
  const taskTableAreaRef = useRef(null)
  const resourceSectionRef = useRef(null)
  const [filters, setFilters] = useState({
    taskName: '',
    taskType: 'All',
    channel: 'All',
    health: 'All',
    status: 'All',
    priority: 'All',
    assignee: '',
  })
  const totalTaskCount = useMemo(
    () => taskTypes.reduce((sum, item) => sum + item.count, 0),
    [],
  )
  const resourceTaskCounts = useMemo(() => {
    const counts = {}

    tasks.forEach((task) => {
      task.assignees.forEach((assignee) => {
        counts[assignee] = (counts[assignee] || 0) + 1
      })
    })

    return counts
  }, [])
  const availableResources = useMemo(() => {
    const inProgressAssignees = new Set(
      tasks
        .filter((task) => task.status === 'In Progress')
        .flatMap((task) => task.assignees),
    )

    // Frontend placeholder rule:
    // show a dev as available when they have no "In Progress" task.
    // Backend integration can later replace this with "no active timer".
    return devResources.filter((resource) => !inProgressAssignees.has(resource.name))
  }, [])
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
  )
  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (
          filters.taskName.trim() &&
          !task.name.toLowerCase().includes(filters.taskName.trim().toLowerCase())
        ) {
          return false
        }
        if (filters.taskType !== 'All' && task.type !== filters.taskType) return false
        if (filters.channel !== 'All' && task.channel !== filters.channel) return false
        if (filters.health !== 'All' && task.health !== filters.health) return false
        if (filters.status !== 'All' && task.status !== filters.status) return false
        if (filters.priority !== 'All' && task.priority !== filters.priority) return false
        if (
          filters.assignee.trim() &&
          !task.assignees.some((assignee) =>
            assignee.toLowerCase().includes(filters.assignee.trim().toLowerCase()),
          )
        ) {
          return false
        }
        return true
      }),
    [filters],
  )
  const selectedTask =
    filteredTasks.find((task) => task.name === selectedTaskName) ??
    filteredTasks[0] ??
    tasks[0]
  const ticketClosedCount = 37
  const throughputTotal = ticketClosedCount + tasks.length
  const completionRate = Math.round((ticketClosedCount / Math.max(throughputTotal, 1)) * 100)
  const utilizationMeta = {
    high: {
      label: 'High utilization',
      color: 'teal',
      Icon: IconArrowUpRight,
    },
    low: {
      label: 'Under utilized',
      color: 'red',
      Icon: IconArrowDownRight,
    },
  }

  useEffect(() => {
    if (filteredTasks.length === 0) return
    if (!filteredTasks.some((task) => task.name === selectedTaskName)) {
      setSelectedTaskName(filteredTasks[0].name)
    }
  }, [filteredTasks, selectedTaskName])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('adweave-night-mode', String(nightMode))
  }, [nightMode])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionEmail) {
      window.localStorage.setItem('adweave-auth-email', sessionEmail)
      return
    }

    window.localStorage.removeItem('adweave-auth-email')
  }, [sessionEmail])

  useLayoutEffect(() => {
    const updateTaskTableHeight = () => {
      const tableArea = taskTableAreaRef.current
      const resourceSection = resourceSectionRef.current
      if (!tableArea || !resourceSection) return

      const top = tableArea.getBoundingClientRect().top
      const bottom = resourceSection.getBoundingClientRect().bottom
      const nextHeight = Math.max(280, Math.floor(bottom - top))

      setTaskTableHeight((current) => (current === nextHeight ? current : nextHeight))
    }

    const frame = requestAnimationFrame(updateTaskTableHeight)
    window.addEventListener('resize', updateTaskTableHeight)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', updateTaskTableHeight)
    }
  }, [sessionEmail, sidebarCollapsed])

  const handleLogin = () => {
    const trimmedEmail = loginEmail.trim()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

    if (!isValidEmail) {
      setLoginError('Enter a valid Google email to continue.')
      return
    }

    setLoginError('')
    setSessionEmail(trimmedEmail)
  }

  if (!sessionEmail) {
    return (
      <Box className={`dashboard-shell login-shell ${nightMode ? 'theme-dark' : ''}`}>
        <Box className="login-layout">
          <Paper className="login-brand-panel" p="xl" radius="md">
            <Group justify="space-between" align="flex-start">
              <Group gap="sm">
                <ThemeIcon size={42} radius="md" variant="light" color="grape">
                  <IconDeviceDesktop size={22} />
                </ThemeIcon>
                <div>
                  <Text className="dashboard-brand-kicker">AdWeave</Text>
                  <Title order={2} className="dashboard-brand-title">
                    Monitoring
                  </Title>
                </div>
              </Group>
              <UnstyledButton
                className="hero-mode-toggle hero-mode-toggle--icon"
                onClick={() => setNightMode((value) => !value)}
                aria-label={nightMode ? 'Switch to light mode' : 'Switch to night mode'}
                title={nightMode ? 'Switch to light mode' : 'Switch to night mode'}
              >
                <ThemeIcon variant="light" color={nightMode ? 'yellow' : 'grape'} radius="md" size={28}>
                  {nightMode ? <IconSun size={15} /> : <IconMoonStars size={15} />}
                </ThemeIcon>
              </UnstyledButton>
            </Group>

            <Stack gap="md" mt="xl">
              <Text className="section-kicker login-kicker">Operations Workspace</Text>
              <Title order={1} className="login-title">
                Sign in to H5 Task Monitoring
              </Title>
              <Text c="dimmed" maw={460} className="login-copy">
                Access the internal dashboard for task visibility, current workload,
                and team capacity review.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 3 }} mt="xl" spacing="sm">
              <Paper className="login-preview-card" p="md" radius="md">
                <Text className="section-kicker">Task Queue</Text>
                <Title order={3}>Task visibility</Title>
                <Text c="dimmed" size="sm">
                  Review queued work, filters, and focused task details after sign-in.
                </Text>
              </Paper>
              <Paper className="login-preview-card" p="md" radius="md">
                <Text className="section-kicker">Delivery</Text>
                <Title order={3}>Delivery tracking</Title>
                <Text c="dimmed" size="sm">
                  Follow ticket closure progress and recent activity updates in one place.
                </Text>
              </Paper>
              <Paper className="login-preview-card" p="md" radius="md">
                <Text className="section-kicker">Capacity</Text>
                <Title order={3}>Team capacity</Title>
                <Text c="dimmed" size="sm">
                  Check available dev resources once access is granted.
                </Text>
              </Paper>
            </SimpleGrid>
          </Paper>

          <Card withBorder radius="md" padding="xl" className="login-card">
            <Text className="section-kicker">Google Access</Text>
            <Title order={2} mt={6}>
              Continue with your Google email
            </Title>
            <Text c="dimmed" mt="sm">
              This is a frontend-only sign-in screen for now. Real Google OAuth can
              replace this later without changing the overall UI.
            </Text>

            <Stack gap="md" mt="xl">
              <TextInput
                label="Google Email"
                placeholder="name@company.com"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.currentTarget.value)}
                error={loginError}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleLogin()
                  }
                }}
              />

              <Button
                size="md"
                radius="md"
                color="grape"
                leftSection={<GoogleMark />}
                onClick={handleLogin}
              >
                Continue with Google
              </Button>

              <Text size="sm" c="dimmed">
                Example: use your work Google email to preview the internal
                dashboard experience.
              </Text>
            </Stack>
          </Card>
        </Box>
      </Box>
    )
  }

  return (
    <AppShell
      className={`dashboard-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${nightMode ? 'theme-dark' : ''}`}
      navbar={{ width: sidebarCollapsed ? 92 : 292, breakpoint: 'md' }}
      padding="lg"
    >
      <AppShell.Navbar className="dashboard-navbar">
        <AppShell.Section p="md">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <ThemeIcon size={38} radius="md" variant="light" color="grape">
                <IconDeviceDesktop size={20} />
              </ThemeIcon>
              <div className="brand-copy">
                <Text className="dashboard-brand-kicker">AdWeave</Text>
                <Title order={3} className="dashboard-brand-title">
                  Monitoring
                </Title>
              </div>
            </Group>
            <UnstyledButton
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed((value) => !value)}
              aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              title={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <ThemeIcon variant="subtle" color="gray" radius="md">
              <IconLayoutSidebarLeftExpand size={18} />
              </ThemeIcon>
            </UnstyledButton>
          </Group>
        </AppShell.Section>

        <AppShell.Section grow p="md">
          <Text className="sidebar-label">Teams</Text>
          <Stack gap="xs" mt="sm">
            {teams.map((team, index) => (
              <Paper
                key={team.name}
                className={`team-card ${index === 0 ? 'is-active' : ''} ${team.disabled ? 'is-disabled' : ''}`}
                p="sm"
                radius="md"
                title={team.name}
              >
                <Group gap="sm">
                  <ThemeIcon
                    radius="md"
                    variant={index === 0 ? 'filled' : 'light'}
                    color={team.disabled ? 'gray' : index === 0 ? 'grape' : 'gray'}
                  >
                    <team.icon size={16} />
                  </ThemeIcon>
                  <Text fw={600} className="team-card-label">
                    {team.name}
                  </Text>
                  {team.disabled ? (
                    <Badge size="xs" variant="light" color="gray" radius="xl" ml="auto">
                      Soon
                    </Badge>
                  ) : null}
                </Group>
              </Paper>
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section p="md">
          <Paper className="sidebar-foot" p="md" radius="md">
            <Badge color="grape" variant="light" radius="xl">
              4 teams
            </Badge>
            <Text mt="sm" size="sm" c="dimmed">
              Internal navigation for monitoring ownership and team views.
            </Text>
          </Paper>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main className="dashboard-main-area">
        <Paper className="hero-card" p="xl" radius="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text className="section-kicker">Operations Workspace</Text>
              <Group gap="sm" align="center" wrap="nowrap">
                <Title order={1}>Team Dashboard</Title>
                <Badge size="lg" variant="light" color="violet" radius="xl">
                  3 items need attention
                </Badge>
              </Group>
              <Text mt="sm" c="dimmed" maw={720}>
                A cleaner daily workspace for checking task volume, reviewing
                current work, and tracking team capacity.
              </Text>
            </div>
            <Stack gap="md" align="flex-end" className="hero-actions">
              <UnstyledButton
                className="hero-mode-toggle hero-mode-toggle--icon"
                onClick={() => setNightMode((value) => !value)}
                aria-label={nightMode ? 'Switch to light mode' : 'Switch to night mode'}
                title={nightMode ? 'Switch to light mode' : 'Switch to night mode'}
              >
                <ThemeIcon variant="light" color={nightMode ? 'yellow' : 'grape'} radius="md" size={28}>
                  {nightMode ? <IconSun size={15} /> : <IconMoonStars size={15} />}
                </ThemeIcon>
              </UnstyledButton>
              <Badge
                leftSection={<IconArrowUpRight size={14} />}
                size="lg"
                color="grape"
                radius="md"
              >
                To Ad-weave
              </Badge>
            </Stack>
          </Group>
        </Paper>

        <Grid mt="lg">
          <Grid.Col span={{ base: 12, xl: 6 }}>
            <Card withBorder radius="md" padding="lg" h="100%">
              <Text className="section-kicker">KPI Snapshot</Text>
              <Title order={3} mt={4}>
                Task Type Summary
              </Title>
              <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} mt="lg">
                {taskTypes.map((type) => {
                  const share = Math.round((type.count / totalTaskCount) * 100)
                  const Icon = type.icon
                  const isActive = filters.taskType === type.name
                  return (
                    <Paper
                      key={type.name}
                      className={`stat-card ${isActive ? 'is-active' : ''}`}
                      p="lg"
                      radius="md"
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          taskType: current.taskType === type.name ? 'All' : type.name,
                        }))
                      }
                    >
                      <Group justify="space-between" align="flex-start">
                        <ThemeIcon size={42} radius="md" variant="light" color="grape">
                          <Icon size={20} />
                        </ThemeIcon>
                        <Badge color="gray" variant="light" radius="xl">
                          {share}% load
                        </Badge>
                      </Group>
                      <Text fw={600} mt="md">
                        {type.name}
                      </Text>
                      <Group align="end" gap={6} mt="sm">
                        <Title order={1} className="stat-card-value">
                          {type.count}
                        </Title>
                        <Text mb={6} c="dimmed">
                          tasks
                        </Text>
                      </Group>
                      <Progress value={share} color="grape" radius="xl" mt="md" />
                    </Paper>
                  )
                })}
              </SimpleGrid>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, xl: 3 }}>
            <Card withBorder radius="md" padding="lg" h="100%">
              <Text className="section-kicker">Delivery Progress</Text>
              <Title order={3} mt={4}>
                Ticket Closed
              </Title>
              <Box mt="lg" className="ticket-card">
                <RingProgress
                  size={220}
                  thickness={18}
                  roundCaps
                  sections={[{ value: completionRate, color: 'grape.7' }]}
                  rootColor="gray.2"
                  label={
                    <Stack gap={2} align="center">
                      <Text size="sm" c="dimmed">
                        Completed
                      </Text>
                      <Title order={1}>{ticketClosedCount}</Title>
                    </Stack>
                  }
                />
                <Divider my="lg" />
                <Text c="dimmed" size="sm">
                  {ticketClosedCount} tickets have been closed in this dashboard
                  view, out of {throughputTotal} tracked items across closed and
                  open workload.
                </Text>
              </Box>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, xl: 3 }}>
            <Card withBorder radius="md" padding="lg" h="100%">
              <Text className="section-kicker">Recent Updates</Text>
              <Title order={3} mt={4}>
                Recent Activity
              </Title>
              <ScrollArea h={360} mt="lg" offsetScrollbars className="recent-activity-scroll">
                <Stack gap="sm" className="recent-activity-list">
                  {recentActivities.map((activity) => (
                    <Paper
                      key={`${activity.task}-${activity.time}`}
                      p="md"
                      radius="md"
                      withBorder
                      className="recent-activity-item"
                    >
                      <div className="recent-activity-copy">
                        <Group
                          justify="space-between"
                          align="flex-start"
                          wrap="nowrap"
                          className="recent-activity-header"
                        >
                          <Text fw={600} size="sm" className="recent-activity-title">
                            {activity.task}
                          </Text>
                          <Text size="xs" c="dimmed" className="recent-activity-time">
                            {activity.time}
                          </Text>
                        </Group>
                        <Text size="sm" c="dimmed" mt={6} className="recent-activity-description">
                          Status changed from <strong>{activity.fromStatus}</strong> to{' '}
                          <strong>{activity.toStatus}</strong> by {activity.actor}.
                        </Text>
                        <Group gap={6} mt="sm" className="recent-activity-badges">
                          {statusBadge(activity.fromStatus)}
                          {statusBadge(activity.toStatus)}
                        </Group>
                      </div>
                    </Paper>
                  ))}
                </Stack>
              </ScrollArea>
            </Card>
          </Grid.Col>
        </Grid>

        <Box mt="lg" className="dashboard-work-layout">
          <Box className="dashboard-work-main">
            <Card withBorder radius="md" padding="lg" className="task-view-card">
              <Text className="section-kicker">Task Queue</Text>
              <Title order={2} mt={4}>
                Task View
              </Title>
              <Badge color="gray" variant="light" radius="xl" mt="sm">
                {filteredTasks.length} of {tasks.length} tasks
              </Badge>
              {filters.taskType !== 'All' ? (
                <Badge color="grape" variant="light" radius="xl" mt="sm">
                  Filtered by {filters.taskType}
                </Badge>
              ) : null}

              <SimpleGrid cols={{ base: 1, md: 2, xl: 6 }} mt="lg" className="task-filters">
                <Autocomplete
                  label="Task Name"
                  data={tasks.map((task) => task.name)}
                  placeholder="Search a task"
                  value={filters.taskName}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      taskName: event,
                    }))
                  }
                  autoComplete="off"
                />
                <Select
                  label="Channel"
                  data={filterOptions.channel}
                  value={filters.channel}
                  onChange={(value) =>
                    setFilters((current) => ({ ...current, channel: value || 'All' }))
                  }
                  allowDeselect={false}
                />
                <Select
                  label="Health"
                  data={filterOptions.health}
                  value={filters.health}
                  onChange={(value) =>
                    setFilters((current) => ({ ...current, health: value || 'All' }))
                  }
                  allowDeselect={false}
                />
                <Select
                  label="Status"
                  data={filterOptions.status}
                  value={filters.status}
                  onChange={(value) =>
                    setFilters((current) => ({ ...current, status: value || 'All' }))
                  }
                  allowDeselect={false}
                />
                <Select
                  label="Priority"
                  data={filterOptions.priority}
                  value={filters.priority}
                  onChange={(value) =>
                    setFilters((current) => ({ ...current, priority: value || 'All' }))
                  }
                  allowDeselect={false}
                />
                <Autocomplete
                  label="Assigned Dev"
                  data={filterOptions.assignee.filter((value) => value !== 'All')}
                  placeholder="Type a dev name"
                  value={filters.assignee}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      assignee: event,
                    }))
                  }
                  autoComplete="off"
                />
              </SimpleGrid>

              <Box
                ref={taskTableAreaRef}
                mt="lg"
                className="task-table-scroll"
                style={taskTableHeight ? { height: `${taskTableHeight}px` } : undefined}
              >
              <Table.ScrollContainer
                minWidth={920}
                h="100%"
              >
                <Table highlightOnHover verticalSpacing="md" className="task-table">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Task Name</Table.Th>
                      <Table.Th>Task Type</Table.Th>
                      <Table.Th>Channel</Table.Th>
                      <Table.Th>Health</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Priority</Table.Th>
                      <Table.Th>Assigned Dev</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredTasks.map((task) => (
                        <Table.Tr
                          key={task.name}
                          className={selectedTaskName === task.name ? 'task-row-selected' : ''}
                          onClick={() => setSelectedTaskName(task.name)}
                        >
                        <Table.Td>
                          <Text fw={600} className="task-queue-truncate">
                            {task.name}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text className="task-queue-truncate">{task.type}</Text>
                        </Table.Td>
                        <Table.Td>
                          <ChannelCell channel={task.channel} />
                        </Table.Td>
                        <Table.Td>
                          <HealthBar health={task.health} />
                        </Table.Td>
                        <Table.Td>{statusBadge(task.status)}</Table.Td>
                        <Table.Td>{statusBadge(task.priority)}</Table.Td>
                        <Table.Td>
                          <AssigneeChips assignees={task.assignees} />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                    {filteredTasks.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={7}>
                          <Text c="dimmed" ta="center" py="xl">
                            No tasks match the selected filters.
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ) : null}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
              </Box>
            </Card>
          </Box>

          <Box className="dashboard-work-side">
            <Box className="dashboard-side-measure">
              <Stack className="dashboard-side-stack">
              <Card withBorder radius="md" padding="lg">
                <Text className="section-kicker">Focused View</Text>
                <Title order={3} mt={4}>
                  Selected Task Detail
                </Title>
                <Paper className="selected-task-hero" p="lg" radius="md" mt="lg">
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                      Active Selection
                    </Text>
                    <UnstyledButton
                      className="selected-task-link"
                      aria-label="Open selected task link"
                      title="Open selected task link"
                    >
                      <Group gap={6} wrap="nowrap" className="selected-task-link__inner">
                        <Text size="xs" fw={700} tt="uppercase">
                          Task Link
                        </Text>
                        <IconArrowUpRight size={16} />
                      </Group>
                    </UnstyledButton>
                  </Group>
                  <Title order={3} mt="sm">
                    {selectedTask.name}
                  </Title>
                  <Text c="dimmed" mt="sm">
                    Focused task details for review, blockers, handoff notes,
                    and delivery updates.
                  </Text>
                  <Group gap={8} mt="md">
                    {statusBadge(selectedTask.health)}
                    {statusBadge(selectedTask.status)}
                    {statusBadge(selectedTask.priority)}
                  </Group>
                </Paper>

                <SimpleGrid cols={2} mt="md">
                  <Paper withBorder radius="md" p="md">
                    <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                      Channel
                    </Text>
                    <Box mt={6}>
                      <ChannelDetail channel={selectedTask.channel} />
                    </Box>
                  </Paper>
                  <Paper withBorder radius="md" p="md">
                    <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                      Assigned Dev
                    </Text>
                    <Text fw={700} mt={6}>
                      {selectedTask.assignee}
                    </Text>
                  </Paper>
                  <Paper withBorder radius="md" p="md">
                    <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                      Task Type
                    </Text>
                    <Text fw={700} mt={6}>
                      {selectedTask.type}
                    </Text>
                  </Paper>
                  <Paper withBorder radius="md" p="md">
                    <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                      Priority
                    </Text>
                    <Text fw={700} mt={6}>
                      {selectedTask.priority}
                    </Text>
                  </Paper>
                </SimpleGrid>
              </Card>

              <Box ref={resourceSectionRef}>
              <Card withBorder radius="md" padding="lg" className="resource-section-card">
                <Text className="section-kicker">Team Capacity</Text>
                <Title order={3} mt={4}>
                  Available Dev Resource
                </Title>
                <Paper withBorder radius="md" p="md" mt="lg" className="resource-summary-card">
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <div>
                      <Text c="dimmed" size="sm">
                        Team availability snapshot
                      </Text>
                      <Group align="end" gap={8} mt="md">
                        <Title order={1} className="resource-stat-card__value">
                          {availableResources.length}
                        </Title>
                        <Text size="sm" c="dimmed" mb={7}>
                          of 21 available
                        </Text>
                      </Group>
                    </div>
                    <ThemeIcon radius="md" variant="light" color="grape" size={40}>
                      <IconUsersGroup size={18} />
                    </ThemeIcon>
                  </Group>

                  <Progress
                    value={Math.round((availableResources.length / 21) * 100)}
                    color="grape"
                    radius="xl"
                    size="lg"
                    mt="lg"
                  />

                  <SimpleGrid cols={2} spacing="sm" mt="md">
                    <Paper radius="md" p="sm" className="resource-summary-card__stat">
                      <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                        Total Team Headcount
                      </Text>
                      <Group gap={8} mt={8}>
                        <ThemeIcon radius="xl" variant="light" color="grape" size={28}>
                          <IconUsersGroup size={14} />
                        </ThemeIcon>
                        <Text fw={700} size="lg">
                          21
                        </Text>
                      </Group>
                    </Paper>
                    <Paper radius="md" p="sm" className="resource-summary-card__stat">
                      <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                        Available Right Now
                      </Text>
                      <Group gap={8} mt={8}>
                        <ThemeIcon radius="xl" variant="light" color="teal" size={28}>
                          <IconCheck size={14} />
                        </ThemeIcon>
                        <Text fw={700} size="lg">
                          {availableResources.length}
                        </Text>
                      </Group>
                    </Paper>
                  </SimpleGrid>
                </Paper>

                <Box className="resource-roster-scroll" mt="lg">
                <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="sm">
                  {availableResources.map((resource) => (
                    (() => {
                      const trend = utilizationMeta[resource.trend]
                      const involvementCount = resourceTaskCounts[resource.name] || 0
                      return (
                        <Paper
                          key={resource.name}
                          withBorder
                          radius="md"
                          p="md"
                          className="resource-dev-stat"
                        >
                          <Group justify="space-between" align="flex-start" wrap="nowrap">
                            <div>
                              <Text fw={700}>{resource.name}</Text>
                              <Text c="dimmed" size="sm" mt={4}>
                                {resource.team}
                              </Text>
                            </div>
                            <ThemeIcon
                              radius="xl"
                              variant="light"
                              color={trend.color}
                              className="resource-dev-stat__trend"
                            >
                              <trend.Icon size={16} />
                            </ThemeIcon>
                          </Group>

                          <Group align="flex-end" gap={8} mt="lg">
                            <Title order={1} className="resource-dev-stat__value">
                              {resource.utilization}%
                            </Title>
                            <Text size="sm" c="dimmed" mb={7}>
                              utilization
                            </Text>
                          </Group>

                          <Badge
                            variant="light"
                            color={trend.color}
                            radius="xl"
                            mt="sm"
                            className="resource-dev-stat__badge"
                          >
                            {trend.label}
                          </Badge>

                          <Text size="sm" c="dimmed" mt="md">
                            Involved in {involvementCount} {involvementCount === 1 ? 'task' : 'tasks'}
                          </Text>
                        </Paper>
                      )
                    })()
                  ))}
                </SimpleGrid>
                </Box>
              </Card>
              </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
