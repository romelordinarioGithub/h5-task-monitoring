import { createSlice } from '@reduxjs/toolkit';
import { templateTable } from 'pages/ConceptOverview/constant';
import { getDefaultTableFilters } from 'pages/Dashboard/constant';

const initialState = {
  dashboard: {
    state: { filter: {}, brief: {}, sort: {} },
    numRows: 20,
  },
  conceptMilestone: { table: templateTable, isHideInActive: true },
  campaignMilestone: { table: templateTable, isHideInActive: true },
  teamId: null,
  timerSheet: {
    applyFilterCooldownEndsAt: 0,
  },
};

const filters = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    initDashboard: (state) => {
      state.dashboard = null;
    },
    setDashboardFilters: (state, { payload }) => {
      state.dashboard.state = payload;
    },
    setNumRows: (state, { payload }) => {
      state.dashboard.numRows = payload;
    },
    setTeamId: (state, { payload }) => {
      if (state.teamId != payload.teamId)
        state.dashboard.state = getDefaultTableFilters(
          payload.queue,
          payload.teamId
        );
      state.teamId = payload.teamId;
    },
    setActiveMilestoneColumns: (state, { payload }) => {
      state.conceptMilestone.table = payload;
    },
    setIsHideInactive: (state, { payload }) => {
      state.conceptMilestone.isHideInActive = payload;
    },
    setActiveMilestoneColumnsCampaign: (state, { payload }) => {
      state.campaignMilestone.table = payload;
    },
    setIsHideInactiveCampaign: (state, { payload }) => {
      state.campaignMilestone.isHideInActive = payload;
    },
    resetAdvanceFilters: (state) => {
      state.dashboard.partner = '';
      state.dashboard.concept = '';
      state.dashboard.campaign = '';
      state.dashboard.channel = '';
    },
    setTimerSheetApplyFilterCooldownEndsAt: (state, { payload }) => {
      if (!state.timerSheet) state.timerSheet = {};
      state.timerSheet.applyFilterCooldownEndsAt = Number(payload) || 0;
    },
    resetFilters: () => initialState,
  },
});

export const {
  initDashboardState,
  setDashboardFilters,
  setNumRows,
  setTeamId,
  setActiveMilestoneColumns,
  setIsHideInactive,
  setActiveMilestoneColumnsCampaign,
  setIsHideInactiveCampaign,
  resetAdvanceFilters,
  setTimerSheetApplyFilterCooldownEndsAt,
  resetFilters,
} = filters.actions;

export default filters.reducer;
