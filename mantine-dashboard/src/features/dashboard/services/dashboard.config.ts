import {
  IconAsset,
  IconBrush,
  IconChecklist,
  IconCode,
  IconDeviceDesktop,
  IconFolderSymlink,
  IconPhoto,
  IconMessageCircle,
  IconMovie,
  IconPlayerTrackNext,
  IconRefresh,
  IconTemplate,
  IconVideo,
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
    disabled: false,
  },
  production_video: {
    key: 'production_video',
    name: 'Video Dev Team',
    path: 'production_video',
    icon: IconPlayerTrackNext,
    disabled: false,
  },
  qa: {
    key: 'qa',
    name: 'QA Team',
    path: 'qa',
    icon: IconChecklist,
    disabled: false,
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
      name: 'Concept Build',
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
      name: 'Others',
      apiKey: 'others',
      queryValue: 'others,others(h5)',
      icon: IconBrush,
    },
    {
      name: 'Support Consultation',
      apiKey: 'support consultation',
      queryValue: 'support_consultation',
      icon: IconMessageCircle,
    },
    {
      name: 'Client Revision',
      apiKey: 'client revision',
      queryValue: 'client_revision',
      icon: IconRefresh,
    },
  ],
  design: [
    {
      name: 'Concept Design',
      apiKey: 'concept design',
      queryValue: 'concept_design',
      icon: IconBrush,
      mockCount: 9,
    },
    {
      name: 'Design QA',
      apiKey: 'design qa',
      queryValue: 'design_qa',
      icon: IconChecklist,
      mockCount: 6,
    },
    {
      name: 'Rebuild Concept Design',
      apiKey: 'rebuild concept design',
      queryValue: 'rebuild_concept_design',
      icon: IconRefresh,
      mockCount: 4,
    },
    {
      name: 'Storyboard Revision',
      apiKey: 'storyboard revision',
      queryValue: 'storyboard_revision',
      icon: IconTemplate,
      mockCount: 5,
    },
    {
      name: 'Asset Creation',
      apiKey: 'asset creation',
      queryValue: 'asset_creation',
      icon: IconAsset,
      mockCount: 8,
    },
    {
      name: 'Design Consultation',
      apiKey: 'design consultation',
      queryValue: 'design_consultation',
      icon: IconMessageCircle,
      mockCount: 3,
    },
    {
      name: 'Image Template Build',
      apiKey: 'image template build',
      queryValue: 'image_template_build',
      icon: IconPhoto,
      mockCount: 7,
    },
    {
      name: 'Template Update - Client Revision',
      apiKey: 'template update client revision',
      queryValue: 'template_update_client_revision',
      icon: IconMessageCircle,
      mockCount: 4,
    },
    {
      name: 'Template Update - Internal Revision',
      apiKey: 'template update internal revision',
      queryValue: 'template_update_internal_revision',
      icon: IconRefresh,
      mockCount: 3,
    },
    {
      name: 'Editor Build Revision',
      apiKey: 'editor build revision',
      queryValue: 'editor_build_revision',
      icon: IconDeviceDesktop,
      mockCount: 5,
    },
    {
      name: 'Feed Connection',
      apiKey: 'feed connection',
      queryValue: 'feed_connection',
      icon: IconFolderSymlink,
      mockCount: 6,
    },
  ],
  production_video: [
    {
      name: 'Concept Design',
      apiKey: 'concept design',
      queryValue: 'concept_design',
      icon: IconBrush,
      mockCount: 12,
    },
    {
      name: 'Concept Build',
      apiKey: 'concept build',
      queryValue: 'concept_build',
      icon: IconCode,
      mockCount: 8,
    },
    {
      name: 'Creative Build',
      apiKey: 'creative build',
      queryValue: 'creative_build',
      icon: IconDeviceDesktop,
      mockCount: 5,
    },
    {
      name: 'Design Consultation',
      apiKey: 'design consultation',
      queryValue: 'design_consultation',
      icon: IconMessageCircle,
      mockCount: 10,
    },
    {
      name: 'Video Concept Build',
      apiKey: 'video concept build',
      queryValue: 'video_concept_build',
      icon: IconMovie,
      mockCount: 7,
    },
    {
      name: 'Video Creative Build',
      apiKey: 'video creative build',
      queryValue: 'video_creative_build',
      icon: IconVideo,
      mockCount: 4,
    },
    {
      name: 'Internal Video',
      apiKey: 'internal video',
      queryValue: 'internal_video',
      icon: IconPlayerTrackNext,
      mockCount: 6,
    },
    {
      name: 'Migration',
      apiKey: 'migration',
      queryValue: 'migration',
      icon: IconFolderSymlink,
      mockCount: 9,
    },
    {
      name: 'Others',
      apiKey: 'others',
      queryValue: 'others',
      icon: IconAsset,
      mockCount: 3,
    },
    {
      name: 'CPVAccelerator',
      apiKey: 'cpvaccelerator',
      queryValue: 'cpvaccelerator',
      icon: IconPlayerTrackNext,
      mockCount: 11,
    },
    {
      name: 'Template Update - Client Revision',
      apiKey: 'template update client revision',
      queryValue: 'template_update_client_revision',
      icon: IconMessageCircle,
      mockCount: 5,
    },
    {
      name: 'Template Update - Internal Revision',
      apiKey: 'template update internal revision',
      queryValue: 'template_update_internal_revision',
      icon: IconRefresh,
      mockCount: 4,
    },
    {
      name: 'Feed Connection',
      apiKey: 'feed connection',
      queryValue: 'feed_connection',
      icon: IconFolderSymlink,
      mockCount: 6,
    },
    {
      name: 'Support Consultation',
      apiKey: 'support consultation',
      queryValue: 'support_consultation',
      icon: IconMessageCircle,
      mockCount: 3,
    },
  ],
  qa: [
    {
      name: 'Concept QA',
      apiKey: 'concept qa',
      queryValue: 'concept_qa',
      icon: IconChecklist,
      mockCount: 14,
    },
    {
      name: 'Concept QA Lite',
      apiKey: 'concept qa lite',
      queryValue: 'concept_qa_lite',
      icon: IconBrush,
      mockCount: 11,
    },
    {
      name: 'Phase 1 QA',
      apiKey: 'phase 1 qa',
      queryValue: 'phase_1_qa',
      icon: IconFolderSymlink,
      mockCount: 9,
    },
    {
      name: 'QA Lite Phase 1',
      apiKey: 'qa lite phase 1',
      queryValue: 'qa_lite_phase_1',
      icon: IconDeviceDesktop,
      mockCount: 6,
    },
    {
      name: 'Phase 2 QA',
      apiKey: 'phase 2 qa',
      queryValue: 'phase_2_qa',
      icon: IconDeviceDesktop,
      mockCount: 8,
    },
    {
      name: 'QA Lite Phase 2',
      apiKey: 'qa lite phase 2',
      queryValue: 'qa_lite_phase_2',
      icon: IconDeviceDesktop,
      mockCount: 7,
    },
    {
      name: 'Pre-rendered - Content',
      apiKey: 'pre rendered content',
      queryValue: 'pre_rendered_content',
      icon: IconPhoto,
      mockCount: 5,
    },
    {
      name: 'Pre-rendered QA Lite',
      apiKey: 'pre rendered qa lite',
      queryValue: 'pre_rendered_qa_lite',
      icon: IconPhoto,
      mockCount: 12,
    },
    {
      name: 'Live Testing',
      apiKey: 'live testing',
      queryValue: 'live_testing',
      icon: IconDeviceDesktop,
      mockCount: 4,
    },
    {
      name: 'New QA Review',
      apiKey: 'new qa review',
      queryValue: 'new_qa_review',
      icon: IconChecklist,
      mockCount: 10,
    },
    {
      name: 'Internal QA Revision',
      apiKey: 'internal qa revision',
      queryValue: 'internal_qa_revision',
      icon: IconRefresh,
      mockCount: 3,
    },
    {
      name: 'Client Revision',
      apiKey: 'client revision',
      queryValue: 'client_revision',
      icon: IconMessageCircle,
      mockCount: 6,
    },
    {
      name: 'Downloaded/Live Tag Testing',
      apiKey: 'downloaded live tag testing',
      queryValue: 'downloaded_live_tag_testing',
      icon: IconCode,
      mockCount: 5,
    },
    {
      name: 'Migration',
      apiKey: 'migration',
      queryValue: 'migration',
      icon: IconFolderSymlink,
      mockCount: 2,
    },
  ],
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
