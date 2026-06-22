import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getItemByKey } from 'utils/dictionary';

export default function FilterColumns({ value, data, onSelect }) {
  const [selected, setSelected] = useState(value || []);

  const handleOnSelectAll = () => {
    setSelected(data);
    onSelect(data);
  };

  const handleOnSelect = (value) => {
    const isAlreadySelected = !_.isEmpty(
      getItemByKey('id', value?.id, selected)
    );
    setSelected(
      isAlreadySelected
        ? _.filter(selected, (i) => i.id !== value.id)
        : [value, ...selected]
    );
    onSelect(value);
  };

  return (
    <Box maxHeight={400} overflow="auto">
      <Typography
        sx={{
          fontSize: '0.8em',
          fontWeight: 600,
          padding: '16px 16px 10px 16px',
        }}
      >
        Display Columns
      </Typography>
      <List dense disablePadding>
        <ListItem
          disablePadding
          secondaryAction={
            selected.length === data.length && (
              <CheckTwoToneIcon color="secondary" />
            )
          }
        >
          <ListItemButton onClick={handleOnSelectAll}>
            <ListItemText>All</ListItemText>
          </ListItemButton>
        </ListItem>
        {_.map(
          _.filter(data, (j) => j.id !== 0),
          (i) => (
            <ListItem
              key={i.id}
              disablePadding
              secondaryAction={
                _.map(selected, (j) => j?.id)?.includes(i?.id) && (
                  <CheckTwoToneIcon color="secondary" />
                )
              }
            >
              <ListItemButton
                onClick={() => {
                  handleOnSelect(i);
                }}
              >
                <ListItemText>{i.label}</ListItemText>
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );
}

FilterColumns.propTypes = {
  data: PropTypes.array,
  value: PropTypes.array,
  onSelect: PropTypes.func,
};
