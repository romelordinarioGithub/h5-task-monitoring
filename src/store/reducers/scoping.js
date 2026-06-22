import { createSlice } from '@reduxjs/toolkit';
import { requestPricing } from 'services/api/brief';

const initialState = {
  pricing: {
    data: null,
    fetching: false,
  },
  error: null,
};

const scoping = createSlice({
  name: 'scoping',
  initialState,
  reducers: {
    initScopingPricing: (state) => {
      state.pricing.fetching = true;
      state.error = null;
    },
    successScopingPricing: (state, { payload }) => {
      state.pricing.data = payload;
      state.pricing.fetching = false;
      state.error = null;
    },
    errorScopingPricing: (state, { payload }) => {
      state.pricing.fetching = false;
      state.error = payload;
    },
    resetScopingPricing: (state) => {
      state.pricing = initialState.pricing;
      state.error = null;
    },
  },
});

export const {
  initScopingPricing,
  successScopingPricing,
  errorScopingPricing,
  resetScopingPricing,
} = scoping.actions;

export const getScopingPricing = (briefId) => async (dispatch) => {
  dispatch(initScopingPricing());

  const response = await requestPricing(briefId);

  if (response?.success === false) {
    dispatch(errorScopingPricing(response.message));

    return {
      success: false,
      message: response.message,
      response,
    };
  }

  dispatch(successScopingPricing(response));

  return {
    success: true,
    data: response,
    response,
  };
};

export default scoping.reducer;
