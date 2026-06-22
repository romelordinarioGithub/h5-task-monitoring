import React, { createContext, useEffect, useState, useRef } from 'react';

import PropTypes from 'prop-types';

import downloadCsv from 'download-csv';

import { useDispatch, useSelector } from 'react-redux';
import CircularLoader from 'components/Common/CircularLoader';

import { useLocation } from 'react-router-dom';
import {
  getDashboardTasks,
  getDashboardTotalTime,
  getStatusCounter,
  getMembers,
  getStatuses,
  getPriorities,
  updateTicketGlobal,
  resetDashboard,
  updateBulkGlobal,
  getResourcesWithProgress,
  updateBriefGlobal,
  updateBriefAssignee,
} from 'store/reducers/dashboard';

import { updateGlobal } from 'store/reducers/dashboard';

import _ from 'lodash';

import GlobalPopover from 'components/Common/Popover';

import Filters from 'pages/Dashboard/components/Filters';
import Users from 'pages/Dashboard/components/Filters/Users';
import Status from 'pages/Dashboard/components/Filters/Status';
import Priority from 'pages/Dashboard/components/Filters/Priority';
import DateTime from 'pages/ConceptOverview/components/common/DateTime';
import moment from 'moment';
import {
  getDefaultTableFilters,
  resourceTeamCodeLookup,
  smartlyFilterList,
  ticketPriorityFlag,
} from 'pages/Dashboard/constant';

import {
  setDashboardFilters,
  setNumRows,
  resetAdvanceFilters,
} from 'store/reducers/filters';

import Swal from 'sweetalert2';
import GlobalDialog from 'pages/ConceptOverview/components/GlobalDialog';
import AdvanceFilters from '../components/AdvanceFilters';

const DashboardContext = createContext();

let delayDebounceFn;
// let timer;
// let resourceInterval;

const ToastError = Swal.mixin({
  toast: true,
  icon: 'error',
  width: 370,
  position: 'top-right',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export function DashboardProvider({ children }) {
  const {
    statusCount,
    totalTime,
    dashboard,
    resources,
    members,
    statuses,
    priorities,
    fetchStatuses,
    fetchMembers,
    fetchPriorities,
    fetchStatusCount,
    fetchTotalTime,
    fetchDashboard,
    fetchResources,
    fetchRepullDashboard,
    errorStatusCount,
    errorTotalTime,
    errorDashboard,
    errorResources,
  } = useSelector((state) => state.dashboard);

  const { data: user } = useSelector((state) => state.user);

  const { team_id, admin_role } = user;

  const {
    dashboard: { state, numRows },
  } = useSelector((state) => state.filters);

  const location = useLocation();
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(location.search);
  const queue = urlParams.get('queue');
  const isDashboardPath = ['/dashboard', '/'].includes(
    window.location.pathname
  );

  const [page, setPage] = useState(0);

  const [tab, setTab] = useState(queue === null ? 'dashboard' : queue);

  const [counter, setCounter] = useState(60);

  // const [resourcesTimer, setResourcesTimer] = useState(300);

  const [openFilter, setOpenFilter] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const [onFocusTab, setOnFocusTab] = useState(true);

  // popper
  const [popoverType, setPopoverType] = useState(null);
  const [value, setValue] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [isParent, setIsParent] = useState(null);

  // Selected table rows
  const [selectedRows, setSelectedRows] = useState([]);

  // Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);

  const [search, setSearch] = useState('');

  const defaultProps = getDefaultTableFilters(queue, team_id, user);

  // First Update
  // const firstUpdate = useRef(true);

  const lastLoadedFilters = useRef(null);
  const lastSearch = useRef('');
  const lastQueueType = useRef('');
  const hasLoadedResources = useRef(false);

  const queueType =
    _.isNull(queue) || queue === 'dashboard'
      ? 'all_task'
      : queue.includes('-')
      ? queue.replace(/-/g, '_')
      : queue === 'unanswered'
      ? 'unresponded'
      : queue;

  const loadDashboard = (filters) => {
    if (
      isDashboardPath &&
      (!_.isEqual(lastLoadedFilters.current, filters) ||
        lastSearch.current !== search ||
        lastQueueType.current !== queueType)
    ) {
      dispatch(
        getDashboardTasks(
          1,
          numRows,
          filters,
          '',
          team_id,
          queueType,
          search,
          dashboard
        )
      );
      dispatch(getStatusCounter(queue === 'saas-support' ? 11 : team_id));
      dispatch(getDashboardTotalTime(team_id));

      setCounter(60);
      lastLoadedFilters.current = filters;
      lastSearch.current = search;
      lastQueueType.current = queueType;
    }
  };

  // Focus on Tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      setOnFocusTab(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Load Resources
  useEffect(() => {
    if (isDashboardPath && onFocusTab && !hasLoadedResources.current) {
      dispatch(getResourcesWithProgress(resourceTeamCodeLookup[team_id]));
      hasLoadedResources.current = true;
    }
  }, [isDashboardPath, onFocusTab]);

  useEffect(() => {
    if (counter === 0) {
      handleRepullDashboard();
      setCounter(60);
      return;
    }

    if (
      !isDashboardPath ||
      fetchDashboard ||
      fetchRepullDashboard ||
      !onFocusTab
    ) {
      return;
    }

    const intervalId = setInterval(() => setCounter((prev) => prev - 1), 1000);
    return () => clearInterval(intervalId);
  }, [
    counter,
    fetchDashboard,
    fetchRepullDashboard,
    isDashboardPath,
    onFocusTab,
  ]);

  useEffect(() => {
    loadDashboard(state);
  }, [queue, isDashboardPath, search]);

  useEffect(() => {
    if (_.isEmpty(state?.filter)) {
      dispatch(
        setDashboardFilters(getDefaultTableFilters(queue, team_id, user))
      );
      return;
    }

    if (_.isEmpty(state?.brief)) {
      dispatch(
        setDashboardFilters(getDefaultTableFilters(queue, team_id, user))
      );
      return;
    }

    if (!_.isUndefined(team_id)) {
      dispatch(
        setDashboardFilters({
          ...state,
          filter: {
            ...state?.filter,
            favorites: _.isEqual(queue, 'favorites') && true,
            team_id:
              _.filter(smartlyFilterList, (data) => {
                if (_.isEqual(data.id, team_id)) return data;
              })[0]?.team_id || null,
          },
        })
      );
      setTab(_.isNull(queue) ? 'dashboard' : queue);
    }
  }, [queue, team_id]);

  const handlePopover = (e, _type, _value, _id, _channel, _isParent) => {
    const isBulkUpdate = _.size(selectedRows) > 1;

    // Support only status, due date and delivery date fields for bulk editing
    if (
      isBulkUpdate &&
      ![
        'task_status',
        'task_due_date',
        'task_delivery_date',
        'table_filter',
      ].includes(_type)
    ) {
      Swal.fire({
        icon: 'warning',
        title: `<p style="font-size: 0.7em">This feature is coming soon.</p>`,
        showCancelButton: false,
        confirmButtonText: 'Yes',
      });
    } else {
      // Prevent popovers from appearing when bulk edit is enabled and the row being edited is not selected.
      if (
        isBulkUpdate &&
        _type !== 'table_filter' &&
        !_.find(selectedRows, {
          id: _id,
        })
      )
        return;

      setOpenFilter(!openFilter);
      setAnchorEl(e.currentTarget);
      setPopoverType(_type);
      setValue(_value); // default data
      setUpdateId(_id); // task/rel id
      setIsParent(_isParent);

      switch (_type) {
        case 'table_filter':
          _.isEmpty(statuses) && dispatch(getMembers());
          _.isEmpty(members) && dispatch(getStatuses(3, team_id));
          _.isEmpty(priorities) && dispatch(getPriorities(team_id));
          break;
        case 'ticket_status':
        case 'task_status':
        case 'subtask_status':
        case 'task_status_campaign':
        case 'subtask_status_campaign':
        case 'brief_status':
          _.isEmpty(statuses) && dispatch(getStatuses(3, team_id));
          break;
        case 'campaign_followers':
        case 'concept_followers':
        case 'task_assignees':
        case 'ticket_assignees':
        case 'task_watchers':
        case 'brief_assignees':
          _.isEmpty(members) && dispatch(getMembers());
          break;
        case 'task_priority':
        case 'ticket_priority':
        case 'brief_priority':
          _.isEmpty(priorities) && dispatch(getPriorities(team_id));
          break;
      }
    }
  };

  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const handleSearch = (value) => {
    clearTimeout(delayDebounceFn);

    delayDebounceFn = setTimeout(() => {
      setSearch(value);
    }, 1000);
  };

  const handleResetFilters = () => {
    dispatch(resetAdvanceFilters());
    dispatch(setDashboardFilters(getDefaultTableFilters(queue, team_id, user)));
    loadDashboard(getDefaultTableFilters(queue, team_id, user));
    setPage(0);
  };

  const handlePaginationPageChange = (_, newPage) => {
    setPage(newPage);
    setCounter(60);
    dispatch(
      getDashboardTasks(
        newPage + 1,
        numRows,
        state,
        'repull',
        team_id,
        queueType,
        search,
        dashboard
      )
    );
  };

  const handlePaginationRowPageChange = (event) => {
    dispatch(setNumRows(parseInt(event.target.value)));
    setPage(0);
    setCounter(60);
    dispatch(
      getDashboardTasks(
        1,
        event.target.value,
        state,
        'repull',
        team_id,
        queueType,
        search,
        dashboard
      )
    );
  };

  const handleRepullDashboard = () => {
    dispatch(
      getDashboardTasks(
        page,
        numRows,
        state,
        'repull',
        team_id,
        queueType,
        search,
        dashboard
      )
    );
    setCounter(60);
  };

  const handlePaginationResources = () => {
    dispatch(
      getResourcesWithProgress(
        resourceTeamCodeLookup[team_id],
        resources.current_page + 1
      )
    );
  };

  const handleTableSort = (value) => {
    const isBrief = queue === 'briefs';
    const filters = isBrief
      ? {
          ...state,
          brief: {
            ...state.brief,
            sort: [value],
          },
        }
      : {
          ...state,
          sort: [value],
        };
    dispatch(setDashboardFilters(filters));
    loadDashboard(filters);
  };

  const handleOnFilterChange = (filters) => {
    dispatch(
      setDashboardFilters({
        ...state,
        filter: { ...state.filter, ...filters },
      })
    );
  };

  const handleUpdateGlobal = (_value, _data) => {
    const isBulkUpdate = _.size(selectedRows) > 1;
    if (isBulkUpdate) {
      Swal.fire({
        icon: 'warning',
        title: `<p style="font-size: 0.7em">You have selected multiple rows.\nDo you want to continue?</p>`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          const params = {
            key: popoverType,
            ids: selectedRows,
            is_parent: isParent ? 1 : 0,
            value: _value,
          };
          dispatch(
            updateBulkGlobal(params, (message) => {
              ToastError.fire({
                title: message,
              });
            })
          );
        }
      });
    } else {
      if (queue === 'briefs') {
        dispatch(
          updateBriefGlobal(
            {
              id: updateId,
              key: popoverType,
              value: popoverType.includes('priority')
                ? priorities.find(({ id }) => id === _value).name
                : _value,
            },
            {
              data: _data, // any form of data e.g string/object/array
            }
          )
        );
      } else if (team_id !== 11 || team_id !== 21)
        dispatch(
          updateGlobal(
            {
              id: updateId,
              is_parent: isParent ? 1 : 0,
              key: popoverType.replace('_campaign', ''),
              value: _value,
            },
            {
              data: _data, // any form of data e.g string/object/array
            },
            (error) => {
              ToastError.fire({
                title: error,
              });
            }
          )
        );
      else
        dispatch(
          updateTicketGlobal(
            {
              id: updateId,
              key: popoverType.replace('_campaign', ''),
              value: _value,
            },
            {
              data: _data, // any form of data e.g string/object/array
            }
          )
        );
    }

    popoverType.includes('date') && setAnchorEl(null);
  };

  const handleDownloadTable = () => {
    let columns = {};
    let data = [];
    if (queue === 'briefs') {
      columns = {
        id: 'Brief Id',
        name: 'Name',
        email: 'User Email',
        status: 'Status',
        priority: 'Priority',
        assignees: 'Assignees',
        created_at: 'Date Created',
        campaign_launch_date: 'Est. Delivery Date',
        campaign_end_date: 'Est. Campaign End Date',
        tags: 'Tags',
      };

      data = dashboard?.all_tasks?.data.map((data) => ({
        id: data.id,
        name: `Brief ${data.id} - ${_.get(data, 'company_name.value')} - ${
          data.title
        }`,
        email: data.user_email,
        status: _.isEmpty(data.status) ? 'NULL' : data.status,
        priority: _.isEmpty(data.priority) ? 'NULL' : data.priority,
        assignees: _.isEmpty(data.assignees)
          ? 'NULL'
          : data.assignees
              .map((user) => user.name)
              .toString()
              .split(',')
              .join(';'),
        created_at: _.isEmpty(data.created_at) ? 'NULL' : data.created_at,
        campaign_launch_date:
          data.campaign_launch_date === '1970-01-01 08:00:00'
            ? 'Not Set'
            : data.campaign_launch_date,
        campaign_end_date:
          data.campaign_end_date === '1970-01-01 08:01:00' ||
          data.campaign_end_date === '1970-01-01 08:00:00'
            ? 'Not Set'
            : data?.campaign_end_date?.includes('Always')
            ? data?.campaign_end_date
            : data.campaign_end_date,
        tags: _.isEmpty(data.tags)
          ? 'NULL'
          : data.tags
              .map((tag) => tag.title)
              .toString()
              .split(',')
              .join(';'),
      }));
    } else if (team_id === 11 || team_id === 21) {
      columns = {
        id: 'Ticket Id',
        subject: 'Name',
        status: 'Status',
        priority: 'Priority',
        assignee: 'Assignees',
        created_at: 'Created At',
        first_reply: 'First Reply',
        last_reply: 'Last Reply',
        tags: 'Tags',
      };

      data = dashboard?.all_tasks?.data.map((data) => ({
        id: data.id,
        subject: _.isEmpty(data.subject)
          ? 'NULL'
          : data.subject
              .replace(/(\r\n|\n|\r)/gm, '')
              .split(',')
              .join(';'),
        status: _.isEmpty(data.status) ? 'NULL' : data.status.name,
        priority: _.isEmpty(ticketPriorityFlag[Number(data.priority)])
          ? 'NULL'
          : ticketPriorityFlag[Number(data.priority)],
        assignees: _.isEmpty(data.assignee)
          ? 'NULL'
          : data.assignee
              .map((user) => user.name)
              .toString()
              .split(',')
              .join(';'),
        created_at: _.isEmpty(data.created_at) ? 'NULL' : data.created_at,
        first_reply: _.isEmpty(data.first_reply) ? 'NULL' : data.first_reply,
        last_reply: _.isEmpty(data.last_reply) ? 'NULL' : data.last_reply,
        tags: _.isEmpty(data.tags)
          ? 'NULL'
          : data.tags
              .map((tag) => tag.title)
              .toString()
              .split(',')
              .join(';'),
      }));
    } else {
      columns = {
        id: 'Task Id',
        partnerName: 'Partner Name',
        taskName: 'Task Name',
        status: 'Status',
        priority: 'Priority',
        date_created: 'Date Created',
        dueDate: 'Due Date',
        deliveryDate: 'Delivery Date',
        relType: 'Is Parent?',
        health: 'Health',
        channel: 'Channel',
        assignees: 'Assignees',
        tags: 'Tags',
      };

      data = dashboard.all_tasks.data.map((data) => ({
        id: data.id,
        partnerName: data?.partner_name,
        taskName: _.isEmpty(data.name)
          ? 'NULL'
          : data.name
              .replace(/(\r\n|\n|\r)/gm, '')
              .split(',')
              .join(';'),
        status: _.isEmpty(data.status) ? 'NULL' : data.status,
        priority: _.isEmpty(data.priority) ? 'NULL' : data.priority,
        date_created: _.isEmpty(data.date_created) ? 'NULL' : data.date_created,
        dueDate: _.isEmpty(data.due_date) ? 'NULL' : data.due_date,
        deliveryDate: _.isEmpty(data.delivery_date)
          ? 'NULL'
          : data.delivery_date,
        relType: data.relType === 'task' ? 'Parent' : 'Subtask',
        health: _.isEmpty(data.tracker_status) ? 'NULL' : data.tracker_status,
        channel: _.isEmpty(data.channel) ? 'NULL' : data.channel,
        assignees: _.isEmpty(data.assignees)
          ? 'NULL'
          : data.assignees
              .map((user) => user.username)
              .toString()
              .split(',')
              .join(';'),
        tags: _.isEmpty(data.tags)
          ? 'NULL'
          : data.tags
              .map((tag) => tag.title)
              .toString()
              .split(',')
              .join(';'),
      }));
    }

    downloadCsv(
      data,
      columns,
      `AW-Dashboard-${moment().format('YYYY-MM-DD HH:mm:ss')}`
    );
  };

  const handleOnChangeCheckbox = (data) => {
    if (_.find(selectedRows, { id: data.id })) {
      // Remove the id from the selections if the id is already selected.
      setSelectedRows(selectedRows.filter((r) => r.id !== data.id));
    } else {
      setSelectedRows([...selectedRows, data]);
    }
  };

  const handleOnChangeSelectAllCheckbox = () => {
    if (selectedRows.length === dashboard.all_tasks.data?.length) {
      // Deselect all rows if all rows are selected
      setSelectedRows([]);
    } else {
      setSelectedRows(
        dashboard.all_tasks.data?.map((t) => ({
          id: t.id,
          rel_type: t.rel_type,
        }))
      );
    }
  };

  const handleDialog = (_value, _type) => {
    if (!isDialogOpen) {
      _.isEmpty(statuses) && dispatch(getMembers());
      _.isEmpty(members) && dispatch(getStatuses(3, team_id));
      _.isEmpty(priorities) && dispatch(getPriorities(team_id));
    }

    setIsDialogOpen(!isDialogOpen);
    setDialogType(_type);
    setValue(_value);
  };

  const handleOnApplyAdvanceFilters = (filters) => {
    // Remove existing advance filters based on queue type
    const advanceFilterKeys =
      queue === 'briefs'
        ? [
            'partner',
            'region',
            'request_type',
            'status',
            'assignees',
            'priority',
          ]
        : ['concept_id', 'campaign_id', 'partner_group_id', 'channel_id'];

    const filteredAdvanceFilters = _.omit(
      { ...state.filter },
      advanceFilterKeys
    );

    let finalFilters;
    if (queue === 'briefs') {
      // For briefs, filters are in the brief object
      finalFilters = {
        ...state,
        filter: { ...state.filter },
        brief: { ...state.brief, ...filters },
      };
    } else {
      // For non-briefs, filters remain in the filter object
      finalFilters = {
        ...state,
        filter: { ...filteredAdvanceFilters, ...filters },
        brief: { ...state.brief },
      };
    }

    dispatch(setDashboardFilters(finalFilters));
    setIsDialogOpen(false);
    loadDashboard(finalFilters);
  };

  const handleOnResetAdvanceFilters = () => {
    dispatch(setDashboardFilters(getDefaultTableFilters(queue, team_id, user)));
  };

  return (
    <DashboardContext.Provider
      value={{
        team_id,
        admin_role,
        tab,
        page,
        state,
        counter,
        statusCount,
        totalTime,
        dashboard,
        resources,
        members,
        statuses,
        priorities,
        errorStatusCount,
        defaultProps,
        errorTotalTime,
        errorDashboard,
        errorResources,
        fetchMembers,
        fetchStatuses,
        fetchPriorities,
        fetchRepullDashboard,
        fetchDashboard,
        selectedRows,
        queue,
        handlePaginationPageChange,
        handlePaginationRowPageChange,
        handleRepullDashboard,
        handlePopover,
        handleDialog,
        handleSearch,
        handleTableSort,
        handleDownloadTable,
        handleResetFilters,
        handleOnChangeCheckbox,
        handleOnChangeSelectAllCheckbox,
        handleOnResetAdvanceFilters,
        handlePaginationResources,
      }}
    >
      {children}
      {(fetchStatusCount ||
        fetchTotalTime ||
        fetchDashboard ||
        fetchResources) && <CircularLoader />}

      <GlobalPopover
        id={`${popoverType}-popover`}
        isOpen={Boolean(anchorEl)}
        anchorEl={anchorEl}
        popperHorizontal="left"
        content={
          <>
            {popoverType?.toLowerCase()?.includes('status') ? (
              <Status
                data={statuses}
                fetch={fetchStatuses}
                value={value}
                hasMultipleRowsSelected={_.size(selectedRows) > 1}
                onSelect={handleUpdateGlobal}
              />
            ) : popoverType?.toLowerCase()?.includes('date') ||
              popoverType?.toLowerCase()?.includes('campaign') ? (
              <DateTime
                value={value}
                handleUpdateGlobal={handleUpdateGlobal}
                hasMultipleRowsSelected={_.size(selectedRows) > 1}
              />
            ) : popoverType?.toLowerCase()?.includes('assignees') ? (
              <Users
                data={members?.data}
                fetch={fetchMembers}
                value={value?.map((data) => ({
                  ...data,
                  user_id: Number(data?.user_id),
                }))}
                onSelect={handleUpdateGlobal}
              />
            ) : popoverType?.toLowerCase()?.includes('priority') ? (
              <Priority
                data={priorities}
                fetch={fetchPriorities}
                value={value}
                admin_role={admin_role}
                onSelect={handleUpdateGlobal}
              />
            ) : (
              <Filters onFilterChange={handleOnFilterChange} />
            )}
          </>
        }
        handleClose={() => setAnchorEl(null)}
      />

      <GlobalDialog
        open={isDialogOpen}
        handleClose={() => handleDialog(null, dialogType)}
        content={
          <AdvanceFilters
            onApply={handleOnApplyAdvanceFilters}
            onClose={() => handleDialog(null, dialogType)}
          />
        }
      />
    </DashboardContext.Provider>
  );
}

DashboardProvider.propTypes = {
  children: PropTypes.any,
};

export default DashboardContext;
