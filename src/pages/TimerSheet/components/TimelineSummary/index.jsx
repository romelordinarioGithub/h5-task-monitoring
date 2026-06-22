import { memo, useContext, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TimerSheetContext from 'pages/TimerSheet/Context';
// MUI Components
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  Chip,
  Autocomplete,
  styled,
  TextField,
  Grid,
} from '@mui/material';
// MUI Icons
import ClearIcon from '@mui/icons-material/Clear';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { formatDate } from 'utils/date';
import Input from '../Input';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const StyledAutocomplete = styled(Autocomplete)({
  width: 'auto',
  '&.MuiListSubheader-root': {
    color: 'rgb(242 32 118)',
    lineHeight: '32px',
    backgroundColor: '#f0f0f0',
  },
  '& .MuiAutocomplete-inputRoot .Mui-disabled ': {
    WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)',
  },
  flex: 1,
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
    },
  },
});

function TimelineSummary({ data }) {
  const {
    handleModal,
    handlePopper,
    timelogData,
    timelineData,
    isTimelineFetching,
    categories,
    concepts,
    campaigns,
    adweavePartners,
    tagsList,
    handleRemoveAllTags,
    handlePartnersSelectionChange,
    handleCampaignsSelectionChange,
    handleConceptsSelectionChange,
    handleTaskSelectionChange,
    isFetchingPartners,
    isFetchingConcepts,
    isFetchingCampaigns,
    handleOnOpenConcepts,
    handleOnOpenCampaign,
    handleOnOpenPartners,
    handleOnOpenTaskCategories,
    requiredFields,
  } = useContext(TimerSheetContext);

  useEffect(() => {
    if (timelogData?.timer_type === 'preset') {
      handleOnOpenConcepts(data?.partner?.id);
      !_.isNull(data?.concept) &&
        handleOnOpenCampaign(
          data?.concept?.uuid ?? data?.concept?.uuid,
          data?.partner?.id ?? data?.partner?.uuid
        );
    }
  }, []);

  const renderColumnCellWithTooltip = (params) => (
    <Tooltip
      title={
        params.value[0] === '-' ? (
          ''
        ) : (
          <Typography
            sx={{ color: 'white', fontSize: '1.15em', lineHeight: '1.6em' }}
          >
            {params.value[0]}
          </Typography>
        )
      }
      placement="bottom-end"
    >
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={(e) =>
          ['time_in', 'time_out'].includes(params.field) &&
          handlePopper(
            e,
            params.field === 'time_in' ? 'start_date' : 'end_date',
            {
              type: params.field,
              timer_id:
                params.row.timer_type === 'preset'
                  ? params.row.timer_id
                  : params.row.id,
              selectedDate: params.value[0],
              limitDate: params.value[1],
              timer_type: params.row.timer_type,
            }
          )
        }
      >
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {params.value[0]}
        </span>
      </Box>
    </Tooltip>
  );

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    {
      field: 'time_in',
      headerName: 'Time In',
      flex: 1,
      renderCell: renderColumnCellWithTooltip,
    },
    {
      field: 'time_out',
      headerName: 'Time Out',
      flex: 1,
      renderCell: renderColumnCellWithTooltip,
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
    },
  ];

  const rows = timelineData?.map((d) => ({
    timer_id: data?.timer_id,
    id: d.timeline_id,
    time_in: [d.time_in, d.time_out] ?? '-',
    time_out: [d.time_out, d.time_in] ?? '-',
    total: d.total ?? '-',
    timer_type: data?.timer_type,
  }));

  return (
    <Box
      sx={{
        mt: 2,
        mb: 3,
        mx: 3,
      }}
    >
      <Stack spacing={2}>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {/* <Stack flexDirection="row" spacing={2}> */}
          <Chip
            label={data?.timer_type ?? '-'}
            size="small"
            sx={{
              borderRadius: '3px',
              height: '19px',
              textTransform: 'capitalize',
            }}
            color={
              data?.timer_type === 'subtask'
                ? 'secondary'
                : data?.timer_type === 'task'
                ? 'primary'
                : data?.timer_type === 'ticket'
                ? 'info'
                : 'warning'
            }
          />
          {/* </Stack> */}
          <IconButton onClick={() => handleModal(false, null, null)}>
            <ClearIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Stack>
        <Box>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Stack spacing={2}>
                <StyledAutocomplete
                  freeSolo
                  value={data?.user?.name || null}
                  renderInput={(params) => (
                    <StyledTextField {...params} size="small" label="Staff" />
                  )}
                  disabled={true}
                />
                {timelogData?.timer_type === 'preset' ? (
                  <Input
                    data={categories}
                    value={{
                      name: data?.category?.name,
                    }}
                    onSelectionChange={(data) => {
                      handleTaskSelectionChange(data);
                    }}
                    onOpen={handleOnOpenTaskCategories}
                    disabled={timelogData?.timer_type != 'preset'}
                  />
                ) : (
                  <StyledAutocomplete
                    freeSolo
                    value={data?.task?.name || null}
                    renderInput={(params) => (
                      <StyledTextField {...params} size="small" label="Task" />
                    )}
                    disabled={true}
                  />
                )}
                <StyledAutocomplete
                  disablePortal
                  forcePopupIcon={false}
                  loading={isFetchingConcepts}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value.id ?? value.uuid
                  }
                  value={data?.concept || null}
                  options={concepts}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value, reason) => {
                    handleConceptsSelectionChange(value, reason);
                    !_.isEmpty(value) &&
                      handleOnOpenCampaign(
                        value?.id ?? value?.uuid,
                        data?.partner?.id ?? data?.partner?.uuid
                      );
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
                          : _.isNull(data?.partner)
                          ? 'Concept'
                          : _.isEmpty(concepts) &&
                            timelogData?.timer_type == 'preset'
                          ? 'No Concepts Available'
                          : 'Concept'
                      }
                      placeholder={'Select a concept'}
                      required={requiredFields?.includes('concept')}
                    />
                  )}
                  disabled={
                    _.isNull(data?.partner) ||
                    _.isEmpty(concepts) ||
                    _.isNull(data?.task?.name) ||
                    timelogData?.timer_type != 'preset' ||
                    isFetchingConcepts
                  }
                />
                <StyledTextField
                  onClick={(e) => {
                    timelogData?.timer_type === 'preset'
                      ? handlePopper(e, 'tags', {})
                      : null;
                  }}
                  label="Tags"
                  size="small"
                  disabled={timelogData?.timer_type != 'preset'}
                  value={tagsList.filter((i) => i.is_selected)}
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#7e14e6',
                    },
                  }}
                  InputProps={{
                    inputComponent: ({ ...props }) => (
                      <Box {...props}>
                        {tagsList
                          .filter((i) => i.is_selected)
                          .map(
                            (tag, index) =>
                              index < 2 && (
                                <Chip
                                  key={index}
                                  label={tag.title}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  sx={{
                                    cursor: 'pointer',
                                    marginRight: '0.5em',
                                    fontWeight: 'normal',
                                    maxWidth: '6em',
                                  }}
                                />
                              )
                          )}
                        {_.size(tagsList.filter((i) => i.is_selected)) > 2 && (
                          <Chip
                            label={`+${
                              _.size(
                                tagsList?.filter((tags) => tags.is_selected)
                              ) - 2
                            }`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{
                              marginRight: '0.5em',
                              cursor: 'pointer',
                            }}
                          />
                        )}
                      </Box>
                    ),
                    endAdornment: !_.isEmpty(
                      tagsList?.filter((tags) => tags.is_selected)
                    ) &&
                      timelogData?.timer_type === 'preset' && (
                        <Tooltip title="Clear Tags">
                          <IconButton onClick={() => handleRemoveAllTags()}>
                            {<DeleteOutlineIcon sx={{ fontSize: '1.2em' }} />}
                          </IconButton>
                        </Tooltip>
                      ),
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={2}>
                <StyledAutocomplete
                  freeSolo
                  value={data?.team?.name || null}
                  renderInput={(params) => (
                    <StyledTextField {...params} size="small" label="Team" />
                  )}
                  disabled={true}
                />
                <StyledAutocomplete
                  disablePortal
                  forcePopupIcon={false}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid ?? option.id === value.id ?? value.uuid
                  }
                  disableClearable
                  onOpen={handleOnOpenPartners}
                  value={data?.partner || null}
                  options={
                    adweavePartners.filter((data) => data.uuid != 'uncat001') ??
                    []
                  }
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value, reason) => {
                    handlePartnersSelectionChange(value, reason);
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
                      {option.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      size="small"
                      label="Partner"
                      placeholder={'Select a partner'}
                      required={requiredFields?.includes('partner')}
                    />
                  )}
                  loading={isFetchingPartners}
                  disabled={
                    (!_.isEmpty(adweavePartners) ||
                      timelogData?.timer_type != 'preset') &&
                    (_.isNull(data?.task?.name) ||
                      timelogData?.timer_type != 'preset')
                  }
                />
                <StyledAutocomplete
                  disablePortal
                  forcePopupIcon={false}
                  loading={isFetchingCampaigns}
                  isOptionEqualToValue={(option, value) =>
                    option.uuid === value.id ?? value.uuid
                  }
                  value={data?.campaign || null}
                  options={campaigns}
                  getOptionLabel={(option) => option.name}
                  onChange={(_, value, reason) => {
                    handleCampaignsSelectionChange(value, reason);
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
                          : _.isNull(data?.concept)
                          ? 'Campaign'
                          : _.isEmpty(campaigns) &&
                            timelogData?.timer_type == 'preset'
                          ? 'No Campaigns Available'
                          : 'Campaign'
                      }
                      placeholder={'Select a campaign'}
                      required={requiredFields?.includes('campaign')}
                    />
                  )}
                  disabled={
                    _.isNull(data?.concept) ||
                    _.isEmpty(campaigns) ||
                    _.isNull(data?.campaigns) ||
                    timelogData?.timer_type != 'preset' ||
                    isFetchingCampaigns
                  }
                />
                <StyledAutocomplete
                  freeSolo
                  value={
                    formatDate(data?.created_at, 'YYYY-MM-DD h:mm:ss A') || null
                  }
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      size="small"
                      label="Date Created"
                    />
                  )}
                  disabled={true}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            height: '300px',
          }}
        >
          <DataGrid
            initialState={{
              columns: {
                columnVisibilityModel: {
                  // Hide columns status and traderName, the other columns will remain visible
                  id: false,
                },
              },
            }}
            rows={rows ?? []}
            columns={columns ?? []}
            disableSelectionOnClick
            loading={isTimelineFetching}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default memo(TimelineSummary);

TimelineSummary.propTypes = {
  data: PropTypes.any,
};
