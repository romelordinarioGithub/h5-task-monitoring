import api from 'utils/api';

export const requestErrorCategory = () =>
  api.callGet(`admin/qa-error?limit=9999`);

export const requestAddErrorCategory = (params) =>
  api.callPost(`admin/qa-error/store`, params);

export const requestUpdateErrorCategory = (params) =>
  api.callPost(`admin/qa-error/update`, params);

export const requestDeleteErrorCategory = (params) =>
  api.callPost(`admin/qa-error/delete/${params}`);
