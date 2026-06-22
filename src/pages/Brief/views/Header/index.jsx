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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
// Colors
import { appColors } from 'theme/variables';
// Context
import BriefContext from 'pages/Brief/Context';
import PropTypes from 'prop-types';
import { digitFormatter } from 'utils/session/primitives';
import { stringAvatar } from 'hooks';
import _ from 'lodash';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useHistory } from 'react-router-dom';

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

const Header = ({ isAssignee, onOpen }) => {
  const {
    overview,
    options,
    taskTimerStopwatch,
    userData,
    handleSave,
    isTask,
  } = useContext(BriefContext);

  const watcherList = _.filter(
    overview.watchers,
    (watcher) =>
      !_.map(overview.assignees, (assignee) =>
        Number(assignee.user_id ?? assignee.id)
      ).includes(Number(watcher.user_id)) && watcher.data_source !== 'concept'
  );

  const statusList = _.filter(options.statusList, (stats) =>
    _.map(stats?.related_to, (stat) => stat.name === 'task').includes(true)
  );

  const timerDurationLimitInHours = 15; // 8 hours

  const history = useHistory();

  return (
    <Stack
      p={1}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack spacing={2} direction="row">
        {/* Status */}
        <Button
          size="small"
          sx={{
            minWidth: '10em',
            backgroundColor:
              appColors.status[
                _.camelCase(overview?.status?.replace(/_/g, ' '))
              ],
            color: '#fff',
            textTransform: 'capitalize',
            '&:hover': {
              backgroundColor:
                appColors.status[
                  _.camelCase(overview?.status?.replace(/_/g, ' '))
                ],
            },
          }}
          onClick={(e) =>
            onOpen(
              e,
              'left',
              'status',
              statusList,
              overview?.status_id,
              overview?.rel_type
            )
          }
        >
          {overview?.status?.replace(/_/g, ' ')}
        </Button>
        <StyledDivider orientation="vertical" variant="middle" flexItem />
        {/* Priority */}
        <Box display="flex" alignItems="center">
          <Tooltip
            title={
              <Stack>
                <Typography
                  align="center"
                  color="white"
                  sx={{ fontSize: '1em' }}
                >
                  Priority
                </Typography>
                <Typography color="white" sx={{ fontSize: '1em' }}>
                  *Only team leaders and admins can set
                  <br />a task or subtask to Urgent priority
                </Typography>
              </Stack>
            }
            arrow
          >
            <IconButton
              size="small"
              onClick={(e) =>
                onOpen(
                  e,
                  'left',
                  'priority',
                  options.priorityList,
                  overview.priority_id,
                  overview.rel_type
                )
              }
            >
              <AssistantPhotoIcon
                sx={{
                  color:
                    appColors.priority[
                      _.camelCase(overview.priority?.toLowerCase())
                    ],
                  width: '1.5em',
                  height: '1.5em',
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
                  overview.assignees,
                  overview.rel_type
                )
              }
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {!_.isEmpty(overview.assignees) ? (
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
                  {overview.assignees?.map((i, index) => {
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
                    border: '1px dashed #25165b',
                    color: '#25165b',
                  }}
                >
                  <PersonAddAltIcon />
                </Avatar>
              )}
            </Box>
          </Tooltip>
          {_.isEmpty(
            _.filter(
              overview.assignees,
              (assignee) =>
                Number(assignee.user_id ?? assignee.id) === userData?.id
            )
          ) && (
            <Tooltip title="Assign to me" arrow>
              <Box
                onClick={() =>
                  handleSave({
                    key: 'assign_to_me',
                    id: overview?.id,
                    is_parent: isTask ? 1 : 0,
                    value: userData.id,
                    selectedArr: {
                      avatar: userData.profile_picture,
                      id: userData.id,
                      is_assignee: true,
                      name: userData.fullname,
                      order: 1,
                    },
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
                    border: '1px solid #25165b',
                    color: '#25165b',
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
      <Typography
        sx={{
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'center',
          my: 0.5,
        }}
      >
        {`Brief ${overview.id} - ${overview.company_name?.value} - ${overview.title}`}
      </Typography>
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
        <StyledDivider orientation="vertical" variant="middle" flexItem />
        <Box
          onClick={(e) =>
            onOpen(
              e,
              'right',
              'watchers',
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
                      alt={i?.name.toUpperCase()}
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
                      {`${i.name.toUpperCase().split(' ')[0][0]}${
                        i.name.toUpperCase().split(' ')[1][0]
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
        </Box>
        {/* <StyledDivider orientation="vertical" variant="middle" flexItem />
        <Box display="flex" alignItems="center">
          <Tooltip title="Add to Favorite" arrow>
            <IconButton
              size="small"
              sx={{
                fontSize: 22,
                cursor: 'pointer',
                color: appColors.favorited,
              }}
              onClick={() =>
                onFavorite(overview.id, overview.rel_type, overview.is_parent)
              }
            >
              {!overview.is_pinned ? <StarBorderIcon /> : <FavoriteIcon />}
            </IconButton>
          </Tooltip>
        </Box> */}
        <StyledDivider orientation="vertical" variant="middle" flexItem />
        {/* <Box display="flex" alignItems="center">
          <Tooltip
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            arrow
          >
            <IconButton
              size="small"
              sx={{
                fontSize: 22,
                cursor: 'pointer',
              }}
              onClick={() => handleFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Box> */}
        <Box display="flex" alignItems="center">
          <Tooltip title={'Close'} arrow>
            <IconButton
              size="small"
              sx={{
                fontSize: 22,
                cursor: 'pointer',
              }}
              onClick={() => history.push('/?queue=briefs')}
            >
              <CloseOutlinedIcon />
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
  isFullscreen: PropTypes.bool,
  handleFullscreen: PropTypes.func,
};

export default Header;
