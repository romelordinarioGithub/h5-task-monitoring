import _ from 'lodash';
import moment from 'moment';
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
import TimelapseIcon from '@mui/icons-material/Timelapse';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinkIcon from '@mui/icons-material/Link';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PropTypes from 'prop-types';

const StyledTimelineItem = styled(TimelineItem)({
  '&:before': {
    display: 'none',
  },
});

function TemplateLogs({
  logs,
  user,
  hasNextPage,
  isLoading,
  onPaginate,
  isCampaign,
}) {
  return (
    <Box>
      <Timeline>
        {logs?.length > 0 ? (
          logs?.map((data, index) => (
            <StyledTimelineItem key={index}>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="secondary" variant="outlined">
                  {data.type.includes('date') ? (
                    <CalendarMonthIcon color="secondary" />
                  ) : data.type.includes('sla') ? (
                    <TimelapseIcon color="secondary" />
                  ) : data.type.includes('dependencies') ? (
                    <LinkIcon color="secondary" />
                  ) : (
                    <InfoIcon color="secondary" />
                  )}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {!isCampaign && (
                    <Box>
                      {!_.isEmpty(data?.user?.avatar) &&
                      data?.user?.avatar?.split('/').pop() !== 'thumb_' ? (
                        <Avatar
                          alt={data?.user?.name}
                          src={data?.user?.avatar}
                        />
                      ) : (
                        <Avatar>
                          {`${data?.user?.name.split(' ')[0][0]}${
                            data?.user?.name.split(' ')[1][0]
                          }`}
                        </Avatar>
                      )}
                    </Box>
                  )}
                  <Box>
                    <Typography variant="subtitle1" component="span">
                      <Typography
                        fontWeight={700}
                        color="primary"
                        component="span"
                      >
                        {user?.id === data?.user?.user_id
                          ? 'You'
                          : data?.user?.name}
                      </Typography>
                      {` updated the `}
                      <Typography
                        component="span"
                        fontWeight={700}
                        textTransform="capitalize"
                        color="secondary"
                      >
                        {`${data.type.replace(/_/g, ' ')}`}
                      </Typography>
                      {` from `}
                      <Typography
                        component="span"
                        textTransform="capitalize"
                        color="error"
                      >
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
                    <Typography variant="caption" component="div">
                      {moment(data.date_updated).calendar()}
                    </Typography>
                  </Box>
                </Stack>
              </TimelineContent>
            </StyledTimelineItem>
          ))
        ) : (
          <Card
            variant="outlined"
            sx={{ backgroundColor: 'transparent', border: 0 }}
          >
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
                  No activity log found for this milestone.
                </Typography>
              </Box>
            </Stack>
          </Card>
        )}
      </Timeline>
      {hasNextPage && (
        <Stack alignItems="center" spacing={-2.5} mt={1}>
          {isLoading ? (
            <Box alignItems="center">
              <CircularProgress color="primary" size={20} />
            </Box>
          ) : (
            <>
              <Button
                sx={{ fontSize: '0.7em', fontWeight: 600, pb: 1.8 }}
                onClick={onPaginate}
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

TemplateLogs.propTypes = {
  logs: PropTypes.array,
  user: PropTypes.object,
  hasNextPage: PropTypes.bool,
  isLoading: PropTypes.bool,
  onPaginate: PropTypes.func,
  isCampaign: PropTypes.bool,
};

export default TemplateLogs;
