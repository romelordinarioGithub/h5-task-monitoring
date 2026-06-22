import {
  Box,
  IconButton,
  Typography,
  styled,
  Tooltip,
  Stack,
  Badge,
} from '@mui/material';
import appTheme from 'theme';

// Utils
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

// Icons
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import LockResetIcon from '@mui/icons-material/LockReset';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

function TaskListColumn({
  tasks,
  rowHeight,
  hideChannel,
  hide,
  handleDependencyToggle,
  handleDialogOpen,
  handleHide,
  setOnHover,
  onHover,
  isOriginal,
  handleUpdateOriginalTimeline,
  isCampaign,
}) {
  const location = useLocation();

  return (
    <Box>
      {tasks.map((item, key) => {
        return (
          <Box
            display="flex"
            alignItems="center"
            sx={{
              height: rowHeight,
              background:
                onHover === item?.id
                  ? '#c9c6c6b0'
                  : item?.parentTask
                  ? '#e6e6e6'
                  : '#f3f5f9',
              borderTop: '1px solid #e6e4e4',
              borderRight: '1px solid #e6e4e4',
              borderBottom: '1px solid #e6e4e4',
              width: '290px',
              // ':hover': {
              //   backgroundColor: '#c9c6c6b0',
              // },
            }}
            key={key}
            onMouseEnter={() => setOnHover(item?.id)}
            onMouseLeave={() => setOnHover('0')}
          >
            {(item?.parentTask || item?.channel) && (
              <IconButton
                size="small"
                onClick={() =>
                  handleHide(
                    !item?.channel ? item?.id : item?.cId,
                    item?.channel,
                    item?.channelId
                  )
                }
                sx={{
                  padding: 0,
                  marginLeft: item?.parentTask ? '1.5em' : '.5em',
                }}
              >
                {item?.parentTask &&
                  (!hide?.includes(item?.id) ? (
                    <IndeterminateCheckBoxOutlinedIcon />
                  ) : (
                    <AddBoxOutlinedIcon />
                  ))}
                {item?.channel &&
                  (!hideChannel?.includes(item?.cId) ? (
                    <IndeterminateCheckBoxOutlinedIcon />
                  ) : (
                    <AddBoxOutlinedIcon />
                  ))}
              </IconButton>
            )}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <StyledTypography
                fontWeight={item?.channel ? 800 : 400}
                variant={item?.channel ? 'body1' : 'body2'}
                component={item?.has_type ? Link : ''}
                to={
                  item.has_type
                    ? {
                        pathname: isCampaign
                          ? `${item.link}`
                          : `/${item.rel_type}/${item.task_id}`,
                        state: {
                          background: location,
                          type: 'task',
                          subtask:
                            item.rel_type ?? item.rel_type?.includes('subtask'),
                        },
                      }
                    : ''
                }
                sx={{
                  color: 'inherit',
                  cursor: item.has_type ? 'pointer' : 'default',
                  textDecoration: 'none',
                  ':hover': item.has_type && {
                    textDecoration: 'underline',
                  },
                  marginLeft:
                    item?.parentTask || item?.channel
                      ? '.5em'
                      : item.rel_type == 'subtask'
                      ? '4.5em'
                      : '3.8em',
                }}
              >
                {item.name}
                {item.channel && !isOriginal ? (
                  <Tooltip
                    title={'Update Original Timeline'}
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
                    <IconButton
                      color="inherit"
                      disabled={item?.is_locked}
                      onClick={() =>
                        handleUpdateOriginalTimeline(item?.channel_id)
                      }
                    >
                      <LockResetIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </StyledTypography>

              <Stack direction="row">
                {item?.order != '1.1' && !item?.parentTask && !item.channel && (
                  <Tooltip title={'Link/Unlink dependency'} disableInteractive>
                    <IconButton
                      onClick={() => {
                        item?.status_id === 1 &&
                          handleDependencyToggle(item.id, !item.is_dependent);
                      }}
                      sx={{
                        color: item.is_dependent
                          ? appTheme.palette.primary.light
                          : 'grey',
                        fontSize: '1.1em',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {!item.is_dependent ? <LinkOffIcon /> : <LinkIcon />}
                    </IconButton>
                  </Tooltip>
                )}
                {!item?.channel && (
                  <Tooltip title="Add/Edit a note" disableInteractive>
                    <IconButton
                      onClick={() => {
                        handleDialogOpen(item, 'notes');
                      }}
                      sx={{
                        color: item.notes
                          ? appTheme.palette.primary.light
                          : 'grey',
                        fontSize: '1.1em',
                        transition: '.2s',
                        '&:hover': {
                          color: appTheme.palette.primary.light,
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <Badge
                        color="error"
                        variant="dot"
                        invisible={!item.notes}
                      >
                        <StickyNote2Icon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}

export default TaskListColumn;

TaskListColumn.propTypes = {
  tasks: PropTypes.any,
  rowHeight: PropTypes.any,
  hideChannel: PropTypes.any,
  hide: PropTypes.any,
  handleDependencyToggle: PropTypes.any,
  handleHide: PropTypes.any,
  handleDialogOpen: PropTypes.any,
  setOnHover: PropTypes.any,
  onHover: PropTypes.string,
  isOriginal: PropTypes.bool,
  handleUpdateOriginalTimeline: PropTypes.func,
  isCampaign: PropTypes.bool,
};
