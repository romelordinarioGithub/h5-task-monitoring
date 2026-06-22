import { memo, useState, useContext } from 'react';

import { Stack, Box, Tabs, Tab, Button } from '@mui/material';

import Update from 'pages/Brief/views/RightPanel/Update';
// import ActivityLog from 'pages/Brief/views/RightPanel/ActivityLog';
// import Files from 'pages/Brief/views/RightPanel/Files';

import BriefContext from 'pages/Brief/Context';
// import ReferenceLinks from 'pages/Brief/views/RightPanel/ReferenceLinks';

import Swal from 'sweetalert2';
import _ from 'lodash';

const RightPanel = () => {
  const [value, setValue] = useState(0);

  const {
    overview: { concept, partner_group, campaign_name, slack_link },
  } = useContext(BriefContext);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    if (
      (concept?.toLowerCase() === 'uncategorized' ||
        partner_group?.toLowerCase() === 'uncategorized' ||
        campaign_name?.toLowerCase() === 'uncategorized') &&
      newValue === 3
    ) {
      return Swal.fire({
        icon: 'warning',
        title: `<p style="font-size: 0.7em">This feature is coming soon.</p>`,
        showCancelButton: false,
        confirmButtonText: 'Yes',
      });
    }

    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ borderBottom: 1, borderColor: 'divider', padding: '0 1em' }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Update" disableRipple />
          {/* <Tab label="Activity log" disableRipple /> */}
          {/* <Tab label="Files" disableRipple /> */}
          {/* <Tab label="Reference Links" disableRipple /> */}
          {/* {team?.id === 5 || (taskType?.id === 12 && team?.id === 3) ? (
            <Tab label="Error Summary" disableRipple />
          ) : null} */}
        </Tabs>
        <Box display="flex" justifyContent="center" sx={{ paddingY: '.5em' }}>
          <Button
            variant="contained"
            target="_blank"
            href={slack_link}
            disabled={_.isNull(slack_link)}
            sx={{
              background: '#F22076',
              fontSize: '0.8em',
              fontWeight: 600,
              height: '2.7em',
            }}
          >
            Slack
          </Button>
        </Box>
      </Stack>
      <Box height="calc(100% - 49px)" overflow="auto" p={2}>
        {value === 0 ? <Update /> : <Box />}
        {/* {value === 1 ? <ActivityLog /> : <Box />} */}
        {/* {value === 1 ? <Files /> : <Box />}
        {value === 3 ? <ReferenceLinks /> : <Box />}
        {value === 4 ? <QASummary /> : <Box />} */}
      </Box>
    </Box>
  );
};

export default memo(RightPanel);
