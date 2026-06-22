import React from 'react';
import { Link } from 'react-router-dom';

import _ from 'lodash';
import 'assets/css/timesheet/overide.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import {
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
  Backdrop,
  CircularProgress
} from '@mui/material';

import PropTypes from 'prop-types';
import { formatDate } from 'utils/date';
import { appColors } from 'theme/variables';

export default function TableSheet({column,data,isConceptFetching, isCampaignFetching,filterStatTable}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', borderRadius: 2, position: "relative" }}>
        <Backdrop
              open={_.isEqual(filterStatTable,'concept') ? isConceptFetching : isCampaignFetching}
              sx={{
                position: "absolute",
                zIndex: 3,
                borderRadius: 2
              }}
            >
              <CircularProgress color="secondary" />
        </Backdrop>
      <TableContainer 
      sx={{
        borderRadius: 2,
        height: '28.9em',
        backgroundColor: '#eeeeee'
      }}
      >
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {column.map((column) => (
                <TableCell
                key={column.id}
                align="center"
                style={{
                  minWidth: column.minWidth,
                  [column.align]: 0,
                  background: column.isSticky && 'white',
                  zIndex: column.isSticky ? 2 : 1,
                  boxShadow:
                    column.isSticky &&
                    'rgb(136 136 136 / 60%) 0px 0px 6px 0px',
                  clipPath: column.isSticky && 'inset(0px -15px 0px 0px)',
                }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              backgroundColor: 'white',
            }}>
          {data
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  {column.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        position: column.isSticky ? 'sticky' : 'initial',
                        [column.align]: 0,
                        background: column.isSticky && 'white',
                        zIndex: column.isSticky ? 1 : 1,
                        boxShadow:
                          column.isSticky &&
                          'rgb(136 136 136 / 60%) 0px 0px 6px 0px',
                        clipPath:
                          column.isSticky && 'inset(0px -15px 0px 0px)',
                        textTransform: 'capitalize',
                        textAlign: column.align,
                      }}
                    >
                      {['concept_name','campaign_name'].includes(column?.id) && column?.isClickable ?
                        <Typography
                              variant="body2"
                              component={Link}
                              target="_blank" 
                              rel="noopener noreferrer"
                              to={row.concept_link ?? row.campaign_link}
                              // onClick={(e) =>
                              //   handleLink(
                              //     e,
                              //     row.concept_link ?? row.campaign_link ,
                              //   )
                              // }
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: '1',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                cursor:'pointer',
                                color: 'black',
                                ':hover': {
                                  color: '#F22076',
                                },
                                textDecoration: 'none'
                              }}
                            >
                            {row[column.id]}
                        </Typography>
                      :
                      ['created_at', 'updated_at'].includes(column?.id) ?
                      formatDate(row[column.id], "yyyy-MM-DD hh:mm:ss A")
                      :
                      ['status'].includes(column?.id) ?
                        <Box
                          sx={{backgroundColor: appColors?.status[
                             _.camelCase(row[column.id]?.replace(/_/g, ' ').toLowerCase())
                          ],
                          borderRadius: 1,
                          color:"white",
                          textAlign: 'center',
                          margin: 'auto',
                          width: "max-content",
                          py: ".3em",
                          px: ".5em"
                          }}>
                          {row[column.id].replace(/_/g, ' ')}
                        </Box>
                      :
                      row[column.id]}
                    </TableCell>
                  ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: 'flex',
          borderTop: '1px solid #ececec',
          justifyContent: 'flex-end',
          padding: '0 1em',
        }}
      >
      </Box>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={data.length ?? 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

TableSheet.propTypes = {
    column: PropTypes.any,
    data: PropTypes.any,
    isConceptFetching: PropTypes.any,
    isCampaignFetching: PropTypes.any,
    filterStatTable: PropTypes.any,
  };
  