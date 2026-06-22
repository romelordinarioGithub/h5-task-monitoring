// API's
import {
  requestMaintenanceTeams,
  requestMaintenanceTaskType,
  requestMaintenanceTaskCategory,
} from 'services/api/maintenance';
import { requestPartners } from 'services/api/partner';
import { fetchConceptByPartner, fetchAllTags } from 'services/api/concept';
import {
  fetchCampaignByConcept,
  fetchCustomCampaign,
} from 'services/api/campaign';
import { requestCreateTask, requestValidate } from 'services/api/tasks';
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const initialState = {
  data: {
    step: null,
    teamList: [],
    taskTypeList: [],
    subTaskList: [],
    partnerList: [],
    conceptList: [],
    campaignList: [],
    marketList: [],
    channelList: [],
    deliveryTypeList: [],
    assetLinks: [],
    formatsList: [],
    aTags: [],
    // validateSubTask: null,
    // validateTaskType: null
    validate: null,
  },
  fetchConceptList: false,
  errorConceptList: null,
  save: {
    processing: false,
    data: [],
  },
  loading: {
    fetchingTeam: true,
    fetchingTasktype: true,
    fetchingSubTask: true,
    fetchingPartner: true,
    fetchingCampaign: false,
    fetchingConcept: true,
    fetchingChannel: true,
    fetchingTags: true,
  },
  fetching: false,
  error: null,
};

const manualTaskCreation = createSlice({
  name: 'manualTaskCreation',
  initialState,
  reducers: {
    initCreation: (state) => {
      state.fetching = true;
      state.error = null;
    },
    initSaveCreation: (state) => {
      state.save.processing = true;
      state.error = null;
    },
    initUpdateConceptList: (state) => {
      state.loading.fetchingConcept = false;
    },
    initUpdateCampaignList: (state) => {
      state.loading.fetchingCampaign = true;
    },
    successSaveTask: (state, { payload }) => {
      state.save.data = payload;
      state.save.processing = false;
    },
    errorSaveTask: (state, { payload }) => {
      state.error = payload;
      state.save.processing = false;
    },
    setTeamList: (state, { payload }) => {
      state.data.teamList = payload;
      state.fetching = false;
      state.loading.fetchingTeam = false;
    },
    setTaskTypeList: (state, { payload }) => {
      state.data.taskTypeList = payload;
      state.fetching = false;
      state.loading.fetchingTasktype = false;
    },
    setSubTaskList: (state, { payload }) => {
      state.data.subTaskList = payload;
      state.fetching = false;
      state.loading.fetchingSubTask = false;
    },
    setPartnerList: (state, { payload }) => {
      state.data.partnerList = payload;
      state.fetching = false;
      state.loading.fetchingPartner = false;
    },
    setConceptList: (state, { payload }) => {
      state.data.conceptList = payload;
      state.fetching = false;
      state.loading.fetchingConcept = false;
    },
    setTags: (state, { payload }) => {
      state.data.aTags = payload;
      state.fetching = false;
      state.loading.fetchingTags = false;
    },
    setDetails: (state, { payload }) => {
      // const channels = [];
      state.loading.fetchingCampaign = false;
      state.data.campaignList = payload?.campaigns;

      // state.data.campaignList = payload.campaigns;
      state.data.assetLinks = payload.assetLinks;
      state.data.formatsList = payload.formats;
      state.data.channelList = payload?.channels;

      state.fetching = false;
    },

    setCustomCampaignList: (state, { payload }) => {
      // const channels = [];
      state.loading.fetchingCampaign = false;
      state.data.campaignList = payload;

      // state.data.campaignList = payload.campaigns;
      // state.data.assetLinks = payload.assetLinks;
      // state.data.formatsList = payload.formats;
      // state.data.channelList = payload?.channels;

      state.fetching = false;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.fetching = false;
      state.loading.fetchingCampaign = false;
    },
    // setValidateTypeTask: (state, { payload }) => {
    //   state.data.validateTaskType = payload;
    //   state.fetching = false;
    // },
    // setValidateSubTask: (state, { payload }) => {
    //   state.data.validateSubTask = payload;
    //   state.fetching = false;
    // },
    setValidate: (state, { payload }) => {
      state.data.validate = payload;
      state.fetching = false;
    },
    clearConcept: (state) => {
      state.data.conceptList = [];
    },
    clearCampaign: (state) => {
      state.data.campaignList = [];
    },
    successUpdateConceptList: (state, { payload }) => {
      state.loading.fetchingConcept = true;
      state.data.conceptList = {
        ...payload,
        data: [...state.data.conceptList.data, ...payload.data],
      };
    },
    successUpdateCampaignList: (state, { payload }) => {
      state.loading.fetchingCampaign = false;
      state.data.campaignList = {
        ...payload,
        data: [...state.data.campaignList.data, ...payload.data],
      };
    },
    successSearchCampaignList: (state, { payload }) => {
      state.loading.fetchingCampaign = false;
      state.data.campaignList = {
        ...state.data.campaignList,
        data: [...state.data.campaignList.data, ...payload],
      };
    },
    clearAll: (state) => {
      state.data.step = null;
      state.data.teamList = [];
      state.data.taskTypeList = [];
      state.data.subTaskList = [];
      state.data.partnerList = [];
      state.data.conceptList = [];
      state.data.campaignList = [];
      state.data.marketList = [];
      state.data.channelList = [];
      state.data.deliveryTypeList = [];
      state.data.assetLinks = [];
      state.data.aTags = [];
      state.save.processing = false;
      state.save.data = [];
      state.fetching = false;
      state.error = null;
      state.data.validateTypeTask = null;
      state.data.validateSubTask = null;
      state.loading.fetchingTeam = true;
      state.loading.fetchingTasktype = true;
      state.loading.fetchingSubTask = true;
      state.loading.fetchingPartner = true;
      state.loading.fetchingCampaign = false;
      state.loading.fetchingConcept = true;
      state.loading.fetchingChannel = true;
      state.loading.fetchingTags = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  initCreation,
  initSaveCreation,
  initUpdateCampaignList,
  initUpdateConceptList,
  initConceptList,
  successConceptList,
  errorConceptList,
  successSaveTask,
  errorSaveTask,
  setTeamList,
  setTaskTypeList,
  setSubTaskList,
  setPartnerList,
  setConceptList,
  setDetails,
  setCustomCampaignList,
  setValidate,
  setTags,
  setError,
  clearAll,
  clearCampaign,
  clearConcept,
  successUpdateConceptList,
  successUpdateCampaignList,
  successSearchCampaignList,
  clearError,
} = manualTaskCreation.actions;

export const getData = (type, body) => async (dispatch) => {
  dispatch(type === 'add_task' ? initSaveCreation() : initCreation());
  if (type === 'get_concept_overview' || type === 'get_custom_campaign')
    dispatch(initUpdateCampaignList());

  const { success, data, message } = await callApi(type, body);

  success
    ? dispatch(
        setData(
          type,
          [
            'get_concepts',
            'get_concept_overview',
            'get_custom_campaign',
            'get_tags',
            'add_task',
          ].includes(type)
            ? data
            : data.data
        )
      )
    : dispatch(
        type === 'add_task'
          ? setError(message)
          : setError('This might be an error on the server,')
      );
};

export const getUpdateConceptList = (params) => async (dispatch) => {
  dispatch(initUpdateConceptList());

  const { success, message, data } = await fetchConceptByPartner(
    params.partnerId,
    params.page
  );

  success
    ? dispatch(successUpdateConceptList(data))
    : dispatch(setError(message));
};

export const getUpdateCampaignList =
  (concept_id, partner_id, page, search) => async (dispatch) => {
    dispatch(initUpdateCampaignList());

    const { success, message, data } = await fetchCampaignByConcept(
      concept_id,
      partner_id,
      page,
      search
    );

    if (success) {
      dispatch(
        !_.isNull(search)
          ? successSearchCampaignList(data?.campaigns?.data)
          : successUpdateCampaignList(data?.campaigns)
      );
    } else dispatch(setError(message));
  };

// API Selector
const callApi = (t, b) => {
  switch (t) {
    // case 'get_user':
    // return requestMaintenanceUser();
    case 'get_task_type':
      return requestMaintenanceTaskType('?limit=1000');
    case 'get_active_task_type':
      return requestMaintenanceTaskType('?limit=1000&status=1');
    case 'get_task_category':
      return requestMaintenanceTaskCategory('?limit=1000');
    case 'get_active_task_category':
      return requestMaintenanceTaskCategory('?limit=1000&status=1');
    case 'get_teams':
      return requestMaintenanceTeams('?limit=1000');
    case 'get_tags':
      return fetchAllTags();
    case 'get_partners':
      return requestPartners();
    case 'get_concepts':
      return fetchConceptByPartner(b?.partnerId, b?.page);
    case 'get_concept_overview':
      return fetchCampaignByConcept(b?.conceptId, b?.partnerId, b?.page);
    case 'get_custom_campaign':
      return fetchCustomCampaign(b?.partnerId, b?.page);
    case 'add_task':
      return requestCreateTask(b);
    default:
      return null;
  }
};

export const getValidate = (type, params) => async (dispatch) => {
  const { success, data } = await requestValidate(params);

  if (success) dispatch(setValidate(data.taskId));
};

// Set Data
const setData = (t, data) => {
  switch (t) {
    case 'get_teams':
      return setTeamList(data);
    case 'get_task_type':
    case 'get_active_task_type':
      return setTaskTypeList(data);
    case 'get_task_category':
    case 'get_active_task_category':
      return setSubTaskList(data);
    case 'get_partners':
      return setPartnerList(data);
    case 'get_concepts':
      return setConceptList(data);
    case 'get_concept_overview':
      return setDetails(data);
    case 'get_custom_campaign':
      return setCustomCampaignList(data);
    case 'get_tags':
      return setTags(data);
    case 'add_task':
      return successSaveTask(data);
    default:
      return null;
  }
};

export default manualTaskCreation.reducer;
