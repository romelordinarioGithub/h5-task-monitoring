import React, { createContext } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSmartlyOverview } from 'store/reducers/smartly';
import PropTypes from 'prop-types';
import CircularLoader from 'components/Common/CircularLoader';

const SmartlyTaskContext = createContext();

export function SmartlyTaskProvider({ children }) {
  const { type, taskId } = useParams();
  const dispatch = useDispatch();
  const { overview, fetchOverview, errorOverview } = useSelector(
    (state) => state.smartly
  );

  React.useEffect(() => {
    dispatch(getSmartlyOverview(taskId));
  }, [type, taskId]);

  return (
    <SmartlyTaskContext.Provider
      value={{ overview, fetchOverview, errorOverview }}
    >
      {children}
      {fetchOverview && <CircularLoader />}
    </SmartlyTaskContext.Provider>
  );
}

SmartlyTaskProvider.propTypes = {
  children: PropTypes.any,
};

export default SmartlyTaskContext;
