// Redux
import { createSlice } from '@reduxjs/toolkit';
// Services
import {
  requestDueDateUpdate,
  requestTaskDeliveryDateUpdate,
  requestCampaignDeliveryDateUpdate,
  requestCampaignLaunchDateUpdate,
  requestGetBrief,
  requestUpdateBriefByKey,
  requestUpdateTask,
  requestGetParentTaskComment,
  requestGetSubtaskComment,
  requestAddTaskComment,
  requestEditTaskComment,
  requestGetTaskTimelog,
  requestDeleteTaskComment,
  requestDeleteCommentAttachment,
  requestChangelogTask,
  requestAddThreadStatus,
  requestStartTimer,
  requestPlayTimer,
  requestPauseTimer,
  requestStopTimer,
  requestGetRevision,
  requestTemplates,
  requestAddTaskReference,
  requestFetchChecklist,
  requestAddChecklist,
  requestDestroyChecklist,
  requestCheckedChecklist,
  requestUncheckedChecklist,
  requestUpdateChecklist,
  requestAddRevisionV2,
  requestUpdateRevisionV2,
  requestDestroyRevision,
  requestResolvedRevisionV2,
  requestFetchRefLink,
  requestDestroyRefLink,
  requestAddRefLink,
  requestFetchTags,
  requestAddTags,
  requestAddFormatDisplay,
  requestTimelogEndedStarted,
  requestRemoveFormatDisplay,
  requestRemoveTags,
  requestFetchTriggers,
  requestFetchDisplayMD,
  requestAddTriggers,
  requestRemoveTriggers,
  requestAddSubtask,
  requestFetchFiles,
  requestFetchSubTask,
  requestChangelogTaskCampaign,
  requestFetchRevisionList,
  requestDeleteRevision,
  requestAddSubtaskRevision,
  requestChecklistRevision,
  requestChangeTemplateVersion,
  requestDestroySubtask,
  requestDestroyTask,
  requestUpdate,
  requestTimerActiveUsers,
  requestGetThreads,
  requestGetThreadReply,
  requestFetchPredefinedReasons,
  requestAddQATags,
  requestFetchQATags,
  requestPricingCSV,
} from 'services/api/brief';

import {
  requestPriorityFlag,
  requestMaintenanceUser,
  requestMaintenanceTaskStatus,
} from 'services/api/maintenance';

import { fetchConceptByPartner } from 'services/api/concept';
import FileSaver from 'file-saver';

import {
  requestMaintenanceTeams,
  requestMaintenanceTaskType,
} from 'services/api/maintenance';

import { fetchReferenceLink, fetchCampaign } from 'services/api/campaign';
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
  data_check: [],
  data_revision: [],
  data_revision_tab: [],
  data_reference: [],
  data_revision_subtask: [],
  data_subtask: [],
  data_subtask_modal: [],
  data_reference_campaign: [],
  data_reference_campaign_delete: [],
  overview: {},
  overviewData: {
    conceptList: [],
    campaignList: [],
    taskTypeList: [],
    teamList: [],
    isFetchingCampaign: false,
  },
  timelogs: [],
  activityLogs: [],
  threads: [],
  subtasks: [],
  creatives: {},
  checkListCheck: [],
  revisionResolved: [],
  timelogEndedStarted: [],
  options: {
    priorityList: [],
    usersList: [],
    statusList: [],
    tagsList: [],
    qaTagsList: [],
    qaTagsModal: [],
    triggersList: [],
    desktopDisplayList: [],
    mobileDisplayList: [],
    predefinedReasonsList: [],
    isFetching: false,
  },
  files: [],
};

const tasks = createSlice({
  name: 'briefs',
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
    successTaskOverview: (state, { payload }) => {
      state.overview = payload;
      state.subtasks = payload.sub_categories;
      state.isLoadingOverview = false;
      state.error = null;
    },
    successTaskTimelog: (state, { payload }) => {
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
      state.options.statusList = payload.data;
      state.isLoadingOptions = false;
    },
    successPredefinedReasonsList: (state, { payload }) => {
      state.options.predefinedReasonsList = payload;
      state.isLoadingOptions = false;
    },
    successChecklistList: (state, { payload }) => {
      state.data_check = payload;
    },
    successRevisionList: (state, { payload }) => {
      state.data_revision = payload.data;
    },
    successRevisionListTab: (state, { payload }) => {
      state.data_revision_tab = payload.data;
    },
    successRevisionAddSubtask: (state, { payload }) => {
      state.data_revision_subtask = payload.data;
    },
    successRefLinkList: (state, { payload }) => {
      state.data_reference = _.isArray(payload)
        ? payload
        : [...state.data_reference, payload]; // Added temp safety. API returns an object instead of array after adding the first item.
    },
    successRefLinkListCampaign: (state, { payload }) => {
      state.data_reference_campaign = payload.data;
    },
    successRefLinkListCampaignDelete: (state, { payload }) => {
      state.data_reference_campaign_delete = payload;
    },
    successFilesList: (state, { payload }) => {
      state.files = payload;
    },
    // successSubtask: (state, { payload }) => {
    //   state.data_subtask = payload;

    // },
    successSubtask: (state, { payload }) => {
      state.subtasks = payload;
    },

    successSubtaskDelete: (state, { payload }) => {
      state.data_subtask_modal = payload;
      state.subtasks = payload;
    },

    successAddSubtask: (state, { payload }) => {
      state.data_subtask_modal = payload;
      state.subtasks = [...state.subtasks, payload];
    },

    successTagsList: (state, { payload }) => {
      state.options.tagsList = payload;
    },
    successQATagsList: (state, { payload }) => {
      state.options.qaTagsList = payload.data;
    },
    successQATagsModal: (state, { payload }) => {
      state.options.qaTagsModal = payload.data;
    },
    successDesktopDisplayList: (state, { payload }) => {
      state.options.desktopDisplayList = payload;
    },
    successTimelogStartEnded: (state, { payload }) => {
      state.options.timelogEndedStarted = payload;
    },
    successMobileDisplayList: (state, { payload }) => {
      state.options.mobileDisplayList = payload;
    },
    successTriggersList: (state, { payload }) => {
      state.options.triggersList = payload;
    },
    successConceptList: (state, { payload }) => {
      state.overviewData.conceptList = payload?.data;
    },
    successCampaignList: (state, { payload }) => {
      state.overviewData.campaignList = payload?.campaigns;
      state.overviewData.isFetchingCampaign = false;
    },
    successTaskTypeList: (state, { payload }) => {
      state.overviewData.taskTypeList = payload?.data;
    },
    successTeamList: (state, { payload }) => {
      state.overviewData.teamList = payload?.data;
    },
    successUpdateByKey: (state, { payload }) => {
      return payload.isParent || _.isUndefined(state.subtasks) // Task & Subtask key modal update
        ? { ...state, overview: { ...state.overview, ...payload.data } }
        : {
            ...state,
            subtasks: state.subtasks?.map((subTask) =>
              subTask.id === payload.id
                ? { ...subTask, ...payload.data }
                : subTask
            ),
          }; // Subtask key update inside task modal
    },
    successUpdateTags: (state, { payload }) => {
      return {
        ...state,
        overview: {
          ...state.overview,
          tags: payload,
        },
      };
    },
    successUpdateDesktopDisplays: (state, { payload }) => {
      return {
        ...state,
        overview: {
          ...state.overview,
          desktop_displays: payload.filter(
            (desktop_display) => desktop_display.is_selected
          ),
        },
        options: {
          ...state.options,
          desktopDisplayList: [...payload],
        },
      };
    },
    successUpdateMobileDisplays: (state, { payload }) => {
      return {
        ...state,
        overview: {
          ...state.overview,
          mobile_displays: payload.filter(
            (mobile_display) => mobile_display.is_selected
          ),
        },
        options: {
          ...state.options,
          mobileDisplayList: [...payload],
        },
      };
    },
    successUpdateTriggers: (state, { payload }) => {
      return {
        ...state,
        overview: {
          ...state.overview,
          triggers: payload.filter((tag) => tag.is_selected),
        },
        options: {
          ...state.options,
          triggersList: [...payload],
        },
      };
    },
    successCommentList: () => {},
    successThreadsList: (state, { payload }) => {
      let { responseData } = payload;

      state.threads = responseData;
      state.isLoadingComments = false;
    },
    successPaginatedThreadsList: (state, { payload }) => {
      let { type, responseData, taskData } = payload;
      switch (type) {
        case 'parent_task':
          state.threads.task = {
            ...responseData,
            data: [...state.threads.task.data, ...responseData.data],
          };
          break;
        case 'parent_task_subtask':
          state.threads.subtask = state.threads.subtask.map((thread) =>
            thread.data.id === taskData.id
              ? {
                  ...responseData,
                  data: {
                    ...thread.data,
                    list: [...thread.data.list, ...responseData.data],
                  },
                }
              : { ...thread }
          );
          break;
        case 'subtask':
          state.threads.subtask = {
            ...responseData,
            data: [...state.threads.subtask.data, ...responseData.data],
          };
          break;
        default:
          break;
      }

      state.isLoadingComments = false;
    },
    successThreadsReplyList: (state, { payload }) => {
      let { commentId, data } = payload;
      state.threads.data = state.threads.data.map((thread) =>
        thread.id === commentId
          ? {
              ...thread,
              replies: data.data?.reverse(),
            }
          : {
              ...thread,
            }
      );

      state.isLoadingComments = false;
    },
    successTemplates: (state, { payload }) => {
      state.creatives = payload;
      state.isLoadingTemplate = false;
      state.error = null;
    },
    successChecklistCheck: (state, { payload }) => {
      state.checkListCheck = payload;
    },
    successRevisionResolved: (state, { payload }) => {
      state.revisionResolved = payload;
    },
    successThread: (
      state,
      { payload: { relId, commentRelType, data, isTask } }
    ) => {
      return isTask && commentRelType === 'subtask' // Adding subtask's thread from task modal
        ? {
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
          }
        : commentRelType === 'task' // Task
        ? {
            ...state,
            comments: {
              ...state.threads,
              task: {
                ...state.threads.task,
                comments: [data, ...state.threads.task.comments],
              },
            },
          }
        : commentRelType === 'subtask' // Subtask
        ? {
            ...state,
            comments: {
              ...state.threads,
              subtask: [data, ...state.threads.subtask],
            },
          }
        : {};
    },
    successThreadEdit: (
      state,
      { payload: { relId, commentRelType, data, isTask } }
    ) => {
      return isTask && commentRelType === 'subtask' // Editing subtask's thread from task modal
        ? {
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
          }
        : commentRelType === 'task' // Task
        ? {
            ...state,
            comments: {
              ...state.threads,
              task: {
                ...state.threads.task,
                comments: state.threads.task.comments.map((comment) =>
                  comment.id == relId
                    ? {
                        ...data,
                        comment: comment.comment,
                      }
                    : comment
                ),
              },
            },
          }
        : commentRelType === 'subtask' // Subtask
        ? {
            ...state,
            comments: {
              ...state.threads,
              subtask: state.threads.subtask.data.map((comment) =>
                comment.id === relId ? data : comment
              ),
            },
          }
        : {};
    },
    successComment: (
      state,
      { payload: { data, commentRelType, commentId, relId, isTask } }
    ) => {
      return isTask && commentRelType === 'subtask' // Adding subtask's comment from task modal
        ? {
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
          }
        : commentRelType === 'task' // Task
        ? {
            ...state,
            comments: {
              ...state.threads,
              task: {
                ...state.threads.task,
                comments: state.threads.task.comments.map((comment) =>
                  comment.id === commentId
                    ? { ...comment, comment: data }
                    : comment
                ),
              },
            },
          }
        : commentRelType === 'subtask' // Subtask
        ? {
            ...state,
            comments: {
              ...state.threads,
              subtask: state.threads.subtask.data.map((comment) =>
                comment.id === commentId
                  ? { ...comment, comment: data }
                  : comment
              ),
            },
          }
        : {};
    },
    successThreadCommentEdit: (
      state,
      { payload: { commentId, commentRelType, data, isTask } }
    ) => {
      return isTask && commentRelType === 'subtask' // editing subtask's comment from task modal
        ? {
            ...state,
            comments: {
              ...state.threads,
              subtask: state.threads.subtask.data.map((subtask) => ({
                ...subtask,
                comments: subtask.comments.map((comment) =>
                  comment.id === commentId
                    ? { ...comment, comment: data }
                    : comment
                ),
              })),
            },
          }
        : commentRelType === 'task'
        ? {
            ...state,
            comments: {
              ...state.threads,
              task: {
                ...state.threads.task,
                comments: state.threads.task.comments.map((comment) =>
                  comment.id === commentId
                    ? { ...comment, comment: data }
                    : comment
                ),
              },
            },
          }
        : commentRelType === 'subtask'
        ? {
            ...state,
            comments: {
              ...state.threads,
              subtask: state.threads.subtask.data.map((subtask) =>
                subtask.id === commentId
                  ? {
                      ...subtask,
                      comment: data,
                    }
                  : subtask
              ),
            },
          }
        : {};
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

    successUpdateOverviewByKey: (state, { payload: { data } }) => {
      switch (data.key) {
        case 'task_campaign':
          return {
            ...state,
            overview: {
              ...state.overview,
              campaign_id: data.id,
              campaign_name: data.name,
              name: data.overview_name,
            },
          };

        case 'task_concept':
          return {
            ...state,
            overview: {
              ...state.overview,
              concept_id: data.id,
              concept: data.name,
              name: data.overview_name,
            },
          };

        case 'task_team':
          return {
            ...state,
            overview: {
              ...state.overview,
              team: { id: data.id, name: data.name },
            },
          };
        case 'task_task_type':
          return {
            ...state,
            overview: {
              ...state.overview,
              task_type_id: data.id,
              task_type: data.name,
              name: data.overview_name,
            },
          };
      }
    },

    successActivityLogCampaign: (state, { payload }) => {
      state.activityLogCampaign = payload.data;
      state.isLoadingActivityLogs = false;
      state.error = null;
    },

    successRevisions: (state) => {
      state.isLoadingRevisions = false;
      state.error = null;
    },
    successUpdateTimer: (state, { payload }) => {
      state.overview = {
        ...state.overview,
        current_timelog: payload.current_timelog,
      };
      state.error = null;
      state.isUpdatingTimer = false;
    },
    successTimerActiveUsers: (state, { payload }) => {
      state.overview = {
        ...state.overview,
        timer_active_users: payload,
      };
      state.error = null;
    },
    successUpdateSubtaskTImer: (state, { payload }) => {
      return {
        ...state,
        subtasks: state.subtasks.map((data) =>
          data.id === payload.id
            ? {
                ...data,
                current_timelog:
                  payload.data.status.toLowerCase() === 'stop'
                    ? null
                    : payload.data,
              }
            : data
        ),
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
      state.overview = {};
      state.subtasks = [];
      state.creatives = {};
      state.threads.task = [];
      state.threads.subtask = [];
      state.options.desktopDisplayList = [];
      state.options.mobileDisplayList = [];
      state.timelogs = [];
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
  successTaskOverview,
  successTaskTimelog,
  successTemplates,
  successActivityLogs,
  successPaginatedActivityLogs,
  successActivityLogCampaign,
  successPriorityList,
  successUsersList,
  successStatusList,
  successChecklistList,
  successUpdateByKey,
  successAddSubtask,
  successSubtaskDelete,
  successRefLinkListCampaign,
  successRefLinkListCampaignDelete,
  successUpdateTags,
  successUpdateTriggers,
  successUpdateMobileDisplays,
  successUpdateDesktopDisplays,
  successConceptList,
  successCampaignList,
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
  successRevisions,
  successUpdateTimer,
  successUpdateSubtaskTImer,
  successChecklistCheck,
  successRevisionList,
  successRevisionResolved,
  successRefLinkList,
  successSubtask,
  successTagsList,
  successQATagsList,
  successQATagsModal,
  successMobileDisplayList,
  successDesktopDisplayList,
  successDestroyTask,
  successTriggersList,
  successFilesList,
  successPredefinedReasonsList,
  successRevisionListTab,
  successRevisionAddSubtask,
  successTimelogStartEnded,
  successUpdateOverviewByKey,
  successTimerActiveUsers,
  resetSubtaskThreads,
  reset,
  resetThreads,
} = tasks.actions;

export const getData = (type, params) => async (dispatch) => {
  dispatch(initOptions);

  const { success, data, message } = await requestData(type, params);

  success ? dispatch(setData(type, data)) : dispatch(errorTask(message));
};

export const taskTemplates = (id, relType) => async (dispatch) => {
  dispatch(initTemplate());
  const { success, data, message } = await requestTemplates(id, relType);
  if (success) {
    dispatch(successTemplates(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const taskReference = (params) => async (dispatch) => {
  const { success, data, message } = await requestAddTaskReference(params);

  if (success) {
    dispatch(successTemplates(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestChangeTemplateVersion_ =
  (body, relType) => async (dispatch) => {
    const { success, data, message } = await requestChangeTemplateVersion(body);

    if (success) {
      dispatch(successTemplates(data));
      dispatch(taskTemplates(body.rel_id, relType));
    } else {
      dispatch(errorTask(message));
    }
  };

export const taskComment = (type, params) => async (dispatch) => {
  const { success, data, message } = await getComment(type, params);
  if (success) {
    dispatch(successCommentList({ type, data }));
  } else {
    dispatch(errorTask(message));
  }
};

export const getThreadsList =
  (type, params, taskData = {}) =>
  async (dispatch) => {
    const { relId, relType, page, limit, threadId } = params;
    const {
      success,
      data: responseData,
      message,
    } = await requestGetThreads(relId, relType, page, limit, threadId);
    if (success) {
      dispatch(successThreadsList({ type, responseData, taskData }));
    } else {
      dispatch(errorTask(message));
    }
  };

export const getPaginatedThreadsList =
  (type, params, taskData = {}) =>
  async (dispatch) => {
    const { relId, relType, page, limit } = params;
    const {
      success,
      data: responseData,
      message,
    } = await requestGetThreads(relId, relType, page, limit);
    if (success) {
      dispatch(successPaginatedThreadsList({ type, responseData, taskData }));
    } else {
      dispatch(errorTask(message));
    }
  };

export const getThreadReplyList =
  (type, commentId, taskId) => async (dispatch) => {
    const { success, data, message } = await requestGetThreadReply(
      taskId,
      commentId
    );

    if (success) {
      dispatch(successThreadsReplyList({ commentId, taskId, data }));
    } else {
      dispatch(errorTask(message));
    }
  };

export const threadComment =
  (type, params, onFailure = () => {}) =>
  async (dispatch) => {
    const { success, message } = await setThread(type, params);

    if (!success) {
      dispatch(errorTask(message));
      onFailure(message);
    }
  };

export const updateTaskDuedate = (body) => async (dispatch) => {
  dispatch(initTask());
  const { success, message } = await requestDueDateUpdate(body);

  if (success) {
    dispatch(validateTask());
  } else {
    dispatch(errorTask(message));
  }
};

export const updateTaskDeliveryDate = (body) => async (dispatch) => {
  dispatch(initTask());
  const { success, message } = await requestTaskDeliveryDateUpdate(body);

  if (success) {
    dispatch(validateTask());
  } else {
    dispatch(errorTask(message));
  }
};

export const updateCampaignDeliveryDate = (body) => async (dispatch) => {
  dispatch(initTask());
  const { success, message } = await requestCampaignDeliveryDateUpdate(body);

  if (success) {
    dispatch(validateTask());
  } else {
    dispatch(errorTask(message));
  }
};

export const updateCampaignLaunchDate = (body) => async (dispatch) => {
  dispatch(initTask());
  const { success, message } = await requestCampaignLaunchDateUpdate(body);

  if (success) {
    dispatch(validateTask());
  } else {
    dispatch(errorTask(message));
  }
};

export const getBriefByid =
  (params, onFailure = () => {}) =>
  async (dispatch) => {
    dispatch(initOverview());
    const { success, data, message, status } = await requestGetBrief({
      id: params,
    });
    if (success) {
      dispatch(successTaskOverview(data));
    } else {
      dispatch(errorTask(message));
      onFailure(message, status);
    }
  };

export const getBriefTimelogById =
  (id, relType, onCompletion = () => {}) =>
  async (dispatch) => {
    dispatch(initTimelog());

    const { success, data, message } = await requestGetTaskTimelog(id, relType);

    if (success) {
      dispatch(successTaskTimelog(data));
    } else {
      dispatch(errorTask(message));
    }

    onCompletion();
  };

export const getTaskActivityLogs = (id, relType) => async (dispatch) => {
  dispatch(initActivityLogs());

  const { success, data, message } = await requestChangelogTask(id, relType);

  if (success) {
    dispatch(successActivityLogs(data));
  } else {
    dispatch(errorTask(message));
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

export const getConceptList = (partnerId) => async (dispatch) => {
  const { success, data, message } = await fetchConceptByPartner(partnerId, 1);

  if (success) {
    dispatch(successConceptList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const getCampaignList = (conceptId, partnerId) => async (dispatch) => {
  dispatch(initCampaign());
  const { success, data, message } = await fetchCampaign(conceptId, partnerId);

  if (success) {
    dispatch(successCampaignList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const getTaskTypeList = () => async (dispatch) => {
  const { success, data, message } = await requestMaintenanceTaskType(
    '?limit=1000&status=1'
  );

  if (success) {
    dispatch(successTaskTypeList(data));
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

export const updateOverviewByKey =
  (params, name, title) => async (dispatch) => {
    let changeData = {
      data: {
        key: params.key,
        id: params.value,
        name: name,
        overview_name: title,
      },
    };

    const { success, message } = await requestUpdate(params);

    success
      ? dispatch(successUpdateOverviewByKey(changeData))
      : dispatch(errorTask(message));
  };

export const getTaskRevisions = (params) => async (dispatch) => {
  dispatch(initRevisions());

  const { success, data, message } = await requestGetRevision(
    params.id,
    params.type
  );

  if (success) {
    dispatch(successRevisions(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const getTaskFiles = (params) => async (dispatch) => {
  dispatch(initFiles());
  const { success, data, message } = await requestFetchFiles(params);
  if (success) {
    dispatch(successFilesList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const updateBriefByKey =
  (params, completion = () => {}, onFailure = () => {}) =>
  async (dispatch) => {
    const { success, data, message } = await requestUpdateBriefByKey(params);

    if (success) {
      dispatch(updateData(params.key, data));
      // dispatch(successUpdateDashboard(data));
      completion();
    } else {
      dispatch(errorTask(message));
      onFailure(message);
    }
  };

export const updateTags = (params) => async (dispatch) => {
  const { success, tags, message } =
    params.action == 'add'
      ? await requestAddTags(params)
      : await requestRemoveTags(params);

  success ? dispatch(successUpdateTags(tags)) : dispatch(errorTask(message));
};

export const updateQATags = (params) => async (dispatch) => {
  const { success, message } = await requestAddQATags(params);

  success
    ? await dispatch(
        getData('qa_tags', { relId: params.rel_id, relType: params.rel_type })
      )
    : await dispatch(errorTask(message));
};

export const updateDesktopDisplays = (params) => async (dispatch) => {
  const { success, data, message } = await requestAddFormatDisplay(params);

  success
    ? dispatch(successDesktopDisplayList(data))
    : dispatch(errorTask(message));
};

export const updateTimelogEnded = (params) => async (dispatch) => {
  dispatch(initTimelog());
  const { success, message } = await requestTimelogEndedStarted(params);
  if (success) {
    dispatch(getBriefTimelogById(params.brief_id));
  } else {
    dispatch(errorTask(message));
  }
};

export const updateTimelogStart = (params) => async (dispatch) => {
  dispatch(initTimelog());
  const { success, message } = await requestTimelogEndedStarted(params);
  if (success) {
    dispatch(getBriefTimelogById(params.brief_id));
  } else {
    dispatch(errorTask(message));
  }
};

export const updateDesktopDisplaysRemove = (params) => async (dispatch) => {
  const { success, data, message } = await requestRemoveFormatDisplay(params);

  success
    ? dispatch(successDesktopDisplayList(data))
    : dispatch(errorTask(message));
};

export const updateMobileDisplays = (params) => async (dispatch) => {
  const { success, data, message } = await requestAddFormatDisplay(params);

  success
    ? dispatch(successMobileDisplayList(data))
    : dispatch(errorTask(message));
};

export const updateMobileDisplaysRemove = (params) => async (dispatch) => {
  const { success, data, message } = await requestRemoveFormatDisplay(params);

  success
    ? dispatch(successMobileDisplayList(data))
    : dispatch(errorTask(message));
};

export const updateTriggers = (params) => async (dispatch) => {
  const { success, data, message } =
    params.action == 'add'
      ? await requestAddTriggers(params)
      : await requestRemoveTriggers(params);

  success
    ? dispatch(successUpdateTriggers(data))
    : dispatch(errorTask(message));
};

export const updateTaskModal = (params) => async (dispatch) => {
  const { success, data, message } = await requestUpdateTask(params);

  success ? dispatch(updateTaskCampaign(data)) : dispatch(errorTask(message));
};

export const deleteCommentAttachment = (params) => async () =>
  await requestDeleteCommentAttachment(params);

export default tasks.reducer;

const requestData = (type, params) => {
  switch (type) {
    case 'priority_flag':
      return requestPriorityFlag();
    case 'users':
      return requestMaintenanceUser('?limit=1000');
    case 'status':
      return requestMaintenanceTaskStatus('?limit=1000');
    case 'tags':
      return requestFetchTags(params);
    case 'qa_tags':
    case 'qa_tags_modal':
      return requestFetchQATags(params);
    case 'triggers':
      return requestFetchTriggers(params);
    case 'mobile_displays':
    case 'desktop_displays':
      return requestFetchDisplayMD(params);
    case 'pre-defined_reasons':
      return requestFetchPredefinedReasons(params);
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
    case 'qa_tags':
      return successQATagsList(data);
    case 'qa_tags_modal':
      return successQATagsModal(data);
    case 'mobile_displays':
      return successMobileDisplayList(data);
    case 'desktop_displays':
      return successDesktopDisplayList(data);
    case 'triggers':
      return successTriggersList(data);
    case 'pre-defined_reasons':
      return successPredefinedReasonsList(data);
    case 'activity-log':
    //return;
  }
};

const updateTaskCampaign = (data) => {
  return successUpdateByKey({
    id: data.id,
    status: data.status,
    type: data.type,
  });
};

const updateData = (type, data) => {
  switch (type) {
    case 'status':
      return successUpdateByKey({
        id: data.id,
        data: {
          status: data.status,
          status_id: data.status_id,
          assignees:
            data.assignees.map((data) => ({ ...data, id: data.user_id })) ?? [],
        },
      });

    case 'priority':
      return successUpdateByKey({
        id: data.id,
        data: {
          priority: data.priority,
        },
      });

    case 'assignees':
      return successUpdateByKey({
        id: data.id,
        data: {
          assignees: data.map((data) => ({ ...data, id: data.user_id })),
        },
      });

    case 'is_approved':
      return successUpdateByKey({
        id: data.id,
        data: data,
      });

    case 'watchers':
      return successUpdateByKey({
        id: data.id,
        data: data,
      });

    case 'due_date':
      return successUpdateByKey({
        id: data.id,
        data: { due_date: data.due_date },
      });

    case 'delivery_date':
      return successUpdateByKey({
        id: data.id,
        data: { delivery_date: data.delivery_date },
      });
    case 'campaign_end_date':
      return successUpdateByKey({
        id: data.id,
        data: { campaign_end_date: data.campaign_end_date },
      });
    case 'campaign_launch_date':
      return successUpdateByKey({
        id: data.id,
        isParent: data.is_parent,
        data: { campaign_launch_date: data.campaign_launch_date },
      });
    case 'pin':
      return successUpdateByKey({
        id: data.id,
        data: { is_pinned: data.is_pinned },
      });
  }
};

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
      return requestAddTaskComment(data);
    case 'edit_thread_or_comment':
      return requestEditTaskComment(data);
    case 'thread_delete':
    case 'comment_delete':
      return requestDeleteTaskComment(data);
    case 'thread_resolve':
    case 'thread_reject':
      return requestAddThreadStatus(data);
    case 'delete_attachment':
      return requestDeleteCommentAttachment(data);
  }
};

export const startTimer =
  (id, params, onCompletion = () => {}) =>
  async (dispatch) => {
    dispatch(updateTimer());

    const { success, data, message } = await requestStartTimer(id);

    if (success) {
      dispatch(successUpdateTimer(data));
      onCompletion();
    } else {
      dispatch(errorTask(message));
    }
  };

export const playTimer =
  (id, params, onCompletion = () => {}) =>
  async (dispatch) => {
    dispatch(updateTimer());

    const { success, data, message } = await requestPlayTimer(params);

    if (success) {
      dispatch(successUpdateTimer(data));
      onCompletion();
    } else {
      dispatch(errorTask(message));
    }
  };

export const pauseTimer =
  (id, params, onCompletion = () => {}) =>
  async (dispatch) => {
    dispatch(updateTimer());

    const { success, data, message } = await requestPauseTimer(params);

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

    const { success, data, message } = await requestStopTimer(id);

    if (success) {
      dispatch(successUpdateTimer({ ...data, current_timelog: null }));
      onCompletion();
    } else {
      dispatch(errorTask(message));
    }
  };

export const getTimerActiveUsers =
  (id, onCompletion = () => {}) =>
  async (dispatch) => {
    const { success, data, message } = await requestTimerActiveUsers(id);

    if (success) {
      dispatch(successTimerActiveUsers(data));
      onCompletion();
    } else {
      dispatch(errorTask(message));
    }
  };

export const requestFetchChecklist_ = (id) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestFetchChecklist(id);

  if (success) {
    dispatch(successChecklistList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestAddChecklist_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestAddChecklist(body);

  if (success) {
    dispatch(successChecklistList(data));
    dispatch(requestFetchChecklist_(body.task_id));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestUpdateChecklist_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestUpdateChecklist(body);

  if (success) {
    dispatch(successChecklistList(data));
    dispatch(requestFetchChecklist_(body.task_id));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestDestroyChecklist_ = (body) => async (dispatch) => {
  dispatch(initTask());
  const { success, data, message } = await requestDestroyChecklist(body);

  if (success) {
    dispatch(successChecklistList(data));
    dispatch(requestFetchChecklist_(body.task_id));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestCheckedChecklist_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, message } = await requestCheckedChecklist(body);

  if (success) {
    dispatch(successChecklistCheck(success));
    dispatch(requestFetchChecklist_(body.task_id));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestUncheckedChecklist_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, message } = await requestUncheckedChecklist(body);

  if (success) {
    dispatch(successChecklistCheck(success));
    dispatch(requestFetchChecklist_(body.task_id));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestDestroyRefLink_ = (body) => async (dispatch) => {
  dispatch(initTask());
  const { success, data, message } = await requestDestroyRefLink(body);

  if (success) {
    dispatch(successRefLinkList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestAddRefLink_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestAddRefLink(body);

  if (success) {
    dispatch(successRefLinkList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestFetchRefLink_ = (params) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestFetchRefLink(params);

  if (success) {
    dispatch(successRefLinkList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestAddRefLinkCampaign_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestAddRefLink(body);

  if (success) {
    dispatch(successRefLinkListCampaign(data));
    dispatch(fetchReferenceLinkCampaign_(body.rel_id));
  } else {
    dispatch(errorTask(message));
  }
};

export const fetchReferenceLinkCampaign_ = (id) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await fetchReferenceLink(id);

  if (success) {
    dispatch(successRefLinkListCampaign(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestDestroyRefLinkCampaign_ =
  (id, rel_id) => async (dispatch) => {
    dispatch(initTask());
    const item = [];
    item.push({
      ids: id,
    });
    const { success, message } = await requestDestroyRefLink(item[0]);
    if (success) {
      dispatch(successRefLinkListCampaignDelete(item[0]));
      dispatch(fetchReferenceLinkCampaign_(rel_id));
    } else {
      dispatch(errorTask(message));
    }
  };

export const getSubtasksList = (id) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestFetchSubTask(id);

  if (success) {
    dispatch(successSubtask(data.data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestDestroySubtask_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestDestroySubtask(body.id);
  if (success) {
    dispatch(successSubtaskDelete(data));
    dispatch(taskComment('task_comment', { taskId: body.task_id }));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestAddSubtask_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestAddSubtask(body);

  if (success) {
    dispatch(successAddSubtask(data));
    dispatch(taskComment('task_comment', { taskId: body.task_id }));
  } else {
    dispatch(errorTask(message));
  }
};

export const getRevisionsList = (rel_id, page, limit) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestFetchRevisionList(
    rel_id,
    page,
    limit
  );
  if (success) {
    dispatch(successRevisionListTab(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestDeleteRevision_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestDeleteRevision(body);
  if (success) {
    dispatch(getRevisionsList(body.rel_id, 1, 10));
    dispatch(successRevisionListTab(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const addChecklistRevision = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestChecklistRevision(body);
  if (success) {
    // dispatch(getRevisionsList(body.rel_id, 1, 10));
    dispatch(successRevisionListTab(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const addSubtaskRevision = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestAddSubtaskRevision(body);
  if (success) {
    dispatch(successRevisionAddSubtask(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestResolvedRevision_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const itemRevision = [];
  itemRevision.push({
    id: body.id,
  });

  const { success, message } = await requestResolvedRevisionV2(itemRevision[0]);

  if (success) {
    dispatch(successRevisionResolved(success));
    dispatch(requestFetchRevision_(body.task_id, 1, 1000));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestFetchRevision_ = (id) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestFetchRevisionList(
    id,
    1,
    1000
  );

  if (success) {
    dispatch(successRevisionList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestAddRevision_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestAddRevisionV2(body);

  if (success) {
    dispatch(successRevisionList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestUpdateRevision_ = (body) => async (dispatch) => {
  dispatch(initTask());

  const { success, data, message } = await requestUpdateRevisionV2(body);

  if (success) {
    dispatch(successRevisionList(data));
  } else {
    dispatch(errorTask(message));
  }
};

export const requestDestroyRevision_ = (body) => async (dispatch) => {
  dispatch(initTask());
  const { success, data, message } = await requestDestroyRevision(body);

  if (success) {
    dispatch(successRevisionList(data));
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

export const getPricingCSV = (briefId) => async () => {
  await requestPricingCSV(briefId).then((response) => {
    const blob = new Blob([response]);
    const date = new Date();

    FileSaver.saveAs(blob, `brief_pricing_${date.toLocaleString('en-CA')}.csv`);
  });
};
