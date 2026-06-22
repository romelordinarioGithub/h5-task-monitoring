import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUserTimeLogsRequest,
  fetchActiveTimerRequest,
  fetchCategoriesRequest,
  fetchCategoriesWithRequiredFieldsRequest,
  startTimerRequest,
  stopRunningTimerRequest,
  updateTimerRequest,
  deleteTimerRequest,
  requestGetPromptTimer,
  requestContinuePromptTimer,
  fetchSmartlyPartnersRequest,
  fetchTaskTypeRequest,
  fetchPartnersRequest,
  fetchConceptByPartnerRequest,
  fetchCampaignByConceptRequest,
} from 'services/api/timer';
import {
  requestAddTags,
  requestRemoveTags,
  requestFetchTags,
} from 'services/api/tasks';
import _ from 'lodash';
import { requestActiveTaskTimers } from 'services/api/tasks';

const initialState = {
  categories: [],
  logs: [],
  active: {},
  adweavePartners: [],
  smartlyPartners: [],
  campaigns: [],
  concepts: [],
  prompt: {},
  taskTimers: [],
  tagsList: [],
  isUpdatingTimer: false,
  isFetching: false,
  isFetchingTags: false,
  isFetchingTaskTimers: false,
  isFetchingActiveTimer: false,
  isFetchingWithPagination: false,
  isFetchingCategoriesWithRequiredFields: false,
  isFetchingTaskCategories: false,
  isFetchingPartners: false,
  isFetchingConcepts: false,
  isFetchingCampaigns: false,
  error: null,
};

const timer = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    reset: () => initialState,
    resetTags: (state) => {
      state.tagsList = [];
    },
    initPresetCategories: (state) => {
      state.error = null;
    },
    initCategoriesWithRequiredFields: (state) => {
      state.error = null;
      state.isFetchingCategoriesWithRequiredFields = true;
    },
    initTimeLogs: (state, { payload }) => {
      state.isFetching = payload;
      state.error = null;
    },
    initPaginatedTimeLogs: (state, { payload }) => {
      state.isFetchingWithPagination = payload;
      state.error = null;
    },
    initActiveTimer: (state) => {
      state.isFetchingActiveTimer = true;
    },
    initTaskTimers: (state) => {
      state.isFetchingTaskTimers = true;
    },
    initTagList: (state) => {
      state.isFetchingTags = true;
      state.tagsList = [];
    },
    startTimerStart: (state) => {
      state.isUpdatingTimer = true;
    },
    stopTimerStart: (state) => {
      state.isUpdatingTimer = true;
    },
    initPresetCategoriesSuccess: (state, { payload }) => {
      state.list = payload;
    },
    initCategoriesWithRequiredFieldsSuccess: (state, { payload }) => {
      state.categories = payload?.task_categories ?? [];
      state.adweavePartners = payload?.partner_groups ?? [];
      state.campaigns = payload?.campaigns ?? [];
      state.concepts = payload?.concepts ?? [];
      state.isFetchingCategoriesWithRequiredFields = false;
    },
    initSmartlyPartnersSuccess: (state, { payload }) => {
      state.smartlyPartners = payload.data;
    },
    initTimelogSuccess: (state, { payload }) => {
      state.logs = payload;
      state.error = null;
      state.isFetching = false;
    },
    initPaginatedTimelogSuccess: (state, { payload }) => {
      state.isFetchingWithPagination = false;
      state.logs = [...(state.logs ?? []), ...payload];
      state.error = null;
    },
    initActiveTimerSuccess: (state, { payload }) => {
      state.active = payload;
      state.error = null;
      state.isFetchingActiveTimer = false;
    },
    initTaskTimersSuccess: (state, { payload }) => {
      state.taskTimers = payload;
      state.error = null;
      state.isFetchingTaskTimers = false;
    },
    initPartners: (state) => {
      state.isFetchingPartners = true;
      state.error = null;
    },
    initPartnersSuccess: (state, { payload }) => {
      state.isFetchingPartners = false;
      state.adweavePartners = payload;
      state.error = null;
    },
    initCampaigns: (state) => {
      state.isFetchingCampaigns = true;
      state.error = null;
    },
    initCampaignsSuccess: (state, { payload }) => {
      state.isFetchingCampaigns = false;
      state.campaigns = payload;
      state.error = null;
    },
    initConcepts: (state) => {
      state.isFetchingConcepts = true;
      state.error = null;
    },
    initConceptsSuccess: (state, { payload }) => {
      state.isFetchingConcepts = false;
      state.concepts = payload;
      state.error = null;
    },
    startTimerSuccess: (state, { payload }) => {
      state.isUpdatingTimer = false;
      state.active = payload;
    },
    stopTimerSuccess: (state) => {
      state.isUpdatingTimer = false;
      state.active = {};
    },
    deleteTimerSuccess: () => {},
    getPromptTimerSuccess: (state, { payload }) => {
      state.prompt = payload;
    },
    initTagListSuccess: (state, { payload }) => {
      state.isFetchingTags = false;
      state.tagsList = payload;
    },
    initUpdateTagSuccess: (state, { payload }) => {
      state.tagsList = payload;
    },
    updateTimerSuccess: (state, { payload }) => {
      const index = payload?.index;
      const update = _.first(payload?.data);
      return {
        ...state,
        logs: state?.logs?.map((log, i) =>
          i === index
            ? {
                ...log,
                category: log?.category?.map((category) =>
                  category?.category_id === update?.category?.id
                    ? {
                        ...category,
                        data: category.data?.map((task) =>
                          task?.task_timer_id === update?.task_timer_id
                            ? update
                            : task
                        ),
                      }
                    : category
                ),
              }
            : log
        ),
      };
    },
    updateRunningTimerSuccess: (state, { payload }) => {
      state.active = payload;
    },
    initPresetCategoriesFailed: (state, { payload }) => {
      state.error = payload;
      state.list = [];
    },
    initCategoriesWithRequiredFieldsFailed: (state, { payload }) => {
      state.error = payload;
      state.categories = [];
      state.isFetchingCategoriesWithRequiredFields = false;
    },
    initTimelogsFailed: (state, { payload }) => {
      state.error = payload;
      state.isFetching = false;
    },
    initActiveTimerFailed: (state, { payload }) => {
      state.error = payload;
    },
    initTaskTimersFailed: (state, { payload }) => {
      state.error = payload;
      state.isFetchingTaskTimers = false;
    },
    initPartnersFailed: (state, { payload }) => {
      state.isFetchingPartners = false;
      state.error = payload;
    },
    initCampaignsFailed: (state, { payload }) => {
      state.isFetchingCampaigns = false;
      state.error = payload;
    },
    initConceptsFailed: (state, { payload }) => {
      state.isFetchingConcepts = false;
      state.error = payload;
    },
    startTimerFailed: (state, { payload }) => {
      state.error = payload;
      state.isUpdatingTimer = false;
    },
    stopTimerFailed: (state, { payload }) => {
      state.error = payload;
      state.isUpdatingTimer = false;
    },
    deleteTimerFailed: (state, { payload }) => {
      state.error = payload;
    },
    updateTimerFailed: (state, { payload }) => {
      state.error = payload;
      state.isUpdatingTimer = false;
    },
    TagListFailed: (state, { payload }) => {
      state.error = payload;
      state.isFetchingTags = false;
    },
    updateTagFailed: (state, { payload }) => {
      state.error = payload;
    },
    tagListFailed: (state, { payload }) => {
      state.error = payload;
      state.isFetchingTags = false;
    },
    initTaskCategories: (state) => {
      state.error = null;
      state.isFetchingTaskCategories = true;
    },
    initTaskCategoriesSuccess: (state, { payload }) => {
      state.categories = payload ?? [];
      state.isFetchingTaskCategories = false;
    },
    initTaskCategoriesFailed: (state, { payload }) => {
      state.error = payload;
      state.categories = [];
      state.isFetchingTaskCategories = false;
    },
  },
});

export const {
  reset,
  resetTags,
  initTimeLogs,
  initPaginatedTimeLogs,
  initActiveTimer,
  initTaskTimers,
  initPresetCategories,
  initCategoriesWithRequiredFields,
  initTagList,
  initPresetCategoriesSuccess,
  initCategoriesWithRequiredFieldsSuccess,
  initSmartlyPartnersSuccess,
  initTaskTimersSuccess,
  startTimerStart,
  stopTimerStart,
  initTimelogSuccess,
  initPaginatedTimelogSuccess,
  initActiveTimerSuccess,
  initPartners,
  initConcepts,
  initCampaigns,
  initPartnersSuccess,
  initCampaignsSuccess,
  initConceptsSuccess,
  startTimerSuccess,
  stopTimerSuccess,
  deleteTimerSuccess,
  getPromptTimerSuccess,
  initTagListSuccess,
  initUpdateTagSuccess,
  initPresetCategoriesFailed,
  initCategoriesWithRequiredFieldsFailed,
  initTimelogsFailed,
  initActiveTimerFailed,
  initPartnersFailed,
  initCampaignsFailed,
  initConceptsFailed,
  initTaskTimersFailed,
  startTimerFailed,
  stopTimerFailed,
  updateTimerSuccess,
  updateTimerFailed,
  deleteTimerFailed,
  updateTagFailed,
  tagListFailed,
  initTaskCategories,
  initTaskCategoriesSuccess,
  initTaskCategoriesFailed,
  updateRunningTimerSuccess,
} = timer.actions;

// fetch task datasource
export const fetchCategories = () => async (dispatch) => {
  dispatch(initPresetCategories());

  const { success, data, message } = await fetchCategoriesRequest();

  success
    ? dispatch(initPresetCategoriesSuccess(data.data))
    : dispatch(initPresetCategoriesFailed(message));
};

export const fetchCategoriesWithRequiredFields = () => async (dispatch) => {
  dispatch(initCategoriesWithRequiredFields());

  const { success, data, message } =
    await fetchCategoriesWithRequiredFieldsRequest();

  success
    ? dispatch(initCategoriesWithRequiredFieldsSuccess(data))
    : dispatch(initCategoriesWithRequiredFieldsFailed(message));
};

export const fetchTaskTypeCategories = () => async (dispatch) => {
  dispatch(initTaskCategories());

  const { success, data, message } = await fetchTaskTypeRequest();

  success
    ? dispatch(initTaskCategoriesSuccess(data))
    : dispatch(initTaskCategoriesFailed(message));
};

export const fetchPartnerFields = () => async (dispatch) => {
  dispatch(initPartners());

  const { success, data, message } = await fetchPartnersRequest();

  success
    ? dispatch(initPartnersSuccess(data))
    : dispatch(initPartnersFailed(message));
};

export const fetchConceptFields = (partnerId) => async (dispatch) => {
  dispatch(initConcepts());

  const { success, data, message } = await fetchConceptByPartnerRequest(
    partnerId
  );

  success
    ? dispatch(
        initConceptsSuccess(
          data
            ?.map((partner) => ({
              uuid: partner?.id,
              name: partner?.name,
              partner_uuid: partner?.partner_id,
            }))
            .filter((data) => data.uuid != 'uncatconcept001')
        )
      )
    : dispatch(initConceptsFailed(message));
};

export const fetchCampaignFields =
  (conceptId, partnerId) => async (dispatch) => {
    dispatch(initCampaigns());

    const { success, data, message } = await fetchCampaignByConceptRequest(
      conceptId,
      partnerId
    );

    success
      ? dispatch(
          initCampaignsSuccess(
            data?.campaigns.filter((data) => data.uuid != 'uncatconcept001')
          )
        )
      : dispatch(initCampaignsFailed(message));
  };

export const fetchSmartlyPartners = () => async (dispatch) => {
  const { success, data } = await fetchSmartlyPartnersRequest();

  success && dispatch(initSmartlyPartnersSuccess(data));
};

// fetch user time logs
export const fetchUserTimeLogs =
  (userId, pagination, onSuccess, shouldShowLoader = true) =>
  async (dispatch) => {
    const wantsToLoadFirstPage =
      _.isNull(pagination.page) || (pagination.page ?? 1) === 1;

    wantsToLoadFirstPage
      ? dispatch(initTimeLogs(shouldShowLoader))
      : dispatch(initPaginatedTimeLogs(shouldShowLoader));

    const { success, data, message } = await fetchUserTimeLogsRequest(
      userId,
      pagination
    );

    if (success) {
      _.isNull(pagination.page) || (pagination.page ?? 1) === 1
        ? dispatch(initTimelogSuccess(data))
        : dispatch(initPaginatedTimelogSuccess(data));
      onSuccess();
    } else {
      dispatch(initTimelogsFailed(message));
    }
  };

// fetch active timer
export const fetchActiveTimer = () => async (dispatch) => {
  dispatch(initActiveTimer());

  const { success, data, message } = await fetchActiveTimerRequest();

  success
    ? dispatch(initActiveTimerSuccess(data))
    : dispatch(initActiveTimerFailed(message));
};

// start timer
export const startTimerById = (params) => async (dispatch) => {
  dispatch(startTimerStart());

  const { success, data, message } = await startTimerRequest(params);

  success
    ? dispatch(startTimerSuccess(data))
    : dispatch(startTimerFailed(message));

  dispatch(fetchTaskTimers());
};
// stop timer
export const stopTimerById =
  (userId, params, pagination, onReset = () => {}) =>
  async (dispatch) => {
    dispatch(stopTimerStart());

    const { success, message } = await stopRunningTimerRequest(params);

    if (success) {
      dispatch(stopTimerSuccess());
      onReset();
      !_.isNull(pagination) &&
        dispatch(fetchUserTimeLogs(userId, pagination, () => {}, false));
    } else {
      dispatch(startTimerFailed(message));
    }

    dispatch(fetchTaskTimers());
  };

// update timer
export const updateTimer =
  (userId, params, pagination, index) => async (dispatch) => {
    const { success, data, message } = await updateTimerRequest(params);

    if (success) {
      if (_.isUndefined(index))
        pagination &&
          dispatch(fetchUserTimeLogs(userId, pagination, () => {}, false));
      else dispatch(updateTimerSuccess({ index, data }));
    } else {
      dispatch(updateTimerFailed(message));
    }
  };

// update timer
export const updateRunningTimer = (params) => async (dispatch) => {
  const { success, data, message } = await updateTimerRequest(params);

  if (success) {
    dispatch(updateRunningTimerSuccess(_.first(data)));
  } else {
    dispatch(updateTimerFailed(message));
  }
};

// delete timer
export const deleteTimer =
  (userId, params, pagination, onSuccess) => async (dispatch) => {
    const { success, message } = await deleteTimerRequest(params);

    if (success) {
      dispatch(deleteTimerSuccess());
      dispatch(fetchUserTimeLogs(userId, pagination, onSuccess, false));
    } else {
      dispatch(deleteTimerFailed(message));
    }
  };

export const getPromptTimer =
  (onSuccess = () => {}) =>
  async (dispatch) => {
    const { success, data } = await requestGetPromptTimer();
    if (success) {
      dispatch(getPromptTimerSuccess(data));
      onSuccess();
    }
  };

export const continuePromptTimer =
  (params, onSuccess = () => {}) =>
  async () => {
    const { success } = await requestContinuePromptTimer(params);
    if (success) {
      onSuccess();
    }
  };

export const fetchTaskTimers =
  (onSuccess = () => {}) =>
  async (dispatch) => {
    dispatch(initTaskTimers());
    const { success, data, message } = await requestActiveTaskTimers();
    if (success) {
      dispatch(initTaskTimersSuccess(data));
      onSuccess();
    } else {
      dispatch(initTaskTimersFailed(message));
    }
  };

export const fetchTags = (params) => async (dispatch) => {
  dispatch(initTagList());
  const { success, data, message } = await requestFetchTags(params);

  success ? dispatch(initTagListSuccess(data)) : tagListFailed(message);
};

export const updateTags = (params) => async (dispatch) => {
  const { success, data, message } =
    params.action == 'add'
      ? await requestAddTags(params)
      : await requestRemoveTags(params);

  if (success) {
    dispatch(initUpdateTagSuccess(data));
    // pagination &&
    //   dispatch(fetchUserTimeLogs(userId, pagination, () => {}, false));
  } else {
    dispatch(updateTagFailed(message));
  }
};

export default timer.reducer;
