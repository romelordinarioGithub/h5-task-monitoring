import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Grid,
  Typography,
  Divider,
  styled,
  Tooltip,
  Chip,
  Stack,
  Box,
} from '@mui/material';
import { formatDate } from 'utils/date';
import _ from 'lodash';

const StyledTypography = styled(Typography)`
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StyledPaper = styled(Paper)`
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  box-shadow: 0 16px 40px -28px rgba(15, 23, 42, 0.45);
`;

export default function Table({
  tickets,
  hover,
  setHover,
  tableHeader,
  onSelectRow,
}) {
  return (
    <StyledPaper>
      <Grid container sx={{ padding: '0.75em 1em', background: '#f8f9fc' }}>
        {tableHeader?.map((data, index) => (
          <Grid item xs={data?.size} key={index}>
            <StyledTypography color="#94a0b8" variant="button" fontWeight={800}>
              {data?.name}
            </StyledTypography>
          </Grid>
        ))}
      </Grid>
      <Divider />
      {_.isEmpty(tickets?.data) ? (
        <Box my={2} sx={{ textAlign: 'center' }}>
          <Typography variant="span" sx={{ color: '#717182', fontWeight: 600 }}>
            No Results Found!
          </Typography>
        </Box>
      ) : (
        tickets?.data?.map((ticket, index) => (
          <Grid
            container
            sx={{
              padding: '0.5em 1em',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              backgroundColor: hover === index ? '#faf9ff' : '#ffffff',
              boxShadow:
                hover === index &&
                'inset 3px 0 0 #7c3aed, 0 10px 28px -24px rgba(124, 58, 237, 0.45)',
              transition: 'background-color 160ms ease, box-shadow 160ms ease',
            }}
            key={index}
            spacing={1}
            onMouseOver={() => setHover(index)}
            onMouseOut={() => setHover(null)}
          >
            {tableHeader?.map((data, index) => {
              switch (data?.name?.toLowerCase()) {
                case 'subject':
                  return (
                    <Grid item xs={data?.size} key={index}>
                      <Tooltip title={ticket[data?.key] ?? '-'} arrow>
                        <StyledTypography
                          color="#374151"
                          // component={Link}
                          // to={{
                          //   pathname: `https://ad-weave.io/crm/forms/tickets/${ticket?.ticketkey}`,
                          // }}
                          onClick={() => onSelectRow(ticket)}
                          target="_blank"
                          sx={{
                            textDecoration: 'none',
                            ':hover': {
                              color: '#7c3aed',
                              cursor: 'pointer',
                            },
                          }}
                        >
                          {ticket[data?.key]}
                        </StyledTypography>
                      </Tooltip>
                    </Grid>
                  );
                case 'last reply':
                case 'created':
                  return (
                    <Grid item xs={data?.size} key={index}>
                      <Tooltip
                        title={formatDate(
                          ticket[data?.key] ?? '-',
                          'ddd, MMM DD hh:mm a'
                        )}
                        arrow
                      >
                        <StyledTypography color="#6b7280">
                          {formatDate(
                            ticket[data?.key] ?? '-',
                            'ddd, MMM DD hh:mm a'
                          )}
                        </StyledTypography>
                      </Tooltip>
                    </Grid>
                  );

                case 'tags':
                  return (
                    <Grid
                      item
                      xs={data?.size}
                      key={index}
                      sx={{ overflow: 'hidden' }}
                    >
                      <Stack direction="row" spacing={1}>
                        {_.isEmpty(ticket[data?.key])
                          ? '-'
                          : ticket[data?.key]?.map((tag) => (
                              <Chip
                                size="small"
                                key={tag?.id}
                                label={tag?.name}
                                sx={{
                                  borderRadius: '999px',
                                  backgroundColor: '#ede9fe',
                                  color: '#6d28d9',
                                  fontWeight: 700,
                                }}
                              />
                            ))}
                      </Stack>
                    </Grid>
                  );
                default:
                  return (
                    <Grid item xs={data?.size} key={index}>
                      <Tooltip title={ticket[data?.key] ?? '-'} arrow>
                        <StyledTypography color="#6b7280">
                          {ticket[data?.key] ?? '-'}
                        </StyledTypography>
                      </Tooltip>
                    </Grid>
                  );
              }
            })}
          </Grid>
        ))
      )}
    </StyledPaper>
  );
}

Table.propTypes = {
  tickets: PropTypes.any,
  hover: PropTypes.any,
  setHover: PropTypes.func,
  tableHeader: PropTypes.array,
  onSelectRow: PropTypes.any,
};
