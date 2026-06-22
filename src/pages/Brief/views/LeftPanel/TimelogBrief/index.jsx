import React, { useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  Stack,
  Divider,
  IconButton,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import BriefContext from 'pages/Brief/Context';
import { useOnMount } from 'hooks';
import _ from 'lodash';

const useStyles = makeStyles(() => ({
  accordionContainerIsActive: {
    boxShadow: 'none',
    backgroundColor: '#F5F6F8',
    transition: '.5s ease',
  },
  accordionContainerActive: {
    boxShadow: 'none',
    transition: '.5s ease',
  },
  accordionSummary: {
    minHeight: '0px !important',
    height: '48px',
  },
  avatarSize: {
    width: '33px',
    height: '33px',
    marginRight: '10px',
  },
  avatarWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  txtLoghours: {
    color: '#DF3C76',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '120%',
    letterSpacing: '0.005em',
    padding: '5px',
    width: '22%',
  },
  txtLoghoursAccordion: {
    color: '#DF3C76',
    fontWeight: '400',
    fontSize: '1em',
    lineHeight: '120%',
    letterSpacing: '0.005em',
    padding: '5px',
    width: '20%',
    border: 'none',
  },
  txtDate: {
    color: '#767676',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '120%',
    letterSpacing: '0.005em',
    padding: '5px',
    width: '30%',
    cursor: 'pointer',
  },
  txtDateAccordion: {
    color: '#767676',
    fontWeight: '400',
    fontSize: '1em',
    lineHeight: '120%',
    letterSpacing: '0.005em',
    padding: '10px 5px',
    width: '30%',
    cursor: 'pointer',
    border: 'none',
  },
  tableHeader1: {
    color: '#767676',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '120%',
    letterSpacing: '0.005em',
    padding: '5px',
    width: '30%',
  },
  tableHeader2: {
    color: '#767676',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '120%',
    letterSpacing: '0.005em',
    padding: '5px',
    width: '20%',
  },
  tableRowModify: {
    display: 'inline-table',
    width: '100%',
  },
  tableCellModify30: {
    padding: '5px',
    width: '30%',
  },
  tableCellModifyPlay: {
    padding: '5px',
    width: '20%',
    textAlign: 'center',
  },
  iconPinkSize: {
    height: '16px',
    width: '16px',
    marginLeft: '2px',
  },
  clockWrapper: {
    alignItems: 'center',
    display: 'flex',
    marginTop: '7px',
    justifyContent: 'center',
  },
  tableContainer: {
    margin: '10px 10px 0px',
    padding: '0px',
    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  },
  tableContainerAccordion: {
    padding: '0px',
    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  },
  mT20: {
    marginTop: '20px',
  },
}));

function transformData(data) {
  // Helper: compute total duration (HH:MM:SS)
  function computeDuration(start, end) {
    if (!start || !end) return null;
    const diff = (new Date(end) - new Date(start)) / 1000;
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(Math.floor(diff % 60)).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  // Group logs by user_id
  const users = {};

  data?.forEach((log) => {
    if (!users[log.user_id]) {
      users[log.user_id] = {
        user_id: log.user_id,
        user_name: log.name,
        avatar: log.avatar,
        total_time_seconds: 0,
        timelogs: [],
      };
    }

    const start = log.time_in;
    const end = log.time_out;
    const total = computeDuration(start, end);

    // Add to running total seconds if stopped
    if (total) {
      const [h, m, s] = total.split(':').map(Number);
      users[log.user_id].total_time_seconds += h * 3600 + m * 60 + s;
    }

    users[log.user_id].timelogs.push({
      timelog_id: log.id,
      user: log.name,
      user_id: log.user_id,
      avatar: log.avatar,
      rel_id: null,
      task_name: null,
      rel_type: null,
      related: null,
      status: log.status === 'running' ? 'Running' : 'Stop',
      start: start,
      end: end,
      total: total,
      timeline: [
        {
          timeline_id: log.id,
          timeline_status: log.status,
          time_in: start,
          time_out: end,
          total: total,
        },
      ],
      is_exceeded: false,
    });
  });

  // Format final output per user
  return Object.values(users).map((user) => {
    const totalSeconds = user.total_time_seconds;

    let total_time = null;
    if (totalSeconds > 0) {
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const s = String(totalSeconds % 60).padStart(2, '0');
      total_time = `${h}:${m}:${s}`;
    }

    return {
      user_id: user.user_id,
      user_name: user.user_name,
      avatar: user.avatar,
      total_time,
      timelogs: user.timelogs,
    };
  });
}

const TimelogBrief = () => {
  const {
    timelogs,
    userData,
    onOpenTimelogsTab,
    handleOpen,
    isTaskTimerStopped,
    isTaskTimerRunning,
  } = useContext(BriefContext);

  const timelogsData = transformData(timelogs);

  const [expanded, setExpanded] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    onOpenTimelogsTab();
  }, [isTaskTimerStopped, isTaskTimerRunning]);

  const handleChangeAccordion = (index) => (_, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  const handleDateStarted = (e, timelog, data) => {
    if (timelog.user_id === userData.id || userData?.team_id === 12) {
      handleOpen(
        e,
        'left',
        'date_started',
        data,
        data.time_in,
        'task',
        data.timeline_id,
        null,
        data.time_out
      );
    }
  };

  const handleDateEnded = (e, timelog, data) => {
    if (timelog.user_id === userData.id || userData?.team_id === 12) {
      handleOpen(
        e,
        'left',
        'date_ended',
        data,
        data.time_out,
        'task',
        data.timeline_id,
        null,
        data.time_in
      );
    }
  };

  return (
    <Box mt={2}>
      {!_.isEmpty(timelogsData) ? (
        <Card className={classes.mT20} elevation={0} variant="outlined">
          <Stack
            direction="row"
            justifyContent="space-between"
            px={2}
            py={2}
            backgroundColor={'#F9F9FC'}
            alignItems="center"
          >
            <Typography fontWeight={700} variant="body2">
              User
            </Typography>
            <Typography fontWeight={700} variant="body2">
              Total Log Hours
            </Typography>
          </Stack>
          <Divider />
          {timelogsData?.map((item, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              className={
                expanded == index
                  ? classes.accordionContainerActive
                  : classes.accordionContainerIsActive
              }
              onChange={handleChangeAccordion(index)}
            >
              <AccordionSummary
                className={classes.accordionSummary}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="timelogbh-content"
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Stack direction="row" alignItems="center">
                    {item?.avatar?.split('/').pop() !== 'thumb_' ? (
                      <Avatar
                        className={classes.avatarSize}
                        alt={item.user_name}
                        src={item.avatar}
                      />
                    ) : (
                      <Avatar className={classes.avatarSize}>
                        {`${item.user_name.split(' ')[0][0]}${
                          item.user_name.split(' ')[1][0]
                        }`}
                      </Avatar>
                    )}
                    <Typography>{item.user_name}</Typography>
                  </Stack>
                  <Typography fontWeight={700} color="secondary" mr={1}>
                    {item?.total_time}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails className={classes.tableContainer}>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        className={classes.tableHeader1}
                      >
                        Date Started
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableHeader1}
                      >
                        Date Ended
                      </TableCell>
                      {/* <TableCell
                        align="center"
                        className={classes.tableHeader2}
                      >
                        Status
                      </TableCell> */}
                      <TableCell
                        align="center"
                        className={classes.tableHeader2}
                      >
                        Log Hours
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item?.timelogs.map((timelog, index) => (
                      <TableRow key={index}>
                        <TableCell
                          colSpan={4}
                          sx={{
                            padding: 0,
                            borderBottomColor: 'rgba(0, 0, 0, 0.08)',
                          }}
                        >
                          <Accordion sx={{ boxShadow: 'none' }}>
                            <AccordionSummary
                              className={classes.accordionSummary}
                            >
                              <TableRow
                                key={index}
                                className={classes.tableRowModify}
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                {/* Date Started */}
                                <TableCell
                                  align="center"
                                  className={classes.txtDate}
                                >
                                  {timelog.start}
                                </TableCell>

                                {/* Date Ended */}
                                <TableCell
                                  align="center"
                                  className={classes.txtDate}
                                >
                                  {timelog.end ?? '-'}
                                </TableCell>

                                {/* Total Hours */}
                                <TableCell
                                  align="center"
                                  className={classes.txtLoghours}
                                >
                                  <Box className={classes.clockWrapper}>
                                    {timelog.total}&nbsp;
                                    {/* <img
                                      className={classes.iconPinkSize}
                                      src={IconPink}
                                      alt="icon clock pink"
                                    /> */}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            </AccordionSummary>
                            <AccordionDetails
                              className={classes.tableContainerAccordion}
                            >
                              {timelog.timeline?.map((timeline, index) => (
                                <TableRow
                                  key={index}
                                  className={classes.tableRowModify}
                                  sx={{
                                    '&:last-child td, &:last-child th': {
                                      border: 0,
                                    },
                                  }}
                                >
                                  {/* Date Started */}
                                  <TableCell
                                    onClick={(e) =>
                                      handleDateStarted(e, item, timeline)
                                    }
                                    align="center"
                                    className={classes.txtDateAccordion}
                                  >
                                    {timeline.time_in}
                                  </TableCell>

                                  {/* Date Ended */}
                                  <TableCell
                                    onClick={(e) =>
                                      handleDateEnded(e, item, timeline)
                                    }
                                    align="center"
                                    className={classes.txtDateAccordion}
                                  >
                                    {timeline.time_out ?? '-'}
                                  </TableCell>
                                  {/* Status
                                  <TableCell
                                    className={classes.tableCellModifyPlay}
                                  >
                                    <Chip
                                      label={
                                        timeline.time_out == null
                                          ? 'running'
                                          : timeline.timeline_status
                                      }
                                      size="small"
                                      color={
                                        timeline.timeline_status == 'stop'
                                          ? 'secondary'
                                          : 'primary'
                                      }
                                    />
                                  </TableCell> */}

                                  {/* Total Hours */}
                                  <TableCell
                                    align="center"
                                    className={classes.txtLoghoursAccordion}
                                  >
                                    {timeline.total}&nbsp;&nbsp;
                                    <Chip
                                      size="small"
                                      sx={{
                                        height: 17,
                                        fontSize: '0.65em',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                      }}
                                      label={
                                        timeline.time_out == null
                                          ? 'running'
                                          : timeline.timeline_status
                                      }
                                      color={
                                        timeline.timeline_status == 'stop'
                                          ? 'secondary'
                                          : 'primary'
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          ))}
        </Card>
      ) : (
        <Card variant="outlined" sx={{ borderStyle: 'none' }}>
          <Stack alignItems="center" p={1}>
            <Box>
              <IconButton
                size="large"
                color="error"
                disableRipple
                disableTouchRipple
                disableFocusRipple
                sx={{ backgroundColor: '#f2445c1a' }}
              >
                <LinkOffIcon />
              </IconButton>
            </Box>
            <Box>
              <Typography fontWeight={700} color="#999999">
                No Timelog found.
              </Typography>
            </Box>
          </Stack>
        </Card>
      )}
    </Box>
  );
};

export default TimelogBrief;
