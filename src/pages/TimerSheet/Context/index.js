import React, { createContext, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getTimesheet,
  getTimesheetChart,
  getTimesheetOption,
  getTimesheetStats,
  getTimesheetCSV,
  getTimesheetConcept,
  getTimesheetCampagin,
  getTimeline,
  getTimelogById,
  updatePresetTimer,
  getMembers,
  getCampaignsList,
  getConceptList,
} from 'store/reducers/timesheet';
import {
  fetchTags,
  updateTags,
  resetTags,
  fetchTaskTypeCategories,
} from 'store/reducers/timer';

import {
  fetchPartnerFields,
  fetchConceptFields,
  fetchCampaignFields,
} from 'store/reducers/timer';
import { setTimerSheetApplyFilterCooldownEndsAt } from 'store/reducers/filters';

import PropTypes from 'prop-types';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { formatDate } from 'utils/date';
// hooks
import { useOnMount } from 'hooks';
import { chart_filter_list, statistic_filter_list } from '../constant';
// MUI Components
import { Modal, Zoom, Box } from '@mui/material';
// Global Component
import GlobalPopover from 'components/Common/Popover';
// Local Component
import PopperOptions from 'pages/TimerSheet/components/Popper/Options';
import TimelineSummary from '../components/TimelineSummary';
import _ from 'lodash';
//Swal
import Swal from 'sweetalert2';
//Util
import { getItemByKey } from 'utils/dictionary';

const TimerSheetContext = createContext();

const selectedDatesInitial = [
  {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  },
];
const APPLY_FILTER_COOLDOWN_MS = 30000;

export function TimerSheetProvider({ children }) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { timerType: timerTypeFromParams, timerId: timelogIdFromParams } =
    useParams();
  //const ref = useRef();

  // Get user_id from query params
  const queryParams = new URLSearchParams(location.search);
  const userIdFromQuery = queryParams.get('user_id');

  const [defaultValue, setDefaultValue] = useState({});
  const [defaultStatValue, setDefaultStatValue] = useState({});

  // popper
  const [chartFilterDropdownAnchorEl, setChartFilterDropdownAnchorEl] =
    useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperType, setPopperType] = useState(null);

  const [anchorElStat, setAnchorElStat] = useState(null);

  const [timesheetFilterData, setTimesheetFilterData] = useState(timesheetData);

  // popper - selected data
  const [filterSelectedDates, setFilterSelectedDates] =
    useState(selectedDatesInitial);
  const [filterSelectedDropdown, setFilterSelectedDropdown] = useState(null);
  const [filterChartSelectedDropdown, setFilterChartSelectedDropdown] =
    useState(chart_filter_list[0]);
  const [filterChartSelectedDateRange, setFilterChartSelectedDateRange] =
    useState('');
  const [filterStatSelectedDropdown, setFilterStatSelectedDropdown] =
    useState('');
  const [filterStatTable, setFilterStatTable] = useState('concept');
  const [filterSelectedStaff, setFilterSelectedStaff] = useState('');
  const [filterSelectedPartner, setFilterSelectedPartner] = useState('');
  const [filterSelectedCampaign, setFilterSelectedCampaign] = useState('');
  const [filterSelectedConcept, setFilterSelectedConcept] = useState('');
  const [filterSelectedDateRange, setFilterSelectedDateRange] = useState('');
  const [filterSelectedDateFilter, setFilterSelectedDateFilter] =
    useState('this_week');

  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [requiredFields, setRequiredFields] = useState(null);

  // task table ref for scrolling
  const [taskTableRef, setTaskTableRef] = useState(null);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  //debounce
  let delayDebounceFn;

  //First Update
  const firstUpdate = useRef(true);

  const {
    timesheet: { data: timesheetData, fetching: isTimeSheetFetching },
    timelog: { data: timelogData },
    chart: { data: chartData, fetching: isChartFetching },
    concept: { data: conceptData, fetching: isConceptFetching },
    campaign: { data: campaignData, fetching: isCampaignFetching },
    optionTimeSheets: {
      data: optionTimeSheet,
      fetching: isOptionTimeSheetFetching,
    },
    timeline: { data: timelineData, fetching: isTimelineFetching },
    statistics: { data: statisticsData },
    members: { data: membersData, fetching: isFetchingMembers },
    campaignList: { data: campaignListData, fetching: isFetchingCampaignList },
    conceptList: { data: conceptListData, fetching: isFetchingConceptList },
  } = useSelector((state) => state.timesheet);

  const {
    categories,
    concepts,
    campaigns,
    adweavePartners,
    tagsList,
    isFetchingPartners,
    isFetchingConcepts,
    isFetchingCampaigns,
    isFetchingTaskCategories,
  } = useSelector((state) => state.timer);

  const { data: userData } = useSelector((state) => state.user);
  const timerSheetApplyFilterCooldownEndsAt = useSelector(
    (state) => state.filters?.timerSheet?.applyFilterCooldownEndsAt || 0
  );
  const applyFilterCooldownEndsAtRef = useRef(0);

  useEffect(() => {
    applyFilterCooldownEndsAtRef.current = timerSheetApplyFilterCooldownEndsAt;
  }, [timerSheetApplyFilterCooldownEndsAt]);

  const getRequiredFields = (id) => {
    return getItemByKey('id', id, categories ?? []).required_fields ?? [];
  };

  const ToastError = Swal.mixin({
    toast: true,
    icon: 'error',
    width: 370,
    position: 'top-right',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  useOnMount(() => {
    dispatch(
      getTimesheet('', userIdFromQuery, '', '', '', '', '', 'this_week')
    );
    dispatch(getTimesheetStats());
    userData.is_smartly && dispatch(getTimesheetOption(userData.is_smartly));
  });

  useEffect(() => {
    setTimesheetFilterData(timesheetData);
  }, [timesheetData]);

  // Custom Routing for Timelogs
  useEffect(() => {
    // Fetching data from Timelog
    if (timelogIdFromParams && timerTypeFromParams) {
      dispatch(getTimelogById(timelogIdFromParams, timerTypeFromParams));
      dispatch(getTimeline(timelogIdFromParams, timerTypeFromParams));
      // // For Preset Timelog Modal Data
      // if (timerTypeFromParams == 'preset') {
      //   dispatch(fetchCategories());
      //   dispatch(fetchCategoriesWithRequiredFields());
      // }
    } else {
      setIsModalOpen(false);
      dispatch(resetTags());
      history.push(`/timesheet`);
    }
  }, [timelogIdFromParams]);

  useEffect(() => {
    // Doesn't render 1st update
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    // If Timelog is empty
    if (_.isEmpty(timelogData)) {
      setIsModalOpen(false);
      ToastError.fire({
        title: `Time Log not found`,
      });
      history.push(`/timesheet`);
    } else {
      //Fetch Tags
      if (_.isEmpty(tagsList)) {
        dispatch(
          fetchTags({
            relId:
              timelogData?.timer_type == 'preset'
                ? timelogData?.timer_id
                : timelogData?.task?.id,
            relType: timerTypeFromParams,
          })
        );
      }

      setRequiredFields(getRequiredFields(timelogData.category?.id ?? 0));
      // Open Timelogs Modal
      setIsModalOpen(true);
    }
  }, [timelogData]);

  const handleApplyFilterData = () => {
    const now = Date.now();

    if (applyFilterCooldownEndsAtRef.current > now) return;

    const cooldownEndsAt = now + APPLY_FILTER_COOLDOWN_MS;
    applyFilterCooldownEndsAtRef.current = cooldownEndsAt;
    dispatch(setTimerSheetApplyFilterCooldownEndsAt(cooldownEndsAt));

    const staff = selectedStaff.map((item) => item.id).join(',');
    // const partner = selectedPartner.map((item) => item.id).join(',');
    // const campaign = selectedCampaign.map((item) => item.id).join(',');

    if (selectedDateRange == '-,-') {
      setFilterSelectedDateRange('');
      setSelectedDateRange('');
    }

    setFilterSelectedStaff(staff || '');
    setFilterSelectedPartner(selectedPartner?.id || '');
    setFilterSelectedCampaign(selectedCampaign?.id || '');
    setFilterSelectedConcept(selectedConcept?.id || '');
    setFilterSelectedDateRange(selectedDateRange);
    setFilterSelectedDateFilter(selectedDateRange ? 'custom' : 'this_week');

    dispatch(
      getTimesheet(
        '',
        staff || '',
        selectedPartner?.id || '',
        selectedCampaign?.id || '',
        selectedConcept?.id || '',
        selectedDateRange || '',
        '',
        selectedDateRange ? 'custom' : 'this_week'
      )
    );
  };

  const handleClearFilterData = () => {
    setFilterSelectedStaff('');
    setFilterSelectedPartner('');
    setFilterSelectedCampaign('');
    setFilterSelectedDateRange('this_week');
    setSelectedCampaign([]);
    setSelectedStaff([]);
    setSelectedDateRange('');
    setFilterSelectedDateFilter('');
    setSelectedPartner([]);
    setSelectedConcept([]);
    // dispatch(getTimesheet('', '', '', '', '', '', '', 'this_week'));
  };

  // Watch chart filter changes
  useEffect(() => {
    dispatch(
      getTimesheetChart(
        '',
        '',
        '',
        '',
        '',
        filterChartSelectedDateRange,
        filterChartSelectedDropdown.slug
      )
    );
  }, [filterChartSelectedDateRange, filterChartSelectedDropdown]);

  useEffect(() => {
    if (!userData.is_smartly) {
      dispatch(getTimesheetConcept(filterStatSelectedDropdown.slug));
      dispatch(getTimesheetCampagin(filterStatSelectedDropdown.slug));
    }
  }, [filterStatSelectedDropdown]);

  const handleSearch = (query) => {
    clearTimeout(delayDebounceFn);

    delayDebounceFn = setTimeout(() => {
      if (!query) {
        setFilterSearch('');
        return setTimesheetFilterData({
          ...timesheetData,
          timesheet: timesheetData.timesheet,
        });
      }

      setFilterSearch(query.toLowerCase());
      setTimesheetFilterData({
        ...timesheetData,
        timesheet: timesheetData.timesheet.filter((x) => {
          return (
            x?.task?.name.toLowerCase().includes(query.toLowerCase()) ||
            x?.timer_id?.toString().includes(query)
          );
        }),
      });
    }, 1000);
  };

  const handleChangeFilterData = (value, type) => {
    //const valueSearch = value.map((item) => item.id).join(',');
    if (type === 'staff') setSelectedStaff(value);
    else if (type === 'partners') setSelectedPartner(value);
    else if (type === 'campaign') setSelectedCampaign(value);
    else if (type === 'concept') setSelectedConcept(value);
  };

  const handleFilter = () => {};

  const handleDropdownChange = (e, selected) => {
    if (selected.slug?.includes('custom_date')) {
      // Open another popper upon clicking custom from filter's dropdown menu
      handlePopper(chartFilterDropdownAnchorEl, selected.slug);
      setFilterSelectedDropdown({ ...selected, slug: 'custom' });
      setFilterChartSelectedDropdown({ ...selected, slug: 'custom' });
    } else {
      setAnchorEl(null);
      setFilterSelectedDropdown(selected);
      setFilterChartSelectedDropdown(selected);
    }
  };

  const handleDropdownStat = (e, selected) => {
    setAnchorElStat(null);
    if (
      selected.slug?.includes('concept') ||
      selected.slug?.includes('campaign')
    )
      setFilterStatTable(selected.slug);
    else setFilterStatSelectedDropdown(selected);
  };

  const handleRedirect = (e, type, id) => {
    e.preventDefault();

    localStorage?.setItem(
      'redirect',
      `/${
        type.includes('task') || type.includes('ticket') ? type : 'campaign'
      }/${id}`
    );

    history.push({
      pathname: `/${
        type.includes('task') || type.includes('ticket') ? type : 'campaign'
      }/${id}`,
      search: history.location.search,
      state: {
        background: location,
        type:
          type.toLowerCase().includes('task') || type.includes('ticket')
            ? type
            : 'campaign',
        subtask: type.toLowerCase() === 'subtask' ? true : false,
      },
    });
  };

  const handleLink = (e, type) => {
    e.preventDefault();

    history.push({
      pathname: `${type}`,
    });
  };

  const handleDateRangeChange = async (ranges, optionType) => {
    const dateFilterRange = [ranges.selection];
    const valueSearchStart = dateFilterRange
      .map((item) => formatDate(item.startDate, 'YYYY-MM-DD'))
      .join(',');
    const valueSearchEnd = dateFilterRange
      .map((item) => formatDate(item.endDate, 'YYYY-MM-DD'))
      .join(',');
    const dateFilter = valueSearchStart + ',' + valueSearchEnd;

    if (optionType.includes('custom_date')) {
      setFilterChartSelectedDateRange(dateFilter);
    } else {
      setSelectedDateRange(dateFilter);
    }

    setFilterSelectedDates([ranges.selection]);
  };

  const handleClearDateRange = () => {
    setSelectedDateRange('');
    setFilterSelectedDateRange('');
  };

  const handleTimeSheetCSV = () => {
    dispatch(
      getTimesheetCSV(
        filterSelectedStaff,
        filterSearch,
        filterSelectedPartner,
        filterSelectedCampaign,
        filterSelectedConcept,
        filterSelectedDateRange,
        filterSelectedDateFilter,
        userData.is_smartly
      )
    );
  };

  const handlePopper = (event, _type, _defaults) => {
    // _type.includes('date')
    setAnchorEl(_type === 'custom_date' ? event : event.currentTarget);
    setDefaultValue(_defaults);
    _type.includes('dropdown') &&
      setChartFilterDropdownAnchorEl(event.currentTarget);
    typeof _type !== 'object' && setPopperType(_type);
  };

  const handlePopperStat = (event, _type, _defaults) => {
    setAnchorElStat(event.currentTarget);
    setDefaultStatValue(_defaults);
    typeof _type !== 'object' && setPopperType(_type);
  };

  const handleModal = (isOpen) => {
    setIsModalOpen(isOpen);
    dispatch(resetTags());
    history.push('/timesheet');
  };

  const handleOnAddTags = (data) => {
    dispatch(
      updateTags({
        ...data,
        rel_id: timelogData?.timer_id,
      })
    );
  };

  const handleRemoveAllTags = () => {
    dispatch(
      updateTags({
        action: 'remove',
        ids: tagsList
          ?.filter((tags) => tags.is_selected == true)
          ?.map((tags) => tags.id)
          ?.toString(),
        rel_id: timelogData?.timer_id,
        type: 'preset',
      })
    );
  };

  const handleTaskSelectionChange = (data) => {
    if (!_.isUndefined(data)) {
      setRequiredFields(getRequiredFields(timelogData.category?.id ?? 0));
      dispatch(
        updatePresetTimer(
          {
            id: timelogData?.timer_id,
            task_type_id: data.task_type_id,
            task_category_id: data.id,
          },
          timelogData?.timer_type
        )
      );
    }
  };

  const handlePartnersSelectionChange = (partner, reason) => {
    if (!_.isUndefined(partner)) {
      dispatch(
        updatePresetTimer({
          id: timelogData?.timer_id,
          partner_group_id:
            reason == 'clear' ? null : partner?.uuid ?? partner?.id,
          campaign_id: null,
          concept_id: null,
        })
      );
    }
  };

  const handleConceptsSelectionChange = (concept, reason) => {
    dispatch(
      updatePresetTimer({
        id: timelogData?.timer_id,
        concept_id: reason == 'clear' ? null : concept?.uuid,
        campaign_id: null,
      })
    );
  };

  const handleCampaignsSelectionChange = (campaign, reason) => {
    if (!_.isUndefined(campaign)) {
      dispatch(
        updatePresetTimer({
          id: timelogData?.timer_id,
          campaign_id: reason == 'clear' ? null : campaign?.uuid,
        })
      );
    }
  };

  const handleOnOpenPartners = () => {
    _.isEmpty(adweavePartners) &&
      !isFetchingPartners &&
      dispatch(fetchPartnerFields());
  };

  const handleOnOpenConcepts = (partnerId) => {
    dispatch(fetchConceptFields(partnerId));
  };

  const handleOnOpenConceptsList = () => {
    dispatch(getConceptList());
  };

  const handleOnOpenCampaign = (conceptId, partnerId) => {
    dispatch(fetchCampaignFields(conceptId, partnerId));
  };

  const handleOnOpenCampaignList = () => {
    _.isEmpty(campaignListData) && dispatch(getCampaignsList());
  };

  const handleOnOpenMembers = () => {
    if (!userData.is_smartly)
      _.isEmpty(membersData) && !isFetchingMembers && dispatch(getMembers());
  };

  const handleOnOpenTaskCategories = () => {
    _.isEmpty(categories) &&
      !isFetchingTaskCategories &&
      dispatch(fetchTaskTypeCategories());
  };

  return (
    <TimerSheetContext.Provider
      value={{
        timelogData,
        categories,
        adweavePartners,
        concepts,
        campaigns,
        membersData,
        tagsList,
        timesheetFilterData,
        statisticsData,
        chartData,
        conceptData,
        campaignData,
        userData,
        timelineData,
        campaignListData,
        conceptListData,
        optionTimeSheet,
        isTimeSheetFetching,
        filterSelectedDates,
        filterSelectedDropdown,
        filterChartSelectedDropdown,
        filterChartSelectedDateRange,
        filterSelectedStaff,
        filterSelectedPartner,
        filterSelectedCampaign,
        filterSelectedDateRange,
        filterStatTable,
        timerSheetApplyFilterCooldownEndsAt,
        selectedStaff,
        selectedPartner,
        selectedCampaign,
        selectedDateRange,
        selectedConcept,
        requiredFields,
        userIdFromQuery,
        taskTableRef,
        setTaskTableRef,
        handleFilter,
        handleSearch,
        handlePopper,
        handleRedirect,
        handleLink,
        handleChangeFilterData,
        handleClearDateRange,
        handleApplyFilterData,
        handleClearFilterData,
        handleModal,
        handleTimeSheetCSV,
        handleDropdownStat,
        handlePopperStat,
        handlePartnersSelectionChange,
        handleCampaignsSelectionChange,
        handleConceptsSelectionChange,
        handleTaskSelectionChange,
        handleOnAddTags,
        handleRemoveAllTags,
        isOptionTimeSheetFetching,
        isChartFetching,
        isConceptFetching,
        isCampaignFetching,
        isTimelineFetching,
        isFetchingPartners,
        isFetchingConcepts,
        isFetchingCampaigns,
        isFetchingMembers,
        isFetchingCampaignList,
        isFetchingConceptList,
        handleOnOpenConcepts,
        handleOnOpenConceptsList,
        handleOnOpenCampaign,
        handleOnOpenPartners,
        handleOnOpenTaskCategories,
        handleOnOpenMembers,
        handleOnOpenCampaignList,
      }}
    >
      <GlobalPopover
        id={`${popperType}-popover`}
        isOpen={Boolean(anchorEl)}
        anchorEl={anchorEl}
        popperHorizontal="left"
        PaperProps={{
          sx: {
            width: 'max-content',
          },
        }}
        content={
          <PopperOptions
            type={popperType || ''}
            status={[]}
            priority={[]}
            users={[]}
            sort={[]}
            tags={tagsList}
            dropdowns={chart_filter_list}
            defaults={defaultValue}
            selectedDates={filterSelectedDates}
            setDefaultValue={setDefaultValue}
            onClose={() => setAnchorEl(null)}
            onDropdownChange={handleDropdownChange}
            handleSort={null}
            handleTaskUpdate={null}
            handleOnAddTags={handleOnAddTags}
            handleDateRangeChange={handleDateRangeChange}
          />
        }
        handleClose={() => setAnchorEl(null)}
      />
      <GlobalPopover
        id={`${popperType}-popover`}
        isOpen={Boolean(anchorElStat)}
        anchorEl={anchorElStat}
        popperHorizontal="left"
        PaperProps={{
          sx: {
            width: 'max-content',
          },
        }}
        content={
          <PopperOptions
            type={popperType || ''}
            status={[]}
            priority={[]}
            users={[]}
            sort={[]}
            tags={[]}
            dropdowns={statistic_filter_list}
            defaults={defaultStatValue}
            selectedDates={filterSelectedDates}
            setDefaultValue={setDefaultStatValue}
            onClose={() => setAnchorElStat(null)}
            onDropdownChange={handleDropdownStat}
            handleSort={null}
            handleTaskUpdate={null}
            handleOnAddTags={null}
            handleDateRangeChange={null}
          />
        }
        handleClose={() => setAnchorElStat(null)}
      />
      {isModalOpen && (
        <Modal
          disableAutoFocus={true}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2em 0 2em 50px',
          }}
          open={isModalOpen}
          onClose={() => handleModal(false, null, null)}
        >
          <Zoom in={isModalOpen}>
            <Box
              sx={{
                backgroundColor: 'white',
                width: '60%',
                minHeight: '30%',
                borderRadius: '15px',
                overflow: 'hidden',
              }}
            >
              <TimelineSummary data={timelogData} />
            </Box>
          </Zoom>
        </Modal>
      )}
      {children}
    </TimerSheetContext.Provider>
  );
}

TimerSheetProvider.propTypes = {
  children: PropTypes.any,
};

export default TimerSheetContext;
