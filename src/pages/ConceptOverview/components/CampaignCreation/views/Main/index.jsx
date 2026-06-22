import React, { Fragment, useContext } from 'react';

import _ from 'lodash';

import { useSelector } from 'react-redux';

// Context
import ConceptOverviewContext from 'pages/ConceptOverview/context';

// MUI Components
import { Box, Typography, styled, Stack, TextField } from '@mui/material';

// Custom Component
import InfiniteAutoComplete from 'components/Common/InfiniteAutoComplete';
import DateTime from '../../Components/DateTime';

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    height: auto !important;
    border-radius: 0.8em;
    fontsize: '1rem';
    height: '48px';
  }
`;

const Main = () => {
  const {
    taskName,
    setTaskName,
    channel,
    setChannel,
    deliveryDate,
    setDeliveryDate,
    launchDate,
    setLaunchDate,
  } = useContext(ConceptOverviewContext);

  const {
    data: { channelList },
    loading: { fetchingCampaign },
  } = useSelector((state) => state.manualTaskCreation);

  const onInputChange = (e, v, name) => {
    switch (name.toLowerCase().replace(/ /g, '_')) {
      case 'channel':
        _.isNull(v) ? setChannel(null) : setChannel(v);
        break;
    }
  };

  return (
    <Fragment>
      <Box padding="45px 60px" sx={{ overflowY: 'auto' }}>
        <Stack direction="row">
          <Typography variant="h5" fontWeight={800}>
            Create new custom campaign
          </Typography>
        </Stack>
        <Box mb={4}>
          <Typography>Please fill the required fields below.</Typography>
        </Box>
        <Box mb={3}>
          <StyledTextField
            label="Campaign Name"
            value={taskName}
            required
            onChange={(event) => setTaskName(event.target.value)}
            inputProps={{ maxLength: 75 }}
          />
        </Box>
        <InfiniteAutoComplete
          mb={3}
          data={channelList}
          name="Channel"
          defaultValue={channel}
          isRequired={true}
          isLoading={fetchingCampaign}
          isDisabled={_.isEmpty(channelList) || fetchingCampaign}
          onInputChange={onInputChange}
          required={true}
        />
        <Box mb={3}>
          <DateTime
            label="Launch Date"
            setDeliveryDate={setLaunchDate}
            deliveryDate={launchDate}
          />
        </Box>
        <Box mb={3}>
          <DateTime
            label="Delivery Date"
            setDeliveryDate={setDeliveryDate}
            deliveryDate={deliveryDate}
          />
        </Box>
        <Box mb={3}>
          <StyledTextField
            label="Delivery Type"
            value={'Non Trafficked'}
            disabled
            inputProps={{ maxLength: 75 }}
          />
        </Box>
        <Box mb={3}>
          <StyledTextField
            label="Personalization Type"
            value={'Decision Tree'}
            disabled
            inputProps={{ maxLength: 75 }}
          />
        </Box>
      </Box>
    </Fragment>
  );
};

export default Main;
