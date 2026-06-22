import { IconButton, Tooltip, Stack, styled, Typography } from '@mui/material';

// Utils
import PropTypes from 'prop-types';
import 'gantt-task-react-adding-features/dist/index.css';
import _ from 'lodash';

// Icons
import UnfoldLessOutlinedIcon from '@mui/icons-material/UnfoldLessOutlined';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const StyledTypography = styled(Typography)({
  lineHeight: 'normal',
  cursor: 'default',
});

function TaskListHeader({
  headerHeight,
  rowWidth,
  handleCollapse,
  handleHideParent,
  isHide,
  isHideParent,
}) {
  return (
    <Stack
      direction="row"
      spacing={7}
      sx={{
        paddingTop: '.5em',
        height: headerHeight,
        paddingX: '1em',
        width: rowWidth,
        paddingBottom: '.5em',
        borderTop: '1px solid #e6e4e4',
        borderBottom: '1px solid #e6e4e4',
        borderRight: '1px solid #e6e4e4',
        background: '#fff',
        borderTopLeftRadius: '.5em',
      }}
    >
      <Tooltip
        title={
          _.isEmpty(isHide) ? 'Collapse All Milestone' : 'Expand All Milestone'
        }
        componentsProps={{
          tooltip: {
            sx: {
              lineHeight: 'normal',
              marginTop: '0.4em !important',
            },
          },
        }}
        arrow
        disableInteractive
      >
        <IconButton color="inherit" onClick={handleCollapse}>
          {_.isEmpty(isHide) ? (
            <UnfoldLessOutlinedIcon />
          ) : (
            <UnfoldMoreOutlinedIcon />
          )}
        </IconButton>
      </Tooltip>
      <StyledTypography fontWeight={800} pt={1}>
        Milestone
      </StyledTypography>
      <Tooltip
        title={
          !_.isEmpty(isHideParent)
            ? 'Show Parent Milestone'
            : 'Hide Parent Milestone'
        }
        componentsProps={{
          tooltip: {
            sx: {
              lineHeight: 'normal',
              marginTop: '0.4em !important',
            },
          },
        }}
        arrow
        disableInteractive
      >
        <IconButton color="inherit" onClick={handleHideParent}>
          {_.isEmpty(isHideParent) ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default TaskListHeader;

TaskListHeader.propTypes = {
  headerHeight: PropTypes.any,
  rowWidth: PropTypes.any,
  handleCollapse: PropTypes.any,
  handleHideParent: PropTypes.any,
  isHide: PropTypes.any,
  isHideParent: PropTypes.any,
};
