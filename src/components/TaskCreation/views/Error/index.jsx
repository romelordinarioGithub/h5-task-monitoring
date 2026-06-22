import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

//Reducer
import { clearError } from 'store/reducers/manualTaskCreation';


// Error.propTypes = {
//   onClose: PropTypes.func,
// };

import toast, { Toaster } from 'react-hot-toast';

export default function Error({message}) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    toast.error(`${message.charAt(0).toUpperCase() + message.slice(1).toLowerCase().replace(/!!!/g, ',')} please contact the administrator.`,{
      duration: 7000,
      id: "error"});
      dispatch(clearError);
  }, [])

  return(
     <Toaster
      containerStyle={{
        position: 'relative',
        left: "-.2%"
      }}
    />
  );
  // return (
  //   <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
  //     <Box mb={3}>
  //       <IconButton
  //         size="large"
  //         sx={{
  //           width: '4em',
  //           height: '4em',
  //           backgroundColor: '#ff4d4f',
  //           '&:hover': { backgroundColor: '#ff4d4f' },
  //         }}
  //       >
  //         <ReportGmailerrorredIcon
  //           sx={{ width: 'auto', height: 'auto', color: '#fff' }}
  //         />
  //       </IconButton>
  //     </Box>
  //     <Typography variant="h4">Submission Failed</Typography>
  //     <Typography>
  //       This might be an error on the server, please contact the administrator.
  //     </Typography>
  //     <Box mt={2}>
  //       <Button variant="contained" onClick={onClose}>
  //         Close
  //       </Button>
  //     </Box>
  //   </Stack>
  // );
}


Error.propTypes = {
  message: PropTypes.string,
};