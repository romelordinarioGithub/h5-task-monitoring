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
  Stack,
  Checkbox,
  TableSortLabel,
} from '@mui/material';
import DashboardContext from 'pages/Dashboard/context';
import { stringAvatar } from 'hooks';
import { appColors } from 'theme/variables';
import { Link, useLocation } from 'react-router-dom';
import FlagTwoToneIcon from '@mui/icons-material/FlagTwoTone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import _ from 'lodash';
import moment from 'moment';

export default function BriefTable() {
  const location = useLocation();
  const {
    state,
    dashboard: { all_tasks },
    handlePopover,
    selectedRows,
    handleOnChangeCheckbox,
    handleOnChangeSelectAllCheckbox,
    fetchDashboard,
    handleTableSort,
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
          <TableCell align="left">ID</TableCell>
          <TableCell align="left">Name</TableCell>
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
              Date Created
            </TableSortLabel>
          </TableCell>
          <TableCell align="center">
            <TableSortLabel
              active={
                state?.sort?.includes('campaign_launch_date') ||
                state?.sort?.includes('-campaign_launch_date')
              }
              direction={
                state?.sort?.includes('campaign_launch_date') ? 'desc' : 'asc'
              }
              onClick={() =>
                handleTableSort(
                  state?.sort?.includes('-campaign_launch_date')
                    ? 'campaign_launch_date'
                    : '-campaign_launch_date'
                )
              }
            >
              Est. Delivery Date
            </TableSortLabel>
          </TableCell>
          <TableCell align="center">Est. Campaign End Date</TableCell>
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
                    pathname: `/brief/${row?.id}`,
                    state: {
                      background: location,
                      type: 'brief',
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
                    pathname: `/brief/${row?.id}`,
                    state: {
                      background: location,
                      type: 'brief',
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
                      label={'B'}
                      size="small"
                      sx={{
                        height: 'auto',
                        backgroundColor: '#15a6c9',
                        color: '#fff',
                        fontSize: 10,
                        textTransform: 'capitalize',
                        marginRight: '10px',
                        cursor: 'pointer',
                      }}
                    />
                    Brief {row.id} - {row.company_name?.value} - {row.title}
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  padding: 0,
                  backgroundColor: `${
                    appColors.status[_.camelCase(row?.status.toString().trim())]
                  }`,
                  width: '110px',
                  color: '#fff',
                }}
                align="center"
                onClick={(e) => {
                  handlePopover(
                    e,
                    'brief_status',
                    row?.status_id,
                    row?.id,
                    null,
                    row?.rel_type === 'task'
                  );
                }}
              >
                {row.status}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: '20px',
                  display: 'flex',
                  color: `${appColors.priority[row?.priority?.toLowerCase()]}`,
                }}
                align="center"
                onClick={(e) => {
                  handlePopover(
                    e,
                    'brief_priority',
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
                    {row?.priority}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                align="center"
                sx={{ padding: 0 }}
                onClick={(e) => {
                  handlePopover(
                    e,
                    'brief_assignees',
                    row?.assignees.map((data) => ({
                      ...data,
                      user_id: data.id,
                    })),
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
              <TableCell align="center">
                {moment(row.created_at).format('MM-DD-yyyy hh:mm:ss A')}
              </TableCell>
              <TableCell
                align="center"
                onClick={(e) => {
                  handlePopover(
                    e,
                    'campaign_launch_date',
                    row.campaign_launch_date === '1970-01-01 08:00:00'
                      ? new Date()
                      : row?.campaign_launch_date,
                    row?.id,
                    null,
                    row?.rel_type === 'brief'
                  );
                }}
              >
                {row.campaign_launch_date === '1970-01-01 08:00:00'
                  ? 'Not Set'
                  : moment(row.campaign_launch_date).format(
                      'MM-DD-yyyy hh:mm:ss A'
                    )}
              </TableCell>
              <TableCell
                align="center"
                onClick={(e) => {
                  handlePopover(
                    e,
                    'campaign_end_date',
                    row.campaign_end_date === '1970-01-01 08:01:00' ||
                      row.campaign_end_date === '1970-01-01 08:00:00'
                      ? new Date()
                      : row?.campaign_end_date?.includes('Always')
                      ? new Date()
                      : row?.campaign_end_date,
                    row?.id,
                    null,
                    row?.rel_type === 'brief'
                  );
                }}
              >
                {row.campaign_end_date === '1970-01-01 08:01:00' ||
                row.campaign_end_date === '1970-01-01 08:00:00'
                  ? 'Not Set'
                  : row?.campaign_end_date?.includes('Always')
                  ? row?.campaign_end_date
                  : moment(row.campaign_end_date).format(
                      'MM-DD-yyyy hh:mm:ss A'
                    )}
              </TableCell>
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
                        label={tag.name}
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
