// Redux
import { createSlice } from '@reduxjs/toolkit';
// Services
import { loginRequest, loginViaGoogleRequest } from 'services/api/auth';
// Reducers
import { reset as resetUserState, fetchUserDetails } from './user';
import { reset as resetTimerState } from './timer';
// Utilities
import { authenticateUser, deauthenticateUser } from 'utils/session';
import { firebaseSignIn, firebaseSignOut } from 'services/firebase';

const initialState = {
  isLoading: false,
  error: null,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    loginFailed: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    reset: () => initialState,
  },
});

export const { loginStart, loginSuccess, loginFailed, reset } = auth.actions;

export const login = () => async (dispatch) => {
  dispatch(loginStart());
  const {
    success: successFirebase,
    data: dataFirebase,
    error,
  } = await firebaseSignIn();

  if (successFirebase) {
    const { success, message, data } = await loginRequest({
      email: dataFirebase?.email,
      token: dataFirebase?.stsTokenManager?.accessToken,
    });

    if (success) {
      authenticateUser(data?.token);
      dispatch(loginSuccess());
      dispatch(fetchUserDetails());
      localStorage.setItem('local', true);
    } else {
      await firebaseSignOut();
      dispatch(loginFailed(message));
    }
  } else {
    dispatch(loginFailed(error));
  }
};

export const loginViaGoogle = (body) => async (dispatch) => {
  dispatch(loginStart());

  const { success, message, data } = await loginViaGoogleRequest(body);

  if (success) {
    authenticateUser(data?.token);
    dispatch(loginSuccess());
    dispatch(fetchUserDetails());
  } else {
    dispatch(loginFailed(message));
  }
};

export const logout = () => async (dispatch) => {
  deauthenticateUser();
  dispatch(resetUserState());
  dispatch(resetTimerState());
  dispatch(reset());
};

export default auth.reducer;
