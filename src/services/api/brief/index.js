import api from 'utils/api';

export const requestDueDateUpdate = (params) =>
  api.callPost('admin/task/update-duedate', params);

export const requestTaskDeliveryDateUpdate = (params) =>
  api.callPost('admin/task/update-delivery-date', params);

export const requestCampaignDeliveryDateUpdate = (params) =>
  api.callPost('admin/campaigns/update-delivery-date', params);

export const requestCampaignLaunchDateUpdate = (params) =>
  api.callPost('admin/campaigns/update-launch-date', params);

export const requestGetBrief = (params) => {
  const { page, per_page, filter, ...rest } = params || {};

  // Build query string for filters
  const queryParams = new URLSearchParams();

  if (page) queryParams.append('page', page);
  if (per_page) queryParams.append('per_page', per_page);

  // Add filter parameters from the endpoint
  if (filter) {
    if (filter.title) queryParams.append('title', filter.title);
    if (filter.company_name)
      queryParams.append('company_name', filter.company_name);
    if (filter.partner_id) queryParams.append('partner_id', filter.partner_id);
    if (filter.region) queryParams.append('region', filter.region);
    if (filter.assignees) queryParams.append('assignees', filter.assignees);
    if (filter.status) queryParams.append('status', filter.status);
    if (filter.priority) queryParams.append('priority', filter.priority);
    if (filter.sort) queryParams.append('sort', filter.sort);
    if (filter.request_type)
      queryParams.append('request_type', filter.request_type);
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `admin/adweave-briefs?filter=true&${queryString}`
    : `admin/adweave-briefs`;

  return api.callGet(url, rest);
};

export const requestUpdatBriefAssignees = (params) =>
  api.callPost(`admin/adweave-briefs/assign-user`, params);

export const requestGetTaskTimelog = (id) =>
  api.callGet(`admin/adweave-briefs/timer-logs?brief_id=${id}`);

export const requestCreateTask = (params) =>
  api.callPostFormData(`admin/task/create`, params);

export const requestMaintenanceDisplay = () => api.callGet('admin/displays');

export const requestUpdateBriefByKey = (params) =>
  api.callPost('admin/adweave-briefs/update-key', params);

export const requestUpdateTask = (params) =>
  api.callPost('admin/concepts/update-status', params);

export const requestGetParentTaskComment = (taskId) =>
  api.callGet(`admin/task-comment/${Number(taskId)}`);

export const requestGetThreadReply = (id, threadId) =>
  api.callGet(
    `admin/adweave-briefs/threads?brief_id=${id}&thread_id=${threadId}&page=1`
  );

export const requestGetThreads = (relId, page, limit = 10) =>
  api.callGet(`admin/adweave-briefs/threads?brief_id=${relId}`);

export const requestGetSubtaskComment = (id, type) =>
  api.callGet(
    `admin/task-comment/get-threads?rel_id=${Number(id)}&rel_type=${type}`
  );

export const requestAddTaskComment = (params) =>
  api.callPostFormData(`admin/adweave-briefs/create-thread`, params);

export const requestDeleteTaskComment = (params) =>
  api.callPost(`admin/adweave-briefs/delete-thread`, params);

export const requestEditTaskComment = (params) =>
  api.callPost(`admin/adweave-briefs/update-thread`, params);

export const requestDeleteCommentAttachment = (params) =>
  api.callPost(`admin/task-comment/delete-attachment`, params);

export const requestChangelogTask = (id, relType, page = 1) =>
  api.callGet(
    `admin/task/activity-log?rel_id=${id}&rel_type=${relType}&page=${page}&limit=20`
  );

export const requestChangelogTaskCampaign = (id) =>
  api.callGet(`admin/change-log/campaign?uuid=${id}`);

export const requestTemplates = (id, relType) =>
  api.callGet(`admin/task/template/${id}?is_subtask=${relType}`);

export const requestTemplateVersions = (id) =>
  api.callGet(`admin/task/template/${id}?version`);

export const requestChangeTemplateVersion = (params) =>
  api.callPost(`admin/task/select-template-version`, params);

export const requestAddThreadStatus = (params) =>
  api.callPost(`admin/task-comment/mark-comment`, params);

export const requestGetRevision = (id, type) =>
  api.callGet(`admin/task-revision/revisions?rel_id=${id}&rel_type=${type}`);

export const requestStartTimer = (id) =>
  api.callPost(`admin/adweave-briefs/timer?type=time_in&brief_id=${id}`);

export const requestPlayTimer = (params) =>
  api.callPost(`admin/task-timelog/play`, params);

export const requestPauseTimer = (params) =>
  api.callPost(`admin/task-timelog/pause`, params);

export const requestStopTimer = (id) =>
  api.callPost(`admin/adweave-briefs/timer?type=time_out&brief_id=${id}`);

export const requestActiveTaskTimers = (params) =>
  api.callGet(`admin/task-timelog/running-timer`, params);

export const requestAddChecklist = (params) =>
  api.callPost(`admin/task-checklist/store`, params);

export const requestUpdateChecklist = (params) =>
  api.callPost(`admin/task-checklist/update`, params);

export const requestFetchChecklist = (id) =>
  api.callGet(`admin/task-checklist/${id}`);

export const requestCheckedChecklist = (params) =>
  api.callPost(`admin/task-checklist/check`, params);

export const requestUncheckedChecklist = (params) =>
  api.callPost(`admin/task-checklist/uncheck`, params);

export const requestDestroyChecklist = (params) =>
  api.callPost(`admin/task-checklist/delete`, params);

export const requestAddTaskReference = (params) =>
  api.callPost(`admin/task/store-ref-link`, params);

export const requestFetchRevision = (id) =>
  api.callGet(`admin/task-revision/revisions?rel_id=${id}`);

export const requestAddRevision = (params) =>
  api.callPost(`admin/task-revision/store`, params);

export const requestAddRevisionV2 = (params) =>
  api.callPost(`admin/task-revision/store-v2`, params);

export const requestUpdateRevision = (params) =>
  api.callPost(`admin/task-revision/update`, params);

export const requestUpdateRevisionV2 = (params) =>
  api.callPost(`admin/task-revision/revision-update`, params);

export const requestDestroyRevision = (params) =>
  api.callPost(`admin/task-revision/delete`, params);

export const requestResolvedRevision = (params) =>
  api.callPost(`admin/task-revision/mark-resolved`, params);

export const requestResolvedRevisionV2 = (params) =>
  api.callPost(`admin/task-revision/mark-resolved-v2`, params);

export const requestAddRefLink = (params) =>
  api.callPost(`admin/task/store-ref-link`, params);

export const requestDestroyRefLink = (params) =>
  api.callPost(`admin/link/remove-to-task`, params);

export const requestFetchRefLink = (params) =>
  api.callGet(
    `admin/task/get-ref-link?rel_id=${params.relId}&rel_type=${params.relType}`
  );

export const requestFetchTags = (params) =>
  api.callGet(`admin/tags/get-all`, {
    rel_id: params?.relId,
    rel_type: params?.relType,
  });

export const requestFetchSubTask = (task_id) =>
  api.callGet(`admin/task/get-subtasks?task_id=${task_id}`);

export const requestDestroySubtask = (id) =>
  api.callPost(`admin/task/delete-subtask?id=${id}`);

export const requestDestroyTask = (params) =>
  api.callPost(`admin/task/delete`, params);

export const requestAddTags = (params) =>
  api.callPost('admin/adweave-briefs/add-tag', params);

export const requestRemoveTags = (params) =>
  api.callPost('admin/adweave-briefs/remove-tag', params);

export const requestAddFormatDisplay = (params) =>
  api.callPost('admin/displays/add-task-display', params);

export const requestTimelogEndedStarted = (params) =>
  api.callPost('admin/adweave-briefs/update-timelogs', params);

export const requestRemoveFormatDisplay = (params) =>
  api.callPost('admin/displays/delete-task-displays', params);

export const requestFetchTriggers = (params) =>
  api.callGet(
    `admin/triggers/get-all?task_id=${params.taskId}&is_parent=${params.isParent}`
  );

export const requestFetchDisplayMD = (params) =>
  api.callGet(
    `admin/task/display-option?rel_id=${params.taskId}&rel_type=${params.relType}&type=${params.type}`
  );

export const requestAddTriggers = (params) =>
  api.callPost('admin/triggers/add-task-trigger', params);

export const requestRemoveTriggers = (params) =>
  api.callPost('admin/triggers/delete-task-triggers', params);

export const requestAddSubtask = (params) =>
  api.callPost('admin/task/store-subtask', params);

export const requestFetchFiles = (params) =>
  api.callGet(
    `admin/task/attachments?rel_id=${params.relId}&rel_type=${params.relType}`
  );

export const requestFetchRevisionList = (rel_id, page, limit) =>
  api.callGet(
    `admin/task-revision/revision-tab?rel_id=${rel_id}&page=${page}&limit=${limit}`
  );

export const requestDeleteRevision = (params) =>
  api.callPost(`admin/task-revision/delete`, params);

export const requestChecklistRevision = (params) =>
  api.callPost(`admin/task-revision/add-to-checklist`, params);

export const requestAddSubtaskRevision = (params) =>
  api.callPost(`admin/task-revision/add-subtask`, params);

export const requestTasksCompleted = (params) =>
  api.callGet(`admin/dashboard/task-completed?team_id=${params.teamId}`);

export const requestValidate = (params) =>
  api.callGet(`admin/task/validate`, params);

export const requestUpdate = (params) =>
  api.callPost(`admin/global/update`, params);

export const requestTimerActiveUsers = (id) =>
  api.callGet(`admin/adweave-briefs/timer-logs?brief_id=${id}&is_running=1`);

export const requestFetchPredefinedReasons = (params) =>
  api.callGet(
    `admin/task/predefined-text?rel_id=${params.relId}&rel_type=${params.relType}`
  );

export const requestFetchQATags = (params) =>
  api.callGet(
    `admin/tag-error/categories?rel_id=${params.relId}&rel_type=${params.relType}`,
    { thread_id: params?.thread_id }
  );

export const requestAddQATags = (params) =>
  api.callPost(`admin/tag-error/${params?.action}`, params);

export const requestPricing = (briefId) =>
  api.callGet('admin/adweave-briefs/get-price', {
    id: briefId,
  });

export const requestPricingCSV = (briefId) =>
  api.callGet(
    'admin/adweave-briefs/get-price',
    {
      id: briefId,
      format: 'csv',
    },
    { responseType: 'blob' }
  );
