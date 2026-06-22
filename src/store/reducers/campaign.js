// Redux
import { createSlice } from '@reduxjs/toolkit';

import {
  requestCampaignOverview,
  requestCampaignTasks,
  requestMilestoneStart,
  requestMilestoneTemplates,
  requestMilestoneUpdate,
  requestMilestoneTemplatesPublic,
  requestMilestoneCSV,
  requestMilestoneLogMonitoring,
} from 'services/api/campaign';
import FileSaver from 'file-saver';

const initialState = {
  overview: {},
  tasks: [],
  fetchCampaignOverview: false,
  fetchCampaignTasks: false,
  errorCampaignOverview: null,
  errorCampaignTasks: [],
  milestone: { templates: [], logs: [] },
  fetchMilestoneTemplates: false,
  errorMilestoneTemplates: null,
  fetchMilestoneLogs: false,
  errorMilestoneLogs: null,
};

const campaign = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    // Overview
    initCampaignOverview: (state) => {
      state.fetchCampaignOverview = true;
      state.errorCampaignOverview = null;
    },
    successCampaignOverview: (state, { payload }) => {
      state.overview = payload;
      state.fetchCampaignOverview = false;
      state.errorCampaignOverview = null;
    },
    errorCampaignOverview: (state, { payload }) => {
      state.fetchCampaignOverview = false;
      state.errorCampaignOverview = { message: payload };
    },
    // Campaign Tasks
    initCampaignTasks: (state) => {
      state.fetchCampaignTasks = true;
      state.errorCampaignTasks = null;
    },
    successCampaignTasks: (state, { payload }) => {
      state.tasks = payload;
      state.fetchCampaignTasks = false;
      state.errorCampaignTasks = null;
    },
    successCampaignUpdateKey: (state, { payload }) => {
      const {
        params1: { id, key, value },
        params2: { data },
        response, // api response
      } = payload;

      switch (key) {
        case 'task_status':
          return {
            ...state,
            tasks: state.tasks.map((task) =>
              task?.id === id // For campaign task
                ? {
                    ...task,
                    status_name: data,
                    status_id: value,
                  }
                : task.subtasks.map((t) => t.id).includes(id) // For campaign subtask
                ? {
                    ...task,
                    subtasks: task.subtasks.map((subtask) =>
                      subtask.id === id
                        ? {
                            ...subtask,
                            status_name: data,
                            status_id: value,
                          }
                        : subtask
                    ),
                  }
                : task
            ),
          };

        case 'task_due_date':
          return {
            ...state,
            tasks: state.tasks.map((task) =>
              task?.id === id // For campaign task
                ? {
                    ...task,
                    due_date: response.due_date,
                  }
                : task.subtasks.map((t) => t.id).includes(id) // For campaign subtask
                ? {
                    ...task,
                    subtasks: task.subtasks.map((subtask) =>
                      subtask.id === id
                        ? {
                            ...subtask,
                            due_date: response.due_date,
                          }
                        : subtask
                    ),
                  }
                : task
            ),
          };

        case 'task_delivery_date':
          return {
            ...state,
            tasks: state.tasks.map((task) =>
              task?.id === id // For campaign task
                ? {
                    ...task,
                    delivery_date: response.delivery_date,
                  }
                : task.subtasks.map((t) => t.id).includes(id) // For campaign subtask
                ? {
                    ...task,
                    subtasks: task.subtasks.map((subtask) =>
                      subtask.id === id
                        ? {
                            ...subtask,
                            delivery_date: response.delivery_date,
                          }
                        : subtask
                    ),
                  }
                : task
            ),
          };

        case 'task_assignees':
          return {
            ...state,
            tasks: state.tasks.map((task) =>
              task?.id === id // For campaign task
                ? {
                    ...task,
                    assignees: data,
                  }
                : task.subtasks.map((t) => t.id).includes(id) // For campaign subtask
                ? {
                    ...task,
                    subtasks: task.subtasks.map((subtask) =>
                      subtask.id === id
                        ? {
                            ...subtask,
                            assignees: data,
                          }
                        : subtask
                    ),
                  }
                : task
            ),
          };
        default:
          break;
      }
    },
    errorCampaignTasks: (state, { payload }) => {
      state.fetchCampaignTasks = false;
      state.errorCampaignTasks = { message: payload };
    },
    // Milestones
    initMilestoneTemplates: (state) => {
      state.fetchMilestoneTemplates = true;
      state.errorMilestoneTemplates = null;
    },
    successMilestoneTemplates: (state, { payload }) => {
      state.milestone.templates = payload;
      state.fetchMilestoneTemplates = false;
      state.errorMilestoneTemplates = null;
    },
    errorMilestoneTemplates: (state, { payload }) => {
      state.milestone.templates = payload;
      state.fetchMilestoneTemplates = false;
      state.errorMilestoneTemplates = null;
    },
    errorStartMilestoneTemplates: (state) => {
      state.fetchMilestoneTemplates = false;
      state.errorMilestoneTemplates = null;
    },
    // Milestone Logs
    initMilestoneLogs: (state) => {
      state.fetchMilestoneLogs = true;
      state.errorMilestoneLogs = null;
    },
    successMilestoneLogs: (state, { payload }) => {
      state.milestone.logs = payload;
      state.fetchMilestoneLogs = false;
      state.errorMilestoneLogs = null;
    },
    errorMilestoneLogs: (state, { payload }) => {
      state.milestone.logs = [];
      state.fetchMilestoneLogs = false;
      state.errorMilestoneLogs = payload;
    },
  },
});

export const {
  initCampaignOverview,
  successCampaignOverview,
  errorCampaignOverview,
  initCampaignTasks,
  successCampaignTasks,
  errorCampaignTasks,
  initMilestoneTemplates,
  successMilestoneTemplates,
  errorMilestoneTemplates,
  errorStartMilestoneTemplates,
  successCampaignUpdateKey,
  initMilestoneLogs,
  successMilestoneLogs,
  errorMilestoneLogs,
} = campaign.actions;

export const getCampaignOverview = (campaignId) => async (dispatch) => {
  dispatch(initCampaignOverview());

  const { success, data, message } = await requestCampaignOverview(campaignId);

  success
    ? dispatch(successCampaignOverview(data))
    : dispatch(errorCampaignOverview(message));
};

export const getCampaignTask = (campaignId) => async (dispatch) => {
  dispatch(initCampaignTasks());

  const { success, data, message } = await requestCampaignTasks(campaignId);

  success
    ? dispatch(successCampaignTasks(data))
    : dispatch(errorCampaignTasks(message));
};

export const startMilestone = (params) => async (dispatch) => {
  dispatch(initMilestoneTemplates());
  const { success, error } = await requestMilestoneStart(params);

  return success || error;
};

export const updateMilestone = (params) => async () =>
  await requestMilestoneUpdate(params);

export const getMilestoneTemplates =
  (campaignId, shouldDisplayLoader = true) =>
  async (dispatch) => {
    shouldDisplayLoader && dispatch(initMilestoneTemplates());

    const { success, message, data } = await requestMilestoneTemplates(
      campaignId
    );

    success
      ? dispatch(successMilestoneTemplates(data))
      : dispatch(errorMilestoneTemplates(message));
  };

export const getMilestoneTemplatesPublic = (campaignId) => async (dispatch) => {
  dispatch(initMilestoneTemplates());

  const { success, message, data } = await requestMilestoneTemplatesPublic(
    campaignId
  );

  success
    ? dispatch(successMilestoneTemplates(data))
    : dispatch(errorMilestoneTemplates(message));
};

export const updateMilestoneOriginalTimeline =
  (campaignId, channelId) => async () => {
    const response = await requestMilestoneTemplates(campaignId, channelId);
    return response;
  };

export const getMilestoneCSV =
  (campaignId, partnerName, conceptName) => async () => {
    await requestMilestoneCSV(campaignId).then((response) => {
      const blob = new Blob([response]);
      FileSaver.saveAs(blob, `${partnerName}-${conceptName}-Milestones.xlsx`);
    });
  };

export const getMilestoneLogMonitoring = (campaignId) => async (dispatch) => {
  dispatch(initMilestoneLogs());

  const { success, message, data } = await requestMilestoneLogMonitoring(
    campaignId
  );

  success
    ? dispatch(successMilestoneLogs(data))
    : dispatch(errorMilestoneLogs(message));
};

export default campaign.reducer;
