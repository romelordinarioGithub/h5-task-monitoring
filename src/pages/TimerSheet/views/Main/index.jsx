import React, { useContext } from 'react';
import TimerSheetContext from 'pages/TimerSheet/Context';
import Task from 'pages/TimerSheet/views/Task';
import Chart from 'pages/TimerSheet/views/Chart';
import CircularLoader from 'components/Common/CircularLoader';
import { Stack, Typography } from '@mui/material';
import Statistic from 'pages/TimerSheet/views/Statistic';

export default function Main() {
  const { isTimeSheetFetching, userData } = useContext(TimerSheetContext);

  return (
    <Stack
      spacing={2}
      px={15}
      py={3}
      sx={{
        overflowY: 'scroll',
        height: 'calc(100vh - 3.5em)',
      }}
    >
      <Typography pb={5} fontWeight={800} variant="h4">
        Time Sheet
      </Typography>
      <Chart />
      {isTimeSheetFetching && <CircularLoader />}
      <Task />
      {!userData.is_smartly && <Statistic />}
    </Stack>
  );
}
