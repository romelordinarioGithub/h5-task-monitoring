import React, { useContext, useState } from 'react';

import _ from 'lodash';

import { useParams } from 'react-router-dom';

import {
  Box,
  Typography,
  styled,
  IconButton,
  Collapse,
  Tooltip,
  Stack,
} from '@mui/material';
import appTheme from 'theme';

import ConceptOverviewContext from 'pages/ConceptOverview/context';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import AutoModeTwoToneIcon from '@mui/icons-material/AutoModeTwoTone';

import { LoadingButton } from '@mui/lab';

import { campaignTable } from 'pages/ConceptOverview/constant';

import CampaignTree from 'pages/ConceptOverview/components/CampaignTree';

// const StyledBox = styled(Box)({
//   margin: '0px 2px 2px 0',
//   padding: '6px',
//   backgroundColor: '#e6e6e6',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// });

// const StyledAvatarGroup = styled(AvatarGroup)({
//   justifyContent: 'center',
//   '& .MuiAvatarGroup-avatar': {
//     width: 20,
//     height: 20,
//     fontSize: 12,
//     marginLeft: '-5px',
//   },
// });

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

const StyledCollapse = styled(Collapse)({
  borderLeft: '1px dashed #757575',
  paddingLeft: '1em',
  marginLeft: '0.5em',
});

export default function Campaigns() {
  const { conceptId } = useParams();
  const [openCollapse, setOpenCollapse] = useState(true);

  const {
    campaignList: campaign,
    fetchUpdateCampaignList,
    loadMoreCampaigns,
    handlePopover,
    handleCampaignTasks,
    fetchCampaignTask,
    handleSortCampaign,
    orderCampaign,
    sortCampaign,
  } = useContext(ConceptOverviewContext);

  const handleCollapseCampaigns = () => {
    setOpenCollapse(!openCollapse);
  };

  return (
    <>
      <Box
        mt={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <IconButton
            size="small"
            onClick={handleCollapseCampaigns}
            sx={{ padding: 0, marginRight: '0.5em' }}
          >
            {openCollapse ? (
              <IndeterminateCheckBoxOutlinedIcon />
            ) : (
              <AddBoxOutlinedIcon />
            )}
          </IconButton>
          <StyledTypography variant="h6" fontWeight={800} color="primary">
            ({campaign?.total})&nbsp;
            {campaign?.total === 1 ? 'Campaign' : `Campaigns`}
          </StyledTypography>
        </Box>
      </Box>

      <StyledCollapse in={openCollapse}>
        {/* Campaign List */}
        <Box overflow="auto" mt={1}>
          {/* Header */}
          <Box display="inline-flex">
            {campaignTable?.map((header, index) => (
              <Box
                direction="row"
                width={header?.width}
                margin="0px 2px 3px 0"
                key={index}
                textAlign={header?.align}
              >
                {!_.isNull(header?.tooltip) ? (
                  <Tooltip
                    title={
                      <Typography color="white" sx={{ fontSize: '1em' }}>
                        {header?.tooltip}
                      </Typography>
                    }
                  >
                    <StyledTypography
                      variant="body2"
                      fontWeight={700}
                      onClick={() =>
                        handleSortCampaign(header?.slug, sortCampaign)
                      }
                      sx={{
                        cursor: 'pointer',
                        ':hover': {
                          color: appTheme.palette.primary.light,
                          transitionDuration: '.2s',
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="center">
                        {header?.label}
                        {header?.slug === orderCampaign &&
                        ['delivery_date', 'date_created'].includes(
                          header.slug
                        ) ? (
                          sortCampaign === 'asc' ? (
                            <ArrowDownwardOutlinedIcon
                              sx={{ fontSize: '1.2em', marginLeft: '.2em' }}
                            />
                          ) : (
                            <ArrowUpwardOutlinedIcon
                              sx={{ fontSize: '1.2em', marginLeft: '.2em' }}
                            />
                          )
                        ) : null}
                      </Stack>
                    </StyledTypography>
                  </Tooltip>
                ) : (
                  <StyledTypography
                    variant="body2"
                    fontWeight={700}
                    onClick={() =>
                      ['launch_date'].includes(header.slug) &&
                      handleSortCampaign(header?.slug, sortCampaign)
                    }
                    sx={{
                      cursor:
                        ['launch_date'].includes(header.slug) && 'pointer',
                      ':hover': {
                        color:
                          ['launch_date'].includes(header.slug) &&
                          appTheme.palette.primary.light,
                        transitionDuration:
                          ['launch_date'].includes(header.slug) && '.2s',
                        transform:
                          ['launch_date'].includes(header.slug) &&
                          'scale(1.05)',
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent={
                        header?.slug === 'name' ? 'start' : 'center'
                      }
                    >
                      {header?.label}
                      {header?.slug === orderCampaign &&
                      ['launch_date'].includes(header.slug) ? (
                        sortCampaign === 'asc' ? (
                          <ArrowDownwardOutlinedIcon
                            sx={{ fontSize: '1.2em', marginLeft: '.2em' }}
                          />
                        ) : (
                          <ArrowUpwardOutlinedIcon
                            sx={{ fontSize: '1.2em', marginLeft: '.2em' }}
                          />
                        )
                      ) : null}
                    </Stack>
                  </StyledTypography>
                )}
              </Box>
            ))}
          </Box>

          {/* List */}
          {!_.isEmpty(campaign)
            ? campaign?.total > campaign?.data?.length
              ? campaign?.data.map((data, key) => (
                  <CampaignTree
                    campaign={data}
                    key={key}
                    handlePopover={handlePopover}
                    handleCampaignTasks={handleCampaignTasks}
                    fetchCampaignTask={fetchCampaignTask}
                  />
                ))
              : _.orderBy(campaign?.data, [orderCampaign], [sortCampaign]).map(
                  (data, key) => (
                    <CampaignTree
                      campaign={data}
                      key={key}
                      handlePopover={handlePopover}
                      handleCampaignTasks={handleCampaignTasks}
                      fetchCampaignTask={fetchCampaignTask}
                    />
                  )
                )
            : null}
        </Box>

        {/* More */}
        {campaign?.total !== campaign?.data?.length && (
          <Box my={1} display="flex" justifyContent="center">
            <LoadingButton
              size="small"
              variant="contained"
              disableElevation
              disableFocusRipple
              sx={{ textTransform: 'initial' }}
              startIcon={<AutoModeTwoToneIcon />}
              loading={fetchUpdateCampaignList}
              loadingPosition="start"
              onClick={() =>
                loadMoreCampaigns(
                  conceptId,
                  campaign?.current_page + 1,
                  sortCampaign,
                  orderCampaign
                )
              }
            >
              Load more campaigns
            </LoadingButton>
          </Box>
        )}
      </StyledCollapse>
    </>
  );
}
