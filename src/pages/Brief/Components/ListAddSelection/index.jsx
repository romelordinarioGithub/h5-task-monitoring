import { useEffect, useState } from 'react';

import _ from 'lodash';

import { PropTypes } from 'prop-types';

import {
  TextField,
  Box,
  styled,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { useSelector } from 'react-redux';

import empty from 'assets/empty.svg';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
      boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
    },
  },
});

export default function ListAddSelection({
  taskId,
  defaultData,
  // selected,
  type,
  handleSave,
}) {
  const [dataFilter, setDataFilter] = useState('');
  // const [filteredTags, setFilteredTags] = useState([]);

  const {
    overview: { tags },
  } = useSelector((state) => state.briefs);

  const filteredTags = _.filter(defaultData, (data) =>
    data?.title?.toLowerCase().includes(dataFilter.toLowerCase())
  );

  switch (type) {
    case 'tags':
      return (
        <Box overflow={'hidden'}>
          <Box
            padding={1}
            sx={{ borderBottom: '1px solid #ececec' }}
            onChange={(e) => setDataFilter(e.target.value)}
          >
            <StyledTextField
              size="small"
              placeholder={'Add Tags'}
              onKeyUp={(e) => {
                if (e.key.toLowerCase() === 'enter') {
                  setDataFilter('');
                  handleSave({
                    key: type,
                    action: 'add',
                    // Below are endpoint's parameters
                    id: taskId,
                    name: e.target.value,
                  });
                }
              }}
            />
          </Box>
          {_.isEmpty(filteredTags) ? (
            <Stack alignItems="center" p={2}>
              <img
                src={empty}
                alt="Not found"
                style={{ width: '7em', height: 'auto' }}
              />
              <Typography fontWeight={300} variant="body1">
                Tag not found
              </Typography>
            </Stack>
          ) : (
            <Box maxHeight={270} overflow="auto">
              <List dense={true}>
                {filteredTags
                  .sort((a, b) => b.is_selected - a.is_selected)
                  .map((data, index) => (
                    <ListItem
                      key={index}
                      component="div"
                      disablePadding
                      secondaryAction={
                        tags.some((e) => e.name === data?.title) ? (
                          <CheckIcon color="secondary" />
                        ) : null
                      }
                    >
                      <ListItemButton
                        onClick={() =>
                          handleSave({
                            key: type,
                            action: tags.some((e) => e.name === data?.title)
                              ? 'remove'
                              : 'add',
                            // Below are endpoint's parameters
                            ids: data?.id,
                            tag_id: tags.some((e) => e.name === data?.title)
                              ? tags.find((e) => e.name === data?.title).id
                              : null,
                            id: taskId,
                            brief_id: taskId,
                            name: data?.title,
                          })
                        }
                      >
                        <ListItemText primary={data.title} />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </Box>
          )}
        </Box>
      );
  }
}

ListAddSelection.propTypes = {
  taskId: PropTypes.any,
  defaultData: PropTypes.any,
  type: PropTypes.any,
  relType: PropTypes.any,
  // selected: PropTypes.any,
  handleSave: PropTypes.any,
};
