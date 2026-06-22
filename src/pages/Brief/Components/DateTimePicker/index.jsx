import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Button, Stack, Typography } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TimeField } from '@mui/x-date-pickers/TimeField';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import PropTypes from 'prop-types';
import _ from 'lodash';

export default function DateTimerPicker({
  type,
  taskId,
  handleSave,
  isParent,
  handleClose,
  selected,
  limit,
}) {
  const [date, setDate] = useState(
    dayjs(selected ?? new Date()).format('YYYY-MM-DD')
  );
  const [time, setTime] = useState(
    dayjs(selected ?? new Date()).format('HH:mm:ss')
  );

  const handleOnClickApply = () => {
    handleSave({
      id: taskId,
      key: type,
      value: dayjs(`${date} ${time}`).format('YYYY-MM-DD HH:mm:ss'),
    });
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row">
        <Stack>
          <StaticDatePicker
            defaultValue={dayjs(selected ?? new Date())}
            onChange={(e) => setDate(dayjs(e).format('YYYY-MM-DD'))}
            showToolbar={false}
            className="static-date-picker"
          />
          <Box mt={-4} mr="16px" mb="10px" alignSelf="flex-end">
            <Button
              disabled={
                !/^\d{2}:\d{2}:\d{2}$/.test(time) ||
                (date === dayjs(selected ?? new Date()).format('YYYY-MM-DD') &&
                  time === dayjs(selected ?? new Date()).format('HH:mm:ss'))
              }
              onClick={handleOnClickApply}
              sx={{ fontWeight: 700 }}
            >
              Apply
            </Button>
          </Box>
        </Stack>
        <Box borderLeft="1px solid #ececec">
          <Box p={1} borderBottom="1px solid #ececec">
            <Typography variant="caption" fontWeight={700}>
              Set {_.startCase(type.replace(/_/g, ' '))}
            </Typography>
            <Box>
              <TimeField
                size="small"
                label="HH:MM:SS"
                value={time ? dayjs(`${date} ${time}`) : null}
                onChange={(newValue) =>
                  setTime(newValue ? newValue.format('HH:mm:ss') : '')
                }
                format="HH:mm:ss"
                sx={{
                  marginTop: 1,
                  width: 150,
                  '& .MuiOutlinedInput-root fieldset': {
                    textAlign: 'center',
                  },
                  '& .MuiInputLabel-root': {
                    left: '50%',
                    transform: 'translate(-37%, -7px) scale(0.75)',
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    fontWeight: 'bold',
                  },
                }}
                slotProps={{
                  textField: {
                    InputProps: {
                      sx: {
                        '& input': {
                          textAlign: 'center',
                        },
                      },
                    },
                  },
                }}
                ampm={false}
              />
            </Box>
          </Box>
          <MultiSectionDigitalClock
            timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
            views={['hours', 'minutes', 'seconds']}
            ampm={false}
            value={dayjs(`${date} ${time}` ?? new Date())}
            onChange={(e) => setTime(dayjs(e).format('HH:mm:ss'))}
            className="static-time-picker"
            sx={{ height: 260 }}
          />
        </Box>
      </Stack>
    </LocalizationProvider>
  );
}

DateTimerPicker.propTypes = {
  type: PropTypes.string,
  taskId: PropTypes.any,
  selected: PropTypes.any,
  handleSave: PropTypes.func,
  handleClose: PropTypes.func,
  limit: PropTypes.any,
  isParent: PropTypes.any,
};
