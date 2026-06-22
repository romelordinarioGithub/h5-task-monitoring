import React, { useContext } from 'react';
import _ from 'lodash';
import 'assets/css/timesheet/overide.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import {
  Avatar,
  Chip,
  Typography,
  Stack,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';
import TimesheetContext from '../../Context';
import Header from 'pages/TimerSheet/components/Header';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { task_columns } from 'pages/TimerSheet/constant';
import * as moment from 'moment';
import 'moment-duration-format';
import { Link } from 'react-router-dom';

export default function Task() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const taskTableRef = React.useRef(null);
  const {
    timesheetFilterData,
    handleRedirect,
    handleFilter,
    handleKeyDown,
    handleTimeSheetCSV,
    optionTimeSheet,
    handleSearch,
    handleApplyFilterData,
    handleClearFilterData,
    isTimeSheetFetching,
    setTaskTableRef,
    userIdFromQuery,
    timerSheetApplyFilterCooldownEndsAt,
  } = useContext(TimesheetContext);

  React.useEffect(() => {
    if (setTaskTableRef && taskTableRef.current) {
      setTaskTableRef(taskTableRef);
    }
  }, [setTaskTableRef]);

  // Auto-scroll to task table when user_id query param is present
  React.useEffect(() => {
    if (userIdFromQuery && taskTableRef.current) {
      setTimeout(() => {
        taskTableRef.current?.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });
      }, 300);
    }
  }, [userIdFromQuery]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const totalTime = timesheetFilterData?.timesheet
    ? timesheetFilterData?.timesheet.reduce(
        (total, value) =>
          (total += Math.abs(moment.duration(value?.total).asHours())),
        0
      )
    : 0;

  return (
    <Box ref={taskTableRef}>
      <Header
        onSearch={handleSearch}
        onFilter={handleFilter}
        optionList={optionTimeSheet}
        Search={handleKeyDown}
        handleDownloadCSV={handleTimeSheetCSV}
        handleApplyFilterData={handleApplyFilterData}
        handleClearFilterData={handleClearFilterData}
        timerSheetApplyFilterCooldownEndsAt={
          timerSheetApplyFilterCooldownEndsAt
        }
        isLoading={isTimeSheetFetching}
      />
      <Paper sx={{ width: '100%', borderRadius: 2 }}>
        <TableContainer
          //sx={{ maxHeight: 440 }}
          sx={{
            borderRadius: 2,
            height: '29.05em',
            backgroundColor: '#eeeeee',
          }}
        >
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                {task_columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{
                      minWidth: column.minWidth,
                      [column.align]: 0,
                      background: column.isSticky && 'white',
                      zIndex: column.isSticky ? 2 : 1,
                      boxShadow:
                        column.isSticky &&
                        'rgb(136 136 136 / 60%) 0px 0px 6px 0px',
                      clipPath: column.isSticky && 'inset(0px -15px 0px 0px)',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                backgroundColor: 'white',
              }}
            >
              {timesheetFilterData?.timesheet
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {task_columns.map((column) => {
                        return (
                          <TableCell
                            key={column.id}
                            style={{
                              position: column.isSticky ? 'sticky' : 'initial',
                              [column.align]: 0,
                              background: column.isSticky && 'white',
                              zIndex: column.isSticky ? 1 : 1,
                              boxShadow:
                                column.isSticky &&
                                'rgb(136 136 136 / 60%) 0px 0px 6px 0px',
                              clipPath:
                                column.isSticky && 'inset(0px -15px 0px 0px)',
                              textTransform: 'capitalize',
                              textAlign: column.align,
                            }}
                          >
                            {['total', 'total_decmial'].includes(column?.id) ? (
                              row[column.id]
                            ) : column.id === 'start_12hrs' ? (
                              <Box
                              // onClick={(e) =>
                              //   handlePopper(e, 'start_12hrs', {
                              //     type: 'start_12hrs',
                              //     timer_id: row['timer_id'],
                              //     selectedDate: row[column.id],
                              //     timer_type: row['timer_type'],
                              //   })
                              // }
                              >
                                {row[column.id]?.toUpperCase()}{' '}
                              </Box>
                            ) : column.id === 'end_12hrs' ? (
                              <Box
                              // onClick={(e) =>
                              //   handlePopper(e, 'end_12hrs', {
                              //     type: 'end_12hrs',
                              //     timer_id: row['timer_id'],
                              //     selectedDate: row[column.id],
                              //     timer_type: row['timer_type'],
                              //   })
                              // }
                              >
                                {row[column.id]?.toUpperCase()}{' '}
                              </Box>
                            ) : column.id === 'timer_type' ? (
                              <Chip
                                label={row[column.id]}
                                size="small"
                                sx={{ borderRadius: '3px', height: '19px' }}
                                color={
                                  row[column.id] === 'subtask'
                                    ? 'secondary'
                                    : row[column.id] === 'task'
                                    ? 'primary'
                                    : row[column.id] === 'ticket'
                                    ? 'info'
                                    : 'warning'
                                }
                              />
                            ) : column.id === 'user' ? (
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  sx={{ width: 22, height: 22, fontSize: 12 }}
                                  src={row[column.id]?.avatar}
                                  alt={row[column.id]?.name}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: '1',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {row[column.id]?.name}
                                </Typography>
                              </Stack>
                            ) : ['task', 'subtask', 'preset']?.includes(
                                column?.id
                              ) ? (
                              <Typography
                                className={
                                  row['timer_type'] === 'preset'
                                    ? 'preset__active'
                                    : ''
                                }
                                variant="body2"
                                onClick={(e) =>
                                  handleRedirect(
                                    e,
                                    row?.timer_type,
                                    row?.task?.id
                                  )
                                }
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: '1',
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  cursor:
                                    column?.id?.includes('task') && 'pointer',
                                  color:
                                    !column?.id?.includes('task') && '#bdbdbd',
                                  ':hover': {
                                    color:
                                      column?.id?.includes('task') && '#F22076',
                                  },
                                }}
                              >
                                {row[column.id]?.name}
                              </Typography>
                            ) : column?.id === 'task_type' ? (
                              <Typography
                                variant="body2"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: '1',
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {row[column.id]?.name}
                              </Typography>
                            ) : column?.id === 'action' ? (
                              <Tooltip title="View Summary">
                                <IconButton
                                  aria-label="view"
                                  size="small"
                                  // color="secondary"
                                  //onClick={() => handleModal(true, row)}
                                  component={Link}
                                  to={`/timesheet/${row?.timer_type}/${row?.timer_id}`}
                                >
                                  <VisibilityIcon size="small" />
                                </IconButton>
                              </Tooltip>
                            ) : column?.id === 'timer_id' ? (
                              row[column.id]
                            ) : _.isEmpty(row[column.id]?.name) ? (
                              '-'
                            ) : (
                              row[column.id]?.name
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: 'flex',
            borderTop: '1px solid #ececec',
            justifyContent: 'flex-end',
            padding: '0 1em',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              borderTop: '4px solid #000',
              margin: '0.2em',
            }}
          >
            <Typography>Total:</Typography>
            <Typography fontWeight={700}>
              {moment
                .duration(totalTime, 'hours')
                .format('HH:mm:ss', { trim: false })}
            </Typography>
          </Stack>
        </Box>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={timesheetFilterData?.timesheet?.length ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
