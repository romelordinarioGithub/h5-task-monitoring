import {
  Box,
  Button,
  Typography,
  styled,
  Tooltip,
  Stack,
  Divider,
  IconButton,
  AvatarGroup,
  Avatar,
  Breadcrumbs,
} from '@mui/material';
import _ from 'lodash';
import CampaignOverviewContext from 'pages/Campaign/context';
import React, { useContext } from 'react';
import Overview from '../Overview';
import { appColors } from 'theme/variables';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Tasks from '../Tasks';
import { BarChart, Groups3TwoTone } from '@mui/icons-material';
import { stringAvatar } from 'hooks';
import CampaignMilestone from '../Milestone';
import { channels } from 'pages/ConceptOverview/constant';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InsertLinkTwoToneIcon from '@mui/icons-material/InsertLinkTwoTone';
import ReferenceLinks from '../ReferenceLinks';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

export default function Main() {
  const {
    campaignId,
    conceptId,
    members,
    overview: {
      id,
      name,
      status,
      created_at,
      partner_name,
      partner_id,
      concept_name,
      channel,
      status_id,
      parent_id,
    },
    isActiveMilestonePage,
    isMilestonesEnabled,
    handleOnStartMilestone,
    handlePopover,
    tasks,
    isActiveReferenceLink,
  } = useContext(CampaignOverviewContext);

  const campaignBreadcrumbs = [
    <Link
      key="1"
      color="inherit"
      to={`/projects/${partner_id}/concept/${conceptId}/overview`}
      style={{ textDecoration: 'none' }}
    >
      <Typography
        color="primary"
        fontSize="13px"
        noWrap
        sx={{ ':hover': { textDecoration: 'underline' } }}
      >
        {concept_name}
      </Typography>
    </Link>,
    <Typography key="2" color="#968f92" fontSize="13px" noWrap>
      {name}
    </Typography>,
  ];

  const campaignMilestoneBreadcrumbs = [
    <Link
      key="1"
      color="inherit"
      to={`/projects/${partner_id}/concept/${conceptId}/overview`}
      style={{ textDecoration: 'none' }}
    >
      <Typography
        color="primary"
        fontSize="13px"
        noWrap
        sx={{ ':hover': { textDecoration: 'underline' } }}
      >
        {concept_name}
      </Typography>
    </Link>,
    <Link
      key="1"
      color="inherit"
      to={`/projects/${partner_id}/concept/${conceptId}/campaign?campaignId=${campaignId}`}
      style={{ textDecoration: 'none' }}
    >
      <Typography
        color="primary"
        fontSize="13px"
        noWrap
        sx={{ ':hover': { textDecoration: 'underline' } }}
      >
        {name}
      </Typography>
    </Link>,
    <Typography key="2" color="#968f92" fontSize="13px" noWrap>
      Milestone Beta
    </Typography>,
  ];

  const campaignReferenceLinksBreadcrumbs = [
    <Link
      key="1"
      color="inherit"
      to={`/projects/${partner_id}/concept/${conceptId}/overview`}
      style={{ textDecoration: 'none' }}
    >
      <Typography
        color="primary"
        fontSize="13px"
        noWrap
        sx={{ ':hover': { textDecoration: 'underline' } }}
      >
        {concept_name}
      </Typography>
    </Link>,
    <Link
      key="1"
      color="inherit"
      to={`/projects/${partner_id}/concept/${conceptId}/campaign?campaignId=${campaignId}`}
      style={{ textDecoration: 'none' }}
    >
      <Typography
        color="primary"
        fontSize="13px"
        noWrap
        sx={{ ':hover': { textDecoration: 'underline' } }}
      >
        {name}
      </Typography>
    </Link>,
    <Typography key="2" color="#968f92" fontSize="13px" noWrap>
      Reference Links
    </Typography>,
  ];

  return (
    !_.isEmpty(name) && (
      <>
        <Stack padding="8px 1.2em 0px">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                disableElevation
                disableFocusRipple
                disableRipple
                disableTouchRipple
                size="small"
                onClick={(e) =>
                  handlePopover(
                    e,
                    'campaign_status',
                    status_id,
                    id,
                    parent_id
                  )
                }

                sx={{
                  marginRight: '1em',
                  textTransform: 'capitalize',
                  backgroundColor:
                    appColors?.status[
                    _.camelCase(status?.replace(/_/g, ' ').toLowerCase())
                    ],
                  ':hover': {
                    backgroundColor:
                      appColors?.status[
                      _.camelCase(status?.replace(/_/g, ' ').toLowerCase())
                      ],
                  },
                }}
              >
                {status?.replace(/_/g, ' ')}
              </Button>
              <StyledTypography
                className="header__title--overlay"
                variant="h6"
                fontWeight={800}
                color="primary"
                noWrap
              >
                {name}
              </StyledTypography>
            </Box>
            <Box>
              {_.isEmpty(members) ? (
                <Tooltip
                  title="Add a follower"
                  componentsProps={{
                    tooltip: {
                      sx: { lineHeight: 'normal', margin: '0 !important' },
                    },
                  }}
                >
                  <IconButton
                    sx={{ border: '1px dashed #989898' }}
                    size="small"
                  >
                    <Groups3TwoTone />
                  </IconButton>
                </Tooltip>
              ) : (
                <AvatarGroup
                  max={100}
                  onClick={() => console.log('Members')}
                  sx={{ cursor: 'pointer' }}
                >
                  {members?.map((data) => (
                    <Tooltip
                      key={data?.id}
                      title={data?.name}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            lineHeight: 'normal',
                            margin: '0 !important',
                          },
                        },
                      }}
                    >
                      <Avatar
                        {...stringAvatar(data?.name, {
                          width: 24,
                          height: 24,
                          fontSize: '12px',
                        })}
                        src={data?.avatar}
                      />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              )}
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            my={1}
          >
            <Box display="flex" alignItems="center">
              <Box>
                <Tooltip
                  title="Date Created"
                  componentsProps={{
                    tooltip: {
                      sx: { lineHeight: 'normal', margin: '0 !important' },
                    },
                  }}
                >
                  <StyledTypography variant="caption" noWrap>
                    {moment(created_at).format('LLL')}
                  </StyledTypography>
                </Tooltip>
              </Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ margin: '0 0.4em' }}
              />
              <Box>
                <Tooltip
                  title="Partner Group"
                  componentsProps={{
                    tooltip: {
                      sx: { lineHeight: 'normal', margin: '0 !important' },
                    },
                  }}
                >
                  <Link
                    to={{
                      pathname: `https://beta.ad-lib.io/concepts?partner=${partner_id}`,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <StyledTypography
                      variant="caption"
                      color="secondary"
                      sx={{
                        cursor: 'pointer',
                        ':hover': { color: '#f22176' },
                      }}
                    >
                      {partner_name}
                    </StyledTypography>
                  </Link>
                </Tooltip>
              </Box>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ margin: '0 0.4em' }}
              />
              <Box>
                <Tooltip
                  title="Channel"
                  componentsProps={{
                    tooltip: {
                      sx: { lineHeight: 'normal', margin: '0 !important' },
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {
                      _.filter(channels, (c) => c?.label === channel)[0]
                        ?.content
                    }
                  </Box>
                </Tooltip>
              </Box>
            </Box>

            <Stack direction="row">
              {isMilestonesEnabled ? (
                <Box>
                  <Button
                    disableElevation
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    startIcon={<BarChart />}
                    size="small"
                    sx={{
                      textTransform: 'capitalize',
                      padding: '4px 10px',
                    }}
                    variant={isActiveMilestonePage ? 'contained' : 'text'}
                    component={Link}
                    to={`/projects/${partner_id}/concept/${conceptId}/campaign?campaignId=${id}&milestone=1`}
                  >
                    Milestones Beta
                  </Button>
                </Box>
              ) : (
                <Button
                  startIcon={<PlayArrowIcon />}
                  color="secondary"
                  size="small"
                  sx={{
                    marginLeft: 2,
                    fontSize: '0.75em',
                    fontWeight: 600,
                    '& .MuiButton-startIcon': {
                      marginRight: 0.2,
                      marginTop: '-2px',
                    },
                  }}
                  onClick={handleOnStartMilestone}
                  disabled={_.isEmpty(tasks)}
                >
                  Start milestone
                </Button>
              )}
              <Button
                disableElevation
                disableRipple
                disableFocusRipple
                disableTouchRipple
                startIcon={<InsertLinkTwoToneIcon />}
                size="small"
                sx={{ textTransform: 'capitalize', padding: '4px 10px' }}
                component={Link}
                to={`/projects/${partner_id}/concept/${conceptId}/campaign?campaignId=${id}&links=1`}
                variant={isActiveReferenceLink ? 'contained' : 'text'}
              >
                Reference Links
              </Button>
            </Stack>
          </Box>
        </Stack>
        <Box padding="0 1.2em">
          <Box backgroundColor="#ececec" pt={0.2} pb={0.4} px={1}>
            <Breadcrumbs
              separator="›"
              aria-label="breadcrumb"
              sx={{ li: { maxWidth: '170px' } }}
            >
              {isActiveMilestonePage
                ? campaignMilestoneBreadcrumbs
                : isActiveReferenceLink
                  ? campaignReferenceLinksBreadcrumbs
                  : campaignBreadcrumbs}
            </Breadcrumbs>
          </Box>
        </Box>
        <Box
          padding={
            isActiveReferenceLink || isActiveMilestonePage
              ? '0.7em 0em'
              : '1em 1.2em'
          }
          height="calc(100vh - 11.2em)"
          sx={{
            overflowX: 'auto',
            overflowY: 'auto',
          }}
        >
          {!isActiveMilestonePage && !isActiveReferenceLink && <Overview />}
          {isActiveMilestonePage ? (
            <CampaignMilestone />
          ) : isActiveReferenceLink ? (
            <ReferenceLinks />
          ) : (
            <Tasks />
          )}
        </Box>
      </>
    )
  );
}
