import React, { useContext } from 'react';

import { useTimer } from 'react-timer-hook';

import { Box, Stack, Typography } from '@mui/material';

import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';

import { digitFormatter } from 'utils/session/primitives';

import PropTypes from 'prop-types';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import TicketContext from 'pages/Ticket/Context';

export default function DueDateProgressTimer({
  isOverdue,
  dueDate,
  dateCreated,
}) {
  const taskDueTimer = useTimer({
    autoStart: !isOverdue,
    expiryTimestamp: dueDate,
  });

  const { userData } = useContext(TicketContext);

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault(userData.timezone);

  // Timer progress calculation
  const currentTimeToDueDateTimeDiff = dueDate - new Date();

  const dateCreatedToDueDateTimeDiff = dueDate - dateCreated;

  const dueDateTimerProgress =
    (currentTimeToDueDateTimeDiff / dateCreatedToDueDateTimeDiff) * 100;

  return (
    <Box sx={{ width: 130, height: 130 }} mx={4}>
      <CircularProgressbarWithChildren
        value={isOverdue ? 0 : dueDateTimerProgress}
        styles={buildStyles({
          trailColor: '#fccccc',
          pathColor: '#25165B',
        })}
      >
        <Stack alignItems="center">
          <Typography fontWeight={700}>
            {isOverdue
              ? '00:00:00'
              : `${digitFormatter(
                  taskDueTimer.days * 24 + taskDueTimer.hours
                )}:${digitFormatter(taskDueTimer.minutes)}:${digitFormatter(
                  taskDueTimer.seconds
                )}`}
          </Typography>
          <Typography variant="caption">Time Left</Typography>
        </Stack>
      </CircularProgressbarWithChildren>
    </Box>
  );
}

DueDateProgressTimer.propTypes = {
  isOverdue: PropTypes.bool,
  dueDate: PropTypes.any,
  dateCreated: PropTypes.any,
  progress: PropTypes.any,
};
