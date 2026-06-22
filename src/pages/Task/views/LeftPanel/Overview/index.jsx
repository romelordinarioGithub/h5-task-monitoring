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
import TaskContext from 'pages/Task/Context';
// MUI icons
import TagIcon from '@mui/icons-material/Tag';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
// local components
import CollapsiblePanels from 'pages/Task/Components/CollapsiblePanels';
import EditBox from 'pages/Task/Components/EditBox';
// Static Icons
import { channelIcons } from 'constants/widgets';
import {
  overview,
  other_overview_info,
  other_overview_info_for_concept_design,
  smartly_overview,
  smartly_other_overview_info,
} from 'pages/Task/constant';
// color
import { appColors } from 'theme/variables';
import dayjs from 'dayjs';
import _ from 'lodash';

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
  } = useSelector((state) => state.tasks);

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
  } = useContext(TaskContext);

  const isQaTask = data?.team?.name?.toLowerCase() === 'qa';
  const isSmartlyTask = [15, 16].includes(data?.team?.id);
  const isDesignQaTask = data?.task_type?.toLowerCase() === 'design qa';

  const datasource = isSmartlyTask
    ? smartly_overview
    : _.filter(overview, (i) =>
        !isDesignQaTask || !isQaTask ? i.key != 'revision_round' : i
      );

  const otherOverviewInfoDatasource = isSmartlyTask
    ? smartly_other_overview_info
    : data?.task_type?.toLowerCase().includes('concept design')
    ? other_overview_info_for_concept_design
    : other_overview_info;

  const displayDesktop = _.filter(
    desktopDisplayList,
    (data) => data?.is_selected == true
  );
  const displayMobile = _.filter(
    mobileDisplayList,
    (data) => data?.is_selected == true
  );

  return (
    <Fragment>
      <Stack>
        <Box>
          {datasource.map((fields, index) => {
            switch (fields.key) {
              case 'campaign_name':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          {data.rel_type === 'subtask' ? (
                            <Typography
                              sx={{
                                ':hover': { color: '#F22076' },
                                textDecoration: 'none',
                              }}
                              component={Link}
                              to={`/projects/${data?.partner_id}/concept/${data?.concept_id}/campaign?campaignId=${data?.campaign_id}`}
                              target="_blank"
                            >
                              {data[fields.key]}
                            </Typography>
                          ) : (
                            <EditBox
                              title={data[fields.key]}
                              link={`/projects/${data?.partner_id}/concept/${data?.concept_id}/campaign?campaignId=${data?.campaign_id}`}
                              name="campaign"
                              data={
                                !_.isEmpty(campaignList) ? campaignList : []
                              }
                              defaultValue={campaign}
                              onInputChange={onInputChange}
                              isRequired={true}
                              isDisabled={_.isNull(concept)}
                              isLoading={isFetchingCampaign}
                              isEdit={isEditOverview}
                            />
                          )}
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'channel':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box>
                            {!_.isEmpty(data[fields.key]) ? (
                              <Chip
                                icon={
                                  channelIcons[
                                    `${data[fields.key].toLowerCase()}`
                                  ]
                                }
                                label={
                                  data[fields.key].toLowerCase() === 'facebook'
                                    ? 'Meta'
                                    : data[fields.key]
                                }
                                size="small"
                                variant="outlined"
                                sx={{
                                  marginRight: '0.5em',
                                  borderRadius: '0.3em',
                                  borderColor:
                                    appColors.social[
                                      `${data[fields.key].toLowerCase()}`
                                    ],
                                  color:
                                    appColors.social[
                                      `${data[fields.key].toLowerCase()}`
                                    ],
                                  '& .MuiChip-iconSmall': {
                                    width: '0.7em',
                                    marginLeft: '5px',
                                  },
                                }}
                              />
                            ) : (
                              <Chip
                                label="No channel selected"
                                size="small"
                                variant="outlined"
                                sx={{
                                  marginRight: '0.5em',
                                  borderStyle: 'dashed',
                                  borderRadius: '0.3em',
                                }}
                              />
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'parent_task_name':
                return (
                  data.rel_type !== 'task' && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography
                            component={Link}
                            to={`/${
                              data?.rel_type?.toLowerCase().includes('task')
                                ? 'task'
                                : 'campaign'
                            }/${data?.task_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              ':hover': {
                                color: '#F22076',
                                cursor: 'pointer',
                              },
                              textDecoration: 'none',
                            }}
                            // onClick={() =>
                            //   data?.rel_type === 'subtask' &&
                            //   handleRedirectionToParent(
                            //     data?.rel_type,
                            //     data?.task_id
                            //   )
                            // }
                          >
                            {data[fields.key]}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'tags':
                return (
                  <Fragment key={index}>
                    <Grid container sx={{ padding: '0.2em 0' }}>
                      <Grid item xs={4}>
                        <Typography fontWeight={700}>{fields.name}</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Box width="fit-content">
                          {!_.isEmpty(data[fields.key])
                            ? data[fields.key].map((e, i) => (
                                <Chip
                                  color="secondary"
                                  key={i}
                                  label={e.title}
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
                          <Chip
                            icon={<TagIcon />}
                            label="Add tags"
                            size="small"
                            variant="outlined"
                            color="secondary"
                            sx={{
                              marginRight: '0.5em',
                              cursor: 'pointer',
                              borderStyle: 'dashed',
                              '& .MuiChip-iconSmall': {
                                width: '0.7em',
                                marginLeft: '5px',
                              },
                            }}
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
                          />
                          {!_.isEmpty(data[fields.key]) && (
                            <Chip
                              icon={<DeleteIcon />}
                              label="Clear tags"
                              size="small"
                              variant="outlined"
                              color="secondary"
                              sx={{
                                marginRight: '0.5em',
                                cursor: 'pointer',
                                borderStyle: 'dashed',
                                '& .MuiChip-iconSmall': {
                                  width: '0.7em',
                                  marginLeft: '5px',
                                },
                              }}
                              onClick={() =>
                                handleSave({
                                  key: 'tags',
                                  action: 'remove',
                                  // Below are endpoint's parameters
                                  ids: data[fields.key]
                                    ?.map((tags) => tags.id)
                                    ?.toString(),
                                  rel_id: data?.id,
                                  type: data?.rel_type,
                                })
                              }
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: '#0000000a' }} />
                  </Fragment>
                );

              case 'triggers':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box
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
                            width="fit-content"
                          >
                            {!_.isEmpty(data[fields.key])
                              ? data[fields.key].map((e, i) => (
                                  <Chip
                                    color="secondary"
                                    key={i}
                                    label={e.name}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      marginRight: '0.5em',
                                      cursor: 'pointer',
                                    }}
                                  />
                                ))
                              : null}
                            <Chip
                              icon={<DesignServicesOutlinedIcon />}
                              label="Add triggers"
                              size="small"
                              variant="outlined"
                              color="secondary"
                              sx={{
                                marginRight: '0.5em',
                                cursor: 'pointer',
                                borderStyle: 'dashed',
                                '& .MuiChip-iconSmall': {
                                  width: '0.7em',
                                  marginLeft: '5px',
                                },
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'desktop_displays':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box
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
                            width="fit-content"
                          >
                            {!_.isEmpty(displayDesktop) ? (
                              displayDesktop.map((e, i) => (
                                <Chip
                                  color="secondary"
                                  key={i}
                                  label={e.size}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    marginRight: '0.5em',
                                    cursor: 'pointer',
                                  }}
                                />
                              ))
                            ) : (
                              <Chip
                                icon={<ComputerOutlinedIcon />}
                                label="Add desktop sizes"
                                size="small"
                                variant="outlined"
                                color="secondary"
                                sx={{
                                  marginRight: '0.5em',
                                  cursor: 'pointer',
                                  borderStyle: 'dashed',
                                  '& .MuiChip-iconSmall': {
                                    width: '0.7em',
                                    marginLeft: '5px',
                                  },
                                }}
                              />
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'mobile_displays':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box
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
                            width="fit-content"
                          >
                            {!_.isEmpty(displayMobile) ? (
                              displayMobile.map((e, i) => (
                                <Chip
                                  color="secondary"
                                  key={i}
                                  label={e.size}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    marginRight: '0.5em',
                                    cursor: 'pointer',
                                  }}
                                />
                              ))
                            ) : (
                              <Chip
                                icon={<PhoneIphoneOutlinedIcon />}
                                label="Add mobile sizes"
                                size="small"
                                variant="outlined"
                                color="secondary"
                                sx={{
                                  marginRight: '0.5em',
                                  cursor: 'pointer',
                                  borderStyle: 'dashed',
                                  '& .MuiChip-iconSmall': {
                                    width: '0.7em',
                                    marginLeft: '5px',
                                  },
                                }}
                              />
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'refresh':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          {data[fields.key] ? 'Yes' : 'No'}
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'delivery_date':
              case 'due_date':
              case 'date_started':
              case 'date_ended':
                return (
                  <Fragment key={index}>
                    <Grid container sx={{ padding: '0.2em 0' }}>
                      <Grid item xs={4}>
                        {!_.isNull(fields?.tooltip) ? (
                          <Tooltip
                            title={
                              <Typography
                                color="white"
                                sx={{ fontSize: '1em' }}
                              >
                                {fields?.tooltip}
                              </Typography>
                            }
                          >
                            <Typography fontWeight={700}>
                              {fields.name}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={8}>
                        <Box
                          onClick={(e) =>
                            handleOpen(
                              e,
                              'left',
                              fields.key,
                              null,
                              data[fields.key]?.replace(/-/g, '/')
                            )
                          }
                          width="fit-content"
                        >
                          <Typography
                            color="secondary"
                            sx={{ cursor: 'pointer' }}
                          >
                            {!_.isNull(data[fields.key]) &&
                            !_.isEmpty(data[fields.key])
                              ? dayjs(
                                  data[fields.key].replace(/-/g, '/')
                                ).format('MM/DD/YYYY hh:mm A')
                              : `${fields.name} not set.`}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: '#0000000a' }} />
                  </Fragment>
                );

              case 'date_created':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Tooltip
                            title={
                              <Typography
                                color="white"
                                sx={{ fontSize: '1em' }}
                              >
                                {fields?.tooltip}
                              </Typography>
                            }
                          >
                            <Typography fontWeight={700}>
                              {fields.name}
                            </Typography>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={8}>
                          {dayjs(data[fields.key]?.replace(/-/g, '/')).format(
                            'MM/DD/YYYY hh:mm A'
                          )}
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'team':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <EditBox
                            title={data[fields.key]?.name}
                            name="team"
                            data={_.filter(
                              _.sortBy(teamList, (s) => s.name),
                              (t) => [3, 4, 5, 6, 8].includes(t.id)
                            )}
                            defaultValue={team}
                            onInputChange={onInputChange}
                            isRequired={true}
                            isEdit={isEditOverview}
                          />
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'task_type':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <EditBox
                            title={data[fields.key]}
                            name="task_type"
                            data={
                              _.isEmpty(team)
                                ? _.filter(
                                    _.sortBy(taskTypeList, (s) => s.name),
                                    (t) => [3, 4, 5, 6, 8].includes(t.team_id)
                                  )
                                : _.sortBy(taskTypeList, (s) => s.name).filter(
                                    (i) => i.team_id === team.id
                                  )
                            }
                            defaultValue={taskType}
                            onInputChange={onInputChange}
                            isRequired={true}
                            isDisabled={_.isNull(team)}
                            isEdit={isEditOverview}
                          />
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'platform_link':
                return (
                  <Fragment key={index}>
                    <Grid container sx={{ padding: '0.2em 0' }}>
                      <Grid item xs={4}>
                        <Typography fontWeight={700}>{fields.name}</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography
                          sx={{
                            '& a': { color: '#7e14e6' },
                            marginTop: '5px',
                            marginBottom: '5px',
                          }}
                        >
                          {data[fields.key] ? (
                            <a
                              href={`${data[fields.key]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {data[fields.key]?.length > 40
                                ? `${data[fields.key].substring(0, 40)}...`
                                : `${data[fields.key]}`}
                            </a>
                          ) : (
                            'Not Set'
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                  </Fragment>
                );

              case 'concept':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <EditBox
                            title={data[fields.key]}
                            link={`/projects/${data?.partner_id}/concept/${data?.concept_id}/overview`}
                            name="concept"
                            data={!_.isEmpty(conceptList) ? conceptList : []}
                            defaultValue={concept}
                            onInputChange={onInputChange}
                            isRequired={true}
                            isEdit={isEditOverview}
                          />
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
              default:
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }}>
                        <Grid item xs={4}>
                          <Typography fontWeight={700}>
                            {fields.key === 'id'
                              ? data.rel_type === 'task'
                                ? fields.name
                                : 'Subtask ID'
                              : fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          {data[fields.key]}
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );
            }
          })}
        </Box>
        {otherOverviewInfoDatasource.map(
          (other_info, index) =>
            (data.rel_type === 'subtask'
              ? data.rel_type !== other_info.key &&
                other_info.key !== 'revisions'
              : data.rel_type !== other_info.key) && (
              <CollapsiblePanels
                overview={overview}
                data={data}
                key={index}
                name={other_info.name}
                dataFields={data}
                subtasks={subtasks}
                creatives={creatives}
                priorityList={priorityList}
                usersList={usersList}
                statusList={statusList}
                handleOpen={handleOpen}
                onCloseDialog={onCloseDialog}
                onChangeSubtasksAccordion={onChangeSubtasksAccordion}
              />
            )
        )}
      </Stack>
    </Fragment>
  );
}

Overview.propTypes = {
  onCloseDialog: PropTypes.any,
};

export default Overview;
