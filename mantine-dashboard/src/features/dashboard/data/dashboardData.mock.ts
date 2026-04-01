import type { ComponentType } from 'react'
import { IconBrush, IconChecklist, IconCode, IconPlayerTrackNext } from '@tabler/icons-react'

export type IconComponent = ComponentType<{ size?: number | string }>

export type Team = {
  name: string
  icon: IconComponent
  disabled: boolean
}

export const teams: Team[] = [
  { name: 'H5 Team', icon: IconCode, disabled: false },
  { name: 'Design Team', icon: IconBrush, disabled: true },
  { name: 'Video Dev Team', icon: IconPlayerTrackNext, disabled: true },
  { name: 'QA Team', icon: IconChecklist, disabled: true },
]
