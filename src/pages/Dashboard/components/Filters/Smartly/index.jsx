import React, { useState } from 'react';

import PropTypes from 'prop-types';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';

export default function Smartly({ data, value, onSelect }) {
  // value = id || value = [ids]
  const [selected, setSelected] = useState(value);

  return (
    <Box>
      <List dense disablePadding>
        {data?.map((v) => (
          <ListItem disablePadding key={v?.id}>
            <ListItemButton
              sx={{
                textTransform: 'capitalize',
              }}
              selected={v?.team_id == selected}
              onClick={() => {
                if (v?.team_id !== selected) {
                  setSelected(v?.team_id);
                  onSelect(v?.team_id);
                } else {
                  setSelected();
                  onSelect();
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'max-content',
                  marginRight: '0.4em',
                }}
              >
                <GroupsTwoToneIcon
                  sx={{
                    color: v.color,
                  }}
                />
              </ListItemIcon>
              <ListItemText>{v?.name?.replace(/_/g, ' ')}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

Smartly.propTypes = {
  data: PropTypes.any,
  value: PropTypes.any,
  multiselect: PropTypes.any,
  onSelect: PropTypes.func,
};
