import { useContext } from 'react';

import PropTypes from 'prop-types';

import _ from 'lodash';

// MUI Components
import { Box, Stack, Divider, styled } from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';
import Swal from 'sweetalert2';

// MUI ICons
import SaveIcon from '@mui/icons-material/Save';
import ConceptOverviewContext from 'pages/ConceptOverview/context';

const NextButton = styled(LoadingButton)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  outline: 0px;
  border: 0px;
  margin: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  font-weight: 700;
  line-height: 1.71429;
  font-size: 0.875rem;
  text-transform: capitalize;
  min-width: 50px;
  padding: 6px 16px;
  border-radius: 8px;
  color: rgb(255, 255, 255);
  box-shadow: #f2207633 0px 8px 16px 0px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const nextStep = (i) => {
  let next = '';
  switch (i) {
    case 0:
      next = 'Create Campaign';
      break;
  }

  return next;
};

const Footer = ({ step, isLoading }) => {
  const { taskName, channel, handleCustomCampaignSubmit } = useContext(
    ConceptOverviewContext
  );

  const handleSubmit = () => {
    Swal.fire({
      title: 'Proceed with creating this campaign?',
      icon: 'question',
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
      customClass: { container: 'swal-manual-creation-container' },
      backdrop: '#25175aa3',
    }).then((result) => {
      if (result.isConfirmed) {
        handleCustomCampaignSubmit();
      }
    });
  };

  return (
    <Box>
      <Divider />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p={1}
      >
        <Box width={220} />
        <Box width={220} display="flex" justifyContent="flex-end">
          <NextButton
            color="secondary"
            variant="contained"
            disableElevation
            loading={isLoading}
            size="large"
            onClick={handleSubmit}
            startIcon={<SaveIcon sx={{ width: '0.8em', height: '0.8em' }} />}
            disabled={_.isEmpty(taskName) || _.isEmpty(channel)}
          >
            {nextStep(step)}
          </NextButton>
        </Box>
      </Stack>
    </Box>
  );
};

Footer.propTypes = {
  step: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default Footer;
