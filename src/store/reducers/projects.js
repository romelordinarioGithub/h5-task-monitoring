import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import FileSaver from 'file-saver';

import {
  requestCampaignList,
  requestConceptList,
  requestConceptOverview,
  requestConceptTasks,
  requestReferenceLinks,
  requestAddReferenceLink,
  requestSyncCampaign,
  requestSyncConcept,
  requestDeleteReferenceLink,
  requestUpdateReferenceLink,
  requestMilestoneTemplates,
  requestMilestoneUpdate,
  requestMilestoneStart,
  requestMilestoneTemplatesPublic,
  requestMilestoneCSV,
  requestMilestoneLogs,
  requestNotesUpdate,
  requestMilestoneOriginalTimeline,
  requestAddCustomCampaign,
  requestReferenceLinkTaskList,
  requestBulkUpdateReferenceLink,
  requestReferenceLinksLogs,
} from 'services/api/projects';

import { requestCampaignTasks } from 'services/api/campaign';

import { requestPartners } from 'services/api/partner';

import { requestUsers } from 'services/api/user';

import { requestStatus } from 'services/api/status';

import { requestUpdateKey } from 'services/api/updateKey';
import { requestUpdateTaskByKey } from 'services/api/tasks';
import { successCampaignUpdateKey } from './campaign';

import { formatDate } from 'utils/date';

const initialState = {
  conceptList: {},
  fetchConceptList: false,
  errorConceptList: null,
  conceptOverview: {},
  fetchConceptOverview: false,
  errorConceptOverview: null,
  campaignList: {},
  fetchCampaignList: false,
  errorCampaignList: null,
  conceptTaskList: {
    googleDisplay: [],
    googleVideo: [],
    metaStatic: [],
    metaVideo: [],
    youtubeVideo: [],
  },
  fetchConceptTaskList: false,
  errorConceptTaskList: null,
  fetchUpdateConceptList: false,
  fetchUpdateCampaignList: false,
  milestone: { templates: [], logs: [] },
  fetchMilestoneTemplates: false,
  errorMilestoneTemplates: null,
  fetchMilestoneLogs: false,
  errorMilestoneLogs: null,
  referenceLinks: {},
  fetchReferenceLinks: false,
  errorReferenceLinks: null,
  referenceLinksLogs: [],
  fetchReferenceLinkLogs: false,
  errorReferenceLinksLogs: null,
  syncCampaign: {},
  fetchSyncCampaign: false,
  errorSyncCampaign: null,
  syncConcept: {},
  fetchSyncConcept: false,
  errorSyncConcept: null,
  partners: [],
  fetchPartners: false,
  errorPartners: null,
  members: {},
  fetchMembers: false,
  errorMembers: null,
  statuses: [],
  fetchStatuses: false,
  errorStatuses: null,
  fetchCampaignTask: false,
  errorCampaignTask: null,
  fetchChannelTask: false,
  errorChannelTask: null,
  tags: [],
  fetchTags: false,
  errorTags: null,
  fetchUpdateKey: false,
  errorUpdateKey: null,
  isNotify: false,
  notification: {
    message: null,
    type: null,
  },
  addReferenceLink: false,
  errorAddReferenceLink: null,
  deleteReferenceLink: false,
  errorDeleteReferenceLink: null,
  updateReferenceLink: false,
  errorUpdateReferenceLink: null,
  inputDatasources: { parentTasks: [], subTasks: [] },
  fetchInputDatasources: false,
  errorInputDatasources: null,
  saveCampaign: {
    success: false,
    processing: false,
    error: null,
  },
};

const projects = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    initConceptList: (state) => {
      state.fetchConceptList = true;
      state.errorConceptList = null;
    },
    successConceptList: (state, { payload }) => {
      state.conceptList = payload;
      state.fetchConceptList = false;
      state.errorConceptList = null;
    },
    errorConceptList: (state, { payload }) => {
      state.fetchConceptList = false;
      state.errorConceptList = { message: payload };
    },
    initConceptOverview: (state) => {
      state.fetchConceptOverview = true;
      state.errorConceptOverview = null;
    },
    successConceptOverview: (state, { payload }) => {
      state.conceptOverview = payload;
      state.fetchConceptOverview = false;
      state.errorConceptOverview = null;
    },
    errorConceptOverview: (state, { payload }) => {
      state.fetchConceptOverview = false;
      state.errorConceptOverview = { message: payload };
    },
    initCampaignList: (state) => {
      state.fetchCampaignList = true;
      state.errorCampaignList = null;
    },
    successCampaignList: (state, { payload }) => {
      state.campaignList = payload;
      state.fetchCampaignList = false;
      state.errorCampaignList = null;
    },
    errorCampaignList: (state, { payload }) => {
      state.fetchCampaignList = false;
      state.errorCampaignList = { message: payload };
    },
    initConceptTaskList: (state) => {
      state.fetchConceptTaskList = true;
      state.errorConceptTaskList = null;
    },
    initChannelList: (state) => {
      state.fetchChannelTask = true;
      state.errorChannelTask = null;
    },
    successConceptTaskList: (state, { payload }) => {
      state.conceptTaskList[payload.type] = payload.data;
      state.fetchConceptTaskList = false;
      state.errorConceptTaskList = null;
      state.fetchChannelTask = false;
      state.errorChannelTask = null;
    },
    resetConceptTaskList: (state) => {
      state.conceptTaskList = {
        googleDisplay: [],
        googleVideo: [],
        metaStatic: [],
        metaVideo: [],
        youtubeVideo: [],
      };
      state.fetchConceptTaskList = false;
      state.errorConceptTaskList = null;
      state.fetchChannelTask = false;
      state.errorChannelTask = null;
    },
    errorConceptTaskList: (state, { payload }) => {
      state.fetchConceptTaskList = false;
      state.errorConceptTaskList = { message: payload };
      state.fetchChannelTask = false;
      state.errorChannelTask = { message: payload };
    },
    initUpdateConceptList: (state) => {
      state.fetchUpdateConceptList = true;
    },
    successUpdateConceptList: (state, { payload }) => {
      state.fetchUpdateConceptList = false;
      state.conceptList = {
        ...payload,
        data: [...state.conceptList.data, ...payload.data],
      };
      state.errorConceptList = null;
    },
    errorUpdateConceptList: (state, { payload }) => {
      state.fetchUpdateConceptList = false;
      state.errorConceptList = { message: payload };
    },
    initUpdateCampaignList: (state) => {
      state.fetchUpdateCampaignList = true;
      state.errorCampaignList = null;
    },
    successUpdateCampaignList: (state, { payload }) => {
      state.fetchUpdateCampaignList = false;
      state.campaignList = {
        ...payload,
        data: [...state.campaignList.data, ...payload.data],
      };
      state.errorCampaignList = null;
    },
    successSortCampaignList: (state, { payload }) => {
      state.fetchUpdateCampaignList = false;
      state.campaignList = payload;
      state.errorCampaignList = null;
    },
    errorUpdateCampaignList: (state, { payload }) => {
      state.fetchUpdateCampaignList = false;
      state.errorCampaignList = { message: payload };
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
    // Milestones Logs
    initMilestoneLogs: (state) => {
      state.fetchMilestoneLogs = true;
      state.errorMilestoneTemplates = null;
    },
    successMilestoneLogs: (state, { payload }) => {
      state.milestone.logs = payload;
      state.fetchMilestoneLogs = false;
      state.errorMilestoneLogs = null;
    },
    successPaginatedMilestoneLogs: (state, { payload }) => {
      state.milestone.logs = {
        ...payload,
        data: [...state.milestone.logs.data, ...payload.data],
      };
      state.fetchMilestoneLogs = false;
      state.errorMilestoneLogs = null;
    },
    errorMilestoneLogs: (state, { payload }) => {
      state.milestone.logs = payload;
      state.fetchMilestoneLogs = false;
      state.errorMilestoneLogs = null;
    },
    // Reference Links
    initReferenceLinks: (state) => {
      state.fetchReferenceLinks = true;
      state.errorReferenceLinks = null;
    },
    successReferenceLinks: (state, { payload }) => {
      state.referenceLinks = payload;
      state.fetchReferenceLinks = false;
      state.errorReferenceLinks = null;
    },
    errorReferenceLinks: (state, { payload }) => {
      state.fetchReferenceLinks = false;
      state.errorReferenceLinks = { message: payload };
    },
    resetReferenceLinks: (state) => {
      state.referenceLinks = initialState.referenceLinks;
    },
    initReferenceLinksLogs: (state) => {
      state.fetchReferenceLinkLogs = true;
      state.errorReferenceLinksLogs = null;
    },
    successReferenceLinksLogs: (state, { payload }) => {
      state.referenceLinksLogs = payload;
      state.fetchReferenceLinkLogs = false;
      state.errorReferenceLinksLogs = null;
    },
    errorReferenceLinksLogs: (state, { payload }) => {
      state.fetchReferenceLinksLogs = false;
      state.errorReferenceLinksLogs = { message: payload };
    },
    initSyncCampaign: (state) => {
      state.fetchSyncCampaign = true;
      state.errorSyncCampaign = null;
    },
    successSyncCampaign: (state, { payload }) => {
      state.syncCampaign = payload;
      state.fetchSyncCampaign = false;
      state.errorSyncCampaign = null;
      state.isNotify = true;
      state.notification.message = _.isEmpty(payload?.created)
        ? `No new campaign created for this concept.`
        : `Found ${payload?.created} new campaign/s.`;
      state.notification.type = 'success';
    },
    errorSyncCampaign: (state, { payload }) => {
      state.fetchSyncCampaign = false;
      state.errorSyncCampaign = { message: payload };
      state.isNotify = true;
      state.notification.message =
        'Something went wrong while pulling the campaigns in the platform.';
      state.notification.type = 'error';
    },
    initSyncConcept: (state) => {
      state.fetchSyncConcept = true;
      state.errorSyncConcept = null;
    },
    successSyncConcept: (state, { payload }) => {
      state.syncConcept = payload;
      state.fetchSyncConcept = false;
      state.errorSyncConcept = null;
      state.isNotify = true;
      state.notification.message = _.isEmpty(payload?.created)
        ? `No new concept created for this partner.`
        : `Added ${payload?.created} in the concept list.`;
      state.notification.type = 'success';
    },
    errorSyncConcept: (state, { payload }) => {
      state.fetchSyncConcept = false;
      state.errorSyncConcept = { message: payload };
      state.isNotify = true;
      state.notification.message =
        'Something went wrong while pulling the concepts in the platform.';
      state.notification.type = 'error';
    },
    initPartners: (state) => {
      state.fetchPartners = true;
      state.errorPartners = null;
    },
    successPartners: (state, { payload }) => {
      state.partners = payload;
      state.fetchPartners = false;
      state.errorPartners = null;
    },
    errorPartners: (state, { payload }) => {
      state.fetchPartners = false;
      state.errorPartners = { message: payload };
    },
    initMembers: (state) => {
      state.fetchMembers = true;
      state.errorMembers = null;
    },
    successMembers: (state, { payload }) => {
      state.members = payload;
      state.fetchMembers = false;
      state.errorMembers = null;
    },
    errorMembers: (state, { payload }) => {
      state.fetchMembers = false;
      state.errorMembers = { message: payload };
    },
    initStatus: (state) => {
      state.fetchStatuses = true;
      state.errorStatuses = null;
    },
    successStatus: (state, { payload }) => {
      state.statuses = payload;
      state.fetchStatuses = false;
      state.errorStatuses = null;
    },
    errorStatus: (state, { payload }) => {
      state.fetchStatuses = false;
      state.errorStatuses = { message: payload };
    },
    initCampaignTask: (state) => {
      state.fetchCampaignTask = true;
      state.errorCampaignTask = null;
    },
    successCampaignTask: (state, { payload }) => {
      return {
        ...state,
        fetchCampaignTask: false,
        errorCampaignTask: null,
        campaignList: {
          ...state?.campaignList,
          data: state?.campaignList?.data?.map((campaign) =>
            campaign?.id === payload?.campaignId
              ? {
                  ...campaign,
                  tasks: payload?.data,
                }
              : campaign
          ),
        },
      };
    },
    initSaveCampaign: (state) => {
      state.saveCampaign.success = false;
      state.saveCampaign.processing = true;
    },
    successSaveCampaign: (state) => {
      state.saveCampaign.success = true;
      state.saveCampaign.processing = false;
    },
    errorSaveCampaign: (state, { payload }) => {
      state.saveCampaign.success = false;
      state.saveCampaign.processing = false;
      state.saveCampaign.error = payload;
    },
    errorCampaignTask: (state, { payload }) => {
      state.fetchCampaignTask = false;
      state.errorCampaignTask = { message: payload };
    },
    initUpdateKey: (state) => {
      state.fetchUpdateKey = true;
      state.errorUpdateKey = null;
    },
    successUpdateKey: (state, { payload }) => {
      const {
        params1: { id, key, value },
        params2: { data, parent_id, channel },
        response, // api response
      } = payload;

      switch (key) {
        case 'concept_status':
          return {
            ...state,
            fetchUpdateKey: false,
            errorUpdateKey: null,
            conceptList: {
              ...state.conceptList,
              data: state?.conceptList?.data?.map((concept) =>
                concept?.uuid === id
                  ? {
                      ...concept,
                      status: data,
                    }
                  : concept
              ),
            },
            conceptOverview: {
              ...state.conceptOverview,
              status: data,
              status_id: value,
            },
          };

        case 'campaign_status':
          return {
            // campaign
            ...state,
            fetchUpdateKey: false,
            errorUpdateKey: null,
            campaignList: {
              ...state?.campaignList,
              data: state?.campaignList?.data?.map((campaign) =>
                campaign?.id === id
                  ? {
                      ...campaign,
                      status: data,
                      status_id: value,
                    }
                  : campaign
              ),
            },
          };

        case 'campaign_followers':
          return {
            ...state,
            fetchUpdateKey: false,
            errorUpdateKey: null,
            campaignList: {
              ...state?.campaignList,
              data: state?.campaignList?.data?.map((campaign) =>
                campaign?.id === id
                  ? {
                      ...campaign,
                      followers: response,
                    }
                  : campaign
              ),
            },
          };

        case 'campaign_delivery_date':
          return {
            ...state,
            fetchUpdateKey: false,
            errorUpdateKey: null,
            campaignList: {
              ...state?.campaignList,
              data: state?.campaignList?.data?.map((campaign) =>
                campaign?.id === id
                  ? {
                      ...campaign,
                      delivery_date: response,
                    }
                  : campaign
              ),
            },
          };

        case 'campaign_launch_date':
          return {
            ...state,
            fetchUpdateKey: false,
            errorUpdateKey: null,
            campaignList: {
              ...state?.campaignList,
              data: state?.campaignList?.data?.map((campaign) =>
                campaign?.id === id
                  ? {
                      ...campaign,
                      launch_date: response,
                    }
                  : campaign
              ),
            },
          };

        case 'task_status':
          return _.isNull(parent_id)
            ? {
                ...state,
                conceptTaskList: {
                  ...state?.conceptTaskList,
                  [channel]: state?.conceptTaskList[channel]?.map((task) =>
                    task?.id === id
                      ? {
                          ...task,
                          status_name: data,
                          status_id: value,
                        }
                      : task
                  ),
                },
              }
            : {
                ...state,
                conceptTaskList: {
                  ...state?.conceptTaskList,
                  [channel]: state?.conceptTaskList[channel]?.map((task) =>
                    task?.id === parent_id
                      ? {
                          ...task,
                          subtasks: task.subtasks?.map((subtask) =>
                            subtask?.id === id
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
                },
                campaignList: {
                  ...state?.campaignList,
                  data: state?.campaignList?.data?.map((campaign) =>
                    campaign?.id === parent_id ||
                    campaign.tasks.map((c) => c.id).includes(parent_id) // Added for campaign subtask id
                      ? {
                          ...campaign,
                          tasks: campaign.tasks?.map((task) =>
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
                        }
                      : campaign
                  ),
                },
              };

        case 'task_due_date':
          return _.isNull(parent_id) // task
            ? {
                ...state,
                conceptTaskList: {
                  ...state?.conceptTaskList,
                  [channel]: state?.conceptTaskList[channel]?.map((task) =>
                    task?.id === id
                      ? {
                          ...task,
                          due_date: response.due_date,
                        }
                      : task
                  ),
                },
              }
            : {
                ...state,
                conceptTaskList: {
                  ...state?.conceptTaskList,
                  [channel]: state?.conceptTaskList[channel]?.map((task) =>
                    task?.id === parent_id
                      ? {
                          ...task,
                          subtasks: task.subtasks?.map((subtask) =>
                            subtask?.id === id
                              ? {
                                  ...subtask,
                                  due_date: response.due_date,
                                }
                              : subtask
                          ),
                        }
                      : task
                  ),
                },
                campaignList: {
                  ...state?.campaignList,
                  data: state?.campaignList?.data?.map((campaign) =>
                    campaign?.id === parent_id ||
                    campaign.tasks.map((c) => c.id).includes(parent_id) // Added for campaign subtask id
                      ? {
                          ...campaign,
                          tasks: campaign.tasks?.map((task) =>
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
                        }
                      : campaign
                  ),
                },
              };

        case 'task_delivery_date':
          return _.isNull(parent_id)
            ? {
                ...state,
                conceptTaskList: {
                  ...state?.conceptTaskList,
                  [channel]: state?.conceptTaskList[channel]?.map((task) =>
                    task?.id === id
                      ? {
                          ...task,
                          delivery_date: response.delivery_date,
                        }
                      : task
                  ),
                },
              }
            : {
                ...state,
                conceptTaskList: {
                  ...state?.conceptTaskList,
                  [channel]: state?.conceptTaskList[channel]?.map((task) =>
                    task?.id === parent_id
                      ? {
                          ...task,
                          subtasks: task.subtasks?.map((subtask) =>
                            subtask?.id === id
                              ? {
                                  ...subtask,
                                  delivery_date: response.delivery_date,
                                }
                              : subtask
                          ),
                        }
                      : task
                  ),
                },
                campaignList: {
                  ...state?.campaignList,
                  data: state?.campaignList?.data?.map((campaign) =>
                    campaign?.id === parent_id ||
                    campaign.tasks.map((c) => c.id).includes(parent_id) // Added for campaign subtask id
                      ? {
                          ...campaign,
                          tasks: campaign.tasks?.map((task) =>
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
                        }
                      : campaign
                  ),
                },
              };

        case 'task_assignees':
          return _.isNull(parent_id)
            ? {
                ...state,
                conceptTaskList: {
                  ...state?.conceptTaskList,
                  [channel]: state?.conceptTaskList[channel]?.map((task) =>
                    task?.id === id
                      ? {
                          ...task,
                          assignees: response,
                        }
                      : task
                  ),
                },
              }
            : {
                ...state,
                conceptTaskList: {
                  ...state?.conceptTaskList,
                  [channel]: state?.conceptTaskList[channel]?.map((task) =>
                    task?.id === parent_id
                      ? {
                          ...task,
                          subtasks: task.subtasks?.map((subtask) =>
                            subtask?.id === id
                              ? {
                                  ...subtask,
                                  assignees: response,
                                }
                              : subtask
                          ),
                        }
                      : task
                  ),
                },
                campaignList: {
                  ...state?.campaignList,
                  data: state?.campaignList?.data?.map((campaign) =>
                    campaign?.id === parent_id ||
                    campaign.tasks.map((c) => c.id).includes(parent_id) // Added for campaign subtask id
                      ? {
                          ...campaign,
                          tasks: campaign.tasks?.map((task) =>
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
                        }
                      : campaign
                  ),
                },
              };

        case 'task_watchers':
          return _.isNull(parent_id)
            ? {
                ...state,
                conceptTaskList: {
                  ...state?.conceptTaskList,
                  [channel]: state?.conceptTaskList[channel]?.map((task) =>
                    task?.id === id
                      ? {
                          ...task,
                          watchers: response,
                        }
                      : task
                  ),
                },
              }
            : {
                ...state,
                conceptTaskList: {
                  ...state?.conceptTaskList,
                  [channel]: state?.conceptTaskList[channel]?.map((task) =>
                    task?.id === parent_id
                      ? {
                          ...task,
                          subtasks: task.subtasks?.map((subtask) =>
                            subtask?.id === id
                              ? {
                                  ...subtask,
                                  watchers: response,
                                }
                              : subtask
                          ),
                        }
                      : task
                  ),
                },
                campaignList: {
                  ...state?.campaignList,
                  data: state?.campaignList?.data?.map((campaign) =>
                    campaign?.id === parent_id
                      ? {
                          ...campaign,
                          tasks: campaign.tasks?.map((task) =>
                            task?.id === id
                              ? {
                                  ...task,
                                  followers: response,
                                }
                              : task
                          ),
                        }
                      : campaign
                  ),
                },
              };

        default:
          break;
      }
    },
    errorUpdateKey: (state, { payload }) => {
      state.fetchUpdateKey = false;
      state.errorUpdateKey = { message: payload };
    },
    resetNotification: (state) => {
      state.isNotify = false;
    },
    initAddReferenceLink: (state) => {
      state.addReferenceLink = true;
      state.errorAddReferenceLink = null;
    },
    successAddReferenceLink: (state) => {
      state.addReferenceLink = false;
      state.errorAddReferenceLink = null;
    },
    errorAddReferenceLink: (state, { payload }) => {
      state.errorAddReferenceLink = { message: payload };
    },
    initDeleteReferenceLink: (state) => {
      state.deleteReferenceLink = true;
      state.errorDeleteReferenceLink = null;
    },
    successDeleteReferenceLink: (state) => {
      state.deleteReferenceLink = false;
      state.errorDeleteReferenceLink = null;
    },
    errorDeleteReferenceLink: (state, { payload }) => {
      state.errorDeleteReferenceLink = { message: payload };
    },
    initUpdateReferenceLink: (state) => {
      state.updateReferenceLink = true;
      state.errorUpdateReferenceLink = null;
    },
    successUpdateReferenceLink: (state) => {
      state.updateReferenceLink = false;
      state.errorUpdateReferenceLink = null;
    },
    errorUpdateReferenceLink: (state, { payload }) => {
      state.errorUpdateReferenceLink = { message: payload };
    },
    initInputDatasources: (state) => {
      state.fetchInputDatasources = true;
    },
    successInputDatasources: (state, { payload }) => {
      state.fetchInputDatasources = false;
      state.errorInputDatasources = null;
      state.inputDatasources = {
        parentTasks: payload.taskTypes.data ?? [],
        subTasks: payload.taskCategories.data ?? [],
      };
    },
    errorInputDatasources: (state, { payload }) => {
      state.fetchInputDatasources = false;
      state.errorInputDatasources = { message: payload };
    },
  },
});

export const {
  initConceptList,
  successConceptList,
  errorConceptList,
  initConceptOverview,
  successConceptOverview,
  errorConceptOverview,
  initCampaignList,
  successCampaignList,
  errorCampaignList,
  initConceptTaskList,
  successConceptTaskList,
  errorConceptTaskList,
  initUpdateConceptList,
  successUpdateConceptList,
  errorUpdateConceptList,
  initUpdateCampaignList,
  successUpdateCampaignList,
  successSortCampaignList,
  errorUpdateCampaignList,
  initReferenceLinks,
  successReferenceLinks,
  errorReferenceLinks,
  resetReferenceLinks,
  initReferenceLinksLogs,
  successReferenceLinksLogs,
  errorReferenceLinksLogs,
  initSyncCampaign,
  successSyncCampaign,
  errorSyncCampaign,
  initSyncConcept,
  successSyncConcept,
  errorSyncConcept,
  initPartners,
  successPartners,
  errorPartners,
  initMembers,
  successMembers,
  errorMembers,
  initStatus,
  successStatus,
  errorStatus,
  initCampaignTask,
  successCampaignTask,
  errorCampaignTask,
  initChannelList,
  initUpdateKey,
  successUpdateKey,
  errorUpdateKey,
  resetNotification,
  initAddReferenceLink,
  successAddReferenceLink,
  errorAddReferenceLink,
  initDeleteReferenceLink,
  successDeleteReferenceLink,
  errorDeleteReferenceLink,
  initUpdateReferenceLink,
  successUpdateReferenceLink,
  errorUpdateReferenceLink,
  initInputDatasources,
  successInputDatasources,
  errorInputDatasources,
  initMilestoneTemplates,
  successMilestoneTemplates,
  errorMilestoneTemplates,
  errorStartMilestoneTemplates,
  initMilestoneLogs,
  successMilestoneLogs,
  successPaginatedMilestoneLogs,
  errorMilestoneLogs,
  resetConceptTaskList,
  initSaveCampaign,
  successSaveCampaign,
  errorSaveCampaign,
} = projects.actions;

export const getConceptList =
  (params = {}, page = 1, limit = 30) =>
  async (dispatch) => {
    dispatch(initConceptList());

    const { success, message, data } = await requestConceptList(
      page,
      params,
      limit
    );

    success
      ? dispatch(successConceptList(data))
      : dispatch(errorConceptList(message));
  };

export const getConceptOverview =
  (params = {}, sortCampaign, orderCampaign, isCampaignPath) =>
  async (dispatch) => {
    dispatch(initConceptOverview());

    const { success, message, data } = await requestConceptOverview(params);

    if (success) {
      dispatch(successConceptOverview(data));
      !isCampaignPath &&
        dispatch(
          getCampaignList(params?.conceptId, sortCampaign, orderCampaign)
        );

      const channelId =
        data?.brief?.channels?.google?.display === true
          ? 1
          : data?.brief?.channels?.google?.video === true
          ? 2
          : data?.brief?.channels?.facebook?.static === true
          ? 3
          : data?.brief?.channels?.facebook?.video === true
          ? 4
          : 5;

      !isCampaignPath && dispatch(getConceptTask(params?.conceptId, channelId));
    } else {
      dispatch(errorConceptOverview(message));
    }
  };

export const getCampaignList =
  (conceptId, sort, order, page = 1) =>
  async (dispatch) => {
    dispatch(initCampaignList());
    const { success, message, data } = await requestCampaignList(
      conceptId,
      page,
      sort,
      order
    );
    success
      ? dispatch(successCampaignList(data))
      : dispatch(errorCampaignList(message));
  };

export const getConceptTask = (conceptId, channelId) => async (dispatch) => {
  dispatch(initConceptTaskList());

  const { success, message, data } = await requestConceptTasks(
    conceptId,
    channelId
  );

  const channel =
    channelId === 1
      ? 'googleDisplay'
      : channelId === 2
      ? 'googleVideo'
      : channelId === 3
      ? 'metaStatic'
      : channelId === 4
      ? 'metaVideo'
      : 'youtubeVideo';

  success
    ? dispatch(successConceptTaskList({ type: channel, data }))
    : dispatch(errorConceptTaskList(message));
};

export const updateConceptList = (page, params) => async (dispatch) => {
  dispatch(initUpdateConceptList());

  const { success, message, data } = await requestConceptList(page, params);

  success
    ? dispatch(successUpdateConceptList(data))
    : dispatch(errorUpdateConceptList(message));
};

export const updateCampaignList =
  (conceptId, page, sort, order, limit) => async (dispatch) => {
    dispatch(initUpdateCampaignList());
    const { success, message, data } = await requestCampaignList(
      conceptId,
      page,
      sort,
      order,
      limit
    );

    success
      ? dispatch(successUpdateCampaignList(data))
      : dispatch(errorUpdateCampaignList(message));
  };

export const sortCampaignList =
  (conceptId, page, sort, order, limit) => async (dispatch) => {
    dispatch(initUpdateCampaignList());

    const { success, message, data } = await requestCampaignList(
      conceptId,
      page,
      sort,
      order,
      limit
    );

    success
      ? dispatch(successSortCampaignList(data))
      : dispatch(errorUpdateCampaignList(message));
  };

export const getReferences =
  (conceptId, page = 1, limit = 10, params) =>
  async (dispatch) => {
    dispatch(initReferenceLinks());

    const { success, message, data } = await requestReferenceLinks(
      conceptId,
      page,
      limit,
      params
    );

    success
      ? dispatch(successReferenceLinks(data))
      : dispatch(errorReferenceLinks(message));
  };

export const getReferencesLinksLogs = (id) => async (dispatch) => {
  dispatch(initReferenceLinksLogs());

  const { success, message, data } = await requestReferenceLinksLogs(id);

  success
    ? dispatch(successReferenceLinksLogs(data))
    : dispatch(errorReferenceLinksLogs(message));
};

export const getNewCampaigns = (conceptId, sort, order) => async (dispatch) => {
  dispatch(initSyncCampaign());
  const { success, message, data } = await requestSyncCampaign(conceptId);

  if (success) {
    dispatch(successSyncCampaign(data));
    dispatch(getCampaignList(conceptId, sort, order));
  } else {
    dispatch(errorSyncCampaign(message));
  }
};

export const getNewConcepts = (partnerId) => async (dispatch) => {
  dispatch(initSyncConcept());

  const { success, message, data } = await requestSyncConcept(partnerId);

  if (success) {
    dispatch(successSyncConcept(data));
    dispatch(getConceptList());
  } else {
    dispatch(errorSyncConcept(message));
  }
};

export const getPartners = () => async (dispatch) => {
  dispatch(initPartners());

  const { success, message, data } = await requestPartners();

  success
    ? dispatch(successPartners(data?.data))
    : dispatch(errorPartners(message));
};

export const getMembers = () => async (dispatch) => {
  dispatch(initMembers());

  const { success, message, data } = await requestUsers();

  success ? dispatch(successMembers(data)) : dispatch(errorMembers(message));
};

export const getStatus = (type) => async (dispatch) => {
  dispatch(initStatus());

  const { success, message, data } = await requestStatus(type);

  success ? dispatch(successStatus(data)) : dispatch(errorStatus(message));
};

export const getCampaignTask = (campaignId) => async (dispatch) => {
  dispatch(initCampaignTask());

  const { message, data } = await requestCampaignTasks(campaignId);

  !_.isEmpty(data)
    ? dispatch(successCampaignTask({ campaignId, data }))
    : dispatch(errorCampaignTask(message));
};

export const getMilestoneTemplates =
  (conceptId, shouldDisplayLoader = true) =>
  async (dispatch) => {
    shouldDisplayLoader && dispatch(initMilestoneTemplates());

    const { success, message, data } = await requestMilestoneTemplates(
      conceptId
    );

    success
      ? dispatch(successMilestoneTemplates(data))
      : dispatch(errorMilestoneTemplates(message));
  };

export const getMilestoneLogs = (conceptId) => async (dispatch) => {
  dispatch(initMilestoneLogs());

  const { success, message, data } = await requestMilestoneLogs(conceptId);

  success
    ? dispatch(successMilestoneLogs(data))
    : dispatch(errorMilestoneLogs(message));
};

export const getPaginatedMilestoneLogs =
  (conceptId, page) => async (dispatch) => {
    dispatch(initMilestoneLogs());

    const { success, message, data } = await requestMilestoneLogs(
      conceptId,
      page
    );

    success
      ? dispatch(successPaginatedMilestoneLogs(data))
      : dispatch(errorMilestoneLogs(message));
  };

export const getMilestoneTemplatesPublic = (conceptId) => async (dispatch) => {
  dispatch(initMilestoneTemplates());

  const { success, message, data } = await requestMilestoneTemplatesPublic(
    conceptId
  );

  success
    ? dispatch(successMilestoneTemplates(data))
    : dispatch(errorMilestoneTemplates(message));
};

export const getMilestoneCSV =
  (conceptId, partnerName, conceptName) => async () => {
    await requestMilestoneCSV(conceptId).then((response) => {
      const blob = new Blob([response]);
      FileSaver.saveAs(blob, `${partnerName}-${conceptName}-Milestones.xlsx`);
    });
  };

export const updateMilestone = (params) => async () =>
  await requestMilestoneUpdate(params);

export const updateMilestoneOriginalTimeline =
  (conceptId, channelId) => async () => {
    const response = await requestMilestoneOriginalTimeline(
      conceptId,
      channelId
    );
    return response;
  };

export const startMilestone = (params) => async (dispatch) => {
  dispatch(initMilestoneTemplates());
  const { success, error } = await requestMilestoneStart(params);

  return success || error;
};

export const getChannelTask = (conceptId, channelId) => async (dispatch) => {
  dispatch(initChannelList());
  const { success, message, data } = await requestConceptTasks(
    conceptId,
    channelId
  );

  const channel =
    channelId === 1
      ? 'googleDisplay'
      : channelId === 2
      ? 'googleVideo'
      : channelId === 3
      ? 'metaStatic'
      : channelId === 4
      ? 'metaVideo'
      : 'youtubeVideo';

  success
    ? dispatch(successConceptTaskList({ type: channel, data }))
    : dispatch(errorConceptTaskList(message));

  return data;
};

export const updateGlobal =
  (params1, params2, onFailure = () => {}) =>
  async (dispatch) => {
    dispatch(initUpdateKey());

    // Changed to newer API if the key is status,due date or delivery date
    const { success, data, message } = [
      'task_status',
      'task_due_date',
      'task_delivery_date',
    ].includes(params1.key)
      ? await requestUpdateTaskByKey({
          ...params1,
          is_parent: params1?.is_parent ? 1 : 0,
          key: params1.key.replace('task_', ''),
          value:
            params1.key === 'task_status'
              ? params1.value
              : formatDate(params1.value, 'MM/DD/yyyy hh:mm:ss A'),
        })
      : await requestUpdateKey(params1);

    if (success) {
      if (params2.fromCampaign) {
        dispatch(
          successCampaignUpdateKey({ params1, params2, response: data ?? {} })
        );
      } else {
        dispatch(successUpdateKey({ params1, params2, response: data ?? {} }));
      }

      [12, 22].includes(data?.status_id) && window.location.reload();
    } else {
      dispatch(errorUpdateKey(message));
      onFailure(message);
    }
  };

export const addReferenceLink =
  (conceptId, params, page, limit, paramsLink) => async (dispatch) => {
    dispatch(initAddReferenceLink());

    const { success, message } = await requestAddReferenceLink(params);

    if (success) {
      dispatch(successAddReferenceLink());
      dispatch(getReferences(conceptId, page, limit, paramsLink));
    } else {
      dispatch(errorAddReferenceLink(message));
    }
  };

export const updateReferenceLink =
  (conceptId, params, page, limit, paramsLink) => async (dispatch) => {
    dispatch(initUpdateReferenceLink());

    const { success, message } = await requestUpdateReferenceLink(params);

    if (success) {
      dispatch(successUpdateReferenceLink());
      dispatch(getReferences(conceptId, page, limit, paramsLink));
    } else {
      dispatch(errorUpdateReferenceLink(message));
    }
  };

export const updateBulkReferenceLink =
  (conceptId, params, page, limit, paramsLink) => async (dispatch) => {
    dispatch(initUpdateReferenceLink());

    const { success, message } = await requestBulkUpdateReferenceLink(params);

    if (success) {
      dispatch(successUpdateReferenceLink());
      dispatch(getReferences(conceptId, page, limit, paramsLink));
    } else {
      dispatch(errorUpdateReferenceLink(message));
    }
  };

export const deleteReferenceLink =
  (conceptId, params, page, limit, paramsLink) => async (dispatch) => {
    dispatch(initAddReferenceLink());

    const { success, message } = await requestDeleteReferenceLink(params);

    if (success) {
      dispatch(successDeleteReferenceLink());
      dispatch(getReferences(conceptId, page, limit, paramsLink));
    } else {
      dispatch(errorDeleteReferenceLink(message));
    }
  };

export const getInputDatasources = (params) => async (dispatch) => {
  dispatch(initInputDatasources());

  const { success: isSuccessFetchingTaskTypes, data: taskTypes } =
    await requestReferenceLinkTaskList({ ...params, get_task: 'task' });
  const { success: isSuccessFetchingTaskCategories, data: taskCategories } =
    await requestReferenceLinkTaskList({ ...params, get_task: 'subtask' });

  if (isSuccessFetchingTaskTypes && isSuccessFetchingTaskCategories) {
    dispatch(successInputDatasources({ taskTypes, taskCategories }));
  } else {
    dispatch(
      errorInputDatasources(
        "There's a problem fetching task types / task categories!"
      )
    );
  }
};

export const updateNotes = (params) => async () =>
  await requestNotesUpdate(params);

export const addCustomCampaign = (params) => async (dispatch) => {
  dispatch(initSaveCampaign());

  const { success, data, message } = await requestAddCustomCampaign(params);

  if (success) {
    dispatch(successSaveCampaign());
  } else {
    dispatch(errorSaveCampaign(_.first(data?.name) ?? message));
  }
};

export default projects.reducer;
