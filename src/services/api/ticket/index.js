import api from 'utils/api';

export const requestGetOverview = (id) => api.callGet(`admin/ticket/${id}`);

export const requestGetThreadReply = (id) =>
  api.callGet(`admin/ticket-comment/get-reply?comment_id=${Number(id)}`);

export const requestGetThreads = (id, page, limit = 10) =>
  api.callGet(
    `admin/ticket-comment/get-threads-paginated?ticket_id=${id}&limit=${limit}&page=${page}`
  );

export const requestAddTicketComment = (params) =>
  api.callPostFormData(`admin/ticket-comment/store`, params);

export const requestEditTicketComment = (params) =>
  api.callPost(`admin/ticket-comment/edit-comment`, params);

export const requestDeleteTicketComment = (params) =>
  api.callPost(`admin/ticket-comment/delete-comment`, { id: params });

export const requestAddCommentAttachment = (params) =>
  api.callPost(`admin/ticket-comment/add-attachment`, params);

export const requestDeleteCommentAttachment = (params) =>
  api.callPost(`admin/ticket-comment/delete-attachment`, params);

export const requestFetchFiles = (id) =>
  api.callGet(`admin/ticket-comment/get-all-attachments?ticket_id=${id}`);

export const requestUpdateAssignees = (params) =>
  api.callPost(`admin/ticket/update-assignee`, params);

export const requestTicketStatus = () =>
  api.callGet(`admin/ticket/status?limit=20`);

export const requestTicketPriorityFlag = () =>
  api.callGet('admin/ticket/priority');

export const requestUpdatePriority = (params) =>
  api.callPost(`admin/ticket/update-priority`, params);

export const requestStartTimer = (params) =>
  api.callPost(`admin/ticket-timelog/start`, params);

export const requestStopTimer = (params) =>
  api.callPost(`admin/ticket-timelog/stop`, params);

export const requestTimelogEndedStarted = (params) =>
  api.callPost('admin/ticket-timelog/update-timelog', params);

export const requestDeleteTimelog = (params) =>
  api.callPost('admin/ticket-timelog/delete-timelog', params);

export const requestGetTicketTimelog = (id) =>
  api.callGet(`admin/ticket-timelog/getbyticketid?ticket_id=${id}`);

export const requestTimerActiveUsers = (params) =>
  api.callGet(`admin/ticket-timelog/ticket-active-user?ticket_id=${params}`);

export const requestUpdateStatus = (params) =>
  api.callPost(`admin/ticket/update-status`, params);

export const requestChangelogTicket = (id, relType, page = 1) =>
  api.callGet(
    `admin/ticket/activity-log?ticket_id=${id}&page=${page}&limit=20`
  );

export const requestFavoriteTicket = (id) =>
  api.callPost(`admin/ticket/pin?id=${id}`);
