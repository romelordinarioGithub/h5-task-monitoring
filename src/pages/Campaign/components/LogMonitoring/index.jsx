import _ from 'lodash';
import moment from 'moment';
import {
  Box,
  Button,
  Stack,
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
import ListAltIcon from '@mui/icons-material/ListAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PropTypes from 'prop-types';
import CustomSkeletonLoader from 'components/Common/Skeleton';

const StyledTimelineItem = styled(TimelineItem)({
  '&:before': {
    display: 'none',
  },
});

function LogMonitoring({ logs, user, isLoading, hasNextPage, onPaginate }) {
  // Process the raw API data structure
  const processedLogs = [];

  if (Array.isArray(logs)) {
    // Sort logs from latest to oldest
    const sortedLogs = [...logs].sort((a, b) => {
      const getDateKey = (obj) => Object.keys(obj)[0];
      const dateKeyA = getDateKey(a);
      const dateKeyB = getDateKey(b);

      const parseDateKey = (key) => {
        const dateStr = key.split(' - ')[0];
        return new Date(dateStr.replace(' @ ', ' '));
      };

      const dateA = parseDateKey(dateKeyA);
      const dateB = parseDateKey(dateKeyB);

      return dateB - dateA; // Latest first
    });

    sortedLogs.forEach((logEntry) => {
      Object.entries(logEntry).forEach(([dateUserKey, changes]) => {
        if (changes && changes.length > 0) {
          const [dateStr, userName] = dateUserKey.split(' - ');

          processedLogs.push({
            dateUserKey,
            dateStr,
            userName: userName ? userName.trim() : '',
            changes,
          });
        }
      });
    });
  }

  // Helper function to parse change text
  const parseChangeText = (changeText, fieldKey) => {
    let match = changeText.match(/(.+?)\s+was\s+updated from (.+) to (.+)/i);

    if (match) {
      return {
        fieldName: match[1].trim(),
        from: match[2].trim(),
        to: match[3].trim(),
      };
    }

    return null;
  };

  // Skeleton loader component for timeline
  const TimelineSkeleton = () => (
    <>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <StyledTimelineItem key={index}>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color="secondary" variant="outlined">
                <CustomSkeletonLoader
                  variant="circular"
                  width={24}
                  height={24}
                />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Stack spacing={1}>
                <Box>
                  <CustomSkeletonLoader height={24} width="30%" />
                  <CustomSkeletonLoader height={16} width="40%" />
                </Box>
                <Box ml={2} pl={1}>
                  <CustomSkeletonLoader height={20} width="80%" />
                  <CustomSkeletonLoader height={20} width="70%" />
                </Box>
              </Stack>
            </TimelineContent>
          </StyledTimelineItem>
        ))}
    </>
  );

  return (
    <Box>
      <Timeline>
        {isLoading && processedLogs.length === 0 ? (
          <TimelineSkeleton />
        ) : processedLogs.length > 0 ? (
          processedLogs.map((logGroup, groupIndex) => (
            <StyledTimelineItem key={groupIndex}>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="secondary" variant="outlined">
                  <InfoIcon color="secondary" />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Stack spacing={1}>
                  <Box>
                    <Typography
                      fontWeight={700}
                      color="primary"
                      variant="subtitle1"
                    >
                      {user && user.name === logGroup.userName
                        ? 'You'
                        : logGroup.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {moment(
                        logGroup.dateStr,
                        'MMM DD, YYYY @ hh:mm:ss a'
                      ).calendar()}
                    </Typography>
                  </Box>

                  {logGroup.changes.map((change, changeIndex) => (
                    <Box key={changeIndex} ml={2} pl={1}>
                      {Object.entries(change.changes).map(
                        ([fieldKey, changeText], fieldIndex) => {
                          const parsed = parseChangeText(changeText, fieldKey);
                          if (!parsed) return null;

                          return (
                            <Typography
                              key={fieldIndex}
                              variant="body2"
                              component="div"
                              mb={0.5}
                            >
                              <Typography component="span">
                                {change.order} {change.milestone_key} -{' '}
                              </Typography>
                              <Typography component="span"> </Typography>
                              <Typography
                                component="span"
                                fontWeight={700}
                                color="secondary"
                              >
                                {_.startCase(parsed.fieldName)}
                              </Typography>
                              <Typography component="span">
                                {' '}
                                was updated from{' '}
                              </Typography>
                              <Typography component="span" color="error">
                                {parsed.from}
                              </Typography>
                              <Typography component="span"> to </Typography>
                              <Typography
                                component="span"
                                sx={{ color: '#4caf50' }}
                              >
                                {parsed.to}
                              </Typography>
                            </Typography>
                          );
                        }
                      )}
                    </Box>
                  ))}
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
                  No activity log found for this campaign.
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

LogMonitoring.propTypes = {
  logs: PropTypes.array,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
  hasNextPage: PropTypes.bool,
  onPaginate: PropTypes.func,
};

export default LogMonitoring;
