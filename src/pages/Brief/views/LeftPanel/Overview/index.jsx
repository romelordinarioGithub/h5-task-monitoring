import { Fragment, useContext } from 'react';
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
  Button,
  Avatar,
  AvatarGroup,
} from '@mui/material';
// Context
import BriefContext from 'pages/Brief/Context';
// MUI icons
import TagIcon from '@mui/icons-material/Tag';

// local components

// Static Icons
import { overview } from 'pages/Brief/constant';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import _ from 'lodash';
import CheckIcon from '@mui/icons-material/Check';
import Swal from 'sweetalert2';

function BriefOverview() {
  const { overview: data } = useSelector((state) => state.briefs);

  const { handleOpen, handleSave } = useContext(BriefContext);

  const approvalHistory = data?.approval_history?.slice()?.reverse();

  const datasource = overview;

  const handleButton = (approval) => {
    Swal.fire({
      title: `Do you want to ${approval.toLowerCase()} this brief`,
      icon: 'warning',
      confirmButtonText: 'Yes',
      showDenyButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleSave({
          key: 'is_approved',
          id: data?.id,
          value: approval,
        });
      }
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckIcon sx={{ fontSize: 14, color: 'white' }} />;
      case 'Rejected':
        return <CloseIcon sx={{ fontSize: 14, color: 'white' }} />;
    }
  };

  return (
    <Fragment>
      <Stack>
        <Box>
          {datasource.map((fields, index) => {
            switch (fields.key) {
              case 'assets':
                return (
                  !_.isEmpty(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }} spacing={3}>
                        <Grid item xs={6}>
                          <Typography fontWeight={700} mt={0.7}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Box width="fit-content">
                            {!_.isEmpty(data[fields.key])
                              ? data[fields.key].map((e, i) => (
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
              case 'languages':
              case 'markets':
                return (
                  <Fragment key={index}>
                    <Grid container sx={{ padding: '0.2em 0' }} spacing={3}>
                      <Grid item xs={6}>
                        <Typography fontWeight={700}>{fields.name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
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
              case 'tags':
                return (
                  <Fragment key={index}>
                    <Grid container sx={{ padding: '0.2em 0' }} spacing={3}>
                      <Grid item xs={6}>
                        <Typography fontWeight={700}>{fields.name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box width="fit-content">
                          {!_.isEmpty(data[fields.key])
                            ? data[fields.key].map((e, i) => (
                                <Chip
                                  color="secondary"
                                  key={i}
                                  label={e.name}
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
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: '#0000000a' }} />
                  </Fragment>
                );

              case 'delivery_date':
              case 'due_date':
              case 'campaign_launch_date':
                return (
                  <Fragment key={index}>
                    <Grid container sx={{ padding: '0.2em 0' }} spacing={3}>
                      <Grid item xs={6}>
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
                      <Grid item xs={6}>
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
                              ? data[fields.key] === '1970-01-01 08:00:00'
                                ? `Not Set`
                                : dayjs(
                                    data[fields.key].replace(/-/g, '/')
                                  ).format('MM/DD/YYYY hh:mm A')
                              : `Not Set`}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: '#0000000a' }} />
                  </Fragment>
                );

              case 'campaign_end_date':
                return (
                  <Fragment key={index}>
                    <Grid container sx={{ padding: '0.2em 0' }} spacing={3}>
                      <Grid item xs={6}>
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
                      <Grid item xs={6}>
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
                            {data[fields.key] === '1970-01-01 08:01:00' ||
                            data[fields.key] === '1970-01-01 08:00:00'
                              ? `Not Set`
                              : data[fields.key] === 'Always On'
                              ? data[fields.key]
                              : dayjs(
                                  data[fields.key]?.replace(/-/g, '/')
                                ).format('MM/DD/YYYY hh:mm A')}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: '#0000000a' }} />
                  </Fragment>
                );

              case 'created_at':
              case 'updated_at':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }} spacing={3}>
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
                          {data?.id === 28
                            ? '11/10/25 11:40 PM'
                            : dayjs(data[fields.key]).format(
                                'MM/DD/YYYY hh:mm A'
                              )}
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: '#0000000a' }} />
                    </Fragment>
                  )
                );

              case 'is_approved':
                return (
                  <Fragment key={index}>
                    <Grid container sx={{ padding: '0.2em 0' }} spacing={3}>
                      <Grid item xs={6}>
                        <Typography fontWeight={700}>Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color:
                              data.is_approved === 'Approved'
                                ? 'green'
                                : data.is_approved === 'Rejected'
                                ? 'red'
                                : 'orange',
                          }}
                        >
                          {data.is_approved === 'Approved' ? (
                            <CheckCircleOutlineIcon
                              sx={{
                                mr: 1,
                              }}
                            />
                          ) : data.is_approved === 'Rejected' ? (
                            <CancelOutlinedIcon
                              sx={{
                                mr: 1,
                              }}
                            />
                          ) : (
                            <AccessTimeOutlinedIcon
                              sx={{
                                mr: 1,
                              }}
                            />
                          )}

                          <Typography
                            sx={{
                              color:
                                data.is_approved === 'Approved'
                                  ? 'green'
                                  : data.is_approved === 'Rejected'
                                  ? 'red'
                                  : 'orange',
                            }}
                          >
                            {data[fields.key] === null
                              ? 'Pending'
                              : data[fields.key]}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: '#0000000a' }} />
                  </Fragment>
                );

              case 'creative_project_goals':
                return (
                  !_.isEmpty(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }} spacing={3}>
                        <Grid item xs={6}>
                          <Typography fontWeight={700} mt={0.7}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
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

              case 'customer_tier':
              case 'company_name':
              case 'request_type':
              case 'region':
                return (
                  !_.isNull(data[fields.key]) && (
                    <Fragment key={index}>
                      <Grid container sx={{ padding: '0.2em 0' }} spacing={3}>
                        <Grid item xs={6}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          {data[fields.key]?.value}
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
                      <Grid container sx={{ padding: '0.2em 0' }} spacing={3}>
                        <Grid item xs={6}>
                          <Typography fontWeight={700}>
                            {fields.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
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
        <Typography sx={{ mt: 1 }} fontWeight={700}>
          History of Approval
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
          <AvatarGroup max={9} spacing={-15}>
            {approvalHistory?.map((data, idx) => (
              <Tooltip
                sx={{ textTransform: 'capitalize' }}
                key={idx}
                title={
                  <>
                    <Box>
                      {data?.user.name} - {data.is_approve}
                    </Box>
                    {data?.created_at}
                  </>
                }
              >
                <Box>
                  {!_.isEmpty(data?.user?.avatar) &&
                  data?.user?.avatar?.split('/').pop() !== 'thumb_' ? (
                    <Avatar
                      sx={{
                        border: '3px solid #fff',
                        width: 36,
                        height: 36,
                        fontSize: 14,
                        position: 'relative',
                      }}
                      alt={data?.user.name}
                      src={data?.user?.avatar}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        border: '3px solid #fff',
                        width: 36,
                        height: 36,
                        fontSize: 14,
                        position: 'relative',
                      }}
                    >
                      {data?.id !== 0
                        ? `${data?.user.name?.split(' ')[0][0]}${
                            !_.isEmpty(data?.user.name?.split(' ')[1][0])
                              ? data?.user.name?.split(' ')[1][0]
                              : ''
                          }`
                        : null}
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      position: 'relative',
                      bottom: 14,
                      right: -20,
                      bgcolor: data.is_approve === 'Approved' ? 'green' : 'red',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getStatusIcon(data.is_approve)}
                  </Box>
                </Box>
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>

        <Divider sx={{ my: 1 }} />
        {/* Approved Button */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="success"
            fullWidth
            size="small"
            onClick={() => handleButton('Approved')}
            sx={{
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 },
            }}
            disabled={data.is_approved === 'Approved'}
          >
            Approve
          </Button>
          <Button
            disabled={data.is_approved === 'Rejected'}
            variant="outlined"
            color="error"
            fullWidth
            size="small"
            onClick={() => handleButton('Rejected')}
            sx={{
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 },
            }}
          >
            Reject
          </Button>
        </Stack>
      </Stack>
    </Fragment>
  );
}

BriefOverview.propTypes = {
  onCloseDialog: PropTypes.any,
};

export default BriefOverview;
