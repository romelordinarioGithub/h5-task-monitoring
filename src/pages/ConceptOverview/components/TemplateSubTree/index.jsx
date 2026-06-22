import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import _ from 'lodash';
import { Link, useLocation } from 'react-router-dom';
import {
  Tooltip,
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  styled,
  Badge,
} from '@mui/material';
import { appColors } from 'theme/variables';
import { getItemByKey } from 'utils/dictionary';
import {
  milestoneOwnerTypes,
  visibilityTypes,
} from 'pages/ConceptOverview/constant';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import appTheme from 'theme';
import Swal from 'sweetalert2';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

const StyledBox = styled(Box)({
  margin: '0px 2px 2px 0',
  padding: '0px 6px 0px',
  height: '35px',
  backgroundColor: '#f2f2f2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function TemplateSubTree({
  template,
  activeColumns,
  timeZone,
  isCampaign,
  onSubmitMilestoneSLA,
  handlePopover,
  handleDependencyToggle,
  handleDialogOpen,
}) {
  const location = useLocation();
  const wrapperRef = useRef(null);

  const [isEditDuration, setIsEditDuration] = useState(false);
  const [linkIconRotation, setLinkIconRotation] = useState(template?.duration);
  const [value, setValue] = useState(0);
  const [onHover, setOnHover] = useState(false);

  const isFirstItem = template.order === '1.1';

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, [isEditDuration, value]);

  const handleClickOutside = useCallback(
    (event) => {
      if (!isEditDuration) return;

      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        Swal.fire({
          title: 'Do you want to save the duration?',
          icon: 'warning',
          allowOutsideClick: false,
          showDenyButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: 'Cancel',
          backdrop: '#25175aa3',
        }).then(async (result) => {
          if (result.isConfirmed)
            onSubmitMilestoneSLA({
              id: template.id,
              value: value,
            });

          setValue(template?.duration);
          setIsEditDuration(false);
        });
      }
    },
    [isEditDuration, value]
  );

  return (
    <Box ref={wrapperRef}>
      <Box
        display="inline-flex"
        onMouseEnter={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}
      >
        <Box
          sx={{
            position: 'sticky',
            left: '0px',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            backgroundColor: '#f2f5f9',
          }}
        >
          {/* Temporary fixed for dashed lines */}
          <StyledBox
            sx={{
              borderLeft: '1px dashed #757575',
              position: 'relative',
              margin: '0px 2px 2px 0',
              padding: '0px 6px 0px',
              backgroundColor: '#f2f5f9',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '.9em',
            }}
          >
            <StyledTypography noWrap />
          </StyledBox>

          {/* Order */}
          {activeColumns.includes(1) && (
            <StyledBox
              width={45}
              borderLeft={`4px solid ${
                template.rel_type == 'task' ? '#5c52c3' : '#F22076'
              }`}
              sx={{
                marginLeft: template.rel_type == 'subtask' && '5px',
                justifyContent: 'center',
                textDecoration: 'none',
                backgroundColor: onHover && '#c9c6c6b0',
              }}
              title={template.order}
            >
              <StyledTypography
                noWrap
                fontSize="13px"
                sx={{
                  cursor: 'pointer',
                }}
              >
                {template.order}
              </StyledTypography>
            </StyledBox>
          )}

          {/* Milestone */}
          {activeColumns.includes(2) && (
            <StyledBox
              width={template.rel_type == 'subtask' ? 295 : 300}
              sx={{
                textDecoration: 'none',
                backgroundColor: onHover && '#c9c6c6b0',
                ':hover': template?.has_type && {
                  textDecoration: 'underline',
                },
                justifyContent: 'space-between',
                overflow: 'hidden',
              }}
              title={template?.task_name}
            >
              <Tooltip title={template?.task_name}>
                <StyledTypography
                  noWrap
                  fontSize="13px"
                  sx={{
                    cursor: 'pointer',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 220,
                    textDecoration: 'none',
                  }}
                  component={template.has_type ? Link : ''}
                  to={
                    template.has_type
                      ? {
                          pathname: isCampaign
                            ? `${template.link}`
                            : `/${template.rel_type}/${template.task_id}`,
                          state: {
                            background: location,
                            type: 'task',
                            subtask: template.rel_type.includes('subtask'),
                          },
                        }
                      : ''
                  }
                >
                  {template?.task_name}
                </StyledTypography>
              </Tooltip>
              <Stack direction="row">
                {!isFirstItem && (
                  /*!isCampaign &&*/ <Tooltip
                    title={'Link/Unlink dependency'}
                    disableInteractive
                  >
                    <IconButton
                      onClick={() => {
                        setLinkIconRotation(linkIconRotation > 0 ? -180 : 180);
                        template?.status_id === 1 &&
                          handleDependencyToggle(
                            template.id,
                            !template.is_dependent
                          );
                      }}
                      sx={{
                        color: template.is_dependent
                          ? appTheme.palette.primary.light
                          : 'grey',
                        fontSize: '1.1em',
                        transition: '.2s',
                        rotate: `${linkIconRotation}deg`,
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {!template.is_dependent ? <LinkOffIcon /> : <LinkIcon />}
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Add/Edit a note" disableInteractive>
                  <IconButton
                    onClick={() => handleDialogOpen(template, 'notes')}
                    sx={{
                      color: template.notes
                        ? appTheme.palette.primary.light
                        : 'grey',
                      fontSize: '1.1em',
                      transition: '.2s',
                      '&:hover': {
                        color: appTheme.palette.primary.light,
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={!template.notes}
                    >
                      <StickyNote2Icon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Stack>
            </StyledBox>
          )}
        </Box>

        {/* Status */}
        {activeColumns.includes(3) && (
          <StyledBox
            width={100}
            sx={{
              backgroundColor: appColors?.status[template.status.toLowerCase()],
              color: '#fff',
              textTransform: 'capitalize',
              textAlign: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={(e) =>
              !isFirstItem &&
              handlePopover(
                e,
                'milestone_status',
                template.status_id,
                template.id,
                null
              )
            }
          >
            <StyledTypography
              fontSize="13px"
              sx={{ cursor: 'pointer' }}
              noWrap
              color="#fff"
            >
              {template.status}
            </StyledTypography>
          </StyledBox>
        )}

        {/* Health */}
        {activeColumns.includes(4) && (
          <StyledBox
            width={100}
            sx={{
              textTransform: 'capitalize',
              textAlign: 'center',
              justifyContent: 'center',
              backgroundColor: onHover && '#c9c6c6b0',
            }}
          >
            <StyledTypography
              noWrap
              fontWeight={1000}
              color={
                appColors?.status[
                  template?.milestone_health
                    .toLowerCase()
                    .replace('-t', 'T')
                    .replace('-h', 'H')
                ]
              }
              fontSize="13px"
            >
              {template?.milestone_health}
            </StyledTypography>
          </StyledBox>
        )}
        {/* Owner Type */}
        {activeColumns.includes(5) && (
          <StyledBox
            width={150}
            sx={{
              cursor: 'pointer',
              backgroundColor: onHover && '#c9c6c6b0',
            }}
            onClick={(e) =>
              handlePopover(
                e,
                'milestone_owner_type',
                getItemByKey('name', template.owner, milestoneOwnerTypes).id,
                template.id,
                null
              )
            }
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
              sx={{ cursor: 'pointer', textTransform: 'capitalize' }}
            >
              {template?.owner}
            </StyledTypography>
          </StyledBox>
        )}

        {/* Duration */}
        {activeColumns.includes(6) && (
          <StyledBox
            width={100}
            sx={{
              cursor: 'pointer',
              backgroundColor: onHover && '#c9c6c6b0',
            }}
            onClick={() => {
              if (isEditDuration) return;
              setIsEditDuration(!isEditDuration);
            }}
          >
            {isEditDuration ? (
              <Box sx={{ backgroundColor: '#fff' }}>
                <TextField
                  InputProps={{
                    inputProps: {
                      min: 0,
                      style: {
                        textAlign: 'center',
                        fontSize: '13px',
                        marginLeft: '15px',
                      },
                    },
                    disableUnderline: true,
                  }}
                  variant="standard"
                  defaultValue={template?.duration}
                  type="number"
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSubmitMilestoneSLA({
                        id: template.id,
                        value: e.target.value,
                      });
                      setIsEditDuration(false);
                    }

                    if (e.key === 'Escape') {
                      setIsEditDuration(false);
                    }
                  }}
                />
              </Box>
            ) : (
              <StyledTypography
                noWrap
                fontSize="13px"
                variant="caption"
                color={'#8e8c8c'}
                sx={{ cursor: 'pointer', pointerEvents: 'none' }}
              >
                {template?.duration}
              </StyledTypography>
            )}
          </StyledBox>
        )}

        {/* Original Start Date */}
        {activeColumns.includes(7) && (
          <StyledBox
            width={150}
            sx={{
              cursor: 'pointer',
              backgroundColor: onHover && '#c9c6c6b0',
            }}
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
              sx={{ cursor: 'pointer' }}
            >
              {_.isEmpty(template?.start_date)
                ? 'Not set'
                : moment(template?.start_date)
                    .tz(timeZone)
                    .format('MM-DD-YYYY HH:mm:ss')}
            </StyledTypography>
          </StyledBox>
        )}

        {/* Original Due Date */}
        {activeColumns.includes(8) && (
          <StyledBox
            width={150}
            sx={{
              cursor: 'pointer',
              backgroundColor: onHover && '#c9c6c6b0',
            }}
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
              sx={{ cursor: 'pointer' }}
            >
              {_.isEmpty(template?.original_due_date)
                ? 'Not set'
                : moment(template?.original_due_date)
                    .tz(timeZone)
                    .format('MM-DD-YYYY HH:mm:ss')}
            </StyledTypography>
          </StyledBox>
        )}

        {/* Adjusted Start Date */}
        {activeColumns.includes(9) && (
          <StyledBox
            width={150}
            sx={{
              cursor: 'pointer',
              backgroundColor: onHover && '#c9c6c6b0',
            }}
            onClick={(e) =>
              handlePopover(
                e,
                'milestone_adjusted_start_date',
                template?.adjusted_start_date || template?.start_date,
                template.id,
                null
              )
            }
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
              sx={{
                cursor: 'pointer',
              }}
            >
              {_.isEmpty(template?.adjusted_start_date)
                ? 'Not set'
                : moment(template?.adjusted_start_date)
                    .tz(timeZone)
                    .format('MM-DD-YYYY HH:mm:ss')}
            </StyledTypography>
          </StyledBox>
        )}

        {/* Adjusted Due Date */}
        {activeColumns.includes(10) && (
          <StyledBox
            width={150}
            sx={{
              cursor: 'pointer',
              backgroundColor: onHover && '#c9c6c6b0',
            }}
            onClick={(e) =>
              handlePopover(
                e,
                'milestone_adjusted_due_date',
                template?.adjusted_due_date || template?.original_due_date,
                template.id,
                null
              )
            }
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
              sx={{ cursor: 'pointer' }}
            >
              {_.isEmpty(template?.adjusted_due_date) || !template?.is_edited
                ? 'Not set'
                : moment(template?.adjusted_due_date)
                    .tz(timeZone)
                    .format('MM-DD-YYYY HH:mm:ss')}
            </StyledTypography>
          </StyledBox>
        )}

        {/* Visibility */}
        {activeColumns.includes(11) && (
          <StyledBox
            width={150}
            sx={{
              cursor: 'pointer',
              backgroundColor: onHover && '#c9c6c6b0',
            }}
            onClick={(e) =>
              handlePopover(
                e,
                'milestone_visibility',
                getItemByKey('name', template.visibility, visibilityTypes).id,
                template.id,
                null
              )
            }
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
              sx={{ cursor: 'pointer', textTransform: 'capitalize' }}
            >
              {template?.visibility}
            </StyledTypography>
          </StyledBox>
        )}
      </Box>
    </Box>
  );
}

TemplateSubTree.propTypes = {
  template: PropTypes.any,
  activeColumns: PropTypes.any,
  handlePopover: PropTypes.func,
  handleDependencyToggle: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  onSubmitMilestoneSLA: PropTypes.func,
  openCollapse: PropTypes.any,
  timeZone: PropTypes.string,
  isCampaign: PropTypes.bool,
};
