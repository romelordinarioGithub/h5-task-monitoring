import api from 'utils/api';

// concept list
export const requestConceptList = (page, params, limit = 30) =>
  api.callPost(`admin/concepts?page=${page}&limit=${limit}`, params);

//   concept overview
export const requestConceptOverview = ({ conceptId, partnerId }) =>
  api.callGet(
    `admin/concepts/overview-v2?concept_id=${conceptId}&partner_id=${partnerId}`
  );

//   campaigns list
export const requestCampaignList = (conceptId, page, sort, order, limit = 5) =>
  api.callGet(
    `admin/concepts/campaign/${conceptId}?page=${page}&limit=${limit}&sort=${sort}&order=${
      order === 'date_created' ? 'created_at' : order
    }`
  );

// concept task, 1 = GD, 2 = GV, 3 = MS, 4 = MV, 5 = Y, 6 = ALL
export const requestConceptTasks = (conceptId, channel) =>
  api.callGet(`admin/concepts/task/${conceptId}/${channel}`);

//   reference link list
export const requestReferenceLinks = (cid, page, limit, params) =>
  api.callGet(
    `admin/link/get-all?rel_id=${cid}&page=${page}&limit=${limit}`,
    params
  );

//    add reference link
export const requestAddReferenceLink = (params) =>
  api.callPost(`admin/link/create`, params);

// export const requestAddReferenceLink = (params) =>
//   api.callPost('admin/concepts/link-store', params);

// edit reference link
export const requestUpdateReferenceLink = (params) =>
  api.callPost(`admin/link/update`, params);

export const requestBulkUpdateReferenceLink = (params) =>
  api.callPost(`admin/link/bulk-update`, params);

export const requestReferenceLinksLogs = (id) =>
  api.callGet(`admin/link/logs/${id}`);

// export const requestUpdateReferenceLink = (params) =>
//   api.callPost('admin/concepts/link-update', params);

// remove reference link
export const requestDeleteReferenceLink = (params) =>
  api.callPost(`admin/link/delete`, params);

// export const requestDeleteReferenceLink = (params) =>
//   api.callPost('admin/concepts/links-delete', params);

export const requestMilestoneTemplates = (conceptId) =>
  api.callGet(`admin/milestone/${conceptId}`);

export const requestMilestoneTemplatesPublic = (conceptId) =>
  api.callGet(`admin/milestone/public/${conceptId}`);

export const requestMilestoneOriginalTimeline = (conceptId, channelId) =>
  api.callPost(
    `admin/milestone/update-original?concept_id=${conceptId}&channel_id=${channelId}`
  );

export const requestMilestoneUpdate = (params) =>
  api.callPost(`admin/milestone/update`, params);

export const requestMilestoneStart = (params) =>
  api.callPost(`admin/milestone/start`, params);

export const requestMilestoneCSV = (params) =>
  api.callGet(`admin/milestone/main-csv?concept_id=${params}`, null, {
    responseType: 'arraybuffer',
  });

export const requestMilestoneLogs = (conceptId, page = 1) =>
  api.callGet(`admin/milestone/${conceptId}/logs?page=${page}&limit=20`);

// force sync campaign
export const requestSyncCampaign = (id) =>
  api.callGet(`admin/campaigns/pull-campaign?cid=${id}`);

// force sync concept
export const requestSyncConcept = (id) =>
  api.callGet(`admin/concepts/pull?pid=${id}`);

// update projects per key 1 = concept, 2 = campaign, 3 = task, 4 subtask
export const requestProjectUpdate = (params, rel_type) =>
  api.callPost(`admin/projects/update?rel_type${rel_type}`, params);

export const fetchAllTags = () => api.callGet(`admin/tags`);

export const requestNotesUpdate = (params) =>
  api.callPost(`admin/milestone/update`, params);

export const requestAddCustomCampaign = (params) =>
  api.callPost('admin/custom-campaign/store', params);

export const requestReferenceLinkTaskList = (params) =>
  api.callGet('admin/link/get-all', params);
