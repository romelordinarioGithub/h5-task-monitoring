import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Swal from 'sweetalert2';

import { useSelector } from 'react-redux';

// MUI Components
import { Stack, Box } from '@mui/material';

// Components
import Header from './views/Header';
import Footer from './views/Footer';

//Contents
import Main from './views/Main';
import Error from './views/Error';
import Success from './views/Success';

// Context
import { TaskCreationProvider } from 'components/TaskCreation/Context';

//styles
import { useStyles } from './styles';

const CampaignCreation = ({ onClose }) => {
  const {
    saveCampaign: { success, processing, error },
  } = useSelector((state) => state.projects);

  const [index, setIndex] = useState(0);
  const classes = useStyles();

  const handleTempClose = () => {
    Swal.fire({
      title: 'Are you sure? ',
      text: 'The campaign you created will not be saved.',
      icon: 'question',
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
      customClass: { container: 'swal-manual-creation-container' },
      backdrop: '#25175aa3',
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          onClose();
        }, 20);
      }
    });
  };

  const handleErrorClose = () => {
    setIndex(0);
    onClose();
  };

  return (
    <Fragment>
      <TaskCreationProvider>
        {!_.isEmpty(error) ? <Error message={error} /> : null}
        {success && !processing ? (
          <Success onClose={handleErrorClose} />
        ) : (
          <>
            <Stack className={classes.root}>
              {/* Header */}
              <Header onClose={handleTempClose} />
              {/* Content */}
              <Box className={classes.content}>
                <Main />
              </Box>
              {/* Footer */}
              <Footer step={index} isLoading={processing} />
            </Stack>
          </>
        )}
      </TaskCreationProvider>
    </Fragment>
  );
};

CampaignCreation.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CampaignCreation;
