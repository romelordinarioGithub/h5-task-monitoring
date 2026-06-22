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
import { statusFlags, ticketPriorityFlag } from 'pages/Dashboard/constant';

export default function DashboardTable() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const queue = urlParams.get('queue');
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

  const isBrief = queue === 'briefs';
  const isTicket = team_id === 11 || team_id == 21 || queue === 'saas-support'; // loose equality for 21 to match original code "team_id == 21"
  const isTask = !isBrief && !isTicket;
  const getDisplayText = (value) =>
    _.isPlainObject(value) ? value?.name ?? value?.value ?? '' : value ?? '';

  const renderSortableHeader = (label, sortKey) => {
    const sortArray = isBrief ? state?.brief?.sort : state?.sort;
    return (
      <TableSortLabel
        active={
          sortArray?.includes(sortKey) || sortArray?.includes(`-${sortKey}`)
        }
        direction={sortArray?.includes(sortKey) ? 'desc' : 'asc'}
        onClick={() =>
          handleTableSort(
            sortArray?.includes(`-${sortKey}`) ? sortKey : `-${sortKey}`
          )
        }
      >
        {label}
      </TableSortLabel>
    );
  };

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
              inputProps={{ 'aria-label': 'select all' }}
            />
          </TableCell>

          <TableCell align="left">
            {isTicket ? renderSortableHeader('ID', 'ticket_id') : 'ID'}
          </TableCell>

          <TableCell align="left">
            {isTicket ? renderSortableHeader('Name', 'subject') : 'Name'}
          </TableCell>

          {isTask && team_id === 5 && (
            <TableCell align="center">Partner</TableCell>
          )}

          <TableCell align="center">Status</TableCell>

          <TableCell align="center">
            {isTicket ? (
              'Priority'
            ) : (
              <>
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
              </>
            )}
          </TableCell>

          <TableCell align="center">Assignee</TableCell>

          {/* Dynamic Columns based on Type */}
          {isBrief && (
            <>
              <TableCell align="center">
                {renderSortableHeader('Date Created', 'created_at')}
              </TableCell>
              <TableCell align="center">
                {renderSortableHeader(
                  'Est. Delivery Date',
                  'campaign_launch_date'
                )}
              </TableCell>
              <TableCell align="center">
                {renderSortableHeader(
                  'Est. Campaign End Date',
                  'campaign_end_date'
                )}
              </TableCell>
            </>
          )}

          {isTicket && (
            <>
              <TableCell align="center">
                {renderSortableHeader('Created At', 'created_at')}
              </TableCell>
              <TableCell align="center">
                {renderSortableHeader('First Reply', 'first_reply')}
              </TableCell>
              <TableCell align="center">
                {renderSortableHeader('Last Reply', 'last_reply')}
              </TableCell>
            </>
          )}

          {isTask && (
            <>
              <TableCell align="center">
                <Tooltip
                  title={
                    <Typography color="white" sx={{ fontSize: '1em' }}>
                      The deadline for task completion per the SLA requirements.
                    </Typography>
                  }
                >
                  <div>{renderSortableHeader('Due Date', 'due_date')}</div>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                {team_id === 3 ? (
                  <Tooltip
                    title={
                      <Typography color="white" sx={{ fontSize: '1em' }}>
                        The date the task was added to Ad-weave or initiated by
                        the requestor.
                      </Typography>
                    }
                  >
                    <Typography sx={{ fontSize: '1em' }}>
                      Date Created
                    </Typography>
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={
                      <Typography color="white" sx={{ fontSize: '1em' }}>
                        Use this to keep the team and stakeholders aligned on
                        expected timelines.
                      </Typography>
                    }
                  >
                    <div>
                      {renderSortableHeader('Delivery Date', 'delivery_date')}
                    </div>
                  </Tooltip>
                )}
              </TableCell>
            </>
          )}

          <TableCell align="center">Tags</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!fetchDashboard &&
          all_tasks?.data?.map((row, index) => {
            // Normalization for specific types
            const assignees = isTicket ? row?.assignee : row?.assignees;
            const tags = isTicket ? row?.tag : row?.tags;

            // Determine Status Display and Color
            let statusDisplay, statusColorKey;
            if (isTicket) {
              statusDisplay = statusFlags[Number(row?.status?.id)];
              statusColorKey = _.camelCase(statusDisplay?.trim());
            } else {
              statusDisplay = getDisplayText(row?.status);
              statusColorKey = _.camelCase(statusDisplay?.toString().trim());
            }

            // Determine Priority Display and Color
            let priorityDisplay, priorityColor;
            if (isTicket) {
              priorityDisplay = ticketPriorityFlag[Number(row?.priority)];
              priorityColor = appColors.priority[_.camelCase(priorityDisplay)];
            } else {
              priorityDisplay = getDisplayText(row?.priority);
              priorityColor =
                appColors.priority[priorityDisplay?.toLowerCase?.()];
            }

            // Link Path and State
            let linkPath, linkState;
            if (isBrief) {
              linkPath = `/brief/${row?.id}`;
              linkState = { background: location, type: 'brief' };
            } else if (isTicket) {
              linkPath = `/ticket/${row?.id}`;
              linkState = { background: location }; // Ticket didn't have type in original
            } else {
              linkPath = `/${row?.rel_type}/${row?.id}`;
              linkState = {
                background: location,
                type: row?.rel_type,
                subtask: row?.rel_type?.includes('subtask'),
              };
            }

            return (
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
                    checked={!_.isNil(_.find(selectedRows, { id: row?.id }))}
                    onChange={() =>
                      handleOnChangeCheckbox({
                        id: row?.id,
                        rel_type: row?.rel_type,
                      })
                    }
                    inputProps={{ 'aria-label': 'select all' }}
                  />
                </TableCell>

                <TableCell component="th" scope="row" sx={{ padding: 0 }}>
                  <Box
                    component={Link}
                    to={{ pathname: linkPath, state: linkState }}
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Box sx={{ padding: '6px 16px', cursor: 'pointer' }}>
                      {row.id}
                    </Box>
                  </Box>
                </TableCell>

                <TableCell component="th" scope="row" sx={{ padding: 0 }}>
                  <Box
                    component={Link}
                    to={{ pathname: linkPath, state: linkState }}
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Box sx={{ padding: '6px 16px', cursor: 'pointer' }}>
                      {isBrief ? (
                        <>
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
                          Brief {row.id} - {row.company_name?.value} -{' '}
                          {row.title}
                        </>
                      ) : isTicket ? (
                        <>
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
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </Box>
                  </Box>
                </TableCell>

                {isTask && team_id === 5 && (
                  <TableCell component="th" scope="row" sx={{ padding: 0 }}>
                    <Box sx={{ textDecoration: 'none', color: 'inherit' }}>
                      <Box sx={{ padding: '6px 16px', cursor: 'pointer' }}>
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
                    backgroundColor: `${appColors.status[statusColorKey]}`,
                    width: '110px',
                    color: '#fff',
                  }}
                  align="center"
                  onClick={(e) =>
                    handlePopover(
                      e,
                      isTicket
                        ? 'ticket_status'
                        : isBrief
                        ? 'brief_status'
                        : 'task_status',
                      isTicket ? row?.status_id : row?.status_id,
                      row?.id,
                      null,
                      isBrief || isTask ? row?.rel_type === 'task' : false
                    )
                  }
                >
                  {statusDisplay}
                </TableCell>

                <TableCell
                  sx={{
                    fontSize: '20px',
                    display: 'flex',
                    color: `${priorityColor}`,
                  }}
                  align="center"
                  onClick={(e) =>
                    handlePopover(
                      e,
                      isTicket
                        ? 'ticket_priority'
                        : isBrief
                        ? 'brief_priority'
                        : 'task_priority',
                      isTicket ? row?.priority : row?.priority_id,
                      row?.id,
                      null,
                      isBrief || isTask ? row?.rel_type === 'task' : false
                    )
                  }
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FlagTwoToneIcon />
                    <Typography variant="caption" ml={1}>
                      {priorityDisplay}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ padding: 0 }}
                  onClick={(e) =>
                    handlePopover(
                      e,
                      isTicket
                        ? 'ticket_assignees'
                        : isBrief
                        ? 'brief_assignees'
                        : 'task_assignees',
                      isTicket
                        ? row?.assignee
                        : isBrief
                        ? row?.assignees.map((data) => ({
                            ...data,
                            user_id: data.id,
                          }))
                        : row?.assignees,
                      row?.id,
                      null,
                      isBrief || isTask ? row?.rel_type === 'task' : false
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
                    {assignees?.map((assignee) => (
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
                          {...stringAvatar(
                            assignee?.username ?? assignee?.name
                          )}
                          src={assignee?.avatar}
                        />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </TableCell>

                {/* Dynamic Cells */}
                {isBrief && (
                  <>
                    <TableCell align="center">
                      {moment(row.created_at).format('MM-DD-yyyy hh:mm:ss A')}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={(e) =>
                        handlePopover(
                          e,
                          'campaign_launch_date',
                          row.campaign_launch_date === '1970-01-01 08:00:00'
                            ? new Date()
                            : row?.campaign_launch_date,
                          row?.id,
                          null,
                          row?.rel_type === 'brief'
                        )
                      }
                    >
                      {row.campaign_launch_date === '1970-01-01 08:00:00'
                        ? 'Not Set'
                        : moment(row.campaign_launch_date).format(
                            'MM-DD-yyyy hh:mm:ss A'
                          )}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={(e) =>
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
                        )
                      }
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
                  </>
                )}

                {isTicket && (
                  <>
                    <TableCell align="center">{row?.created_at}</TableCell>
                    <TableCell align="center">{row?.first_reply}</TableCell>
                    <TableCell align="center">{row?.last_reply}</TableCell>
                  </>
                )}

                {isTask && (
                  <>
                    <TableCell
                      align="center"
                      onClick={(e) =>
                        handlePopover(
                          e,
                          'task_due_date',
                          row?.due_date?.replace(/-/g, '/'),
                          row?.id,
                          null,
                          row?.rel_type === 'task'
                        )
                      }
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
                            _.find(selectedRows, { id: row?.id })
                          ) {
                            handlePopover(
                              e,
                              'task_delivery_date',
                              row?.delivery_date?.replace(/-/g, '/'),
                              row?.id,
                              null,
                              row?.rel_type === 'task'
                            );
                          }
                        }}
                      >
                        {row.delivery_date}
                      </TableCell>
                    )}
                  </>
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
                    {!_.isEmpty(tags) &&
                      tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={isTicket ? tag.title : tag.name || tag.title} // Brief uses tag.name, Task uses tag.title. Check data consistency.
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
            );
          })}
      </TableBody>
    </Table>
  );
}
