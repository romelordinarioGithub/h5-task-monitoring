import { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// MUI Components
import {
  Grid,
  Stack,
  Divider,
  Typography,
  Chip,
  Box,
  Tooltip,
} from '@mui/material';
// Context
import BriefContext from 'pages/Brief/Context';
// MUI icons
import TagIcon from '@mui/icons-material/Tag';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
// local components
import CollapsiblePanels from 'pages/Brief/Components/CollapsiblePanels';
// Static Icons
import { channelIcons } from 'constants/widgets';
import { brief, brief_overview } from 'pages/Brief/constant';
// color
import { appColors } from 'theme/variables';
import dayjs from 'dayjs';
import _ from 'lodash';

import { templates_formats, templates_sizes } from 'pages/Brief/constant';

function Overview({ onCloseDialog }) {
  const {
    overview: data,
    creatives,
    subtasks,
    options: {
      priorityList,
      usersList,
      statusList,
      desktopDisplayList,
      mobileDisplayList,
    },
  } = useSelector((state) => state.briefs);

  const briefDatasource = brief;
  const overviewDatasource = brief_overview;

  const briefData = data?.brief;

  const {
    handleOpen,
    campaign,
    campaignList,
    conceptList,
    concept,
    taskTypeList,
    taskType,
    teamList,
    team,
    isFetchingCampaign,
    isEditOverview,
    onInputChange,
    onChangeSubtasksAccordion,
    handleSave,
  } = useContext(BriefContext);

  const hasTemplateFormatsKey = templates_formats.some((format) => {
    return Object.prototype.hasOwnProperty.call(briefData, format.key);
  });

  const hasTemplateSizesKey = templates_sizes.some((format) => {
    return Object.prototype.hasOwnProperty.call(briefData, format.key);
  });

  return (
    <Fragment>
      <Stack>
        <Box>
          {overviewDatasource.map((fields, index) => {
            switch (fields.key) {
              case 'assets':
                return (
                  !_.isEmpty(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid
                        container
                        sx={{ padding: '0.2em 0 1em 0' }}
                        spacing={2}
                      >
                        <Grid item xs={5} mt={0.7}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Box width="fit-content">
                            {!_.isEmpty(data[fields.key])
                              ? data[fields.key].map((e, i) => (
                                  <Chip
                                    color="secondary"
                                    component="a"
                                    href={
                                      Object.prototype.hasOwnProperty.call(
                                        e,
                                        'link'
                                      )
                                        ? e.link
                                        : e
                                    }
                                    target="_blank"
                                    key={i}
                                    label={e.label ?? e}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      marginRight: '0.5em',
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                      maxWidth: 200, // Set a maximum width for the chip
                                      '& .MuiChip-label': {
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                      },
                                    }}
                                  />
                                ))
                              : null}
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
              case 'languages':
              case 'markets':
                return (
                  <Fragment key={index}>
                    <Grid
                      container
                      sx={{ padding: '0.2em 0 1em 0' }}
                      spacing={2}
                    >
                      <Grid item xs={5} mt={0.7}>
                        <Typography fontWeight={700}>{fields.name}</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Box width="fit-content">
                          {!_.isEmpty(data[fields.key])
                            ? data[fields.key].map((e, i) => (
                                <Chip
                                  color="secondary"
                                  key={i}
                                  label={e.value}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    marginRight: '0.5em',
                                    cursor: 'pointer',
                                  }}
                                />
                              ))
                            : null}
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: '#0000000a' }} />
                  </Fragment>
                );
              default:
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid
                        container
                        sx={{ padding: '0.2em 0 1em 0' }}
                        spacing={2}
                      >
                        <Grid item xs={5} mt={0.7}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Box
                            dangerouslySetInnerHTML={{
                              __html: data[fields.key],
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
            }
          })}
          {briefDatasource.map((fields, index) => {
            switch (fields.key) {
              case 'resizing':
              case 'stage':
              case 'templates':
                return (
                  !_.isEmpty(briefData[fields.key]) && (
                    <Fragment key={index}>
                      <Grid
                        container
                        sx={{ padding: '0.2em 0 1em 0' }}
                        spacing={2}
                      >
                        <Grid item xs={5}>
                          <Typography fontWeight={700} mt={0.7}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Typography>{briefData[fields.key]}</Typography>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
              case 'iterations':
                return (
                  !_.isEmpty(briefData[fields.key]) && (
                    <Fragment key={index}>
                      <Grid
                        container
                        sx={{ padding: '0.2em 0 1em 0' }}
                        spacing={2}
                      >
                        <Grid item xs={5}>
                          <Typography fontWeight={700} mt={0.7}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Stack direction="row" spacing={1}>
                            <Typography sx={{ cursor: 'pointer' }}>
                              {briefData[fields.key].split(' ')[0]}
                            </Typography>
                            <Typography color="secondary">
                              {briefData[fields.key].split(' ')[1]}{' '}
                              {briefData[fields.key].split(' ')[2]}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
              case 'existing_creative_templates':
              case 'resizing_or_new_iteration':
              case 'newsize_or_rebuild':
              case 'needs_concepting':
                return (
                  !_.isEmpty(briefData[fields.key]) && (
                    <Fragment key={index}>
                      <Grid
                        container
                        sx={{ padding: '0.2em 0 1em 0' }}
                        spacing={2}
                      >
                        <Grid item xs={5}>
                          <Typography fontWeight={700} mt={0.7}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Typography mt={0.7}>
                            {briefData[fields.key].value}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
              case 'need_iterations_campaign_variants':
              case 'campaign_languages_count':
                return (
                  !_.isEmpty(briefData[fields.key]) && (
                    <Fragment key={index}>
                      <Grid
                        container
                        sx={{ padding: '0.2em 0 1em 0' }}
                        spacing={2}
                      >
                        <Grid item xs={5}>
                          <Typography fontWeight={700} mt={0.7}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Stack direction="row">
                            <Typography mt={0.7} mr={1}>
                              {briefData[fields.key]?.value}
                            </Typography>
                            {briefData[fields.key]?.value !== 'No' && (
                              <Typography mt={0.7} color="secondary">
                                (€{' '}
                                {Number(
                                  briefData[fields.key]?.price
                                ).toLocaleString()}
                                )
                              </Typography>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
              case 'assets':
                return (
                  !_.isEmpty(briefData[fields.key]) && (
                    <Fragment key={index}>
                      <Grid
                        container
                        sx={{ padding: '0.2em 0 1em 0' }}
                        spacing={2}
                      >
                        <Grid item xs={5}>
                          <Typography fontWeight={700} mt={0.7}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Box width="fit-content">
                            {!_.isEmpty(briefData[fields.key])
                              ? briefData[fields.key].map((e, i) => (
                                  <Chip
                                    color="secondary"
                                    component="a"
                                    href={e}
                                    target="_blank"
                                    key={i}
                                    label={e}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      marginRight: '0.5em',
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                    }}
                                  />
                                ))
                              : null}
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
              case 'markets':
              case 'languages':
              case 'platforms':
              case 'scratch_platforms_advertising_on':
              case 'stage_funnel_targeting':
              case 'Meta':
              case 'Tiktok':
                return (
                  !_.isEmpty(briefData[fields.key]) && (
                    <Fragment key={index}>
                      <Grid
                        container
                        sx={{ padding: '0.2em 0 1em 0' }}
                        spacing={2}
                      >
                        <Grid item xs={5}>
                          <Typography fontWeight={700} mt={0.7}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Box width="fit-content">
                            {!_.isEmpty(briefData[fields.key])
                              ? briefData[fields.key].map((e, i) => (
                                  <Chip
                                    color="secondary"
                                    key={i}
                                    label={e.value}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      marginRight: '0.5em',
                                      cursor: 'pointer',
                                    }}
                                  />
                                ))
                              : null}
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
              case 'meta_channels':
              case 'google_channels':
              case 'google_ads_channels':
              case 'tiktok_channels':
              case 'youtube_channels':
              case 'pinterest_channels':
              case 'snapchat_channels':
                return (
                  !_.isEmpty(briefData[fields.key]) && (
                    <Fragment key={index}>
                      <Grid
                        container
                        sx={{ padding: '0.2em 0 1em 0' }}
                        spacing={2}
                      >
                        <Grid item xs={5}>
                          <Typography fontWeight={700} mt={0.7}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Box width="fit-content">
                            {!_.isEmpty(briefData[fields.key])
                              ? briefData[fields.key].map((e, i) => (
                                  <Chip
                                    color="secondary"
                                    key={i}
                                    label={_.startCase(
                                      e?.value?.split('_')?.pop()
                                    )}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      marginRight: '0.5em',
                                      cursor: 'pointer',
                                    }}
                                  />
                                ))
                              : null}
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
              default:
                return (
                  !_.isEmpty(briefData[fields.key]) && (
                    <Fragment key={index}>
                      <Grid
                        container
                        sx={{ padding: '0.2em 0 1em 0' }}
                        spacing={2}
                      >
                        <Grid item xs={5}>
                          <Typography fontWeight={700} mt={0.7}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Box
                            dangerouslySetInnerHTML={{
                              __html: briefData[fields.key],
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
            }
          })}
        </Box>
        {hasTemplateFormatsKey && (
          <CollapsiblePanels name={'Templates Formats'} />
        )}
        {hasTemplateSizesKey && <CollapsiblePanels name={'Templates Sizes'} />}
      </Stack>
    </Fragment>
  );
}

Overview.propTypes = {
  onCloseDialog: PropTypes.any,
};

export default Overview;
