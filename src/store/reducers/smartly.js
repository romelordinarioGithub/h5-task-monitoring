import { createSlice } from '@reduxjs/toolkit';
import {
  requestGetSmartlyTaskList,
  requestGetSmartlyTaskCount,
  requestGetSmartlyTask,
  requestCreateSmartlyTask,
} from 'services/api/smartly';
import { fetchSmartlyPartnersRequest } from 'services/api/timer';

const initialState = {
  list: {},
  statistics: {},
  overview: {},
  partners: {},
  fetchList: false,
  fetchStatistics: false,
  fetchOverview: false,
  fetchingBrief: false,
  fetchingPartner: false,
  errorList: null,
  errorStatistics: null,
  errorOverview: null,
  errorBrief: false,
  errorPartner: false,
};

const smartly = createSlice({
  name: 'smartly',
  initialState,
  reducers: {
    initSmartlyList: (state) => {
      state.fetchList = true;
      state.errorList = null;
    },
    initSmartlyBrief: (state) => {
      state.fetchingBrief = true;
      state.errorBrief = null;
    },
    initSmartlyPartner: (state) => {
      state.partners = [];
      state.fetchingPartner = true;
      state.errorPartner = null;
    },
    successSmartlyBrief: (state) => {
      state.fetchingBrief = false;
      state.errorBrief = null;
    },
    successSmartlyList: (state, { payload }) => {
      state.list = payload;
      state.fetchList = false;
      state.errorList = null;
    },
    successSmartlyPartner: (state, { payload }) => {
      state.partners = payload;
      state.fetchingPartner = false;
      state.errorPartner = null;
    },
    errorSmartlyBrief: (state, { payload }) => {
      state.fetchingBrief = false;
      state.errorBrief = { message: payload };
    },
    errorSmartlyPartner: (state, { payload }) => {
      state.fetchingPartner = false;
      state.errorPartner = { message: payload };
    },
    errorSmartlyList: (state, { payload }) => {
      state.fetchList = false;
      state.errorList = { message: payload };
    },
    initSmartlyStatistics: (state) => {
      state.fetchStatistics = true;
      state.errorStatistics = null;
    },
    successSmartlyStatistics: (state, { payload }) => {
      state.statistics = payload;
      state.fetchStatistics = false;
      state.errorStatistics = null;
    },
    errorSmartlyStatistics: (state, { payload }) => {
      state.fetchStatistics = false;
      state.errorStatistics = { message: payload };
    },
    initSmartlyOverview: (state) => {
      state.fetchOverview = true;
      state.errorOverview = null;
    },
    successSmartlyOverview: (state, { payload }) => {
      state.overview = payload;
      state.fetchOverview = false;
      state.errorOverview = null;
    },
    errorSmartlyOverview: (state, { payload }) => {
      state.fetchOverview = false;
      state.errorOverview = { message: payload };
    },
  },
});

export const {
  initSmartlyList,
  successSmartlyList,
  errorSmartlyList,
  initSmartlyBrief,
  successSmartlyBrief,
  errorSmartlyBrief,
  initSmartlyStatistics,
  successSmartlyStatistics,
  errorSmartlyStatistics,
  initSmartlyOverview,
  successSmartlyOverview,
  errorSmartlyOverview,
  initSmartlyPartner,
  successSmartlyPartner,
  errorSmartlyPartner,
} = smartly.actions;

export const getSmartlyPartners = () => async (dispatch) => {
  dispatch(initSmartlyPartner());
  const { success, message, data } = await fetchSmartlyPartnersRequest();

  if (success) {
    dispatch(successSmartlyPartner(data));
  } else {
    dispatch(errorSmartlyPartner(message));
  }
};

export const getSmartlyTasksList = () => async (dispatch) => {
  dispatch(initSmartlyList());
  const { success, message, data } = await requestGetSmartlyTaskList();

  if (success) {
    dispatch(successSmartlyList(data));
  } else {
    dispatch(errorSmartlyList(message));
  }
};

export const getSmartlyStatistics = () => async (dispatch) => {
  dispatch(initSmartlyStatistics());

  const { success, message, data } = await requestGetSmartlyTaskCount();

  if (success) {
    dispatch(successSmartlyStatistics(data));
  } else {
    dispatch(errorSmartlyStatistics(message));
  }
};

export const getSmartlyOverview = (id) => async (dispatch) => {
  dispatch(initSmartlyOverview());
  const { success, message, data } = await requestGetSmartlyTask(id);

  if (success) {
    dispatch(successSmartlyOverview(data));
  } else {
    dispatch(errorSmartlyOverview(message));
  }
};

export const postCreateSmartlyTask =
  (params, onSuccess = () => {}, onFailure = () => {}) =>
  async (dispatch) => {
    dispatch(initSmartlyBrief());
    const { success, message } = await requestCreateSmartlyTask(params);

    if (success) {
      dispatch(successSmartlyBrief());
      onSuccess();
    } else {
      dispatch(successSmartlyBrief(message));
      onFailure(
        'This might be an error on the server, please contact the administrator.'
      );
    }
  };

export default smartly.reducer;
