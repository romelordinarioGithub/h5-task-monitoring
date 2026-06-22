import { memo, useState, useRef } from 'react';
// MUI Components
import {
  styled,
  Chip,
  Button,
  IconButton,
  Box,
  Stack,
  Collapse,
  TextField,
  Autocomplete,
  Typography,
  Divider,
  Tooltip,
  createFilterOptions,
} from '@mui/material';
// MUI Icons
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import TagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Input from '../../Components/Input';
import GlobalPopper from 'components/Common/Popper';
import TimerDateTimePicker from 'components/Common/TimerDateTimePicker';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { formatDate } from 'utils/date';
import { useEffect } from 'react';
import ListAddSelection from 'pages/Task/Components/ListAddSelection';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
    },
  },
});

// const StyledTextField2 = styled(TextField)({
//   cursor: 'pointer',
//   width: 92,
//   '& .MuiOutlinedInput-root': { backgroundColor: 'transparent' },
//   '& .MuiOutlinedInput-notchedOutline': {
//     border: 0,
//   },
//   '& .MuiInputBase-root.Mui-disabled': {
//     WebkitTextFillColor: appColors.black,
//   },
//   '& .MuiInputBase-input.Mui-disabled': {
//     WebkitTextFillColor: appColors.black,
//   },
// });

const StyledAutocomplete = styled(Autocomplete)({
  width: 'auto',
  '&.MuiListSubheader-root': {
    color: 'rgb(242 32 118)',
    lineHeight: '32px',
    backgroundColor: '#f0f0f0',
  },
  flex: 1,
});

// const StyledDeleteButton = styled(DeleteOutlineIcon)({
//   '&:hover': {
//     color: `${appColors.dashboard.error}`,
//   },
// });

const filter = createFilterOptions();

function ListItem({
  log = {},
  inputPlaceholder,
  containerProps,
  tasksDatasource,
  partnersDatasource,
  campaignsDatasource,
  conceptsDatasource,
  tagsDatasource,
  onPresetsSelectionChange,
  onPartnersSelectionChange,
  onCampaignsSelectionChange,
  onConceptsSelectionChange,
  onTimeChange,
  onAddTags,
  onStartPreviousLog,
  onDelete,
  isParent,
  isSmartly,
  activeTimer,
  handleTagsList,
  handleExistingOnRemoveAllTags,
  handleOnOpenPartners,
  handleOnOpenConcepts,
  handleOnOpenCampaign,
  isFetchingPartners,
  isFetchingConcepts,
  isFetchingCampaigns,
  teamId,
}) {
  // React state
  // Start Time picker
  const [startTimePickerPopperAnchorEl, setStartTimePickerPopperAnchorEl] =
    useState(null);
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  // End Time picker
  const [endTimePickerPopperAnchorEl, setEndTimePickerPopperAnchorEl] =
    useState(null);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  // Selections
  const [selectionsPopperAnchorEl, setSelectionsPopperAnchorEl] =
    useState(null);
  const [tagsPopperAnchorEl, setTagsPopperAnchorEl] = useState(null);
  const [isSelectionsPopperOpen, setIsSelectionsPopperOpen] = useState(false);
  const [isTagsPopperOpen, setIsTagsPopperOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Time

  const startTime = useRef(log.start);
  const endTime = useRef(log.end);
  // const [startTime, setStartTime] = useState(log.start);
  // const [endTime, setEndTime] = useState(log.end);

  // Handlers
  const handleStartTimePickerClick = (e) => {
    if (isParent) {
      setIsCollapsed(!isCollapsed);
    } else {
      setStartTimePickerPopperAnchorEl(e.currentTarget);
      setIsStartTimePickerOpen(true);
    }
  };

  const handleEndTimePickerClick = (e) => {
    if (isParent) {
      setIsCollapsed(!isCollapsed);
    } else {
      setEndTimePickerPopperAnchorEl(e.currentTarget);
      setIsEndTimePickerOpen(true);
    }
  };

  const handleOnAddTagsButtonClick = (e) => {
    setTagsPopperAnchorEl(e.currentTarget);
    setIsTagsPopperOpen(!isTagsPopperOpen);
  };

  const handleSelectionsButtonClick = (e) => {
    setSelectionsPopperAnchorEl(e.currentTarget);
    setIsSelectionsPopperOpen(!isSelectionsPopperOpen);

    if (!isSelectionsPopperOpen) {
      !_.isNull(log.selectedPartner) &&
        handleOnOpenConcepts(
          log?.selectedPartner?.id ?? log?.selectedPartner?.uuid
        );

      !_.isNull(log.selectedConcept) &&
        handleOnOpenCampaign(
          log.selectedConcept?.id ?? log.selectedConcept?.uuid,
          log?.selectedPartner?.id ?? log?.selectedPartner?.uuid
        );

      handleTagsList({ task_timer_id: log?.taskTimerId });
    }
  };

  function handleTimePickerClose() {
    setIsStartTimePickerOpen(false);
    setIsEndTimePickerOpen(false);
  }

  function handleSave(type, start, end) {
    setIsStartTimePickerOpen(false);
    setIsEndTimePickerOpen(false);
    if (type === 'preset_time_in')
      onTimeChange(
        log,
        formatDate(start, 'YYYY-MM-DD HH:mm:ss'),
        formatDate(end, 'YYYY-MM-DD HH:mm:ss')
      );
    else if (type === 'preset_time_out')
      onTimeChange(
        log,
        formatDate(end, 'YYYY-MM-DD HH:mm:ss'),
        formatDate(start, 'YYYY-MM-DD HH:mm:ss')
      );
  }

  useEffect(() => {
    startTime.current = log.start;
    endTime.current = log.end;
  }, [log.start, log.end]);

  return (
    <Stack spacing={1} {...containerProps}>
      <Stack
        direction="row"
        justifyContent="space-between"
        m={1}
        spacing={2}
        onClick={() => isParent && setIsCollapsed(!isCollapsed)}
        sx={{ cursor: isParent ? 'pointer' : 'default' }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ width: '-webkit-fill-available' }}
        >
          {isParent && (
            <Button
              variant="contained"
              sx={{ padding: 0, minWidth: 25 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {log.data.length}
            </Button>
          )}

          {/* Task selections */}
          {isParent ? (
            <Typography p="9px" pl="14px">
              {log.selectedTask}
            </Typography>
          ) : (
            <Input
              data={tasksDatasource}
              placeholder={inputPlaceholder}
              value={{
                name: log.selectedTask,
              }}
              onSelectionChange={(data) => onPresetsSelectionChange(log, data)}
              disabled={isParent}
              disableClearable={true}
            />
          )}
        </Stack>

        {/* Categories Selections */}
        <Stack direction="row" spacing={2} alignItems="center">
          {!isParent && (
            <Box
              sx={{
                minWidth: '5rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Button
                sx={{
                  textTransform: 'none',
                  '& .MuiButton-startIcon': {
                    marginRight: '4px',
                    '& .MuiSvgIcon-root': { fontSize: '14px' },
                  },
                }}
                startIcon={_.isEmpty(log.selectedPartner) && <AddIcon />}
                color="secondary"
                onClick={handleSelectionsButtonClick}
              >
                {log.selectedPartner?.name ?? 'Partner'}
              </Button>
            </Box>
          )}
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderStyle: 'dashed' }}
          />

          {/* Time inputs */}
          {!isParent && (
            <>
              <Stack direction="row">
                <Stack direction="row" alignItems="center">
                  <Button variant="text" onClick={handleStartTimePickerClick}>
                    {formatDate(log?.start, 'HH:mm:ss')}
                  </Button>
                  -
                  <Button variant="text" onClick={handleEndTimePickerClick}>
                    {formatDate(log?.end, 'HH:mm:ss')}
                  </Button>
                </Stack>
              </Stack>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ borderStyle: 'dashed' }}
              />
            </>
          )}

          {/* Countdown timer */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }} width={85}>
            <Typography variant="h6" fontWeight={700} color="primary">
              {log?.total_time?.includes('-') || log?.total?.includes('-')
                ? '00:00:00'
                : log.total}
            </Typography>
          </Box>

          {/* Controls */}
          <Box>
            {!isParent && (
              <Stack direction="row" spacing={-1}>
                <Tooltip title="Redo Preset Task" disableInteractive>
                  <IconButton
                    disabled={
                      activeTimer ||
                      log?.selectedPartner?.id == 'uncat001' ||
                      log?.categoryStatus === 0 ||
                      log?.categoryStatus === null
                    }
                    onClick={() => {
                      if (isParent) {
                        setIsCollapsed(!isCollapsed);
                      } else {
                        onStartPreviousLog(log);
                      }
                    }}
                  >
                    <PlayCircleFilledWhiteOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <IconButton
                  onClick={() =>
                    onDelete(
                      log.data ? log?.data[0]?.task_timer_id : log.task_timer_id
                    )
                  }
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            )}
          </Box>
        </Stack>

        {/* Start Time Picker */}
        <GlobalPopper
          isOpen={isStartTimePickerOpen}
          anchorEl={startTimePickerPopperAnchorEl}
          onClose={(e) => handleTimePickerClose(e, 'startTime')}
          placement={'right-start'}
          sx={{
            zIndex: 1,
          }}
          content={
            <TimerDateTimePicker
              type={`preset_time_in`}
              selected={log.start}
              handleSave={handleSave}
              limit={log.end}
              handleClose={() => { }}
            />
          }
        />

        {/* End Time Picker */}
        <GlobalPopper
          isOpen={isEndTimePickerOpen}
          anchorEl={endTimePickerPopperAnchorEl}
          onClose={(e) => handleTimePickerClose(e, 'endTime')}
          placement={'right-start'}
          sx={{ zIndex: 1 }}
          content={
            <TimerDateTimePicker
              type={`preset_time_out`}
              selected={log.end}
              handleSave={handleSave}
              limit={log.start}
              handleClose={() => { }}
            />
          }
        />

        {/* Concept, Campaigns, Partners Selection */}
        <GlobalPopper
          isOpen={isSelectionsPopperOpen}
          anchorEl={selectionsPopperAnchorEl}
          onClose={() =>
            setIsSelectionsPopperOpen(isTagsPopperOpen ? true : false)
          }
          placement={'bottom'}
          sx={{ zIndex: 1 }}
          content={
            <Stack p={3} minWidth={350}>
              {/* Partner */}
              <StyledAutocomplete
                disablePortal
                //freeSolo
                disableClearable={true}
                forcePopupIcon={false}
                onOpen={handleOnOpenPartners}
                loading={isFetchingPartners}
                sx={{ marginBottom: 2 }}
                isOptionEqualToValue={(option, value) =>
                  option.uuid ?? option.id === value.id
                }
                value={log.selectedPartner}
                options={
                  partnersDatasource.filter(
                    (data) =>
                      data.uuid !== 'uncat001' &&
                      data.uuid !== '661d4f19f55dfa48477d5787' && // __TEST
                      // Filter out V&D partners
                      data.uuid !== '5c262b2176eeb1998929e57f' && // V&D Demo
                      data.uuid !== '5f2a3ff01a8ce60006056cb7' && // Smartly V&D Demo
                      data.uuid !== '5c262b4b76eeb1998929e580' && // V&D Internal
                      data.uuid !== '5fa289ad199d53000613b2ca' && // V&D Templates
                      data.uuid !== '60d4978886cc960006494a14' && // V&D Sales
                      data.uuid !== '5f201b318bc26700068519d7'    // Smartly V&D
                  ) ?? []
                }
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  if (teamId === 14) {
                    const isExisting = options.some(
                      (option) => inputValue?.toLowerCase() === option.name?.toLowerCase()
                    );
                    if (inputValue.trim() !== '' && !isExisting) {
                      filtered.push({
                        inputValue,
                        title: `Add custom partner: ${inputValue}`,
                        name: `${inputValue.trim()}`,
                        uuid: 'custom',
                      });
                    }
                  }

                  return filtered;
                }}
                getOptionLabel={(option) => option.name}
                onChange={(event, value, reason) => {
                  onPartnersSelectionChange(log, value, reason);
                  !_.isEmpty(value) && handleOnOpenConcepts(value?.uuid);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.key}>
                    {option.title ?? option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    size="small"
                    label="Select a partner"
                    placeholder={'Select a partner'}
                  />
                )}
              />

              {/* Concept */}
              <StyledAutocomplete
                disablePortal
                //freeSolo
                forcePopupIcon={false}
                sx={{ marginBottom: 2 }}
                loading={isFetchingConcepts}
                isOptionEqualToValue={(option, value) =>
                  option.uuid === value.id
                }
                value={log.selectedConcept}
                options={conceptsDatasource}
                getOptionLabel={(option) => option.name}
                onChange={(event, value, reason) => {
                  onConceptsSelectionChange(log, value, reason);
                  !_.isEmpty(value) &&
                    handleOnOpenCampaign(value?.uuid, log?.selectedPartner?.id);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.key}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    size="small"
                    label={
                      isFetchingConcepts
                        ? 'Loading'
                        : _.isNull(log.selectedPartner)
                          ? 'Select a concept'
                          : _.isEmpty(conceptsDatasource)
                            ? 'No Concepts Available'
                            : 'Select a concept'
                    }
                    placeholder={'Select a concept'}
                  />
                )}
                disabled={
                  _.isNull(log.selectedPartner) ||
                  _.isEmpty(conceptsDatasource) ||
                  isSmartly ||
                  isFetchingConcepts
                }
              />

              {/* Campaign */}
              <StyledAutocomplete
                disablePortal
                //freeSolo
                forcePopupIcon={false}
                sx={{ marginBottom: 1 }}
                loading={isFetchingCampaigns}
                isOptionEqualToValue={(option, value) =>
                  option.uuid === value.id
                }
                value={log.selectedCampaign}
                options={campaignsDatasource}
                getOptionLabel={(option) => option.name}
                onChange={(_, value, reason) => {
                  onCampaignsSelectionChange(log, value, reason);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.key}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    size="small"
                    label={
                      isFetchingCampaigns
                        ? 'Loading'
                        : _.isNull(log.selectedConcept)
                          ? 'Select a concept'
                          : _.isEmpty(campaignsDatasource)
                            ? 'No Campaigns Available'
                            : 'Select a campaign'
                    }
                    placeholder={'Select a campaign'}
                  />
                )}
                disabled={
                  _.isNull(log.selectedConcept) ||
                  _.isEmpty(campaignsDatasource) ||
                  isSmartly ||
                  isFetchingCampaigns
                }
              />

              {/* Tags */}
              <Box width="fit-content" maxWidth={500}>
                {!_.isEmpty(
                  tagsDatasource?.filter((tags) => tags.is_selected)
                ) &&
                  tagsDatasource
                    .filter((tags) => tags.is_selected)
                    .map((e, i) => (
                      <Chip
                        color="secondary"
                        key={i}
                        label={e.title ?? e}
                        size="small"
                        variant="outlined"
                        sx={{
                          marginRight: '0.5em',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                <Chip
                  icon={<TagIcon />}
                  label="Add tags"
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{
                    marginRight: '0.5em',
                    cursor: 'pointer',
                    borderStyle: 'dashed',
                    '& .MuiChip-iconSmall': {
                      width: '0.7em',
                      marginLeft: '5px',
                    },
                  }}
                  onClick={(e) => handleOnAddTagsButtonClick(e)}
                />
                {!_.isEmpty(
                  tagsDatasource?.filter((tags) => tags.is_selected)
                ) && (
                    <Chip
                      icon={<DeleteIcon />}
                      label="Clear tags"
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{
                        marginRight: '0.5em',
                        cursor: 'pointer',
                        borderStyle: 'dashed',
                        '& .MuiChip-iconSmall': {
                          width: '0.7em',
                          marginLeft: '5px',
                        },
                      }}
                      onClick={() => handleExistingOnRemoveAllTags(log)}
                    />
                  )}
              </Box>
            </Stack>
          }
        />

        {/* Tags Selection */}
        <GlobalPopper
          isOpen={isTagsPopperOpen}
          anchorEl={tagsPopperAnchorEl}
          onClose={() => setIsTagsPopperOpen(false)}
          placement="bottom"
          sx={{ zIndex: 1 }}
          content={
            <ListAddSelection
              taskId={null}
              defaultData={tagsDatasource}
              type={'tags'}
              relType={'task'}
              handleSave={(tag) => onAddTags(log, tag)}
            />
          }
        />
      </Stack>

      <Collapse
        in={isCollapsed}
        timeout="auto"
        orientation="vertical"
        sx={{ marginTop: '0px !important' }}
        unmountOnExit
      >
        {!_.isEmpty(log.data) &&
          isParent &&
          log.data.map((log, index) => (
            <ListItem
              key={index}
              containerProps={{
                sx: {
                  background: '#5025c407',
                },
              }}
              log={{
                ...log,
                categoryStatus: log?.category?.status,
                taskTimerId: log.task_timer_id,
                selectedTask: log.category?.name,
                selectedPartner: log.partner,
                selectedCampaign: log.campaign,
                selectedConcept: log.concept,
                selectedTags: log.tags,
                total: log.data ? log.total_time : log.total,
              }}
              inputPlaceholder="Add description"
              tasksDatasource={tasksDatasource}
              partnersDatasource={partnersDatasource}
              campaignsDatasource={campaignsDatasource}
              conceptsDatasource={conceptsDatasource}
              tagsDatasource={tagsDatasource}
              onPresetsSelectionChange={onPresetsSelectionChange}
              onPartnersSelectionChange={onPartnersSelectionChange}
              onCampaignsSelectionChange={onCampaignsSelectionChange}
              onConceptsSelectionChange={onConceptsSelectionChange}
              onStartPreviousLog={onStartPreviousLog}
              onDelete={onDelete}
              onAddTags={onAddTags}
              onTimeChange={onTimeChange}
              isSmartly={isSmartly}
              activeTimer={activeTimer}
              handleTagsList={handleTagsList}
              handleExistingOnRemoveAllTags={handleExistingOnRemoveAllTags}
              handleOnOpenPartners={handleOnOpenPartners}
              handleOnOpenConcepts={handleOnOpenConcepts}
              handleOnOpenCampaign={handleOnOpenCampaign}
              isFetchingPartners={isFetchingPartners}
              isFetchingConcepts={isFetchingConcepts}
              isFetchingCampaigns={isFetchingCampaigns}
            />
          ))}
      </Collapse>
    </Stack>
  );
}

ListItem.propTypes = {
  log: PropTypes.any,
  activeTimer: PropTypes.any,
  inputPlaceholder: PropTypes.any,
  containerProps: PropTypes.any,
  tasksDatasource: PropTypes.any,
  partnersDatasource: PropTypes.any,
  campaignsDatasource: PropTypes.any,
  conceptsDatasource: PropTypes.any,
  tagsDatasource: PropTypes.any,
  onStartTimer: PropTypes.any,
  onStopTimer: PropTypes.any,
  onTimeChange: PropTypes.any,
  onPresetsSelectionChange: PropTypes.any,
  onPartnersSelectionChange: PropTypes.any,
  onCampaignsSelectionChange: PropTypes.any,
  onConceptsSelectionChange: PropTypes.any,
  onStartPreviousLog: PropTypes.any,
  onDelete: PropTypes.any,
  onAddTags: PropTypes.any,
  isRunnable: PropTypes.bool,
  isParent: PropTypes.bool,
  isSmartly: PropTypes.bool,
  handleTagsList: PropTypes.func,
  handleExistingOnRemoveAllTags: PropTypes.any,
  handleOnOpenPartners: PropTypes.func,
  handleOnOpenConcepts: PropTypes.func,
  handleOnOpenCampaign: PropTypes.func,
  isFetchingPartners: PropTypes.bool,
  isFetchingConcepts: PropTypes.bool,
  isFetchingCampaigns: PropTypes.bool,
  teamId: PropTypes.number,
};

export default memo(ListItem);
