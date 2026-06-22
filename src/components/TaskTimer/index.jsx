import { useEffect, useState, forwardRef } from 'react';

import PropTypes from 'prop-types';

import ListItem from './Components/ListItem';

import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedTaskCategory,
  setSelectedPartner,
  setSelectedConcept,
  setSelectedCampaign,
  setSelectedDate,
  setFilterSelectedDates,
  setRequiredFields,
  setTags,
  reset,
} from 'store/reducers/activeTimer';

import {
  fetchUserTimeLogs,
  fetchActiveTimer,
  startTimerById,
  stopTimerById,
  updateTimer,
  deleteTimer,
  fetchTaskTimers,
  fetchSmartlyPartners,
  fetchTags,
  updateTags,
  fetchTaskTypeCategories,
  updateRunningTimer,
} from 'store/reducers/timer';

import { formatDate } from 'utils/date';

// Components
import Header from 'components/TaskTimer/Components/Header';
import List from './Components/List';
import ActiveTimer from './Components/ActiveTimer';
import LogsSkeletonLoader from './Components/Skeleton/Logs';
import ActiveTimerSkeletonLoader from './Components/Skeleton/ActiveTimer';

import emptyImage from 'assets/images/fav-empty.svg';

// MUI Components
import {
  styled,
  Card,
  IconButton,
  Tooltip,
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  Zoom,
  Alert,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ClearIcon from '@mui/icons-material/Clear';
import Swal from 'sweetalert2';
import _ from 'lodash';

import { getItemByKey } from 'utils/dictionary';
import { useOnMount, useOnUnmount } from 'hooks';
import {
  fetchPartnerFields,
  fetchConceptFields,
  fetchCampaignFields,
} from 'store/reducers/timer';
import { getData } from 'store/reducers/tasks';

import DateRangePopper from './Components/DateRange';
import ActiveTaskTimer from './Components/ActiveTaskTimer';

import moment from 'moment';

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

// Toast notification
const Toast = Swal.mixin({
  toast: true,
  icon: 'success',
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

const StyledTab = styled(Tab)({
  color: 'white',
  height: 'inherit',
  fontWeight: 700,
});

const TaskTimer = ({ isOpen, handleClose }) => {
  const selectedDatesInitial = [
    {
      startDate: moment(new Date()).subtract(7, 'days').toDate(),
      endDate: new Date(),
      key: 'selection',
    },
  ];

  const initialDate = ` ${formatDate(
    moment(new Date()).subtract(7, 'days').toDate(),
    'YYYY-MM-DD'
  )},${formatDate(new Date(), 'YYYY-MM-DD')} `;

  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('preset');
  const [anchorEl, setAnchorEl] = useState(false);
  const [updateDate, setUpdateDate] = useState(false);

  // Redux states
  const { data: userData } = useSelector((state) => state.user);

  const {
    selectedTaskCategory,
    selectedPartner,
    selectedConcept,
    selectedCampaign,
    selectedDate,
    filterSelectedDates,
    requiredFields,
    tags,
  } = useSelector((state) => state.activeTimer);

  const {
    campaigns,
    concepts,
    logs,
    categories,
    taskTimers,
    adweavePartners,
    smartlyPartners,
    tagsList,
    isFetching,
    isFetchingActiveTimer,
    isUpdatingTimer,
    isFetchingWithPagination,
    isFetchingPartners,
    isFetchingConcepts,
    isFetchingCampaigns,
    isFetchingTaskCategories,
    active: activeTimer,
  } = useSelector((state) => state.timer);

  // Redux states
  const { options } = useSelector((state) => state.tasks);

  // Hooks
  useOnMount(() => {
    // if (_.isEmpty(logs ?? {})) {
    dispatch(fetchActiveTimer());
    dispatch(fetchTaskTypeCategories());
    dispatch(fetchTaskTimers());
    dispatch(fetchUserTimeLogs(userData.id, { page: 1, limit: 5 }, () => {}));
    // dispatch(getData('tags'));
    userData.is_smartly && dispatch(fetchSmartlyPartners());
    dispatch(setSelectedDate(initialDate));
    dispatch(setFilterSelectedDates(selectedDatesInitial));

    // }
  });

  // Unmount Active Timer Redux
  useOnUnmount(() => {
    if (_.isEmpty(activeTimer)) dispatch(reset());
  });

  useEffect(() => {
    if (!_.isNull(activeTimer?.category?.id ?? null)) {
      dispatch(
        setSelectedTaskCategory({
          ...activeTimer.category,
          task_type_id: activeTimer?.task_type?.id,
        })
      );
      dispatch(
        setSelectedPartner(
          activeTimer.partner
            ? {
                uuid: activeTimer.partner?.id,
                name: activeTimer.partner?.name,
              }
            : null
        )
      );
      dispatch(setSelectedConcept(activeTimer.concept ?? null));
      dispatch(setSelectedCampaign(activeTimer.campaign ?? null));
      dispatch(
        setRequiredFields(getRequiredFields(activeTimer.category?.id ?? 0))
      );
    }
  }, [activeTimer, categories]);

  useEffect(() => {
    if (_.isEmpty(activeTimer?.tags)) {
      dispatch(setTags(options.tagsList));
    } else {
      dispatch(
        setTags(
          options.tagsList.map((i) =>
            activeTimer.tags.includes(i.title)
              ? { ...i, is_selected: !i.is_selected }
              : i
          )
        )
      );
    }
  }, [options, activeTimer?.tags]);

  const logsDataSource = logs?.filter((i) => !_.isEmpty(i.total_time)) ?? [];

  // Handlers
  const handleOnChangeTab = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleScrollPaginate = () => {
    const [dateStart, dateEnd] = selectedDate.split(',');
    const pagination = {
      page: Math.ceil(logs?.length / 5 + 1),
      limit: 5,
      dateStart: !_.isEqual(selectedDate, initialDate) ? dateStart : null,
      dateEnd: !_.isEqual(selectedDate, initialDate) ? dateEnd : null,
    };
    dispatch(fetchUserTimeLogs(userData.id, pagination, () => {}));
  };

  const handleNewTimerOnPresetsSelectionChange = (data, timer) => {
    if (!_.isUndefined(data)) {
      dispatch(setRequiredFields(getRequiredFields(data?.id)));
      dispatch(setSelectedTaskCategory(data));
      !_.isEmpty(activeTimer) &&
        dispatch(
          updateTimer(userData.id, {
            id: timer.task_timer_id,
            task_type_id: data.task_type_id,
            task_category_id: data.id,
          })
        );
    }
  };

  const handleExistingLogOnPresetsSelectionChange = (log, task) => {
    if (!_.isUndefined(task)) {
      const [dateStart, dateEnd] = selectedDate.split(',');
      const paginationOnCompletion = {
        page: 1,
        limit: logs?.length ?? 1,
        dateStart: !_.isEqual(selectedDate, initialDate) ? dateStart : null,
        dateEnd: !_.isEqual(selectedDate, initialDate) ? dateEnd : null,
      };
      dispatch(
        updateTimer(
          userData.id,
          {
            id: log.taskTimerId,
            task_type_id: task.task_type_id,
            task_category_id: task.id,
          },
          paginationOnCompletion
        )
      );
    }
  };

  const handleExistingOnPartnersSelectionChange = (
    log,
    partner,
    reason,
    index
  ) => {
    if (!_.isUndefined(partner)) {
      const [dateStart, dateEnd] = selectedDate.split(',');
      const paginationOnCompletion = {
        page: 1,
        limit: logs?.length ?? 1,
        dateStart: !_.isEqual(selectedDate, initialDate) ? dateStart : null,
        dateEnd: !_.isEqual(selectedDate, initialDate) ? dateEnd : null,
      };
      dispatch(
        updateTimer(
          userData.id,
          {
            id: log.taskTimerId,
            partner_group_id:
              reason == 'clear' ? null : partner?.uuid ?? partner?.id,
            partner_name: partner.name,
            campaign_id: null,
            concept_id: null,
          },
          paginationOnCompletion,
          index
        )
      );
    }
  };

  const handleExistingOnCampaignsSelectionChange = (
    log,
    campaign,
    reason,
    index
  ) => {
    if (!_.isUndefined(campaign)) {
      const [dateStart, dateEnd] = selectedDate.split(',');
      const paginationOnCompletion = {
        page: 1,
        limit: logs?.length ?? 1,
        dateStart: !_.isEqual(selectedDate, initialDate) ? dateStart : null,
        dateEnd: !_.isEqual(selectedDate, initialDate) ? dateEnd : null,
      };
      dispatch(
        updateTimer(
          userData.id,
          {
            id: log.taskTimerId,
            campaign_id: reason == 'clear' ? null : campaign?.uuid,
          },
          paginationOnCompletion,
          index
        )
      );
    }
  };

  const handleExistingOnConceptsSelectionChange = (
    log,
    concept,
    reason,
    index
  ) => {
    const [dateStart, dateEnd] = selectedDate.split(',');
    const paginationOnCompletion = {
      page: 1,
      limit: logs?.length ?? 1,
      dateStart: !_.isEqual(selectedDate, initialDate) ? dateStart : null,
      dateEnd: !_.isEqual(selectedDate, initialDate) ? dateEnd : null,
    };
    dispatch(
      updateTimer(
        userData.id,
        {
          id: log.taskTimerId,
          concept_id: reason == 'clear' ? null : concept?.uuid,
          campaign_id: null,
        },
        paginationOnCompletion,
        index
      )
    );
  };

  const handleExistingOnAddTags = (log, tag) => {
    dispatch(
      updateTags({
        action: _.find(tagsList, (i) => i.title === tag.title)?.is_selected
          ? 'remove'
          : 'add',
        ids: _.find(tagsList, (i) => i.title === tag.title)?.id,
        rel_id: log.taskTimerId,
        title: tag?.title,
        type: 'preset',
      })
    );
  };

  const handleExistingOnRemoveAllTags = (log) => {
    if (!_.isUndefined(log?.taskTimerId))
      dispatch(
        updateTags({
          action: 'remove',
          ids: tagsList
            ?.filter((tags) => tags.is_selected == true)
            ?.map((tags) => tags.id)
            ?.toString(),
          rel_id: log.taskTimerId,
          type: 'preset',
        })
      );
    else
      dispatch(
        setTags(
          tags.map((tag) =>
            _.mapValues(tag, (data, key) => {
              return key == 'is_selected' ? false : data;
            })
          )
        )
      );
  };

  const handleOnStartTimer = () => {
    if (_.isNull(selectedTaskCategory) || _.isNull(selectedPartner))
      return ToastError.fire({
        title: `Please select a ${
          _.isNull(selectedTaskCategory) ? 'task type' : 'partner'
        }`,
      });

    dispatch(
      startTimerById({
        task_type_id: selectedTaskCategory?.task_type_id ?? null,
        task_category_id: selectedTaskCategory?.id ?? null,
        partner_name: selectedPartner?.name ?? null,
        partner_group_id: selectedPartner?.uuid ?? selectedPartner?.id ?? null,
        campaign_id: selectedCampaign?.uuid ?? null,
        concept_id: selectedConcept?.uuid ?? null,
        time_in: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        tags: tags.filter((i) => i.is_selected).map((i) => i.title) ?? null,
      })
    );
    // clear tags
    dispatch(
      setTags(
        tags.map((tag) =>
          _.mapValues(tag, (data, key) => {
            return key == 'is_selected' ? false : data;
          })
        )
      )
    );
  };

  const handleOnStopTimer = (activeTimer) => {
    if (_.isNull(selectedPartner)) {
      ToastError.fire({ title: 'Please select a partner first' });
      return;
    }

    if (canStopTimer) {
      const [dateStart, dateEnd] = selectedDate.split(',');
      const { task_timer_id } = activeTimer;
      const paginationOnCompletion = {
        page: 1,
        limit: logs?.length < 1 ? 1 : logs?.length ?? 1,
        dateStart: !_.isEqual(selectedDate, initialDate) ? dateStart : null,
        dateEnd: !_.isEqual(selectedDate, initialDate) ? dateEnd : null,
      };

      dispatch(
        stopTimerById(
          userData.id,
          {
            id: task_timer_id,
            task_type_id:
              selectedTaskCategory?.task_type_id ??
              activeTimer.task_type.id ??
              _.find(categories, (data) =>
                _.isEqual(
                  data?.id,
                  selectedTaskCategory?.id ?? activeTimer.category?.id
                )
              )?.task_type_id ??
              null,
            task_category_id:
              selectedTaskCategory?.id ?? activeTimer.category?.id ?? null,
            partner_name: selectedPartner?.name ?? null,
            partner_group_id:
              selectedPartner?.uuid ??
              selectedPartner?.id ??
              activeTimer.partner?.id ??
              null,
            campaign_id:
              selectedCampaign?.uuid ?? activeTimer.campaign?.uuid ?? null,
            concept_id:
              selectedConcept?.uuid ?? activeTimer.concept?.uuid ?? null,
            time_out: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          },
          paginationOnCompletion,
          () => {
            dispatch(setSelectedTaskCategory(null));
            dispatch(setSelectedPartner(null));
            dispatch(setSelectedCampaign(null));
            dispatch(setSelectedConcept(null));
            dispatch(setRequiredFields(null));
          }
        )
      );
    }
  };

  const handleOnStartTimerPreviousLog = (log) => {
    const { taskTimerId } = log;
    dispatch(startTimerById({ task_timer_id: taskTimerId }));
  };

  const handleOnTimeChange = (log, start, end) => {
    if (!_.isUndefined(log)) {
      const [dateStart, dateEnd] = selectedDate.split(',');
      const paginationOnCompletion = {
        page: 1,
        limit: logs?.length ?? 1,
        dateStart: !_.isEqual(selectedDate, initialDate) ? dateStart : null,
        dateEnd: !_.isEqual(selectedDate, initialDate) ? dateEnd : null,
      };
      console.log(log);
      dispatch(
        updateTimer(
          userData.id,
          {
            id: log.taskTimerId,
            time_in: start,
            time_out: end,
            partner_group_id:
              log.selectedPartner.id ?? log.selectedPartner.uuid,
            partner_name: log.selectedPartner.name,
          },
          paginationOnCompletion
        )
      );
    }
  };

  const handleOnDelete = (taskTimerId) => {
    Swal.fire({
      title: '<p style="font-size: 0.85em">Do you want to delete this log?</p>',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
      focusConfirm: false,
      customClass: {
        container: 'swal-container',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const paginationOnCompletion = {
          page: 1,
          limit: logs?.length ?? 1,
        };
        dispatch(
          deleteTimer(
            userData.id,
            {
              ids: taskTimerId,
            },
            paginationOnCompletion,
            () => {
              Toast.fire({
                title: 'Deleted successfully!',
              });
            }
          )
        );
      }
    });
  };

  const handleOnAddTags = (tag) => {
    if (!_.isEmpty(activeTimer))
      dispatch(
        updateTags({
          action: _.find(tagsList, (i) => i.title === tag.title)?.is_selected
            ? 'remove'
            : 'add',
          ids: _.find(tagsList, (i) => i.title === tag.title)?.id,
          rel_id: activeTimer?.task_timer_id,
          title: tag?.title,
          type: 'preset',
        })
      );
    else if (_.some(tags, (i) => i.title === tag.title))
      dispatch(
        setTags(
          tags.map((i) =>
            i.title === tag.title ? { ...i, is_selected: !i.is_selected } : i
          )
        )
      );
    else dispatch(setTags([...tags, { title: tag?.title, is_selected: true }]));
  };

  const handleUpdateRunningTimerPreset = (timer) => {
    dispatch(
      updateRunningTimer({
        id: timer.task_timer_id,
        partner_name: selectedPartner?.name ?? null,
        partner_group_id: selectedPartner?.uuid ?? selectedPartner?.id ?? null,
        campaign_id: selectedCampaign?.uuid ?? null,
        concept_id: selectedConcept?.uuid ?? null,
      })
    );
  };

  const isParent = (log) => log.data?.length > 1;

  const hasFilledOutRequiredFields = () => {
    return (
      [
        !_.isNull(selectedPartner) && requiredFields?.includes('partner'),
        !_.isNull(selectedCampaign) && requiredFields?.includes('campaign'),
        !_.isNull(selectedConcept) && requiredFields?.includes('concept'),
      ]?.filter(Boolean).length === requiredFields?.length
    );
  };

  const canStopTimer =
    !_.isNull(selectedTaskCategory?.id ?? null) && hasFilledOutRequiredFields();

  // These logs are for debugging purposes only if ever an issue occured again.
  // console.log('selectedTaskCategory: ', selectedTaskCategory);
  // console.log('requiredFields: ', requiredFields);
  // console.log('selectedPartner: ', selectedPartner);
  // console.log('selectedCampaign: ', selectedCampaign);
  // console.log('selectedConcept: ', selectedConcept);
  // console.log('activeTimer: ', activeTimer);

  const getRequiredFields = (id) => {
    return getItemByKey('id', id, categories ?? []).required_fields ?? [];
  };

  const hasActiveTimer = !_.isUndefined(activeTimer) && !_.isEmpty(activeTimer);

  const generateRequiredFieldsWarningLabel = () => {
    if (requiredFields?.length === 3) {
      return capitalized(
        `${requiredFields[0] ?? ''}, ${requiredFields[1] ?? ''} and ${
          requiredFields[2] ?? ''
        } fields are required.`
      );
    } else if (requiredFields.length === 2) {
      return capitalized(
        `${requiredFields[0] ?? ''} and ${
          requiredFields[1] ?? ''
        } fields are required.`
      );
    } else {
      return capitalized(`${requiredFields[0] ?? ''} field is required.`);
    }
  };

  const capitalized = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleDateRangeChange = async (ranges) => {
    const valueSearchStart = [ranges.selection].map((item) => item.startDate);
    const valueSearchEnd = [ranges.selection].map((item) => item.endDate);

    var duration = moment
      .duration(moment(valueSearchEnd[0]).diff(moment(valueSearchStart[0])))
      .asDays();

    if (duration <= 7) {
      setUpdateDate(!updateDate);
      dispatch(
        setSelectedDate(
          formatDate(valueSearchStart, 'YYYY-MM-DD') +
            ',' +
            formatDate(valueSearchEnd, 'YYYY-MM-DD')
        )
      );
      dispatch(setFilterSelectedDates([ranges.selection]));
      if (updateDate)
        dispatch(
          fetchUserTimeLogs(
            userData.id,
            {
              page: 1,
              limit: 5,
              dateStart: formatDate(valueSearchStart, 'YYYY-MM-DD'),
              dateEnd: formatDate(valueSearchEnd, 'YYYY-MM-DD'),
            },
            () => {}
          )
        );
    }
  };

  const handleTagsList = async (timer) => {
    const params = {
      relId: timer?.task_timer_id,
      relType: 'preset',
    };

    dispatch(fetchTags(params));
  };

  const handleOnOpenDateRange = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnCloseDateRange = () => {
    setAnchorEl(null);
    setUpdateDate(false);
  };

  const handleClearDateRange = () => {
    dispatch(setSelectedDate(initialDate));
    dispatch(setFilterSelectedDates(selectedDatesInitial));
    dispatch(
      fetchUserTimeLogs(
        userData.id,
        {
          page: 1,
          limit: 5,
        },
        () => {}
      )
    );
    setUpdateDate(false);
  };

  const handleOnOpenPartners = () => {
    if (!userData.is_smartly) {
      !isFetchingPartners && dispatch(fetchPartnerFields());
    }
  };

  const handleOnOpenConcepts = (partnerId) => {
    dispatch(fetchConceptFields(partnerId));
  };

  const handleOnOpenCampaign = (conceptId, partnerId) => {
    dispatch(fetchCampaignFields(conceptId, partnerId));
  };

  const handleOnOpenTags = () => {
    dispatch(getData('tags'));
  };

  return (
    <Dialog
      keepMounted
      fullWidth
      closeAfterTransition
      disableEnforceFocus
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="lg"
      sx={{
        '.MuiDialog-paper': { height: '90vh', maxHeight: '90vh' },
      }}
    >
      <Box
        sx={{
          top: 0,
          pl: '1.5rem',
          zIndex: '9999999',
          position: 'sticky',
          backgroundColor: 'primary.main',
        }}
      >
        {/* MUI BUG: https://github.com/mui/material-ui/issues/32749 */}
        <Tabs
          value={activeTab}
          onChange={handleOnChangeTab}
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              height: '4px',
              borderRadius: '2px',
              backgroundColor: '#8b7cf0',
              marginLeft: 15,
              marginBottom: 7,
              width: 25,
            },
          }}
        >
          <StyledTab value="preset" label="Preset Timer" />
          <StyledTab value="task" label="Task Timer" />
        </Tabs>
      </Box>
      <Box
        sx={{
          width: '100%',
          padding: '2rem',
        }}
      >
        {activeTab === 'preset' &&
        [1, 2, 3, 4, 5, 6, 8, 12, 14, 11, 21, 22, 24, 28].includes(
          userData.team_id
        ) ? (
          <Stack spacing={2}>
            {/* Header */}
            {isFetchingActiveTimer && isFetchingTaskCategories ? (
              <ActiveTimerSkeletonLoader />
            ) : (
              <Stack spacing={1}>
                <Header>
                  {
                    <ActiveTimer
                      timer={activeTimer}
                      tagsDatasource={tags}
                      tasksDatasource={categories}
                      partnersDatasource={
                        userData.is_smartly ? smartlyPartners : adweavePartners
                      }
                      campaignsDatasource={campaigns}
                      conceptsDatasource={concepts}
                      requiredFields={requiredFields}
                      selectedTaskCategory={selectedTaskCategory}
                      selectedPartner={selectedPartner}
                      selectedCampaign={selectedCampaign}
                      selectedConcept={selectedConcept}
                      onPresetsSelectionChange={
                        handleNewTimerOnPresetsSelectionChange
                      }
                      onPartnersSelectionChange={(data) =>
                        dispatch(setSelectedPartner(data))
                      }
                      onCampaignsSelectionChange={(data) =>
                        dispatch(setSelectedCampaign(data))
                      }
                      onConceptsSelectionChange={(data) =>
                        dispatch(setSelectedConcept(data))
                      }
                      onAddTags={handleOnAddTags}
                      onClosePopper={handleUpdateRunningTimerPreset}
                      onStartTimer={handleOnStartTimer}
                      onStopTimer={handleOnStopTimer}
                      canStopTimer={canStopTimer}
                      isSmartly={userData.is_smartly}
                      teamId={userData.team_id}
                      handleTagsList={handleTagsList}
                      tagsList={tagsList}
                      handleExistingOnRemoveAllTags={
                        handleExistingOnRemoveAllTags
                      }
                      handleOnOpenPartners={handleOnOpenPartners}
                      handleOnOpenConcepts={handleOnOpenConcepts}
                      handleOnOpenCampaign={handleOnOpenCampaign}
                      handleOnOpenTags={handleOnOpenTags}
                      isFetchingPartners={isFetchingPartners}
                      isFetchingConcepts={isFetchingConcepts}
                      isFetchingCampaigns={isFetchingCampaigns}
                      inputPlaceholder="What are you working on?"
                    />
                  }
                </Header>
                {hasActiveTimer &&
                  !_.isEmpty(requiredFields) &&
                  !hasFilledOutRequiredFields() && (
                    <Box sx={{ textAlign: 'left' }}>
                      <Alert severity="error">
                        {generateRequiredFieldsWarningLabel()}
                      </Alert>
                    </Box>
                  )}
              </Stack>
            )}
            <Box display="flex" justifyContent="flex-end">
              <Box sx={{ width: '20.5em' }}>
                <TextField
                  size="small"
                  value={`${formatDate(
                    selectedDate?.split(',')[0].replace(/ /g, ''),
                    'MMM DD, YYYY'
                  )} to ${formatDate(
                    selectedDate?.split(',')[1].replace(/ /g, ''),
                    'MMM DD, YYYY'
                  )}`}
                  sx={{ input: { cursor: 'pointer' } }}
                  InputProps={{
                    startAdornment: (
                      <Tooltip
                        title="Date Range"
                        onClick={(event) => handleOnOpenDateRange(event)}
                        componentsProps={{
                          tooltip: {
                            sx: {
                              lineHeight: 'normal',
                              marginTop: '0.4em !important',
                              cursor: 'pointer',
                            },
                          },
                        }}
                        arrow
                      >
                        <IconButton>
                          <DateRangeIcon
                            sx={{
                              fontSize: '1.3em',
                              cursor: 'pointer',
                            }}
                            color="secondary"
                          />
                        </IconButton>
                      </Tooltip>
                    ),
                    endAdornment: (
                      <Tooltip
                        title="Reset"
                        onClick={handleClearDateRange}
                        componentsProps={{
                          tooltip: {
                            sx: {
                              lineHeight: 'normal',
                              marginTop: '0.4em !important',
                              cursor: 'pointer',
                            },
                          },
                        }}
                        arrow
                      >
                        <IconButton>
                          <ClearIcon
                            sx={{
                              fontSize: '1.3em',
                              cursor: 'pointer',
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    ),
                    inputProps: {
                      style: { textAlign: 'center', marginTop: '1px' },
                      onClick: (event) => handleOnOpenDateRange(event),
                    },
                    readOnly: true,
                  }}
                />
              </Box>
              <DateRangePopper
                isOpen={Boolean(anchorEl)}
                selectedDates={filterSelectedDates}
                handleOnChange={handleDateRangeChange}
                anchorEl={anchorEl}
                onClose={() => handleOnCloseDateRange()}
              />
            </Box>
            {isFetching ? (
              <LogsSkeletonLoader />
            ) : !_.isEmpty(logsDataSource) ? (
              logsDataSource.map((datasource, logIndex) => (
                <List key={logIndex} datasource={datasource}>
                  {!_.isEmpty(datasource.category) &&
                    datasource.category
                      .filter((i) => !_.isEmpty(i.total_time))
                      .map((log, index) => (
                        <ListItem
                          key={index}
                          log={{
                            ...log,
                            categoryStatus: log?.data[0].category?.status,
                            taskTimerId: log?.data
                              ? log?.data[0].task_timer_id
                              : log?.task_timer_id,
                            selectedTask: isParent(log)
                              ? log?.category_name
                              : log?.data
                              ? log?.data[0].category?.name
                              : log?.category_name,
                            selectedPartner: log.data
                              ? log.data[0]?.partner
                              : log.partner,
                            selectedCampaign: log.data
                              ? log.data[0]?.campaign
                              : log.campaign,
                            selectedConcept: log.data
                              ? log.data[0]?.concept
                              : log.concept,
                            selectedTags: log.data
                              ? log.data[0].tags
                              : log.tags,
                            total: log?.data ? log?.total_time : log?.total,
                          }}
                          tasksDatasource={categories}
                          //tagsDatasource={options.tagsList}
                          tagsDatasource={tagsList}
                          partnersDatasource={
                            userData.is_smartly
                              ? smartlyPartners
                              : adweavePartners
                          }
                          teamId={userData.team_id}
                          campaignsDatasource={campaigns}
                          conceptsDatasource={concepts}
                          onPresetsSelectionChange={(_log, task) =>
                            handleExistingLogOnPresetsSelectionChange(
                              _log,
                              task
                            )
                          }
                          onPartnersSelectionChange={(_log, data, reason) =>
                            handleExistingOnPartnersSelectionChange(
                              _log,
                              data,
                              reason,
                              logIndex
                            )
                          }
                          onCampaignsSelectionChange={(_log, data, reason) =>
                            handleExistingOnCampaignsSelectionChange(
                              _log,
                              data,
                              reason,
                              logIndex
                            )
                          }
                          onConceptsSelectionChange={(_log, data, reason) =>
                            handleExistingOnConceptsSelectionChange(
                              _log,
                              data,
                              reason,
                              logIndex
                            )
                          }
                          onStartPreviousLog={(_log) =>
                            handleOnStartTimerPreviousLog(_log)
                          }
                          onTimeChange={(_log, startTime, endTime) =>
                            handleOnTimeChange(_log, startTime, endTime)
                          }
                          onAddTags={handleExistingOnAddTags}
                          onDelete={handleOnDelete}
                          inputPlaceholder="Add description"
                          isParent={isParent(log)}
                          isSmartly={userData.is_smartly}
                          activeTimer={
                            !_.isEmpty(activeTimer) || isUpdatingTimer
                          }
                          handleTagsList={handleTagsList}
                          handleExistingOnRemoveAllTags={
                            handleExistingOnRemoveAllTags
                          }
                          handleOnOpenPartners={handleOnOpenPartners}
                          handleOnOpenConcepts={handleOnOpenConcepts}
                          handleOnOpenCampaign={handleOnOpenCampaign}
                          isFetchingPartners={isFetchingPartners}
                          isFetchingConcepts={isFetchingConcepts}
                          isFetchingCampaigns={isFetchingCampaigns}
                        />
                      ))}
                </List>
              ))
            ) : (
              <Card variant="outlined" sx={{ borderStyle: 'dashed' }}>
                <Stack alignItems="center" p={3}>
                  <Box>
                    <IconButton
                      size="large"
                      color="error"
                      disableRipple
                      disableTouchRipple
                      disableFocusRipple
                      sx={{ backgroundColor: '#f2445c1a' }}
                    >
                      <ListAltIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography fontWeight={700} color="#999999">
                      No task timelogs found.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            )}
            {
              //_.isNull(logs?.next_page_url) &&
              !_.isEmpty(logs ?? []) &&
                (isFetchingWithPagination ? (
                  <Stack direction="row" justifyContent="center">
                    <CircularProgress
                      size={26}
                      color="secondary"
                      thickness={7}
                    />
                  </Stack>
                ) : (
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      onClick={handleScrollPaginate}
                      endIcon={<ExpandMoreIcon />}
                    >
                      {'Load More'}
                    </Button>
                  </Stack>
                ))
            }
          </Stack>
        ) : activeTab === 'task' && !_.isEmpty(taskTimers) ? (
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight={800} mb={1}>
              Active Timers
            </Typography>
            <Stack spacing={1}>
              {taskTimers.map((data, index) => (
                <ActiveTaskTimer key={index} data={data} />
              ))}
            </Stack>
          </Stack>
        ) : (
          <Stack
            sx={{
              height: '60vh',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            spacing={-3}
          >
            <img width={200} src={emptyImage} alt="empty-favorites" />
            <Typography color="primary" variant="span" fontWeight={700}>
              NO ACTIVE TIMERS AVAILABLE
            </Typography>
          </Stack>
        )}
      </Box>
    </Dialog>
  );
};

TaskTimer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.any,
};

export default TaskTimer;
