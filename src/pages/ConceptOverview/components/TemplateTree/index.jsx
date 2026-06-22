import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import {
  Tooltip,
  Box,
  IconButton,
  Typography,
  styled,
  Badge,
} from '@mui/material';
import appTheme from 'theme';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { appColors } from 'theme/variables';
import TemplateSubTree from '../TemplateSubTree';
import { getItemByKey } from 'utils/dictionary';
import { visibilityTypes } from 'pages/ConceptOverview/constant';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

const StyledBox = styled(Box)({
  margin: '0px 2px 2px 0',
  padding: '0px 6px 0px',
  height: '35px',
  backgroundColor: '#e6e6e6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function TemplateTree({
  template,
  activeColumns,
  handlePopover,
  handleDependencyToggle,
  onSubmitMilestoneSLA,
  timeZone,
  isOpenCollapsed,
  handleCollapse,
  isHideInactive,
  isCampaign,
  handleDialogOpen,
}) {
  const [onHover, setOnHover] = useState(false);

  return (
    <Box>
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
          <StyledBox
            width={27}
            sx={{
              backgroundColor: '#f3f5f9',
            }}
          >
            {_.isEmpty(template?.subtasks) ? (
              <IconButton size="small" disabled sx={{ opacity: 0, padding: 0 }}>
                <CheckBoxOutlineBlankOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton
                size="small"
                onClick={() => handleCollapse(template?.id)}
                sx={{ padding: 0 }}
              >
                {isOpenCollapsed ? (
                  <IndeterminateCheckBoxOutlinedIcon />
                ) : (
                  <AddBoxOutlinedIcon />
                )}
              </IconButton>
            )}
          </StyledBox>

          {/* Order */}
          {activeColumns.includes(1) && (
            <StyledBox
              width={45}
              borderLeft="4px solid #000"
              sx={{
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
              width={300}
              sx={{
                justifyContent: 'space-between',
                textDecoration: 'none',
                backgroundColor: onHover && '#c9c6c6b0',
              }}
              title={template?.name}
            >
              <StyledTypography
                noWrap
                fontSize="13px"
                sx={{
                  cursor: 'pointer',
                }}
              >
                {template?.name}
              </StyledTypography>
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
            </StyledBox>
          )}
        </Box>

        {/* Status */}
        {activeColumns.includes(3) && (
          <StyledBox
            width={100}
            sx={{
              backgroundColor:
                appColors?.status[template?.status.toLowerCase()],
              color: '#fff',
              textTransform: 'capitalize',
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <StyledTypography fontSize="13px" noWrap color="#fff">
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
              color: '#fff',
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
            sx={{ backgroundColor: onHover && '#c9c6c6b0' }}
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
              sx={{
                textTransform: 'capitalize',
              }}
            >
              {template?.owner}
            </StyledTypography>
          </StyledBox>
        )}

        {/* Duration */}
        {activeColumns.includes(6) && (
          <StyledBox
            width={100}
            sx={{ backgroundColor: onHover && '#c9c6c6b0' }}
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
            >
              {template?.duration}
            </StyledTypography>
            {/* )} */}
          </StyledBox>
        )}

        {/* Original Start Date */}
        {activeColumns.includes(7) && (
          <StyledBox
            width={150}
            sx={{ backgroundColor: onHover && '#c9c6c6b0' }}
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
            >
              {_.isEmpty(template?.original_start_date)
                ? 'Not set'
                : moment(template?.original_start_date)
                    .tz(timeZone)
                    .format('MM-DD-YYYY HH:mm:ss')}
            </StyledTypography>
          </StyledBox>
        )}

        {/* Original Due Date */}
        {activeColumns.includes(8) && (
          <StyledBox
            width={150}
            sx={{ backgroundColor: onHover && '#c9c6c6b0' }}
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
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
            sx={{ backgroundColor: onHover && '#c9c6c6b0' }}
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
            >
              {_.isEmpty(template?.adjusted_start_date) || !template?.is_edited
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
            sx={{ backgroundColor: onHover && '#c9c6c6b0' }}
          >
            <StyledTypography
              noWrap
              fontSize="13px"
              variant="caption"
              color={'#8e8c8c'}
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
                'milestone_all_visibility',
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
              sx={{
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {template?.visibility}
            </StyledTypography>
          </StyledBox>
        )}
      </Box>

      {/* SubTree */}
      {isOpenCollapsed && (
        <Box sx={{ marginLeft: '1px' }}>
          {template?.subtasks
            ?.filter((data) => data.status_id === 1 || !isHideInactive)
            ?.map((data, index) => (
              <TemplateSubTree
                key={index}
                template={data}
                activeColumns={activeColumns}
                handlePopover={handlePopover}
                handleDependencyToggle={handleDependencyToggle}
                handleDialogOpen={handleDialogOpen}
                onSubmitMilestoneSLA={onSubmitMilestoneSLA}
                timeZone={timeZone}
                isCampaign={isCampaign}
              />
            ))}
        </Box>
      )}
    </Box>
  );
}

TemplateTree.propTypes = {
  template: PropTypes.any,
  activeColumns: PropTypes.any,
  handlePopover: PropTypes.func,
  handleDependencyToggle: PropTypes.func,
  isOpenCollapsed: PropTypes.bool,
  onSubmitMilestoneSLA: PropTypes.func,
  handleCollapse: PropTypes.func,
  timeZone: PropTypes.string,
  isHideInactive: PropTypes.bool,
  isCampaign: PropTypes.bool,
  handleDialogOpen: PropTypes.func,
};
