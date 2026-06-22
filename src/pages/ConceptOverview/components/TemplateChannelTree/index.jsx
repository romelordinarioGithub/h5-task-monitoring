import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Collapse,
  Stack,
  styled,
  Tooltip,
} from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import TemplateTree from '../TemplateTree';
import LockResetIcon from '@mui/icons-material/LockReset';
import _ from 'lodash';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

const StyledCollapse = styled(Collapse)({
  borderLeft: '1px dashed #757575',
  paddingLeft: '1em',
  marginLeft: '0.5em',
});

export default function TemplateChannelTree({
  templates,
  channelId,
  handlePopover,
  handleDependencyToggle,
  handleOnSubmitMilestoneSLA,
  handleCollapseTable,
  isOpenCollapsedTable,
  isCollapsed,
  isFetching,
  timeZone,
  activeMilestoneColumns,
  isHideInactive,
  isCampaign,
  handleDialogOpen,
  handleUpdateOriginalTimeline,
}) {
  const [openCollapse, setOpenCollapse] = useState(isCollapsed);

  const handleCollapse = () => setOpenCollapse(!openCollapse);

  return (
    <Box mt={2}>
      <Box display="flex" alignItems="center">
        <IconButton
          size="small"
          onClick={handleCollapse}
          sx={{ padding: 0, marginRight: '0.5em' }}
        >
          {openCollapse ? (
            <IndeterminateCheckBoxOutlinedIcon />
          ) : (
            <AddBoxOutlinedIcon />
          )}
        </IconButton>
        <StyledTypography fontWeight={800} variant="h6">
          {channelId === 1
            ? 'Google Display'
            : channelId === 2
            ? 'Google Video'
            : channelId === 3
            ? 'Meta Static'
            : channelId === 4
            ? 'Meta Video'
            : 'YouTube'}
        </StyledTypography>

        <Tooltip
          title={'Update Original Timeline'}
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
          <IconButton
            color="inherit"
            disabled={_.first(templates)?.is_locked}
            onClick={() => {
              handleUpdateOriginalTimeline(_.first(templates)?.channel_id);
            }}
          >
            <LockResetIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <StyledCollapse in={openCollapse}>
        {/* Task List */}
        {!isFetching ? (
          <Stack overflow="auto" mt={1}>
            <Stack direction="row">
              {activeMilestoneColumns?.map((header, index) => (
                <Box
                  minWidth={header?.width}
                  margin="0px 0px 3px 0"
                  key={index}
                  textAlign={header?.align}
                  sx={{
                    position: header?.position,
                    left: header?.left,
                    backgroundColor: '#f2f5f9',
                  }}
                >
                  <StyledTypography variant="body2" fontWeight={700}>
                    {header?.label}
                  </StyledTypography>
                </Box>
              ))}
            </Stack>
            {templates?.map((data) => (
              <TemplateTree
                key={data?.id}
                activeColumns={_.map(activeMilestoneColumns, (i) => i.id)}
                template={data}
                isOpenCollapsed={
                  !_.some(isOpenCollapsedTable, (id) => id === data?.id)
                }
                handleCollapse={handleCollapseTable}
                handlePopover={handlePopover}
                handleDependencyToggle={handleDependencyToggle}
                handleDialogOpen={handleDialogOpen}
                onSubmitMilestoneSLA={handleOnSubmitMilestoneSLA}
                timeZone={timeZone}
                isHideInactive={isHideInactive}
                isCampaign={isCampaign}
              />
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1em 0',
            }}
          >
            <CircularProgress size={30} color="secondary" />
          </Box>
        )}
      </StyledCollapse>
    </Box>
  );
}

TemplateChannelTree.propTypes = {
  templates: PropTypes.any,
  channelId: PropTypes.any,
  handlePopover: PropTypes.func,
  handleDependencyToggle: PropTypes.func,
  handleOnSubmitMilestoneSLA: PropTypes.func,
  handleCollapseTable: PropTypes.func,
  timeZone: PropTypes.string,
  activeMilestoneColumns: PropTypes.arrayOf(PropTypes.object),
  isOpenCollapsedTable: PropTypes.any,
  isFetching: PropTypes.any,
  isCollapsed: PropTypes.any,
  isHideInactive: PropTypes.bool,
  isCampaign: PropTypes.bool,
  handleDialogOpen: PropTypes.func,
  handleUpdateOriginalTimeline: PropTypes.func,
};
