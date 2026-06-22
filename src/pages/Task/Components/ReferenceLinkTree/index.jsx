import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import {
  Box,
  IconButton,
  styled,
  Tooltip,
  Typography,
  Checkbox,
  Collapse,
} from '@mui/material';

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

const StyledBox = styled(Box)({
  margin: '0px 2px 2px 0',
  padding: '0px 6px 0px',
  height: '35px',
  backgroundColor: '#e6e6e6',
  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'center',
});

const StyledCollapse = styled(Collapse)({
  borderLeft: '1px dashed #757575',
  paddingLeft: '2em',
  marginLeft: '0.5em',
});

export default function ReferenceLinkTree({
  handleDeleteReferenceLink,
  handleDialogOpen,
  handleOnChangeCheckbox,
  handleOnChangeSelectAllCheckbox,
  handleOpenReferenceLinksLogs,
  link,
  selectedRows,
}) {
  const [open, setOpen] = useState(true);

  const linkIds = link?.items.map((data) => data?.id);

  return (
    <Box mb="8px" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center">
        <IconButton
          size="small"
          sx={{ padding: 0, marginRight: '0.5em' }}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            <IndeterminateCheckBoxOutlinedIcon />
          ) : (
            <AddBoxOutlinedIcon />
          )}
        </IconButton>

        <StyledTypography
          fontWeight={800}
          variant="h6"
          component={Link}
          to={
            link?.task_type_link?.includes('project')
              ? link?.task_type_link + '/overview'
              : link?.task_type_link
          }
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            cursor: 'pointer',
            color: '#3b3338',
            textDecoration: 'none',
            ':hover': {
              textDecoration: 'underline',
              color: '#F22076',
            },
          }}
        >
          {link?.name}
        </StyledTypography>
      </Box>

      <StyledCollapse in={open}>
        <Box display="flex" justifyContent="space-between">
          <Box margin="0px 0px 0px 10px" display="flex">
            <Checkbox
              sx={{ transform: 'scale(1.15)', margin: '0px 10px 0px 0px' }}
              color="secondary"
              checked={_.difference(linkIds, selectedRows).length === 0}
              onChange={() => handleOnChangeSelectAllCheckbox(linkIds)}
              inputProps={{
                'aria-label': 'select all',
              }}
            />
            <StyledTypography
              variant="body2"
              fontWeight={700}
              sx={{ margin: '8px 0px 0px 4px' }}
            >
              Reference Link
            </StyledTypography>
          </Box>
          <Box margin="8px 28px 0px 0">
            <StyledTypography variant="body2" fontWeight={700}>
              Actions
            </StyledTypography>
          </Box>
        </Box>
        {link?.items.map((data) => (
          <Box key={data?.id} display="flex">
            <StyledBox
              width={50}
              borderLeft="4px solid #5C52C3"
              sx={{
                justifyContent: 'flex-start',
                textDecoration: 'none',
                ':hover': {
                  backgroundColor: '#c9c6c6b0',
                },
              }}
            >
              <Checkbox
                sx={{ transform: 'scale(1.15)' }}
                color="primary"
                checked={_.some(selectedRows, (r) => r === data?.id)}
                onChange={() => handleOnChangeCheckbox(data.id)}
                inputProps={{
                  'aria-label': 'select all',
                }}
              />
            </StyledBox>
            <Tooltip
              title={`Created by ${data.created_by}`}
              disableInteractive
              arrow
              placement="bottom-start"
              slotProps={{
                arrow: {
                  sx: {
                    position: 'absolute',
                    left: '6px !important',
                    transform: 'translate(0px, 0px) !important',
                  },
                },
              }}
            >
              <StyledBox sx={{ width: '100%' }}>
                <StyledTypography
                  noWrap
                  fontSize="13px"
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'none',
                    ':hover': {
                      textDecoration: 'underline',
                      color: '#F22076',
                    },
                    width: '440px',
                  }}
                  component="a"
                  href={data?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.name}
                </StyledTypography>
              </StyledBox>
            </Tooltip>
            <StyledBox
              width={120}
              sx={{
                justifyContent: 'center',
                textDecoration: 'none',
                ':hover': {
                  backgroundColor: '#c9c6c6b0',
                },
              }}
            >
              <Box>
                <Tooltip title={`View Logs`} disableInteractive arrow>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenReferenceLinksLogs(data?.id)}
                  >
                    <VisibilityIcon sx={{ color: '#1e0032' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={`Edit`} disableInteractive arrow>
                  <IconButton
                    size="small"
                    onClick={() => handleDialogOpen(data)}
                  >
                    <EditOutlinedIcon sx={{ color: '#1e0032' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={`Delete`} disableInteractive arrow>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteReferenceLink(data?.id, 1, 1000)}
                  >
                    <DeleteOutlineOutlinedIcon sx={{ color: '#F2445C' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </StyledBox>
          </Box>
        ))}
      </StyledCollapse>
    </Box>
  );
}

ReferenceLinkTree.propTypes = {
  link: PropTypes.any,
  selectedRows: PropTypes.any,
  handleDeleteReferenceLink: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  handleOnChangeCheckbox: PropTypes.func,
  handleOnChangeSelectAllCheckbox: PropTypes.func,
  handleOpenReferenceLinksLogs: PropTypes.func,
};
