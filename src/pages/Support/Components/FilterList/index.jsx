import React, { useEffect } from 'react';

import {
  Box,
  Typography,
  Card,
  Stack,
  TextField,
  Autocomplete,
} from '@mui/material';
import PropTypes from 'prop-types';
import { appColors } from 'theme/variables';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

export default function FilterList({ filter, datasource, onFilterChange }) {
  useEffect(() => {}, []);

  function getDatasourceBySlug(slug) {
    switch (slug) {
      case 'tags':
        return datasource.tags?.map((d) => ({ key: d.id, label: d.name }));
      case 'priorities':
        return datasource.priorities?.map((d) => ({
          key: d.priorityid,
          label: d.name,
        }));
      case 'departments':
        return datasource.departments?.map((d) => ({
          key: d.id,
          label: d.name,
        }));
      case 'services':
        return datasource.services?.map((d) => ({
          key: d.serviceid,
          label: d.name,
        }));
      case 'assigned_by':
        return datasource.users?.map((d) => ({
          key: d.id,
          label: d.name,
        }));
      case 'status':
        return datasource.status?.map((d) => ({
          key: d.id,
          label: d.name,
        }));
      default:
        return [];
    }
  }

  switch (filter?.type) {
    case 'multiselect':
      return (
        <Box pl={2} pr={2} pb={1}>
          <Typography fontWeight={700} color={appColors.lightViolet}>
            {filter?.name}
          </Typography>
          <Stack>
            <Autocomplete
              freeSolo
              sx={{
                '& .MuiOutlinedInput-input ': {
                  padding: '1px 0px !important',
                },
              }}
              multiple
              options={getDatasourceBySlug(filter?.slug)}
              onChange={(_, value) => onFilterChange(filter, value)}
              getOptionLabel={(option) => option.label || ''}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.key}>
                    {option.label}
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </Box>
      );

    default:
      return (
        <Box pl={2} pr={2} pb={1}>
          <Typography fontWeight={700} color={appColors.lightViolet}>
            {filter?.name}
          </Typography>
          <Card variant="outlined">
            <Stack p={2}></Stack>
          </Card>
        </Box>
      );
  }
}

FilterList.propTypes = {
  filter: PropTypes.any,
  datasource: PropTypes.any,
  onFilterChange: PropTypes.func,
};
