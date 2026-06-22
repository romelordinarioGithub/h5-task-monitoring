// React
import { memo, useState } from 'react';

// MUI Components
import {
  styled,
  Button,
  Box,
  Chip,
  Stack,
  Autocomplete,
  Divider,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material';

// MUI Icons

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import Input from '../Input';
import GlobalPopper from 'components/Common/Popper';

import _ from 'lodash';
import PropTypes from 'prop-types';
import TimerControl from './TimerControl';

import TagsDropdown from '../TagsDropdown';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
      // boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
    },
  },
});

const StyledAutocomplete = styled(Autocomplete)({
  width: 'auto',
  '&.MuiListSubheader-root': {
    color: 'rgb(242 32 118)',
    lineHeight: '32px',
    backgroundColor: '#f0f0f0',
  },
  flex: 1,
});

const filter = createFilterOptions();

function ActiveTimer({
  timer,
  inputPlaceholder,
  containerProps,
  tasksDatasource,
  partnersDatasource,
  campaignsDatasource,
  conceptsDatasource,
  tagsDatasource,
  canStopTimer,
  requiredFields,
  onPresetsSelectionChange,
  onPartnersSelectionChange,
  onCampaignsSelectionChange,
  onConceptsSelectionChange,
  selectedTaskCategory,
  selectedPartner,
  selectedCampaign,
  selectedConcept,
  onStartTimer,
  onStopTimer,
  onAddTags,
  onClosePopper,
  isSmartly,
  handleTagsList,
  tagsList,
  handleExistingOnRemoveAllTags,
  handleOnOpenPartners,
  handleOnOpenConcepts,
  handleOnOpenCampaign,
  handleOnOpenTags,
  isFetchingPartners,
  isFetchingConcepts,
  isFetchingCampaigns,
  teamId,
}) {
  // React state
  const [selectionsPopperAnchorEl, setSelectionsPopperAnchorEl] =
    useState(null);

  const [isSelectionsPopperOpen, setIsSelectionsPopperOpen] = useState(false);
  const [isTagsPopperOpen] = useState(false);

  // // TODO: These are redundant state. Can be improved by using the state of the parent.
  // const [selectedTaskCategory, setSelectedTaskCategory] = useState(null);
  // const [selectedPartner, setSelectedPartner] = useState(null);
  // const [selectedCampaign, setSelectedCampaign] = useState(null);
  // const [selectedConcept, setSelectedConcept] = useState(null);

  // // Hooks
  // useEffect(() => {
  //   if (!_.isEmpty(timer) && _.isNull(selectedTaskCategory)) {
  //     dispatch(setSelectedTaskCategory(timer.category));
  //   }
  // }, [timer]);

  // Handlers
  const handleSelectionsButtonClick = (e) => {
    setSelectionsPopperAnchorEl(e.currentTarget);
    setIsSelectionsPopperOpen(!isSelectionsPopperOpen);

    _.isEmpty(timer) && _.isEmpty(tagsDatasource) && handleOnOpenTags();

    if (!_.isEmpty(timer) && !isSelectionsPopperOpen) {
      !_.isEmpty(timer) && handleTagsList(timer);
      !_.isNull(timer?.concept) &&
        handleOnOpenCampaign(
          timer?.concept?.id ?? timer?.concept?.uuid,
          timer?.partner?.id ?? timer?.partner?.uuid
        );
      handleOnOpenConcepts(timer?.partner?.id ?? timer?.partner?.uuid);
    }
  };

  const handleOnClosePopper = () => {
    setIsSelectionsPopperOpen(isTagsPopperOpen ? true : false);
    !_.isEmpty(timer) && onClosePopper(timer);
  };

  // const handleOnClickAddTags = (e) => {
  //   setTagsPopperAnchorEl(e.currentTarget);
  //   setIsTagsPopperOpen(!isTagsPopperOpen);
  // };

  const handleOnStartTimer = () => {
    onStartTimer();
  };

  const handleOnStopTimer = () => {
    if (timer) {
      // dispatch(setSelectedTaskCategory(null));
      // dispatch(setSelectedPartner(null));
      // dispatch(setSelectedCampaign(null));
      // dispatch(setSelectedConcept(null));
      onStopTimer(timer);
    }
  };

  return (
    <Stack spacing={1} {...containerProps}>
      <Stack direction="row" justifyContent="space-between" m={1} spacing={2}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ width: '-webkit-fill-available' }}
        >
          {/* Task selections */}
          <Input
            data={tasksDatasource ?? []}
            placeholder={inputPlaceholder}
            value={{
              name: selectedTaskCategory?.name ?? timer?.category?.name,
            }}
            onSelectionChange={(data) => {
              onPresetsSelectionChange(data, timer);
            }}
            disableClearable={!_.isEmpty(timer)}
          />
        </Stack>

        {/* Project Selections */}
        <Stack direction="row" spacing={2} alignItems="center">
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
              startIcon={
                _.isNull(timer?.partner ?? null) &&
                _.isNull(selectedPartner) && <AddIcon />
              }
              color="secondary"
              onClick={handleSelectionsButtonClick}
            >
              {selectedPartner?.name ?? 'Partner'}
            </Button>
          </Box>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderStyle: 'dashed' }}
          />
          <TimerControl
            canStopTimer={canStopTimer}
            onStart={handleOnStartTimer}
            onStop={handleOnStopTimer}
            selectedPartner={selectedPartner}
            selectedTaskCategory={selectedTaskCategory}
          />
        </Stack>

        {/* Concept, Campaigns, Partners Selection */}
        <GlobalPopper
          isOpen={isSelectionsPopperOpen}
          anchorEl={selectionsPopperAnchorEl}
          onClose={handleOnClosePopper}
          placement={'bottom'}
          sx={{ zIndex: 1 }}
          content={
            <Stack p={3} minWidth={350}>
              {/* Partner */}
              <Stack
                spacing={-0.5}
                mb={requiredFields?.includes('partner') ? 1 : 2}
              >
                <StyledAutocomplete
                  disablePortal
                  freeSolo
                  forcePopupIcon={false}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid ?? option.id === value.id ?? value.uuid
                  }
                  onOpen={handleOnOpenPartners}
                  // value={selectedPartner ?? timer?.partner}
                  value={selectedPartner}
                  disableClearable={!_.isEmpty(timer)}
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
                  onChange={(event, value) => {
                    onPartnersSelectionChange(value);
                    onConceptsSelectionChange(null);
                    onCampaignsSelectionChange(null);
                    !_.isEmpty(value) && handleOnOpenConcepts(value?.uuid);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // Prevent's default 'Enter' behavior.
                      event.defaultMuiPrevented = true;
                    }
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
                      required={true}
                    />
                  )}
                  loading={isFetchingPartners}
                  disabled={_.isNull(selectedTaskCategory)}
                />
                {requiredFields?.includes('partner') && (
                  <Typography
                    pl={0.5}
                    variant="span"
                    color="secondary"
                    fontSize={11}
                  >
                    This field is required
                  </Typography>
                )}
              </Stack>

              {/* Concept */}
              <Stack
                spacing={-0.5}
                mb={requiredFields?.includes('concept') ? 0 : 2}
              >
                <StyledAutocomplete
                  disablePortal={true}
                  //freeSolo
                  forcePopupIcon={false}
                  loading={isFetchingConcepts}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value.id ?? value.uuid
                  }
                  // value={selectedConcept ?? timer?.concept ?? null}
                  value={selectedConcept}
                  options={conceptsDatasource}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => {
                    onConceptsSelectionChange(value);
                    onCampaignsSelectionChange(null);
                    !_.isEmpty(value) &&
                      handleOnOpenCampaign(value?.uuid, selectedPartner?.uuid);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // Prevent's default 'Enter' behavior.
                      event.defaultMuiPrevented = true;
                    }
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.key}>
                      {option.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                      }}
                      size="small"
                      label={
                        isFetchingConcepts
                          ? 'Loading'
                          : _.isNull(selectedPartner)
                            ? 'Select a concept'
                            : _.isEmpty(conceptsDatasource)
                              ? 'No Concepts Available'
                              : 'Select a concept'
                      }
                      placeholder={'Select a concept'}
                      required={requiredFields?.includes('concept')}
                    />
                  )}
                  disabled={
                    _.isEmpty(selectedPartner) ||
                    _.isEmpty(conceptsDatasource) ||
                    _.isNull(selectedTaskCategory) ||
                    isSmartly ||
                    isFetchingConcepts
                  }
                />
                {requiredFields?.includes('concept') && (
                  <Typography
                    pl={0.5}
                    variant="span"
                    color="secondary"
                    fontSize={11}
                  >
                    This field is required
                  </Typography>
                )}
              </Stack>

              {/* Campaign */}
              <Stack spacing={-0.5} mb={2}>
                <StyledAutocomplete
                  disablePortal
                  //freeSolo
                  forcePopupIcon={false}
                  loading={isFetchingCampaigns}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value.id ?? value.uuid
                  }
                  // value={selectedCampaign ?? timer?.campaign}
                  value={selectedCampaign}
                  options={campaignsDatasource}
                  getOptionLabel={(option) => option.name}
                  onChange={(_, value) => {
                    onCampaignsSelectionChange(value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // Prevent's default 'Enter' behavior.
                      event.defaultMuiPrevented = true;
                    }
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
                          : _.isNull(selectedConcept)
                            ? 'Select a campaign'
                            : _.isEmpty(campaignsDatasource)
                              ? 'No Campaigns Available'
                              : 'Select a campaign'
                      }
                      placeholder={'Select a campaign'}
                      required={requiredFields?.includes('campaign')}
                    />
                  )}
                  disabled={
                    _.isNull(selectedConcept) ||
                    _.isEmpty(campaignsDatasource) ||
                    _.isNull(selectedTaskCategory) ||
                    isSmartly ||
                    isFetchingCampaigns
                  }
                />
                {/* <VirtualizedSelection /> */}
                {requiredFields?.includes('campaign') && (
                  <Typography
                    pl={0.5}
                    variant="span"
                    color="secondary"
                    fontSize={11}
                  >
                    This field is required
                  </Typography>
                )}
              </Stack>

              <TagsDropdown
                datasource={_.isEmpty(timer) ? tagsDatasource : tagsList}
                onClickItem={onAddTags}
                onEnter={() => { }}
              />

              {/* Tags */}
              <Box width="fit-content" maxWidth={500}>
                {tagsDatasource && _.isEmpty(timer)
                  ? tagsDatasource
                    .filter((i) => i.is_selected)
                    .map((e, i) => (
                      <Chip
                        color="secondary"
                        key={i}
                        label={e.title}
                        size="small"
                        variant="outlined"
                        sx={{
                          marginRight: '0.5em',
                          cursor: 'pointer',
                        }}
                      />
                    ))
                  : tagsList
                    .filter((i) => i.is_selected)
                    .map((e, i) => (
                      <Chip
                        color="secondary"
                        key={i}
                        label={e.title}
                        size="small"
                        variant="outlined"
                        sx={{
                          marginRight: '0.5em',
                          cursor: 'pointer',
                        }}
                      />
                    ))}

                {(_.isEmpty(timer) &&
                  !_.isEmpty(
                    tagsDatasource?.filter((tags) => tags.is_selected)
                  )) ||
                  (!_.isEmpty(timer) &&
                    !_.isEmpty(tagsList?.filter((tags) => tags.is_selected))) ? (
                  <Chip
                    icon={<DeleteIcon />}
                    label="Clear tags"
                    color="secondary"
                    size="small"
                    variant="outlined"
                    sx={{
                      marginRight: '0.5em',
                      cursor: 'pointer',
                      borderStyle: 'dashed',
                      '& .MuiChip-iconSmall': {
                        width: '0.7em',
                        marginLeft: '5px',
                      },
                    }}
                    onClick={() => {
                      handleExistingOnRemoveAllTags({
                        taskTimerId: timer?.task_timer_id,
                      });
                    }}
                  />
                ) : null}
              </Box>
            </Stack>
          }
        />

        {/* Tags Selection*/}
        {/* <GlobalPopper
          isOpen={isTagsPopperOpen}
          anchorEl={tagsPopperAnchorEl}
          onClose={() => setIsTagsPopperOpen(false)}
          placement="top"
          sx={{ zIndex: 1 }}
          content={
            <ListAddSelection
              taskId={null}
              type={'tags'}
              relType={'task'}
              defaultData={tagsDatasource}
              handleSave={onAddTags}
            />
          }
        /> */}
      </Stack>
    </Stack>
  );
}

ActiveTimer.propTypes = {
  timer: PropTypes.any,
  inputPlaceholder: PropTypes.any,
  containerProps: PropTypes.any,
  tasksDatasource: PropTypes.any,
  partnersDatasource: PropTypes.any,
  campaignsDatasource: PropTypes.any,
  conceptsDatasource: PropTypes.any,
  tagsDatasource: PropTypes.any,
  requiredFields: PropTypes.any,
  canStopTimer: PropTypes.any,
  onStartTimer: PropTypes.any,
  onStopTimer: PropTypes.any,
  onAddTags: PropTypes.any,
  onClosePopper: PropTypes.any,
  onPresetsSelectionChange: PropTypes.any,
  onPartnersSelectionChange: PropTypes.any,
  onCampaignsSelectionChange: PropTypes.any,
  onConceptsSelectionChange: PropTypes.any,
  selectedTaskCategory: PropTypes.any,
  selectedPartner: PropTypes.any,
  selectedCampaign: PropTypes.any,
  selectedConcept: PropTypes.any,
  isSmartly: PropTypes.bool,
  handleTagsList: PropTypes.func,
  tagsList: PropTypes.any,
  handleExistingOnRemoveAllTags: PropTypes.func,
  handleOnOpenPartners: PropTypes.func,
  handleOnOpenConcepts: PropTypes.func,
  handleOnOpenCampaign: PropTypes.func,
  handleOnOpenTags: PropTypes.func,
  isFetchingPartners: PropTypes.bool,
  isFetchingConcepts: PropTypes.bool,
  isFetchingCampaigns: PropTypes.bool,
  teamId: PropTypes.number,
};

export default memo(ActiveTimer);
