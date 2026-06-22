import React, { createContext, useEffect, useState, useRef } from 'react';

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import CircularLoader from 'components/Common/CircularLoader';

import {
  errorStartMilestoneTemplates,
  getCampaignOverview,
  getCampaignTask,
  getMilestoneCSV,
  getMilestoneLogMonitoring,
  getMilestoneTemplates,
  getMilestoneTemplatesPublic,
  startMilestone,
  updateMilestone,
} from 'store/reducers/campaign';

import {
  getReferences,
  addReferenceLink,
  deleteReferenceLink,
  updateReferenceLink,
  getInputDatasources,
  updateBulkReferenceLink,
  getReferencesLinksLogs,
  resetReferenceLinks,
} from 'store/reducers/projects';
import _ from 'lodash';
import Swal from 'sweetalert2';
import moment from 'moment';
import GlobalDialog from 'pages/ConceptOverview/components/GlobalDialog';
import GlobalPopover from 'components/Common/Popover';
import FilterColumns from 'pages/ConceptOverview/components/common/FilterColumns';
import { setActiveMilestoneColumnsCampaign } from 'store/reducers/filters';
import { getItemByKey } from 'utils/dictionary';
import {
  milestoneOwnerTypes,
  milestoneStatuses,
  templateTable,
  visibilityTypes,
} from 'pages/ConceptOverview/constant';
import Notes from 'pages/ConceptOverview/views/Milestone/Notes';
import { getMembers, getStatus, updateGlobal } from 'store/reducers/projects';
import Status from 'pages/ConceptOverview/components/common/Status';
import DateTime from 'pages/ConceptOverview/components/common/DateTime';
import { requestMilestoneOriginalTimeline } from 'services/api/campaign';
import Users from 'pages/ConceptOverview/components/common/Users';
import ReferenceContent from 'pages/ConceptOverview/components/ReferenceContent';
import ReferenceLogs from 'pages/ConceptOverview/components/ReferenceLogs';

const CampaignOverviewContext = createContext();

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

export function CampaignOverviewProvider({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { conceptId, partnerId, type } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // popper
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverType, setPopoverType] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [value, setValue] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [taskChannel, setTaskChannel] = useState(null);
  const [timeZone, setTimeZone] = useState(moment.tz.guess());

  // Reference links
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsLink, setRowsLink] = useState(10);
  const [searchLink, setSearchLink] = useState('');

  const previousPathRef = useRef(location.pathname);

  const { data: userData } = useSelector((state) => state.user);

  const {
    overview,
    milestone,
    tasks,
    fetchCampaignTasks,
    errorCampaignTasks,
    fetchCampaignOverview,
    errorCampaignOverview,
    fetchMilestoneTemplates,
    fetchMilestoneLogs,
  } = useSelector((state) => state.campaign);

  const {
    statuses,
    members,
    fetchMembers,
    referenceLinks,
    fetchReferenceLinks,
    errorReferenceLinks,
    referenceLinksLogs,
    inputDatasources,
  } = useSelector((state) => state.projects);

  const {
    campaignMilestone: { table: activeMilestoneColumns, isHideInActive },
  } = useSelector((state) => state.filters);

  const urlParams = new URLSearchParams(location.search);

  const channelId = _.last(tasks)?.channel_id;
  const taskTypeId = _.last(tasks)?.task_type_id;
  const campaignId = urlParams.get('campaignId');
  const isActiveMilestonePage = !_.isEmpty(urlParams.get('milestone'));
  const isActiveReferenceLink = !_.isEmpty(urlParams.get('links'));

  const isMilestonesEnabled =
    !_.isEmpty(milestone.templates.google_display) ||
    !_.isEmpty(milestone.templates.google_video) ||
    !_.isEmpty(milestone.templates.facebook_static) ||
    !_.isEmpty(milestone.templates.facebook_video) ||
    !_.isEmpty(milestone.templates.youtube);

  useEffect(() => {
    if (_.isUndefined(type)) {
      dispatch(getMilestoneTemplatesPublic(campaignId));
    } else {
      dispatch(getCampaignOverview(campaignId));
      dispatch(getCampaignTask(campaignId));

      // if (isActiveMilestonePage) {
      dispatch(getMilestoneTemplates(campaignId, false));
    }
  }, [campaignId]);

  useEffect(() => {
    // Update milestone when closing task modal
    if (
      previousPathRef.current.includes('task') &&
      window.location.pathname.includes('campaign')
    )
      dispatch(getMilestoneTemplates(campaignId, false));

    previousPathRef.current = window.location.pathname;
  }, [window.location.pathname]);

  const handlePopover = (_e, _type, _value, _id, _channel) => {
    setAnchorEl(_e.currentTarget);
    setPopoverType(_type);
    setValue(_value); // default popover data
    setUpdateId(_id); // task/rel id

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
        dispatch(getStatus(3));
        break;
      case 'campaign_followers':
      case 'concept_followers':
      case 'task_assignees':
      case 'task_watchers':
        dispatch(getMembers());
        break;
    }
  };

  const handleDialogOpen = (_value, _type) => {
    setIsDialogOpen(!isDialogOpen);
    setDialogType(_type);
    setValue(_value);
  };

  const handleOnClickColumnsFilter = (_e, _type) => {
    setAnchorEl(_e.currentTarget);
    setPopoverType(_type);
  };

  const handleOpenLogMonitoring = () => {
    dispatch(getMilestoneLogMonitoring(campaignId));
  };

  const handleOnClickCopyPublicMilestoneLink = () => {
    ToastSuccess.fire({
      title: 'Copied successfully!',
    });
    navigator.clipboard.writeText(
      `${window.location.hostname}/projects/${partnerId}/concept/${conceptId}/public/milestone/campaign?campaignId=${campaignId}&milestone=${channelId}`
    );
  };

  const handleOnSelectColumnsFilter = (value) => {
    if (_.isArray(value)) {
      dispatch(setActiveMilestoneColumnsCampaign(value));
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

      dispatch(setActiveMilestoneColumnsCampaign(sortedColumns));
    }
  };

  const handleOnStartMilestone = async () => {
    const params = {
      campaign_id: campaignId,
      channel_id: channelId,
      task_type: taskTypeId,
    };
    const isSuccess = await dispatch(startMilestone(params));

    if (isSuccess === true) {
      await dispatch(getMilestoneTemplates(campaignId));
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

  const handleOnClickSaveNotes = async (params) => {
    const { success, message } = await dispatch(updateMilestone(params));
    if (success) {
      await dispatch(getMilestoneTemplates(campaignId, false));
    } else {
      ToastError.fire({ title: message });
    }
  };

  const handleDependencyToggle = async (milestoneId, value) => {
    const params = {
      id: milestoneId,
      key: 'dependencies',
      value,
    };
    updateMilestoneColumn(params);
  };

  const handleOnSubmitMilestoneSLA = async (template) => {
    const params = {
      id: template.id,
      key: 'sla',
      value: template.value,
    };
    updateMilestoneColumn(params);
  };

  const handleDownloadCSV = () => {
    dispatch(
      getMilestoneCSV(campaignId, overview?.partner_name, overview?.name)
    );
  };

  const updateMilestoneColumn = async (params) => {
    const { success, message } = await dispatch(updateMilestone(params));
    if (success) {
      dispatch(getMilestoneTemplates(campaignId, false));
      dispatch(getCampaignTask(campaignId));
      // dispatch(getMilestoneLogs(conceptId));
    } else {
      ToastError.fire({ title: message });
    }
  };

  const updateMilestoneOriginalTimeline =
    (conceptId, channelId) => async () => {
      const response = await requestMilestoneOriginalTimeline(
        conceptId,
        channelId
      );
      return response;
    };

  const handleUpdateGlobal = async (_value, _data) => {
    // Closes pop-up after column update
    setAnchorEl(null);

    if (popoverType.includes('milestone')) {
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
      await dispatch(
        updateGlobal(
          {
            id: updateId,
            key: popoverType,
            value: _value,
            is_parent: true,
          },
          {
            data: _data, // any form of data e.g string/object/array
            channel: taskChannel,
            fromCampaign: true,
          },
          (error) => {
            ToastError.fire({
              title: error,
            });
          }
        )
      );
      dispatch(getMilestoneTemplates(campaignId, false));
      dispatch(getCampaignOverview(campaignId));
    }
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
      return dispatch(getMilestoneTemplates(campaignId, false));
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
    dispatch(getMilestoneTemplates(campaignId, false));
    dispatch(getCampaignTask(campaignId));
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
          updateMilestoneOriginalTimeline(campaignId, channelId)
        );

        // Refetch milestone
        if (success === true) {
          await dispatch(getMilestoneTemplates(campaignId, false));
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

  const onOpenReferenceLink = (conceptId) => {
    const params = { rel_id: conceptId, page: 1, limit: 1000 };
    dispatch(resetReferenceLinks());
    dispatch(
      getReferences(conceptId, 1, rowsLink, {
        rel_type: 'campaign',
        id: overview?.id,
      })
    );
    dispatch(getInputDatasources(params));
  };

  const handleReferenceLinkTable = (conceptId, page, row, search) => {
    setSelectedRows([]);
    setRowsLink(row);
    dispatch(
      getReferences(conceptId, page, row, {
        key: !_.isEmpty(search) ? search : null,
        rel_type: _.isEmpty(search) ? 'campaign' : null,
        id: _.isEmpty(search) ? overview?.id : null,
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

  const handleAddReferenceLink = (inputs) => {
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
        key: !_.isEmpty(searchLink) ? searchLink : null,
        rel_type: _.isEmpty(searchLink) ? 'campaign' : null,
        id: _.isEmpty(searchLink) ? overview?.id : null,
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
          key: !_.isEmpty(searchLink) ? searchLink : null,
          rel_type: _.isEmpty(searchLink) ? 'campaign' : null,
          id: _.isEmpty(searchLink) ? overview?.id : null,
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
            key: !_.isEmpty(searchLink) ? searchLink : null,
            rel_type: _.isEmpty(searchLink) ? 'campaign' : null,
            id: _.isEmpty(searchLink) ? overview?.id : null,
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
            key: !_.isEmpty(searchLink) ? searchLink : null,
            rel_type: _.isEmpty(searchLink) ? 'campaign' : null,
            id: _.isEmpty(searchLink) ? overview?.id : null,
          })
        );
      }
    });
  };

  return (
    <CampaignOverviewContext.Provider
      value={{
        campaignId,
        timeZone,
        milestone,
        overview,
        errorCampaignOverview,
        tasks,
        fetchCampaignTasks,
        errorCampaignTasks,
        isActiveMilestonePage,
        conceptId,
        channelId,
        fetchMilestoneTemplates,
        activeMilestoneColumns,
        isHideInActive,
        isMilestonesEnabled,
        setTimeZone,
        handlePopover,
        handleDependencyToggle,
        handleOnStartMilestone,
        handleOnSubmitMilestoneSLA,
        handleOnClickColumnsFilter,
        handleOnClickCopyPublicMilestoneLink,
        handleDownloadCSV,
        handleOnChartMilestone,
        handleDialogOpen,
        handleUpdateOriginalTimeline,
        handleAddReferenceLink,
        handleReferenceLinkTable,
        handleDeleteReferenceLink,
        handleUpdateReferenceLink,
        onOpenReferenceLink,
        handleOnChangeCheckbox,
        handleOnChangeSelectAllCheckbox,
        handleGetReferenceLinksLogs,
        selectedRows,
        rowsLink,
        setRowsLink,
        searchLink,
        setSearchLink,
        isActiveReferenceLink,
        referenceLinks,
        fetchReferenceLinks,
        errorReferenceLinks,
        inputDatasources,
        userData,
        fetchMilestoneLogs,
        handleOpenLogMonitoring,
      }}
    >
      {children}
      {(fetchCampaignOverview || fetchMilestoneTemplates) && <CircularLoader />}
      <GlobalPopover
        id={`${popoverType}-popover`}
        isOpen={Boolean(anchorEl)}
        anchorEl={anchorEl}
        popperHorizontal="left"
        content={
          <>
            {popoverType?.toLowerCase()?.includes('filter_columns') ? (
              <FilterColumns
                value={activeMilestoneColumns}
                data={templateTable}
                onSelect={handleOnSelectColumnsFilter}
              />
            ) : ['task_status', 'milestone_status', 'campaign_status'].includes(
                popoverType?.toLowerCase()
              ) ? (
              <Status
                data={
                  popoverType === 'milestone_status'
                    ? milestoneStatuses
                    : statuses
                }
                value={value}
                fetch={false}
                handleUpdateGlobal={handleUpdateGlobal}
              />
            ) : popoverType?.toLowerCase()?.includes('owner_type') ? (
              <Status
                data={milestoneOwnerTypes}
                fetch={false}
                value={value}
                handleUpdateGlobal={handleUpdateGlobal}
              />
            ) : [
                'task_due_date',
                'task_delivery_date',
                'milestone_adjusted_due_date',
                'milestone_adjusted_start_date',
              ].includes(popoverType?.toLowerCase()) ? (
              <DateTime value={value} handleUpdateGlobal={handleUpdateGlobal} />
            ) : popoverType?.toLowerCase()?.includes('visibility') ? (
              <Status
                data={visibilityTypes}
                fetch={false}
                value={value}
                handleUpdateGlobal={handleUpdateGlobal}
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
    </CampaignOverviewContext.Provider>
  );
}

CampaignOverviewProvider.propTypes = {
  children: PropTypes.any,
};

export default CampaignOverviewContext;
