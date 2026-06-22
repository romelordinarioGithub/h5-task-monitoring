import React, { useContext } from 'react';
import {
  Box,
  TextField,
  Stack,
  Grid,
  Autocomplete,
  Card,
  Typography,
} from '@mui/material';
import SmartlyBriefContext from 'pages/SmartlyBrief/context';
import DateTime from 'pages/SmartlyBrief/components/DateTime';
import { getNames } from 'country-list';
import ISO6391 from 'iso-639-1';
import { generalInfo } from 'pages/SmartlyBrief/constant';
import _ from 'lodash';

export default function GeneralInfo() {
  const {
    handleOnInputChange,
    setDueDate,
    dueDate,
    client,
    pm,
    csmCp,
    design,
    feedCatalog,
    conceptName,
    language,
    market,
    partnersList,
    taskName,
  } = useContext(SmartlyBriefContext);

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
        {generalInfo?.map((data, index) => (
          <Box key={index}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {_.isEqual(data.left.name, 'region_market') ||
                _.isEqual(data.left.name, 'client') ? (
                  <Autocomplete
                    options={
                      _.isEqual(data.left.name, 'client')
                        ? !_.isEmpty(partnersList)
                          ? partnersList?.data
                          : []
                        : getNames()
                    }
                    filterSelectedOptions
                    getOptionLabel={(option) => (option.name ?? option) || ''}
                    //isOptionEqualToValue={(option, value) => option.id === value.id}
                    freeSolo={_.isEqual(data.left.name, 'client')}
                    value={
                      _.isEqual(data.left.name, 'client') ? client : market
                    }
                    onChange={(event, value) =>
                      handleOnInputChange(value, data.left.name)
                    }
                    onInputChange={(event, value) => {
                      _.isEqual(data.left.name, 'client') &&
                        handleOnInputChange(
                          { id: null, name: value, data_source: null },
                          'client'
                        );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          inputProps: {
                            ...params.inputProps,
                            maxLength: data.left.maxLength,
                          },
                        }}
                        required={data.left.isRequired}
                        label={data.left.label}
                      />
                    )}
                  />
                ) : (
                  <TextField
                    value={
                      _.isEqual(data.left.name, 'name')
                        ? taskName
                        : _.isEqual(data.left.name, 'pm')
                        ? pm
                        : design
                    }
                    required={data.left.isRequired}
                    inputProps={{ maxLength: data.left.maxLength }}
                    label={data.left.label}
                    autoComplete="off"
                    onChange={(event) =>
                      handleOnInputChange(event.target.value, data.left.name)
                    }
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                {_.isEqual(data.right.name, 'language') ? (
                  <Autocomplete
                    options={ISO6391.getAllNames()}
                    value={language}
                    filterSelectedOptions
                    onChange={(event, value) =>
                      handleOnInputChange(value, data.right.name)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required={data.right.isRequired}
                        label={data.right.label}
                      />
                    )}
                  />
                ) : _.isEqual(data.right.name, 'date') ? (
                  <DateTime
                    setDeliveryDate={setDueDate}
                    deliveryDate={dueDate}
                  />
                ) : (
                  <TextField
                    value={
                      _.isEqual(data.right.name, 'csm_cp')
                        ? csmCp
                        : _.isEqual(data.right.name, 'concept')
                        ? conceptName
                        : feedCatalog
                    }
                    required={data.right.isRequired}
                    inputProps={{ maxLength: data.right.maxLength }}
                    label={data.right.label}
                    autoComplete="off"
                    onChange={(event) =>
                      handleOnInputChange(event.target.value, data.right.name)
                    }
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
