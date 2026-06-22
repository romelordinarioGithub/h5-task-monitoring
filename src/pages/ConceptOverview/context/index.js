import React, { createContext, useEffect, useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CircularLoader from 'components/Common/CircularLoader';
import GlobalDrawer from 'components/Common/Drawer';
import GlobalPopover from 'components/Common/Popover';
import ConceptListFilters from '../components/ConceptListFilters';
import {
  getConceptList,
  getConceptOverview,
  updateCampaignList,
  getReferences,
  getNewCampaigns,
  getPartners,
  getNewConcepts,
  getMembers,
  getStatus,
  getCampaignTask,
  getChannelTask,
  updateGlobal,
  resetNotification,
  addReferenceLink,
  deleteReferenceLink,
  updateReferenceLink,
  getInputDatasources,
  updateConceptList,
  getMilestoneTemplates,
  updateMilestone,
  startMilestone,
  getMilestoneTemplatesPublic,
  getMilestoneCSV,
  getMilestoneLogs,
  getPaginatedMilestoneLogs,
  updateNotes,
  errorStartMilestoneTemplates,
  resetConceptTaskList,
  updateMilestoneOriginalTimeline,
  addCustomCampaign,
  sortCampaignList,
  updateBulkReferenceLink,
  getReferencesLinksLogs,
  resetReferenceLinks,
} from 'store/reducers/projects';
import { useParams, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { Alert, AlertTitle, Slide, Snackbar } from '@mui/material';
import GlobalDialog from '../components/GlobalDialog';
import Status from 'pages/ConceptOverview/components/common/Status';
import Users from 'pages/ConceptOverview/components/common/Users';
import DateTime from 'pages/ConceptOverview/components/common/DateTime';
import FilterAsset from '../components/FilterAsset';
import RangeDate from '../components/common/RangeDate';
import ReferenceContent from '../components/ReferenceContent';
import ReferenceLogs from '../components/ReferenceLogs';
import FilterColumns from '../components/common/FilterColumns';
import { formatDate } from 'utils/date';
import {
  milestoneStatuses,
  chart_filter_list,
  templateTable,
  milestoneOwnerTypes,
  visibilityTypes,
} from '../constant';
import Swal from 'sweetalert2';
import FilterChart from '../components/common/FilterChart';
import moment from 'moment-timezone';
import { getItemByKey } from 'utils/dictionary';
import Notes from '../views/Milestone/Notes';

import { fetchRegion } from 'store/reducers/profile';
import DatePicker from '../components/common/DatePicker';

import { setActiveMilestoneColumns } from 'store/reducers/filters';
import CampaignCreation from '../components/CampaignCreation';

// Styles
import { useStyles } from 'components/Affix/styles';

const ConceptOverviewContext = createContext();

function TransitionRight(props) {
  return <Slide {...props} direction="left" />;
}

export function ConceptOverviewProvider({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);

  const classes = useStyles();

  const [, setOpenNotification] = useState(false);
  const [, setIsDownloadSuccess] = useState('none');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openConceptFilter, setOpenConceptFilter] = useState(false);
  const [openCampaignCreation, setOpenCampaignCreation] = useState(false);

  // popper
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverType, setPopoverType] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [value, setValue] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [taskChannel, setTaskChannel] = useState(null);
  const [filterChart, setFilterChart] = useState('Day');

  // const [activeMilestoneColumns, setActiveMilestoneColumns] =
  //   useState(templateTable);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeZone, setTimeZone] = useState(moment.tz.guess());
  const [holidays, setHolidays] = useState([]);

  //Custom Campaign
  const [taskName, setTaskName] = useState('');
  const [channel, setChannel] = useState('');
  const [launchDate, setLaunchDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [sortCampaign, setSortCampaign] = useState('desc');
  const [orderCampaign, setOrderCampaign] = useState('date_created');

  // Reference links
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsLink, setRowsLink] = useState(10);
  const [searchLink, setSearchLink] = useState('');

  //Previous Path
  const previousPathRef = useRef(location.pathname);

  const {
    fetchConceptOverview,
    fetchCampaignList,
    conceptOverview,
    conceptTaskList,
    conceptList,
    campaignList,
    fetchUpdateCampaignList,
    errorConceptOverview,
    referenceLinks,
    fetchReferenceLinks,
    errorReferenceLinks,
    referenceLinksLogs,
    fetchSyncCampaign,
    partners,
    fetchPartners,
    members,
    fetchMembers,
    statuses,
    fetchStatuses,
    fetchConceptTaskList,
    fetchCampaignTask,
    fetchSyncConcept,
    isNotify,
    notification,
    inputDatasources,
    fetchInputDatasources,
    milestone,
    fetchMilestoneTemplates,
    fetchMilestoneLogs,
  } = useSelector((state) => state.projects);

  const { data: user } = useSelector((state) => state.user);
  const {
    conceptMilestone: { table: activeMilestoneColumns },
  } = useSelector((state) => state.filters);

  const {
    region: { data: regionData },
  } = useSelector((state) => state.profile);

  // concept list filters
  const [conceptListFilters, setConceptListFilters] = useState({
    name: '',
    partnerGroups: user?.partners.filter((partner) => {
      return (
        partner.id !== '' && partner.partner_id !== '' && partner.name !== null
      );
    }),
    members: [],
    statuses: [],
    dateDelivered: [],
    dateCreated: [],
  });

  const { partnerId, conceptId, type } = useParams();

  const campaignId = urlParams.get('campaignId');

  const isMilestonesEnabled =
    !_.isEmpty(milestone.templates.google_display) ||
    !_.isEmpty(milestone.templates.google_video) ||
    !_.isEmpty(milestone.templates.facebook_static) ||
    !_.isEmpty(milestone.templates.facebook_video) ||
    !_.isEmpty(milestone.templates.youtube);

  useEffect(() => {
    if (_.isUndefined(type)) {
      dispatch(getMilestoneTemplatesPublic(conceptId));
    } else {
      dispatch(resetConceptTaskList());
      dispatch(
        getConceptOverview(
          {
            conceptId,
            partnerId,
          },
          sortCampaign,
          orderCampaign,
          !_.isNull(campaignId)
        )
      );
      if (_.isNull(campaignId)) {
        dispatch(getMilestoneTemplates(conceptId));
        type.includes('milestone') && dispatch(getMilestoneLogs(conceptId));
      }
    }

    if (window.location.pathname.includes('milestone')) dispatch(fetchRegion());
  }, [conceptId, partnerId, type]);

  useEffect(() => {
    //Update milestone when closing task modal
    if (
      previousPathRef.current.includes('task') &&
      window.location.pathname.includes('milestone')
    ) {
      dispatch(getMilestoneLogs(conceptId));
      dispatch(getMilestoneTemplates(conceptId, false));
    }

    previousPathRef.current = window.location.pathname;
  }, [window.location.pathname]);

  useEffect(() => {
    !_.isEmpty(conceptOverview) &&
      (document.title = `${conceptOverview?.name} - Ad-Weave.io`);
  }, [conceptOverview]);

  useEffect(() => {
    loadConceptList();
  }, [conceptListFilters]);

  useEffect(() => {
    if (!isSidebarOpen) setOpenConceptFilter(false);
  }, [isSidebarOpen]);

  const ToastSuccess = Swal.mixin({
    toast: true,
    icon: 'success',
    width: 500,
    position: 'top-right',
    showConfirmButton: false,
    timer: 1500,
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

  const loadMoreCampaigns = (conceptId, page, sort, order) => {
    dispatch(updateCampaignList(conceptId, page, sort, order));
  };

  const loadConceptList = (page = 1, wantsToPaginate = false) => {
    const params = {
      filter: {
        name: conceptListFilters.name,
        partner_uuid: conceptListFilters.partnerGroups.map((i) => i.id),
        'userPartners.user_id': conceptListFilters.members.map((i) => i.id),
        status: conceptListFilters.statuses.map((i) => i.name),
        date_created: !_.isEmpty(conceptListFilters.dateCreated)
          ? [`${conceptListFilters.dateCreated.map((i) => i.parsed)}`]
          : [],
      },
    };

    wantsToPaginate
      ? dispatch(updateConceptList(page, params))
      : dispatch(getConceptList(params, page));
  };

  const downloadAllAssets = (assetUrls, assetName) => {
    setIsDownloadSuccess('none');
    const zip = new JSZip();

    const assetLinks = assetUrls.map(async (item) => {
      if (
        item?.name?.includes('pdf') ||
        item?.name?.includes('psd') ||
        item?.name?.includes('mp4')
      ) {
        return null;
      } else {
        const response = await fetch(item.url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/octet-stream; charset=utf-8',
          },
        });
        const data = response.blob();

        zip.file(item.name, data);

        return data;
      }
    });

    Promise.all(assetLinks)
      .then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          saveAs(content, `${assetName}.zip`);
        });
      })
      .then(() => {
        setOpenNotification(true);
        setIsDownloadSuccess('yes');
      })
      .catch(() => {
        setOpenNotification(true);
        setIsDownloadSuccess('no');
      });
  };

  const onSearchConceptList = (query) => {
    setConceptListFilters((prev) => ({ ...prev, name: query }));
  };

  const onFilterConceptList = (filter) => {
    setConceptListFilters((prev) => ({ ...prev, ...filter }));
  };

  const onOpenConceptListFilter = () => {
    setOpenConceptFilter(!openConceptFilter);

    openConceptFilter !== true &&
      _.isEmpty(partners) &&
      dispatch(getPartners());
    openConceptFilter !== true && _.isEmpty(members) && dispatch(getMembers());
    openConceptFilter !== true && dispatch(getStatus(1));
  };

  const onOpenReferenceLink = (conceptId) => {
    const params = { rel_id: conceptId, page: 1, limit: 1000 };
    dispatch(resetReferenceLinks());
    dispatch(getReferences(conceptId));
    dispatch(getInputDatasources(params));
  };

  const handleReferenceLinkTable = (conceptId, page, row, search) => {
    setSelectedRows([]);
    setRowsLink(row);
    dispatch(
      getReferences(conceptId, page, row, {
        key: search,
      })
    );
  };

  const handleOnChangeCheckbox = (id) => {
    if (_.some(selectedRows, (row) => row === id)) {
      // Remove the id from the selections if the id is already selected.
      setSelectedRows(selectedRows.filter((row) => row !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleOnChangeSelectAllCheckbox = (ids) => {
    if (_.difference(ids, selectedRows).length === 0) {
      // Deselect all rows if all rows are selected
      setSelectedRows(_.difference(selectedRows, ids));
    } else {
      setSelectedRows(_.uniq([...selectedRows, ...ids]));
    }
  };

  const onScrollToLastItem = (lastItem) => {
    const nextPage = conceptList?.current_page + 1;
    if (nextPage <= conceptList?.last_page) {
      loadConceptList(nextPage, true);
    } else {
      lastItem();
    }
  };

  const handleCloseNotification = () => {
    dispatch(resetNotification());
  };

  const handleSyncCampaign = () => {
    dispatch(getNewCampaigns(conceptId));
  };

  const handleSyncConcept = (partnerId) => {
    dispatch(getNewConcepts(partnerId));
  };

  const handlePopover = (_e, _type, _value, _id, _parentId, _channel) => {
    setAnchorEl(_e.currentTarget);
    setPopoverType(_type);
    setValue(_value); // default popover data
    setUpdateId(_id); // task/rel id
    setParentId(_parentId);

    const channel =
      _channel === 1
        ? 'googleDisplay'
        : _channel === 2
        ? 'googleVideo'
        : _channel === 3
        ? 'metaStatic'
        : _channel === 4
        ? 'metaVideo'
        : 'youtubeVideo';

    setTaskChannel(channel);

    switch (_type) {
      case 'concept_status':
        dispatch(getStatus(1));
        break;
      case 'campaign_status':
        dispatch(getStatus(2));
        break;
      case 'task_status':
      case 'task_status_campaign':
        dispatch(getStatus(3));
        break;
      case 'campaign_followers':
      case 'concept_followers':
      case 'task_assignees':
      case 'task_assignees_campaign':
      case 'task_watchers':
      case 'task_watchers_campaign':
        _.isEmpty(members) && dispatch(getMembers());
        break;
    }
  };

  const handleOnClickCopyPublicMilestoneLink = () => {
    ToastSuccess.fire({
      title: 'Copied successfully!',
    });
    navigator.clipboard.writeText(
      `${window.location.hostname}/projects/${partnerId}/concept/${conceptId}/public/milestone`
    );
  };

  const handleUpdateOriginalTimeline = (channelId) => {
    Swal.fire({
      title: 'Do you want to update the original timeline?',
      icon: 'warning',
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
      backdrop: '#25175aa3',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { success, error } = await dispatch(
          updateMilestoneOriginalTimeline(conceptId, channelId)
        );

        // Refetch milestone
        if (success === true) {
          await dispatch(getMilestoneLogs(conceptId));
          await dispatch(getMilestoneTemplates(conceptId, false));
          ToastSuccess.fire({
            title: 'Updated successfully!',
          });
        } else {
          await dispatch(errorStartMilestoneTemplates());
          ToastError.fire({
            title: `${error}`,
          });
        }
      }
    });
  };

  const handleOnClickColumnsFilter = (_e, _type) => {
    setAnchorEl(_e.currentTarget);
    setPopoverType(_type);
  };

  const handleOnSelectColumnsFilter = (value) => {
    if (_.isArray(value)) {
      dispatch(setActiveMilestoneColumns(value));
    } else {
      const isAlreadySelected = !_.isEmpty(
        getItemByKey('id', value?.id, activeMilestoneColumns)
      );

      const columns = isAlreadySelected
        ? _.filter(activeMilestoneColumns, (i) => i.id !== value.id)
        : [
            ...activeMilestoneColumns.slice(0, value.id),
            value,
            ...activeMilestoneColumns.slice(value.id),
          ];
      const sortedColumns = columns.sort((a, b) => a.id - b.id);

      dispatch(setActiveMilestoneColumns(sortedColumns));
    }
  };

  const handleChannelTask = async (channelId) => {
    return await dispatch(getChannelTask(conceptId, channelId));
  };

  const handleCampaignTasks = (campaignId) => {
    dispatch(getCampaignTask(campaignId));
  };

  const handleDialogOpen = (_value, _type) => {
    setIsDialogOpen(!isDialogOpen);
    setDialogType(_type);
    setValue(_value);
  };

  const handleOnSubmitMilestoneSLA = async (template) => {
    const params = {
      id: template.id,
      key: 'sla',
      value: template.value,
    };
    updateMilestoneColumn(params);
  };

  const handleOnChartMilestone = async (start, end, input, task) => {
    const handleChangeStartDate = async () => {
      const startParams = {
        id: input?.id,
        key: 'adjusted_start_date',
        value: start,
      };
      const updateStart = await dispatch(updateMilestone(startParams));

      !updateStart.success && ToastError.fire({ title: updateStart?.message });
    };

    const handleChangeEndDate = async () => {
      const endParams = {
        id: input?.id,
        key: 'adjusted_due_date',
        value: end,
      };

      const updateEnd = await dispatch(updateMilestone(endParams));

      !updateEnd?.success && ToastError.fire({ title: updateEnd?.message });
    };

    // Checks if it is Weekend
    if (
      moment(start).day() == 6 ||
      moment(start).day() == 0 ||
      moment(end).day() == 6 ||
      moment(end).day() == 0
    ) {
      ToastError.fire({ title: 'Weekend is not allowed' });
      return dispatch(getMilestoneTemplates(conceptId, false));
    }

    if (moment(input?.end).diff(moment(task?.start)) >= 0) {
      !moment(input?.end).isSame(moment(task?.end)) &&
        (await handleChangeEndDate());
      !moment(input?.start).isSame(moment(task?.start)) &&
        (await handleChangeStartDate());
    } else {
      !moment(input?.start).isSame(moment(task?.start)) &&
        (await handleChangeStartDate());
      !moment(input?.end).isSame(moment(task?.end)) &&
        (await handleChangeEndDate());
    }

    // Refetch milestone
    dispatch(getMilestoneLogs(conceptId));
    dispatch(getMilestoneTemplates(conceptId, false));
  };

  const handleOnStartMilestone = async (channelId, taskTypeId) => {
    const params = {
      concept_id: conceptId,
      channel_id: channelId,
      task_type: taskTypeId,
    };
    const isSuccess = await dispatch(startMilestone(params));

    if (isSuccess === true) {
      await dispatch(getMilestoneTemplates(conceptId));
      ToastSuccess.fire({
        title: 'Milestone has started.',
      });
    } else {
      await dispatch(errorStartMilestoneTemplates());
      ToastError.fire({
        title: `${isSuccess}`,
      });
    }
  };

  const handleUpdateGlobal = async (_value, _data) => {
    if (type.includes('milestone') && popoverType !== 'concept_status') {
      const key = popoverType.replace('milestone_', '');
      const value =
        popoverType.includes('owner_type') || popoverType.includes('visibility')
          ? _data
          : _value;
      const params = {
        id: updateId,
        key,
        value,
      };
      updateMilestoneColumn(params);
    } else {
      const isCampaignTask = popoverType?.split('_').includes('campaign');
      const isParent = _.isNull(parentId);
      const key = popoverType.replace('_campaign', '');
      dispatch(
        updateGlobal(
          {
            id: updateId,
            key: key,
            value: _value,
            is_parent: isCampaignTask ? true : isParent,
          },
          {
            data: _data, // any form of data e.g string/object/array
            parent_id: parentId,
            channel: taskChannel,
          },
          (error) => {
            ToastError.fire({
              title: error,
            });
          }
        )
      );
    }

    // Closes pop-up after column update
    !['campaign_followers', 'task_assignees', 'task_watchers'].includes(
      popoverType
    ) && setAnchorEl(null);
  };

  const handleSetHoliday = (_value) => {
    if (popoverType === 'holiday_add') {
      setHolidays([...holidays, { id: holidays.length, date: _value }]);
    }

    setAnchorEl(null);
  };

  const handleDependencyToggle = async (milestoneId, value) => {
    const params = {
      id: milestoneId,
      key: 'dependencies',
      value,
    };
    updateMilestoneColumn(params);
  };

  const handleAddReferenceLink = (inputs) => {
    // const params = { ...inputs, rel_id: conceptId, rel_type: 1 };
    const params = {
      links: inputs.map((data) => ({
        ...data,
        rel_id: conceptId,
        rel_type: 1,
      })),
    };
    setSelectedRows([]);
    dispatch(
      addReferenceLink(conceptId, params, 1, rowsLink, {
        key: searchLink,
      })
    );
  };

  const handleGetReferenceLinksLogs = (id) => {
    dispatch(getReferencesLinksLogs(id));
  };

  const handleUpdateReferenceLink = (inputs) => {
    const params = { ...inputs, rel_id: conceptId, rel_type: 1 };
    setSelectedRows([]);
    if (_.isEmpty(selectedRows)) {
      dispatch(
        updateReferenceLink(conceptId, params, 1, rowsLink, {
          key: searchLink,
        })
      );
    } else {
      dispatch(
        updateBulkReferenceLink(
          conceptId,
          { ...params, link_id: selectedRows },
          1,
          rowsLink,
          {
            key: searchLink,
          }
        )
      );
    }
  };

  const handleDeleteReferenceLink = (referenceLinkId, page, limit) => {
    Swal.fire({
      title: `Do you want to delete ${
        _.isEmpty(selectedRows) ? 'this' : 'selected'
      } reference link?`,
      icon: 'warning',
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
      backdrop: '#25175aa3',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const params = {
          id: _.isEmpty(selectedRows) ? [referenceLinkId] : selectedRows,
        };
        setSelectedRows([]);
        dispatch(
          deleteReferenceLink(conceptId, params, page, limit, {
            key: searchLink,
          })
        );
      }
    });
  };

  const handleDropdownChart = () => {
    setFilterChart(7);
  };

  const handleOnClickSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsFullscreen(false);
  };

  const handleOnClickExpandToggle = () => {
    setIsSidebarOpen(isFullscreen);
    setIsFullscreen(!isFullscreen);
  };

  const handleDownloadCSV = () => {
    dispatch(
      getMilestoneCSV(
        conceptId,
        conceptOverview?.partner_name,
        conceptOverview?.name
      )
    );
  };

  const handleOnPaginateMilestoneLogs = () => {
    dispatch(
      getPaginatedMilestoneLogs(conceptId, milestone.logs.current_page + 1)
    );
  };

  const updateMilestoneColumn = async (params) => {
    const { success, message } = await dispatch(updateMilestone(params));
    if (success) {
      dispatch(getMilestoneTemplates(conceptId, false));
      dispatch(getMilestoneLogs(conceptId));
    } else {
      ToastError.fire({ title: message });
    }
  };

  const handleOnClickSaveNotes = async (params) => {
    await dispatch(updateNotes(params));
    dispatch(getMilestoneTemplates(conceptId, false));
  };

  function handleCampaignCreationClick() {
    setOpenCampaignCreation((prev) => !prev);
  }

  const handleCustomCampaignSubmit = () => {
    const formData = new FormData();

    formData.append('name', taskName);
    formData.append('channel_id', channel?.id ?? null);
    formData.append('concept_id', conceptId);
    formData.append('partner_id', partnerId);
    formData.append('delivery_type', 'NON_TRAFFICKED');
    formData.append('personalization_type', 'DECISION_TREE');
    formData.append(
      'delivery_date',
      moment(deliveryDate).format('YYYY-MM-DD hh:mm:ss')
    );
    formData.append(
      'launch_date',
      moment(launchDate).format('YYYY-MM-DD hh:mm:ss')
    );
    dispatch(addCustomCampaign(formData));
  };

  const handleSortCampaign = (name, order) => {
    setOrderCampaign(name);
    setSortCampaign(order === 'asc' ? 'desc' : 'asc');
    if (campaignList?.total > campaignList?.data?.length)
      dispatch(
        sortCampaignList(
          conceptId,
          1,
          order === 'asc' ? 'desc' : 'asc',
          name,
          campaignList?.campaign?.data?.length
        )
      );
  };

  return (
    <ConceptOverviewContext.Provider
      value={{
        user,
        taskName,
        channel,
        deliveryDate,
        launchDate,
        setTaskName,
        setChannel,
        setDeliveryDate,
        setLaunchDate,
        conceptOverview,
        conceptList,
        campaignList,
        referenceLinks,
        partners,
        milestone,
        fetchPartners,
        conceptTaskList,
        regionData,
        timeZone,
        fetchConceptTaskList,
        fetchUpdateCampaignList,
        openConceptFilter,
        errorConceptOverview,
        fetchReferenceLinks,
        errorReferenceLinks,
        fetchSyncCampaign,
        fetchSyncConcept,
        members,
        fetchMembers,
        statuses,
        activeMilestoneColumns,
        fetchStatuses,
        fetchCampaignTask,
        fetchMilestoneTemplates,
        fetchMilestoneLogs,
        setFilterChart,
        setTimeZone,
        filterChart,
        loadMoreCampaigns,
        onSearchConceptList,
        onOpenConceptListFilter,
        onOpenReferenceLink,
        onFilterConceptList,
        onScrollToLastItem,
        downloadAllAssets,
        conceptListFilters,
        inputDatasources,
        fetchInputDatasources,
        campaignId,
        handleDependencyToggle,
        handleSyncCampaign,
        handleSyncConcept,
        handlePopover,
        handleCampaignTasks,
        handleChannelTask,
        handleDialogOpen,
        handleUpdateGlobal,
        handleAddReferenceLink,
        handleDeleteReferenceLink,
        handleUpdateReferenceLink,
        handleOnSubmitMilestoneSLA,
        handleOnChartMilestone,
        handleOnStartMilestone,
        handleOnClickColumnsFilter,
        handleOnClickSidebarToggle,
        handleOnClickExpandToggle,
        handleOnClickCopyPublicMilestoneLink,
        handleDownloadCSV,
        handleOnPaginateMilestoneLogs,
        handleReferenceLinkTable,
        handleOnClickSaveNotes,
        handleOnSelectColumnsFilter,
        handleUpdateOriginalTimeline,
        isMilestonesEnabled,
        isSidebarOpen,
        isFullscreen,
        holidays,
        handleSetHoliday,
        handleCampaignCreationClick,
        handleCustomCampaignSubmit,
        handleSortCampaign,
        orderCampaign,
        sortCampaign,
        handleOnChangeCheckbox,
        handleOnChangeSelectAllCheckbox,
        handleGetReferenceLinksLogs,
        selectedRows,
        rowsLink,
        setRowsLink,
        searchLink,
        setSearchLink,
      }}
    >
      {children}
      {(fetchConceptOverview ||
        fetchCampaignList ||
        fetchConceptTaskList ||
        fetchMilestoneTemplates) && <CircularLoader />}
      <GlobalDrawer
        content={<ConceptListFilters />}
        transitionDuration={{ enter: 300, exit: 400 }}
        name="drawer"
        isOpen={openConceptFilter}
        anchor="left"
        BackdropProps={{
          invisible: true,
          sx: { backgroundColor: '#25175aa3' },
        }}
        sx={{
          width: 300,
          zIndex: 1,
          '& .MuiDrawer-paper': {
            boxShadow: '10px 0 13px 1px #00000045',
            left: '300px',
            width: 300,
            marginTop: '50px',
          },
        }}
        hideBackdrop={true}
      />
      <GlobalDrawer
        content={<CampaignCreation onClose={handleCampaignCreationClick} />}
        transitionDuration={{ enter: 300, exit: 0 }}
        name="search"
        width={600}
        isOpen={openCampaignCreation}
        className={classes.drawer}
        anchor="left"
      />

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={6000}
        open={isNotify}
        onClose={handleCloseNotification}
        sx={{ width: 400 }}
        TransitionComponent={TransitionRight}
      >
        <Alert
          severity={notification?.type}
          sx={{ width: '100%' }}
          elevation={9}
          onClose={handleCloseNotification}
        >
          <AlertTitle sx={{ textTransform: 'capitalize' }}>
            {notification?.type}
          </AlertTitle>
          {notification?.message}
        </Alert>
      </Snackbar>

      <GlobalPopover
        id={`${popoverType}-popover`}
        isOpen={Boolean(anchorEl)}
        anchorEl={anchorEl}
        popperHorizontal="left"
        content={
          <>
            {popoverType?.toLowerCase()?.includes('milestone_status') ? (
              <Status
                data={milestoneStatuses}
                value={value}
                fetch={false}
                handleUpdateGlobal={handleUpdateGlobal}
              />
            ) : popoverType?.toLowerCase()?.includes('status') ? (
              <Status
                data={statuses}
                fetch={fetchStatuses}
                value={value}
                handleUpdateGlobal={handleUpdateGlobal}
              />
            ) : popoverType?.toLowerCase()?.includes('owner_type') ? (
              <Status
                data={milestoneOwnerTypes}
                fetch={false}
                value={value}
                handleUpdateGlobal={handleUpdateGlobal}
              />
            ) : popoverType?.toLowerCase()?.includes('visibility') ? (
              <Status
                data={visibilityTypes}
                fetch={false}
                value={value}
                handleUpdateGlobal={handleUpdateGlobal}
              />
            ) : [
                'milestone_adjusted_due_date',
                'milestone_adjusted_start_date',
                'task_due_date',
                'task_due_date_campaign',
                'task_delivery_date',
                'task_delivery_date_campaign',
                'campaign_launch_date',
                'campaign_delivery_date',
              ].includes(popoverType?.toLowerCase()) ? (
              <DateTime value={value} handleUpdateGlobal={handleUpdateGlobal} />
            ) : popoverType?.toLowerCase()?.includes('tag') ? (
              popoverType
            ) : popoverType
                ?.toLowerCase()
                ?.includes('filter_reference_link') ? (
              popoverType
            ) : popoverType
                ?.toLowerCase()
                ?.includes('filter_platform_assets') ? (
              <FilterAsset assets={conceptOverview?.brief?.assets} />
            ) : popoverType?.toLowerCase()?.includes('range') ? (
              <RangeDate
                onChange={(ranges) =>
                  onFilterConceptList({
                    dateCreated: [
                      {
                        raw: ranges[0].startDate,
                        parsed: formatDate(ranges[0].startDate, 'YYYY-MM-DD'),
                      },
                      {
                        raw: ranges[0].endDate,
                        parsed: formatDate(ranges[0].endDate, 'YYYY-MM-DD'),
                      },
                    ],
                  })
                }
              />
            ) : popoverType?.toLowerCase()?.includes('chart') ? (
              <FilterChart
                dropdowns={chart_filter_list}
                onDropdownChange={handleDropdownChart}
              />
            ) : popoverType?.toLowerCase()?.includes('filter_columns') ? (
              <FilterColumns
                value={activeMilestoneColumns}
                data={templateTable}
                onSelect={handleOnSelectColumnsFilter}
              />
            ) : ['holiday_add', 'holiday_edit'].includes(
                popoverType?.toLowerCase()
              ) ? (
              <DatePicker
                value={value}
                handleUpdateGlobal={handleSetHoliday}
                popoverType={popoverType}
              />
            ) : (
              <Users
                data={members?.data}
                fetch={fetchMembers}
                value={value}
                onSelect={handleUpdateGlobal}
              />
            )}
          </>
        }
        handleClose={() => setAnchorEl(null)}
      />
      <GlobalDialog
        open={isDialogOpen}
        handleClose={() => handleDialogOpen(null, dialogType)}
        content={
          dialogType?.toLowerCase().includes('notes') ? (
            <Notes
              open={isDialogOpen}
              data={value}
              onSave={handleOnClickSaveNotes}
              onClose={() => handleDialogOpen(null, dialogType)}
              isEditable={
                !window.location.pathname.includes('public/milestone')
              }
            />
          ) : dialogType?.toLowerCase().includes('logs') ? (
            <ReferenceLogs
              open={isDialogOpen}
              value={referenceLinksLogs}
              onClose={() => handleDialogOpen(null, dialogType)}
            />
          ) : (
            <ReferenceContent
              open={isDialogOpen}
              value={value}
              onClose={() => handleDialogOpen(null, dialogType)}
              inputDatasources={inputDatasources}
              handleAddReferenceLink={handleAddReferenceLink}
              handleUpdateReferenceLink={handleUpdateReferenceLink}
              selectedRows={selectedRows}
              isTask={false}
            />
          )
        }
      />
    </ConceptOverviewContext.Provider>
  );
}

ConceptOverviewProvider.propTypes = {
  children: PropTypes.any,
};

export default ConceptOverviewContext;
