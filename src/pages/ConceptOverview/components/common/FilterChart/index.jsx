import React from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem, FormControl } from '@mui/material';

const FilterChart = ({ dropdowns, onDropdownChange, value, ...props }) => {
  return (
    <FormControl>
      <Select
        onChange={(e) => {
          onDropdownChange(e.target.value);
        }}
        value={value}
        defaultValue={{ name: 'Weekly' }}
        size="small"
        {...props}
      >
        {dropdowns?.map((data, index) => (
          <MenuItem key={index} value={data}>
            {data}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

FilterChart.propTypes = {
  dropdowns: PropTypes.any,
  onDropdownChange: PropTypes.any,
  value: PropTypes.any,
};

export default FilterChart;
