import React from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// Hooks
import useRouteGuard from 'hooks/useRouteGuard';
// Reducers
import { login as loginRequest } from 'store/reducers/auth';

//reuseable
import Button from 'components/Common/Button';

import { Typography, Card, Box, styled } from '@mui/material';

import googleChannel from 'assets/smartly/icons/google.svg';
import 'assets/css/login/icon-font.css';

import CircularProgress from '@mui/material/CircularProgress';

const BackgroundBox = styled(Box)({
  backgroundColor: '#19022A',
  // background: 'linear-gradient(25deg, rgb(85 10 97) 0%, rgba(41,19,91,1) 100%)',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function Login() {
  const methods = useForm();
  const dispatch = useDispatch();

  useRouteGuard();

  //destructured
  const { handleSubmit } = methods;

  //reducers-value
  const { isLoading, error } = useSelector((state) => state.auth);

  //functions
  const onSubmit = (data) => {
    dispatch(loginRequest(data));
  };

  return (
    <BackgroundBox>
      <Card
        sx={{
          width: 460,
          boxShadow: '0px 12px 10px rgb(0 0 0 / 0.2)',
          paddingY: '34px',
          paddingX: '10px',
        }}
      >
        <Box>
          <FormProvider {...methods}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '24px',
                  paddingBottom: '26px',
                  fontWeight: '600',
                  fontFamily: 'Roc Grotesk',
                }}
                fontWeight={600}
                color="primary"
              >
                <span className="icon-smartly" />
                Ad-Weave.io
              </Typography>
              <Typography
                sx={{
                  fontSize: '20px',
                  paddingBottom: '24px',
                  fontWeight: '600',
                  fontFamily: 'Roc Grotesk',
                }}
                color="primary"
              >
                Welcome Back!
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Roc Grotesk',
                }}
                color="error"
              >
                {error}
              </Typography>
            </Box>
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <Box px={8}>
                <Box marginLeft="auto">
                  <Button
                    type="submit"
                    variant="outlined"
                    color="secondary"
                    disabled={isLoading}
                    sx={{
                      width: '100%',
                      color: '#000',
                      '&.MuiButton-outlinedSecondary': {
                        border: '#7327DD solid pink',
                        borderRadius: '0',
                      },
                      outline: '',
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: '#8642E2',
                      },
                      fontFamily: 'Roc Grotesk',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress
                          sx={{ marginRight: '10px' }}
                          size="25px"
                        />
                        Awaiting email verification
                      </>
                    ) : (
                      <>
                        <img
                          style={{ width: '25px', marginRight: '10px' }}
                          src={googleChannel}
                          alt="google"
                        />
                        Continue with Google
                      </>
                    )}
                  </Button>
                </Box>
              </Box>
            </form>
          </FormProvider>
        </Box>
      </Card>
    </BackgroundBox>
  );
}
