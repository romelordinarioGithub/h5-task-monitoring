import { memo, useState, useContext } from 'react';

import { Stack, Box, Tabs, Tab, Button } from '@mui/material';

import Update from 'pages/Task/views/RightPanel/Update';
import ActivityLog from 'pages/Task/views/RightPanel/ActivityLog';
import Files from 'pages/Task/views/RightPanel/Files';
import QASummary from 'pages/Task/views/RightPanel/QASummary';
import _ from 'lodash';

import TaskContext from 'pages/Task/Context';
import ReferenceLinks from 'pages/Task/views/RightPanel/ReferenceLinks';

import Swal from 'sweetalert2';

const RightPanel = () => {
  const [value, setValue] = useState(0);

  const {
    overview: {
      team,
      slack_url,
      rel_type,
      concept,
      partner_group,
      campaign_name,
    },
    taskType,
  } = useContext(TaskContext);

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
        sx={{
          borderBottom: 1,
          borderColor: '#ede9fe',
          padding: '0 1em',
          backgroundColor: '#fdfcff',
        }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Update" disableRipple />
          <Tab label="Activity log" disableRipple />
          <Tab label="Files" disableRipple />
          <Tab label="Reference Links" disableRipple />
          {team?.id === 5 || (taskType?.id === 12 && team?.id === 3) ? (
            <Tab label="Error Summary" disableRipple />
          ) : null}
        </Tabs>
        {!_.isNull(slack_url) && rel_type === 'task' && (
          <Box display="flex" justifyContent="center" sx={{ paddingY: '.5em' }}>
            <Button
              variant="contained"
              target="_blank"
              href={slack_url}
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
        )}
      </Stack>
      <Box
        height="calc(100% - 49px)"
        overflow="auto"
        p={2}
        sx={{ backgroundColor: '#f8f9ff' }}
      >
        {value === 0 ? <Update /> : <Box />}
        {value === 1 ? <ActivityLog /> : <Box />}
        {value === 2 ? <Files /> : <Box />}
        {value === 3 ? <ReferenceLinks /> : <Box />}
        {value === 4 ? <QASummary /> : <Box />}
      </Box>
    </Box>
  );
};

export default memo(RightPanel);
