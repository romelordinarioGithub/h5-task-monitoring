import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled, Box, Card, Stack, Typography, Tooltip } from '@mui/material';
import { useStopwatch } from 'react-timer-hook';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';

import { digitFormatter } from '../../helper';

const StyledCard = styled(Card)({
  border: '1px solid #5025c44f !important',
  boxShadow: 'rgb(80 37 196 / 10%) 0px 0px 10px 4px !important',
  padding: '8px 19px 19px',
});

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

function ActiveTaskTimer({ data }) {
  const { data: userData } = useSelector((state) => state.user);

  dayjs.tz.setDefault(userData.timezone);

  const dateToday = dayjs.tz();

  const timeInDuration =
    dayjs
      ?.duration(dateToday.diff(dayjs.tz(data?.start), 's'), 's')
      ?.asSeconds() / 3600;

  const stopWatchConfigs = {
    autoStart: true,
    offsetTimestamp:
      timeInDuration >= 8
        ? dateToday.add(8, 'h').toDate()
        : dayjs
            .tz()
            .add(dayjs.tz().diff(dayjs.tz(data.start), 's'), 's')
            .toDate(),
  };

  const { seconds, minutes, hours, days, start, reset, pause } =
    useStopwatch(stopWatchConfigs);

  // Hooks
  useEffect(() => {
    reset(stopWatchConfigs.offsetTimestamp, stopWatchConfigs.autoStart);
    start();
  }, [data]);

  useEffect(() => {
    if (timeInDuration >= 8 || data?.is_exceeded) pause();
  }, [timeInDuration]);

  return (
    <StyledCard>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={-0.7}>
          <Typography
            variant="span"
            sx={{
              color: '#a19da4',
              fontSize: '0.8em',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {data.rel_type}
          </Typography>
          <Tooltip title="Open task in new tab">
            <Typography
              component={Link}
              to={`/${data.rel_type}/${data.rel_id}`}
              target="_blank"
              sx={{
                '&:hover': { textDecoration: 'underline' },
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {data.task_name || data.subtask_name}
            </Typography>
          </Tooltip>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            marginTop: '13px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
            width={85}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color={
                timeInDuration >= 8 || data?.is_exceeded ? 'error' : 'primary'
              }
            >
              {`${
                days !== 0
                  ? digitFormatter(hours + days * 24)
                  : digitFormatter(hours)
              }:${digitFormatter(minutes)}:${digitFormatter(seconds)}`}
            </Typography>
          </Box>
          <AccessTimeTwoToneIcon
            color="primary"
            sx={{ fontSize: '1.5em', marginBottom: 0.5 }}
          />
        </Stack>
      </Stack>
    </StyledCard>
  );
}

ActiveTaskTimer.propTypes = {
  data: PropTypes.any.isRequired,
};

export default ActiveTaskTimer;
