// Redux
import { createSlice } from '@reduxjs/toolkit';
// Services
import { requestTimezone, requestRegion } from 'services/api/profile';
import { requestMaintenanceTeams } from 'services/api/maintenance';

const initialState = {
  timezone: {
    data: [],
    fetching: false,
    error: null,
  },
  team: {
    data: [],
    fetching: false,
    error: null,
  },
  region: {
    data: [],
    fetching: false,
    error: null
  }
};

const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    TimezoneStart: (state) => {
      state.timezone.error = null;
      state.timezone.fetching = true;
    },
    TeamStart: (state) => {
      state.team.error = null;
      state.team.fetching = true;
    },
    RegionStart: (state) => {
      state.region.error = null;
      state.region.fetching = true;
    },
    TimezoneSuccess: (state, { payload }) => {
      state.timezone.data = payload;
      state.timezone.fetching = false;
    },
    TeamSuccess: (state, { payload }) => {
      state.team.data = payload;
      state.team.fetching = false;
    },
    RegionSuccess: (state, { payload }) => {
      state.region.data = payload;
      state.region.fetching = false;
    },
    TimezoneFailed: (state, { payload }) => {
      state.timezone.error = payload;
      state.timezone.fetching = false;
    },
    TeamFailed: (state, { payload }) => {
      state.team.error = payload;
      state.team.fetching = false;
    },
    RegionFailed: (state, { payload }) => {
      state.region.error = payload;
      state.region.fetching = false;
    },
  },
});

export const {
  TimezoneStart,
  TimezoneSuccess,
  TimezoneFailed,
  TeamStart,
  TeamSuccess,
  TeamFailed,
  RegionStart,
  RegionSuccess,
  RegionFailed,
} = profile.actions;

export const fetchTimezone = () => async (dispatch) => {
  dispatch(TimezoneStart());
  const { data, status } = await requestTimezone();
  if (status === 200) {
    dispatch(TimezoneSuccess(data));
  } else {
    dispatch(TimezoneFailed('error when fetching timezone'));
  }
};

export const fetchTeams = () => async (dispatch) => {
  dispatch(TeamStart());
  const { success, data, message } = await requestMaintenanceTeams(
    '?limit=1000'
  );

  if (success) {
    dispatch(TeamSuccess(data?.data));
  } else {
    dispatch(TeamFailed(message));
  }
};

export const fetchRegion = () => async (dispatch) => {
  dispatch(RegionStart());
  const { success, data, message } = await requestRegion();

  if (success) {
    dispatch(RegionSuccess(data));
  } else {
    dispatch(RegionFailed(message));
  }
};

export default profile.reducer;
