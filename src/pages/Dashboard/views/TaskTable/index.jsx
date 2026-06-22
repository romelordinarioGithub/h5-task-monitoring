import React, { useContext } from 'react';
import {
  Box,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Avatar,
  AvatarGroup,
  Chip,
  Tooltip,
  IconButton,
  TableSortLabel,
  Stack,
  Checkbox,
} from '@mui/material';
import DashboardContext from 'pages/Dashboard/context';
import { stringAvatar } from 'hooks';
import { appColors } from 'theme/variables';
import { Link, useLocation } from 'react-router-dom';
import FlagTwoToneIcon from '@mui/icons-material/FlagTwoTone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import _ from 'lodash';

export default function TaskTable() {
  const location = useLocation();
  const {
    team_id,
    dashboard: { all_tasks },
    state,
    handlePopover,
    selectedRows,
    handleTableSort,
    handleOnChangeCheckbox,
    handleOnChangeSelectAllCheckbox,
    fetchDashboard,
  } = useContext(DashboardContext);
  const getDisplayText = (value) =>
    _.isPlainObject(value) ? value?.name ?? value?.value ?? '' : value ?? '';

  return (
    <Table
      stickyHeader
      sx={{ minWidth: 'max-content' }}
      aria-label="simple table"
      size="small"
    >
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              sx={{ transform: 'scale(1.25)' }}
              color="secondary"
              checked={selectedRows.length === all_tasks?.data?.length}
              onChange={handleOnChangeSelectAllCheckbox}
              inputProps={{
                'aria-label': 'select all',
              }}
            />
          </TableCell>
          <TableCell align="left">ID</TableCell>
          <TableCell align="left">Name</TableCell>
          {team_id === 5 && <TableCell align="center">Partner</TableCell>}
          <TableCell align="center">Status</TableCell>
          <TableCell align="center">
            Priority
            <Tooltip
              title={
                <Typography color="white" sx={{ fontSize: '1em' }}>
                  Only team leaders and admins can set a task or subtask to
                  Urgent priority
                </Typography>
              }
            >
              <IconButton
                sx={{
                  fontSize: '1em',
                  height: '.7em',
                  marginBottom: '3px',
                  marginLeft: '.1em',
                  width: '1em',
                }}
                disableRipple
              >
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
          <TableCell align="center">Assignee</TableCell>
          <TableCell align="center">
            <Tooltip
              title={
                <Typography color="white" sx={{ fontSize: '1em' }}>
                  The deadline for task completion per the SLA requirements.
                </Typography>
              }
            >
              <TableSortLabel
                active={
                  state?.sort?.includes('due_date') ||
                  state?.sort?.includes('-due_date')
                }
                direction={state?.sort?.includes('due_date') ? 'desc' : 'asc'}
                onClick={() =>
                  handleTableSort(
                    state?.sort?.includes('-due_date')
                      ? 'due_date'
                      : '-due_date'
                  )
                }
              >
                Due Date
              </TableSortLabel>
            </Tooltip>
          </TableCell>
          {team_id === 3 ? (
            <TableCell align="center">
              <Tooltip
                title={
                  <Typography color="white" sx={{ fontSize: '1em' }}>
                    The date the task was added to Ad-weave or initiated by the
                    requestor.
                  </Typography>
                }
              >
                <Typography sx={{ fontSize: '1em' }}>Date Created</Typography>
              </Tooltip>
            </TableCell>
          ) : (
            <TableCell align="center">
              <Tooltip
                title={
                  <Typography color="white" sx={{ fontSize: '1em' }}>
                    Use this to keep the team and stakeholders aligned on
                    expected timelines.
                  </Typography>
                }
              >
                <TableSortLabel
                  active={
                    state?.sort?.includes('delivery_date') ||
                    state?.sort?.includes('-delivery_date')
                  }
                  direction={
                    state?.sort?.includes('delivery_date') ? 'desc' : 'asc'
                  }
                  onClick={() =>
                    handleTableSort(
                      state?.sort?.includes('-delivery_date')
                        ? 'delivery_date'
                        : '-delivery_date'
                    )
                  }
                >
                  Delivery Date
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          )}
          <TableCell align="center">Tags</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!fetchDashboard &&
          all_tasks?.data?.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                cursor: 'pointer',
                backgroundColor: `${
                  appColors.dashboard.health[
                    _.camelCase(row?.tracker_status?.trim())
                  ]
                }`,
                ':hover': {
                  backgroundColor: `${
                    appColors.dashboard.health[
                      `${_.camelCase(row?.tracker_status?.trim())}Hover`
                    ]
                  }`,
                },
              }}
            >
              <TableCell padding="checkbox" sx={{ position: 'relative' }}>
                <Checkbox
                  sx={{ transform: 'scale(1.25)' }}
                  color="secondary"
                  checked={
                    !_.isNil(
                      _.find(selectedRows, {
                        id: row?.id,
                      })
                    )
                  }
                  onChange={() =>
                    handleOnChangeCheckbox({
                      id: row?.id,
                      rel_type: row?.rel_type,
                    })
                  }
                  inputProps={{
                    'aria-label': 'select all',
                  }}
                />
              </TableCell>
              <TableCell component="th" scope="row" sx={{ padding: 0 }}>
                <Box
                  component={Link}
                  to={{
                    pathname: `/${row?.rel_type}/${row?.id}`,
                    state: {
                      background: location,
                      type: row?.rel_type,
                      subtask: row?.rel_type?.includes('subtask'),
                    },
                  }}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Box
                    sx={{
                      padding: '6px 16px',
                      cursor: 'pointer',
                    }}
                  >
                    {row.id}
                  </Box>
                </Box>
              </TableCell>
              <TableCell component="th" scope="row" sx={{ padding: 0 }}>
                <Box
                  component={Link}
                  to={{
                    pathname: `/${row?.rel_type}/${row?.id}`,
                    state: {
                      background: location,
                      type: row?.rel_type,
                      subtask: row?.rel_type?.includes('subtask'),
                    },
                  }}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Box
                    sx={{
                      padding: '6px 16px',
                      cursor: 'pointer',
                    }}
                  >
                    <Chip
                      label={
                        row.rel_type === 'task'
                          ? 'P'
                          : row.rel_type === 'subtask'
                          ? 'S'
                          : row.rel_type
                      }
                      size="small"
                      sx={{
                        height: 'auto',
                        backgroundColor:
                          row.rel_type === 'task' ? '#5c52c3' : '#f22076',
                        color: '#fff',
                        fontSize: 10,
                        textTransform: 'capitalize',
                        marginRight: '10px',
                        cursor: 'pointer',
                      }}
                    />
                    {getDisplayText(row?.name)}
                  </Box>
                </Box>
              </TableCell>
              {team_id === 5 && (
                <TableCell component="th" scope="row" sx={{ padding: 0 }}>
                  <Box
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <Box
                      sx={{
                        padding: '6px 16px',
                        cursor: 'pointer',
                      }}
                    >
                      {row?.partner_name?.length <= 25
                        ? row?.partner_name
                        : row?.partner_name?.substr(0, 25) + '...'}
                    </Box>
                  </Box>
                </TableCell>
              )}
              <TableCell
                sx={{
                  padding: 0,
                  backgroundColor: `${
                    appColors.status[
                      _.camelCase(getDisplayText(row?.status).toString().trim())
                    ]
                  }`,
                  width: '110px',
                  color: '#fff',
                }}
                align="center"
                onClick={(e) => {
                  handlePopover(
                    e,
                    'task_status',
                    row?.status_id,
                    row?.id,
                    null,
                    row?.rel_type === 'task'
                  );
                }}
              >
                {getDisplayText(row?.status)}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: '20px',
                  display: 'flex',
                  color: `${
                    appColors.priority[
                      getDisplayText(row?.priority)?.toLowerCase?.()
                    ]
                  }`,
                }}
                align="center"
                onClick={(e) => {
                  handlePopover(
                    e,
                    'task_priority',
                    row?.priority_id,
                    row?.id,
                    null,
                    row?.rel_type === 'task'
                  );
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="center">
                  <FlagTwoToneIcon />
                  <Typography variant="caption" ml={1}>
                    {getDisplayText(row?.priority)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                align="center"
                sx={{ padding: 0 }}
                onClick={(e) => {
                  handlePopover(
                    e,
                    'task_assignees',
                    row?.assignees,
                    row?.id,
                    null,
                    row?.rel_type === 'task'
                  );
                }}
              >
                <AvatarGroup
                  sx={{
                    justifyContent: 'center',
                    '& .MuiAvatarGroup-avatar': {
                      width: 20,
                      height: 20,
                      fontSize: 11,
                      marginLeft: '-5px',
                    },
                  }}
                >
                  {row?.assignees?.map((assignee) => (
                    <Tooltip
                      key={assignee?.user_id}
                      title={assignee?.username ?? assignee?.name}
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
                      <Avatar
                        {...stringAvatar(assignee?.username ?? assignee?.name)}
                        src={assignee?.avatar}
                      />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </TableCell>
              <TableCell
                align="center"
                onClick={(e) => {
                  handlePopover(
                    e,
                    'task_due_date',
                    row?.due_date?.replace(/-/g, '/'),
                    row?.id,
                    null,
                    row?.rel_type === 'task'
                  );
                }}
              >
                {row.due_date}
              </TableCell>
              {team_id === 3 ? (
                <TableCell align="center">{row.date_created}</TableCell>
              ) : (
                <TableCell
                  align="center"
                  onClick={(e) => {
                    if (
                      _.isEmpty(selectedRows) ||
                      _.find(selectedRows, {
                        id: row?.id,
                      })
                    )
                      handlePopover(
                        e,
                        'task_delivery_date',
                        row?.delivery_date?.replace(/-/g, '/'),
                        row?.id,
                        null,
                        row?.rel_type === 'task'
                      );
                  }}
                >
                  {row.delivery_date}
                </TableCell>
              )}
              <TableCell
                align="start"
                sx={{
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '0.1em',
                    height: '0.1em',
                  },
                }}
              >
                <Stack direction="row" width={200}>
                  {!_.isEmpty(row.tags) &&
                    row?.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag.title}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{
                          height: 'auto',
                          fontSize: 10,
                          marginRight: '10px',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
