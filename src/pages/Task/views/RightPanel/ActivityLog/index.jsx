import moment from 'moment';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTaskActivityLogs,
  getPaginatedTaskActivityLogs,
} from 'store/reducers/tasks';
import {
  Box,
  Button,
  Stack,
  Avatar,
  Typography,
  Card,
  IconButton,
  styled,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { CircularProgress } from '@material-ui/core';
import InfoIcon from '@mui/icons-material/Info';
import FlagIcon from '@mui/icons-material/Flag';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useOnMount } from 'hooks';
import _ from 'lodash';

const StyledTimelineItem = styled(TimelineItem)({
  '&:before': {
    display: 'none',
  },
});

const renderLog = (user, data) => {
  const action = data.action?.toLowerCase();
  const type = data.type?.toLowerCase();
  const vote = type === 'thread' && _.first(data?.to.split(' at '));
  const date = type === 'thread' && _.last(data?.to.split(' at '));

  switch (type) {
    case 'timer':
      return (
        <>
          <Typography fontWeight={700} color="primary" component="span">
            {user?.id == data?.user?.user_id ? 'You' : data?.user?.name}
          </Typography>
          {action === 'start_timer' ? ' started working on ' : ' spent '}
          {action === 'stop_timer' && (
            <Typography
              component="span"
              fontWeight={700}
              textTransform="capitalize"
              color="secondary"
            >
              {`${data.from}`}
            </Typography>
          )}
          {action === 'start_timer' ? '' : ' on '}
          <Typography
            component="span"
            fontWeight={700}
            textTransform="capitalize"
            color="secondary"
          >
            {`${data.to}`}
          </Typography>
        </>
      );
    case 'thread':
      return (
        <>
          <Typography fontWeight={700} color="primary" component="span">
            {user?.id == data?.user?.user_id ? 'You' : data?.user?.name}
          </Typography>
          <Typography
            component="span"
            sx={{ color: vote === 'Rejected' ? '#F2445C' : '#4caf50' }}
          >
            {` ${vote} `}
          </Typography>
          the
          <Typography
            component="span"
            fontWeight={700}
            textTransform="capitalize"
            color="secondary"
          >
            {` ${type} `}
          </Typography>
          created at {moment(date).format('MMMM DD yyyy [at] h:m A')}
        </>
      );

    default:
      return action === 'update' ? (
        <Typography variant="subtitle1" component="span">
          <Typography fontWeight={700} color="primary" component="span">
            {user?.id == data?.user?.user_id ? 'You' : data?.user?.name}
          </Typography>
          {` updated the `}
          <Typography
            component="span"
            fontWeight={700}
            textTransform="capitalize"
            color="secondary"
          >
            {`${data.type?.replace(/_/g, ' ')}`}
          </Typography>
          {` from `}
          <Typography component="span" textTransform="capitalize" color="error">
            {data?.type?.includes('date')
              ? moment(data.from).format('LLL')
              : `${data?.from?.replace(/_/g, ' ')}`}
          </Typography>
          {` to `}
          <Typography
            component="span"
            textTransform="capitalize"
            sx={{ color: '#4caf50' }}
          >
            {data?.type?.includes('date')
              ? moment(data.to).format('LLL')
              : `${data?.to}`.replace(/_/g, ' ')}
          </Typography>
        </Typography>
      ) : action === 'qa_error_tag_remove' ? (
        <Typography variant="subtitle1" component="span">
          <Typography fontWeight={700} color="primary" component="span">
            {user?.id == data?.user?.user_id ? 'You' : data?.user?.name}
          </Typography>
          {data?.to.toLowerCase() !== 'clear' && ' removed'}
          <Typography component="span" textTransform="capitalize" color="error">
            {' '}
            {data?.to.toLowerCase() === 'clear' ? 'cleared' : data?.to}
          </Typography>
          {data?.to.toLowerCase() === 'clear' ? ' the ' : ' from '}
          <Typography
            component="span"
            fontWeight={700}
            textTransform="capitalize"
            color="secondary"
          >
            {`${data.type?.replace(/_/g, ' ')}`}
          </Typography>
          {data?.to.toLowerCase() === 'clear' && ' from all threads '}
        </Typography>
      ) : (
        <Typography variant="subtitle1" component="span">
          <Typography fontWeight={700} color="primary" component="span">
            {user?.id == data?.user?.user_id ? 'You' : data?.user?.name}
          </Typography>
          {action === 'add'
            ? ' added '
            : action === 'remove'
            ? ' removed '
            : ' created '}
          <Typography component="span" textTransform="capitalize" color="error">
            {action === 'add'
              ? data?.to?.replace(/_/g, ' ')
              : data?.from?.replace(/_/g, ' ')}
          </Typography>
          {action === 'add'
            ? ' to '
            : action === 'remove'
            ? ' from '
            : ' this '}
          <Typography
            component="span"
            fontWeight={700}
            textTransform="capitalize"
            color="secondary"
          >
            {`${data.type?.replace(/_/g, ' ')}`}
          </Typography>
        </Typography>
      );
  }
};

export default function ActivityLog() {
  const { taskId } = useParams();
  const dispatch = useDispatch();

  const { overview, activityLogs, isLoadingActivityLogs } = useSelector(
    (state) => state.tasks
  );
  const { data: user } = useSelector((state) => state.user);

  useOnMount(() => {
    dispatch(getTaskActivityLogs(taskId, overview.rel_type));
  });

  const handleOnPaginate = () => {
    dispatch(
      getPaginatedTaskActivityLogs(
        taskId,
        overview.rel_type,
        activityLogs.current_page + 1
      )
    );
  };

  const hasNextPage =
    !_.isNull(activityLogs?.next_page_url) && !_.isEmpty(activityLogs?.data);

  return (
    <Box>
      <Timeline>
        {activityLogs.data?.length > 0 ? (
          activityLogs.data?.map((data, index) => (
            <StyledTimelineItem key={index}>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="secondary" variant="outlined">
                  {data?.type?.includes('date') ? (
                    <CalendarMonthIcon color="secondary" />
                  ) : data.type === 'priority' ? (
                    <FlagIcon color="secondary" />
                  ) : (
                    <InfoIcon color="secondary" />
                  )}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box>
                    {!_.isEmpty(data?.user?.avatar) &&
                    data?.user?.avatar?.split('/').pop() !== 'thumb_' ? (
                      <Avatar alt={data?.user?.name} src={data?.user?.avatar} />
                    ) : (
                      <Avatar>
                        {`${data?.user?.name.split(' ')[0][0]}${
                          data?.user?.name.split(' ')[1][0]
                        }`}
                      </Avatar>
                    )}
                  </Box>
                  <Box>
                    {renderLog(user, data)}
                    <Typography variant="caption" component="div">
                      {moment(data.date_updated).calendar()}
                    </Typography>
                  </Box>
                </Stack>
              </TimelineContent>
            </StyledTimelineItem>
          ))
        ) : (
          <Card variant="outlined" sx={{ borderStyle: 'dashed' }}>
            <Stack alignItems="center" p={3}>
              <Box>
                <IconButton
                  size="large"
                  color="error"
                  disableRipple
                  disableTouchRipple
                  disableFocusRipple
                  sx={{ backgroundColor: '#f2445c1a' }}
                >
                  <ListAltIcon />
                </IconButton>
              </Box>
              <Box>
                <Typography fontWeight={700} color="#999999">
                  No activity log found for this task.
                </Typography>
              </Box>
            </Stack>
          </Card>
        )}
      </Timeline>
      {hasNextPage && (
        <Stack alignItems="center" spacing={-2.5} mt={1}>
          {isLoadingActivityLogs ? (
            <Box alignItems="center">
              <CircularProgress color="primary" size={20} />
            </Box>
          ) : (
            <>
              <Button
                sx={{ fontSize: '0.7em', fontWeight: 600, pb: 1.8 }}
                onClick={handleOnPaginate}
              >
                See more
              </Button>
              <KeyboardArrowDownIcon />
            </>
          )}
        </Stack>
      )}
    </Box>
  );
}
