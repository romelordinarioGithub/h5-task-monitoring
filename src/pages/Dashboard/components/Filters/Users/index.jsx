import React, { useState } from 'react';

import _ from 'lodash';

import PropTypes from 'prop-types';
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Typography,
} from '@mui/material';

import NoAccountsTwoToneIcon from '@mui/icons-material/NoAccountsTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';

import SearchInput from 'pages/ConceptOverview/components/SearchInput';

import { stringAvatar } from 'hooks';
import { getItemByKey } from 'utils/dictionary';

export default function Users({ data, fetch, value, onSelect }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(value || []);

  return (
    <>
      {fetch ? (
        <Box
          minWidth={218.83}
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="0.5em"
        >
          <CircularProgress size={20} color="secondary" />
        </Box>
      ) : (
        <>
          <Box
            margin="0.5em"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <SearchInput
              placeholder="Search User"
              onChange={(e) => setSearch(e.target.value?.toLowerCase())}
            />
          </Box>
          <Divider />
          <Box maxHeight={300} overflow="auto">
            {_.isEmpty(
              _.filter(data, (user) =>
                user?.fullname?.toLowerCase()?.includes(search)
              )
            ) && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                margin="1em 0"
              >
                <NoAccountsTwoToneIcon
                  color="error"
                  sx={{ width: 50, height: 50 }}
                />
                <Typography variant="body1" fontWeight={800}>
                  No user found!
                </Typography>
                <Typography variant="caption">
                  Make sure to spell the name correctly.
                </Typography>
              </Box>
            )}
            <List dense disablePadding>
              {_.filter(
                _.sortBy(data, (_user) =>
                  _.map(selected, (i) => Number(i.user_id)).includes(
                    Number(_user?.user_id)
                  )
                    ? 0
                    : 1
                ),
                (user) => user?.fullname?.toLowerCase()?.includes(search)
              )?.map((data) => (
                <ListItem
                  disablePadding
                  key={Number(data?.user_id)}
                  secondaryAction={
                    _.map(selected, (i) => Number(i.user_id))?.includes(
                      Number(data.user_id)
                    ) && <CheckTwoToneIcon color="secondary" />
                  }
                >
                  <ListItemButton
                    sx={{
                      textTransform: 'capitalize',
                    }}
                    selected={_.map(selected, (i) =>
                      Number(i.user_id)
                    )?.includes(Number(data.user_id))}
                    onClick={() => {
                      const isSelected = !_.isEmpty(
                        getItemByKey('user_id', Number(data.user_id), selected)
                      );
                      setSelected(
                        isSelected
                          ? _.filter(
                              // Remove
                              selected,
                              (i) => Number(i.user_id) != Number(data.user_id)
                            )
                          : [
                              // Add
                              ...selected,
                              data,
                            ]
                      );
                      onSelect(
                        Number(data.user_id),
                        isSelected
                          ? _.filter(
                              // Remove
                              selected,
                              (i) => Number(i.user_id) != Number(data.user_id)
                            )
                          : [
                              // Add
                              ...selected,
                              data,
                            ]
                      );
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 'max-content',
                        marginRight: '0.4em',
                      }}
                    >
                      <Avatar
                        {...stringAvatar(data?.fullname, {
                          width: 20,
                          height: 20,
                          fontSize: '10px',
                        })}
                        src={data?.profile_picture}
                      />
                    </ListItemIcon>
                    <ListItemText>
                      {data?.fullname?.replace(/_/g, ' ')}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </>
  );
}

Users.propTypes = {
  data: PropTypes.any,
  fetch: PropTypes.any,
  value: PropTypes.any,
  onSelect: PropTypes.func,
};
