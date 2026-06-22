import { useHistory } from 'react-router-dom';

import { Box, Stack, Typography, Button, IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

import cover from 'assets/cover.svg';

export default function Success() {
  const history = useHistory();

  const handleOnClose = () => {
    history.go(0);
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: '100vh',
        backgroundImage: `url(${cover})`,
        backgroundSize: 'cover',
        backgroundPositionX: 'center',
      }}
    >
      <Box mb={3}>
        <IconButton
          size="large"
          sx={{
            width: '4em',
            height: '4em',
            backgroundColor: '#52c41a',
            '&:hover': { backgroundColor: '#52c41a' },
          }}
        >
          <DoneIcon sx={{ width: 'auto', height: 'auto', color: '#fff' }} />
        </IconButton>
      </Box>
      <Typography variant="h4" color="#fff" fontWeight={700}>
        Custom Campaign Created Successfully!
      </Typography>
      <Typography color="#a3a3a4">
        Updating of details will be done in the campaign.
      </Typography>
      <Stack mt={2} direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={handleOnClose}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
          Close
        </Button>
      </Stack>
    </Stack>
  );
}
