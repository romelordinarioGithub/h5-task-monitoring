// Redux
import { createSlice } from '@reduxjs/toolkit';
// Services
import {
  requestGetParentTaskComment,
  requestGetSubtaskComment,
  requestChangelogTask,
  requestAddThreadStatus,
  requestChangelogTaskCampaign,
  requestDestroyTask,
  requestFetchTags,
  requestAddTags,
  requestRemoveTags,
} from 'services/api/tasks';
import {
  requestGetOverview,
  requestGetThreadReply,
  requestGetThreads,
  requestEditTicketComment,
  requestDeleteTicketComment,
  requestAddTicketComment,
  requestDeleteCommentAttachment,
  requestFetchFiles,
  requestUpdateAssignees,
  requestTicketPriorityFlag,
  requestTicketStatus,
  requestUpdatePriority,
  requestGetTicketTimelog,
  requestTimerActiveUsers,
  requestStartTimer,
  requestStopTimer,
  requestTimelogEndedStarted,
  requestUpdateStatus,
  requestChangelogTicket,
  requestFavoriteTicket,
} from 'services/api/ticket';
import {
  requestMaintenanceTeams,
  requestMaintenanceUser,
} from 'services/api/maintenance';
import _ from 'lodash';

const initialState = {
  isLoadingOverview: false,
  isLoadingTemplate: false,
  isLoadingTimelog: false,
  isLoadingRevisions: false,
  isLoadingActivityLogs: false,
  isLoadingComments: false,
  isLoadingOptions: false,
  isUpdatingTimer: false,
  error: null,
  ticket: {},
  timelogs: [],
  activityLogs: [],
  threads: [],
  options: {
    priorityList: [],
    usersList: [],
    statusList: [],
    tagsList: [],
    isFetching: false,
  },
  files: [],
};

const ticket = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    initTask: (state) => {
      state.error = null;
    },
    initOverview: (state) => {
      state.isLoadingOverview = true;
      state.error = null;
    },
    initTemplate: (state) => {
      state.isLoadingTemplate = true;
      state.error = null;
    },
    initTimelog: (state) => {
      state.isLoadingTimelog = true;
      state.error = null;
    },
    initRevisions: (state) => {
      state.isLoadingRevisions = true;
      state.error = null;
    },
    initActivityLogs: (state) => {
      state.isLoadingActivityLogs = true;
      state.error = null;
    },
    initOptions: (state) => {
      state.isLoadingOptions = true;
      state.error = null;
    },
    initFiles: (state) => {
      state.error = null;
    },
    initCampaign: (state) => {
      state.overviewData.campaignList = [];
      state.overviewData.isFetchingCampaign = true;
    },
    updateTimer: (state) => {
      state.isUpdatingTimer = true;
    },
    errorTask: (state, { payload }) => {
      state.isLoadingOverview = false;
      state.isLoadingTemplate = false;
      state.isLoadingTimelog = false;
      state.isLoadingRevisions = false;
      state.isLoadingActivityLogs = false;
      state.error = payload;
    },
    validateTask: (state) => {
      state.error = null;
    },
    successTicketOverview: (state, { payload }) => {
      state.ticket = payload;
      state.isLoadingOverview = false;
      state.error = null;
    },
    successTicketTimelog: (state, { payload }) => {
      state.timelogs = payload;
      state.isLoadingTimelog = false;
      state.error = null;
    },
    successPriorityList: (state, { payload }) => {
      state.options.priorityList = payload;
      state.isLoadingOptions = false;
    },
    successUsersList: (state, { payload }) => {
      state.options.usersList = payload.data;
      state.isLoadingOptions = false;
    },
    successStatusList: (state, { payload }) => {
      state.options.statusList = payload;
      state.isLoadingOptions = false;
    },
    successFilesList: (state, { payload }) => {
      state.files = payload;
    },
    successTagsList: (state, { payload }) => {
      state.options.tagsList = payload;
    },
    successTeamList: (state, { payload }) => {
      state.overviewData.teamList = payload?.data;
    },
    successThreadsList: (state, { payload }) => {
      state.threads = payload;
      state.isLoadingComments = false;
    },
    successPaginatedThreadsList: (state, { payload }) => {
      state.threads = {
        ...payload,
        data: [...state.threads.data, ...payload.data],
      };
      state.isLoadingComments = false;
    },
    successThreadsReplyList: (state, { payload }) => {
      let { commentId, data } = payload;
      state.threads = {
        ...state.threads,
        data: state.threads.data.map((thread) =>
          thread.id === commentId
            ? {
                ...thread,
                comment: data,
              }
            : {
                ...thread,
              }
        ),
      };
      state.isLoadingComments = false;
    },
    successThread: (state, { payload: { relId, data } }) => {
      return {
        ...state,
        comments: {
          ...state.threads,
          subtask: state.threads.subtask.data.map((subtask) =>
            subtask.subtask_id == relId
              ? {
                  ...subtask,
                  comments: [data, ...subtask.comments],
                }
              : subtask
          ),
        },
      };
    },
    successThreadEdit: (state, { payload: { relId, data } }) => {
      return {
        ...state,
        comments: {
          ...state.threads,
          subtask: state.threads.subtask.data.map((subtask) => ({
            ...subtask,
            comments: subtask.comments.map((comment) =>
              comment.id === relId ? data : comment
            ),
          })),
        },
      };
    },
    successComment: (state, { payload: { data, commentId, relId } }) => {
      return {
        ...state,
        comments: {
          ...state.threads,
          subtask: state.threads.subtask.data.map((subtask) =>
            subtask.subtask_id === relId
              ? {
                  ...subtask,
                  comments: subtask.comments.map((thread) =>
                    thread.id === commentId
                      ? { ...thread, comment: data }
                      : thread
                  ),
                }
              : subtask
          ),
        },
      };
    },
    successThreadCommentEdit: (state, { payload: { commentId, data } }) => {
      return {
        ...state,
        comments: {
          ...state.threads,
          subtask: state.threads.subtask.data.map((subtask) => ({
            ...subtask,
            comments: subtask.comments.map((comment) =>
              comment.id === commentId ? { ...comment, comment: data } : comment
            ),
          })),
        },
      };
    },
    successCommentDelete: (state, { payload: { data } }) => {
      return {
        ...state,
        comments: {
          ...state.threads,
          task: {
            ...state.threads.task,
            comments: state.threads.task.comments.map((comment) => ({
              ...comment,
              comment: data,
            })),
          },
        },
      };
    },
    successMarkThread: (state, { payload }) => {
      return payload.isTask
        ? {
            ...state,
            comments: {
              ...state.threads,
              task: {
                ...state.threads.task,
                comments: state.threads.task.comments.map((data) =>
                  data.id === payload.params.comment_id
                    ? { ...data, status: payload.data }
                    : data
                ),
              },
            },
          }
        : {
            ...state,
            comments: {
              ...state.threads,
              subtask: state.threads.subtask.data.map((thread) =>
                thread.id === payload.params.comment_id
                  ? { ...thread, status: payload.data }
                  : thread
              ),
            },
          };
    },
    successActivityLogs: (state, { payload }) => {
      state.activityLogs = payload;
      state.isLoadingActivityLogs = false;
      state.error = null;
    },
    successPaginatedActivityLogs: (state, { payload }) => {
      state.activityLogs = {
        ...payload,
        data: [...state.activityLogs.data, ...payload.data],
      };
      state.isLoadingActivityLogs = false;
      state.error = null;
    },

    successUpdateTimer: (state, { payload }) => {
      state.ticket = {
        ...state.ticket,
        current_timelog: payload.current_timelog,
      };
      if (!_.isUndefined(payload.timelogs)) state.timelogs = payload.timelogs;
      state.error = null;
      state.isUpdatingTimer = false;
    },
    successTimerActiveUsers: (state, { payload }) => {
      state.ticket = {
        ...state.ticket,
        timer_active_users: payload,
      };
      state.error = null;
    },
    successUpdateAssignees: (state, { payload }) => {
      state.ticket = { ...state.ticket, assignee: payload };
    },
    successUpdatePriority: (state, { payload }) => {
      state.ticket = { ...state.ticket, priority: payload };
    },
    successUpdateTags: (state, { payload }) => {
      return {
        ...state,
        ticket: {
          ...state.ticket,
          tag: payload.filter((tag) => tag.is_selected),
        },
        options: {
          ...state.options,
          tagsList: [...payload],
        },
      };
    },
    successDestroyTask: (state) => {
      return {
        ...state,
      };
    },
    resetThreads: (state) => {
      state.threads.task = [];
      state.threads.subtask = [];
    },
    reset: (state) => {
      state.error = null;
      state.ticket = {};
      state.threads = [];
      state.options.priorityList = [];
      state.options.usersList = [];
      state.options.statusList = [];
      state.timelogs = [];
      state.files = [];
      state.activityLogs = [];
    },
  },
});

export const {
  initTask,
  initOverview,
  initTemplate,
  initTimelog,
  initRevisions,
  initActivityLogs,
  initOptions,
  initFiles,
  initCampaign,
  updateTimer,
  errorTask,
  validateTask,
  successTicketOverview,
  successTicketTimelog,
  successTemplates,
  successActivityLogs,
  successPaginatedActivityLogs,
  successActivityLogCampaign,
  successPriorityList,
  successUsersList,
  successStatusList,
  successChecklistList,
  successTaskTypeList,
  successThreadsList,
  successPaginatedThreadsList,
  successThreadsReplyList,
  successTeamList,
  successCommentList,
  successComment,
  successCommentDelete,
  successMarkThread,
  successThread,
  successThreadEdit,
  successThreadCommentEdit,
  successUpdateTimer,
  successUpdateSubtaskTImer,
  successFilesList,
  successTimelogStartEnded,
  successUpdateOverviewByKey,
  successTimerActiveUsers,
  successUpdateAssignees,
  successUpdatePriority,
  resetSubtaskThreads,
  successDestroyTask,
  successTagsList,
  successUpdateTags,
  reset,
  resetThreads,
} = ticket.actions;

export const taskComment = (type, params) => async (dispatch) => {
  const { success, data, message } = await getComment(type, params);
  if (success) {
    dispatch(successCommentList({ type, data }));
  } else {
    dispatch(errorTask(message));
  }
};

export const getThreadsList = (params) => async (dispatch) => {
  const { id, page, limit } = params;
  const { success, data, message } = await requestGetThreads(id, page, limit);
  if (success) {
    dispatch(successThreadsList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const getPaginatedThreadsList = (params) => async (dispatch) => {
  const { id, page, limit } = params;
  const { success, data, message } = await requestGetThreads(id, page, limit);
  if (success) {
    dispatch(successPaginatedThreadsList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const getThreadReplyList = (commentId) => async (dispatch) => {
  const { success, data, message } = await requestGetThreadReply(commentId);

  if (success) {
    dispatch(successThreadsReplyList({ commentId, data }));
  } else {
    dispatch(errorTask(message));
  }
};

export const threadComment = (type, params) => async (dispatch) => {
  const { success, message } = await setThread(type, params);
  if (!success) dispatch(errorTask(message));
};

export const getTicketById =
  (params, onFailure = () => {}, update) =>
  async (dispatch) => {
    _.isUndefined(update) && dispatch(initOverview());
    const { success, data, message, status } = await requestGetOverview(params);
    if (success) {
      dispatch(successTicketOverview(data));
    } else {
      dispatch(errorTask(message));
      onFailure(message, status);
    }
  };

export const getTicketActivityLogs = (id) => async (dispatch) => {
  dispatch(initActivityLogs());

  const { success, data, message } = await requestChangelogTicket(id);

  if (success) {
    dispatch(successActivityLogs(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const getPaginatedTicketActivityLogs =
  (id, page) => async (dispatch) => {
    dispatch(initActivityLogs());

    const { success, data, message } = await requestChangelogTask(id, page);

    if (success) {
      dispatch(successPaginatedActivityLogs(data));
    } else {
      dispatch(errorTask(message));
    }
  };

export const updateTicketAssignees =
  (params, completion = () => {}) =>
  async (dispatch) => {
    const { success, data, message } = await requestUpdateAssignees(params);

    if (success) {
      dispatch(successUpdateAssignees(data));
      //dispatch(successUpdateDashboard(data));
      completion();
    } else {
      dispatch(errorTask(message));
    }
  };

export const updateTicketPriority =
  (params, completion = () => {}) =>
  async (dispatch) => {
    const { success, data, message } = await requestUpdatePriority(params);

    if (success) {
      dispatch(successUpdatePriority(data));
      //dispatch(successUpdateDashboard(data));
      completion();
    } else {
      dispatch(errorTask(message));
    }
  };

export const updateTicketFavorite = (id) => async (dispatch) => {
  const { success, message } = await requestFavoriteTicket(id);

  if (success) {
    dispatch(getTicketById(id, _, true));
  } else {
    dispatch(errorTask(message));
  }
};

export const getData = (type, params) => async (dispatch) => {
  dispatch(initOptions);

  const { success, data, message } = await requestData(type, params);

  success ? dispatch(setData(type, data)) : dispatch(errorTask(message));
};

const requestData = (type, params) => {
  switch (type) {
    case 'priority_flag':
      return requestTicketPriorityFlag();
    case 'users':
      return requestMaintenanceUser('?limit=1000');
    case 'status':
      return requestTicketStatus('?limit=1000');
    case 'tags':
      return requestFetchTags(params);
  }
};

const setData = (type, data) => {
  switch (type) {
    case 'priority_flag':
      return successPriorityList(data);
    case 'users':
      return successUsersList(data);
    case 'status':
      return successStatusList(data);
    case 'tags':
      return successTagsList(data);
    //return;
  }
};

export const getPaginatedTaskActivityLogs =
  (id, relType, page) => async (dispatch) => {
    dispatch(initActivityLogs());

    const { success, data, message } = await requestChangelogTask(
      id,
      relType,
      page
    );

    if (success) {
      dispatch(successPaginatedActivityLogs(data));
    } else {
      dispatch(errorTask(message));
    }
  };

export const getTaskActivityLogCampaign = (id) => async (dispatch) => {
  dispatch(initActivityLogs());

  const { success, data, message } = await requestChangelogTaskCampaign(id);

  if (success) {
    dispatch(successActivityLogCampaign(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const getTeamList = () => async (dispatch) => {
  const { success, data, message } = await requestMaintenanceTeams(
    '?limit=1000'
  );

  if (success) {
    dispatch(successTeamList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const getTicketFiles = (params) => async (dispatch) => {
  dispatch(initFiles());
  const { success, data, message } = await requestFetchFiles(params);
  if (success) {
    dispatch(successFilesList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const deleteCommentAttachment = (params) => async () =>
  await requestDeleteCommentAttachment(params);

const getComment = (type, data) => {
  switch (type) {
    case 'task_comment':
      return requestGetParentTaskComment(data.taskId);
    case 'subtask_comment':
      return requestGetSubtaskComment(data.taskId, 'subtask');
  }
};

const setThread = (type, data) => {
  switch (type) {
    case 'add_thread':
    case 'add_thread_comment':
      return requestAddTicketComment(data);
    case 'edit_thread_or_comment':
      return requestEditTicketComment(data);
    case 'thread_delete':
    case 'comment_delete':
      return requestDeleteTicketComment(data);
    case 'thread_resolve':
    case 'thread_reject':
      return requestAddThreadStatus(data);
    case 'delete_attachment':
      return requestDeleteCommentAttachment(data);
  }
};

export const getTicketTimelogById =
  (id, onCompletion = () => {}) =>
  async (dispatch) => {
    dispatch(initTimelog());

    const { success, data, message } = await requestGetTicketTimelog(id);

    if (success) {
      dispatch(successTicketTimelog(data));
    } else {
      dispatch(errorTask(message));
    }

    onCompletion();
  };

export const startTimer =
  (params, onCompletion = () => {}) =>
  async (dispatch) => {
    dispatch(updateTimer());

    const { success, data, message } = await requestStartTimer(params);

    if (success) {
      dispatch(successUpdateTimer(data));
      onCompletion();
    } else {
      dispatch(errorTask(message));
    }
  };

export const stopTimer =
  (id, params, onCompletion = () => {}) =>
  async (dispatch) => {
    dispatch(updateTimer());

    const { success, message } = await requestStopTimer(params);

    if (success) {
      dispatch(successUpdateTimer({ current_timelog: null }));
      dispatch(getTicketTimelogById(id));
      onCompletion();
    } else {
      dispatch(errorTask(message));
    }
  };

export const getTimerActiveUsers =
  (params, onCompletion = () => {}) =>
  async (dispatch) => {
    const { success, data, message } = await requestTimerActiveUsers(params);

    if (success) {
      dispatch(successTimerActiveUsers(data));
      onCompletion();
    } else {
      dispatch(errorTask(message));
    }
  };

export const destroyTask = (body) => async (dispatch) => {
  const { success, message } = await requestDestroyTask(body);
  if (success) {
    dispatch(successDestroyTask());
  } else {
    dispatch(errorTask(message));
  }
};

export const updateTimelogEnded = (params) => async (dispatch) => {
  dispatch(initTimelog());
  const { success, message } = await requestTimelogEndedStarted(params);
  if (success) {
    dispatch(getTicketTimelogById(params.task_id));
  } else {
    dispatch(errorTask(message));
  }
};

export const updateTimelogStart = (params) => async (dispatch) => {
  dispatch(initTimelog());
  const { success, message } = await requestTimelogEndedStarted(params);
  if (success) {
    dispatch(getTicketTimelogById(params.task_id));
  } else {
    dispatch(errorTask(message));
  }
};

export const updateTicketStatus = (params) => async (dispatch) => {
  dispatch(initTimelog());
  const { success, _, message } = await requestUpdateStatus(params);
  if (success) {
    dispatch(getTicketById(params.id, _, true));
  } else {
    dispatch(errorTask(message));
  }
};

export const updateTags = (params) => async (dispatch) => {
  const { success, data, message } =
    params.action == 'add'
      ? await requestAddTags(params)
      : await requestRemoveTags(params);

  success ? dispatch(successUpdateTags(data)) : dispatch(errorTask(message));
};

export default ticket.reducer;
