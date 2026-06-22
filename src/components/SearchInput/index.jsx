import React from 'react';

import PropTypes from 'prop-types';
import _ from 'lodash';

import { OutlinedInput, styled, IconButton, Tooltip } from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import ClearIcon from '@mui/icons-material/Clear';

const StyledInputField = styled(OutlinedInput)({
  fontSize: '12px',
  borderRadius: '10px',
  width: '200px',
  height: 'max-content',
  backgroundColor: '#f3f3f5',
  transition: 'background-color 160ms ease, box-shadow 160ms ease',
  input: {
    padding: '7px 8px',
  },
  paddingLeft: '9px',
  '&:hover': {
    backgroundColor: '#ffffff',
  },
  '&.Mui-focused fieldset': {
    border: '1px solid #7c3aed !important',
    boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.14)',
  },
});

export default function SearchInput({ placeholder, onClear, ...props }) {
  return (
    <StyledInputField
      endAdornment={
        !_.isUndefined(onClear) ? (
          <Tooltip
            title="Clear"
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
              onClick={onClear}
              sx={{
                fontSize: '20px',
                color: '#9ca3af',
                marginRight: '-.7em',
                '&:hover': {
                  color: '#7c3aed',
                  backgroundColor: '#ede9fe',
                },
              }}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        ) : null
      }
      startAdornment={
        <SearchTwoToneIcon sx={{ fontSize: '20px', color: '#9ca3af' }} />
      }
      size="small"
      fullWidth
      placeholder={placeholder}
      {...props}
    />
  );
}

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  onClear: PropTypes.func,
};
