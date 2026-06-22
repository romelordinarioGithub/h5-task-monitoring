import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Button, Stack, Typography, TextField } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TimeField } from '@mui/x-date-pickers/TimeField';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import PropTypes from 'prop-types';
import _ from 'lodash';

export default function TimerDateTimePicker({
  type,
  taskId,
  isParent,
  handleSave,
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

  //Check limit date
  const handleCheckLimitDate = () => {
    switch (type) {
      case 'date_started':
      case 'start_date':
      case 'preset_time_in':
      case 'time_in':
        if (dayjs(limit).diff(dayjs(`${date} ${time}`), 'seconds') >= 86400)
          return 'Reset';
        else if (new Date(`${date} ${time}`) < new Date(limit)) return 'Apply';
        else return null;
      case 'date_ended':
      case 'end_date':
      case 'preset_time_out':
      case 'time_out':
        if (dayjs(`${date} ${time}`).diff(dayjs(limit), 'seconds') >= 86400)
          return 'Reset';
        else if (new Date(`${date} ${time}`) > new Date(limit)) return 'Apply';
        else return null;
      default:
        return null;
    }
  };

  const handleOnClickApply = () => {
    switch (type) {
      case 'date_started':
      case 'date_ended':
        handleSave({
          id: taskId,
          key: type,
          is_parent: isParent,
          value:
            handleCheckLimitDate() == 'Reset'
              ? dayjs(`${date} 23:59:59`).format('MM/DD/YYYY hh:mm:ss A')
              : dayjs(`${date} ${time}`).format('MM/DD/YYYY hh:mm:ss A'),
          limit:
            handleCheckLimitDate() == 'Reset'
              ? dayjs(`${date} 23:59:59`).format('MM/DD/YYYY hh:mm:ss A')
              : dayjs(limit).format('MM/DD/YYYY hh:mm:ss A'),
        });
        break;
      default:
        handleSave(
          type,
          handleCheckLimitDate() == 'Reset'
            ? dayjs(`${date} 23:59:59`).format('MM/DD/YYYY hh:mm:ss A')
            : dayjs(`${date} ${time}`).format('MM/DD/YYYY hh:mm:ss A'),
          handleCheckLimitDate() == 'Reset'
            ? dayjs(`${date} 23:59:59`).format('MM/DD/YYYY hh:mm:ss A')
            : dayjs(limit).format('MM/DD/YYYY hh:mm:ss A')
        );
        break;
    }

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
            // value={Date.parse(selected)}
            maxDate={
              _.isEqual(type, 'date_started') || _.includes(type, 'time_in')
                ? dayjs(limit ?? new Date())
                : null
            }
            minDate={
              _.isEqual(type, 'date_ended') || _.includes(type, 'time_out')
                ? dayjs(limit ?? new Date())
                : null
            }
            className="static-date-picker"
          />
          <Box mt={-3} mr="16px" mb="10px" alignSelf="flex-end">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: 275 }}
            >
              <Typography
                sx={{ fontSize: '.8em' }}
                mt={0.3}
                color="error"
                textAlign="Right"
              >
                {handleCheckLimitDate() == 'Reset'
                  ? 'Time will be reset to 23:59:59'
                  : _.isNull(handleCheckLimitDate()) &&
                    (type.includes('started') || type.includes('time_in'))
                  ? 'Select earlier time in'
                  : _.isNull(handleCheckLimitDate()) &&
                    (type.includes('ended') || type.includes('time_out'))
                  ? 'Select late time out'
                  : null}
              </Typography>
              <Button
                disabled={
                  !/^\d{2}:\d{2}:\d{2}$/.test(time) ||
                  (date ===
                    dayjs(selected ?? new Date()).format('YYYY-MM-DD') &&
                    time ===
                      dayjs(selected ?? new Date()).format('HH:mm:ss')) ||
                  _.isNull(handleCheckLimitDate())
                }
                onClick={handleOnClickApply}
                sx={{ fontWeight: 700 }}
              >
                {handleCheckLimitDate() == null
                  ? 'Apply'
                  : handleCheckLimitDate()}
              </Button>
            </Stack>
          </Box>
        </Stack>
        <Box borderLeft="1px solid #ececec">
          <Box p={1} borderBottom="1px solid #ececec">
            <Typography variant="caption" fontWeight={700}>
              {_.includes(type, 'time_in') || type == 'date_started'
                ? 'Set Time-in'
                : 'Set Time-out'}
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
                          textAlign: 'center', // Centers the actual input value and placeholder
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
            maxTime={
              dayjs(limit).isSame(date, 'day') &&
              (_.isEqual(type, 'date_started') || _.includes(type, 'time_in'))
                ? dayjs(limit ?? new Date())
                : null
            }
            minTime={
              dayjs(limit).isSame(date, 'day') &&
              (_.isEqual(type, 'date_ended') || _.includes(type, 'time_out'))
                ? dayjs(limit ?? new Date())
                : null
            }
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

TimerDateTimePicker.propTypes = {
  type: PropTypes.string,
  taskId: PropTypes.any,
  selected: PropTypes.any,
  handleSave: PropTypes.func,
  handleClose: PropTypes.func,
  limit: PropTypes.any,
  isParent: PropTypes.any,
};
