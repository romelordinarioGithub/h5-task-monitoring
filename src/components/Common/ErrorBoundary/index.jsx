import React from 'react';
import PropTypes from 'prop-types';
import { Button, Stack, Typography } from '@mui/material';
import ErrorOutlineTwoToneIcon from '@mui/icons-material/ErrorOutlineTwoTone';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  refreshPage = () => {
    window
      .open('https://app.slack.com/client/T010SNN2LSJ/C051DBYG07K', '_blank')
      .focus();
  };
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ width: 1, height: '100vh' }}
          spacing={3}
        >
          <ErrorOutlineTwoToneIcon sx={{ fontSize: '15em' }} color="error" />
          <Typography variant="h5">
            Oops! There seems to be a problem. Please try again later.
          </Typography>
          <Button variant="contained" onClick={this.refreshPage}>
            Report
          </Button>
        </Stack>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  fallback: PropTypes.any,
  children: PropTypes.any,
};

export default ErrorBoundary;
