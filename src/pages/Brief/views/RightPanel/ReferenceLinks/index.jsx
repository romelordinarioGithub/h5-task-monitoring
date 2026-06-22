import React, { useContext } from 'react';

import BriefContext from 'pages/Brief/Context';

import { useOnMount } from 'hooks';
import _ from 'lodash';
import { Box, styled, Typography } from '@mui/material';

import { LoadingButton } from '@mui/lab';

import SearchInput from 'pages/ConceptOverview/components/SearchInput';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import AutoModeTwoToneIcon from '@mui/icons-material/AutoModeTwoTone';
import LinkTwoToneIcon from '@mui/icons-material/LinkTwoTone';

import ReferenceLinkTree from 'pages/Brief/Components/ReferenceLinkTree';

//debounce
let delayDebounceFn;

const StyledLoadingButton = styled(LoadingButton)({
  border: '1px solid #5025c4',
  color: '#5025c4',
  ':hover': {
    backgroundColor: '#5025c4',
    color: '#fff',
    border: '1px solid #5025c4',
  },
});

export default function ReferenceLinks() {
  const {
    referenceLinks,
    onOpenReferenceLink,
    handleDialogOpen,
    handleDeleteReferenceLink,
    handleReferenceLinkTable,
    handleOnChangeCheckbox,
    handleOnChangeSelectAllCheckbox,
    handleGetReferenceLinksLogs,
    fetchReferenceLinks,
    selectedRows,
    searchLink,
    setSearchLink,
  } = useContext(BriefContext);

  const groupMap = new Map();

  referenceLinks?.data?.forEach((item) => {
    const key = item.task_type_name;

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        id: item.id,
        name: item.task_type_name,
        task_type_link: item.task_type_link,
        items: [],
      });
    }

    groupMap.get(key).items.push({
      id: item?.id,
      url: item?.url,
      name: item?.name,
      created_by: item?.created_by,
    });
  });

  let newReference = Array.from(groupMap.values());

  useOnMount(() => {
    onOpenReferenceLink();
  });

  const handleSearch = (value) => {
    setSearchLink(value);
    clearTimeout(delayDebounceFn);
    delayDebounceFn = setTimeout(() => {
      handleReferenceLinkTable(1, 10, value);
    }, 1000);
  };

  const handleOpenReferenceLinksLogs = (id) => {
    handleGetReferenceLinksLogs(id);
    handleDialogOpen(null, 'logs');
  };

  return (
    <Box>
      <Box
        mb="8px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center">
          <SearchInput
            placeholder="Search reference link"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>
        <StyledLoadingButton
          size="small"
          variant="outlined"
          disableElevation
          disableFocusRipple
          sx={{ textTransform: 'initial' }}
          startIcon={<AddTwoToneIcon />}
          loading={false}
          loadingPosition="start"
          onClick={() => handleDialogOpen(null)}
        >
          Add new reference
        </StyledLoadingButton>
      </Box>
      {_.isEmpty(newReference) ? (
        <Box
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          height="calc(100vh - 22em)"
        >
          <LinkTwoToneIcon
            sx={{
              width: '5em',
              height: '5em',
              color: '#9e9e9e',
            }}
          />
          <Typography fontWeight={700} color="#9e9e9e">
            {`No reference link found ${
              _.isEmpty(searchLink) ? 'for this task.' : ''
            }`}
          </Typography>
        </Box>
      ) : (
        <Box>
          {newReference.map((data, index) => (
            <Box key={index}>
              <ReferenceLinkTree
                handleDeleteReferenceLink={handleDeleteReferenceLink}
                handleDialogOpen={handleDialogOpen}
                handleOnChangeCheckbox={handleOnChangeCheckbox}
                handleOnChangeSelectAllCheckbox={
                  handleOnChangeSelectAllCheckbox
                }
                handleOpenReferenceLinksLogs={handleOpenReferenceLinksLogs}
                selectedRows={selectedRows}
                link={data}
              />
            </Box>
          ))}
          {referenceLinks?.total !== referenceLinks?.data?.length && (
            <Box my={1} display="flex" justifyContent="center">
              <LoadingButton
                size="small"
                variant="contained"
                disableElevation
                disableFocusRipple
                sx={{ textTransform: 'initial' }}
                startIcon={<AutoModeTwoToneIcon />}
                loading={fetchReferenceLinks}
                loadingPosition="start"
                onClick={() => {
                  handleReferenceLinkTable(
                    1,
                    Number(referenceLinks?.per_page) + 10,
                    searchLink
                  );
                }}
              >
                Load more links
              </LoadingButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
