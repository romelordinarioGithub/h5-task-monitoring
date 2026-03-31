import type { ComponentType } from 'react'
import {
  IconBrush,
  IconChecklist,
  IconCode,
  IconDeviceDesktop,
  IconFolderSymlink,
  IconMessageCircle,
  IconPlayerTrackNext,
} from '@tabler/icons-react'

export type IconComponent = ComponentType<{ size?: number | string }>

export type Team = {
  name: string
  icon: IconComponent
  disabled: boolean
}

export type TaskType = {
  name: string
  count: number
  icon: IconComponent
}

type TaskSeed = {
  title: string
  type: string
  channel: string
  health: string
  status: string
  priority: string
  assignees: string[]
}

export type Task = {
  name: string
  type: string
  channel: string
  health: string
  status: string
  priority: string
  assignees: string[]
  assignee: string
}

export type RecentActivity = {
  task: string
  fromStatus: string
  toStatus: string
  actor: string
  time: string
}

export type DevResource = {
  name: string
  team: string
  capacity: string
  skill: string
  status: string
  utilization: number
  trend: 'high' | 'low'
}

export const teams: Team[] = [
  { name: 'H5 Team', icon: IconCode, disabled: false },
  { name: 'Design Team', icon: IconBrush, disabled: true },
  { name: 'Video Dev Team', icon: IconPlayerTrackNext, disabled: true },
  { name: 'QA Team', icon: IconChecklist, disabled: true },
]

export const taskTypes: TaskType[] = [
  { name: 'Concept build', count: 14, icon: IconCode },
  { name: 'Studio Setup', count: 9, icon: IconDeviceDesktop },
  { name: 'Migration', count: 6, icon: IconFolderSymlink },
  { name: 'Build Consultation', count: 11, icon: IconMessageCircle },
  { name: 'Exports', count: 8, icon: IconPlayerTrackNext },
  { name: 'Others (h5)', count: 5, icon: IconBrush },
]

const taskSeeds: TaskSeed[] = [
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

export const tasks: Task[] = Array.from({ length: 56 }, (_, index) => {
  const seed = taskSeeds[index % taskSeeds.length]
  const assignees = seed.assignees
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

export const recentActivities: RecentActivity[] = [
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

export const devResources: DevResource[] = [
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

export const badgeColor: Record<string, string> = {
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

export const healthConfig: Record<string, { value: number; color: string }> = {
  Healthy: { value: 86, color: 'teal' },
  Watch: { value: 62, color: 'blue' },
  Risk: { value: 38, color: 'violet' },
  Critical: { value: 16, color: 'pink' },
}

