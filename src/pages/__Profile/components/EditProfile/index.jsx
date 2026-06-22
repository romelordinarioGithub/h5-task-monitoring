import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Divider,
  CardContent,
  Button,
  styled,
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

const StyledCard = styled(Card)({
  '&.MuiPaper-root': {
    borderRadius: '10px',
    boxShadow:
      'rgba(159, 162, 191, 0.18) 0px 9px 16px, rgba(159, 162, 191, 0.32) 0px 2px 2px',
  },
});

export default function EditProfile() {
  return (
    <Grid container spacing={3}>
      {/* Personal Info */}
      <Grid item xs={12}>
        <StyledCard>
          <Box
            sx={{
              padding: '27px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ width: { xs: '280px', md: 'inherit' } }}>
              <Typography variant="h5" color="primary" fontWeight={800}>
                Personal Details
              </Typography>
              <Typography variant="subtitle1">
                Manage information related to your personal details
              </Typography>
            </Box>
            <Button
              startIcon={<EditTwoToneIcon />}
              color="secondary"
              sx={{ padding: '9px 16px' }}
            >
              Edit
            </Button>
          </Box>
          <Divider />
          <CardContent>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                sx={{
                  textAlign: { xs: 'left', sm: 'right' },
                  paddingRight: '27px',
                }}
              >
                Name:
              </Grid>
              <Grid item xs={12} sm={8} md={9} sx={{ fontWeight: 800 }}>
                Lorenciano Dramayo
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                sx={{
                  textAlign: { xs: 'left', sm: 'right' },
                  paddingRight: '27px',
                }}
              >
                Email:
              </Grid>
              <Grid item xs={12} sm={8} md={9} sx={{ fontWeight: 800 }}>
                lorenciano.dramayo@smartly.io
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                sx={{
                  textAlign: { xs: 'left', sm: 'right' },
                  paddingRight: '27px',
                }}
              >
                Team:
              </Grid>
              <Grid item xs={12} sm={8} md={9} sx={{ fontWeight: 800 }}>
                Creative Developer
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                sx={{
                  textAlign: { xs: 'left', sm: 'right' },
                  paddingRight: '27px',
                }}
              >
                Role:
              </Grid>
              <Grid item xs={12} sm={8} md={9} sx={{ fontWeight: 800 }}>
                Member
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      </Grid>
      {/* Account Settings */}
      <Grid item xs={12}>
        <StyledCard>
          <Box
            sx={{
              padding: '27px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h5" color="primary" fontWeight={800}>
                Account Settings
              </Typography>
              <Typography variant="subtitle1">
                Manage details related to your account
              </Typography>
            </Box>
            <Button
              startIcon={<EditTwoToneIcon />}
              color="secondary"
              sx={{ padding: '9px 16px' }}
            >
              Edit
            </Button>
          </Box>
          <Divider />
          <CardContent>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                sx={{
                  textAlign: { xs: 'left', sm: 'right' },
                  paddingRight: '27px',
                }}
              >
                Region:
              </Grid>
              <Grid item xs={12} sm={8} md={9} sx={{ fontWeight: 800 }}>
                EMEA
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                sx={{
                  textAlign: { xs: 'left', sm: 'right' },
                  paddingRight: '27px',
                }}
              >
                Timezone:
              </Grid>
              <Grid item xs={12} sm={8} md={9} sx={{ fontWeight: 800 }}>
                GMT+2
              </Grid>
            </Grid>

            <Grid container>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                sx={{
                  textAlign: { xs: 'left', sm: 'right' },
                  paddingRight: '27px',
                }}
              >
                Start Day:
              </Grid>
              <Grid item xs={12} sm={8} md={9} sx={{ fontWeight: 800 }}>
                Monday - Friday
              </Grid>
            </Grid>

            <Grid container>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                sx={{
                  textAlign: { xs: 'left', sm: 'right' },
                  paddingRight: '27px',
                }}
              >
                Start Time:
              </Grid>
              <Grid item xs={12} sm={8} md={9} sx={{ fontWeight: 800 }}>
                3:30 PM - 12:30 AM
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      </Grid>
      {/* Subscribe a Partner */}
      <Grid item xs={12}>
        <StyledCard>
          <Box
            sx={{
              padding: '27px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ width: { xs: '280px', md: 'inherit' } }}>
              <Typography variant="h5" color="primary" fontWeight={800}>
                Subscribe a Partner
              </Typography>
              <Typography variant="subtitle1">
                This function lets you see the data related to your subscribed
                partner.
              </Typography>
            </Box>
            <Button
              startIcon={<EditTwoToneIcon />}
              color="secondary"
              sx={{ padding: '9px 16px' }}
            >
              Edit
            </Button>
          </Box>
          <Divider />
          <CardContent>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                sx={{
                  textAlign: { xs: 'left', sm: 'right' },
                  paddingRight: '27px',
                }}
              >
                Partner:
              </Grid>
              <Grid item xs={12} sm={8} md={9} sx={{ fontWeight: 800 }}>
                Specsavers
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      </Grid>
      {/* Change Password */}
      <Grid item xs={12}>
        <StyledCard>
          <Box
            sx={{
              padding: '27px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ width: { xs: '280px', md: 'inherit' } }}>
              <Typography variant="h5" color="primary" fontWeight={800}>
                Change Password
              </Typography>
              <Typography variant="subtitle1">
                Password must be at least 6 characters.
              </Typography>
            </Box>
            <Button
              startIcon={<EditTwoToneIcon />}
              color="secondary"
              sx={{ padding: '9px 16px' }}
            >
              Edit
            </Button>
          </Box>
        </StyledCard>
      </Grid>
    </Grid>
  );
}
