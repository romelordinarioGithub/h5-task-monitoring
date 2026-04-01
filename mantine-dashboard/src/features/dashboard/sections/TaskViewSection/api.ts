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
