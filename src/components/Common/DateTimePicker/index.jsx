import * as React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import _ from 'lodash';

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

export default function DateTimePicker({
  value,
  handleOnChange,
  handleOnClose,
  limit,
  type,
}) {
  const handleOnClosePicker = () => {
    handleOnClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDateTimePicker
        value={value}
        componentsProps={{
          actionBar: {
            actions: [],
          },
        }}
        orientation="landscape"
        maxDateTime={_.isEqual(type, 'time_in') ? Date.parse(moment(limit).subtract(1,'minutes')._d) : null}
        minDateTime={_.isEqual(type, 'time_out') ? Date.parse(moment(limit).add(1,'minutes')._d) : null}
        ampm={false}
        closeOnSelect={true}
        onClose={handleOnClosePicker}
        onChange={handleOnChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

DateTimePicker.propTypes = {
  value: PropTypes.any,
  handleOnChange: PropTypes.func,
  handleOnClose: PropTypes.func,
  limit: PropTypes.any,
  type: PropTypes.any,
};
