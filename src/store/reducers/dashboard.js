import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  requestDashboardStatusCount,
  requestDashboardResources,
  requestDashboardTimelog,
  requestDashboardFilters,
  requestDashboardTicket,
  requestDashboardTicketCount,
  requestDashboardResourcesWithProgress,
  requestDashboardBriefCount,
} from 'services/api/dashboard';

import { requestUsers } from 'services/api/user';

import { requestStatus } from 'services/api/status';

import { requestPriorityFlag } from 'services/api/maintenance';

import { requestBulkUpdateKey, requestUpdateKey } from 'services/api/updateKey';

import {
  requestTicketPriorityFlag,
  requestTicketStatus,
  requestUpdateAssignees,
  requestUpdatePriority,
  requestUpdateStatus,
} from 'services/api/ticket';

import { requestUpdateTaskByKey } from 'services/api/tasks';

import { formatDate } from 'utils/date';

import { initTimeLogs } from './timer';
import moment from 'moment-timezone';
import {
  requestGetBrief,
  requestUpdatBriefAssignees,
  requestUpdateBriefByKey,
} from 'services/api/brief';

const initialState = {
  statusCount: {},
  totalTime: {},
  dashboard: {},
  resources: {},
  members: [],
  statuses: [],
  priorities: [],
  fetchUpdateKey: false,
  fetchStatusCount: false,
  fetchTotalTime: false,
  fetchDashboard: false,
  fetchResources: false,
  fetchMembers: false,
  fetchStatuses: false,
  fetchPriorities: false,
  errorUpdateKey: null,
  errorStatusCount: null,
  errorTotalTime: null,
  errorDashboard: null,
  errorResources: null,
  errorMembers: null,
  errorStatuses: null,
  errorPriorities: null,
  fetchRepullDashboard: false,
};

const dashboard = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    initDashboard: (state) => {
      state.fetchDashboard = true;
      state.errorDashboard = null;
    },
    initRepullDashboard: (state) => {
      state.fetchRepullDashboard = true;
      state.errorDashboard = null;
    },
    initStatusCount: (state) => {
      state.fetchStatusCount = true;
      state.errorStatusCount = null;
    },
    initTotalTime: (state) => {
      state.fetchTotalTime = true;
      state.errorTotalTime = null;
    },
    initResources: (state) => {
      // state.fetchResources = true;
      state.errorResources = null;
    },
    initMembers: (state) => {
      state.fetchMembers = true;
      state.errorMembers = null;
    },
    initStatuses: (state) => {
      state.fetchStatuses = true;
      state.errorStatuses = null;
    },
    initPriorities: (state) => {
      state.fetchPriorities = true;
      state.errorPriorities = null;
    },
    successDashboard: (state, { payload }) => {
      state.dashboard = payload;
      state.fetchDashboard = false;
      state.errorDashboard = null;
    },
    successRepullDashboard: (state, { payload }) => {
      state.dashboard = payload;
      state.fetchRepullDashboard = false;
      state.errorDashboard = null;
    },
    successTotalTime: (state, { payload }) => {
      state.totalTime = payload;
      state.fetchTotalTime = false;
      state.errorTotalTime = null;
    },
    successStatusCount: (state, { payload }) => {
      state.statusCount = payload;
      state.fetchStatusCount = false;
      state.errorStatusCount = null;
    },
    successResources: (state, { payload }) => {
      state.resources =
        payload.current_page === 1
          ? payload
          : {
              ...payload,
              data: [...(state.resources?.data ?? []), ...(payload.data ?? [])],
            };
      state.fetchResources = false;
      state.errorResources = null;
    },
    initUpdateKey: (state) => {
      state.fetchUpdateKey = true;
      state.errorUpdateKey = null;
    },
    successMembers: (state, { payload }) => {
      state.members = {
        ...payload,
        data: payload.data.map((i) => ({ ...i, user_id: i.id })),
      };
      state.fetchMembers = false;
      state.errorMembers = null;
    },
    successStatuses: (state, { payload }) => {
      state.statuses = payload;
      state.fetchStatuses = false;
      state.errorStatuses = null;
    },
    successPriorities: (state, { payload }) => {
      state.priorities = payload;
      state.fetchPriorities = false;
      state.errorPriorities = null;
    },
    successUpdateKey: (state, { payload }) => {
      const {
        params1: { id, key },
        response, // api response
      } = payload;

      switch (key) {
        case 'campaign_launch_date':
        case 'campaign_end_date':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((brief) =>
                  brief?.id === id ? response : brief
                ),
              },
            },
          };

        case 'brief_status':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((brief) =>
                  brief?.id === id
                    ? {
                        ...brief,
                        status: _.startCase(response.status.replace('_', ' ')),
                      }
                    : brief
                ),
              },
            },
          };

        case 'brief_priority':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((brief) =>
                  brief?.id === id
                    ? {
                        ...brief,
                        priority: response.priority,
                      }
                    : brief
                ),
              },
            },
          };

        case 'brief_assignees':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((brief) =>
                  brief?.id === id
                    ? {
                        ...brief,
                        assignees: response,
                      }
                    : brief
                ),
              },
            },
          };
        case 'task_status':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((task) =>
                  task?.id === id
                    ? {
                        ...task,
                        status: _.startCase(response.status.replace('_', ' ')),
                        status_id: response.status_id,
                      }
                    : task
                ),
              },
            },
          };

        case 'task_priority':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((task) =>
                  task?.id === id
                    ? {
                        ...task,
                        priority: response.priority,
                        priority_id: response.priority_id,
                      }
                    : task
                ),
              },
            },
          };

        case 'task_due_date':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((task) =>
                  task?.id === id
                    ? {
                        ...task,
                        due_date: response.due_date,
                      }
                    : task
                ),
              },
            },
          };

        case 'task_delivery_date':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((task) =>
                  task?.id === id
                    ? {
                        ...task,
                        delivery_date: response.delivery_date,
                      }
                    : task
                ),
              },
            },
          };

        case 'task_assignees':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((task) =>
                  task?.id === id
                    ? {
                        ...task,
                        assignees: response,
                      }
                    : task
                ),
              },
            },
          };

        case 'ticket_priority':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data.map((ticket) =>
                  ticket?.id === id
                    ? {
                        ...ticket,
                        priority: response,
                      }
                    : ticket
                ),
              },
            },
          };

        case 'ticket_assignees':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data.map((ticket) =>
                  ticket?.id === id
                    ? {
                        ...ticket,
                        assignee: response,
                      }
                    : ticket
                ),
              },
            },
          };
        case 'ticket_status':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data.map((ticket) =>
                  ticket?.id === id
                    ? {
                        ...ticket,
                        status: {
                          ...state?.dashboard?.data?.status,
                          id: response,
                        },
                      }
                    : ticket
                ),
              },
            },
          };

        default:
          break;
      }
    },
    successBulkUpdateKey: (state, { payload }) => {
      const {
        params: { key, ids },
        response, // api response
      } = payload;

      switch (key) {
        case 'task_status':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((task) =>
                  _.find(ids, {
                    id: task?.id,
                  })
                    ? {
                        ...task,
                        status: response.status,
                        status_id: response.status_id,
                      }
                    : task
                ),
              },
            },
          };
        case 'task_due_date':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((task) =>
                  _.find(ids, {
                    id: task?.id,
                  })
                    ? {
                        ...task,
                        due_date: response,
                      }
                    : task
                ),
              },
            },
          };
        case 'task_delivery_date':
          return {
            ...state,
            dashboard: {
              ...state?.dashboard,
              all_tasks: {
                ...state?.dashboard?.all_tasks,
                data: state?.dashboard?.all_tasks?.data?.map((task) =>
                  _.find(ids, {
                    id: task?.id,
                  })
                    ? {
                        ...task,
                        delivery_date: response,
                      }
                    : task
                ),
              },
            },
          };
        default:
          break;
      }
    },
    successUpdateDashboard: (state, { payload }) => {
      const assignees = payload.assignees.map((data) => ({
        user_id: data.id,
        username: data.name,
        avatar: data.avatar,
      }));

      return {
        ...state,
        dashboard: {
          ...state?.dashboard,
          all_tasks: {
            ...state?.dashboard?.all_tasks,
            data: state?.dashboard?.all_tasks?.data?.map((task) =>
              task?.id === payload.id
                ? {
                    ...task,
                    due_date: payload.due_date,
                    delivery_date: payload.delivery_date,
                    status: _.startCase(payload.status?.replace(/_/g, ' ')),
                    status_id: payload.status_id,
                    priority: _.isEqual(payload.priority_description, 'Normal')
                      ? 'Medium'
                      : _.startCase(payload.priority_description),
                    priority_id: payload.priority_id,
                    assignees: assignees,
                  }
                : task
            ),
          },
        },
      };
    },
    errorDashboard: (state, { payload }) => {
      state.errorDashboard = { message: payload };
      state.fetchDashboard = false;
    },
    errorTotalTime: (state, { payload }) => {
      state.fetchTotalTime = false;
      state.errorTotalTime = { message: payload };
    },
    errorStatusCount: (state, { payload }) => {
      state.fetchStatusCount = false;
      state.errorStatusCount = { message: payload };
    },
    errorResources: (state, { payload }) => {
      state.fetchResources = false;
      state.errorResources = { message: payload };
    },
    errorUpdateKey: (state, { payload }) => {
      state.fetchUpdateKey = false;
      state.errorUpdateKey = { message: payload };
    },
    resetDashboard: (state) => {
      state.dashboard = initialState.dashboard;
    },
    reset: () => initialState,
  },
});

export const {
  initDashboard,
  initStatusCount,
  initTotalTime,
  initResources,
  initRepullDashboard,
  initMembers,
  initStatuses,
  initPriorities,
  initUpdateKey,
  successDashboard,
  successStatusCount,
  successTotalTime,
  successResources,
  successRepullDashboard,
  successMembers,
  successStatuses,
  successPriorities,
  successUpdateKey,
  successBulkUpdateKey,
  errorUpdateKey,
  errorDashboard,
  errorStatusCount,
  errorTotalTime,
  errorResources,
  errorMembers,
  errorStatuses,
  errorPriorities,
  successUpdateDashboard,
  resetDashboard,
  reset,
} = dashboard.actions;

export const getDashboardTasks =
  (page = 1, limit = 20, params, type, teamId, queue, search, dashboardData) =>
  async (dispatch) => {
    type === 'repull'
      ? dispatch(initRepullDashboard())
      : dispatch(initDashboard());

    params = {
      ...params,
      filter: {
        ...params?.filter,
        favorites: _.isEqual(queue, 'favorites') && true,
        queues: queue,
        name: search,
      },
    };

    if (queue === 'briefs') {
      let data = {};

      // Get counts
      if (_.isEmpty(dashboardData)) {
        const paramsWithoutBrief = _.omit(params, ['brief']);
        const { data: dashboardTasks } = await requestDashboardFilters(
          page,
          limit,
          paramsWithoutBrief
        );
        data = {
          ...dashboardTasks,
        };
        delete data.all_tasks;
      }

      const {
        data: dashboardBrief,
        success,
        message,
      } = await requestGetBrief({
        page,
        per_page: limit,
        filter: {
          title: search,
          partner_id: params.brief.partner.map((p) => p.id ?? p.uuid).join(','),
          region: params?.brief?.region,
          assignees: params?.brief?.assignees?.map((data) => data.id),
          request_type: params?.brief?.request_type,
          status: params?.brief?.status,
          priority: params?.brief?.priority,
          sort: _.first(params?.brief?.sort),
        },
      });

      const { data: count } = await requestDashboardBriefCount(params?.filter);

      // Pass dashboard data if not empty, use counts from dashboardData
      data = {
        ...(!_.isEmpty(dashboardData) ? dashboardData : data),
        all_tasks: dashboardBrief,
        briefs: count,
      };

      if (teamId === 24 || teamId === 2) {
        const { data: ticketCount } = await requestDashboardTicketCount(
          params?.filter
        );
        data = { ...data, saas_support: _.first(ticketCount).all_ticket };
      }

      success
        ? type === 'repull'
          ? dispatch(successRepullDashboard(data))
          : dispatch(successDashboard(data))
        : dispatch(errorDashboard(message));
    } else if (teamId === 24 || teamId === 2) {
      let data = {};
      let success = true;
      let message = '';
      const paramsWithoutBrief = _.omit(params, ['brief']);

      const { data: count } = await requestDashboardBriefCount(params?.filter);
      const { data: ticketCount } = await requestDashboardTicketCount(
        params?.filter
      );

      if (queue === 'saas_support') {
        // Get Count
        if (_.isEmpty(dashboardData)) {
          const { data: dashboardTasks } = await requestDashboardFilters(
            page,
            limit,
            paramsWithoutBrief
          );
          data = {
            ...dashboardTasks,
          };
        }

        delete data.all_tasks;

        const { data: dashboardTickets } = await requestDashboardTicket(
          page,
          limit,
          params?.filter,
          params?.sort.toString()
        );

        data = {
          ...(!_.isEmpty(dashboardData) ? dashboardData : data),
          all_tasks: dashboardTickets,
          saas_support: _.first(ticketCount).all_ticket,
          briefs: count,
        };
      } else {
        const { data: dashboardTasks } = await requestDashboardFilters(
          page,
          limit,
          paramsWithoutBrief
        );
        data = {
          ...dashboardTasks,
          saas_support: _.first(ticketCount).all_ticket,
          briefs: count,
        };
      }

      success
        ? type === 'repull'
          ? dispatch(successRepullDashboard(data))
          : dispatch(successDashboard(data))
        : dispatch(errorDashboard(message));
    } else if (teamId !== 11 && teamId !== 21) {
      delete params.brief;
      const {
        success,
        data: dashboardTasks,
        message,
      } = await requestDashboardFilters(page, limit, params);

      const { data: count } = await requestDashboardBriefCount(params?.filter);

      let data = {
        ...dashboardTasks,
        briefs: count,
      };

      success
        ? type === 'repull'
          ? dispatch(successRepullDashboard(data))
          : dispatch(successDashboard(data))
        : dispatch(errorDashboard(message));
    } else {
      const success = true;
      const { data: dashboardTickets, message } = await requestDashboardTicket(
        page,
        limit,
        params?.filter,
        params?.sort.toString()
      );
      const { data: count } = await requestDashboardTicketCount(params?.filter);

      const data = {
        ..._.first(count),
        all_tasks: dashboardTickets ?? [],
      };

      success
        ? type === 'repull'
          ? dispatch(successRepullDashboard(data))
          : dispatch(successDashboard(data))
        : dispatch(errorDashboard(message));
    }
  };

export const getStatusCounter = (teamdId) => async (dispatch) => {
  dispatch(initStatusCount());

  const { success, data, message } = await requestDashboardStatusCount(teamdId);

  success
    ? dispatch(successStatusCount(teamdId == 11 ? data[0] : data))
    : dispatch(errorStatusCount(message));
};

export const getResources = () => async (dispatch) => {
  dispatch(initResources());

  const { success, data, message } = await requestDashboardResources();

  success
    ? dispatch(successResources(data))
    : dispatch(errorResources(message));
};

export const getResourcesWithProgress = (team, page) => async (dispatch) => {
  dispatch(initResources());

  const { success, data, message } =
    await requestDashboardResourcesWithProgress(team, page);

  const excludedUsers = [
    'Melete Tejada',
    'developer Dev',
    'Jay Van Egot',
    'Carmela Guevarra',
    'Paul Gob',
    'Hazel Dimaano',
    'Bam Villar',
    'Krizelle Estrella',
    'Eros Arbilon',
    'James Mandal',
    'Krisha Roxas',
    'Romel Ordinario',
    'ad-weave administrator',
    'Test H5',
    'Abigail Dizon',
    'Regine Resurreccion',
    'Test Design',
    'Abi  Padilla-De Leon',
    'Test 2 Smartly',
    'Test Video',
    'Catherine Sanchez',
    'Miguel Fidel',
    'Kristian Nabus',
    'Test AD',
    'Joshua Chua',
    'Markwil Abiera',
  ];

  const filteredUser = data?.data?.filter((user) => {
    let schedule = user.schedule.trim();
    const [startDay, endDay] = schedule.split(' - ');
    const [startTimeStr, endTimeStr] = user.time.split(' - ');
    const startTime = moment(startTimeStr, 'hh:mm A');
    const endTime = moment(endTimeStr, 'hh:mm A');

    const startIdx = moment.weekdays().indexOf(startDay);
    const endIdx = moment.weekdays().indexOf(endDay);
    const currentIdx = moment.weekdays().indexOf(moment().format('dddd'));

    const currentZonedTime = moment.tz(user.time_zone).format();

    if (schedule === '-' || schedule === '') {
      schedule = 'Monday - Friday';
    }

    if (excludedUsers.includes(user.fullname)) return false;
    // if (user.running_timer) return false;

    // If the schedule is within the same week (e.g., Monday to Friday)
    if (startIdx <= endIdx) {
      if (currentIdx >= startIdx && currentIdx <= endIdx) {
        return true;
      }
    } else {
      // Specifically check the "next day" after the endIdx, which should also return true for schedules like Friday to Sunday
      // For example: Friday to Sunday should allow Monday to be valid.
      const nextDayIdx = (endIdx + 1) % 7;

      // If the schedule spans across the end of the week (e.g., Friday to Sunday)
      if (
        currentIdx >= startIdx ||
        currentIdx <= endIdx ||
        currentIdx === nextDayIdx
      ) {
        const currentTime = moment().tz(currentZonedTime).set({
          hour: currentZonedTime.getHours(),
          minute: currentZonedTime.getMinutes(),
          second: 0,
          millisecond: 0,
        });

        const startOfDay = moment().tz(currentZonedTime).startOf('day'); // 00:00:00
        const endOfDay = moment().tz(currentZonedTime).endOf('day'); // End of the day for comparisons

        // If the end time is earlier than the start time, the range spans midnight
        if (endTime < startTime) {
          // Check if current time is either before midnight or after midnight
          return (
            (currentTime.isSameOrAfter(startOfDay) &&
              currentTime.isSameOrBefore(endOfDay)) ||
            (currentTime.isSameOrAfter(startOfDay) &&
              currentTime.isSameOrBefore(endOfDay))
          );
        } else {
          // Normal time interval comparison
          return (
            currentTime.isSameOrAfter(startOfDay) &&
            currentTime.isSameOrBefore(endOfDay)
          );
        }
      }
    }

    return false;
  });

  success
    ? dispatch(successResources({ ...data, data: filteredUser }))
    : dispatch(errorResources(message));
};

export const getMembers = () => async (dispatch) => {
  dispatch(initMembers());

  const { success, message, data } = await requestUsers();

  success ? dispatch(successMembers(data)) : dispatch(errorMembers(message));
};

export const getStatuses = (type, teamId) => async (dispatch) => {
  dispatch(initStatuses());
  let status;

  teamId === 11 || teamId === 21
    ? (status = await requestTicketStatus())
    : (status = await requestStatus(type));

  const { success, message, data } = status;

  if (success) {
    teamId === 11 || teamId === 21
      ? dispatch(
          successStatuses(
            _.flatMap(data, (data, key) => {
              return { id: Number(key), name: data };
            })
          )
        )
      : dispatch(successStatuses(data));
  } else dispatch(errorStatuses(message));
};

export const getPriorities = (teamId) => async (dispatch) => {
  dispatch(initPriorities());
  let priorities;

  teamId === 11 || teamId === 21
    ? (priorities = await requestTicketPriorityFlag())
    : (priorities = await requestPriorityFlag());

  const { success, message, data } = priorities;

  if (success) {
    teamId === 11 || teamId === 21
      ? dispatch(
          successPriorities(
            _.flatMap(data, (data, key) => {
              return { id: key, name: data };
            })
          )
        )
      : dispatch(successPriorities(data));
  } else dispatch(errorPriorities(message));
};

export const getDashboardTotalTime = (teamdId) => async (dispatch) => {
  dispatch(initTimeLogs());

  const { success, data, message } = await requestDashboardTimelog(teamdId);
  success
    ? dispatch(successTotalTime(data))
    : dispatch(errorTotalTime(message));
};

export const updateGlobal =
  (params1, params2, onFailure = () => {}) =>
  async (dispatch) => {
    dispatch(initUpdateKey());

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

    if (success)
      dispatch(successUpdateKey({ params1, params2, response: data ?? {} }));
    else {
      dispatch(errorUpdateKey(message));
      onFailure(message);
    }
  };

export const updateBulkGlobal =
  (params, onFailure = () => {}) =>
  async (dispatch) => {
    const { success, data, message } = await requestBulkUpdateKey(params);
    if (success)
      dispatch(successBulkUpdateKey({ params, response: data ?? null }));
    else {
      onFailure(message);
    }
  };

export const updateTicketGlobal = (params1, params2) => async (dispatch) => {
  dispatch(initUpdateKey());

  const { success, data, message } = await setData(params1?.key, params1);

  success
    ? dispatch(successUpdateKey({ params1, params2, response: data ?? {} }))
    : dispatch(errorUpdateKey(message));
};

const setData = (type, params) => {
  switch (type) {
    case 'ticket_priority':
      return requestUpdatePriority({ id: params?.id, priority: params?.value });
    case 'ticket_assignees':
      return requestUpdateAssignees({ id: params?.id, user_id: params?.value });
    case 'ticket_status':
      return requestUpdateStatus({ id: params?.id, status: params?.value });
  }
};

export const updateBriefGlobal = (params1, params2) => async (dispatch) => {
  dispatch(initUpdateKey());

  const { success, data, message } = await requestUpdateBriefByKey({
    ...params1,
    key: params1.key.replace('brief_', ''),
  });

  success
    ? dispatch(successUpdateKey({ params1, params2, response: data ?? {} }))
    : dispatch(errorUpdateKey(message));
};

export default dashboard.reducer;
