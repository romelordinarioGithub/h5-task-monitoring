import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  styled,
  TableContainer,
  Typography,
  Paper,
  TablePagination,
  Badge,
  Tooltip,
  IconButton,
  Backdrop,
  CircularProgress,
  Fade,
} from '@mui/material';
import DashboardContext from 'pages/Dashboard/context';
import SearchInput from 'components/SearchInput';
import Sidebar from 'pages/Dashboard/components/Sidebar';
import AutoModeTwoToneIcon from '@mui/icons-material/AutoModeTwoTone';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import pie from 'assets/icons/pie.svg';
import line from 'assets/icons/line.svg';
import bar from 'assets/icons/bar.svg';
import dot from 'assets/icons/dot.svg';
import _ from 'lodash';
import DashboardTable from '../DashboardTable';

const StyledCard = styled(Card)({
  minHeight: 112,
  padding: '18px 20px',
  borderRadius: '22px',
  border: '1px solid rgba(255, 255, 255, 0.66)',
  boxShadow: '0 22px 50px -34px rgba(15, 23, 42, 0.75)',
  overflow: 'hidden',
  position: 'relative',
  backdropFilter: 'blur(12px)',
  '&::after': {
    position: 'absolute',
    top: -38,
    right: -34,
    width: 96,
    height: 96,
    content: '""',
    borderRadius: '999px',
    background: 'rgba(255,255,255,.18)',
  },
});

const StyledPaper = styled(Paper)({
  borderRadius: '16px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  boxShadow: '0 1px 4px rgba(124, 58, 237, 0.07)',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
});

export default function Main() {
  const urlParams = new URLSearchParams(location.search);
  const queue = urlParams.get('queue');

  const {
    team_id,
    statusCount,
    dashboard: { all_tasks },
    state,
    defaultProps,
    handlePaginationPageChange,
    handlePaginationRowPageChange,
    handleSearch,
    handleRepullDashboard,
    fetchRepullDashboard,
    handleDialog,
    page,
    counter,
    selectedRows,
    handleDownloadTable,
    handleResetFilters,
    // queue,
  } = useContext(DashboardContext);

  const isSaasQueue = queue === 'saas-support';
  const isTicketView = team_id === 11 || team_id === 21 || isSaasQueue;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleOnClickSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 56px)',
        background:
          'radial-gradient(circle at 15% -10%, rgba(124,58,237,.14), transparent 30rem), #f3f5fb',
      }}
    >
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
              backgroundColor: '#090b1d',
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
      <Grid container height="inherit">
        <Fade in={isSidebarOpen}>
          <Grid
            item
            xs={2.3}
            display={isSidebarOpen ? 'block' : 'none'}
            sx={{
              borderRight: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
            }}
          >
            <Sidebar onClickClose={handleOnClickSidebarToggle} />
          </Grid>
        </Fade>
        <Grid
          item
          p={2.5}
          xs={isSidebarOpen ? 9.7 : 12}
          sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.08)' }}
        >
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <StyledCard
                  sx={{
                    background:
                      'linear-gradient(135deg, #64748b 0%, #334155 100%)',
                    color: '#fff',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(${pie})`,
                    backgroundSize: '74px',
                    backgroundPosition: 'right',
                    backgroundPositionX: '9em',
                    backgroundPositionY: '0.8em',
                  }}
                >
                  <Typography
                    variant="button"
                    fontWeight={700}
                    textTransform="capitalize"
                    noWrap
                  >
                    Not Started
                  </Typography>

                  <Typography variant="h4" fontWeight={800}>
                    {_.isEmpty(statusCount) ? 0 : statusCount?.not_started}
                  </Typography>
                </StyledCard>
              </Grid>
              <Grid item xs={3}>
                <StyledCard
                  sx={{
                    background:
                      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#fff',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(${line})`,
                    backgroundSize: '74px',
                    backgroundPosition: 'right',
                    backgroundPositionX: '9em',
                    backgroundPositionY: '0.8em',
                  }}
                >
                  <Typography
                    variant="button"
                    fontWeight={700}
                    textTransform="capitalize"
                    noWrap
                  >
                    In Progress
                  </Typography>

                  <Typography variant="h4" fontWeight={800}>
                    {_.isEmpty(statusCount) ? 0 : statusCount?.in_progress}
                  </Typography>
                </StyledCard>
              </Grid>
              <Grid item xs={3}>
                <StyledCard
                  sx={{
                    background:
                      'linear-gradient(135deg, #17a2b8 0%, #0e7490 100%)',
                    color: '#fff',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(${dot})`,
                    backgroundSize: '74px',
                    backgroundPosition: 'right',
                    backgroundPositionX: '9em',
                    backgroundPositionY: '0.8em',
                  }}
                >
                  <Typography
                    variant="button"
                    fontWeight={700}
                    textTransform="capitalize"
                    noWrap
                  >
                    Awaiting Feedback
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    {_.isEmpty(statusCount)
                      ? 0
                      : statusCount?.awaiting_feedback}
                  </Typography>
                </StyledCard>
              </Grid>
              <Grid item xs={3}>
                <StyledCard
                  sx={{
                    background:
                      'linear-gradient(135deg, #ec5aa6 0%, #db2777 100%)',
                    color: '#fff',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(${bar})`,
                    backgroundSize: '74px',
                    backgroundPosition: 'right',
                    backgroundPositionX: '9em',
                    backgroundPositionY: '0.8em',
                  }}
                >
                  <Typography
                    variant="button"
                    fontWeight={700}
                    textTransform="capitalize"
                    noWrap
                  >
                    On-Hold
                  </Typography>
                  <Typography variant="h4" fontWeight={800}>
                    {_.isEmpty(statusCount) ? 0 : statusCount?.on_hold}
                  </Typography>
                </StyledCard>
              </Grid>
            </Grid>
          </Box>
          <Box
            p={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography variant="h6" fontWeight={800}>
                {queue === 'briefs'
                  ? 'Briefs'
                  : isTicketView
                  ? 'Tickets'
                  : 'Task'}
              </Typography>
              <Tooltip
                title="Reload table"
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
                <IconButton size="small" onClick={handleRepullDashboard}>
                  <Badge
                    badgeContent={counter}
                    color="secondary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '8px',
                        padding: 0,
                        height: '13px',
                        top: '8px',
                        left: '9px',
                      },
                    }}
                  >
                    <AutoModeTwoToneIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {/* <Tooltip
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
                  sx={{ marginRight: '2px' }}
                  onClick={(e) => handlePopover(e, 'table_filter')}
                >
                  {!_.isMatch(defaultProps?.filter, state?.filter) ? (
                    <Badge color="warning" variant="dot">
                      <FilterAltTwoToneIcon />
                    </Badge>
                  ) : (
                    <FilterAltTwoToneIcon />
                  )}
                </IconButton>
              </Tooltip> */}

              <Tooltip
                title="Advance Filters"
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
                  sx={{ marginRight: '2px' }}
                  onClick={() => handleDialog(null, 'advance_filters')}
                >
                  {queue === 'briefs' ? (
                    !_.isMatch(
                      _.omit(defaultProps?.brief, ['sort']),
                      _.omit(state?.brief, ['sort'])
                    ) ? (
                      <Badge color="warning" variant="dot">
                        <FilterAltIcon />
                      </Badge>
                    ) : (
                      <FilterAltIcon />
                    )
                  ) : !_.isMatch(defaultProps?.filter, state?.filter) ? (
                    <Badge color="warning" variant="dot">
                      <FilterAltIcon />
                    </Badge>
                  ) : (
                    <FilterAltIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Reset Filters"
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
                  sx={{ marginRight: '2px' }}
                  color="danger"
                  onClick={() => handleResetFilters()}
                >
                  <RestartAltOutlinedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title="Download"
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
                  sx={{ marginRight: '2px' }}
                  onClick={handleDownloadTable}
                >
                  <BrowserUpdatedIcon />
                </IconButton>
              </Tooltip>
              <SearchInput
                placeholder={`Search ${
                  queue === 'briefs'
                    ? 'Briefs'
                    : isTicketView
                    ? 'Tickets'
                    : 'Task'
                }
                `}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Box>
          </Box>
          {!_.isEmpty(state?.filter) && (
            <Box>
              <StyledPaper sx={{ position: 'relative' }}>
                <Backdrop
                  isSidebarOpen={fetchRepullDashboard}
                  sx={{
                    position: 'absolute',
                    zIndex: 3,
                  }}
                >
                  <CircularProgress color="secondary" />
                </Backdrop>
                <TableContainer
                  sx={{
                    maxHeight: 'calc(100vh - 20.5em)',
                    minHeight: 'calc(100vh - 20.5em)',
                  }}
                >
                  <DashboardTable />
                </TableContainer>
                {!_.isEmpty(selectedRows) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '15px',
                    }}
                  >
                    <Typography fontSize="0.9em" color="primary">
                      <b>{selectedRows.length}</b> rows selected
                    </Typography>
                  </Box>
                )}
                <TablePagination
                  sx={{
                    borderTop: '1px solid #ececec',
                  }}
                  component="div"
                  count={Number(all_tasks?.total ?? 0)}
                  page={page}
                  onPageChange={handlePaginationPageChange}
                  rowsPerPageOptions={[20, 50, 100, 150, 200]}
                  rowsPerPage={Number(all_tasks?.per_page ?? 0)}
                  onRowsPerPageChange={handlePaginationRowPageChange}
                />
              </StyledPaper>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
