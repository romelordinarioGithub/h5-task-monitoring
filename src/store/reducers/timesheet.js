import { createSlice } from '@reduxjs/toolkit';
import FileSaver from 'file-saver';
import _ from 'lodash';

// API's
import {
  requestTimesheet,
  requestTimesheetChart,
  requestTimesheetOptionList,
  requestTimesheetStats,
  requestUpdateStartEnd,
  requestTimesheetAll,
  requestTimesheetAllCSV,
  requestTimesheetConcepts,
  requestTimesheetCampaign,
  requestTimeline,
} from 'services/api/timesheet';

import {
  fetchCampaignsRequest,
  fetchConceptsequest,
  fetchSmartlyPartnersRequest,
  updateTimerRequest,
} from 'services/api/timer';
import { requestUsers } from 'services/api/user';

const initialState = {
  statistics: {
    data: [],
    fetching: false,
  },
  timesheet: {
    data: [],
    fetching: false,
  },
  timesheetData: [],
  timelog: {
    data: [],
    fetching: false,
  },
  chart: {
    data: [],
    fetching: false,
  },
  concept: {
    data: [],
    fetching: false,
  },
  campaign: {
    data: [],
    fetching: false,
  },
  optionTimeSheets: {
    data: [],
    fetching: false,
  },
  timeSheetsCSV: {
    data: [],
    fetching: false,
  },
  timeline: {
    data: [],
    fetching: false,
  },
  members: {
    data: [],
    fetching: false,
  },
  campaignList: {
    data: [],
    fetching: false,
  },
  conceptList: {
    data: [],
    fetching: false,
  },
  error: null,
};

const timesheet = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {
    initTimesheet: (state) => {
      state.timesheet.fetching = true;
      state.error = null;
    },
    initTimelog: (state) => {
      state.timelog.fetching = true;
      state.error = null;
    },
    initTimesheetChart: (state) => {
      state.chart.fetching = true;
      state.error = null;
    },
    initTimesheetConcept: (state) => {
      state.concept.fetching = true;
      state.error = null;
    },
    initTimesheetCampaign: (state) => {
      state.campaign.fetching = true;
      state.error = null;
    },
    initoptionTimeSheets: (state) => {
      state.optionTimeSheets.fetching = true;
      state.error = null;
    },
    initTimeSheetCSV: (state) => {
      state.timeSheetsCSV.fetching = true;
      state.timeline.data = [];
      state.error = null;
    },
    initTimeline: (state) => {
      state.timeline.fetching = true;
      state.error = null;
    },
    initMembers: (state) => {
      state.members.fetching = true;
      state.error = null;
    },
    initCampaignList: (state) => {
      state.campaignList.fetching = true;
      state.error = null;
    },
    initConceptList: (state) => {
      state.conceptList.fetching = true;
      state.error = null;
    },
    isSuccess: (state, { payload }) => {
      state.timesheet.data = payload;
      state.timesheet.fetching = false;
    },
    isSuccessCSV: (state, { payload }) => {
      state.timeSheetsCSV.data = payload;
      state.timeSheetsCSV.fetching = false;
    },
    isSuccessChart: (state, { payload }) => {
      state.chart.data = payload;
      state.chart.fetching = false;
    },
    isSuccessConcept: (state, { payload }) => {
      state.concept.data = payload;
      state.concept.fetching = false;
    },
    isSuccessCampaign: (state, { payload }) => {
      state.campaign.data = payload;
      state.campaign.fetching = false;
    },
    isSuccessStats: (state, { payload }) => {
      state.statistics.data = payload;
      state.statistics.fetching = false;
    },
    isSuccessOption: (state, { payload }) => {
      state.optionTimeSheets.data = payload;
      state.optionTimeSheets.fetching = false;
    },
    isSuccessTimelog: (state, { payload }) => {
      state.timelog.data = payload;
      state.timelog.fetching = false;
    },
    isSuccessTimeline: (state, { payload }) => {
      state.timeline.data = payload;
      state.timeline.fetching = false;
    },
    isSuccessMembers: (state, { payload }) => {
      state.members.data = payload;
      state.members.fetching = false;
    },
    isSuccessCampaignsList: (state, { payload }) => {
      state.campaignList.data = payload;
      state.campaignList.fetching = false;
    },
    isSuccessConceptList: (state, { payload }) => {
      state.conceptList.data = payload;
      state.conceptList.fetching = false;
    },
    successUpdate: (state, { payload }) => {
      // state.timeline.data = state.timeline.data.map(
      //   (log) => (log.timeline_id === payload.timer_id ? payload : log)
      // );
      return {
        ...state,
        timesheet: {
          ...state?.timesheet,
          data: {
            ...state?.timesheet?.data,
            timesheet: state?.timesheet?.data?.timesheet?.map((log) =>
              log.timer_id === payload.timer_id ? payload : log
            ),
          },
        },
        timeline: {
          ...state?.timeline,
          data: payload.timeline,
        },
      };
    },
    successPresetUpdate: (state, { payload }) => {
      return {
        ...state,
        timelog: {
          ...state.timelog,
          data: {
            ...state.timelog.data,
            campaign: payload.campaign,
            concept: payload.concept,
            partner: payload.partner,
            category: payload.category,
          },
        },
      };
    },
    isError: (state, { payload }) => {
      state.error = payload;
      state.fetching = false;
    },
  },
});

export const {
  initTimesheet,
  initTimelog,
  initTimesheetChart,
  initoptionTimeSheets,
  initTimeSheetCSV,
  initTimesheetConcept,
  initTimesheetCampaign,
  initTimeline,
  initMembers,
  initCampaignList,
  initConceptList,
  isSuccess,
  isSuccessChart,
  isSuccessStats,
  isSuccessOption,
  isSuccessCSV,
  isSuccessConcept,
  isSuccessCampaign,
  isSuccessTimeline,
  isSuccessTimelog,
  isSuccessMembers,
  isSuccessCampaignsList,
  isSuccessConceptList,
  successUpdate,
  successPresetUpdate,
  isError,
} = timesheet.actions;

export const getTimesheet =
  (
    search,
    user_id,
    partner_id,
    campaign_id,
    concept_id,
    date,
    timer_id,
    datafilter
  ) =>
  async (dispatch) => {
    dispatch(initTimesheet());
    console.log(concept_id);
    if (
      search != null ||
      user_id != null ||
      partner_id != null ||
      campaign_id != null ||
      concept_id != null ||
      date != null ||
      timer_id != null ||
      datafilter != null
    ) {
      const { success, message, data } = await requestTimesheet(
        search,
        user_id,
        partner_id,
        campaign_id,
        concept_id,
        date,
        timer_id,
        datafilter
      );

      if (success) {
        dispatch(isSuccess(data));
      } else {
        dispatch(isError(message));
      }
    } else {
      const { success, message, data } = await requestTimesheetAll();

      if (success) {
        dispatch(isSuccess(data));
      } else {
        dispatch(isError(message));
      }
    }
  };

export const getTimelogById = (timer_id, timer_type) => async (dispatch) => {
  dispatch(initTimelog());
  const { success, message, data } = await requestTimesheet(
    null,
    null,
    null,
    null,
    null,
    null,
    timer_id
  );

  if (success) {
    dispatch(
      isSuccessTimelog(
        _.find(data?.timesheet, (data) => data?.timer_type == timer_type) ?? []
      )
    );
  } else {
    dispatch(isError(message));
  }
};

export const getTimesheetStats = () => async (dispatch) => {
  dispatch(initTimesheet());
  const { success, message, data } = await requestTimesheetStats();

  if (success) {
    dispatch(isSuccessStats(data));
  } else {
    dispatch(isError(message));
  }
};

export const getTimesheetConcept = (filter) => async (dispatch) => {
  dispatch(initTimesheetConcept());
  const { success, message, data } = await requestTimesheetConcepts(filter);

  if (success) {
    dispatch(isSuccessConcept(data));
  } else {
    dispatch(isError(message));
  }
};

export const getTimesheetCampagin = (filter) => async (dispatch) => {
  dispatch(initTimesheetCampaign());
  const { success, message, data } = await requestTimesheetCampaign(filter);

  if (success) {
    dispatch(isSuccessCampaign(data));
  } else {
    dispatch(isError(message));
  }
};

export const getTimesheetCSV =
  (user_id, search, partner_id, campaign_id, dates, dateFilter, is_smartly) =>
  async (dispatch) => {
    dispatch(initTimeSheetCSV());
    await requestTimesheetAllCSV(
      user_id,
      search,
      partner_id,
      campaign_id,
      dates,
      dateFilter,
      is_smartly
    ).then((response) => {
      const blob = new Blob([response]);
      const date = new Date();

      FileSaver.saveAs(blob, `timesheet_${date.toLocaleString('en-CA')}.xlsx`);
    });
  };

export const getTimesheetChart =
  (search, userId, partnerId, campaignId, conceptId, dates, dateFilter) =>
  async (dispatch) => {
    dispatch(initTimesheetChart());
    const { success, message, data } = await requestTimesheetChart(
      search,
      userId,
      partnerId,
      campaignId,
      conceptId,
      dates,
      dateFilter
    );

    if (success) {
      dispatch(isSuccessChart(data));
    } else {
      dispatch(isError(message));
    }
  };

// export const getTimesheetAll = () => async (dispatch) => {
//   dispatch(initTimesheet());
//   const { success, message, data } = await requestTimesheetAll();

//   if (success) {
//     dispatch(isSuccess(data));
//   } else {
//     dispatch(isError(message));
//   }
// };

export const getTimesheetOption = (isSmartly) => async (dispatch) => {
  dispatch(initoptionTimeSheets());
  const { success, message, data } = isSmartly
    ? await fetchSmartlyPartnersRequest()
    : await requestTimesheetOptionList();

  if (success) {
    dispatch(isSuccessOption(data));
  } else {
    dispatch(isError(message));
  }
};

export const getTimeline = (id, type) => async (dispatch) => {
  dispatch(initTimeline());
  const { success, message, data } = await requestTimeline(id, type);

  if (success) {
    dispatch(isSuccessTimeline(data));
  } else {
    dispatch(isError(message));
  }
};

export const updateStartEnd = (params) => async (dispatch) => {
  const { success, data, message } = await requestUpdateStartEnd(params);

  if (success) {
    dispatch(successUpdate(data[0]));
  } else {
    dispatch(isError(message));
  }
};

export const updatePresetTimer = (params, timer_type) => async (dispatch) => {
  const { success, data, message } = await updateTimerRequest(params);

  if (success) {
    params?.task_type_id && params?.task_category_id
      ? dispatch(getTimelogById(params?.id, timer_type))
      : dispatch(successPresetUpdate(_.first(data)));
  } else {
    dispatch(isError(message));
  }
};

export const getMembers = () => async (dispatch) => {
  dispatch(initMembers());
  const { success, message, data } = await requestUsers();

  if (success) {
    dispatch(isSuccessMembers(data?.data));
  } else {
    dispatch(isError(message));
  }
};

export const getCampaignsList = () => async (dispatch) => {
  dispatch(initCampaignList());
  const { success, message, data } = await fetchCampaignsRequest();

  if (success) {
    dispatch(isSuccessCampaignsList(data));
  } else {
    dispatch(isError(message));
  }
};

export const getConceptList = () => async (dispatch) => {
  dispatch(initConceptList());
  const { success, message, data } = await fetchConceptsequest();

  if (success) {
    dispatch(isSuccessConceptList(data));
  } else {
    dispatch(isError(message));
  }
};

export default timesheet.reducer;
