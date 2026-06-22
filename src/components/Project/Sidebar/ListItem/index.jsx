// React
import { useState } from 'react';

import { useHistory } from 'react-router-dom';

// MUI
import { styled } from '@mui/styles';

import {
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Tooltip,
  CircularProgress,
} from '@mui/material';

// Utilities
import PropTypes from 'prop-types';

// Styled Components
const StyledListItem = styled(ListItem)({
  margin: '2px 0',
  borderRadius: 10,
  color: '#6b7280',
  transition:
    'background-color 160ms ease, color 160ms ease, box-shadow 160ms ease',
  '&.Mui-selected': {
    borderRadius: '10px !important',
    backgroundColor: '#ede9fe',
    boxShadow: 'inset 3px 0 0 #7c3aed',
  },
  '&.Mui-selected *': {
    color: '#6d28d9',
    fontWeight: 700,
  },
  '&:hover': {
    backgroundColor: '#f5f3ff',
  },
});

const StyledListItemButton = styled(ListItemButton)({
  padding: '0.15rem 0.75rem',
});

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: 27,
});

const StyledDot = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: 7,
  height: 7,
  borderRadius: 3.5,
  backgroundColor: theme.palette.secondary.main,
  boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.14)',
}));

const ProjectSidebarListItem = ({
  icon,
  title,
  isSelected,
  isNewlyCreated,
  conceptId,
  partnerId,
  isFetchingOverview,
}) => {
  const history = useHistory();
  const [isNewlyCreatedIndicatorShown, setIsNewlyCreatedIndicatorShown] =
    useState(isNewlyCreated);

  const handleClick = (e) => {
    e.preventDefault();
    setIsNewlyCreatedIndicatorShown(false);
    history.push(`/projects/${partnerId}/concept/${conceptId}`);
  };

  return (
    <Tooltip
      placement="right"
      disableHoverListener={title.split('').length < 20}
      title={title ?? ''}
      arrow
    >
      <StyledListItem
        selected={isSelected}
        sx={{ padding: 0, margin: isFetchingOverview ? '0.1em 0' : 'auto' }}
        onClick={(e) => handleClick(e)}
      >
        {isNewlyCreatedIndicatorShown && <StyledDot />}
        <StyledListItemButton disableRipple>
          <StyledListItemIcon>
            {isFetchingOverview ? (
              <CircularProgress size={15} />
            ) : (
              <img src={icon} alt="icon" />
            )}
          </StyledListItemIcon>
          <ListItemText
            primary={
              title.split('').length < 20 ? title : `${title.substr(0, 19)} ...`
            }
          />
        </StyledListItemButton>
      </StyledListItem>
    </Tooltip>
  );
};

ProjectSidebarListItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  isSelected: PropTypes.bool,
  isNewlyCreated: PropTypes.bool,
  partnerId: PropTypes.string,
  conceptId: PropTypes.string,
  isFetchingOverview: PropTypes.bool,
};

export default ProjectSidebarListItem;
