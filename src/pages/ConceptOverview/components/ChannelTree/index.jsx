import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  styled,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Collapse,
  Button,
  Stack,
  Tooltip,
} from '@mui/material';

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';

import TaskTree from 'pages/ConceptOverview/components/TaskTree';

import { taskTable } from 'pages/ConceptOverview/constant';
import _ from 'lodash';

import appTheme from 'theme';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

const StyledCollapse = styled(Collapse)({
  borderLeft: '1px dashed #757575',
  paddingLeft: '1em',
  marginLeft: '0.5em',
});

export default function ChannelTree({
  channel,
  handlePopover,
  channelId,
  defaultCollapse,
  handleChannelTask,
  onStartMilestone,
  fetchConceptTaskList,
  hasMilestone,
}) {
  const [openCollapse, setOpenCollapse] = useState(defaultCollapse);
  const [sort, setSort] = useState('asc');
  const [order, setOrder] = useState('date_created');

  const handleCollapse = async (chId) => {
    setOpenCollapse(!openCollapse);
    if (!openCollapse) {
      return await handleChannelTask(chId);
    }
  };

  const handleSort = (name) => {
    setOrder(name);
    setSort(sort === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Box mt={2}>
      <Stack direction="row">
        <Box display="flex" alignItems="center">
          <IconButton
            size="small"
            onClick={() => handleCollapse(channelId)}
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
        </Box>
        {!hasMilestone && (
          <Button
            startIcon={<PlayArrowIcon />}
            color="secondary"
            size="small"
            sx={{
              marginLeft: 1,
              fontSize: '0.75em',
              fontWeight: 600,
              '& .MuiButton-startIcon': { marginRight: 0.2, marginTop: '-2px' },
            }}
            onClick={async () => {
              let channels = channel;

              if (_.isEmpty(channels)) {
                channels = await handleCollapse(channelId);
              }

              onStartMilestone(
                channelId,
                channels.filter((c) =>
                  c.task_type.toLowerCase().includes('concept design')
                )[0]?.task_type_id
              );
            }}
          >
            Start milestone
          </Button>
        )}
      </Stack>

      <StyledCollapse in={openCollapse}>
        {/* Task List */}
        {!fetchConceptTaskList ? (
          <Box overflow="auto" mt={1}>
            {/* Header */}
            <Box display="inline-flex">
              {taskTable?.map((header, index) => (
                <Box
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
                        onClick={() => handleSort(header?.slug)}
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
                          {header?.slug === order &&
                            (sort === 'asc' ? (
                              <ArrowDownwardOutlinedIcon
                                sx={{ fontSize: '1.2em', marginLeft: '.2em' }}
                              />
                            ) : (
                              <ArrowUpwardOutlinedIcon
                                sx={{ fontSize: '1.2em', marginLeft: '.2em' }}
                              />
                            ))}
                        </Stack>
                      </StyledTypography>
                    </Tooltip>
                  ) : (
                    <StyledTypography variant="body2" fontWeight={700}>
                      {header?.label}
                    </StyledTypography>
                  )}
                </Box>
              ))}
            </Box>
            {_.orderBy(channel, [order], [sort]).map((data) => (
              <TaskTree
                key={data?.id}
                task={data}
                handlePopover={handlePopover}
                type="task"
              />
            ))}
          </Box>
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

ChannelTree.propTypes = {
  channel: PropTypes.any,
  handlePopover: PropTypes.func,
  channelId: PropTypes.number,
  defaultCollapse: PropTypes.any,
  handleChannelTask: PropTypes.func,
  fetchConceptTaskList: PropTypes.any,
  onStartMilestone: PropTypes.any,
  hasMilestone: PropTypes.any,
  user: PropTypes.array,
};
