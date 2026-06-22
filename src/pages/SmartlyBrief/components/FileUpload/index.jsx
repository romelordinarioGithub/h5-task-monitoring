import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import Uploader from 'components/Common/Uploader';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function FileUpload({ setAsset }) {
  return (
    <Box sx={{ py: '2em' }}>
      <Typography>
        Additional Files (Up to 50MB per file upload, maximum of 100 files)
      </Typography>
      <Uploader setAsset={setAsset} />
      <Typography align="center">
        Support single or multiple file uploads. Strictly prohibited from
        uploading company data or other banned files.
      </Typography>
    </Box>
  );
}

FileUpload.propTypes = {
  setAsset: PropTypes.any,
};
