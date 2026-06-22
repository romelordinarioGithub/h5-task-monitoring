import api from 'utils/api';

export const requestDashboard = (page, params) =>
  api.callPost(`admin/dashboard?page=${page}`, params);

export const requestDashboardFilters = (page, limit, params) =>
  api.callPost(
    `admin/dashboard/filter-search?page=${page}&limit=${limit}`,
    params
  );

export const requestDashboardTicket = (page, limit, params, sort) =>
  api.callGet(
    `/admin/ticket?page=${page}&limit=${limit}&status=${
      params?.status
    }&priority=${params?.priority}&assignee=${
      params?.assignees
    }&sortby=${sort.replace('-', '')}&sorttype=${
      sort.includes('-') ? 'asc' : 'desc'
    }&search=${params?.name ?? ''}${
      params?.queues != 'all_task' ? `&${params?.queues}=true` : ''
    }`
  );

export const requestDashboardBriefCount = () =>
  api.callGet(`admin/adweave-briefs/count`);

export const requestDashboardTicketCount = (params) =>
  api.callGet(
    `/admin/ticket/ticket-selection-counts?status=${params?.status}&priority=${
      params?.priority
    }&assignee=${params?.assignees}&search=${params?.name ?? ''}`
  );

export const requestDashboardResources = () =>
  api.callGet(`admin/dashboard/dashboard-resource?limit=200`);

export const requestDashboardResourcesWithProgress = (
  team,
  page = 1,
  limit = 20
) =>
  api.callGet(
    `admin/task-monitoring/team-resource/${team}?page=${page}&limit=${limit}`
  );

export const requestDashboardStatusCount = (teamId) =>
  api.callGet(`admin/${teamId != 11 ? 'task' : 'ticket'}/status-count`);

export const requestDashboardTimelog = (teamId) =>
  api.callGet(
    `admin/${
      teamId != 11
        ? 'dashboard/user_total_time?limit=1000'
        : 'ticket-timelog/user-total-time?limit=1000'
    }`
  );

export const requestDashboardEOD = (params) =>
  api.callPost('admin/dashboard/eod-report', params);

export const requestDashboardFilter = (params) =>
  api.callPost('admin/dashboard', params);
