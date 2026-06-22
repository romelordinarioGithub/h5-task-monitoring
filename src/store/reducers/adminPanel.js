// Redux
import { createSlice } from '@reduxjs/toolkit';

// Services
import {
  requestErrorCategory,
  requestAddErrorCategory,
  requestDeleteErrorCategory,
  requestUpdateErrorCategory,
} from 'services/api/adminPanel';

import _ from 'lodash';

const initialState = {
  errorCategory: [],
  fetching: false,
};

const adminPanel = createSlice({
  name: 'adminPanel',
  initialState,
  reducers: {
    initErrorCategory: (state) => {
      state.errorCategory = [];
      state.fetching = true;
    },
    successErrorCategory: (state, { payload }) => {
      state.errorCategory = payload;
      state.fetching = false;
    },
  },
});

export const { initErrorCategory, successErrorCategory } = adminPanel.actions;

export const fetchErrorCategory =
  (update = false) =>
  async (dispatch) => {
    !update && dispatch(initErrorCategory());
    const { success, data } = await requestErrorCategory();
    if (success) {
      dispatch(successErrorCategory(data));
    }
  };

export const addErrorCategory =
  (params, onSuccess = () => {}, onFailure = () => {}) =>
  async (dispatch) => {
    const { success, data, message } = await requestAddErrorCategory(params);
    if (success) {
      dispatch(fetchErrorCategory(true));
      onSuccess(message);
    } else {
      onFailure(_.first(data?.name));
    }
  };

export const updateErrorCategory =
  (params, onSuccess = () => {}, onFailure = () => {}) =>
  async (dispatch) => {
    const { success, data, message } = await requestUpdateErrorCategory(params);
    if (success) {
      dispatch(fetchErrorCategory(true));
      onSuccess(message);
    } else {
      onFailure(_.first(data?.name));
    }
  };

export const deleteErrorCategory =
  (params, onSuccess = () => {}, onFailure = () => {}) =>
  async (dispatch) => {
    const { success, message } = await requestDeleteErrorCategory(params);
    if (success) {
      dispatch(fetchErrorCategory(true));
      onSuccess(message);
    } else {
      onFailure(message);
    }
  };

export default adminPanel.reducer;
