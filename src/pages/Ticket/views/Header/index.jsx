import { useContext } from 'react';
// MUI Components
import {
  Stack,
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  AvatarGroup,
  Avatar,
  styled,
  Tooltip,
} from '@mui/material';
// MUI Icons
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from '@mui/icons-material/Star';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
// Colors
import { appColors } from 'theme/variables';
// Context
import TicketContext from 'pages/Ticket/Context';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { digitFormatter } from 'utils/session/primitives';
import { stringAvatar } from 'hooks';

const StyledDivider = styled(Divider)({
  borderStyle: 'dashed',
});

const StyledAvatarGroup = styled(AvatarGroup)({
  justifyContent: 'center',
  '& .MuiAvatarGroup-avatar': {
    width: 20,
    height: 20,
    fontSize: 12,
    marginLeft: '-5px',
  },
});

const Header = ({ isAssignee, onOpen, onFavorite }) => {
  const {
    overview,
    ticket,
    options,
    taskTimerStopwatch,
    userData,
    handleSave,
  } = useContext(TicketContext);

  const timerDurationLimitInHours = 15; // 8 hours

  return (
    <Stack
      p={1.4}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        background:
          'linear-gradient(135deg, #1d0f4d 0%, #35148a 52%, #4c1d95 100%)',
        color: '#ffffff',
      }}
    >
      <Stack spacing={2} direction="row">
        {/* Status */}
        <Button
          size="small"
          sx={{
            minWidth: '10em',
            backgroundColor:
              appColors.status[
                _.camelCase(ticket.status?.name?.replace(/_/g, ' '))
              ],
            color: '#fff',
            borderRadius: '8px',
            fontWeight: 800,
            textTransform: 'capitalize',
            '&:hover': {
              backgroundColor:
                appColors.status[
                  _.camelCase(ticket.status?.name?.replace(/_/g, ' '))
                ],
            },
          }}
          onClick={(e) =>
            onOpen(
              e,
              'left',
              'status',
              _.flatMap(options.statusList, (data, key) => {
                return { id: key, name: data };
              }),
              ticket.status?.name
            )
          }
        >
          {ticket.status?.name?.replace(/_/g, ' ')}
        </Button>
        <StyledDivider orientation="vertical" variant="middle" flexItem />
        {/* Priority */}
        <Box display="flex" alignItems="center">
          <Tooltip title="Priority" arrow>
            <IconButton
              size="small"
              onClick={(e) =>
                onOpen(
                  e,
                  'left',
                  'priority',
                  _.flatMap(options.priorityList, (data, key) => {
                    return { id: key, name: data };
                  }),
                  ticket.priority,
                  overview.rel_type
                )
              }
            >
              <AssistantPhotoIcon
                sx={{
                  color:
                    appColors.priority[
                      _.camelCase(options?.priorityList[ticket?.priority])
                    ],
                  width: '1.5em',
                  height: '1.5em',
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.28))',
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <StyledDivider orientation="vertical" variant="middle" flexItem />
        {/* Assignees */}
        <Box display="flex">
          <Tooltip title="Assignees" arrow>
            <Box
              onClick={(e) =>
                onOpen(
                  e,
                  'left',
                  'assignees',
                  options.usersList,
                  ticket.assignee,
                  overview.rel_type
                )
              }
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {!_.isEmpty(ticket.assignee) ? (
                <AvatarGroup
                  max={3}
                  sx={{
                    '& .MuiAvatar-root': {
                      width: 24,
                      height: 24,
                      fontSize: 15,
                    },
                  }}
                >
                  {ticket.assignee?.map((i, index) => {
                    return i?.avatar?.split('/').pop() !== 'thumb_' ||
                      !_.isEmpty(i?.avatar) ? (
                      <Avatar
                        sx={{ width: 24, height: 24 }}
                        alt={i?.name?.toUpperCase()}
                        src={i?.avatar}
                        key={index}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '1em',
                        }}
                        key={index}
                      >
                        {`${i?.name?.toUpperCase().split(' ')[0][0]}${
                          i?.name?.toUpperCase().split(' ')[1][0]
                        }`}
                      </Avatar>
                    );
                  })}
                </AvatarGroup>
              ) : (
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#ffffff',
                    border: '1px dashed rgba(255,255,255,0.7)',
                    color: '#7c3aed',
                  }}
                >
                  <PersonAddAltIcon />
                </Avatar>
              )}
            </Box>
          </Tooltip>
          {_.isEmpty(
            _.find(ticket.assignee, { user_id: userData?.id.toString() })
          ) && (
            <Tooltip title="Assign to me" arrow>
              <Box
                onClick={() =>
                  handleSave({
                    key: 'assign_to_me',
                    id: ticket?.id,
                    user_id: userData?.id,
                  })
                }
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '.3em',
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#fff',
                    border: '1px solid rgba(255,255,255,0.7)',
                    color: '#7c3aed',
                    borderRadius: '50%',
                    '&:hover': {
                      border: '1px solid #5025C4',
                      color: '#5025C4',
                    },
                  }}
                >
                  <HowToRegOutlinedIcon
                    sx={{
                      margin: '.3em',
                      width: 20,
                      height: 20,
                    }}
                  />
                </Box>
              </Box>
            </Tooltip>
          )}
        </Box>
      </Stack>
      {/* <Tooltip title={overview.name}> */}
      <Typography
        sx={{
          fontWeight: 800,
          cursor: 'pointer',
          textAlign: 'center',
          my: 0.5,
          color: '#ffffff',
        }}
      >
        {`${ticket?.subject}`}
      </Typography>
      <Box sx={{ width: 24 }} />
      {/* </Tooltip> */}
      <Stack spacing={2} direction="row">
        <Stack spacing={1} direction="row" alignItems="center">
          <StyledAvatarGroup max={7}>
            {overview?.timer_active_users?.map((data) => (
              <Tooltip
                key={data?.id}
                title={`${data?.name}'s timer is running!`}
                componentsProps={{
                  tooltip: {
                    sx: {
                      lineHeight: 'normal',
                      margin: '0 !important',
                    },
                  },
                }}
              >
                <Avatar {...stringAvatar(data?.name, {})} src={data?.avatar} />
              </Tooltip>
            ))}
          </StyledAvatarGroup>
          <Stack direction="row" alignItems="center">
            <Stack direction="row" alignItems="center">
              <Typography
                fontWeight={600}
                color={
                  taskTimerStopwatch.hours >= timerDurationLimitInHours
                    ? 'error'
                    : 'primary'
                }
              >
                {isAssignee
                  ? `${digitFormatter(
                      taskTimerStopwatch.hours
                    )}:${digitFormatter(
                      taskTimerStopwatch.minutes
                    )}:${digitFormatter(taskTimerStopwatch.seconds)}`
                  : '00:00:00'}
              </Typography>
              <Box display="flex" alignItems="center">
                <Tooltip title="Timelog" arrow>
                  <IconButton
                    size="small"
                    color={
                      taskTimerStopwatch.hours >= timerDurationLimitInHours
                        ? 'error'
                        : 'primary'
                    }
                    onClick={(e) => onOpen(e, 'right', 'timelog', null)}
                  >
                    <WatchLaterOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        {/* <StyledDivider orientation="vertical" variant="middle" flexItem />
        <Box
          onClick={(e) =>
            onOpen(
              e,
              'right',
              'watcher',
              options.usersList,
              watcherList,
              overview.rel_type
            )
          }
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Tooltip title="Watchers" arrow>
            {!_.isEmpty(watcherList) ? (
              <AvatarGroup
                max={3}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 24,
                    height: 24,
                    fontSize: 11,
                    marginLeft: '-6px',
                  },
                  cursor: 'pointer',
                }}
              >
                {watcherList.map((i, index) => {
                  return i?.avatar?.split('/').pop() !== 'thumb_' ||
                    !_.isEmpty(i?.avatar) ? (
                    <Avatar
                      sx={{ width: 24, height: 24 }}
                      alt={i?.username.toUpperCase()}
                      src={i?.avatar}
                      key={index}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: '1em',
                      }}
                      key={index}
                    >
                      {`${i.username.toUpperCase().split(' ')[0][0]}${
                        i.username.toUpperCase().split(' ')[1][0]
                      }`}
                    </Avatar>
                  );
                })}
              </AvatarGroup>
            ) : (
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: '#ffffff',
                  border: '1px dashed #25165b',
                  color: '#25165b',
                }}
              >
                <GroupAddIcon />
              </Avatar>
            )}
          </Tooltip>
        </Box> */}
        <StyledDivider orientation="vertical" variant="middle" flexItem />
        <Box display="flex" alignItems="center">
          <Tooltip title="Add to Favorite" arrow>
            <IconButton
              size="small"
              sx={{
                fontSize: 22,
                cursor: 'pointer',
                color: appColors.favorited,
              }}
              onClick={() => onFavorite(ticket.id)}
            >
              {!ticket.favorite ? <StarBorderIcon /> : <FavoriteIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  );
};

Header.propTypes = {
  isAssignee: PropTypes.bool,
  onOpen: PropTypes.func,
  onFavorite: PropTypes.func,
};

export default Header;
