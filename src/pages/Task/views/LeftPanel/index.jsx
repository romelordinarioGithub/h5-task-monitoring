import { memo, useState, useContext } from 'react';

import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Stack,
  Tooltip,
  styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// Pages
import Overview from 'pages/Task/views/LeftPanel/Overview';
import TimelogTask from 'pages/Task/views/LeftPanel/TimelogTask';
import Revisions from 'pages/Task/views/LeftPanel/Revisions';
import Escalation from 'pages/Task/views/LeftPanel//Escalation';

//icons
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// Context
import TaskContext from 'pages/Task/Context';

const StyledToolTip = styled(Tooltip)`
lineHeight: 'normal',
marginTop: '0.4em !important',
`;

const LeftPanel = ({ id, isSubtask, onCloseDialog }) => {
  const [value, setValue] = useState(0);

  const { handleDeleteTask, handleEdit, handleSaveEdit, isEditOverview } =
    useContext(TaskContext);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Stack
        sx={{
          borderBottom: 1,
          borderColor: '#ede9fe',
          padding: '0 1em',
          justifyContent: 'space-between',
          backgroundColor: '#fdfcff',
        }}
        direction="row"
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Overview" disableRipple />
          <Tab label="Time log" disableRipple />
          {!isSubtask && <Tab label="Revisions" disableRipple />}
        </Tabs>
        <Stack direction="row">
          {value === 0 && (
            <Stack direction="row">
              <StyledToolTip
                title={!isEditOverview ? 'Edit Overview' : 'Cancel Edit'}
                arrow
              >
                <IconButton
                  color={isEditOverview ? 'error' : ''}
                  onClick={(event) => handleEdit(event)}
                >
                  {!isEditOverview ? (
                    <EditOutlinedIcon />
                  ) : (
                    <CancelOutlinedIcon />
                  )}
                </IconButton>
              </StyledToolTip>
              {isEditOverview && (
                <StyledToolTip title="Save" arrow>
                  <IconButton onClick={(event) => handleSaveEdit(event, name)}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </StyledToolTip>
              )}
            </Stack>
          )}

          <StyledToolTip title="Delete Task">
            <IconButton onClick={() => handleDeleteTask(id, !isSubtask)}>
              {<DeleteOutlineIcon />}
            </IconButton>
          </StyledToolTip>
        </Stack>
      </Stack>
      <Box
        height="calc(100% - 49px)"
        overflow="auto"
        px={2}
        pb={2}
        sx={{ backgroundColor: '#fbfaff' }}
      >
        {value === 0 && <Overview onCloseDialog={onCloseDialog} />}
        {value === 1 && <TimelogTask />}
        {!isSubtask && value === 2 && <Revisions />}
        {value === 3 && <Escalation />}
      </Box>
    </Box>
  );
};

LeftPanel.propTypes = {
  id: PropTypes.any,
  isSubtask: PropTypes.any,
  onCloseDialog: PropTypes.any,
};

export default memo(LeftPanel);
