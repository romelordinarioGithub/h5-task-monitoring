export const authenticateUser = (token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('patch', 'v2.2');
};

export const deauthenticateUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('patch');
  window.dispatchEvent(new Event('deauthenticateUser'));
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const clearAll = () => {
  localStorage.clear();
};
