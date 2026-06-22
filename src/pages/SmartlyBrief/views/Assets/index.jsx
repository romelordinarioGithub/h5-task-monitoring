import React, { useContext } from 'react';

import _ from 'lodash';

import {
  Typography,
  Box,
  FormControlLabel,
  TextField,
  Checkbox,
  Stack,
  Divider,
  IconButton,
  Card,
} from '@mui/material';
import FileUpload from 'pages/SmartlyBrief/components/FileUpload';
import SmartlyBriefContext from 'pages/SmartlyBrief/context';
import ClearIcon from '@mui/icons-material/Clear';
import { assets } from 'pages/SmartlyBrief/constant';

export default function Assets() {
  const {
    asset,
    setAsset,
    handleOnInputChange,
    gdriveLink,
    handleAssetsCheckedBox,
    assetCheckedBox,
  } = useContext(SmartlyBriefContext);

  const filterAsset = (i) => {
    setAsset(_.filter(asset, (v, index) => index !== i));
  };

  return (
    <Card style={{ padding: '2em' }}>
      <Typography variant="span">
        Please fill the{' '}
        <Typography display="inline" sx={{ color: 'red' }}>
          *
        </Typography>{' '}
        required fields below.
      </Typography>
      <Stack spacing={2} my={2}>
        <TextField
          autoComplete="off"
          label="GDrive link"
          value={gdriveLink}
          required={true}
          helperText={`Please enter GDrive link`}
          onChange={(event) =>
            handleOnInputChange(event.target.value, 'gdriveLink')
          }
        />
        <FileUpload setAsset={setAsset} />
        {!_.isEmpty(asset) &&
          asset.map((data, index) => (
            <Box key={index}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontSize="1em">
                    {data?.file?.name.split('').length > 40
                      ? `${data?.file?.name.slice(0, 40)} ...`
                      : data?.file?.name}
                  </Typography>
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => filterAsset(index)}>
                    <ClearIcon />
                  </IconButton>
                </Box>
              </Stack>
              <Divider />
            </Box>
          ))}
        <Box sx={{ pt: '2em' }}>
          <Typography component="span">
            <Box fontWeight="700" display="inline" color="#f22076">
              *
            </Box>{' '}
            Make sure all assets are provided, kindly tick all the checkboxes to
            confirm.
          </Typography>
          <Box
            sx={{
              padding: '1em',
              border: '1px solid #dedede54',
              borderRadius: '0.6em',
              backgroundColor: '#ececec82',
            }}
          >
            {assets?.map((data, index) => (
              <Stack spacing={2} direction="row" key={index}>
                <FormControlLabel
                  key={index}
                  value={index}
                  onChange={(event) =>
                    handleAssetsCheckedBox(event, data.label)
                  }
                  checked={_.includes(assetCheckedBox, data.label)}
                  label={
                    <Typography style={{ textTransform: 'uppercase' }}>
                      {data.label}
                    </Typography>
                  }
                  control={
                    <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} />
                  }
                />
              </Stack>
            ))}
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}
