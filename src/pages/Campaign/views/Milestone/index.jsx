import React, { useEffect, useState, useContext } from 'react';
import CampaignOverviewContext from 'pages/Campaign/context';
import ConceptOverviewContext from 'pages/ConceptOverview/context';
import {
  styled,
  Box,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Tab,
  Tabs,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import FilterChart from 'pages/ConceptOverview/components/common/FilterChart';
import SearchInput from 'components/SearchInput';
import { setIsHideInactiveCampaign } from 'store/reducers/filters';
import { chart_filter_list } from 'pages/ConceptOverview/constant';

// Utilities
import _ from 'lodash';
import PropTypes from 'prop-types';

// Pages
import TemplateChannelTree from 'pages/ConceptOverview/components/TemplateChannelTree';
import TemplateChart from 'pages/ConceptOverview/components/TemplateChart';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import PublicIcon from '@mui/icons-material/Public';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
// import SubjectIcon from '@mui/icons-material/Subject';
import MonitorIcon from '@mui/icons-material/Monitor';
import { useDispatch } from 'react-redux';
import { FileDownloadOutlined } from '@mui/icons-material';
import TemplateAnalytics from 'pages/ConceptOverview/components/TemplateAnalytics';
import LogMonitoring from 'pages/Campaign/components/LogMonitoring';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

const AntTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#5025c4',
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    padding: '12px 0 12px 0',
    textTransform: 'none',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
      minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightBold,
    marginRight: theme.spacing(4),
    color: 'rgba(0, 0, 0, 0.85)',
    minHeight: 'auto',
    '&:hover': {
      color: '#5025c4',
      opacity: 1,
    },
    '&.Mui-selected': {
      color: '#5025c4',
      fontWeight: 700,
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#d1eaff',
    },
  })
);

const generateAnalyticsChannels = (templates) => {
  const items = [];

  if (!_.isEmpty(templates?.google_display)) items.push('Google Display');

  if (!_.isEmpty(templates?.google_video)) items.push('Google Video');

  if (!_.isEmpty(templates?.facebook_static)) items.push('Meta Static');

  if (!_.isEmpty(templates?.facebook_video)) items.push('Meta Video');

  if (!_.isEmpty(templates?.youtube)) items.push('Youtube');

  return items;
};

function CampaignMilestone({ isPublic = false }) {
  const {
    milestone,
    timeZone,
    fetchMilestoneTemplates,
    activeMilestoneColumns,
    handleDependencyToggle,
    handlePopover,
    handleOnSubmitMilestoneSLA,
    handleOnClickColumnsFilter,
    handleOnClickCopyPublicMilestoneLink,
    handleDialogOpen,
    handleDownloadCSV,
    handleOnChartMilestone,
    handleUpdateOriginalTimeline,
    isHideInActive,
    userData,
    fetchMilestoneLogs,
    handleOpenLogMonitoring,
  } = useContext(CampaignOverviewContext);

  const { isFullscreen, handleOnClickExpandToggle } = useContext(
    ConceptOverviewContext
  );

  const analyticsChannel = generateAnalyticsChannels(milestone?.templates);

  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [isHideChannel, setIsHideChannel] = useState([]);
  const [isHideParent, setIsHideParent] = useState([]);
  const [isHide, setIsHide] = useState([]);
  const [sidebar, setSidebar] = useState(true);
  // Collapse/Expand states on Main/TimeLine
  const [openCollapseTable, setOpenCollapseTable] = useState([]);
  const [originalDate, setOriginalDate] = useState(false);
  const [filterChart, setFilterChart] = useState('Day');

  const [analytics, setAnalytics] = useState('');

  useEffect(() => {
    if (!_.isEmpty(milestone)) setAnalytics(_.first(analyticsChannel));
    if (isPublic) {
      setFilterChart('Week');
      // handleOnSelectColumnsFilter(
      //   _.filter(activeMilestoneColumns, (i) => ![5, 11].includes(i.id))
      // );
    }
  }, [milestone?.templates]);

  const handleOnChangeTab = (_, newValue) => {
    if (newValue === 3) handleOpenLogMonitoring();
    setActiveTab(newValue);
  };

  const handleHideInactive = () => {
    dispatch(setIsHideInactiveCampaign(!isHideInActive));
  };

  const handleCollapseTable = (value) => {
    !openCollapseTable?.includes(value)
      ? setOpenCollapseTable([...openCollapseTable, value])
      : setOpenCollapseTable(
          openCollapseTable?.filter((data) => data != value)
        );
  };

  const handleOnClickColumnCell = (
    _e,
    _type,
    _value,
    _id,
    _parentId,
    _channel
  ) => {
    handlePopover(_e, _type, _value, _id, _parentId, _channel);
  };

  const handleOnClickDependencyToggle = (milestoneId, value) => {
    handleDependencyToggle(milestoneId, value);
  };

  const handleSearchMilestone = (value) => {
    const googleDisplayID = milestone?.templates?.google_display.map(
      (data) => data?.id
    );

    const googleVideoID = milestone?.templates?.google_video.map(
      (data) => data?.id
    );

    const youtubeID = milestone?.templates?.youtube.map((data) => data?.id);

    const facebookStaticID = milestone?.templates?.facebook_static.map(
      (data) => data?.id
    );

    const facebookVideoID = milestone?.templates?.facebook_video.map(
      (data) => data?.id
    );
    setSearch(value);
    !_.isEmpty(value)
      ? setOpenCollapseTable(
          _.union(
            googleDisplayID,
            googleVideoID,
            youtubeID,
            facebookStaticID,
            facebookVideoID
          )
        )
      : setOpenCollapseTable([]);
  };

  const filteredTemplateTasks = (tasks) =>
    tasks
      .filter(
        (task) =>
          task.name.toLowerCase().includes(search.toLowerCase()) ||
          task.subtasks.some((subtask) =>
            subtask.task_name.toLowerCase().includes(search.toLowerCase())
          )
      )
      .map((task) => ({
        ...task,
        subtasks: task.subtasks.filter((subtask) =>
          subtask.task_name.toLowerCase().includes(search.toLowerCase())
        ),
      }));

  const handleDateTemplate = (newValue) => {
    if (!_.isNull(newValue)) setOriginalDate(newValue);
  };

  return (
    <Box padding="1em 1.2em" mb={5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <AntTabs
          value={activeTab}
          onChange={handleOnChangeTab}
          aria-label="user-tab"
        >
          <AntTab
            label="Main"
            icon={<HomeIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
          />
          <AntTab
            label="Timeline"
            icon={<TimelineIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
          />
          {!isPublic && (
            <AntTab
              label="Analytics"
              icon={<BarChartOutlinedIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
          )}
          {!isPublic && userData?.admin_role === 'Administrator' && (
            <AntTab
              label="Maintenance"
              icon={<MonitorIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
          )}
        </AntTabs>
        <Stack direction="row">
          {!isPublic && (
            <Tooltip
              title={'Copy Public Milestone Link'}
              componentsProps={{
                tooltip: {
                  sx: {
                    lineHeight: 'normal',
                    marginTop: '0.4em !important',
                  },
                },
              }}
              arrow
              onClick={handleOnClickCopyPublicMilestoneLink}
            >
              <IconButton color="inherit">
                <PublicIcon sx={{ fontSize: '1em' }} />
              </IconButton>
            </Tooltip>
          )}
          {!isPublic && (
            <Tooltip
              title={'Download XLSX'}
              componentsProps={{
                tooltip: {
                  sx: {
                    lineHeight: 'normal',
                    marginTop: '0.4em !important',
                  },
                },
              }}
              arrow
              onClick={handleDownloadCSV}
            >
              <IconButton color="inherit">
                <FileDownloadOutlined sx={{ fontSize: '1em' }} />
              </IconButton>
            </Tooltip>
          )}
          {!isPublic && (
            <Tooltip
              title={isFullscreen ? 'Collapse View' : 'Expand View'}
              componentsProps={{
                tooltip: {
                  sx: {
                    lineHeight: 'normal',
                    marginTop: '0.4em !important',
                  },
                },
              }}
              arrow
              onClick={handleOnClickExpandToggle}
            >
              <IconButton color="inherit">
                {isFullscreen ? (
                  <CloseFullscreenOutlinedIcon sx={{ fontSize: '0.7em' }} />
                ) : (
                  <OpenInFullOutlinedIcon sx={{ fontSize: '0.7em' }} />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} pt={1} pl={1}>
        {activeTab === 1 && (
          <Stack direction="row" ml={1}>
            <StyledTypography mt={0.3} fontWeight={800}>
              Sidebar
            </StyledTypography>
            <Switch
              size="small"
              defaultChecked={sidebar}
              onChange={(_e, value) => setSidebar(value)}
            />
          </Stack>
        )}
        {activeTab !== 3 && activeTab !== 2 && (
          <SearchInput
            placeholder="Search Sub-Milestone"
            value={search}
            onClear={() => {
              handleSearchMilestone('');
            }}
            onChange={(event) => {
              handleSearchMilestone(event.target.value);
            }}
            on="true"
            sx={{ height: '3em', borderRadius: '.7em', fontSize: '.87em' }}
          />
        )}
        {activeTab === 0 && (
          <>
            <Tooltip
              title={'Show/Hide Columns'}
              componentsProps={{
                tooltip: {
                  sx: {
                    lineHeight: 'normal',
                    marginTop: '0.4em !important',
                  },
                },
              }}
              arrow
              onClick={(e) => handleOnClickColumnsFilter(e, 'filter_columns')}
            >
              <IconButton color="inherit">
                <VisibilityIcon sx={{ fontSize: '0.7em' }} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={'Show/Hide Inactive'}
              componentsProps={{
                tooltip: {
                  sx: {
                    lineHeight: 'normal',
                    marginTop: '0.4em !important',
                  },
                },
              }}
              arrow
              onClick={() => handleHideInactive()}
            >
              <IconButton color="inherit">
                {isHideInActive ? (
                  <PlaylistRemoveIcon sx={{ fontSize: '0.7em' }} />
                ) : (
                  <PlaylistAddCheckIcon sx={{ fontSize: '0.7em' }} />
                )}
              </IconButton>
            </Tooltip>
          </>
        )}
        {activeTab === 1 && (
          <>
            <ToggleButtonGroup
              color="primary"
              value={originalDate}
              size="small"
              exclusive
              onChange={(event, value) => handleDateTemplate(value)}
            >
              <ToggleButton value={true}>
                <StyledTypography variant="caption">
                  Original Date
                </StyledTypography>
              </ToggleButton>
              <ToggleButton value={false}>
                <StyledTypography variant="caption">
                  Adjusted Date
                </StyledTypography>
              </ToggleButton>
            </ToggleButtonGroup>
            <FilterChart
              dropdowns={chart_filter_list}
              value={filterChart}
              onDropdownChange={setFilterChart}
              sx={{ width: '6em' }}
            />
          </>
        )}
        {activeTab === 2 && (
          <>
            <FilterChart
              dropdowns={chart_filter_list}
              value={filterChart}
              onDropdownChange={setFilterChart}
              sx={{ width: '6em' }}
            />
          </>
        )}
      </Stack>
      <Box>
        {activeTab === 0 ? (
          <Box overflow="auto" sx={{ overflowY: 'scroll' }}>
            {!_.isEmpty(milestone.templates?.google_display ?? []) && (
              <TemplateChannelTree
                templates={filteredTemplateTasks(
                  milestone.templates?.google_display
                )}
                channelId={1}
                timeZone={timeZone}
                activeMilestoneColumns={activeMilestoneColumns}
                handlePopover={handleOnClickColumnCell}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleCollapseTable={handleCollapseTable}
                handleDialogOpen={handleDialogOpen}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
                isOpenCollapsedTable={openCollapseTable}
                isCollapsed={true}
                isFetching={fetchMilestoneTemplates}
                isHideInactive={isHideInActive}
                isCampaign={true}
              />
            )}
            {!_.isEmpty(milestone.templates?.google_video ?? []) && (
              <TemplateChannelTree
                templates={filteredTemplateTasks(
                  milestone.templates?.google_video
                )}
                channelId={2}
                timeZone={timeZone}
                activeMilestoneColumns={activeMilestoneColumns}
                handlePopover={handleOnClickColumnCell}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleCollapseTable={handleCollapseTable}
                handleDialogOpen={handleDialogOpen}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
                isOpenCollapsedTable={openCollapseTable}
                isCollapsed={true}
                isFetching={fetchMilestoneTemplates}
                isHideInactive={isHideInActive}
                isCampaign={true}
              />
            )}
            {!_.isEmpty(milestone.templates?.facebook_static ?? []) && (
              <TemplateChannelTree
                templates={filteredTemplateTasks(
                  milestone.templates?.facebook_static
                )}
                channelId={3}
                timeZone={timeZone}
                activeMilestoneColumns={activeMilestoneColumns}
                handlePopover={handleOnClickColumnCell}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleCollapseTable={handleCollapseTable}
                handleDialogOpen={handleDialogOpen}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
                isOpenCollapsedTable={openCollapseTable}
                isCollapsed={true}
                isFetching={fetchMilestoneTemplates}
                isHideInactive={isHideInActive}
                isCampaign={true}
              />
            )}
            {!_.isEmpty(milestone.templates?.facebook_video ?? []) && (
              <TemplateChannelTree
                templates={filteredTemplateTasks(
                  milestone.templates?.facebook_video
                )}
                channelId={4}
                timeZone={timeZone}
                activeMilestoneColumns={activeMilestoneColumns}
                handlePopover={handleOnClickColumnCell}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleCollapseTable={handleCollapseTable}
                handleDialogOpen={handleDialogOpen}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
                isOpenCollapsedTable={openCollapseTable}
                isCollapsed={true}
                isFetching={fetchMilestoneTemplates}
                isHideInactive={isHideInActive}
                isCampaign={true}
              />
            )}
            {!_.isEmpty(milestone.templates?.youtube ?? []) && (
              <TemplateChannelTree
                templates={filteredTemplateTasks(milestone.templates?.youtube)}
                channelId={5}
                timeZone={timeZone}
                activeMilestoneColumns={activeMilestoneColumns}
                handlePopover={handleOnClickColumnCell}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleCollapseTable={handleCollapseTable}
                handleDialogOpen={handleDialogOpen}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
                isOpenCollapsedTable={openCollapseTable}
                isCollapsed={true}
                isFetching={fetchMilestoneTemplates}
                isHideInactive={isHideInActive}
                isCampaign={true}
              />
            )}
          </Box>
        ) : activeTab === 1 ? (
          <Box>
            {(!_.isEmpty(milestone.templates.youtube ?? []) ||
              !_.isEmpty(milestone.templates.facebook_video ?? []) ||
              !_.isEmpty(milestone.templates.facebook_static ?? []) ||
              !_.isEmpty(milestone.templates.google_video ?? []) ||
              !_.isEmpty(milestone.templates.google_display ?? [])) && (
              <TemplateChart
                filterChart={filterChart}
                templates={milestone.templates}
                handleUpdateChart={handleOnChartMilestone}
                sidebar={sidebar}
                originalDate={originalDate}
                search={search}
                isPublic={isPublic}
                timeZone={timeZone}
                holidays={[]}
                isHide={isHide}
                isHideParent={isHideParent}
                isHideChannel={isHideChannel}
                setIsHide={setIsHide}
                setIsHideParent={setIsHideParent}
                setIsHideChannel={setIsHideChannel}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
                isCampaign={true}
              />
            )}
          </Box>
        ) : activeTab === 2 && !isPublic ? (
          <Box>
            <TemplateAnalytics
              templates={milestone?.templates}
              analytics={analytics}
            />
          </Box>
        ) : (
          <LogMonitoring
            logs={milestone?.logs}
            user={userData}
            isLoading={fetchMilestoneLogs}
          />
        )}
      </Box>
    </Box>
  );
}

CampaignMilestone.propTypes = {
  isPublic: PropTypes.bool,
};

export default CampaignMilestone;
