import { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Stack,
  Box,
  OutlinedInput,
  Typography,
  IconButton,
  Collapse,
  Grid,
  styled,
  Chip,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// Global CSS
import '../../../../assets/css/concept/task/overide.css';
import { templates_formats, templates_sizes } from 'pages/Brief/constant';
import _ from 'lodash';

const CollapsiblePanels = ({ name, handleOpen }) => {
  const [expand, setExpand] = useState(true);

  const getDatasource = () => {
    switch (name) {
      case 'Templates Formats':
        return templates_formats;
      case 'Templates Sizes':
        return templates_sizes;
    }
  };

  const datasource = getDatasource();

  const {
    overview: { brief: data },
  } = useSelector((state) => state.briefs);

  switch (name.toLowerCase()) {
    case 'formats':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700} noWrap>
                {name}
              </Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Stack ml={1} spacing={1}>
              {datasource.map((fields, index) => {
                switch (fields.key) {
                  default:
                    return (
                      !_.isEmpty(data[fields.key]) && (
                        <Fragment key={index}>
                          <Grid container sx={{ padding: '0.2em 0' }}>
                            <Grid item xs={5}>
                              <Typography fontWeight={700} mt={0.7}>
                                {fields.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={7}>
                              {!_.isEmpty(data[fields.key])
                                ? data[fields.key].map((e, i) => (
                                    <Chip
                                      color="secondary"
                                      key={i}
                                      label={_.startCase(e.value)}
                                      size="small"
                                      variant="outlined"
                                      onClick={(e) =>
                                        handleOpen(
                                          e,
                                          'left',
                                          fields.key,
                                          null,
                                          null,
                                          'task'
                                        )
                                      }
                                      sx={{
                                        marginRight: '0.5em',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  ))
                                : null}
                            </Grid>
                          </Grid>
                          <Divider sx={{ borderColor: '#0000000a' }} />
                        </Fragment>
                      )
                    );
                }
              })}
            </Stack>
          </Collapse>
        </>
      );

    case 'templates formats':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700} noWrap>
                {name?.replace('s', '')}
              </Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Stack ml={1} spacing={1}>
              {datasource.map((fields, index) => {
                switch (fields.key) {
                  default:
                    return (
                      !_.isEmpty(data[fields.key]) && (
                        <Fragment key={index}>
                          <Grid container sx={{ padding: '0.2em 0' }}>
                            <Grid item xs={5}>
                              <Typography fontWeight={700} mt={0.7}>
                                {fields.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={7}>
                              {!_.isEmpty(data[fields.key])
                                ? data[fields.key]?.map((e, i) => (
                                    <Chip
                                      color="secondary"
                                      key={i}
                                      label={`${e?.value}`}
                                      size="small"
                                      variant="outlined"
                                      onClick={(e) =>
                                        handleOpen(
                                          e,
                                          'left',
                                          fields.key,
                                          null,
                                          null,
                                          'task'
                                        )
                                      }
                                      sx={{
                                        marginRight: '0.5em',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  ))
                                : null}
                            </Grid>
                          </Grid>
                          <Divider sx={{ borderColor: '#0000000a' }} />
                        </Fragment>
                      )
                    );
                }
              })}
            </Stack>
          </Collapse>
        </>
      );
    case 'templates sizes':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700} noWrap>
                {name}
              </Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Stack ml={1} spacing={1}>
              {datasource.map((fields, index) => {
                switch (fields.key) {
                  //  case 'scratch_display_google_display_ad_rich_media_display_template_sizes':
                  // case 'scratch_display_google_display_ad_standard_display_template_sizes':
                  // case 'scratch_display_google_display_ad_image_video_template_sizes':
                  // case 'scratch_display_google_ads_performance_max_image_video_template_sizes':
                  // case 'scratch_display_google_ads_display_ad_standard_display_template_sizes':
                  // case 'scratch_display_google_ads_demand_gen_template_sizes':
                  // case 'scratch_display_google_customer_match_template_sizes':
                  // case 'scratch_display_google_uac_template_sizes':
                  // case 'scratch_displaytrade_desk_dsp_template_sizes':
                  // case 'scratch_display_yahoo_dsp_template_sizes':
                  //   return (
                  //     !_.isEmpty(data[fields.key]) && (
                  //       <Fragment key={index}>
                  //         <Grid container sx={{ padding: '0.2em 0' }}>
                  //           <Grid item xs={5}>
                  //             <Typography fontWeight={700} mt={0.7}>
                  //               {fields.name}
                  //             </Typography>
                  //             {!_.isUndefined(data[fields.key].flags) ||
                  //             !_.isEmpty(data[fields.key].flags) ? (
                  //               <Typography variant="caption">
                  //                 {_.capitalize(
                  //                   _.first(data[fields.key].flags)?.replace(
                  //                     '_',
                  //                     ' '
                  //                   )
                  //                 )}
                  //               </Typography>
                  //             ) : null}
                  //           </Grid>
                  //           <Grid item xs={7}>
                  //             <Chip
                  //               color="secondary"
                  //               label={data[fields.key].text}
                  //               size="small"
                  //               variant="outlined"
                  //               onClick={(e) =>
                  //                 handleOpen(
                  //                   e,
                  //                   'left',
                  //                   fields.key,
                  //                   null,
                  //                   null,
                  //                   'task'
                  //                 )
                  //               }
                  //               sx={{
                  //                 marginRight: '0.5em',
                  //                 cursor: 'pointer',
                  //               }}
                  //             />
                  //           </Grid>
                  //         </Grid>
                  //         <Divider sx={{ borderColor: '#0000000a' }} />
                  //       </Fragment>
                  //     )
                  //   );
                  case 'existing_meta_template_sizes':
                  case 'existing_pinterest_template_sizes':
                  case 'existing_snapchat_template_sizes':
                  case 'existing_tiktok_template_sizes':
                  case 'existing_youtube_template_sizes':
                    return (
                      !_.isEmpty(data[fields.key]) && (
                        <Fragment key={index}>
                          <Grid container sx={{ padding: '0.2em 0' }}>
                            <Grid item xs={5}>
                              <Typography fontWeight={700} mt={0.7}>
                                {fields.name}
                              </Typography>
                              {!_.isUndefined(data[fields.key].flags) ||
                              !_.isEmpty(data[fields.key].flags) ? (
                                <Typography variant="caption">
                                  Need adjustment or variation of an existing
                                  Master Template
                                </Typography>
                              ) : null}
                            </Grid>
                            <Grid item xs={7}>
                              {!_.isEmpty(data[fields.key])
                                ? data[fields.key].map((e, i) => (
                                    <Chip
                                      color="secondary"
                                      key={i}
                                      label={`${e?.value}  (€ ${Number(
                                        e?.price
                                      ).toLocaleString()})`}
                                      size="small"
                                      variant="outlined"
                                      onClick={(e) =>
                                        handleOpen(
                                          e,
                                          'left',
                                          fields.key,
                                          null,
                                          null,
                                          'task'
                                        )
                                      }
                                      sx={{
                                        marginRight: '0.5em',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  ))
                                : null}
                            </Grid>
                          </Grid>
                          <Divider sx={{ borderColor: '#0000000a' }} />
                        </Fragment>
                      )
                    );
                  case 'scratch_pinterest_video_template_sizes':
                  case 'scratch_youtube_video_template_sizes':
                  case 'scratch_meta_video_template_sizes':
                  case 'scratch_tiktok_video_template_sizes':
                  case 'scratch_snapchat_video_template_sizes':
                  case 'scratch_meta_static_template_sizes':
                  case 'scratch_meta_carousel_template_sizes':
                  case 'scratch_meta_dpa_template_sizes':
                  case 'scratch_meta_daba_template_sizes':
                  case 'scratch_meta_cpv_template_sizes':
                  case 'scratch_tiktok_static_template_sizes':
                  case 'scratch_tiktok_carousel_template_sizes':
                  case 'scratch_tiktok_dpa_template_sizes':
                  case 'scratch_tiktok_daba_template_sizes':
                  case 'scratch_tiktok_cpv_template_sizes':
                  case 'scratch_tiktok_vsa_template_sizes':
                  case 'scratch_snapchat_static_template_sizes':
                  case 'scratch_snapchat_carousel_template_sizes':
                  case 'scratch_snapchat_dpa_template_sizes':
                  case 'scratch_snapchat_daba_template_sizes':
                  case 'scratch_snapchat_cpv_template_sizes':
                  case 'scratch_pinterest_static_template_sizes':
                  case 'scratch_pinterest_carousel_template_sizes':
                  case 'scratch_display_amazon_dsp_template_sizes':
                  case 'scratch_display_google_display_ad_rich_media_display_template_sizes':
                  case 'scratch_display_google_display_ad_standard_display_template_sizes':
                  case 'scratch_display_google_display_ad_image_video_template_sizes':
                  case 'scratch_display_google_ads_performance_max_image_video_template_sizes':
                  case 'scratch_display_google_ads_display_ad_standard_display_template_sizes':
                  case 'scratch_display_google_ads_demand_gen_template_sizes':
                  case 'scratch_display_google_customer_match_template_sizes':
                  case 'scratch_display_google_uac_template_sizes':
                  case 'scratch_displaytrade_desk_dsp_template_sizes':
                  case 'scratch_display_yahoo_dsp_template_sizes':
                  case 'reuse_meta_static_template_sizes':
                  case 'reuse_meta_video_template_sizes':
                  case 'reuse_meta_carousel_template_sizes':
                  case 'reuse_meta_dpa_template_sizes':
                  case 'reuse_meta_daba_template_sizes':
                  case 'reuse_meta_cpv_template_sizes':
                  case 'reuse_tiktok_static_template_sizes':
                  case 'reuse_tiktok_video_template_sizes':
                  case 'reuse_tiktok_carousel_template_sizes':
                  case 'reuse_tiktok_dpa_template_sizes':
                  case 'reuse_tiktok_daba_template_sizes':
                  case 'reuse_tiktok_cpv_template_sizes':
                  case 'reuse_tiktok_vsa_template_sizes':
                  case 'reuse_snapchat_static_template_sizes':
                  case 'reuse_snapchat_video_template_sizes':
                  case 'reuse_snapchat_carousel_template_sizes':
                  case 'reuse_snapchat_dpa_template_sizes':
                  case 'reuse_snapchat_daba_template_sizes':
                  case 'reuse_snapchat_cpv_template_sizes':
                  case 'reuse_pinterest_static_template_sizes':
                  case 'reuse_pinterest_video_template_sizes':
                  case 'reuse_pinterest_carousel_template_sizes':
                  case 'reuse_youtube_video_template_sizes':
                  case 'reuse_display_amazon_dsp_template_sizes':
                  case 'reuse_display_google_ads_demand_gen_template_sizes':
                  case 'reuse_display_google_ads_display_ad_standard_display_template_sizes':
                  case 'reuse_display_google_ads_performance_max_image_video_template_sizes':
                  case 'reuse_display_google_customer_match_template_sizes':
                  case 'reuse_display_google_display_ad_image_video_template_sizes':
                  case 'reuse_display_google_display_ad_rich_media_display_template_sizes':
                  case 'reuse_display_google_display_ad_standard_display_template_sizes':
                  case 'reuse_display_google_uac_template_sizes':
                  case 'reuse_display_yahoo_dsp_template_sizes':
                  case 'reuse_displaytrade_desk_dsp_template_sizes':
                    return (
                      !_.isEmpty(data[fields.key]) && (
                        <Fragment key={index}>
                          <Grid container sx={{ padding: '0.2em 0' }}>
                            <Grid item xs={5}>
                              <Typography fontWeight={700} mt={0.7}>
                                {fields.name}
                              </Typography>
                              {!_.isUndefined(data[fields.key].flags) &&
                              !_.isEmpty(data[fields.key].flags) ? (
                                <Typography variant="caption">
                                  Need adjustment or variation of an existing
                                  Master Template
                                </Typography>
                              ) : null}
                            </Grid>
                            <Grid item xs={7}>
                              {console.log(data[fields.key])}
                              {!_.isEmpty(data[fields.key])
                                ? data[fields.key]?.selections?.map((e, i) => (
                                    <Chip
                                      color="secondary"
                                      key={i}
                                      label={`${e?.value}  ${
                                        e?.duration ? ` - ${e?.duration} ` : ''
                                      }`}
                                      size="small"
                                      variant="outlined"
                                      onClick={(e) =>
                                        handleOpen(
                                          e,
                                          'left',
                                          fields.key,
                                          null,
                                          null,
                                          'task'
                                        )
                                      }
                                      sx={{
                                        marginRight: '0.5em',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  )) ??
                                  data[fields.key]?.map((e, i) => (
                                    <Chip
                                      color="secondary"
                                      key={i}
                                      label={`${e?.value}  ${
                                        e?.duration ? ` - ${e?.duration} ` : ''
                                      }`}
                                      size="small"
                                      variant="outlined"
                                      onClick={(e) =>
                                        handleOpen(
                                          e,
                                          'left',
                                          fields.key,
                                          null,
                                          null,
                                          'task'
                                        )
                                      }
                                      sx={{
                                        marginRight: '0.5em',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  ))
                                : null}
                            </Grid>
                          </Grid>
                          <Divider sx={{ borderColor: '#0000000a' }} />
                        </Fragment>
                      )
                    );

                  // return (
                  //   !_.isEmpty(data[fields.key]) && (
                  //     <Fragment key={index}>
                  //       <Grid container sx={{ padding: '0.2em 0' }}>
                  //         <Grid item xs={5}>
                  //           <Typography fontWeight={700} mt={0.7}>
                  //             {fields.name}
                  //           </Typography>
                  //           {!_.isUndefined(data[fields.key].flags) ||
                  //           !_.isEmpty(data[fields.key].flags) ? (
                  //             <Typography variant="caption">
                  //               {_.capitalize(
                  //                 _.first(data[fields.key].flags)?.replace(
                  //                   '_',
                  //                   ' '
                  //                 )
                  //               )}
                  //             </Typography>
                  //           ) : null}
                  //         </Grid>
                  //         <Grid item xs={7}>
                  //           <Chip
                  //             color="secondary"
                  //             label={data[fields.key]}
                  //             size="small"
                  //             variant="outlined"
                  //             onClick={(e) =>
                  //               handleOpen(
                  //                 e,
                  //                 'left',
                  //                 fields.key,
                  //                 null,
                  //                 null,
                  //                 'task'
                  //               )
                  //             }
                  //             sx={{
                  //               marginRight: '0.5em',
                  //               cursor: 'pointer',
                  //             }}
                  //           />
                  //         </Grid>
                  //       </Grid>
                  //       <Divider sx={{ borderColor: '#0000000a' }} />
                  //     </Fragment>
                  //   )
                  // );
                  default:
                    return (
                      !_.isEmpty(data[fields.key]) && (
                        <Fragment key={index}>
                          <Grid container sx={{ padding: '0.2em 0' }}>
                            <Grid item xs={5}>
                              <Typography fontWeight={700} mt={0.7}>
                                {fields.name}
                              </Typography>
                              {!_.isUndefined(data[fields.key].flags) ||
                              !_.isEmpty(data[fields.key].flags) ? (
                                <Typography variant="caption">
                                  Need adjustment or variation of an existing
                                  Master Template
                                </Typography>
                              ) : null}
                            </Grid>
                            <Grid item xs={7}>
                              {!_.isEmpty(data[fields.key])
                                ? data[fields.key]?.map((e, i) => (
                                    <Chip
                                      color="secondary"
                                      key={i}
                                      label={`${e?.value}  ${
                                        e?.duration ? ` - ${e?.duration} ` : ''
                                      }`}
                                      size="small"
                                      variant="outlined"
                                      onClick={(e) =>
                                        handleOpen(
                                          e,
                                          'left',
                                          fields.key,
                                          null,
                                          null,
                                          'task'
                                        )
                                      }
                                      sx={{
                                        marginRight: '0.5em',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  ))
                                : null}
                            </Grid>
                          </Grid>
                          <Divider sx={{ borderColor: '#0000000a' }} />
                        </Fragment>
                      )
                    );
                }
              })}
            </Stack>
          </Collapse>
        </>
      );
  }
};

CollapsiblePanels.propTypes = {
  name: PropTypes.string,
  dataFields: PropTypes.any,
  overview: PropTypes.any,
  data: PropTypes.any,
  subtasks: PropTypes.any,
  creatives: PropTypes.any,
  priorityList: PropTypes.any,
  usersList: PropTypes.any,
  statusList: PropTypes.any,
  handleOpen: PropTypes.func,
  onCloseDialog: PropTypes.func,
  onChangeSubtasksAccordion: PropTypes.func,
};

export default CollapsiblePanels;
