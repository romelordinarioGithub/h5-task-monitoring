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
  TableSortLabel,
  Stack,
  Checkbox,
} from '@mui/material';
import DashboardContext from 'pages/Dashboard/context';
import { stringAvatar } from 'hooks';
import { appColors } from 'theme/variables';
import { Link, useLocation } from 'react-router-dom';
import { statusFlags, ticketPriorityFlag } from 'pages/Dashboard/constant';
import FlagTwoToneIcon from '@mui/icons-material/FlagTwoTone';
import _ from 'lodash';

export default function TicketTable() {
  const location = useLocation();
  const {
    dashboard: { all_tasks },
    state,
    handlePopover,
    selectedRows,
    handleTableSort,
    handleOnChangeCheckbox,
    handleOnChangeSelectAllCheckbox,
  } = useContext(DashboardContext);

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
          <TableCell align="left">
            <TableSortLabel
              active={
                state?.sort?.includes('ticket_id') ||
                state?.sort?.includes('-ticket_id')
              }
              direction={state?.sort?.includes('ticket_id') ? 'desc' : 'asc'}
              onClick={() =>
                handleTableSort(
                  state?.sort?.includes('-ticket_id')
                    ? 'ticket_id'
                    : '-ticket_id'
                )
              }
            >
              ID
            </TableSortLabel>
          </TableCell>
          <TableCell align="left">
            <TableSortLabel
              active={
                state?.sort?.includes('subject') ||
                state?.sort?.includes('-subject')
              }
              direction={state?.sort?.includes('subject') ? 'desc' : 'asc'}
              onClick={() =>
                handleTableSort(
                  state?.sort?.includes('-subject') ? 'subject' : '-subject'
                )
              }
            >
              Name
            </TableSortLabel>
          </TableCell>
          <TableCell align="center">Status</TableCell>
          <TableCell align="center">Priority</TableCell>
          <TableCell align="center">Assignee</TableCell>
          <TableCell align="center">
            <TableSortLabel
              active={
                state?.sort?.includes('created_at') ||
                state?.sort?.includes('-created_at')
              }
              direction={state?.sort?.includes('created_at') ? 'desc' : 'asc'}
              onClick={() =>
                handleTableSort(
                  state?.sort?.includes('-created_at')
                    ? 'created_at'
                    : '-created_at'
                )
              }
            >
              Created At
            </TableSortLabel>
          </TableCell>
          <TableCell align="center">
            <TableSortLabel
              active={
                state?.sort?.includes('first_reply') ||
                state?.sort?.includes('-first_reply')
              }
              direction={state?.sort?.includes('first_reply') ? 'desc' : 'asc'}
              onClick={() =>
                handleTableSort(
                  state?.sort?.includes('-first_reply')
                    ? 'first_reply'
                    : '-first_reply'
                )
              }
            >
              First Reply
            </TableSortLabel>
          </TableCell>
          <TableCell align="center">
            <TableSortLabel
              active={
                state?.sort?.includes('last_reply') ||
                state?.sort?.includes('-last_reply')
              }
              direction={state?.sort?.includes('last_reply') ? 'desc' : 'asc'}
              onClick={() =>
                handleTableSort(
                  state?.sort?.includes('-last_reply')
                    ? 'last_reply'
                    : '-last_reply'
                )
              }
            >
              Last Reply
            </TableSortLabel>
          </TableCell>
          <TableCell align="center">Tags</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {all_tasks?.data.map((row, index) => (
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
            <TableCell padding="checkbox">
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
                  pathname: `/ticket/${row?.id}`,
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
                  pathname: `/ticket/${row?.id}`,
                  state: {
                    background: location,
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
                    label={'T'}
                    size="small"
                    sx={{
                      height: 'auto',
                      backgroundColor: '#17a6c9',
                      color: '#fff',
                      fontSize: 10,
                      textTransform: 'capitalize',
                      marginRight: '10px',
                      cursor: 'pointer',
                    }}
                  />
                  {row?.subject}
                </Box>
              </Box>
            </TableCell>
            <TableCell
              sx={{
                padding: 0,
                backgroundColor: `${
                  appColors.status[
                    _.camelCase(statusFlags[Number(row?.status?.id)]?.trim())
                  ]
                }`,
                width: '110px',
                color: '#fff',
              }}
              align="center"
              onClick={(e) =>
                handlePopover(
                  e,
                  'ticket_status',
                  row?.status_id,
                  row?.id,
                  null,
                  row?.rel_type === 'task'
                )
              }
            >
              {statusFlags[Number(row?.status?.id)]}
            </TableCell>
            <TableCell
              sx={{
                fontSize: '20px',
                display: 'flex',
                color: `${
                  appColors.priority[
                    _.camelCase(ticketPriorityFlag[Number(row?.priority)])
                  ]
                }`,
              }}
              align="center"
              onClick={(e) =>
                handlePopover(
                  e,
                  'ticket_priority',
                  row?.priority,
                  row?.id,
                  null
                )
              }
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <FlagTwoToneIcon />
                <Typography variant="caption" ml={1}>
                  {ticketPriorityFlag[Number(row?.priority)]}
                </Typography>
              </Box>
            </TableCell>
            <TableCell
              align="center"
              sx={{ padding: 0 }}
              onClick={(e) =>
                handlePopover(
                  e,
                  'ticket_assignees',
                  row?.assignee,
                  row?.id,
                  null
                )
              }
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
                {row?.assignee?.map((assignee) => (
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
            <TableCell align="center">{row?.created_at}</TableCell>
            <TableCell align="center">{row?.first_reply}</TableCell>
            <TableCell align="center">{row?.last_reply}</TableCell>
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
                {row.tag &&
                  row?.tag.map((tag, index) => (
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
