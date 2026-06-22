import React from 'react';

import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment';
import {
  Box,
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

import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import ListAltIcon from '@mui/icons-material/ListAlt';

const StyledTimelineItem = styled(TimelineItem)({
  '&:before': {
    display: 'none',
  },
});

export default function ReferenceLogs({ value, onClose }) {
  return (
    <Box width={600} py={2} px={3} height={500} sx={{ overflow: 'hidden' }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={800} color="primary">
          Logs
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </Box>
      {_.isEmpty(value) ? (
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
                No log found for this link.
              </Typography>
            </Box>
          </Stack>
        </Card>
      ) : (
        <Box
          width={575}
          height={445}
          sx={{ overflowX: 'hidden', overflowY: 'auto' }}
        >
          <Timeline>
            {value.map((data, index) => (
              <StyledTimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color="secondary" variant="outlined">
                    <InfoIcon color="secondary" />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>
                      <Typography variant="subtitle1" component="span">
                        <Typography
                          fontWeight={700}
                          color="primary"
                          component="span"
                          noWrap
                        >
                          {data?.updated_by}
                        </Typography>
                        {` updated the `}
                        <Typography
                          component="span"
                          fontWeight={700}
                          textTransform="capitalize"
                          color="secondary"
                        >
                          link
                        </Typography>
                        {` from `}
                        <Typography
                          component={
                            /^https?:\/\//.test(data['old value'])
                              ? 'a'
                              : 'span'
                          }
                          fontWeight={700}
                          color="error"
                          sx={{
                            maxWidth: '460px',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            height: '25px',
                          }}
                          noWrap
                          href={data['old value']}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {data['old value']}
                        </Typography>
                        {' to '}
                        <Typography
                          component={
                            /^https?:\/\//.test(data['new value'])
                              ? 'a'
                              : 'span'
                          }
                          sx={{
                            color: '#4caf50',
                            maxWidth: '460px',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            height: '25px',
                          }}
                          fontWeight={700}
                          href={data['new value']}
                          target="_blank"
                          rel="noopener noreferrer"
                          noWrap
                        >
                          {data['new value']}
                        </Typography>
                      </Typography>

                      <Typography variant="caption" component="div">
                        {moment(data.updated_at).calendar()}
                      </Typography>
                    </Box>
                  </Stack>
                </TimelineContent>
              </StyledTimelineItem>
            ))}
          </Timeline>
        </Box>
      )}
    </Box>
  );
}

ReferenceLogs.propTypes = {
  value: PropTypes.any,
  onClose: PropTypes.func,
};
