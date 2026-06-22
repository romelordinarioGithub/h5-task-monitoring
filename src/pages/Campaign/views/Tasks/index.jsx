import React, { useContext, useState } from 'react';
import { Box, Stack, styled, Typography } from '@mui/material';
import TaskTree from 'pages/Campaign/components/TaskTree';
import { taskTable } from 'pages/Campaign/constant';
import CampaignOverviewContext from 'pages/Campaign/context';
import _ from 'lodash';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import appTheme from 'theme';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

function Tasks() {
  const { tasks, handlePopover } = useContext(CampaignOverviewContext);
  const [sort, setSort] = useState('asc');
  const [order, setOrder] = useState('date_created');

  const handleSort = (name) => {
    setOrder(name);
    setSort(sort === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Box mx={2}>
      <StyledTypography fontWeight={800} variant="h6">
        Tasks
      </StyledTypography>
      <Box overflow="auto" mt={1}>
        <Box display="inline-flex">
          {taskTable?.map((header, index) => (
            <Box
              width={header?.width}
              margin="0px 2px 3px 0"
              key={index}
              textAlign={header?.align}
            >
              {header?.sort ? (
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
              ) : (
                <StyledTypography variant="body2" fontWeight={700}>
                  {header?.label}
                </StyledTypography>
              )}
            </Box>
          ))}
        </Box>
        {!_.isEmpty(tasks) ? (
          _.orderBy(tasks, [order], [sort])?.map((data, index) => (
            <TaskTree
              key={index}
              task={data}
              handlePopover={handlePopover}
              type="task"
            />
          ))
        ) : (
          <Stack
            sx={{
              justifyContent: 'center',
              alignContent: 'center',
              textAlign: 'center',
              height: '100px',
            }}
          >
            No task created for this campaign.
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default Tasks;
