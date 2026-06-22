import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Button, Stack } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import PropTypes from 'prop-types';

export default function DatePicker({ value, handleUpdateGlobal, popoverType }) {
  const [date, setDate] = useState(
    dayjs(value ?? new Date()).format('YYYY-MM-DD')
  );
  const handleOnClickApply = () => handleUpdateGlobal(`${date}`);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack>
        <StaticDatePicker
          defaultValue={dayjs(value ?? new Date())}
          onChange={(e) => setDate(dayjs(e).format('MM-DD-YYYY'))}
          showToolbar={false}
          className="static-date-picker"
        />
        <Box mt={-4} mr="16px" mb="10px" alignSelf="flex-end">
          <Button onClick={handleOnClickApply} sx={{ fontWeight: 700 }}>
            {popoverType.includes('edit') ? 'Edit' : 'Add'}
          </Button>
        </Box>
      </Stack>
    </LocalizationProvider>
  );
}

DatePicker.propTypes = {
  value: PropTypes.any,
  handleUpdateGlobal: PropTypes.func,
  popoverType: PropTypes.string,
};
