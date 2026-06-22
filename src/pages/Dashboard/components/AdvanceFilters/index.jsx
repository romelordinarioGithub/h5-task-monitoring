import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Collapse,
  Switch,
  Autocomplete,
  TextField,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TuneTwoToneIcon from '@mui/icons-material/TuneTwoTone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfiniteAutoComplete from 'components/Common/InfiniteAutoComplete';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import {
  getData,
  clearCampaign,
  clearConcept,
  getUpdateConceptList,
  getUpdateCampaignList,
} from 'store/reducers/manualTaskCreation';
import { setDashboardFilters } from 'store/reducers/filters';
import { useContext } from 'react';
import DashboardContext from 'pages/Dashboard/context';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '.8em',
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
      boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
    },
  },
});

const StyledButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  outline: 0px;
  border: 0px;
  margin: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  font-weight: 700;
  line-height: 1.71429;
  font-size: 0.875rem;
  text-transform: capitalize;
  min-width: 50px;
  padding: 6px 16px;
  border-radius: 8px;
  color: rgb(255, 255, 255);
  box-shadow: #f2207633 0px 8px 16px 0px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const StyledAutoComplete = styled(Autocomplete)`
  & .MuiOutlinedInput-root {
    border-radius: 0.8em;
  }

  & .MuiAutocomplete-popupIndicator {
    display: none;
  }

  & .Mui-disabled {
    background-color: #ececec;
  }

  & .MuiAutocomplete-endAdornment {
    top: calc(50% - 12px);
    right: 15px !important;
  }

  & .MuiAutocomplete-clearIndicator {
    visibility: visible;
    background: #b2b2b2;
    font-size: 13px;
    color: #fff;
    width: 1em;
    height: 1em;
    &:hover {
      background: #949191 !important;
    }
  }
`;

let delayDebounceFn;

// Reusable MultiSelectFilter component
const MultiSelectFilter = ({
  label,
  value = [],
  options = [],
  onChange,
  transformLabel = (label) => label,
}) => (
  <Stack mb={1} spacing={0.5}>
    <Typography fontWeight={700}>{label}</Typography>
    <Autocomplete
      freeSolo
      multiple
      sx={{
        '& .MuiOutlinedInput-input ': {
          padding: '1px 0px !important',
        },
      }}
      value={(value || []).map((id) => {
        const option = options.find((d) => d.id === id);
        return {
          key: id,
          label: transformLabel(
            option?.label || option?.fullname || option?.name || ''
          ),
        };
      })}
      options={options.map((d) => ({
        key: d.id,
        label: transformLabel(d.fullname || d.name || d.label || ''),
      }))}
      onChange={(_, newValue) => {
        onChange(newValue.map(({ key }) => key));
      }}
      getOptionLabel={(option) => option.label || ''}
      renderOption={(props, option) => (
        <li {...props} key={option.key}>
          {option.label}
        </li>
      )}
      renderInput={(params) => <TextField {...params} />}
      isOptionEqualToValue={(option, val) => option.key === val.key}
    />
  </Stack>
);

function AdvanceFilters({ onApply, onClose }) {
  const {
    state,
    members,
    priorities,
    statuses,
    team_id,
    handleOnResetAdvanceFilters,
    queue,
  } = useContext(DashboardContext);

  const [page, setPage] = useState({ concept: 1, campaign: 1 });
  const [loading, setLoading] = useState({
    isPartner: false,
    isConcept: false,
  });
  const [isAdvanceFiltersCollapsed, setIsAdvanceFiltersCollapsed] =
    useState(false);

  const dispatch = useDispatch();

  const {
    data: { partnerList, conceptList, campaignList, channelList },
    loading: { fetchingPartner, fetchingCampaign },
  } = useSelector((state) => state.manualTaskCreation);

  const {
    status: filterStatus,
    priority: filterPriority,
    assignees: filterAssignees,
    threads,
    subtask,
    smart_services,
    mss,
    partner: filterPartner,
    concept,
    campaign,
    channel,
  } = state.filter;

  const {
    partner: briefPartner,
    region,
    request_type,
    status: briefStatus,
    assignees: briefAssignees,
    priority: briefPriority,
  } = state.brief || {};

  useEffect(() => {
    if (queue === 'briefs') setIsAdvanceFiltersCollapsed(true);
    else setIsAdvanceFiltersCollapsed(false);
  }, [queue]);

  const handleOnClickApply = () => {
    const filters =
      queue === 'briefs'
        ? {
            partner: briefPartner,
            region,
            request_type,
          }
        : {
            concept_id: concept?.id,
            campaign_id: campaign?.uuid,
            partner_group_id: filterPartner?.id,
            channel_id: channel?.id,
          };
    onApply(_.omitBy(filters, (v) => _.isNil(v) || v === '')); // Remove all undefined, null, empty values
  };

  const handleOnAdvanceFilterInputChange = (e, v, name) => {
    switch (name.toLowerCase().replace(/ /g, '_')) {
      case 'partner':
        if (queue === 'briefs') {
          dispatch(
            setDashboardFilters({
              ...state,
              brief: {
                ...state.brief,
                partner: _.isNull(v) ? '' : v,
                status: [],
                assignees: [],
                priority: [],
              },
            })
          );
        } else {
          dispatch(
            setDashboardFilters({
              ...state,
              filter: {
                ...state.filter,
                concept: '',
                campaign: '',
                channel: '',
                partner: _.isNull(v) ? '' : v,
              },
            })
          );
          setPage({ concept: 1, campaign: 1 });
          dispatch(clearConcept());
          dispatch(clearCampaign());
        }

        break;

      case 'concept':
        dispatch(
          setDashboardFilters({
            ...state,
            filter: {
              ...state.filter,
              campaign: '',
              channel: '',
              concept: _.isNull(v) ? '' : v,
            },
          })
        );
        dispatch(clearCampaign());
        if (!_.isNull(v)) {
          dispatch(
            getData('get_concept_overview', {
              conceptId: v?.id,
              partnerId: filterPartner,
              page: 1,
            })
          );
          setPage({ ...page, campaign: 2 });
        }

        break;
      case 'campaign':
        dispatch(
          setDashboardFilters({
            ...state,
            filter: {
              ...state.filter,
              channel: '',
              campaign: _.isNull(v) ? '' : v,
            },
          })
        );
        break;
      case 'channel':
        dispatch(
          setDashboardFilters({
            ...state,
            filter: {
              ...state.filter,
              channel: _.isNull(v) ? '' : v,
            },
          })
        );
        break;
    }
  };

  const handleOnAdvanceFilterChange = (e, v) => {
    clearTimeout(delayDebounceFn);

    let data = campaignList?.data?.filter((x) => {
      if (x?.name) return x?.name.toLowerCase().includes(v.toLowerCase());
    });

    if (!_.isNull(v) && _.isEmpty(data) && _.size(campaignList.data) > 18)
      delayDebounceFn = setTimeout(() => {
        dispatch(getUpdateCampaignList(concept.id, filterPartner, 1, v));
      }, 1000);
  };

  const handleOnOpen = (name) => async () => {
    switch (name) {
      case 'partner':
        if (fetchingPartner) {
          setLoading({ ...loading, isPartner: true });
          await dispatch(getData('get_partners'));
          setLoading({ ...loading, isPartner: false });
        }

        break;
      case 'concept':
        if (_.isEmpty(conceptList)) {
          setLoading({ ...loading, isConcept: true });
          await dispatch(
            getData('get_concepts', {
              partnerId: filterPartner.id,
              page: page.concept,
            })
          );
          setLoading({ ...loading, isConcept: false });
          setPage({ ...page, concept: page.concept + 1 });
        }

        break;
      case 'campaign':
        if (_.isEmpty(campaignList)) {
          if (_.isEmpty(concept)) {
            await dispatch(
              getData('get_custom_campaign', {
                partnerId: filterPartner.id,
                page: 1,
              })
            );
          } else {
            dispatch(
              getData('get_concept_overview', {
                conceptId: concept.id,
                partnerId: filterPartner,
                page: 1,
              })
            );
            setPage({ ...page, campaign: 2 });
          }
        }

        break;
    }
  };

  const handleOnFilterChange = (type, data) => {
    dispatch(
      setDashboardFilters({
        ...state,
        filter: {
          ...state.filter,
          [type]: data,
        },
      })
    );
  };

  const handleOnBriefFilterChange = (type, data) => {
    // Reset standard filters when advance filters (partner, region, request_type) change
    const shouldResetStandardFilters = [
      'partner',
      'region',
      'request_type',
    ].includes(type);

    dispatch(
      setDashboardFilters({
        ...state,
        brief: {
          ...state.brief,
          [type]: data,
          ...(shouldResetStandardFilters && {
            status: [],
            assignees: [],
            priority: [],
          }),
        },
      })
    );
  };

  const handleOnScroll = (event, name) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    if (listboxNode.scrollHeight - position <= 1) {
      switch (name.toLowerCase()) {
        case 'concept':
          if (!loading.isPartner && conceptList.last_page >= page.concept) {
            dispatch(
              getUpdateConceptList({
                partnerId: filterPartner.id,
                page: page?.concept,
              })
            );
            setPage({ ...page, concept: page.concept + 1 });
          }

          break;
        case 'campaign':
          if (
            !fetchingCampaign &&
            campaignList.last_page >= page.campaign &&
            !_.isEmpty(concept)
          ) {
            dispatch(
              getUpdateCampaignList(concept.id, filterPartner, page.campaign)
            );
            setPage({ ...page, campaign: page.campaign + 1 });
          }

          break;
      }
    }
  };

  return (
    <Box sx={{ width: '550px', padding: 4, overflowX: 'hidden' }}>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 10, right: 10 }}
      >
        <CloseIcon sx={{ fontSize: '18px' }} />
      </IconButton>
      <Stack spacing={2}>
        {/* Filters */}
        <Stack spacing={2}>
          <Stack spacing={0.5} direction="row" alignItems="center" mb={1}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ paddingTop: '0.2em' }}
            >
              {queue !== 'briefs' ? 'Filters' : 'Brief Filters'}
            </Typography>
          </Stack>
          {queue !== 'briefs' && (
            <>
              <MultiSelectFilter
                label="Assignee"
                value={filterAssignees}
                options={members?.data || []}
                onChange={(newVal) => handleOnFilterChange('assignees', newVal)}
              />

              <MultiSelectFilter
                label="Priority"
                value={filterPriority}
                options={priorities || []}
                onChange={(newVal) => handleOnFilterChange('priority', newVal)}
                transformLabel={(label) => _.capitalize(label)}
              />

              <MultiSelectFilter
                label="Status"
                value={filterStatus}
                options={statuses || []}
                onChange={(newVal) => handleOnFilterChange('status', newVal)}
                transformLabel={(label) =>
                  label
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase())
                }
              />
            </>
          )}
          {queue === 'briefs' && (
            <>
              <Stack mb={1} spacing={0.5}>
                <Typography fontWeight={700}>Assignees</Typography>
                <Autocomplete
                  sx={{
                    '& .MuiOutlinedInput-input ': {
                      padding: '1px 0px !important',
                    },
                  }}
                  multiple
                  value={briefAssignees || []}
                  options={
                    members.data?.map((item, index) => ({
                      key: index,
                      id: item.id,
                      label: item.fullname,
                    })) ?? []
                  }
                  onChange={(_, newVal) =>
                    handleOnBriefFilterChange('assignees', newVal)
                  }
                  getOptionLabel={(option) => option.label || ''}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.key}>
                        {option.label}
                      </li>
                    );
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  isOptionEqualToValue={(option, val) => option.key === val.key}
                />
              </Stack>
              <MultiSelectFilter
                label="Priority"
                value={briefPriority || []}
                options={[
                  { id: 'Low', name: 'Low' },
                  { id: 'Normal', name: 'Normal' },
                  { id: 'High', name: 'High' },
                  { id: 'Urgent', name: 'Urgent' },
                ]}
                onChange={(newVal) =>
                  handleOnBriefFilterChange('priority', newVal)
                }
                transformLabel={(label) => _.capitalize(label)}
              />

              <MultiSelectFilter
                label="Status"
                value={briefStatus || []}
                options={statuses || []}
                onChange={(newVal) =>
                  handleOnBriefFilterChange('status', newVal)
                }
                transformLabel={(label) =>
                  label
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase())
                }
              />
            </>
          )}
          {queue !== 'briefs' && team_id !== 11 && team_id !== 21 && (
            <Stack direction="row" spacing={3}>
              {[
                {
                  label: 'Subtask',
                  key: 'subtask',
                  value: subtask,
                  isHidden: false,
                },
                {
                  label: 'Threads',
                  key: 'threads',
                  value: threads,
                  isHidden: false,
                },
                {
                  label: 'MSS',
                  key: 'mss',
                  value: mss,
                  isHidden: team_id !== 2,
                },
                {
                  label: 'Smart Services',
                  key: 'smart_services',
                  value: smart_services,
                  isHidden: team_id !== 5,
                },
              ].map(
                ({ label, key, value, isHidden }) =>
                  !isHidden && (
                    <Stack
                      key={key}
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                    >
                      <Switch
                        size="small"
                        color="success"
                        checked={value}
                        onChange={(e) => {
                          handleOnFilterChange(key, e.target.checked);
                        }}
                      />
                      <Typography>{label}</Typography>
                    </Stack>
                  )
              )}
            </Stack>
          )}
        </Stack>
        {queue === 'briefs' ? (
          <>
            {/* Brief-specific Filters */}
            <Stack spacing={2}>
              <Stack
                mt={2}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Stack direction="row" spacing={0.5} width="250px">
                  <TuneTwoToneIcon sx={{ fontSize: '16px' }} />
                  <Typography fontWeight={700}>Advance Filters</Typography>
                </Stack>
                <Box
                  borderBottom="1px solid #ececec"
                  borderColor="#0000000a"
                  width="100%"
                ></Box>
                <Box>
                  <IconButton
                    onClick={() =>
                      setIsAdvanceFiltersCollapsed(!isAdvanceFiltersCollapsed)
                    }
                  >
                    {isAdvanceFiltersCollapsed ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
              </Stack>
              <Collapse in={isAdvanceFiltersCollapsed}>
                <Stack
                  spacing={2}
                  sx={{
                    pt: 1,
                    '& > div': {
                      mb: '0 !important',
                    },
                  }}
                >
                  <StyledAutoComplete
                    multiple
                    freeSolo
                    size="large"
                    value={Array.isArray(briefPartner) ? briefPartner : []}
                    options={partnerList || []}
                    onChange={(_, newValue) => {
                      handleOnBriefFilterChange('partner', newValue);
                    }}
                    onOpen={handleOnOpen('partner')}
                    loading={loading.isPartner}
                    getOptionLabel={(option) => option.name || ''}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="large"
                        label="Partners"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loading.isPartner ? (
                                <CircularProgress color="secondary" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                    isOptionEqualToValue={(option, val) => option.id === val.id}
                  />

                  <StyledAutoComplete
                    freeSolo
                    size="large"
                    value={
                      [
                        { id: 'apac', value: 'APAC' },
                        { id: 'europe', value: 'Europe' },
                        { id: 'latam', value: 'LatAm' },
                        { id: 'mena', value: 'MENA' },
                        { id: 'noram', value: 'NorAm' },
                      ].find(
                        (opt) =>
                          opt.value?.toLowerCase() === region?.toLowerCase() ||
                          opt.id?.toLowerCase() === region?.toLowerCase()
                      ) ||
                      region ||
                      null
                    }
                    options={[
                      { id: 'apac', value: 'APAC' },
                      { id: 'europe', value: 'Europe' },
                      { id: 'latam', value: 'LatAm' },
                      { id: 'mena', value: 'MENA' },
                      { id: 'noram', value: 'NorAm' },
                    ]}
                    getOptionLabel={(option) => option.value || option || ''}
                    isOptionEqualToValue={(option, val) =>
                      option?.value === val?.value || option?.value === val
                    }
                    onChange={(_, newValue) =>
                      handleOnBriefFilterChange(
                        'region',
                        typeof newValue === 'string'
                          ? newValue.toLowerCase()
                          : newValue?.value?.toLowerCase() || ''
                      )
                    }
                    renderInput={(params) => (
                      <TextField {...params} size="large" label="CS Region" />
                    )}
                  />
                  <StyledAutoComplete
                    freeSolo
                    size="large"
                    value={
                      [
                        { id: 'creative_suite', value: 'Creative Suite' },
                        { id: 'sparkworks', value: 'SparkWorks' },
                        { id: 'cs_sw', value: 'Both CS & SW' },
                        {
                          id: 'no_existing_creative_contract',
                          value: 'No Existing Creative Contract',
                        },
                      ].find(
                        (opt) =>
                          opt.value === request_type || opt.id === request_type
                      ) ||
                      request_type ||
                      null
                    }
                    options={[
                      { id: 'creative_suite', value: 'Creative Suite' },
                      { id: 'sparkworks', value: 'SparkWorks' },
                      { id: 'cs_sw', value: 'Both CS & SW' },
                      {
                        id: 'no_existing_creative_contract',
                        value: 'No Existing Creative Contract',
                      },
                    ]}
                    getOptionLabel={(option) => option.value || option || ''}
                    isOptionEqualToValue={(option, val) =>
                      option?.value === val?.value || option?.value === val
                    }
                    onChange={(_, newValue) =>
                      handleOnBriefFilterChange(
                        'request_type',
                        typeof newValue === 'string'
                          ? newValue
                          : newValue?.value || ''
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="large"
                        label="Contract Type"
                      />
                    )}
                  />
                </Stack>
              </Collapse>
            </Stack>
          </>
        ) : (
          <>
            {/* Advance Filters */}
            <Stack spacing={2}>
              <Stack
                mt={2}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Stack direction="row" spacing={0.5} width="250px">
                  <TuneTwoToneIcon sx={{ fontSize: '16px' }} />
                  <Typography fontWeight={700}>Advance Filters</Typography>
                </Stack>
                <Box
                  borderBottom="1px solid #ececec"
                  borderColor="#0000000a"
                  width="100%"
                ></Box>
                <Box>
                  <IconButton
                    onClick={() =>
                      setIsAdvanceFiltersCollapsed(!isAdvanceFiltersCollapsed)
                    }
                  >
                    {isAdvanceFiltersCollapsed ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
              </Stack>
              <Collapse in={isAdvanceFiltersCollapsed}>
                <Stack
                  spacing={2}
                  sx={{
                    '& > div': {
                      mb: '0 !important',
                    },
                  }}
                >
                  <InfiniteAutoComplete
                    data={partnerList}
                    name="Partner"
                    defaultValue={filterPartner}
                    description={
                      _.isEmpty(filterPartner) &&
                      'All fields will be enabled once a partner is selected.'
                    }
                    isRequired={true}
                    onInputChange={handleOnAdvanceFilterInputChange}
                    onOpen={handleOnOpen('partner')}
                    isLoading={loading.isPartner}
                  />

                  <InfiniteAutoComplete
                    data={!_.isEmpty(conceptList.data) ? conceptList.data : []}
                    name="Concept"
                    defaultValue={concept}
                    description={
                      _.isEmpty(filterPartner) &&
                      'This has been disabled, please select a partner'
                    }
                    isRequired={true}
                    isDisabled={
                      _.isEmpty(filterPartner) || _.isUndefined(filterPartner)
                    }
                    onInputChange={handleOnAdvanceFilterInputChange}
                    onOpen={handleOnOpen('concept')}
                    isLoading={loading.isConcept}
                    handleScroll={handleOnScroll}
                  />

                  <InfiniteAutoComplete
                    data={
                      !_.isEmpty(_.uniq(campaignList.data))
                        ? _.uniq(campaignList.data)
                        : []
                    }
                    name="Campaign"
                    defaultValue={campaign}
                    description={
                      _.isEmpty(_.uniq(campaignList.data)) &&
                      _.isEmpty(campaign) &&
                      'No campaign found in this concept.'
                    }
                    isRequired={false}
                    isDisabled={
                      _.isEmpty(filterPartner) || _.isUndefined(filterPartner)
                    }
                    onInputChange={handleOnAdvanceFilterInputChange}
                    onChange={handleOnAdvanceFilterChange}
                    onOpen={handleOnOpen('campaign')}
                    handleScroll={handleOnScroll}
                    isLoading={fetchingCampaign}
                  />

                  <InfiniteAutoComplete
                    data={channelList}
                    name="Channel"
                    defaultValue={channel}
                    isLoading={fetchingCampaign}
                    onOpen={handleOnOpen('campaign')}
                    isDisabled={
                      _.isEmpty(filterPartner) || _.isUndefined(filterPartner)
                    }
                    onInputChange={handleOnAdvanceFilterInputChange}
                  />
                </Stack>
              </Collapse>
            </Stack>
          </>
        )}
        <Stack
          direction="row"
          sx={{ justifyContent: 'flex-end', paddingTop: 1 }}
        >
          <Button
            variant="text"
            sx={{ width: '100px' }}
            onClick={handleOnResetAdvanceFilters}
          >
            Reset
          </Button>
          <StyledButton
            color="secondary"
            variant="contained"
            sx={{ width: '120px' }}
            onClick={handleOnClickApply}
          >
            Apply Filters
          </StyledButton>
        </Stack>
      </Stack>
    </Box>
  );
}

MultiSelectFilter.propTypes = {
  label: PropTypes.func,
  value: PropTypes.func,
  options: PropTypes.func,
  onChange: PropTypes.func,
  transformLabel: PropTypes.func,
};

AdvanceFilters.propTypes = {
  open: PropTypes.any,
  data: PropTypes.any,
  onApply: PropTypes.func,
  onClose: PropTypes.func,
};

export default AdvanceFilters;
