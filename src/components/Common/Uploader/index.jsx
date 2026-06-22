import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { DropzoneAreaBase } from 'react-mui-dropzone';

const Uploader = ({setAsset }) => {
  const handleAdd = (obj) => {
    setAsset((prevState) => [...prevState, ...obj]);
  };

  return (
    <Box sx={{position: 'relative', height: "100%", width: "100%"}}>
      <DropzoneAreaBase
        filesLimit={100}
        maxFileSize={104857600}
        dropzoneClass="drop-zone-base"
        dropzoneText="Drag and Drop files here."
        showAlerts={['error']}
        alertSnackbarProps={{
          sx: {position: 'absolute', marginTop: "200px", width: "100%"},
          anchorOrigin: {horizontal: 'center', vertical: 'top' }
        }}
        onAdd={(fileObjs) => handleAdd(fileObjs)}
        getDropRejectMessage={(file,fileName,fileSize) =>  
        (`File ${file.name} was rejected. File is ${(file.size / 1048576).toFixed(2)} MB. Size limit is ${(fileSize / 1048576)} MB.`)}
      />
    </Box>
  );
};

Uploader.propTypes = {
  setAsset: PropTypes.func,
};

export default Uploader;
