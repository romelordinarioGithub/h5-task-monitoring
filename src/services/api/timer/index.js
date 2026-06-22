import api from 'utils/api';

export const fetchCategoriesRequest = () =>
  api.callGet(`admin/task-category/presets?limit=1000`);

export const fetchCategoriesWithRequiredFieldsRequest = () =>
  api.callGet('admin/task-timer/');

export const fetchTaskTypeRequest = () =>
  api.callGet('admin/task-timer/task-type');

export const fetchSmartlyPartnersRequest = () =>
  api.callGet('admin/global/smartly-partner-list?limit=1000');

export const fetchPartnersRequest = () =>
  api.callGet('admin/task-timer/get-partners');

export const fetchConceptsequest = () =>
  api.callGet(`admin/task-timer/get-concepts`);

export const fetchConceptByPartnerRequest = (partnerId) =>
  api.callGet(`admin/concepts?page=1&partner_id=${partnerId}&limit=10000`);

export const fetchCampaignsRequest = () =>
  api.callGet(`admin/task-timer/get-campaigns`);

export const fetchCampaignByConceptRequest = (conceptId, partnerId) =>
  api.callGet(
    `admin/concepts/get-campaign?concept_id=${conceptId}&partner_id=${partnerId}`
  );

export const fetchActiveTimerRequest = () =>
  api.callGet('admin/task-timer/running');

export const fetchUserTimeLogsRequest = (userId, pagination) =>
  api.callGet(
    `admin/task-timer/user-timelog/${userId}?page=${pagination.page}&limit=${pagination.limit}`,
    { date_start: pagination?.dateStart, date_end: pagination?.dateEnd }
  );

export const startTimerRequest = (params) =>
  api.callPost(`admin/task-timer/start`, params);

export const playRunningTimerRequest = (params) =>
  api.callPost(`admin/task-timer/play`, params);

export const pauseRunningTimerRequest = (params) =>
  api.callPost(`admin/task-timer/pause`, params);

export const stopRunningTimerRequest = (params) =>
  api.callPost(`admin/task-timer/stop`, params);

export const updateTimerRequest = (params) =>
  api.callPost(`admin/task-timer/update`, params);

export const deleteTimerRequest = (params) =>
  api.callPost(`admin/task-timer/delete`, params);

export const requestGetPromptTimer = () =>
  api.callGet(`admin/task-timelog/get-user-prompt`);

export const requestContinuePromptTimer = (params) =>
  api.callPost(`admin/task-timelog/prompt-continue`, params);
