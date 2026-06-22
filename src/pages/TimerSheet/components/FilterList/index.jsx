import React, { useContext } from 'react';
import _ from 'lodash';
import {
  Box,
  Typography,
  Card,
  Stack,
  TextField,
  Autocomplete,
  IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import { appColors } from 'theme/variables';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ClearIcon from '@mui/icons-material/Clear';
import TimerSheetContext from 'pages/TimerSheet/Context';

const MAX_STAFF_FILTER_SELECTION = 10;

export default function FilterList({ filter, options }) {
  // const [staffListData, setStaffListData] = useState([]);
  // const [campaignListData, setCampaignListData] = useState([]);
  // const [partnerListData, setPartnerListData] = useState([]);

  const {
    selectedDateRange,
    selectedCampaign,
    selectedPartner,
    selectedStaff,
    handlePopper,
    handleChangeFilterData,
    handleClearDateRange,
    userData,
    isFetchingPartners,
    isFetchingCampaignList,
    isFetchingMembers,
    isFetchingConceptList,
    handleOnOpenCampaignList,
    handleOnOpenPartners,
    handleOnOpenMembers,
    handleOnOpenConceptsList,
    adweavePartners,
    campaignListData,
    conceptListData,
    membersData,
    selectedConcept,
  } = useContext(TimerSheetContext);

  // useEffect(() => {
  //   if (!userData.is_smartly) {
  //     const itemStaff =
  //       membersData?.map((item, index) => ({
  //         key: index,
  //         id: item.id,
  //         label: item.fullname,
  //       })) ?? [];

  //     setStaffListData(itemStaff);

  //     const itemPartners =
  //       adweavePartners?.map((item, index) => ({
  //         key: index,
  //         id: item.uuid,
  //         label: item.name,
  //       })) ?? [];

  //     setPartnerListData(itemPartners);

  //     const itemCampaign =
  //       campaigns?.map((item, index) => ({
  //         key: index,
  //         id: item.uuid,
  //         label: item.name,
  //       })) ?? [];

  //     setCampaignListData(itemCampaign);
  //   } else {
  //     const itemPartners =
  //       options?.data?.map((item, index) => ({
  //         key: index,
  //         id: item.id,
  //         label: item.name,
  //       })) ?? [];

  //     setPartnerListData(itemPartners);
  //   }
  // }, [adweavePartners, campaigns, membersData]);

  switch (filter?.slug) {
    case 'staff':
      return (
        !userData.is_smartly && (
          <Box pl={2} pr={2} pb={1} pt={2}>
            <Typography fontWeight={700} color={appColors.lightViolet}>
              {filter?.name}
            </Typography>
            <Stack>
              <Autocomplete
                sx={{
                  '& .MuiOutlinedInput-input ': {
                    padding: '1px 0px !important',
                  },
                }}
                multiple
                value={selectedStaff}
                onOpen={handleOnOpenMembers}
                options={
                  membersData?.map((item, index) => ({
                    key: index,
                    id: item.id,
                    label: item.fullname,
                  })) ?? []
                }
                onChange={(event, value) =>
                  handleChangeFilterData(
                    value.slice(0, MAX_STAFF_FILTER_SELECTION),
                    'staff'
                  )
                }
                loading={isFetchingMembers}
                getOptionDisabled={(option) =>
                  selectedStaff.length >= MAX_STAFF_FILTER_SELECTION &&
                  !selectedStaff.some((staff) => staff.id === option.id)
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
              />
            </Stack>
          </Box>
        )
      );

    case 'partners':
      return (
        <Box pl={2} pr={2} pb={1} pt={userData.is_smartly ? 2 : 0}>
          <Typography fontWeight={700} color={appColors.lightViolet}>
            {filter?.name}
          </Typography>
          <Stack>
            <Autocomplete
              sx={{
                '& .MuiOutlinedInput-input ': {
                  padding: '1px 0px !important',
                },
              }}
              // multiple
              options={
                !userData.is_smartly
                  ? adweavePartners?.map((item, index) => ({
                      key: index,
                      id: item.uuid,
                      label: item.name,
                    })) ?? []
                  : options?.data?.map((item, index) => ({
                      key: index,
                      id: item.id,
                      label: item.name,
                    })) ?? []
              }
              value={selectedPartner}
              onOpen={handleOnOpenPartners}
              loading={isFetchingPartners}
              onChange={(event, value) =>
                handleChangeFilterData(value, 'partners')
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
            />
          </Stack>
        </Box>
      );

    case 'concept':
      return (
        !userData.is_smartly && (
          <Box pl={2} pr={2} pb={1}>
            <Typography fontWeight={700} color={appColors.lightViolet}>
              {filter?.name}
            </Typography>
            <Stack>
              <Autocomplete
                sx={{
                  '& .MuiOutlinedInput-input ': {
                    padding: '1px 0px !important',
                  },
                }}
                // multiple
                options={
                  conceptListData
                    .filter((data) => {
                      if (selectedPartner?.id) {
                        if (selectedPartner?.id === 'uncat001') return true;
                        else
                          return (
                            data.partner_uuid === selectedPartner.id ||
                            data.partner_uuid === 'uncat001'
                          );
                      } else return true;
                    })
                    ?.map((item, index) => ({
                      key: index,
                      id: item.uuid,
                      label: item.name,
                    })) ?? []
                }
                onOpen={handleOnOpenConceptsList}
                value={selectedConcept}
                loading={isFetchingConceptList}
                onChange={(event, value) =>
                  handleChangeFilterData(value, 'concept')
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
              />
            </Stack>
          </Box>
        )
      );

    case 'campaign':
      return (
        !userData.is_smartly && (
          <Box pl={2} pr={2} pb={1}>
            <Typography fontWeight={700} color={appColors.lightViolet}>
              {filter?.name}
            </Typography>
            <Stack>
              <Autocomplete
                sx={{
                  '& .MuiOutlinedInput-input ': {
                    padding: '1px 0px !important',
                  },
                }}
                // multiple
                options={
                  campaignListData
                    .filter((data) => {
                      if (selectedPartner?.id) {
                        if (selectedConcept?.id === 'uncatconcept001')
                          return true;
                        else
                          return (
                            data.concept_id === selectedPartner.id ||
                            data.concept_id === 'uncatconcept001'
                          );
                      } else return true;
                    })
                    ?.map((item, index) => ({
                      key: index,
                      id: item.uuid,
                      label: item.name,
                    })) ?? []
                }
                onOpen={handleOnOpenCampaignList}
                value={selectedCampaign}
                loading={isFetchingCampaignList}
                onChange={(event, value) =>
                  handleChangeFilterData(value, 'campaign')
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
              />
            </Stack>
          </Box>
        )
      );

    case 'date':
      return (
        <>
          <Box pl={2} pr={2} pb={1}>
            <Typography fontWeight={700} color={appColors.lightViolet}>
              {filter?.name}
            </Typography>
            <Stack
              direction="row"
              sx={{
                cursor: 'pointer',
                border: '1px solid #ececec',
                //padding: '12px',
                height: '2.8em',
                borderRadius: '7px',
              }}
              justifyContent="space-between"
            >
              <Typography
                onClick={(e) => handlePopper(e, filter?.slug)}
                sx={{
                  py: '12px',
                  pl: '12px',
                  width: '100%',
                }}
              >
                {selectedDateRange.replace(/,/g, ' to ')}
              </Typography>
              {!_.isEmpty(selectedDateRange) && (
                <IconButton onClick={handleClearDateRange}>
                  <ClearIcon sx={{ height: '.7em' }} />
                </IconButton>
              )}
            </Stack>
          </Box>
        </>
      );

    default:
      return (
        <Box pl={2} pr={2} pb={1}>
          <Typography fontWeight={700} color={appColors.lightViolet}>
            {filter?.name}
          </Typography>
          <Card variant="outlined">
            <Stack p={2}></Stack>
          </Card>
        </Box>
      );
  }
}

FilterList.propTypes = {
  filter: PropTypes.any,
  options: PropTypes.any,
  selectedFilterOptions: PropTypes.any,
  setFilterOptions: PropTypes.any,
  setSelectedFilterOptions: PropTypes.any,
};
