import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  Box,
  Avatar,
  Typography,
  IconButton,
  AvatarGroup,
  Tooltip,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SquareIcon from '@mui/icons-material/Square';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import moment from 'moment';
import { useStopwatch } from 'react-timer-hook';
import { timeDifference, timeDifferenceRange } from 'utils/date';
// Colors
import { appColors } from 'theme/variables';
import _ from 'lodash';

export default function SubtaskList({
  sub_category,
  priorityList,
  usersList,
  statusList,
  handleOpen,
  handleDeleteSubtask,
}) {
  const location = useLocation();

  const currentTimelog = sub_category?.current_timelog;

  const latestUserTimeLog =
    currentTimelog?.timeline[currentTimelog?.timeline?.length - 1];

  const isStopped = _.isEmpty(sub_category?.current_timelog);

  const isRunning =
    !_.isEmpty(sub_category) &&
    sub_category?.current_timelog?.status?.toLowerCase() === 'running';

  const stopWatchConfigs = {
    autoStart: isRunning,
    // Add offset
    offsetTimestamp:
      !isStopped &&
      new Date(
        moment()
          .add(
            isRunning
              ? timeDifference(moment(currentTimelog.start), true)
              : timeDifferenceRange(
                  moment(latestUserTimeLog?.time_in),
                  moment(latestUserTimeLog?.time_out),
                  true
                ),
            's'
          )
          .format()
      ),
  };

  useEffect(() => {
    stopwatchReset(
      stopWatchConfigs.offsetTimestamp,
      stopWatchConfigs.autoStart
    );
  }, [sub_category]);

  const { reset: stopwatchReset } = useStopwatch(stopWatchConfigs);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={1} alignItems="center">
        <Box>
          <Tooltip
            title={
              <Typography
                textTransform={'capitalize'}
                color="#fff"
                variant="caption"
              >
                {sub_category?.status.replace(/_/g, ' ')}
              </Typography>
            }
            arrow
          >
            <IconButton
              size="small"
              sx={{
                border: `1px solid ${
                  appColors.sub_category?.status[
                    _.camelCase(sub_category?.status.replace(/_/g, ' '))
                  ]
                }`,
                borderRadius: '0.1em',
                padding: '1px',
              }}
            >
              <SquareIcon
                onClick={(e) =>
                  handleOpen(
                    e,
                    'left',
                    'status',
                    statusList,
                    sub_category?.status_id,
                    sub_category?.rel_type,
                    sub_category?.id
                  )
                }
                sx={{
                  color:
                    appColors.status[
                      _.camelCase(sub_category?.status.replace(/_/g, ' '))
                    ],
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="Assignees" arrow>
            <Box
              onClick={(e) =>
                handleOpen(
                  e,
                  'left',
                  'assignees',
                  usersList,
                  sub_category?.assignees,
                  sub_category?.rel_type,
                  sub_category?.id
                )
              }
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {!_.isEmpty(sub_category?.assignees) ? (
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
                  {sub_category?.assignees.map((data, index) => {
                    return data?.avatar?.split('/').pop() !== 'thumb_' ||
                      !_.isEmpty(data?.avatar) ? (
                      <Avatar
                        sx={{ width: 24, height: 24 }}
                        alt={data?.name.toUpperCase()}
                        src={data?.avatar}
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
                        {`${data.name.toUpperCase().split(' ')[0][0]}${
                          data.name.toUpperCase().split(' ')[1][0]
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
        </Box>
        <Box>
          <Box
            component={Link}
            to={{
              pathname: `/subtask/${sub_category.id}`,
              state: {
                background: location,
                type: 'subtask',
                subtask: true,
              },
            }}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <Typography
              color="primary"
              sx={{
                ':hover': { color: '#f22076' },
              }}
              fontWeight={700}
              lineHeight={1.2}
            >
              {sub_category.name}
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box>
          <Tooltip title="Priority" arrow>
            <IconButton
              sx={{ fontSize: '1em' }}
              onClick={(e) =>
                handleOpen(
                  e,
                  'left',
                  'priority',
                  priorityList,
                  sub_category?.priority_id,
                  sub_category?.rel_type,
                  sub_category?.id
                )
              }
            >
              <AssistantPhotoIcon
                sx={{
                  color:
                    appColors.priority[
                      _.camelCase(
                        sub_category.priority_description == null
                          ? 'normal'
                          : sub_category?.priority_description.toLowerCase()
                      )
                    ],
                  width: '1.5em',
                  height: '1.5em',
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Stack direction="row">
            <IconButton
              size="small"
              sx={{
                padding: 0,
                '&:hover': { background: 'transparent' },
              }}
              onClick={() => handleDeleteSubtask(sub_category?.id)}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}

SubtaskList.propTypes = {
  sub_category: PropTypes.any,
  handlePlayPauseButtonClick: PropTypes.func,
  handleStopButtonClick: PropTypes.func,
  priorityList: PropTypes.any,
  usersList: PropTypes.any,
  statusList: PropTypes.any,
  status_id: PropTypes.any,
  rel_type: PropTypes.any,
  status: PropTypes.any,
  assigneesList: PropTypes.any,
  handleOpen: PropTypes.func,
  handleDeleteSubtask: PropTypes.func,
};
