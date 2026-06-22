import { memo } from 'react';
import { Route, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useRouteGuard from 'hooks/useRouteGuard';
import { useSelector } from 'react-redux';
// MUI Components
import { Box } from '@mui/material';
// Components
import Header from 'components/Common/Header';
import ErrorBoundary from 'components/Common/ErrorBoundary';
//styles
import { headerMargin } from 'theme/variables';
import { useStyles } from 'app/styles';

const AuthenticatedRoutes = ({ component: Component, ...rest }) => {
  const classes = useStyles();
  /* Temporary Disabled Prompt Timer  */
  //const dispatch = useDispatch();

  /* Temporary Disabled Prompt Timer  */
  //const { prompt } = useSelector((state) => state.timer);
  const { data: userData } = useSelector((state) => state.user);
  const { pathname } = useLocation();

  useRouteGuard();

  /* Temporary Disabled Prompt Timer  */
  // useEffect(() => {
  //   dispatch(getPromptTimer());
  // }, [pathname]);

  // useEffect(() => {
  //   if (!_.isNull(prompt) && !_.isEmpty(prompt)) {
  //     setTimeout(() => {
  //       if (!Swal.isVisible()) showPrompt();
  //     }, 1000);
  //   }
  // }, [prompt]);

  // const showPrompt = () => {
  //   Swal.fire({
  //     iconHtml:
  //       '<img src="https://cdn.dribbble.com/users/1519658/screenshots/3501765/running-clock-02.gif" style="width: 150px">',
  //     title:
  //       "We've noticed your task timer is greater than 5 hours.\n Would you like to stop your task timer?",
  //     background: '#f0f6f7',
  //     showDenyButton: true,
  //     showCancelButton: false,
  //     confirmButtonText: 'Stop',
  //     denyButtonText: 'Cancel',
  //     focusConfirm: true,
  //   }).then((result) => {
  //     const id = prompt[0].id;
  //     const type = prompt[0].type;
  //     const isFromTask = type === 'task';

  //     if (result.isConfirmed) {
  //       if (isFromTask) {
  //         dispatch(stopTimer(null, { id, from_prompt: 1 }));
  //       }
  //       // else {
  //       //   dispatch(stopTimerById(null, { id, from_prompt: 1 }, null));
  //       // }
  //     } else {
  //       dispatch(continuePromptTimer({ id, type }));
  //     }
  //   });
  // };

  const isScopingRoute = pathname?.startsWith('/scoping');
  const hideHeader = pathname?.startsWith('/form') || isScopingRoute;

  return (
    <Box width="100%" className={classes.overflowHiddenX} height="100vh">
      {!hideHeader && <Header />}
      <ErrorBoundary fallback="Error">
        <Route
          {...rest}
          render={(props) => {
            const marginTop = hideHeader
              ? '0px'
              : !userData?.first_login
              ? headerMargin
              : '0px';
            return (
              <Box
                id="app-container"
                width={'100%'}
                style={{
                  marginTop,
                  height: `calc(100vh - ${marginTop})`,
                  overflowY: 'auto',
                }}
              >
                <Box>
                  <Component {...props} />
                </Box>
              </Box>
            );
          }}
        />
      </ErrorBoundary>
    </Box>
  );
};

AuthenticatedRoutes.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default memo(AuthenticatedRoutes);
