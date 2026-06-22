import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';

const StyledButton = styled(Button)`
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

function Dialog({ type, onClose, handleSubmit, value, error }) {
  const [name, setName] = useState(value?.name ?? '');

  useEffect(() => {
    type === 'edit_type' ? setName(value?.name) : setName('');
  }, [type]);

  const dialogTitle = `${_.startCase(type.split('_')[0])} ${
    type !== 'add_category' ? `"${value?.name}"` : ''
  } ${_.startCase(type.split('_')[1])}`;

  return (
    <Box sx={{ width: '550px', padding: 4, overflowX: 'hidden' }}>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 10, right: 10 }}
      >
        <CloseIcon sx={{ fontSize: '18px' }} />
      </IconButton>
      <Stack
        spacing={2}
        sx={{
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            {dialogTitle}
          </Typography>
        </Box>
        <TextField
          error={!_.isNull(error)}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          inputProps={{ maxLength: 50 }}
          helperText={error}
        />

        <Stack direction="row" sx={{ paddingTop: 1 }}>
          <StyledButton
            color="secondary"
            variant="contained"
            sx={{ width: '120px' }}
            onClick={() => handleSubmit(name)}
          >
            Save
          </StyledButton>
        </Stack>
      </Stack>
    </Box>
  );
}

Dialog.propTypes = {
  type: PropTypes.string,
  onClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  value: PropTypes.object,
  error: PropTypes.string,
};

export default Dialog;
