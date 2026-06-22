import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { filter_list } from 'pages/TimerSheet/constant';
import { appColors } from 'theme/variables';
import FilterList from 'pages/TimerSheet/components/FilterList';

export default function Filters({
  handleClose,
  options,
  selectedFilterOptions,
  setFilterOptions,
  setSelectedFilterOptions,
  handleApplyFilterData,
  handleClearFilterData,
  timerSheetApplyFilterCooldownEndsAt = 0,
  isLoading,
}) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const cooldownRemainingSeconds = Math.max(
    0,
    Math.ceil((timerSheetApplyFilterCooldownEndsAt - currentTime) / 1000)
  );
  const isApplyFilterDisabled = isLoading || cooldownRemainingSeconds > 0;

  useEffect(() => {
    setCurrentTime(Date.now());

    if (
      !timerSheetApplyFilterCooldownEndsAt ||
      timerSheetApplyFilterCooldownEndsAt <= Date.now()
    ) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      const nextCurrentTime = Date.now();
      setCurrentTime(nextCurrentTime);

      if (timerSheetApplyFilterCooldownEndsAt <= nextCurrentTime) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerSheetApplyFilterCooldownEndsAt]);

  return (
    <Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pl={2}
        py={1}
        pr={1}
      >
        <Box>
          <Typography
            fontWeight={800}
            variant="body2"
            color={appColors.gray}
            sx={{ textTransform: 'uppercase' }}
          >
            Extra Filters
          </Typography>
        </Box>
        <Box>
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: appColors.lightViolet,
                color: '#fff',
              },
            }}
            size="small"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Stack>
      <Divider />
      {filter_list.map((filter, index) => (
        <FilterList
          key={index}
          filter={filter}
          options={options}
          selectedFilterOptions={selectedFilterOptions}
          setFilterOptions={setFilterOptions}
          setSelectedFilterOptions={setSelectedFilterOptions}
        />
      ))}
      <Button
        size="medium"
        variant="contained"
        color="secondary"
        disabled={isApplyFilterDisabled}
        onClick={handleApplyFilterData}
        sx={{
          margin: '10px 15px',
          borderRadius: '7px',
          textTransform: 'none',
          padding: '10px 15px',
        }}
      >
        {cooldownRemainingSeconds > 0
          ? `Apply Filter (${cooldownRemainingSeconds}s)`
          : 'Apply Filter'}
      </Button>
      <Button
        size="medium"
        color="secondary"
        variant="contained"
        disabled={isLoading}
        onClick={handleClearFilterData}
        sx={{
          margin: '10px 15px',
          borderRadius: '7px',
          textTransform: 'none',
          padding: '10px 15px',
        }}
      >
        Clear Filter
      </Button>
    </Stack>
  );
}

Filters.propTypes = {
  handleClose: PropTypes.func,
  handleApplyFilterData: PropTypes.func,
  handleClearFilterData: PropTypes.func,
  timerSheetApplyFilterCooldownEndsAt: PropTypes.number,
  selectedFilterOptions: PropTypes.any,
  setFilterOptions: PropTypes.any,
  setSelectedFilterOptions: PropTypes.any,
  options: PropTypes.any,
  isLoading: PropTypes.boolean,
};
