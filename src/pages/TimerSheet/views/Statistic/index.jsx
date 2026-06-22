import React, { useContext } from 'react';
import 'assets/css/timesheet/overide.css';
import {
  Typography,
  Stack,
  Box,
  Tooltip,
  IconButton,
  Grid,
} from '@mui/material';
import TimerSheetContext from 'pages/TimerSheet/Context';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import { concept_columns, campaign_columns } from 'pages/TimerSheet/constant';
import TableSheet from 'pages/TimerSheet/components/TableSheet';
import PieGraph from 'pages/TimerSheet/components/PieGraph';
import pie from 'assets/icons/pie.svg';
import bar from 'assets/icons/bar.svg';

export default function Statistic() {
  const {
    conceptData,
    campaignData,
    handlePopperStat,
    filterStatTable,
    isConceptFetching,
    isCampaignFetching,
  } = useContext(TimerSheetContext);

  return (
    <Box>
      <Stack
        pt={2}
        display="flex"
        justifyContent="space-between"
        direction="row"
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h5" fontWeight={800}>
            Statistic
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ justifyContent: 'flex-end' }}
        >
          <Tooltip
            title="Filters"
            onClick={(e) => handlePopperStat(e, 'dropdown')}
            componentsProps={{
              tooltip: {
                sx: {
                  lineHeight: 'normal',
                  marginTop: '0.4em !important',
                },
              },
            }}
            arrow
          >
            <IconButton sx={{ marginLeft: '2px' }}>
              <FilterAltTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
      <Box sx={{ my: 4.5 }}>
        <Grid container spacing={5} justifyContent="center">
          <Grid item xs={3}>
            <PieGraph
              data={{
                title: 'List Of Concept',
                data: conceptData.length,
                color: '#402176',
                bg: bar,
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <PieGraph
              data={{
                title: 'List Of Campaign',
                data: campaignData.length,
                color: '#f16079',
                bg: pie,
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <TableSheet
        column={
          filterStatTable === 'concept' ? concept_columns : campaign_columns
        }
        data={filterStatTable === 'concept' ? conceptData : campaignData}
        filterStatTable={filterStatTable}
        isConceptFetching={isConceptFetching}
        isCampaignFetching={isCampaignFetching}
      />
    </Box>
  );
}
