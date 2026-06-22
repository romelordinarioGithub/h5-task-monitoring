import api from 'utils/api';

export const fetchTimelog = (id) =>
  api.callGet(`admin/task-timelog/campaign?campaign_id=${id}`);

export const fetchReferenceLink = (id) =>
  api.callGet(`admin/link?rel_id=${id}&rel_type=2`);

export const fetchCampaignByConcept = (conceptId, partnerId, page, search) =>
  api.callGet(`admin/concepts/get-campaigns`, {
    page: page,
    concept_id: conceptId,
    partner_id: partnerId,
    search: search,
  });

export const fetchCustomCampaign = (partnerId, page) =>
  api.callPost(`admin/global/canpaign-partner?page=${page}&limit=2000`, {
    partner_id: partnerId,
  });

export const requestCampaignOverview = (campaignId) =>
  api.callGet(`admin/campaigns/overview/${campaignId}`);

// campaign task
export const requestCampaignTasks = (campaignId) =>
  api.callGet(`admin/campaigns/task/${campaignId}`);

export const fetchCampaign = (conceptId, partnerId) =>
  api.callGet(
    `admin/concepts/get-campaign?concept_id=${conceptId}&partner_id=${partnerId}`
  );

export const requestMilestoneTemplates = (campaignId) =>
  api.callGet(`admin/milestone-campaign/${campaignId}/campaign`);

export const requestMilestoneTemplatesPublic = (campaignId) =>
  api.callGet(`admin/milestone-campaign/public/${campaignId}`);

export const requestMilestoneStart = (params) =>
  api.callPost(`admin/milestone/start-campaign`, params);

export const requestMilestoneUpdate = (params) =>
  api.callPost(`admin/milestone-campaign/update`, params);

export const requestMilestoneOriginalTimeline = (campaignId, channelId) =>
  api.callPost(
    `admin/milestone-campaign/update-original?campaign_id=${campaignId}&channel_id=${channelId}`
  );

export const requestMilestoneCSV = (params) =>
  api.callGet(`admin/milestone-campaign/main-csv?campaign_id=${params}`, null, {
    responseType: 'arraybuffer',
  });

export const requestMilestoneLogMonitoring = (campaignId) =>
  api.callGet(`admin/milestone-snapshots?campaign_id=${campaignId}`);
