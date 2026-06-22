import { TextField, Autocomplete, styled } from '@mui/material';

import PropTypes from 'prop-types';

const StyledTextField = styled(TextField)({
  // '& .MuiOutlinedInput-root': { backgroundColor: 'transparent' },
  // '& .MuiOutlinedInput-notchedOutline': {
  //   border: 0,
  // },
});

export default function Input({
  data,
  placeholder,
  onSelectionChange,
  ...props
}) {
  const loading = data.length === 0;

  return (
    <Autocomplete
      disablePortal
      disableClearable={true}
      freeSolo
      sx={{
        width: 'auto',
        '&.MuiListSubheader-root': {
          color: 'rgb(242 32 118)',
          lineHeight: '32px',
          backgroundColor: '#f0f0f0',
        },
        '& .MuiAutocomplete-inputRoot .Mui-disabled ': {
          WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)',
        },
        flex: 1,
      }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      groupBy={(option) => option.task_type_name}
      getOptionLabel={(option) => option.name ?? ''}
      onChange={(_, value) => onSelectionChange(value)}
      options={[...data]}
      loading={loading}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          size="small"
          placeholder={placeholder}
          label="Task"
          InputProps={{
            ...params.InputProps,
            // endAdornment: (
            //   <Fragment>
            //     {loading ? (
            //       <CircularProgress color="inherit" size={20} />
            //     ) : null}
            //     {params.InputProps.endAdornment}
            //   </Fragment>
            // ),
          }}
        />
      )}
      {...props}
    />
  );
}

Input.propTypes = {
  data: PropTypes.any,
  placeholder: PropTypes.string,
  onSelectionChange: PropTypes.any,
};
