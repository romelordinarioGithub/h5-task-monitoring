import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, Box, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { filter_list } from 'pages/Support/constant';
import { appColors } from 'theme/variables';
import FilterList from 'pages/Support/Components/FilterList';

export default function Filters({ datasource, onClose, onFilterChange }) {
  const [selectedFilters, setSelectedFilters] = useState({
    departments: [],
    services: [],
    assigned_by: [],
    status: [],
    priorities: [],
    tags: [],
  });

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters]);

  function handleFilterChange(filter, selectedValues) {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter.slug]: selectedValues,
    }));
  }

  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pl={2}
        py={1}
        pr={1}
      >
        <Box>
          <Typography
            fontWeight={800}
            variant="body2"
            color={appColors.gray}
            sx={{ textTransform: 'uppercase' }}
          >
            Extra Filters
          </Typography>
        </Box>
        <Box>
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: appColors.lightViolet,
                color: '#fff',
              },
            }}
            size="small"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Stack>
      <Divider />

      {filter_list.map((filter, index) => (
        <FilterList
          key={index}
          filter={filter}
          datasource={datasource}
          onFilterChange={handleFilterChange}
        />
      ))}

      {/* <Button
        size="medium"

        sx={{
          margin: '10px 15px',
          borderRadius: '7px',
          color: 'white',
          background: '#F22076',
          textTransform: 'none',
          padding: '10px 15px',

        }}
      >
        Apply
      </Button> */}
    </Stack>
  );
}

Filters.propTypes = {
  datasource: PropTypes.any,
  onClose: PropTypes.func,
  onFilterChange: PropTypes.func,
};
