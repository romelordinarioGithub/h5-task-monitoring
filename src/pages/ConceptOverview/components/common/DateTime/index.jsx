import React, { useState, memo } from 'react';
import dayjs from 'dayjs';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TimeField } from '@mui/x-date-pickers/TimeField';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import PropTypes from 'prop-types';

function DateTime({ value, handleUpdateGlobal, hasMultipleRowsSelected }) {
  const [date, setDate] = useState(
    dayjs(value ?? new Date()).format('YYYY-MM-DD')
  );
  const [time, setTime] = useState(
    dayjs(value ?? new Date()).format('HH:mm:ss')
  );

  const handleOnClickApply = () => handleUpdateGlobal(`${date} ${time}`);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack>
        <Stack direction="row">
          <Stack>
            <StaticDatePicker
              defaultValue={dayjs(value ?? new Date())}
              onChange={(e) => setDate(dayjs(e).format('YYYY-MM-DD'))}
              showToolbar={false}
              className="static-date-picker"
            />
            <Box mt={-4} mr="16px" mb="10px" alignSelf="flex-end">
              <Button
                disabled={
                  !/^\d{2}:\d{2}:\d{2}$/.test(time) ||
                  (date === dayjs(value ?? new Date()).format('YYYY-MM-DD') &&
                    time === dayjs(value ?? new Date()).format('HH:mm:ss'))
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
                Time
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
        {hasMultipleRowsSelected && (
          <Alert
            icon={false}
            severity="info"
            sx={{
              display: 'flex',
              padding: '0px 6px',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '0.75em',
            }}
          >
            Multiple rows selected
          </Alert>
        )}
      </Stack>
    </LocalizationProvider>
  );
}

export default memo(DateTime, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});

DateTime.propTypes = {
  value: PropTypes.any,
  handleUpdateGlobal: PropTypes.func,
  hasMultipleRowsSelected: PropTypes.bool,
};
