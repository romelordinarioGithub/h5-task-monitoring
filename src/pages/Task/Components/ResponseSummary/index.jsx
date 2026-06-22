import { memo } from 'react';
// MUI Components
import { Box, Typography, Stack, Grid, Divider, Link } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';

const columns = [
  { field: 'created_at', headerName: 'Date Created' },
  {
    field: 'status',
    headerName: 'Status',
  },
  { field: 'assignee', headerName: 'Assignee' },
  {
    field: 'error_category',
    headerName: 'Error Category',
  },
  {
    field: 'reason',
    headerName: 'Reason',
  },
  {
    field: 'report_link',
    headerName: 'Report Link',
  },
  {
    field: 'driven',
    headerName: 'Driven Type',
  },
  {
    field: 'others',
    headerName: 'Sizes',
  },
  {
    field: 'notes',
    headerName: 'Notes',
  },
];

function ResponseSummary({ data }) {
  const rows = data
    .map((d) => ({
      created_at: d.created_at,
      id: d.user_id,
      status: d.status,
      assignee: d.user_name,
      error_category: d.error_category ?? null,
      reason: d.reason ?? null,
      report_link: d.report_link ?? null,
      driven: d.driven_type ?? null,
      notes: d.note ?? null,
      others: d.others ?? null,
    }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <Box
      sx={{
        m: 3,
        height: '500px',
        width: '845px',
        overflow: 'auto',
      }}
    >
      {columns?.map((column, key) => {
        return (
          <Stack key={key}>
            <Grid container sx={{ padding: '0.2em 0' }}>
              <Grid item xs={2}>
                <Typography fontWeight={700} variant="body2">
                  {column?.headerName}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Stack direction="row" spacing={1}>
                  {rows?.map((row, key) => {
                    return (
                      <Box key={key} width={200}>
                        {column?.field === 'error_category' ||
                        column?.field === 'reason' ? (
                          <Box>
                            <Typography variant="body2">
                              {!_.isEmpty(row[column?.field]) &&
                                row[column?.field]
                                  .split(',')
                                  .map((value, index) => (
                                    <li key={index}>{value}</li>
                                  ))}
                            </Typography>
                          </Box>
                        ) : column?.field === 'status' ? (
                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                row[column?.field] === 'Rejected'
                                  ? '#FF0000'
                                  : '#2ED47A',
                            }}
                            fontWeight={700}
                          >
                            {row[column?.field]}
                          </Typography>
                        ) : column?.field === 'report_link' ? (
                          <Link
                            href={row[column?.field]}
                            target="_blank"
                            sx={{ textDecoration: 'none', boxShadow: 'none' }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: 'pointer',
                                color: '#323338',
                                ':hover': {
                                  color: '#F22076',
                                },
                              }}
                            >
                              {row[column?.field]}
                            </Typography>
                          </Link>
                        ) : column?.field === 'created_at' ? (
                          <Typography variant="body2">
                            {moment(row[column?.field]).format(
                              'MM-DD-YYYY h:mm:ss A'
                            )}
                          </Typography>
                        ) : (
                          <Typography variant="body2">
                            {row[column?.field]}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Grid>
            </Grid>
            <Divider />
          </Stack>
        );
      })}
    </Box>
  );
}

export default memo(ResponseSummary);

ResponseSummary.propTypes = {
  data: PropTypes.any,
};
