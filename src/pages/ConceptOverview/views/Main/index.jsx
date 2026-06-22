import React, { useContext, useState, useEffect } from 'react';
import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  OutlinedInput,
  Stack,
  Typography,
  styled,
  Badge,
} from '@mui/material';
import _ from 'lodash';
// pages
import Sidebar from 'pages/ConceptOverview/components/Sidebar';
import ConceptOverviewContext from 'pages/ConceptOverview/context';
import ConceptSpecific from 'pages/ConceptOverview/views/ConceptSpecific';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import ReportTwoToneIcon from '@mui/icons-material/ReportTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import DangerousTwoToneIcon from '@mui/icons-material/DangerousTwoTone';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfiniteScroll from 'react-infinite-scroll-component';

const StyledBox = styled(Box)({
  minHeight: 'calc(100vh - 56px)',
  lineHeight: 'normal',
  display: 'flex',
});

const StyledInputField = styled(OutlinedInput)({
  fontSize: '12px',
  borderRadius: '12px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  color: '#ffffff',
  //   paddingLeft: 15,

  '&.Mui-focused fieldset': {
    border: '1px solid rgba(167,139,250,.75) !important',
    boxShadow: '0 0 0 4px rgba(124,58,237,.2)',
  },
  '& input::placeholder': {
    color: 'rgba(255,255,255,.45)',
    opacity: 1,
  },
});

const StyledIconButton = styled(IconButton)({
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'rgba(255,255,255,0.78)',
  backgroundColor: 'rgba(255,255,255,0.08)',
  ':hover': {
    backgroundColor: '#7c3aed',
    color: '#fff',
  },
});

export default function Main() {
  const [hasMore, setHasMore] = useState(true);
  const [searchConcept, setSearchConcept] = useState(null);

  const {
    conceptList,
    conceptOverview,
    conceptListFilters,
    openConceptFilter,
    onSearchConceptList,
    onOpenConceptListFilter,
    onScrollToLastItem,
    errorConceptOverview,
    fetchSyncConcept,
    handleOnClickSidebarToggle,
    isSidebarOpen,
  } = useContext(ConceptOverviewContext);

  const filters = {
    name: '',
    partnerGroups: [],
    members: [],
    statuses: [],
    dateDelivered: [],
    dateCreated: [],
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      !_.isNull(searchConcept) && onSearchConceptList(searchConcept);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchConcept]);

  useEffect(() => {
    fetchSyncConcept && setSearchConcept('');
  }, [fetchSyncConcept]);

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      {!isSidebarOpen && (
        <Fade in={!isSidebarOpen}>
          <Button
            onClick={handleOnClickSidebarToggle}
            sx={{
              position: 'absolute',
              top: '45vh',
              left: -7,
              height: '50px !important',
              minWidth: '10px !important',
              backgroundColor: '#1e0032',
              borderTopRightRadius: 25,
              borderBottomRightRadius: 25,
              '&:hover': {
                left: -2,
                backgroundColor: '#090b1d',
              },
              zIndex: '1',
            }}
          >
            <ArrowForwardIosIcon sx={{ color: 'white' }} />
          </Button>
        </Fade>
      )}
      <Fade in={isSidebarOpen}>
        <StyledBox
          sx={{
            position: 'fixed',
            height: '100vh',
            width: '280px',
            background:
              'linear-gradient(180deg, #101326 0%, #080a18 62%, #0d1022 100%)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 2,
            boxShadow: '18px 0 46px -38px rgba(8,10,24,.95)',
          }}
        >
          <Backdrop
            open={fetchSyncConcept}
            sx={{ position: 'absolute', zIndex: 2 }}
          >
            <CircularProgress color="secondary" />
          </Backdrop>
          <Box
            sx={{
              padding: '1em',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography
                fontSize="15px"
                fontWeight={800}
                lineHeight="normal"
                color="#ffffff"
              >
                Projects
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleOnClickSidebarToggle}
                sx={{ color: 'rgba(255,255,255,0.62)' }}
              >
                <CloseIcon sx={{ fontSize: '18px' }} />
              </IconButton>
            </Stack>
            <Box display="flex" justifyContent="center">
              <StyledInputField
                size="small"
                fullWidth
                autoComplete="off"
                placeholder="Search concept"
                onChange={(e) => setSearchConcept(e.target.value)}
              />
              {!_.isMatch(filters, conceptListFilters) ? (
                <Badge color="warning" variant="dot">
                  <StyledIconButton
                    sx={{ marginLeft: '4px' }}
                    onClick={onOpenConceptListFilter}
                  >
                    {!openConceptFilter ? (
                      <TuneOutlinedIcon />
                    ) : (
                      <CloseTwoToneIcon />
                    )}
                  </StyledIconButton>
                </Badge>
              ) : (
                <StyledIconButton
                  sx={{ marginLeft: '4px' }}
                  onClick={onOpenConceptListFilter}
                >
                  {!openConceptFilter ? (
                    <TuneOutlinedIcon />
                  ) : (
                    <CloseTwoToneIcon />
                  )}
                </StyledIconButton>
              )}
            </Box>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          <Box
            id="scrollable-container"
            height="calc(100vh - 6.7em)"
            overflow="auto"
          >
            {_.isEmpty(conceptList?.data) ? (
              <Box
                m={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                textAlign="center"
              >
                <Box>
                  <ReportTwoToneIcon
                    sx={{
                      width: '5em',
                      height: '5em',
                      color: ' #FFC107',
                    }}
                  />
                </Box>
                <Box>
                  <Typography fontWeight={700}>No concept found.</Typography>
                  <Typography variant="caption" color="#949494">
                    Make sure the concept name is correct.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <InfiniteScroll
                dataLength={
                  _.isEmpty(conceptList) ? 0 : conceptList?.data?.length
                }
                hasMore={hasMore}
                next={() => {
                  onScrollToLastItem(() => {
                    setHasMore(false);
                  });
                }}
                loader={<></>}
                endMessage={<></>}
                scrollableTarget="scrollable-container"
              >
                <Sidebar />
              </InfiniteScroll>
            )}
          </Box>
        </StyledBox>
      </Fade>
      <StyledBox
        sx={{
          marginLeft: isSidebarOpen ? '280px' : 0,
          overflow: 'hidden',
        }}
      >
        {!_.isEmpty(errorConceptOverview?.message) && (
          <Box
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            height="calc(100vh - 6em)"
            width="-webkit-fill-available"
          >
            <DangerousTwoToneIcon
              sx={{
                width: '10em',
                height: '10em',
                color: '#f16079',
              }}
            />
            <Typography fontWeight={700} variant="h4">
              Concept not available
            </Typography>
            <Typography color="#949494">
              If it&lsquo;s newly created in the platform, Try re-pulling the
              concept manually in the filters and action.
            </Typography>
          </Box>
        )}
        {!_.isEmpty(conceptOverview) && <ConceptSpecific />}
      </StyledBox>
    </Box>
  );
}
