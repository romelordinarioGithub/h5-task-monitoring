import PropTypes from 'prop-types';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { digitFormatter } from 'utils/session/primitives';
import AssistantPhotoRoundedIcon from '@mui/icons-material/AssistantPhotoRounded';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import { appColors } from 'theme/variables';
import DueDateProgressTimer from '../DueDateProgressTimer';
import _ from 'lodash';
import 'react-circular-progressbar/dist/styles.css';

export default function ListSelection({
  option,
  type,
  rel,
  selected,
  taskId,
  timer,
  timerState,
  isParent,
  isAssignee,
  isUpdatingTimer,
  handleSave,
  handleClose,
  onClickOptions,
  onPlayPauseTimer,
  onStopTimer,
  userData,
}) {
  const handleListItemClick = (event, index) => {
    event.preventDefault();

    if (rel === 'campaign') {
      handleSave({
        id: taskId,
        type: rel,
        key: type,
        value: index,
      });
    } else {
      handleSave({
        is_parent: isParent,
        id: taskId,
        key: type,
        value: index,
      });
    }

    handleClose();
  };

  const timerDurationLimitInHours = 15; // 15 hours

  switch (type) {
    case 'priority':
      return (
        <Box>
          {_.isEmpty(option) ? (
            'No Options Available'
          ) : (
            <List component="nav" dense={true}>
              {option?.map((option, index) => (
                <ListItemButton
                  key={index}
                  onClick={(event) => handleListItemClick(event, option?.id)}
                  selected={option?.id === Number(selected)}
                  sx={{
                    '&.Mui-selected': { backgroundColor: '#5025c41a' },
                  }}
                  disabled={
                    !userData?.admin_role?.toLowerCase().includes('admin') &&
                    option?.id === 1
                  }
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AssistantPhotoRoundedIcon
                      sx={{
                        color: appColors.priority[option?.name.toLowerCase()],
                      }}
                    />
                    <ListItemText
                      primary={option?.name}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Stack>
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      );

    case 'status':
      return (
        <Box>
          {_.isEmpty(option) ? (
            'No Options Available'
          ) : (
            <List component="nav" dense={true}>
              {option?.map((option, index) => (
                <ListItemButton
                  key={index}
                  onClick={(event) => handleListItemClick(event, option?.id)}
                  sx={{
                    padding: '0.5em 16px',
                    '&.Mui-selected': { backgroundColor: '#5025c41a' },
                  }}
                  selected={option?.id === Number(selected)}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <SquareRoundedIcon
                      sx={{
                        color:
                          appColors.status[
                            _.camelCase(
                              option?.name?.toLowerCase().replace(/_/g, ' ')
                            )
                          ],
                      }}
                    />
                    <ListItemText
                      primary={option?.name}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Stack>
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      );

    case 'timelog':
      return (
        <Stack py={2} spacing={0.5} alignItems="center">
          <DueDateProgressTimer
            isOverdue={timer.isOverdue}
            dueDate={Date.parse(timer.dueDate)}
            dateCreated={Date.parse(timer.dateCreated)}
          />
          <Box>
            {isUpdatingTimer ? (
              <Stack direction="row" justifyContent="center">
                <CircularProgress size={26} color="secondary" thickness={7} />
              </Stack>
            ) : (
              <Typography
                fontWeight={700}
                color={
                  timer.taskTimerStopwatch.hours >= timerDurationLimitInHours
                    ? 'error'
                    : 'secondary'
                }
              >
                {`${
                  timer.taskTimerStopwatch.days !== 0
                    ? digitFormatter(
                        timer.taskTimerStopwatch.hours +
                          timer.taskTimerStopwatch.days * 24
                      )
                    : digitFormatter(timer.taskTimerStopwatch.hours)
                }:${digitFormatter(
                  timer.taskTimerStopwatch.minutes
                )}:${digitFormatter(timer.taskTimerStopwatch.seconds)}`}
              </Typography>
            )}
          </Box>
          {isAssignee && (
            <>
              {!timerState.isTaskTimerRunning && (
                <Box width="100%" px={4}>
                  <Button
                    sx={{ width: '100%' }}
                    size="small"
                    disableElevation
                    // disableRipple
                    disabled={isUpdatingTimer}
                    variant="contained"
                    startIcon={<PlayCircleOutlineIcon />}
                    onClick={onPlayPauseTimer}
                  >
                    Start Time
                  </Button>
                </Box>
              )}
              {(timerState.isTaskTimerRunning ||
                timerState.isTaskTimerPaused) && (
                <Box width="100%" px={4}>
                  <Button
                    sx={{ width: '100%' }}
                    size="small"
                    disableElevation
                    // disableRipple
                    disabled={isUpdatingTimer}
                    variant="outlined"
                    startIcon={<StopCircleOutlinedIcon />}
                    onClick={onStopTimer}
                  >
                    Stop Time
                  </Button>
                </Box>
              )}
            </>
          )}
        </Stack>
      );
    default:
      return (
        <Box px={0.5}>
          {_.isEmpty(option) ? (
            'No Options Available'
          ) : (
            <List component="nav" dense={true}>
              {option?.map((option, index) => (
                <ListItemButton
                  key={index}
                  onClick={(e) => onClickOptions(e, option?.key, taskId)}
                  sx={{
                    '&.Mui-selected': { backgroundColor: '#5025c41a' },
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {option?.icon}
                    <ListItemText
                      primary={option?.name}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Stack>
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      );
  }
}

ListSelection.propTypes = {
  rel: PropTypes.any,
  option: PropTypes.any,
  type: PropTypes.string,
  selected: PropTypes.any,
  taskId: PropTypes.any,
  timer: PropTypes.any,
  timerState: PropTypes.any,
  isParent: PropTypes.any,
  isAssignee: PropTypes.any,
  isUpdatingTimer: PropTypes.any,
  handleSave: PropTypes.func,
  handleClose: PropTypes.func,
  onClickOptions: PropTypes.func,
  onPlayPauseTimer: PropTypes.func,
  onStopTimer: PropTypes.func,
  userData: PropTypes.any,
};
