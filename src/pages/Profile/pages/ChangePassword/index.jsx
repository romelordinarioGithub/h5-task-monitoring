import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import {
  Paper,
  Grid,
  TextField,
  Button,
  styled,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  Box,
  ListItemText,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const StyledPaperContent = styled(Paper)`
  background-color: rgb(255, 255, 255);
  color: rgb(33, 43, 54);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background-image: none;
  overflow: hidden;
  position: relative;
  box-shadow: rgba(34, 51, 84, 0.4) 0px 2px 4px -3px,
    rgba(34, 51, 84, 0.2) 0px 5px 16px -4px;
  border-radius: 16px;
  z-index: 0;
  padding: 24px;
`;

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
  margin: 24px 0px 0px;
  float: right;
`;

export default function ChangePassword({
  user,
  password,
  currentPassword,
  passwordConfirmation,
  setPassword,
  setCurrentPassword,
  setConfirmPassword,
  handleSaveChanges,
  handleSavePassword,
  handleClickShowPassword,
  showPassword,
  passwordRules,
}) {
  const isPasswordRules =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[a-zA-Z0-9#?!@$%^&*_+=().,<>{}[\]/-])[a-zA-Z0-9#?!@$%^&*_+=().,<>{}[\]/-]{8,16}$/.test(
      password
    );

  return (
    <StyledPaperContent>
      <Grid container spacing={3}>
        {user?.first_login || (
          <Grid item xs={12}>
            <TextField
              label="Current Password"
              variant="outlined"
              type={showPassword.isCurrent ? 'text' : 'password'}
              value={currentPassword}
              InputProps={{
                endAdornment: !_.isEmpty(currentPassword) && (
                  <Tooltip
                    title={
                      showPassword.isCurrent ? 'Hide Password' : 'Show Password'
                    }
                  >
                    <IconButton
                      onClick={(event) =>
                        handleClickShowPassword(event, 'current')
                      }
                    >
                      {showPassword.isCurrent ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                ),
              }}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="off"
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            label="New Password"
            variant="outlined"
            type={showPassword.isNew ? 'text' : 'password'}
            value={password}
            InputProps={{
              endAdornment: !_.isEmpty(password) && (
                <Tooltip
                  title={showPassword.isNew ? 'Hide Password' : 'Show Password'}
                >
                  <IconButton
                    onClick={(event) => handleClickShowPassword(event, 'new')}
                  >
                    {showPassword.isNew ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </Tooltip>
              ),
            }}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            inputProps={{ maxLength: 16 }}
          />
          <Box mt={1} ml={2}>
            <List>
              {passwordRules?.map((data, key) => (
                <ListItem key={key} disablePadding>
                  <ListItemIcon
                    sx={{
                      minWidth: '25px',
                      marginBottom: data?.id === 5 && '1.5em',
                    }}
                  >
                    {data?.regex.test(password) ? (
                      <CheckCircleOutlineOutlinedIcon color="secondary" />
                    ) : (
                      <ErrorOutlineOutlinedIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    {data?.label}
                    {data?.id === 5 && (
                      <Typography>{data?.characters}</Typography>
                    )}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={
              passwordConfirmation !== password &&
              !_.isEmpty(passwordConfirmation) &&
              !_.isEmpty(password) &&
              isPasswordRules
            }
            label="Confirm Password"
            variant="outlined"
            type={showPassword.isConfirm ? 'text' : 'password'}
            value={passwordConfirmation}
            helperText={
              passwordConfirmation !== password &&
              !_.isEmpty(passwordConfirmation) &&
              !_.isEmpty(password) &&
              isPasswordRules &&
              'Password do not match.'
            }
            onCut={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            InputProps={{
              endAdornment: !_.isEmpty(passwordConfirmation) && (
                <Tooltip
                  title={
                    showPassword.isConfirm ? 'Hide Password' : 'Show Password'
                  }
                >
                  <IconButton
                    onClick={(event) =>
                      handleClickShowPassword(event, 'confirm')
                    }
                  >
                    {showPassword.isConfirm ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </Tooltip>
              ),
            }}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="off"
            inputProps={{ maxLength: 16 }}
          />
        </Grid>
      </Grid>
      {user?.first_login ? (
        <StyledButton
          color="secondary"
          variant="contained"
          onClick={handleSaveChanges}
          disabled={
            _.isEmpty(passwordConfirmation) ||
            _.isEmpty(password) ||
            passwordConfirmation !== password ||
            !isPasswordRules
          }
        >
          Save Changes
        </StyledButton>
      ) : (
        <StyledButton
          color="secondary"
          variant="contained"
          onClick={handleSavePassword}
          disabled={
            _.isEmpty(passwordConfirmation) ||
            _.isEmpty(password) ||
            _.isEmpty(currentPassword) ||
            passwordConfirmation !== password ||
            !isPasswordRules
          }
        >
          Update Password
        </StyledButton>
      )}
    </StyledPaperContent>
  );
}

ChangePassword.propTypes = {
  user: PropTypes.any,
  password: PropTypes.any,
  currentPassword: PropTypes.any,
  passwordConfirmation: PropTypes.any,
  setPassword: PropTypes.any,
  setCurrentPassword: PropTypes.any,
  setConfirmPassword: PropTypes.any,
  handleSaveChanges: PropTypes.any,
  handleSavePassword: PropTypes.any,
  handleClickShowPassword: PropTypes.func,
  showPassword: PropTypes.any,
  passwordRules: PropTypes.any,
};
