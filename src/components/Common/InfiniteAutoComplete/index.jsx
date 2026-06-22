import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  FormControl,
  Autocomplete,
  TextField,
  FormHelperText,
  styled,
  ListItem,
} from '@mui/material';

import _ from 'lodash';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { List } from 'react-virtualized';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// const handleNotificationScroll = () => {
//     setHasMore(true);
//     if (!_.isEmpty(list[notificationTab])) {
//       const nextPage = list[notificationTab]?.current_page + 1;

//       if (nextPage <= list[notificationTab]?.last_page) {
//         dispatch(getNotification(notificationTab, nextPage));
//       } else {
//         setHasMore(false);
//       }
//     }
//   };

const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemCount = Array.isArray(children) ? children.length : 0;

  return (
    <Box ref={ref}>
      <Box {...other}>
        <List
          height={300}
          width={480}
          rowHeight={36}
          overscanCount={5}
          rowCount={itemCount}
          rowRenderer={(props) => {
            return React.cloneElement(children[props.index], {
              style: props.style,
            });
          }}
        />
      </Box>
    </Box>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  style: PropTypes.any,
};

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

// const StyledTextField = styled(TextField)({
//   '& .MuiOutlinedInput-root': {
//     '&.Mui-focused fieldset': {
//       borderColor: '#5025c4',
//       boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
//     },
//   },
// });

// const useStyles = makeStyles((theme) => ({
//   label: {
//     fontWeight: 500,
//   },
//   labelContainer: {
//     marginBottom: '0.8rem',
//   },
//   dense: {
//     fontSize: '1rem',
//     height: '48px',
//   },
//   required: {
//     color: theme.palette.error.main,
//   },
//   error: {
//     margin: '0 !important',
//     fontSize: '0.85rem',
//     fontWeight: 300,
//     color: '#323338',
//   },
// }));

export default function InfiniteAutoComplete({
  data,
  name,
  description,
  isRequired,
  onInputChange,
  defaultValue,
  isDisabled,
  isLoading,
  onOpen,
  validation,
  onClose,
  handleScroll,
  onChange,
  mb = 6,
  required = false,
}) {
  return (
    <Box mb={mb}>
      <FormControl fullWidth>
        <StyledAutoComplete
          disableClearable={_.isEmpty(defaultValue) || _.isNull(defaultValue)}
          value={defaultValue ?? ''}
          defaultValue={defaultValue ?? ''}
          renderOption={(props, option) => (
            <ListItem
              {...props}
              key={option.id}
              secondaryAction={
                <Typography variant="caption" color="secondary">
                  {option?.task_type_name}
                </Typography>
              }
            >
              {name === 'Channel'
                ? option.name?.replace('Facebook', 'Meta')
                : option.name}
            </ListItem>
          )}
          getOptionLabel={(option) =>
            name === 'Channel'
              ? option?.name?.replace('Facebook', 'Meta') || ''
              : option?.name || ''
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          size="large"
          onChange={(event, newValue) => onInputChange(event, newValue, name)}
          onInputChange={
            !_.isUndefined(onChange)
              ? (event, newValue) => {
                  onChange(event, newValue);
                }
              : null
          }
          disablePortal
          options={data}
          disabled={Boolean(isDisabled)}
          onOpen={onOpen}
          onClose={onClose}
          loading={isLoading}
          loadingText={'Loading...'}
          //      ListboxComponent={ListboxComponent}
          ListboxProps={{
            onScroll: !_.isUndefined(handleScroll)
              ? (event) => handleScroll(event, name)
              : null,
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select..."
              size="large"
              label={name}
              required={required}
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

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            {isRequired && _.isNull(defaultValue) && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
                <ErrorOutlineIcon
                  color="error"
                  sx={{ fontSize: '1em', mr: '4px' }}
                />
                <Typography variant="body2" color="error">
                  {`Please select ${name} from the list.`}
                </Typography>
              </Box>
            )}
            {validation &&
              defaultValue &&
              name === ('Task Type' || 'Sub Task') && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
                  <InfoOutlinedIcon
                    color="error"
                    sx={{ fontSize: '1em', mr: '4px' }}
                  />
                  <Typography variant="body2" color="error">
                    {`${name} Already Exists. `}
                    <Link
                      to={`/task/${validation}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View here
                    </Link>
                  </Typography>
                </Box>
              )}
          </Box>
          <Box>
            {!_.isEmpty(description) && (
              <FormHelperText sx={{ margin: 0 }} color="primary">
                *{description}
              </FormHelperText>
            )}
          </Box>
        </Stack>
      </FormControl>
    </Box>
  );
}

InfiniteAutoComplete.propTypes = {
  data: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.any,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onOpen: PropTypes.any,
  validation: PropTypes.any,
  onClose: PropTypes.any,
  handleScroll: PropTypes.func,
  onChange: PropTypes.any,
  mb: PropTypes.any,
  required: PropTypes.any,
};
