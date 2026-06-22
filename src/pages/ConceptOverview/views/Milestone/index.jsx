import React, { useEffect, useState, useContext } from 'react';
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
import { chart_filter_list } from 'pages/ConceptOverview/constant';
import SearchInput from 'components/SearchInput';
import { setIsHideInactive } from 'store/reducers/filters';

// Utilities
import _ from 'lodash';
import PropTypes from 'prop-types';

// Pages
import TemplateAnalytics from 'pages/ConceptOverview/components/TemplateAnalytics';
import TemplateLogs from 'pages/ConceptOverview/components/TemplateLogs';
import TemplateSettings from 'pages/ConceptOverview/components/TemplateSettings';
import TemplateChart from 'pages/ConceptOverview/components/TemplateChart';
import TemplateChannelTree from 'pages/ConceptOverview/components/TemplateChannelTree';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import TimelineIcon from '@mui/icons-material/Timeline';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
//import SettingsIcon from '@mui/icons-material/Settings';
import PublicIcon from '@mui/icons-material/Public';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SubjectIcon from '@mui/icons-material/Subject';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useDispatch, useSelector } from 'react-redux';

const AntTabs = styled(Tabs)({
  minHeight: 48,
  '& .MuiTabs-indicator': {
    backgroundColor: '#7c3aed',
    height: 3,
    borderRadius: '3px 3px 0 0',
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
    color: '#768197',
    minHeight: 'auto',
    '&:hover': {
      color: '#7c3aed',
      opacity: 1,
    },
    '&.Mui-selected': {
      color: '#7c3aed',
      fontWeight: 700,
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#f5f1ff',
    },
  })
);

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

const generateAnalyticsChannels = (templates) => {
  const items = [];

  if (!_.isEmpty(templates?.google_display)) items.push('Google Display');

  if (!_.isEmpty(templates?.google_video)) items.push('Google Video');

  if (!_.isEmpty(templates?.facebook_static)) items.push('Meta Static');

  if (!_.isEmpty(templates?.facebook_video)) items.push('Meta Video');

  if (!_.isEmpty(templates?.youtube)) items.push('Youtube');

  return items;
};

function Milestone({ isPublic = false }) {
  const {
    user,
    milestone,
    timeZone,
    fetchMilestoneLogs,
    fetchMilestoneTemplates,
    filterChart,
    setFilterChart,
    regionData,
    handleDependencyToggle,
    handlePopover,
    handleOnChartMilestone,
    handleOnSubmitMilestoneSLA,
    handleOnClickExpandToggle,
    handleOnClickColumnsFilter,
    handleOnClickCopyPublicMilestoneLink,
    handleDownloadCSV,
    handleOnPaginateMilestoneLogs,
    handleOnSelectColumnsFilter,
    activeMilestoneColumns,
    isFullscreen,
    holidays,
    handleDialogOpen,
    handleUpdateOriginalTimeline,
  } = useContext(ConceptOverviewContext);

  const analyticsChannel = generateAnalyticsChannels(milestone?.templates);

  const dispatch = useDispatch();

  const {
    conceptMilestone: { isHideInActive },
  } = useSelector((state) => state.filters);

  const [activeTab, setActiveTab] = useState(isPublic ? 1 : 0);
  const [sidebar, setSidebar] = useState(true);
  const [originalDate, setOriginalDate] = useState(false);
  const [analytics, setAnalytics] = useState('');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState();
  // Collapse/Expand states on Main/TimeLine
  const [openCollapseTable, setOpenCollapseTable] = useState([]);
  const [isHide, setIsHide] = useState([]);
  const [isHideChannel, setIsHideChannel] = useState([]);
  const [isHideParent, setIsHideParent] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(milestone)) setAnalytics(_.first(analyticsChannel));
    if (isPublic) {
      setFilterChart('Week');
      handleOnSelectColumnsFilter(
        _.filter(activeMilestoneColumns, (i) => ![5, 11].includes(i.id))
      );
    }
  }, [milestone?.templates]);

  const handleOnChangeTab = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleHideInactive = () => {
    dispatch(setIsHideInactive(!isHideInActive));
  };

  const handleDateTemplate = (newValue) => {
    if (!_.isNull(newValue)) setOriginalDate(newValue);
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
    !isPublic && handlePopover(_e, _type, _value, _id, _parentId, _channel);
  };

  const handleOnClickDependencyToggle = (milestoneId, value) => {
    !isPublic && handleDependencyToggle(milestoneId, value);
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

    setIsHide([]);
    setIsHideChannel([]);
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

  return (
    <Box padding="1em 1.2em" mb={5} sx={{ backgroundColor: '#f6f7fb' }}>
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
          {!isPublic && (
            <AntTab
              label="Activity Logs"
              icon={<SubjectIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
          )}
          {/* {!isPublic && (
            <AntTab
              label="Settings"
              icon={<SettingsIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
          )} */}
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
                <FileDownloadOutlinedIcon sx={{ fontSize: '1em' }} />
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
        {/* <Box sx={{ p: 2 }} /> */}
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} pt={1} pl={1}>
        {/* <StyledTypography
                mt={1.2}
                variant="span"
                fontSize="1.2em"
                fontWeight={700}
              >
                Timeline
              </StyledTypography> */}
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
        {activeTab !== 2 && activeTab !== 3 && activeTab !== 4 && (
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
        {!isPublic && activeTab === 0 && (
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
        )}
        {!isPublic && activeTab === 0 && (
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
        {activeTab === 2 && !isPublic && (
          <FilterChart
            dropdowns={analyticsChannel}
            value={analytics}
            onDropdownChange={setAnalytics}
            sx={{ width: '10em' }}
          />
        )}
      </Stack>
      {activeTab === 0 ? (
        <Box>
          {/* <StyledTypography variant="span" fontSize="1.2em" fontWeight={700}>
            Milestone
          </StyledTypography> */}
          <Box overflow="auto" sx={{ overflowY: 'scroll' }}>
            {!_.isEmpty(milestone.templates.google_display ?? []) && (
              <TemplateChannelTree
                templates={filteredTemplateTasks(
                  milestone.templates.google_display
                )}
                channelId={1}
                handlePopover={handleOnClickColumnCell}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleCollapseTable={handleCollapseTable}
                handleDialogOpen={handleDialogOpen}
                isOpenCollapsedTable={openCollapseTable}
                isCollapsed={true}
                timeZone={timeZone}
                activeMilestoneColumns={activeMilestoneColumns}
                isFetching={fetchMilestoneTemplates}
                isHideInactive={isHideInActive}
                isCampaign={false}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
              />
            )}
            {!_.isEmpty(milestone.templates.google_video ?? []) && (
              <TemplateChannelTree
                templates={filteredTemplateTasks(
                  milestone.templates.google_video
                )}
                channelId={2}
                handlePopover={handleOnClickColumnCell}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleCollapseTable={handleCollapseTable}
                handleDialogOpen={handleDialogOpen}
                isOpenCollapsedTable={openCollapseTable}
                isCollapsed={true}
                timeZone={timeZone}
                activeMilestoneColumns={activeMilestoneColumns}
                isFetching={fetchMilestoneTemplates}
                isHideInactive={isHideInActive}
                isCampaign={false}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
              />
            )}
            {!_.isEmpty(milestone.templates.facebook_static ?? []) && (
              <TemplateChannelTree
                templates={filteredTemplateTasks(
                  milestone.templates.facebook_static
                )}
                channelId={3}
                handlePopover={handleOnClickColumnCell}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleCollapseTable={handleCollapseTable}
                handleDialogOpen={handleDialogOpen}
                isOpenCollapsedTable={openCollapseTable}
                timeZone={timeZone}
                isCollapsed={true}
                activeMilestoneColumns={activeMilestoneColumns}
                isFetching={fetchMilestoneTemplates}
                isHideInactive={isHideInActive}
                isCampaign={false}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
              />
            )}
            {!_.isEmpty(milestone.templates.facebook_video ?? []) && (
              <TemplateChannelTree
                templates={filteredTemplateTasks(
                  milestone.templates.facebook_video
                )}
                channelId={4}
                handlePopover={handleOnClickColumnCell}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleCollapseTable={handleCollapseTable}
                handleDialogOpen={handleDialogOpen}
                isOpenCollapsedTable={openCollapseTable}
                isCollapsed={true}
                timeZone={timeZone}
                activeMilestoneColumns={activeMilestoneColumns}
                isFetching={fetchMilestoneTemplates}
                isHideInactive={isHideInActive}
                isCampaign={false}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
              />
            )}
            {!_.isEmpty(milestone.templates.youtube ?? []) && (
              <TemplateChannelTree
                templates={filteredTemplateTasks(milestone.templates.youtube)}
                channelId={5}
                handlePopover={handleOnClickColumnCell}
                handleDependencyToggle={handleOnClickDependencyToggle}
                handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                handleCollapseTable={handleCollapseTable}
                handleDialogOpen={handleDialogOpen}
                isOpenCollapsedTable={openCollapseTable}
                isCollapsed={true}
                timeZone={timeZone}
                activeMilestoneColumns={activeMilestoneColumns}
                isFetching={fetchMilestoneTemplates}
                isHideInactive={isHideInActive}
                isCampaign={false}
                handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
              />
            )}
          </Box>
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
              holidays={holidays}
              isHide={isHide}
              isHideParent={isHideParent}
              isHideChannel={isHideChannel}
              setIsHide={setIsHide}
              setIsHideParent={setIsHideParent}
              setIsHideChannel={setIsHideChannel}
              handleDependencyToggle={handleOnClickDependencyToggle}
              handleOnSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
              handleUpdateOriginalTimeline={handleUpdateOriginalTimeline}
              isCampaign={false}
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
      ) : activeTab === 4 || (isPublic && activeTab === 2) ? (
        <Box>
          <TemplateSettings
            region={region}
            holidays={holidays}
            regionData={regionData}
            handleChangeRegion={setRegion}
            handlePopover={handlePopover}
          />
        </Box>
      ) : (
        <Box>
          <TemplateLogs
            logs={milestone.logs.data}
            user={user}
            hasNextPage={
              !_.isNull(milestone.logs?.next_page_url) &&
              !_.isEmpty(milestone.logs?.data)
            }
            isLoading={fetchMilestoneLogs}
            timeZone={timeZone}
            onPaginate={handleOnPaginateMilestoneLogs}
          />
        </Box>
      )}
    </Box>
  );
}

Milestone.propTypes = {
  isPublic: PropTypes.bool,
};

export default Milestone;
