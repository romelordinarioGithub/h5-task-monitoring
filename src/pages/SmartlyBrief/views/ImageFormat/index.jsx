import React, { useContext } from 'react';
import {
  Card,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Stack,
  Autocomplete,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import SmartlyBriefContext from 'pages/SmartlyBrief/context';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { staticassets } from 'pages/SmartlyBrief/constant';
import _ from 'lodash';

export default function ImageFormat() {
  const {
    handleFormatDesign,
    handleCustomInput,
    handleAddCustomFormat,
    customDesignFormat,
    handleDeleteCustomFormat,
    handleCustomOnChange,
    formatDesign,
    others,
    cards,
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
        {staticassets?.map((data, index) => (
          <Stack spacing={1} key={index}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>{data.name}</Typography>
            </Stack>
            <Box
              sx={{
                padding: '1em 1em 1em 2em',
                border: '1px solid #dedede54',
                borderRadius: '0.6em',
                backgroundColor: '#ececec82',
              }}
            >
              {data?.name.includes('Others')
                ? customDesignFormat.map((data, index) => (
                    <Stack
                      direction="row"
                      key={index}
                      spacing={2}
                      sx={{ py: '1em' }}
                    >
                      <IconButton
                        onClick={() => {
                          handleDeleteCustomFormat(index);
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                      <Autocomplete
                        freeSolo
                        value={data?.name}
                        options={staticassets.map((data) => data.name)}
                        size="small"
                        autoSelect={true}
                        sx={{ width: 450 }}
                        renderInput={(params) => (
                          <TextField {...params} label="Platform" />
                        )}
                        onChange={(event, value) =>
                          handleCustomOnChange(value, index, 'name')
                        }
                      />
                      <TextField
                        label="Size"
                        value={data?.size}
                        size="small"
                        sx={{ width: 450 }}
                        autoComplete="off"
                        onChange={(event) =>
                          handleCustomOnChange(
                            event.target.value,
                            index,
                            'size'
                          )
                        }
                      />
                    </Stack>
                  ))
                : data?.items?.map((item, index) =>
                    _.isEqual(item, 'Others') ||
                    _.isEqual(item, 'No. of Cards') ? (
                      <Stack direction="row" key={index}>
                        <FormControlLabel
                          label={item}
                          value={item}
                          onChange={(event) =>
                            handleFormatDesign(event, data.name)
                          }
                          control={
                            <Checkbox
                              checked={
                                _.isEqual(item, 'Others')
                                  ? _.some(formatDesign, {
                                      name: data.name,
                                      size: others,
                                    })
                                  : _.some(formatDesign, {
                                      name: data.name,
                                      size: `${cards} card(s)`,
                                    })
                              }
                              sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                            />
                          }
                        />
                        <TextField
                          size="small"
                          autoComplete="off"
                          type={_.isEqual(item, 'Others') ? 'text' : 'number'}
                          sx={{ width: 200 }}
                          // type={_.isEqual(item,'Others') ? 'text' : 'tel'}
                          value={_.isEqual(item, 'Others') ? others : cards}
                          onChange={(event) => handleCustomInput(event, item)}
                        />
                      </Stack>
                    ) : (
                      <Stack key={index}>
                        <FormControlLabel
                          label={item}
                          value={item}
                          onChange={(event) =>
                            handleFormatDesign(event, data.name)
                          }
                          control={
                            <Checkbox
                              checked={_.some(formatDesign, {
                                name: data.name,
                                size: item,
                              })}
                              sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                            />
                          }
                        />
                      </Stack>
                    )
                  )}
              {data?.name.includes('Others') && (
                <Box textAlign="center">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleAddCustomFormat}
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    ADD CUSTOM FORMAT
                  </Button>
                </Box>
              )}
            </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
