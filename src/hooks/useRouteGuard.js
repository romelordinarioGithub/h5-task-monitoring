// React
import { useEffect } from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
// Router
import { useHistory, useLocation } from 'react-router-dom';
// Reducers
import { logout } from 'store/reducers/auth';
// Utilities
import _ from 'lodash';
import { getToken } from 'utils/session';

export default () => {
  const accessToken = getToken();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname, search } = useLocation();
  const { data: userData } = useSelector((state) => state.user);
  const postLoginRedirect =
    typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('postLoginRedirect')
      : null;
  const savedPath =
    typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('path')
      : null;

  useEffect(() => {
    localStorage.getItem('patch') !== 'v2.2' && dispatch(logout());

    const handleRedirectLogout = () => {
      if (
        pathname.includes('task') ||
        pathname.includes('brief') ||
        pathname.includes('subtask') ||
        pathname.includes('ticket') ||
        pathname.includes('form') ||
        pathname.includes('projects')
      ) {
        sessionStorage.setItem('path', pathname + (search || ''));
      }

      history.replace('/login');
    };

    if (_.isNull(accessToken)) {
      handleRedirectLogout();
      // } else if (userData.is_smartly ?? false) {
      //   history.replace('/dashboard');
    } else if (userData.first_login) {
      history.replace('/profile');
    } else {
      if (pathname.includes('login')) {
        const next = savedPath || postLoginRedirect || '/';
        history.replace(next);
        if (savedPath) {
          sessionStorage.removeItem('path');
        }

        if (postLoginRedirect) {
          sessionStorage.removeItem('postLoginRedirect');
        }
      } else {
        history.push({
          pathname: pathname,
          search: search,
          state:
            pathname.includes('task') ||
            pathname.includes('ticket') ||
            pathname.includes('brief')
              ? {
                  background: location,
                }
              : {},
        });
      }
    }

    window.addEventListener('deauthenticateUser', handleRedirectLogout);

    return () => {
      window.removeEventListener('deauthenticateUser', handleRedirectLogout);
    };
  }, [userData]);
};
