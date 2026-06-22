// React
import { memo, useEffect } from 'react';

import { useStopwatch } from 'react-timer-hook';
import { useSelector, useDispatch } from 'react-redux';
import { setIsRunning } from 'store/reducers/activeTimer';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

// MUI Components
import { Box, Stack, Typography } from '@mui/material';

import { digitFormatter } from '../../../helper';

import LoadingButton from '@mui/lab/LoadingButton';

import _ from 'lodash';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

function TimerControl({
  canStopTimer,
  onStart,
  onStop,
  selectedPartner,
  selectedTaskCategory,
}) {
  const { active: activeTimer, isUpdatingTimer } = useSelector(
    (state) => state.timer
  );
  const { data: userData } = useSelector((state) => state.user);
  const { isRunningTimer } = useSelector((state) => state.activeTimer);

  const dispatch = useDispatch();

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(duration);
  dayjs.tz.setDefault(userData.timezone);

  const timeIn =
    !_.isEmpty(activeTimer) &&
    activeTimer?.timeline[(activeTimer?.timeline?.length ?? 1) - 1]?.time_in;

  const dateToday = dayjs.tz();

  const timeInDuration = !_.isEmpty(activeTimer)
    ? dayjs?.duration(dateToday.diff(dayjs.tz(timeIn), 's'), 's')?.asSeconds() /
      3600
    : 0;

  const stopWatchConfigs = {
    autoStart: false,
    offsetTimestamp: !_.isEmpty(activeTimer)
      ? timeInDuration >= 8 || activeTimer?.is_exceeded
        ? dateToday.add(8, 'h').toDate()
        : dateToday.add(dateToday.diff(dayjs.tz(timeIn), 's'), 's').toDate()
      : null,
  };

  const { seconds, minutes, hours, days, start, reset, pause } =
    useStopwatch(stopWatchConfigs);

  const handleTimerControlButtonClick = () => {
    if (isRunningTimer || timeInDuration >= 8 || activeTimer?.is_exceeded) {
      if (!_.isNull(selectedPartner)) reset(null, false);
      onStop();
      if (!_.isNull(selectedPartner)) dispatch(setIsRunning(false));
    } else {
      if (!_.isNull(selectedPartner) && !_.isNull(selectedTaskCategory))
        start();
      onStart();
      if (!_.isNull(selectedPartner) && !_.isNull(selectedTaskCategory))
        dispatch(setIsRunning(true));
    }
  };

  // Hooks
  useEffect(() => {
    if (!_.isEmpty(activeTimer) && !_.isNull(activeTimer)) {
      reset(stopWatchConfigs.offsetTimestamp, stopWatchConfigs.autoStart);
      start();
      dispatch(setIsRunning(true));
    }
  }, [activeTimer]);

  useEffect(() => {
    if (isRunningTimer) {
      reset(stopWatchConfigs.offsetTimestamp, stopWatchConfigs.autoStart);
      start();
    } else reset(null, false);
  }, [isRunningTimer]);

  useEffect(() => {
    if (timeInDuration >= 8 || activeTimer?.is_exceeded) pause();
  }, [timeInDuration]);

  return (
    <>
      {/* Countdown timer */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }} width={85}>
        <Typography
          variant="h6"
          fontWeight={700}
          color={
            timeInDuration >= 8 || activeTimer?.is_exceeded
              ? 'error'
              : 'primary'
          }
        >
          {`${
            days !== 0
              ? digitFormatter(hours + days * 24)
              : digitFormatter(hours)
          }:${digitFormatter(minutes)}:${digitFormatter(seconds)}`}
        </Typography>
      </Box>

      {/* Controls */}
      <Stack direction="row" alignItems="center">
        <LoadingButton
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleTimerControlButtonClick}
          loading={isUpdatingTimer}
          disabled={
            (isRunningTimer ||
              timeInDuration >= 8 ||
              activeTimer?.is_exceeded) &&
            (!canStopTimer ?? false)
          }
        >
          {isRunningTimer || timeInDuration >= 8 || activeTimer?.is_exceeded
            ? 'Stop'
            : 'Start'}
        </LoadingButton>
      </Stack>
    </>
  );
}

TimerControl.propTypes = {
  canStopTimer: PropTypes.any,
  handleRunning: PropTypes.any,
  onStart: PropTypes.any,
  onStop: PropTypes.any,
  selectedPartner: PropTypes.any,
  selectedTaskCategory: PropTypes.any,
};

export default memo(TimerControl);
