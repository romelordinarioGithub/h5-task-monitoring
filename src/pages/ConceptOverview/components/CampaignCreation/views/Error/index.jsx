import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

//Reducer
import { clearError } from 'store/reducers/manualTaskCreation';

import toast, { Toaster } from 'react-hot-toast';

export default function Error({ message }) {
  const dispatch = useDispatch();

  useEffect(() => {
    toast.error(
      `${
        message.charAt(0).toUpperCase() +
        message.slice(1).toLowerCase().replace(/!!!/g, ',')
      }`,
      {
        duration: 7000,
        id: 'error',
      }
    );
    dispatch(clearError);
  }, []);

  return (
    <Toaster
      containerStyle={{
        position: 'relative',
        left: '-.2%',
      }}
    />
  );
}

Error.propTypes = {
  message: PropTypes.string,
};
