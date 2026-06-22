import PropTypes from 'prop-types';
import React from 'react';

// MUI Component
import {
  Box,
  Typography,
  Stack,
  Autocomplete,
  TextField,
  styled,
  ListItem,
} from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';

import { Link } from 'react-router-dom';

import _ from 'lodash';

const StyledAutoComplete = styled(Autocomplete)`
  & .MuiOutlinedInput-root {
    height: auto !important;
    border-radius: .8em;
    fontSize: '1rem',
    height: '48px',
  }

  & .MuiAutocomplete-popupIndicator {
    display: none;
  }

  & .Mui-disabled {
    background-color: #ececec;
  }

  & .MuiAutocomplete-endAdornment {
    top: calc(50% - 12px);
    right: 15px !important;
  }

  & .MuiAutocomplete-clearIndicator {
    visibility: visible;
    background: #b2b2b2;
    font-size: 13px;
    color: #fff;
    width: 1em;
    height: 1em;
    &:hover {
      background: #949191 !important;
    }
  }
`;

export default function EditBox({
  title,
  link,
  name,
  data,
  defaultValue,
  onInputChange,
  isEdit,
  isLoading,
  isDisabled
}) {

  return (
    <Box>
      {isEdit ? (
        <Stack direction="row" justifyContent="space-between">
            <StyledAutoComplete
              disableClearable={
                _.isEmpty(defaultValue) || _.isNull(defaultValue)
              }
              fullWidth
              value={defaultValue ?? ''}
              defaultValue={defaultValue ?? ''}
              renderOption={(props, option) => (
                <ListItem
                  {...props}
                  key={option.id}
                  secondaryAction={
                    <Typography variant="caption" color="secondary">
                      {option.task_type_name}
                    </Typography>
                  }
                >
                  {option.name}
                </ListItem>
              )}
              disabled={isLoading || isDisabled}
              loading={isLoading}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              size="small"
              onChange={(event, newValue) =>
                onInputChange(event, newValue, name)
              }
              disablePortal
              options={data}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  required={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {isLoading ? (
                          <CircularProgress color="secondary" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
        </Stack>
      ) : (
        <Stack direction="row" justifyContent="space-between">
          {!_.isUndefined(link)?
          <Typography
          sx={{
            ':hover': { color: '#F22076' },
            textDecoration: 'none',
            pt: 1,
            py: 1.15
          }}
          component={Link}
          to={link}
          target="_blank"
        >
          {title}
        </Typography>:
          <Typography py={1.15}>
            {title}
          </Typography>
        }
        </Stack>
      )}
    </Box>
  );
}

EditBox.propTypes = {
  title: PropTypes.any,
  isEdit: PropTypes.any,
  isDisabled: PropTypes.any,
  link: PropTypes.any,
  name: PropTypes.any,
  data: PropTypes.any,
  defaultValue: PropTypes.any,
  onInputChange: PropTypes.any,
  isLoading: PropTypes.any,
  key: PropTypes.any,
};
