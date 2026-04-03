import type { ComponentType } from 'react';

export type IconComponent = ComponentType<{ size?: number | string }>;

export type DashboardTeamKey = 'production_h5' | 'design' | 'production_video' | 'qa';

export type DashboardTeamConfig = {
  key: DashboardTeamKey;
  name: string;
  path: string;
  icon: IconComponent;
  disabled: boolean;
};

export type KPITaskTypeConfig = {
  name: string;
  apiKey: string;
  icon: IconComponent;
  queryValue?: string;
  mockCount?: number;
};

export type RawDataAssignee = {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
};

export type RawData = {
  name?: string;
  task_type?: string;
  rel_type?: string;
  status?: string;
  channel?: string;
  due_date?: string;
  delivery_date?: string;
  priority?: string;
  link?: string;
  tags?: string;
  assignees?: RawDataAssignee[];
};

export type RawDevResource = {
  user_id?: number | string;
  fullname?: string;
  running_timer?: boolean;
  last_week?: string | number;
  schedule?: string;
  time?: string;
  time_zone?: string;
};
