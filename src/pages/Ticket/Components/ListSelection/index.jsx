import PropTypes from 'prop-types';
import { useState } from 'react';
import _ from 'lodash';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  Button,
  CircularProgress,
  styled,
  TextField,
  ListItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import { digitFormatter } from 'utils/session/primitives';
import AssistantPhotoRoundedIcon from '@mui/icons-material/AssistantPhotoRounded';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { appColors } from 'theme/variables';
import 'react-circular-progressbar/dist/styles.css';
import DueDateProgressTimer from '../DueDateProgressTimer';
import empty from 'assets/empty.svg';
import CheckIcon from '@mui/icons-material/Check';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
      boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
    },
  },
});

export default function ListSelection({
  option,
  type,
  rel,
  selected,
  ticketId,
  timer,
  timerState,
  isAssignee,
  isUpdatingTimer,
  handleSave,
  handleClose,
  onClickOptions,
  onPlayPauseTimer,
  onStopTimer,
}) {
  const handleListItemClick = (event, index) => {
    event.preventDefault();
    switch (type) {
      case 'priority':
        handleSave({
          id: ticketId,
          key: type,
          priority: index,
        });
        break;

      case 'status':
        handleSave({
          id: ticketId,
          key: type,
          status: index,
        });
        break;

      default:
        handleSave({
          id: ticketId,
          type: rel,
          key: type,
          value: index,
        });
        break;
    }

    handleClose();
  };

  const timerDurationLimitInHours = 15; // 15 hours

  const [dataFilter, setDataFilter] = useState('');

  const filteredTags = _.orderBy(
    _.filter(option, (data) =>
      data?.title?.toLowerCase().includes(dataFilter.toLowerCase())
    ),
    ['is_selected'],
    ['desc']
  );

  switch (type) {
    case 'tag':
      return (
        <Box overflow={'hidden'}>
          <Box
            padding={1}
            sx={{ borderBottom: '1px solid #ececec' }}
            onChange={(e) => setDataFilter(e.target.value)}
          >
            <StyledTextField
              size="small"
              placeholder={'Add/Remove Tags'}
              onKeyUp={(e) => {
                if (e.key.toLowerCase() === 'enter') {
                  setDataFilter('');
                  handleSave({
                    key: type,
                    action: 'add',
                    // Below are endpoint's parameters
                    rel_id: ticketId,
                    type: 'ticket',
                    title: e.target.value,
                  });
                }
              }}
              InputProps={{
                endAdornment: !_.isEmpty(
                  filteredTags?.filter((tags) => tags.is_selected)
                ) && (
                  <Tooltip title="Clear Tags">
                    <IconButton
                      onClick={() =>
                        handleSave({
                          key: type,
                          action: 'remove',
                          // Below are endpoint's parameters
                          ids: selected.map((tags) => tags.id)?.toString(),
                          rel_id: ticketId,
                          type: 'ticket',
                        })
                      }
                    >
                      {<DeleteOutlineIcon sx={{ fontSize: '1.2em' }} />}
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          </Box>
          {_.isEmpty(filteredTags) ? (
            <Stack alignItems="center" p={2}>
              <img
                src={empty}
                alt="Not found"
                style={{ width: '7em', height: 'auto' }}
              />
              <Typography fontWeight={300} variant="body1">
                Tag not found
              </Typography>
            </Stack>
          ) : (
            <Box maxHeight={270} overflow="auto">
              <List dense={true}>
                {filteredTags.map((data, index) => (
                  <ListItem
                    key={index}
                    component="div"
                    disablePadding
                    secondaryAction={
                      data?.is_selected ? <CheckIcon color="secondary" /> : null
                    }
                  >
                    <ListItemButton
                      onClick={() =>
                        handleSave({
                          key: type,
                          action: data?.is_selected ? 'remove' : 'add',
                          // Below are endpoint's parameters
                          ids: data?.id,
                          rel_id: ticketId,
                          type: 'ticket',
                          title: data?.title,
                        })
                      }
                    >
                      <ListItemText primary={data.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      );

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
                  selected={option?.id === selected}
                  sx={{
                    '&.Mui-selected': { backgroundColor: '#5025c41a' },
                  }}
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
                  selected={
                    option?.name.toLowerCase() === selected.toLowerCase()
                  }
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
              {timerState.isTaskTimerRunning && (
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
                  onClick={(e) => onClickOptions(e, option?.key, ticketId)}
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
  ticketId: PropTypes.any,
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
};
