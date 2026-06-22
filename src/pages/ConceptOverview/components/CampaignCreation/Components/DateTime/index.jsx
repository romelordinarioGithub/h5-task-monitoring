import * as React from 'react';
import PropTypes from 'prop-types';
import { TextField, styled } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    height: 'auto',
    borderRadius: '1em',
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
      boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
    },
  },
});
DateTime.propTypes = {
  setDeliveryDate: PropTypes.func,
  deliveryDate: PropTypes.any,
  label: PropTypes.string,
};
export default function DateTime({ setDeliveryDate, deliveryDate, label }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        required
        label={label}
        PopperProps={{
          placement: 'bottom-end',
        }}
        InputLabelProps={{ shrink: true }}
        renderInput={(props) => (
          <StyledTextField
            InputLabelProps={{ shrink: true }}
            size="large"
            {...props}
          />
        )}
        slotProps={{
          textField: {
            required: true,
          },
        }}
        value={deliveryDate}
        onChange={(newValue) => {
          setDeliveryDate(newValue);
        }}
      />
    </LocalizationProvider>
  );
}
