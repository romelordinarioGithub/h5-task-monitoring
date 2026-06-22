import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTaskCategory: null,
  selectedPartner: null,
  selectedCampaign: null,
  selectedConcept: null,
  selectedDate: null,
  filterSelectedDates: null,
  requiredFields: null,
  tags: null,
  isRunningTimer: false,
};

const activeTimer = createSlice({
  name: 'activeTimer',
  initialState,
  reducers: {
    setSelectedTaskCategory: (state, { payload }) => {
      state.selectedTaskCategory = payload;
    },
    setSelectedPartner: (state, { payload }) => {
      state.selectedPartner = payload;
    },
    setSelectedCampaign: (state, { payload }) => {
      state.selectedCampaign = payload;
    },
    setSelectedConcept: (state, { payload }) => {
      state.selectedConcept = payload;
    },
    setSelectedDate: (state, { payload }) => {
      state.selectedDate = payload;
    },
    setFilterSelectedDates: (state, { payload }) => {
      state.filterSelectedDates = payload;
    },
    setRequiredFields: (state, { payload }) => {
      state.requiredFields = payload;
    },
    setTags: (state, { payload }) => {
      state.tags = payload;
    },
    setIsRunning: (state, { payload }) => {
      state.isRunningTimer = payload;
    },
    reset: () => initialState,
  },
});

export const {
  setSelectedTaskCategory,
  setSelectedPartner,
  setSelectedCampaign,
  setSelectedConcept,
  setSelectedDate,
  setFilterSelectedDates,
  setRequiredFields,
  setTags,
  setIsRunning,
  reset,
} = activeTimer.actions;

export default activeTimer.reducer;
