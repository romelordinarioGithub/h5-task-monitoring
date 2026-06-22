import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthenticatedRoutes from './AuthenticatedRoutes';
import ErrorBoundary from 'components/Common/ErrorBoundary';

// App components
import SuspenseLoader from 'components/Common/SuspenseLoader';
// import MilestonePublic from 'pages/MilestonePublic';

// Pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const ForgotPassword = lazy(() => import('pages/ForgotPassword'));
const PasswordReset = lazy(() => import('pages/PasswordReset'));
const Pager = lazy(() => import('components/Pager'));
const MilestonePublic = lazy(() => import('pages/MilestonePublic'));
const PublicForm = lazy(() => import('pages/PublicForm'));
const PublicFormReview = lazy(() => import('pages/PublicForm/views/Review'));
const PublicFormSuccess = lazy(() => import('pages/PublicForm/views/Success'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<SuspenseLoader />}>
        <Switch>
          <Route exact path="/login">
            <ErrorBoundary>
              <Pager content={<Login />} title="Login" />
            </ErrorBoundary>
          </Route>
          <Route
            exact
            path="/projects/:partnerId/concept/:conceptId/public/milestone"
            component={MilestonePublic}
          />
          <Route
            exact
            path="/projects/:partnerId/concept/:conceptId/public/milestone/campaign"
            component={MilestonePublic}
          />
          <AuthenticatedRoutes exact path="/form" component={PublicForm} />
          <AuthenticatedRoutes
            exact
            path="/form/review"
            component={PublicFormReview}
          />
          <AuthenticatedRoutes
            exact
            path="/form/success"
            component={PublicFormSuccess}
          />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/password-reset/:key" component={PasswordReset} />

          <AuthenticatedRoutes component={Home} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
