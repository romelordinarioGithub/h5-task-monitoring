import React, { useContext } from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Stack,
  Backdrop,
  Tooltip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import LineGraph from 'pages/TimerSheet/components/LineGraph/index';
import PieGraph from 'pages/TimerSheet/components/PieGraph';
import TimerSheetContext from 'pages/TimerSheet/Context';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import calendar from 'assets/icons/calendar.svg';
import time from 'assets/icons/time.svg';
import check from 'assets/icons/check.svg';
import pencil from 'assets/icons/pencil.svg';

export default function Chart() {
  const {
    statisticsData,
    chartData,
    handlePopper,
    isChartFetching,
    filterChartSelectedDateRange,
    filterChartSelectedDropdown,
  } = useContext(TimerSheetContext);
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" fontWeight={700} color="primary">
          Chart
        </Typography>
        <Box>
          <Tooltip
            title="Filters"
            componentsProps={{
              tooltip: {
                sx: {
                  lineHeight: 'normal',
                  marginTop: '0.4em !important',
                },
              },
            }}
            arrow
          >
            <IconButton
              sx={{ marginLeft: '2px' }}
              onClick={(e) => handlePopper(e, 'dropdown')}
            >
              <FilterAltTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
      <Box sx={{ my: 4.5 }}>
        <Grid container spacing={5}>
          <Grid item xs={3}>
            <PieGraph
              data={{
                title: 'Last Month',
                data: statisticsData.last_month,
                color: '#402176',
                bg: calendar,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <PieGraph
              data={{
                title: 'This Month',
                data: statisticsData.this_month,
                color: '#15a6c9',
                bg: time,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <PieGraph
              data={{
                title: 'Last Week',
                data: statisticsData.last_week,
                color: '#f2b601',
                bg: pencil,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <PieGraph
              data={{
                title: 'This Week',
                data: statisticsData.this_week,
                color: '#f16079',
                bg: check,
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Paper
        className="line__graphHeight"
        sx={{ borderRadius: 2, position: 'relative' }}
      >
        <Backdrop
          open={isChartFetching}
          sx={{
            position: 'absolute',
            zIndex: 3,
            borderRadius: 2,
          }}
        >
          <CircularProgress color="secondary" />
        </Backdrop>
        <LineGraph
          chartData={chartData}
          title={
            filterChartSelectedDropdown.name.includes('Custom')
              ? filterChartSelectedDateRange.replace(/,/g, ' to ')
              : filterChartSelectedDropdown.name
          }
        />
      </Paper>
    </Box>
  );
}
