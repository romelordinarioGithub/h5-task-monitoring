import { useState, useContext, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import {
  Stack,
  Box,
  Checkbox,
  Chip,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';

// Icon component
import DoneIcon from '@mui/icons-material/Done';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';

import Swal from 'sweetalert2';

import TaskContext from 'pages/Task/Context';

function QAError() {
  const {
    options: { qaTagsList },
  } = useSelector((state) => state.tasks);

  const {
    handleSave,
    userData: { team_id, user_role },
  } = useContext(TaskContext);

  const [tags, setTags] = useState(qaTagsList);
  const [check, setCheck] = useState(false);
  const [isRemove, setIsRemove] = useState([]);

  useEffect(() => {
    let tagsList = [];
    qaTagsList.forEach((data) => {
      const { id, parent_id, name, sub_categories, is_selected } = data;
      tagsList.push({
        error_id: id,
        parent_error_id: parent_id,
        error_name: name,
        is_selected,
        orig_is_selected: is_selected,
      });
      sub_categories.forEach((sub) => {
        const { id, parent_id, name, is_selected } = sub;
        tagsList.push({
          error_id: id,
          parent_error_id: parent_id,
          error_name: name,
          is_selected,
          orig_is_selected: is_selected,
        });
      });
    });
    setTags(tagsList);
    setIsRemove([]);
  }, [qaTagsList]);

  useEffect(() => {
    if (!_.isEmpty(qaTagsList.filter(({ is_selected }) => is_selected)))
      setCheck(true);
  }, []);

  const handleChange = (e, isCategory) => {
    let newArr = [...tags];
    let index = _.findIndex(newArr, (data) => data === e);
    newArr[index].orig_is_selected = !newArr[index].orig_is_selected;

    let categoryIndex = _.findIndex(
      newArr,
      (data) => data?.error_id === newArr[index].parent_error_id
    );

    let isResultCategory = _.some(newArr, {
      parent_error_id: newArr[index].parent_error_id,
      orig_is_selected: true,
    });

    let category = !isResultCategory
      ? _.find(
          newArr,
          (data) => data?.error_id === newArr[index].parent_error_id
        )
      : null;

    const removeValue = {
      error_id: e.error_id,
      parent_error_id: e.parent_error_id,
      error_name: e.error_name,
    };

    if (isCategory) {
      const reasons = tags.filter(
        (data) =>
          data.parent_error_id === e.error_id &&
          data.is_selected &&
          data?.orig_is_selected
      );

      newArr = newArr.map((data) => ({
        ...data,
        orig_is_selected:
          newArr[index].error_id == data?.parent_error_id && data?.is_selected
            ? true
            : data?.orig_is_selected,
      }));

      !_.some(isRemove, removeValue)
        ? setIsRemove([...isRemove, ...reasons, e])
        : setIsRemove(
            isRemove.filter(
              (data) =>
                !_.isMatch(data, removeValue) &&
                !_.isMatch(removeValue, data) &&
                data?.parent_error_id !== e.error_id
            )
          );
    } else {
      if (!isResultCategory)
        newArr[categoryIndex].orig_is_selected =
          !newArr[categoryIndex].orig_is_selected;

      !_.some(isRemove, removeValue)
        ? setIsRemove(
            !isResultCategory ? [...isRemove, e, category] : [...isRemove, e]
          )
        : setIsRemove(
            isRemove.filter(
              (data) =>
                !_.isMatch(data, removeValue) &&
                !_.isMatch(removeValue, data) &&
                data !== category
            )
          );
    }

    setTags(newArr);
  };

  const handleSaveTags = () => {
    Swal.fire({
      icon: 'warning',
      title: '<p style="font-size: 0.7em">Do you want to save revision(s)?</p>',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
      focusConfirm: false,
      customClass: {
        container: 'swal-container',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleSave({
          key: 'qa_tags',
          action: 'add',
          add: [],
          remove: isRemove.map((data) => {
            delete data.is_selected;
            delete data?.orig_is_selected;
            return data;
          }),
        });
      }
    });
  };

  const handleCheckBox = (e) => {
    check
      ? Swal.fire({
          icon: 'warning',
          title:
            '<p style="font-size: 0.7em">Do you want to clear the revision(s)?</br>This will approve all threads.</p>',
          iconColor: '#F2445C',
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          confirmButtonColor: '#F2445C',
          confirmButtonClass: 'no-outline',
          denyButtonText: `No`,
          focusConfirm: false,
          customClass: {
            container: 'swal-container',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            handleClear();
            setCheck(false);
          }
        })
      : setCheck(e.target.checked);
  };

  const handleClear = () => {
    handleSave({
      key: 'qa_tags',
      action: 'clear',
    });
  };

  return (
    <Stack spacing={1}>
      <Box>
        <Stack direction="row">
          <Typography fontWeight={700} paddingTop=".7em" paddingRight="1.5em">
            Revision
          </Typography>
          <Checkbox
            sx={{ '& .MuiSvgIcon-root': { fontSize: '1.5em' } }}
            checked={check}
            disabled={
              !check ||
              user_role?.toLowerCase() !== 'administrator' ||
              ![3, 5].includes(team_id)
            }
            onChange={
              [3, 5].includes(team_id) &&
              user_role?.toLowerCase() === 'administrator' &&
              handleCheckBox
            }
          />
          {check && [3, 5].includes(team_id) && (
            <Box>
              <Tooltip title="Save">
                <IconButton color="primary" onClick={handleSaveTags}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Stack>
        <Divider sx={{ borderColor: '#0000000a' }} />
      </Box>
      {check &&
        !_.isEmpty(
          tags.filter(
            ({ parent_error_id, is_selected }) =>
              parent_error_id === 0 && is_selected
          )
        ) && (
          <Box>
            <Grid container sx={{ paddingTop: '.5em' }} paddingY="1em">
              <Grid item xs={2}>
                <Typography fontWeight={700}>Error Category</Typography>
              </Grid>
              <Grid item xs={9}>
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {tags
                      .filter(
                        ({ parent_error_id, is_selected }) =>
                          parent_error_id === 0 && is_selected
                      )
                      .map((data, index) => (
                        <Chip
                          key={index}
                          label={data.error_name}
                          color={data?.is_selected ? 'primary' : 'secondary'}
                          icon={data?.orig_is_selected ? <DoneIcon /> : null}
                          onClick={() =>
                            [3, 5].includes(team_id) && handleChange(data, true)
                          }
                          variant={
                            data?.orig_is_selected ? 'filled' : 'outlined'
                          }
                        />
                      ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ borderColor: '#0000000a' }} />
            {!_.isEmpty(
              tags.filter(
                ({ parent_error_id, is_selected }) =>
                  parent_error_id !== 0 &&
                  is_selected &&
                  _.some(
                    tags,
                    (data) =>
                      data?.orig_is_selected &&
                      parent_error_id === data?.error_id
                  )
              )
            ) && (
              <Box>
                <Grid container sx={{ paddingTop: '.5em' }} paddingY="1em">
                  <Grid item xs={2}>
                    <Typography fontWeight={700} paddingTop=".5em">
                      Error Type
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        sx={{ flexWrap: 'wrap' }}
                      >
                        {tags
                          .filter(
                            ({ parent_error_id, is_selected }) =>
                              parent_error_id !== 0 &&
                              is_selected &&
                              _.some(
                                tags,
                                (data) =>
                                  data?.orig_is_selected &&
                                  parent_error_id === data?.error_id
                              )
                          )
                          .map((data, index) => (
                            <Chip
                              key={index}
                              label={data.error_name}
                              color={
                                data?.is_selected ? 'primary' : 'secondary'
                              }
                              icon={
                                data?.orig_is_selected ? <DoneIcon /> : null
                              }
                              onClick={() =>
                                [3, 5].includes(team_id) &&
                                handleChange(data, false)
                              }
                              variant={
                                data?.orig_is_selected ? 'filled' : 'outlined'
                              }
                            />
                          ))}
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ borderColor: '#0000000a' }} />
              </Box>
            )}
          </Box>
        )}
    </Stack>
  );
}

export default memo(QAError);
