import React, { useContext } from 'react';
import _ from 'lodash';

import { useLocation, Link } from 'react-router-dom';

import {
  Box,
  Typography,
  Button,
  styled,
  Chip,
  Card,
  Divider,
  Avatar,
  Grid,
  Stack,
  IconButton,
  LinearProgress,
} from '@mui/material';

import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import DashboardContext from 'pages/Dashboard/context';
import { sideNavigation, sideTicketNavigation } from 'pages/Dashboard/constant';
import { stringAvatar } from 'hooks';

import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone';
import TimerOffTwoToneIcon from '@mui/icons-material/TimerOffTwoTone';

const StyledButton = styled(Button)({
  textTransform: 'capitalize',
  color: '#6b7280',
  fontWeight: 600,
  borderRadius: '8px',
  justifyContent: 'flex-start',
  ':hover': {
    backgroundColor: '#f5f3ff',
    color: '#7c3aed',
  },
});

export default function Sidebar({ onClickClose }) {
  const location = useLocation();

  const {
    tab,
    dashboard,
    resources,
    totalTime,
    team_id,
    handlePaginationResources,
  } = useContext(DashboardContext);

  let resourcesData = resources?.data?.slice()?.sort((a, b) => {
    if (a?.region < b?.region) return -1;

    if (a?.region > b?.region) return 1;

    return 0;
  });

  const generateResourceProgressColor = (progress) => {
    if (progress < 60) {
      return '#b0b0b0';
    } else if (progress < 80) {
      return '#2ecc71';
    } else if (progress >= 80 && progress < 90) {
      return '#f39c12';
    } else {
      return '#F2445C';
    }
  };

  const parseResourceProgress = (progress) => progress.match(/[\d.]+/);

  return (
    <Box
      id="scrollable-container"
      sx={{
        overflowY: 'scroll',
        height: 'calc(100vh - 56px)',
        backgroundColor: '#ffffff',
        borderRight: '1px solid rgba(0,0,0,.08)',
      }}
    >
      <Stack p={2} direction="row" justifyContent="space-between">
        <Stack direction="row" alignItems="center">
          <Box
            sx={{
              display: 'flex',
              backgroundColor: '#ede9fe',
              borderRadius: '10px',
              boxShadow: '0 1px 4px rgba(124, 58, 237, 0.07)',
            }}
            px={1.5}
            py={1.3}
            mr={1}
          >
            <GridViewTwoToneIcon color="secondary" />
          </Box>
          <Typography fontWeight={800} variant="h6">
            Summary
          </Typography>
        </Stack>
        <IconButton aria-label="close" onClick={onClickClose}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </Stack>

      <Stack display="flex">
        {/* Summary */}
        <Box px={3} mb={3}>
          {/* <Typography variant="h6" fontWeight={800} mb={1}>
            Summary
          </Typography> */}
          <Card
            elevation={0}
            sx={{
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 1px 4px rgba(124, 58, 237, 0.07)',
            }}
          >
            <Box
              p={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Typography variant="button" fontSize="0.65em" fontWeight={800}>
                This week&apos;s Timelog
              </Typography>
              <Box>
                <Typography fontSize="2.5em" fontWeight={800}>
                  {_.isEmpty(totalTime)
                    ? '00:00:00'
                    : totalTime?.user_this_week_total_time}
                </Typography>
              </Box>
            </Box>

            <Box
              py={2}
              px={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              borderTop="1px solid rgba(0, 0, 0, 0.1)"
              borderBottom="1px solid rgba(0, 0, 0, 0.1)"
            >
              <Typography variant="button" fontSize="0.65em" fontWeight={800}>
                Team time log
              </Typography>
              <Box>
                <Typography fontSize="2em" fontWeight={800}>
                  {_.isEmpty(totalTime)
                    ? '00:00:00'
                    : totalTime?.team_this_week_total_time}
                </Typography>
              </Box>
            </Box>

            <Grid container>
              <Grid
                item
                md={12}
                lg={6}
                sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}
              >
                <Box
                  textAlign="center"
                  paddingBottom="1.2em"
                  paddingTop="0.5em"
                >
                  <Box>
                    <Typography
                      variant="caption"
                      textTransform="uppercase"
                      color="#a3a39b"
                      fontWeight={800}
                      fontSize="0.65em"
                    >
                      Last week (You)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="button"
                      fontWeight={800}
                      color="#999999"
                      fontSize="1em"
                    >
                      {_.isEmpty(totalTime)
                        ? '00:00:00'
                        : totalTime?.user_last_week_total_time}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item md={12} lg={6}>
                <Box
                  textAlign="center"
                  paddingBottom="1.2em"
                  paddingTop="0.5em"
                >
                  <Box>
                    <Typography
                      variant="caption"
                      textTransform="uppercase"
                      color="#a3a39b"
                      fontWeight={800}
                      fontSize="0.65em"
                    >
                      last week (Team)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="button"
                      fontWeight={800}
                      color="#999999"
                      fontSize="1em"
                    >
                      {_.isEmpty(totalTime)
                        ? '00:00:00'
                        : totalTime?.team_last_week_total_time}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* Task categories */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          px={3}
          mb={3}
        >
          {(team_id === 11 || team_id === 21
            ? sideTicketNavigation
            : sideNavigation.filter(
                (data) =>
                  team_id === 24 || team_id === 2 || data.key !== 'saas-support'
              )
          ).map((data, index) => (
            <StyledButton
              startIcon={data.icon}
              disableElevation
              disableFocusRipple
              disableRipple
              disableTouchRipple
              endIcon={
                <Chip
                  label={dashboard[data?.slug]}
                  size="small"
                  sx={{
                    height: '14px',
                    paddingTop: '2px',
                    color: tab === null ? '#fff' : 'inherit',
                    backgroundColor: tab === null ? '#7c3aed' : '#edf0f7',
                    fontWeight: 700,
                    '& .MuiChip-label': {
                      padding: '0 5px',
                      fontSize: '9px',
                    },
                  }}
                />
              }
              component={Link}
              to={{
                pathname: location.pathname,
                search: data.search,
              }}
              sx={{
                color: tab === data.key ? '#7c3aed' : '#768197',
                backgroundColor: tab === data.key ? '#f5f1ff' : 'transparent',
              }}
              key={index}
            >
              {data.label}
            </StyledButton>
          ))}
        </Box>
        {/* Resources */}
        <Box px={3} mb={3}>
          <Box>
            <Typography variant="h6" fontWeight={800} mb={1}>
              Resources
            </Typography>
          </Box>
          <Box>
            <InfiniteScroll
              dataLength={resources?.data?.length ?? 0}
              hasMore={resources?.next_page_url}
              next={handlePaginationResources}
              scrollableTarget="scrollable-container"
            >
              {resourcesData?.map((resource) => (
                <Box
                  key={resource?.id}
                  component={Link}
                  to={{
                    pathname: '/timesheet',
                    search: `?user_id=${resource?.user_id}`,
                  }}
                  sx={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    color: 'inherit',
                    '&:hover': {
                      color: '#5025C4', // Changes color on hover
                    },
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Box display="flex">
                    <Avatar
                      {...stringAvatar(resource?.fullname)}
                      variant="rounded"
                    />
                    <Stack width="100%" size="small" ml={1.5}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="button" fontWeight={700}>
                          {resource?.fullname}
                        </Typography>
                        {resource.running_timer ? (
                          <TimerTwoToneIcon color="success" />
                        ) : (
                          <TimerOffTwoToneIcon sx={{ color: '#bbbbbb' }} />
                        )}
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {/* <Typography variant="caption">
                        {resource?.team_name}
                      </Typography> */}
                        <Chip
                          label={resource?.region}
                          size="small"
                          sx={{
                            backgroundColor: '#acaaad',
                            height: 20,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 10,
                            borderRadius: 5,
                          }}
                        />
                        <LinearProgress
                          variant="determinate"
                          value={
                            parseResourceProgress(resource?.this_week) <= 100
                              ? parseResourceProgress(resource?.this_week)
                              : 100
                          }
                          sx={{
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: generateResourceProgressColor(
                                parseFloat(
                                  parseResourceProgress(resource?.this_week)
                                )
                              ),
                            },
                            borderRadius: 3.5,
                            height: 7,
                            width: '55%',
                            backgroundColor: '#00000014',
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                  <Divider sx={{ margin: '0.5em 0', color: '#dedede' }} />
                </Box>
              ))}
            </InfiniteScroll>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

Sidebar.propTypes = {
  onClickClose: PropTypes.func,
};
