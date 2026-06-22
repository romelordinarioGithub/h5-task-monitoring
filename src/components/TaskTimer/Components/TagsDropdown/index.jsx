import { useState } from 'react';

import { styled, ListItem, TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import CheckIcon from '@mui/icons-material/Check';

import { PropTypes } from 'prop-types';
import _ from 'lodash';
// import GlobalPopover from 'components/Common/Popover';

const filterOptions = createFilterOptions();

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
    },
  },
});

const StyledAutocomplete = styled(Autocomplete)({
  width: 'auto',
  '&.MuiListSubheader-root': {
    color: 'rgb(242 32 118)',
    lineHeight: '32px',
    backgroundColor: '#f0f0f0',
  },
  flex: 1,
});

function TagsDropdown({ datasource, onEnter, onClickItem }) {
  const [filter, setFilter] = useState('');

  const filteredDatasource = _.isEmpty(filter)
    ? datasource
    : _.filter(datasource, (data) =>
        data.title?.toLowerCase().includes(filter.toLowerCase())
      );

  return (
    // <Box maxHeight={270}>
    //   <StyledTextField
    //     size="small"
    //     label="Search/Add Tags"
    //     onClick={(e) => {
    //       setPopperAnchorEl(e.currentTarget);
    //       setIsPopperOpen(!isPopperOpen);
    //     }}
    //     onChange={(e) => setFilter(e.target.value)}
    //     onKeyUp={(e) => {
    //       if (e.key.toLowerCase() === 'enter') {
    //         setFilter('');
    //         onEnter(e.target.value);
    //       }
    //     }}
    //   />

    //   <GlobalPopover
    //     sx={{ zIndex: 1 }}
    //     placement="top"
    //     anchorEl={popperAnchorEl}
    //     isOpen={isPopperOpen}
    //     onClose={() => setIsPopperOpen(false)}
    //     content={
    //       <Box maxHeight={270} overflow="auto">
    //         <List dense={true}>
    //           {filteredDatasource.map((data, index) => (
    //             <ListItem
    //               key={index}
    //               component="div"
    //               disablePadding
    //               secondaryAction={
    //                 data.is_selected ? <CheckIcon color="secondary" /> : null
    //               }
    //             >
    //               <ListItemButton onClick={() => onClickItem(data)}>
    //                 <ListItemText primary={data.title} />
    //               </ListItemButton>
    //             </ListItem>
    //           ))}
    //         </List>
    //       </Box>
    //     }
    //   />
    // </Box>
    <StyledAutocomplete
      disablePortal
      loading={false}
      options={filteredDatasource}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) => option.title === value}
      onChange={(_, value) => {
        if (value) onClickItem(value);
      }}
      freeSolo
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          // Prevent's default 'Enter' behavior.
          e.defaultMuiPrevented = true;
          onEnter(e.target.value);
        }
      }}
      renderOption={(props, option) => (
        <ListItem
          {...props}
          key={option.key}
          component="div"
          disablePadding
          secondaryAction={
            option.is_selected ? <CheckIcon color="secondary" /> : null
          }
        >
          {/* <li {...props} key={option.key}>
          {option.title}
        </li> */}
          {option.title}
        </ListItem>
      )}
      filterOptions={(options, params) => {
        const filtered = filterOptions(options, params);

        const { inputValue } = params;
        const isExisting = options.some(
          (option) => inputValue === option.title
        );
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            title: `${inputValue}`,
          });
        }

        return filtered;
      }}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          size="small"
          label="Add tags"
          onChange={(e) => setFilter(e.target.value)}
        />
      )}
    />
  );
}

TagsDropdown.propTypes = {
  datasource: PropTypes.any,
  onEnter: PropTypes.function,
  onClickItem: PropTypes.function,
};

export default TagsDropdown;
