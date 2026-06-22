import React, { useContext } from 'react';
import { Typography, Box, Breadcrumbs, Fade } from '@mui/material';
import LinkOffTwoToneIcon from '@mui/icons-material/LinkOffTwoTone';

import ConceptOverviewContext from 'pages/ConceptOverview/context';

import { Link, useParams } from 'react-router-dom';
import Header from 'pages/ConceptOverview/components/Header';
import Overview from 'pages/ConceptOverview/views/Overview';
import PlatformAssets from 'pages/ConceptOverview/views/PlatformAssets';
import ReferenceLinks from 'pages/ConceptOverview/views/ReferenceLinks';
import Campaign from 'pages/Campaign';
import Milestone from '../Milestone';

export default function ConceptSpecific() {
  const { type } = useParams();

  const {
    conceptOverview: data,
    isFullscreen,
    campaignId,
  } = useContext(ConceptOverviewContext);

  const breadcrumbs = [
    <Link
      key="1"
      color="inherit"
      to={`/projects/${data?.partner_uuid}/concept/${data?.concept_id}/overview`}
      style={{ textDecoration: 'none' }}
    >
      <Typography
        color="primary"
        fontSize="13px"
        noWrap
        sx={{ ':hover': { textDecoration: 'underline' } }}
      >
        {data?.name}
      </Typography>
    </Link>,
    <Typography key="2" color="#968f92" fontSize="13px">
      {type === 'assets'
        ? 'Platform Assets'
        : type === 'campaign'
        ? 'Campaign'
        : type === 'milestone'
        ? 'Milestones Beta'
        : 'Reference Links'}
    </Typography>,
  ];

  return (
    <Box
      width="-webkit-fill-available"
      sx={{
        height:
          (type.toLowerCase() === 'milestone' ||
            type.toLowerCase() === 'links') &&
          'calc(100vh - 3.5em)',
        overflowY:
          (type.toLowerCase() === 'milestone' ||
            type.toLowerCase() === 'links') &&
          'scroll',
      }}
    >
      {['assets', 'campaign', 'links', 'overview', 'milestone'].includes(
        type.toLowerCase()
      ) ? (
        <>
          {!campaignId && !isFullscreen && (
            <Fade in={isFullscreen}>
              <Header />
            </Fade>
          )}

          {
            // Overview
            type.toLowerCase() === 'overview' ? (
              <Overview />
            ) : (
              <Box>
                {!campaignId && (
                  <Box padding="0 1.2em">
                    {!isFullscreen && (
                      <Fade in={!isFullscreen}>
                        <Box
                          mt={1.5}
                          px={1.2}
                          py={0.75}
                          sx={{
                            width: 'fit-content',
                            maxWidth: '100%',
                            backgroundColor: 'rgba(255,255,255,.78)',
                            border: '1px solid rgba(0,0,0,.08)',
                            borderRadius: '999px',
                            boxShadow: '0 14px 32px -28px rgba(15,23,42,.75)',
                            backdropFilter: 'blur(12px)',
                          }}
                        >
                          <Breadcrumbs
                            separator="›"
                            aria-label="breadcrumb"
                            sx={{ li: { maxWidth: '170px' } }}
                          >
                            {breadcrumbs}
                          </Breadcrumbs>
                        </Box>
                      </Fade>
                    )}
                  </Box>
                )}
                <Box mt={1}>
                  {type.toLowerCase() === 'assets' ? (
                    <PlatformAssets />
                  ) : type.toLowerCase() === 'links' ? (
                    <ReferenceLinks />
                  ) : type.toLowerCase() === 'milestone' ? (
                    <Milestone />
                  ) : (
                    <Campaign />
                  )}
                </Box>
              </Box>
            )
          }
        </>
      ) : (
        <Box
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          height="calc(100vh - 6em)"
          width="-webkit-fill-available"
        >
          <LinkOffTwoToneIcon
            sx={{
              width: '8em',
              height: '8em',
              color: '#f16079',
            }}
          />
          <Typography fontWeight={700} variant="h4">
            Link not available
          </Typography>
          <Typography color="#949494">
            Kindly make sure the link is spelled correctly.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
