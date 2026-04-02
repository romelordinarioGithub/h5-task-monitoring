import {
  IconBrush,
  IconChecklist,
  IconCode,
  IconDeviceDesktop,
  IconFolderSymlink,
  IconMessageCircle,
  IconPlayerTrackNext,
} from '@tabler/icons-react';
import type {
  DashboardTeamConfig,
  DashboardTeamKey,
  KPITaskTypeConfig,
} from './dashboard.types';
import { normalizeApiKey } from './dashboard.utils';

export const DASHBOARD_TEAMS: Record<DashboardTeamKey, DashboardTeamConfig> = {
  production_h5: {
    key: 'production_h5',
    name: 'H5 Team',
    path: 'production_h5',
    icon: IconCode,
    disabled: false,
  },
  design: {
    key: 'design',
    name: 'Design Team',
    path: 'design',
    icon: IconBrush,
    disabled: true,
  },
  production_video: {
    key: 'production_video',
    name: 'Video Dev Team',
    path: 'production_video',
    icon: IconPlayerTrackNext,
    disabled: true,
  },
  qa: {
    key: 'qa',
    name: 'QA Team',
    path: 'qa',
    icon: IconChecklist,
    disabled: true,
  },
};

export const DEFAULT_DASHBOARD_TEAM: DashboardTeamKey = 'production_h5';

export const dashboardTeams = Object.values(DASHBOARD_TEAMS);

export function getDashboardTeamConfig(team: DashboardTeamKey): DashboardTeamConfig {
  return DASHBOARD_TEAMS[team];
}

export const DASHBOARD_KPI_TASK_TYPES: Record<DashboardTeamKey, KPITaskTypeConfig[]> = {
  production_h5: [
    {
      name: 'Concept build',
      apiKey: 'concept build',
      queryValue: 'concept_build',
      icon: IconCode,
    },
    {
      name: 'Studio Setup',
      apiKey: 'studio setup',
      queryValue: 'studio_setup',
      icon: IconDeviceDesktop,
    },
    {
      name: 'Migration',
      apiKey: 'migration',
      queryValue: 'migration',
      icon: IconFolderSymlink,
    },
    {
      name: 'Build Consultation',
      apiKey: 'build consultation',
      queryValue: 'build_consultation',
      icon: IconMessageCircle,
    },
    {
      name: 'Exports',
      apiKey: 'exports',
      queryValue: 'exports',
      icon: IconPlayerTrackNext,
    },
    {
      name: 'Others (h5)',
      apiKey: 'others(h5)',
      queryValue: 'others,others(h5)',
      icon: IconBrush,
    },
  ],
  design: [],
  production_video: [],
  qa: [],
};

export function getDashboardKPITaskTypes(team: DashboardTeamKey): KPITaskTypeConfig[] {
  return DASHBOARD_KPI_TASK_TYPES[team] ?? [];
}

export function getDashboardKPITaskTypeByName(
  team: DashboardTeamKey,
  name: string,
): KPITaskTypeConfig | undefined {
  return getDashboardKPITaskTypes(team).find((item) => item.name === name);
}

export function getDashboardKPITaskTypeLabel(
  team: DashboardTeamKey,
  apiKeyOrTaskType?: string,
): string {
  const normalizedValue = normalizeApiKey(
    String(apiKeyOrTaskType ?? '').replace(/_/g, ' '),
  );

  const matched = getDashboardKPITaskTypes(team).find(
    (item) => normalizeApiKey(item.apiKey) === normalizedValue,
  );

  return matched?.name ?? '';
}
