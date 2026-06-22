import { useContext } from 'react';
import _ from 'lodash';

import { Box } from '@mui/material';
import PropTypes from 'prop-types';

// Context
import TaskCreationContext from 'components/TaskCreation/Context';

const FloatingButton = ({
  floatingButton,
  floatingText,
  handleClose,
  open,
}) => {
  const { team, partner } = useContext(TaskCreationContext);
  //_.isEmpty(team) && _.isEmpty(taskType) ? null :
  return  ( _.isEmpty(team) && _.isEmpty(partner) ? null :
    <Box className={floatingButton} onClick={handleClose}>
      <div className={floatingText}>{open ? 'Close' : 'Summary'}</div>
    </Box>
  );
};

FloatingButton.propTypes = {
  floatingButton: PropTypes.any,
  floatingText: PropTypes.any,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.any,
};

export default FloatingButton;
