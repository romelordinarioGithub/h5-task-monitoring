import api from 'utils/api';

export const requestTimesheet = (
  search,
  user_id,
  partner_id,
  campaign_id,
  concept_id,
  date,
  timer_id,
  datafilter
) =>
  api.callGet(`admin/task-timelog/get-all`, {
    search: search,
    user_id: user_id,
    partner_id: partner_id,
    campaign_id: campaign_id,
    concept_id: concept_id,
    date: date,
    date_filter: datafilter,
    timer_id: timer_id,
  });

export const requestTimesheetAll = () =>
  api.callGet(`admin/task-timelog/get-all`);

export const requestTimesheetChart = (
  search,
  userId,
  partnerId,
  campaignId,
  conceptId,
  dates,
  dateFilter
) =>
  api.callGet(
    `admin/task-timelog/get-all?search=${search}&user_id=${userId}&partner_id=${partnerId}&campaign_id=${campaignId}&date_filter=${dateFilter}&date=${dates}`,
    { concept_id: conceptId }
  );

export const requestTimesheetConcepts = (filter) =>
  api.callGet(`admin/task-timer/concepts`, { filter: filter });

export const requestTimesheetCampaign = (filter) =>
  api.callGet(`admin/task-timer/campaigns`, { filter: filter });

export const requestTimesheetAllCSV = (
  userId,
  search,
  partnerId,
  campaignId,
  concept_id,
  dates,
  dateFilter,
  isSmartly
) =>
  api.callGet(
    `/admin/task-timelog/timesheet-csv`,
    {
      user_id: userId,
      search: search,
      partner_id: partnerId,
      campaign_id: campaignId,
      concept_id: concept_id,
      date_filter: dateFilter,
      date: dates,
      is_smartly: isSmartly,
    },
    { responseType: 'blob', 'Content-Type': 'text/csv' }
  );

export const requestTimesheetOptionList = () =>
  api.callGet('admin/task-timelog/timesheet-list-option');

export const requestTimesheetStats = () =>
  api.callGet('admin/task-timer/user-total-time');

export const requestUpdateStartEnd = (params) =>
  api.callPost(`admin/task-timer/update-timesheet`, params);

export const requestTimeline = (id, type) =>
  api.callGet(`admin/task-timelog/get-timeline`, { id: id, type: type });
