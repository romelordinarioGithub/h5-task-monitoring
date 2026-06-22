import React, { useState } from 'react';
// MUI Components
import { Stack, Box, Typography, Tooltip, IconButton } from '@mui/material';
import GlobalDrawer from 'components/Common/Drawer';
import Filters from 'pages/TimerSheet/components/Filters';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import SearchInput from 'components/SearchInput';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// Utilities
import PropTypes from 'prop-types';

export default function Header({
  onSearch,
  optionList,
  handleDownloadCSV,
  handleApplyFilterData,
  handleClearFilterData,
  timerSheetApplyFilterCooldownEndsAt,
  isLoading,
}) {
  const [channel, setChannel] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, setFilter] = useState(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState({});
  const [, setFilterOptions] = useState({});
  const [search, setSearch] = useState('');

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <Stack
        py={2}
        display="flex"
        justifyContent="space-between"
        direction="row"
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h5" fontWeight={800}>
            Tasks
          </Typography>
          <Tooltip
            title="Download CSV"
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
              sx={{ marginLeft: '2px' }}
              onClick={() => {
                handleDownloadCSV();
              }}
            >
              <FileDownloadOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ justifyContent: 'flex-end' }}
        >
          <SearchInput
            placeholder="Search Task/Time Log ID"
            value={search}
            onClear={() => {
              onSearch('');
              setSearch('');
            }}
            onChange={(event) => {
              onSearch(event.target.value);
              setSearch(event.target.value);
            }}
            on="true"
          />
          <Tooltip
            title="Filters"
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
              sx={{ marginLeft: '2px' }}
              onClick={() => {
                setDrawerOpen(true);
                setFilter(true);
              }}
            >
              <FilterAltTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
      <GlobalDrawer
        content={
          <Filters
            handleClose={() => handleDrawerClose()}
            channel={channel}
            options={optionList}
            selectedFilterOptions={selectedFilterOptions}
            setSelectedFilterOptions={setSelectedFilterOptions}
            setFilterOptions={setFilterOptions}
            setChannel={setChannel}
            handleApplyFilterData={handleApplyFilterData}
            handleClearFilterData={handleClearFilterData}
            timerSheetApplyFilterCooldownEndsAt={
              timerSheetApplyFilterCooldownEndsAt
            }
            isLoading={isLoading}
          />
        }
        transitionDuration={{ enter: 350, exit: 300 }}
        name="search"
        width={400}
        isOpen={drawerOpen}
        anchor="right"
        BackdropProps={{
          invisible: true,
        }}
        onClose={handleDrawerClose}
      />
    </>
  );
}

Header.propTypes = {
  onSearch: PropTypes.func,
  onFilter: PropTypes.func,
  handleApplyFilterData: PropTypes.func,
  handleClearFilterData: PropTypes.func,
  timerSheetApplyFilterCooldownEndsAt: PropTypes.number,
  optionList: PropTypes.any,
  handleDownloadCSV: PropTypes.any,
  isLoading: PropTypes.boolean,
};
