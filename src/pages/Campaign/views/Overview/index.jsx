import React, { useContext, useState } from 'react';
import { Box, Grid, Typography, Button, Stack, Collapse } from '@mui/material';
import CampaignOverviewContext from 'pages/Campaign/context';
import { overviewDetails } from 'pages/Campaign/constant';
import _ from 'lodash';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { channels } from 'pages/ConceptOverview/constant';

export default function Overview() {
  const { overview } = useContext(CampaignOverviewContext);

  const [openOverview, setOpenOverview] = useState(false);

  return (
    <Box>
      <Stack
        justifyContent="space-between"
        flexDirection="row-reverse"
        marginBottom="8px"
      >
        <Button
          startIcon={openOverview ? <CloseTwoToneIcon /> : <InfoTwoToneIcon />}
          sx={{
            textTransform: 'capitalize',
            backgroundColor: openOverview ? '#7e14e6' : '#f22176',
          }}
          size="small"
          variant="contained"
          disableElevation
          onClick={() => setOpenOverview(!openOverview)}
        >
          Overview
        </Button>
      </Stack>
      <Collapse
        in={openOverview}
        sx={{
          '.MuiCollapse-wrapper': {
            padding: '1em',
            backgroundColor: '#ececec54',
            borderRadius: '1em',
          },
        }}
      >
        <Box>
          {overviewDetails.map((data, index) => (
            <Box mb={2} key={index}>
              <Grid container spacing={2}>
                <Grid item xs={1.5}>
                  <Typography
                    variant="caption"
                    fontWeight={800}
                    textTransform="uppercase"
                    // color="#3f0b9d"
                  >
                    {data?.label}
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  {data?.type === 'date_time' ? (
                    _.isEmpty(overview[data?.key]) ? (
                      <Typography variant="body1" color="#00000047">
                        YYYY-MM-DD HH:MM:SS
                      </Typography>
                    ) : (
                      <Typography variant="body1">
                        {overview[data?.key]}
                      </Typography>
                    )
                  ) : data?.type === 'icon' ? (
                    _.filter(
                      channels,
                      (c) => c?.label === overview[data?.key]
                    )[0]?.content
                  ) : _.isEmpty(overview[data?.key]) &&
                    !_.isBoolean(overview[data?.key]) ? (
                    <Typography variant="body1" color="#00000047">
                      Not set in platform
                    </Typography>
                  ) : (
                    <Typography variant="body1">
                      {data?.type === 'text_replace'
                        ? _.capitalize(overview[data?.key]?.replace(/_/g, ' '))
                        : data?.type === 'boolean'
                        ? overview[data?.key]
                          ? 'Yes'
                          : 'No'
                        : _.capitalize(overview[data?.key])}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
