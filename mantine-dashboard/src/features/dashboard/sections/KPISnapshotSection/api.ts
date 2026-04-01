import type { ComponentType } from 'react'
import {
  IconBrush,
  IconCode,
  IconDeviceDesktop,
  IconFolderSymlink,
  IconMessageCircle,
  IconPlayerTrackNext,
} from '@tabler/icons-react'

export type IconComponent = ComponentType<{ size?: number | string }>

export type TaskType = {
  name: string
  count: number
  icon: IconComponent
}

export const taskTypes: TaskType[] = [
  { name: 'Concept build', count: 14, icon: IconCode },
  { name: 'Studio Setup', count: 9, icon: IconDeviceDesktop },
  { name: 'Migration', count: 6, icon: IconFolderSymlink },
  { name: 'Build Consultation', count: 11, icon: IconMessageCircle },
  { name: 'Exports', count: 8, icon: IconPlayerTrackNext },
  { name: 'Others (h5)', count: 5, icon: IconBrush },
]
