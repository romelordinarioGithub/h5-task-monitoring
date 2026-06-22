import React, { useContext } from 'react';
import { Box, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import AdminPanelContext from 'pages/AdminPanel/context';
import Categories from 'pages/AdminPanel/components/Categories';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

export default function Main() {
  const { errorCategory, fetching, handleDeleteErrorCategory, handleDialog } =
    useContext(AdminPanelContext);

  return (
    <Box
      sx={{
        overflowY: 'auto',
        height: 'calc(100vh - 50px)',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Stack py={2} sx={{ width: '900px' }}>
        <Box display={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={800}>
            Admin Panel
          </Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <Tooltip title="Add Category" disableInteractive arrow>
              <IconButton
                size="small"
                sx={{ color: '#5025C4' }}
                onClick={() => handleDialog('add_category', { parent_id: 0 })}
              >
                <AddCircleOutlineOutlinedIcon sx={{ fontSize: '1.2em' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {!fetching
          ? errorCategory?.data?.map((category) => (
              <Box key={category?.id}>
                <Categories
                  category={category}
                  handleDeleteErrorCategory={handleDeleteErrorCategory}
                  handleDialog={handleDialog}
                />
              </Box>
            ))
          : null}
      </Stack>
    </Box>
  );
}
