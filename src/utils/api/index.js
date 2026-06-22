// Axios
import axios from 'axios';
// import * as AxiosLogger from 'axios-logger';
// Utilities
import { getToken, deauthenticateUser } from '../session';
import { apiUrl } from 'config';

axios.defaults.baseURL = apiUrl;

// axios.interceptors.request.use(
//   AxiosLogger.requestLogger,
//   AxiosLogger.errorLogger
// );

// axios.interceptors.response.use(
//   AxiosLogger.responseLogger,
//   AxiosLogger.errorLogger
// );

// AxiosLogger.setGlobalConfig({
//   status: true,
//   headers: true,
// });

const getAuthenticationHeaders = (headers = {}) => ({
  Accept: 'application/json',
  Authorization: `Bearer ${getToken()}`,
  ...headers,
});
const getConfig = (params, options = {}, _headers = {}) => {
  const headers = getAuthenticationHeaders(_headers);

  if (headers) {
    return {
      params,
      headers,
      ...options,
    };
  }

  return {
    params,
    ...options,
  };
};

const getResponse = (request, meta = {}) =>
  request
    .then((response) => response.data)
    .catch((error) => {
      const message = error.response?.data?.message || error.response?.message;
      const status = error.response?.status;
      const isUnauth =
        typeof message === 'string' &&
        message.toLowerCase().includes('unauthenticated');

      if (isUnauth) {
        // Allow callers to request a post-login redirect for specific 401 flows.
        if (meta.postLoginRedirect) {
          try {
            sessionStorage.setItem(
              'postLoginRedirect',
              meta.postLoginRedirect
            );
          } catch (err) {
            // ignore storage errors
          }
        }

        deauthenticateUser();
      }

      return {
        success: false,
        message,
        data: error.response?.data?.data ?? {},
        status,
        error: error.response?.data?.error,
      };
    });

const callGetWithResponseHeaders = (path, params, options) =>
  axios
    .get(path, getConfig(params, options))
    .then((response) => [response.headers, response.data])
    .catch(() => null);

const callGet = (path, params, options) =>
  getResponse(axios.get(path, getConfig(params, options)));

const callPut = (path, data, params, options) =>
  getResponse(axios.put(path, data, getConfig(params, options)));

const callPost = (path, data, options = {}) => {
  const { postLoginRedirect, ...rest } = options || {};
  return getResponse(
    axios.post(path, data, getConfig(rest)),
    { postLoginRedirect }
  );
};

const callPostFormData = (path, data, options) =>
  getResponse(
    axios.post(
      path,
      data,
      getConfig(data, options, { 'content-type': 'multipart/form-data' })
    )
  );

const callDelete = (path, options) =>
  getResponse(axios.delete(path, getConfig(options)));

export default {
  getAuthenticationHeaders,
  callGetWithResponseHeaders,
  callGet,
  callPut,
  callPost,
  callPostFormData,
  callDelete,
};
