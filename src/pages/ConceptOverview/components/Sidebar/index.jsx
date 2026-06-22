import React, { useContext } from 'react';

import _ from 'lodash';

import {
  MenuList,
  MenuItem,
  Typography,
  ListItemIcon,
  Avatar,
  styled,
} from '@mui/material';

import ConceptOverviewContext from 'pages/ConceptOverview/context';

import { appColors } from 'theme/variables';
import { Link, useParams } from 'react-router-dom';

const StyledMenuItem = styled(MenuItem)({
  minHeight: 38,
  margin: '3px 10px',
  borderRadius: 12,
  color: 'rgba(255,255,255,0.62)',
  transition:
    'background-color 160ms ease, color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
  padding: '7px 10px',
  '& .MuiListItemIcon-root': {
    minWidth: 22,
  },
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: '#ffffff',
    transform: 'translateX(2px)',
  },
  '&.Mui-selected': {
    boxShadow: 'inset 3px 0 0 #a78bfa, 0 12px 30px -24px rgba(124,58,237,.8)',
    background:
      'linear-gradient(90deg, rgba(124,58,237,.26), rgba(124,58,237,.08))',
    color: '#ffffff',
  },
  '&.Mui-selected:hover': {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
});

export default function Sidebar() {
  const { conceptId } = useParams();

  const { conceptList: list } = useContext(ConceptOverviewContext);

  return (
    <MenuList dense>
      {list?.data?.map((data) => (
        <StyledMenuItem
          key={data?.uuid}
          selected={data?.uuid === conceptId}
          component={Link}
          to={`/projects/${data?.partner_uuid}/concept/${data?.uuid}/overview`}
        >
          <ListItemIcon>
            <Avatar
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                fontSize: 0,
                textTransform: 'capitalize',
                backgroundColor:
                  appColors?.status[
                    _.camelCase(data?.status?.replace(/_/g, ' ').toLowerCase())
                  ],
                border: '1px solid rgba(255,255,255,.45)',
              }}
            />
          </ListItemIcon>
          <Typography
            variant="inherit"
            noWrap
            id={data?.uuid}
            title={data?.name}
            sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            {data?.name}
          </Typography>
        </StyledMenuItem>
      ))}
    </MenuList>
  );
}
