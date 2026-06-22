import React, { useContext } from 'react';
import {
  Card,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Stack,
  TextField,
  IconButton,
  Button,
  Autocomplete,
} from '@mui/material';
import SmartlyBriefContext from 'pages/SmartlyBrief/context';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { videoFormat, defaultDurations } from 'pages/SmartlyBrief/constant';
import _ from 'lodash';

export default function VideoFormat() {
  const {
    formatVideo,
    customVideoFormat,
    handleAddCustomVideoSpecs,
    handleFormatVideo,
    handleDeleteCustomVideoSpecs,
    handleOnChangeCustomVideoSpecs,
  } = useContext(SmartlyBriefContext);

  return (
    <Card style={{ padding: '2em' }}>
      <Stack spacing={2}>
        <Box>
          <Typography
            style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            Creative Formats/Specifications
          </Typography>
        </Box>
        {videoFormat.map((data, index) => (
          <Stack spacing={1} key={index}>
            <Typography>{data.label}</Typography>
            <Box
              sx={{
                padding: '1em 1em 1em 2em',
                border: '1px solid #dedede54',
                borderRadius: '0.6em',
                backgroundColor: '#ececec82',
              }}
            >
              {data.size.map((items, index) => (
                <Box key={index}>
                  <FormControlLabel
                    label={
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {items}
                      </Typography>
                    }
                    value={items}
                    onChange={(event) =>
                      handleFormatVideo(event, data.label, items, 'all')
                    }
                    control={
                      <Checkbox
                        checked={
                          _.some(formatVideo, {
                            name: data.label,
                            size: items,
                            duration: '6s',
                          }) &&
                          _.some(formatVideo, {
                            name: data.label,
                            size: items,
                            duration: '10s',
                          }) &&
                          _.some(formatVideo, {
                            name: data.label,
                            size: items,
                            duration: '15s',
                          })
                        }
                        indeterminate={
                          (_.some(formatVideo, {
                            name: data.label,
                            size: items,
                            duration: '6s',
                          }) ||
                            _.some(formatVideo, {
                              name: data.label,
                              size: items,
                              duration: '10s',
                            }) ||
                            _.some(formatVideo, {
                              name: data.label,
                              size: items,
                              duration: '15s',
                            })) &&
                          !(
                            _.some(formatVideo, {
                              name: data.label,
                              size: items,
                              duration: '6s',
                            }) &&
                            _.some(formatVideo, {
                              name: data.label,
                              size: items,
                              duration: '10s',
                            }) &&
                            _.some(formatVideo, {
                              name: data.label,
                              size: items,
                              duration: '15s',
                            })
                          )
                        }
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                      />
                    }
                  />
                  <Box sx={{ flexDirection: 'row', mx: '2em' }}>
                    {defaultDurations.map((item, index) => (
                      <FormControlLabel
                        key={index}
                        label={item}
                        value={item}
                        onChange={(event) =>
                          handleFormatVideo(event, data.label, items)
                        }
                        control={
                          <Checkbox
                            checked={_.some(formatVideo, {
                              name: data.label,
                              size: items,
                              duration: item,
                            })}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                          />
                        }
                      />
                    ))}
                  </Box>
                </Box>
              ))}
              {customVideoFormat
                .filter((filter) => filter.name === data.label)
                .map((item, index) => (
                  <Stack
                    direction="row"
                    key={index}
                    spacing={2}
                    sx={{ py: '1em' }}
                  >
                    <IconButton
                      onClick={(event) =>
                        handleDeleteCustomVideoSpecs(event, data.label, index)
                      }
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                    {_.isEqual(data.label, 'Others') && (
                      <Autocomplete
                        freeSolo
                        size="small"
                        options={videoFormat.map((data) => data.label)}
                        value={item.name}
                        sx={{ width: 450 }}
                        autoSelect={true}
                        onChange={(event, value) =>
                          handleOnChangeCustomVideoSpecs(
                            value,
                            data.label,
                            'platform',
                            index
                          )
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Platform" />
                        )}
                      />
                    )}
                    <Autocomplete
                      freeSolo
                      size="small"
                      options={data.size}
                      value={item.size}
                      sx={{ width: 450 }}
                      autoSelect={true}
                      onChange={(event, value) =>
                        handleOnChangeCustomVideoSpecs(
                          value,
                          data.label,
                          'size',
                          index
                        )
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Size" />
                      )}
                    />
                    <Autocomplete
                      freeSolo
                      size="small"
                      options={defaultDurations}
                      value={item.duration}
                      sx={{ width: 450 }}
                      autoSelect={true}
                      onChange={(event, value) =>
                        handleOnChangeCustomVideoSpecs(
                          value,
                          data.label,
                          'duration',
                          index
                        )
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Duration" />
                      )}
                    />
                  </Stack>
                ))}
              <Box textAlign="center">
                <Button
                  size="small"
                  variant="contained"
                  onClick={(event) =>
                    handleAddCustomVideoSpecs(event, data.label)
                  }
                  startIcon={<AddCircleOutlineIcon />}
                >
                  ADD CUSTOM FORMAT
                </Button>
              </Box>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
