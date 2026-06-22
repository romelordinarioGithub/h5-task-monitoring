import React, { useState } from 'react';
import {
  Box,
  Typography,
  styled,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

const StyledBox = styled(Box)({
  margin: '0px 2px 2px 0',
  padding: '0px 6px 0px',
  height: '35px',
  backgroundColor: '#e6e6e6',
  display: 'flex',
  alignItems: 'center',
});

export default function Categories({
  category,
  handleDialog,
  handleDeleteErrorCategory,
}) {
  const [open, setOpen] = useState(true);
  return (
    <Box key={category?.id}>
      <StyledBox>
        <IconButton
          size="small"
          onClick={() => setOpen((prev) => !prev)}
          sx={{ padding: 0 }}
        >
          {open ? (
            <IndeterminateCheckBoxOutlinedIcon />
          ) : (
            <AddBoxOutlinedIcon />
          )}
        </IconButton>
        <Typography sx={{ paddingLeft: '5px' }} fontWeight={800}>
          {category?.name}
        </Typography>
        <Box sx={{ marginLeft: 'auto' }}>
          <Tooltip
            title={`Add ${category?.name} Type`}
            disableInteractive
            arrow
          >
            <IconButton
              size="small"
              onClick={() => handleDialog('add_type', category)}
            >
              <AddCircleOutlineOutlinedIcon sx={{ color: '#5025C4' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Delete ${category?.name}`} disableInteractive arrow>
            <IconButton
              size="small"
              onClick={() =>
                handleDeleteErrorCategory(category?.name, category?.id)
              }
            >
              <DeleteOutlineOutlinedIcon sx={{ color: '#F2445C' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </StyledBox>
      <Collapse in={open}>
        {category?.sub_categories.map((sub) => (
          <Box
            key={sub?.id}
            sx={{
              borderLeft: '1px dashed #757575',
              position: 'relative',
              margin: '0px 2px 2px 0',
              padding: '0px 6px 0px',
              backgroundColor: '#f2f5f9',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '.9em',
              borderBottom: '1px dashed #757575',
            }}
          >
            <Typography sx={{ paddingLeft: '10px' }}>{sub?.name}</Typography>
            <Box sx={{ marginLeft: 'auto' }}>
              <Tooltip title={`Edit`} disableInteractive arrow>
                <IconButton
                  size="small"
                  onClick={() => handleDialog('edit_type', sub)}
                >
                  <EditOutlinedIcon sx={{ color: '#1e0032' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Delete`} disableInteractive arrow>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteErrorCategory(sub?.name, sub?.id)}
                >
                  <DeleteOutlineOutlinedIcon sx={{ color: '#F2445C' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}
      </Collapse>
    </Box>
  );
}

Categories.propTypes = {
  category: PropTypes.object,
  handleDeleteErrorCategory: PropTypes.func,
  handleDialog: PropTypes.func,
};
