import { useContext } from 'react';
import PropTypes from 'prop-types';
// Context
import TicketContext from 'pages/Ticket/Context';
import {
  Stack,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import _ from 'lodash';

const CommentHeader = ({
  user,
  createdDate,
  commentRelType,
  options,
  isEdited,
  threadId,
  taskId,
  editHistory,
  collapseThread,
  handleCollapseThread,
}) => {
  // context
  const { handleOpen } = useContext(TicketContext);

  switch (commentRelType) {
    case 'additional_info':
      return (
        <Stack px={1.5} py={1} direction="row" justifyContent="space-between">
          <Stack spacing={1.5} direction="row" alignItems="center">
            {!_.isEmpty(user?.avatar) &&
            user?.avatar?.split('/').pop() !== 'thumb_' ? (
              <Avatar
                sx={{ border: '3px solid #fff' }}
                alt={user?.name}
                src={user?.avatar}
              />
            ) : (
              <Avatar sx={{ border: '3px solid #fff' }}>
                {`${user?.name?.split(' ')[0][0]}${
                  !_.isEmpty(user?.name?.split(' ')[1][0])
                    ? user?.name?.split(' ')[1][0]
                    : ''
                }`}
              </Avatar>
            )}
            <Stack justifyContent="center">
              <Typography
                variant="body1"
                component="div"
                fontWeight={700}
                textTransform={_.isNull(user?.id) ? 'lowercase' : 'capitalize'}
              >
                {user?.name?.toLowerCase().includes('ad-weave')
                  ? 'Ad-Weave'
                  : user?.name}
              </Typography>
              <Stack
                direction="row"
                // mt={'-0.5em'}
                spacing={0.5}
                alignItems="center"
              >
                <Typography variant="caption">{createdDate}</Typography>
                {isEdited && (
                  <FiberManualRecordIcon
                    size="small"
                    sx={{ width: '5px', height: '5px' }}
                  />
                )}
                {isEdited && <Typography variant="caption">Edited</Typography>}
              </Stack>
            </Stack>
          </Stack>

          <Box>
            <IconButton
              onClick={(e) => handleOpen(e, 'right', commentRelType, options)}
            ></IconButton>
          </Box>
        </Stack>
      );

    case 'ticket':
      return (
        <Stack px={1.5} py={1} direction="row" justifyContent="space-between">
          <Stack spacing={1.5} direction="row" alignItems="center">
            {!_.isEmpty(user?.avatar) &&
            user?.avatar?.split('/').pop() !== 'thumb_' ? (
              <Avatar
                sx={{ border: '3px solid #fff' }}
                alt={user?.name}
                src={user?.avatar}
              />
            ) : (
              <Avatar sx={{ border: '3px solid #fff' }}>
                {!_.isNull(user?.id)
                  ? `${user?.name?.split(' ')[0][0]}${
                      !_.isEmpty(user?.name?.split(' ')[1][0])
                        ? user?.name?.split(' ')[1][0]
                        : ''
                    }`
                  : null}
              </Avatar>
            )}
            <Stack spacing={-0.5} justifyContent="center">
              <Typography
                variant="body1"
                component="div"
                fontWeight={700}
                textTransform={_.isNull(user?.id) ? 'lowercase' : 'capitalize'}
              >
                {!_.isNull(user?.id)
                  ? user?.name?.toLowerCase().includes('ad-weave')
                    ? 'Ad-Weave'
                    : user?.name
                  : user?.slackName}
              </Typography>
              <Stack
                direction="row"
                mt={'-0.5em'}
                spacing={0.5}
                alignItems="center"
              >
                <Typography variant="caption">{createdDate}</Typography>
                {isEdited && (
                  <FiberManualRecordIcon
                    size="small"
                    sx={{ width: '5px', height: '5px' }}
                  />
                )}
                {isEdited && <Typography variant="caption">Edited</Typography>}
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Box>
              {/* {!_.isNull(status?.status) && (
                <Button
                  startIcon={
                    status?.status?.toLowerCase() === 'rejected' ? (
                      <CancelIcon />
                    ) : (
                      <CheckCircleIcon />
                    )
                  }
                  size="small"
                  color={
                    status?.status?.toLowerCase() === 'rejected'
                      ? 'error'
                      : 'success'
                  }
                  variant="text"
                  disableRipple
                  disableElevation
                >
                  {status?.status}
                </Button>
              )} */}
            </Box>
            <Box>
              {!_.isEmpty(options) && !_.isUndefined(options) && (
                <Tooltip title="Options" arrow>
                  <IconButton
                    onClick={(e) =>
                      handleOpen(
                        e,
                        'right',
                        commentRelType,
                        options,
                        threadId,
                        null,
                        taskId,
                        {
                          user: {
                            name: user?.name ?? '',
                            avatar: user?.avatar ?? '',
                          },
                          list: editHistory ?? [],
                        }
                      )
                    }
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Stack direction="row" justifyContent="space-between" mt={1} mr={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
                alignItems="center"
              ></Stack>
              <Box>
                <Tooltip title={!collapseThread ? 'Show' : 'Hide'} arrow>
                  <IconButton size="small" onClick={handleCollapseThread}>
                    {!collapseThread ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      );

    default:
      return (
        <Stack px={1.5} py={1} direction="row" justifyContent="space-between">
          <Stack spacing={1.5} direction="row" alignItems="center">
            {!_.isEmpty(user?.avatar) &&
            user?.avatar?.split('/').pop() !== 'thumb_' ? (
              <Avatar
                sx={{ border: '3px solid #fff' }}
                alt={user?.name}
                src={user?.avatar}
              />
            ) : user?.name.toLowerCase() === 'adweave' || _.isNull(user?.id) ? (
              <Avatar sx={{ border: '3px solid #fff' }} />
            ) : (
              <Avatar sx={{ border: '3px solid #fff' }}>
                {`${user?.name?.split(' ')[0][0]}${
                  !_.isEmpty(user?.name?.split(' ')[1][0])
                    ? user?.name?.split(' ')[1][0]
                    : ''
                }`}
              </Avatar>
            )}
            <Stack spacing={-0.5} justifyContent="center">
              <Typography
                variant="body1"
                component="div"
                fontWeight={700}
                textTransform={_.isNull(user?.id) ? 'lowercase' : 'capitalize'}
              >
                {user?.name?.toLowerCase().includes('ad-weave')
                  ? 'Ad-Weave'
                  : user?.name}
              </Typography>
              <Stack
                direction="row"
                mt={'-0.5em'}
                spacing={0.5}
                alignItems="center"
              >
                <Typography variant="caption">{createdDate}</Typography>
                {isEdited && (
                  <FiberManualRecordIcon
                    size="small"
                    sx={{ width: '5px', height: '5px' }}
                  />
                )}
                {isEdited && <Typography variant="caption">Edited</Typography>}
              </Stack>
            </Stack>
          </Stack>

          {!_.isEmpty(options) && !_.isUndefined(options) && (
            <Stack direction="row" spacing={1}>
              <Box>
                <Tooltip title="Options" arrow>
                  <IconButton
                    onClick={(e) =>
                      handleOpen(
                        e,
                        'right',
                        commentRelType,
                        options,
                        threadId,
                        null,
                        taskId,
                        {
                          user: {
                            name: user?.name ?? '',
                            avatar: user?.avatar ?? '',
                          },
                          list: editHistory,
                        }
                      )
                    }
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          )}
        </Stack>
      );
  }
};

CommentHeader.propTypes = {
  user: PropTypes.any,
  createdDate: PropTypes.any,
  commentRelType: PropTypes.any,
  options: PropTypes.array,
  status: PropTypes.any,
  threadId: PropTypes.any,
  thread: PropTypes.any,
  comment: PropTypes.any,
  editHistory: PropTypes.any,
  taskId: PropTypes.any,
  isEdited: PropTypes.any,
  collapseThread: PropTypes.any,
  handleCollapseThread: PropTypes.any,
};

export default CommentHeader;
