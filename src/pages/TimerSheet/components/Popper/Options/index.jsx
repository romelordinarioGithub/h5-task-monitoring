import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
// date range
import { DateRange } from 'react-date-range';
// date picker
import DatePicker from 'react-datepicker';
// date range theme and color
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
// date picker theme
import 'react-datepicker/dist/react-datepicker.css';
// virtual selectors
import VirtualListSelection from 'pages/Task/Components/VirtualListSelection';
import TimerDateTimePicker from 'components/Common/TimerDateTimePicker';
import { formatDate } from 'utils/date';
import Color from 'color';
import theme from 'theme';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  IconButton,
  TextField,
  styled,
  Box,
  Typography,
} from '@mui/material';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import AssistantPhotoRoundedIcon from '@mui/icons-material/AssistantPhotoRounded';
import TextRotateUpIcon from '@mui/icons-material/TextRotateUp';
import TextRotateVerticalIcon from '@mui/icons-material/TextRotateVertical';
import { updateStartEnd } from 'store/reducers/timesheet';
import { appColors } from 'theme/variables';
import empty from 'assets/empty.svg';
import CheckIcon from '@mui/icons-material/Check';

let timer = null;

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#5025c4',
      boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
    },
  },
});

const PopperOptions = ({
  type,
  status,
  priority,
  users,
  sort,
  tags,
  dropdowns,
  defaults,
  handleTaskUpdate,
  onClose,
  setDefaultValue,
  handleSort,
  handleDateRangeChange,
  handleOnAddTags,
  onDropdownChange,
  selectedDates,
}) => {
  const dispatch = useDispatch();

  const [dataFilter, setDataFilter] = useState('');

  const handleOnChangeDateTimePicker = (type, date, limitDate) => {
    const params =
      type === 'time_in'
        ? {
            id: defaults.timer_id,
            time_in: formatDate(date ?? '', 'YYYY-MM-DD hh:mm:ss A'),
            time_out: limitDate,
            timer_type: defaults.timer_type,
          }
        : {
            id: defaults.timer_id,
            time_in: limitDate,
            time_out: formatDate(date ?? '', 'YYYY-MM-DD hh:mm:ss A'),
            timer_type: defaults.timer_type,
          };
    dispatch(updateStartEnd(params));
    setDefaultValue({
      ...defaults,
      selectedDate: date,
    });
  };

  const filteredTags = _.orderBy(
    _.filter(tags, (data) =>
      data?.title?.toLowerCase().includes(dataFilter.toLowerCase())
    ),
    ['is_selected'],
    ['desc']
  );

  switch (type) {
    case 'tags':
      return (
        <Box overflow={'hidden'} sx={{ width: '27vw' }}>
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
                  handleOnAddTags({
                    key: type,
                    action: 'add',
                    // Below are endpoint's parameters
                    type: 'preset',
                    title: e.target.value,
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
                {filteredTags.map((data, index) => (
                  <ListItem
                    key={index}
                    component="div"
                    disablePadding
                    secondaryAction={
                      data?.is_selected ? <CheckIcon color="secondary" /> : null
                    }
                  >
                    <ListItemButton
                      onClick={() =>
                        handleOnAddTags({
                          key: type,
                          action: data?.is_selected ? 'remove' : 'add',
                          // Below are endpoint's parameters
                          ids: data?.id,
                          type: 'preset',
                          title: data?.title,
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
    case 'date':
    case 'due_date':
    case 'date_created':
    case 'date_submitted':
    case 'delivery_date':
    case 'custom_date':
      return (
        <DateRange
          ranges={selectedDates}
          rangeColors={[
            Color(theme.palette.secondary.main).alpha(0.8).string(),
          ]}
          maxDate={moment(selectedDates[0]?.startDate, 'YYYY-MM-DD')
            .add(30, 'days')
            .toDate()}
          months={2}
          direction="horizontal"
          onChange={(ranges) => handleDateRangeChange(ranges, type)}
        />
      );
    case 'status':
      return (
        <List dense sx={{ minWidth: '120px', padding: '4px 0' }}>
          {_.filter(status, (stats) =>
            _.map(stats?.related_to, (types) => types.name === 'task').includes(
              true
            )
          ).map((stats, index) => (
            <ListItem
              key={index}
              sx={{
                padding: 0,
                '.Mui-selected': {
                  backgroundColor: '#9871ff42',
                  '&:hover': {
                    backgroundColor: '#f220763b',
                  },
                },
              }}
            >
              <ListItemButton
                selected={stats.id === Number(defaults?.selectedId)}
                onClick={() => {
                  handleTaskUpdate(type, {
                    is_parent: defaults.isParent,
                    id: defaults.taskId,
                    key: type,
                    value: stats?.id,
                  });

                  onClose();
                }}
              >
                <ListItemText
                  sx={{
                    '.MuiTypography-root': {
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      textTransform: 'capitalize',
                    },
                  }}
                >
                  <SquareRoundedIcon
                    sx={{
                      color:
                        appColors.status[
                          _.camelCase(
                            stats?.name?.toLowerCase().replace(/_/g, ' ')
                          )
                        ],
                      marginRight: '1em',
                    }}
                  />
                  {stats?.name}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      );

    case 'priority':
      return (
        <List component="nav" dense={true} sx={{ width: '10.5em' }}>
          {priority?.map((data, index) => (
            <ListItem
              key={index}
              sx={{
                padding: 0,
                '.Mui-selected': {
                  backgroundColor: '#9871ff42',
                  '&:hover': {
                    backgroundColor: '#f220763b',
                  },
                },
              }}
            >
              <ListItemButton
                key={index}
                selected={Number(defaults?.selectedId) === Number(data?.id)}
                sx={{
                  '&.Mui-selected': { backgroundColor: '#5025c41a' },
                }}
                onClick={() => {
                  handleTaskUpdate(type, {
                    is_parent: defaults.isParent,
                    id: defaults.taskId,
                    key: type,
                    value: data?.id,
                  });

                  onClose();
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <AssistantPhotoRoundedIcon
                    sx={{
                      color: appColors.priority[data?.name.toLowerCase()],
                    }}
                  />
                  <ListItemText
                    primary={data?.name}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      );

    case 'due':
    case 'delivery':
      return (
        <DatePicker
          selected={
            _.isNull(defaults?.selectedDate)
              ? new Date()
              : new Date(defaults?.selectedDate)
          }
          inline
          dateFormat={'MM/DD/YYYY HH:mm A'}
          showTimeSelect
          onChange={(date) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
              handleTaskUpdate(type, {
                id: defaults?.taskId,
                is_parent: defaults?.isParent,
                value: moment(date).format('MM/DD/YYYY HH:mm A'),
                key: type === 'due' ? 'due_date' : 'delivery_date',
              });
            }, 1000);

            setDefaultValue({
              ...defaults,
              selectedDate: date,
            });
          }}
        />
      );

    case 'start_date':
    case 'end_date':
      return (
        <TimerDateTimePicker
          type={defaults?.type}
          selected={
            _.isNull(defaults?.selectedDate)
              ? new Date()
              : new Date(defaults?.selectedDate)
          }
          handleSave={handleOnChangeDateTimePicker}
          handleClose={onClose}
          limit={defaults?.limitDate}
        />
      );

    case 'sort':
      return (
        <List dense sx={{ width: '112px', padding: '0.2em 0' }}>
          {sort?.map((data, index) => (
            <ListItem
              key={index}
              sx={{ padding: 0 }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="sort"
                  size="small"
                  sx={{ padding: 0 }}
                >
                  {data.sortType === '' ? (
                    <></>
                  ) : data.sortType?.charAt(0) === '-' ? (
                    <TextRotateVerticalIcon color="secondary" />
                  ) : (
                    <TextRotateUpIcon color="secondary" />
                  )}
                </IconButton>
              }
              onClick={() => handleSort(data, type)}
              disablePadding
            >
              <ListItemButton sx={{ width: 151, paddingLeft: '12px' }}>
                <ListItemText
                  sx={{ '.MuiTypography-root': { fontWeight: 700 } }}
                >
                  {data?.name}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      );
    case 'dropdown':
      return (
        <List dense sx={{ width: '112px', padding: '0.2em 0' }}>
          {dropdowns?.map((data, index) => (
            <ListItem
              key={index}
              sx={{ padding: 0 }}
              onClick={(e) => onDropdownChange(e, data, type)}
              disablePadding
            >
              <ListItemButton sx={{ width: 151, paddingLeft: '12px' }}>
                <ListItemText
                  sx={{ '.MuiTypography-root': { fontWeight: 700 } }}
                >
                  {data?.name}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      );
    default:
      return (
        <VirtualListSelection
          option={users}
          type={type}
          selected={defaults?.selectedAssignees}
          taskId={defaults?.taskId}
          isParent={defaults?.isParent}
          handleSave={(data) => handleTaskUpdate(type, data)}
        />
      );
  }
};

PopperOptions.propTypes = {
  type: PropTypes.string.isRequired,
  status: PropTypes.any,
  priority: PropTypes.any,
  users: PropTypes.any,
  sort: PropTypes.any,
  tags: PropTypes.any,
  dropdowns: PropTypes.any,
  defaults: PropTypes.any,
  setDefaultValue: PropTypes.any,
  handleTaskUpdate: PropTypes.any,
  onClose: PropTypes.any,
  handleSort: PropTypes.any,
  handleDateRangeChange: PropTypes.any,
  handleOnAddTags: PropTypes.func,
  onDropdownChange: PropTypes.any,
  selectedDates: PropTypes.any,
};

export default PopperOptions;
