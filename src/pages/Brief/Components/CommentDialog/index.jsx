import React, { forwardRef, useContext, useState, useEffect } from 'react';

import _ from 'lodash';

import PropTypes from 'prop-types';

import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';

// Context
import BriefContext from 'pages/Brief/Context';

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Slide,
  Box,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Grid,
  Autocomplete,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CommentDialog() {
  const [open, setOpen] = useState(true);
  const [reportLink, setReportLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState([]);
  const [errorCategory, setErrorCategory] = useState([]);
  const [drivenType, setDrivenType] = useState([]);
  const [notes, setNotes] = useState('');
  const [selectedDesktopSizes, setSelectedDesktopSizes] = useState([]);
  const [selectedMobileSizes, setSelectedMobileSizes] = useState([]);
  const [tagsList, setTagList] = useState([]);

  const {
    threadStatus,
    selected,
    handleOnSubmitQaResult,
    handleQATagsModal,
    userData: { id: userId },
    taskType: { id: taskTypeId },
  } = useContext(BriefContext);

  const othersId = taskTypeId === 12 ? 78 : 63;
  const otherTagList = tagsList.filter((data) => data.parent_id === othersId);
  const reasonTagList = tagsList.filter(
    (data) =>
      data?.parent_id !== 0 &&
      !_.some(
        otherTagList,
        (other) => other?.value === data?.value && data?.parent_id !== othersId
      )
  );

  const {
    options: {
      desktopDisplayList,
      mobileDisplayList,
      // predefinedReasonsList,
      qaTagsList,
      qaTagsModal,
    },
  } = useSelector((state) => state.briefs);

  const displayDesktop = _.filter(
    desktopDisplayList,
    (data) => data?.is_selected == true
  );
  const displayMobile = _.filter(
    mobileDisplayList,
    (data) => data?.is_selected == true
  );

  const handleQATags = (data) => {
    let qaTags = [];
    let selectedCategory = [];
    let selectedReason = [];

    data.forEach(
      ({
        id,
        parent_id,
        name,
        sub_categories,
        is_selected: parentSelected,
      }) => {
        const category = {
          id,
          parent_id,
          value: name,
        };
        qaTags.push(category);
        sub_categories.forEach(
          ({ id, parent_id, name, is_selected, user_id }) => {
            if (!_.isNull(name)) {
              const subCategory = {
                id,
                parent_id,
                value: name,
              };
              qaTags.push(subCategory);
              if (is_selected && _.some(user_id, (value) => value === userId)) {
                parentSelected && selectedCategory.push(category);
                selectedReason.push(subCategory);
              }
            }
          }
        );
      }
    );

    setTagList(qaTags);

    if (threadStatus?.rejected !== 0) {
      setErrorCategory(selectedCategory);
      setReason(selectedReason);
    }
  };

  useEffect(() => {
    threadStatus?.rejected === 0
      ? handleQATags(qaTagsList)
      : handleQATagsModal();
  }, []);

  useEffect(() => {
    threadStatus?.rejected !== 0 && handleQATags(qaTagsModal);
  }, [qaTagsModal]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCategory = (event, newInputValue) => {
    const rmCategory = _.first(
      _.differenceWith(errorCategory, newInputValue, _.isEqual)
    );
    const newCategory = _.last(newInputValue);

    if (_.isEmpty(newInputValue)) {
      setErrorCategory([]);
      setReason([]);
      return;
    }

    // Removed existing reason
    if (!_.isUndefined(rmCategory))
      setReason(reason.filter((data) => data?.parent_id !== rmCategory?.id));

    _.some(errorCategory, newCategory)
      ? setErrorCategory(
          errorCategory.filter((data) => !_.isEqual(data, rmCategory))
        )
      : setErrorCategory(newInputValue);
  };

  const handleReason = (event, newInputValue) => {
    const newValue = _.last(newInputValue);
    const findReason = _.find(
      reasonTagList,
      (data) => data?.value === newValue
    );
    if (typeof newValue === 'string' && !_.isEmpty(findReason)) {
      newInputValue.pop();
      newInputValue = [...newInputValue, findReason];
    }

    const inputValue = _.uniqBy(
      newInputValue.map((data) => ({
        id: data?.id ?? 0,
        parent_id: data?.parent_id ?? othersId,
        value: data?.value ?? data,
      })),
      'value'
    );

    const newReason = _.first(_.differenceWith(inputValue, reason, _.isEqual));
    const rmReason = _.first(_.differenceWith(reason, inputValue, _.isEqual));
    const parentCategory = _.find(
      tagsList,
      (data) => data?.id === newReason?.parent_id
    );

    // If Cleared reason
    if (_.isEmpty(inputValue)) {
      setReason([]);
      setErrorCategory([]);
      return;
    }

    // If error category doesn't exist then add error category
    if (!_.isUndefined(newReason) && !errorCategory.includes(parentCategory))
      setErrorCategory([...errorCategory, parentCategory]);

    // if error category reason is empty then remove category
    if (
      !_.isUndefined(rmReason) &&
      !_.some(inputValue, { parent_id: rmReason?.parent_id })
    )
      setErrorCategory(
        errorCategory.filter(({ id }) => id !== rmReason?.parent_id)
      );

    _.some(reason, newReason)
      ? setReason(reason.filter((data) => !_.isEqual(data, rmReason)))
      : setReason(inputValue);
  };

  const handleOnSubmit = async () => {
    setLoading(true);
    const concatenatedDesktopSizes = !_.isEmpty(selectedDesktopSizes)
      ? `Desktop: ${selectedDesktopSizes.map((i) => i.size).join(',')}${
          !_.isEmpty(selectedMobileSizes) ? ' ' : ''
        }`
      : '';
    const concatenatedMobileSizes = !_.isEmpty(selectedMobileSizes)
      ? `Mobile: ${selectedMobileSizes.map((i) => i.size).join(',')}`
      : '';
    const data = {
      reportLink,
      reason: [...errorCategory, ...reason],
      drivenType,
      notes,
      others: `${concatenatedDesktopSizes}${concatenatedMobileSizes}`,
    };
    (await handleOnSubmitQaResult(data)) !== true && setOpen(!open);
    setLoading(false);
  };

  const canSubmit =
    selected === 'thread_resolve'
      ? !_.isEmpty(reportLink)
      : !_.isEmpty(reason) && !_.isEmpty(reportLink) && !_.isEmpty(drivenType);

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        TransitionComponent={Transition}
        BackdropProps={{
          sx: { backgroundColor: '#1a1627a3' },
        }}
        maxWidth={'sm'}
        fullWidth={true}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box alignItems="center" display="flex">
              {selected === 'thread_resolve' ? (
                <CheckCircleOutlinedIcon color="success" />
              ) : (
                <HighlightOffOutlinedIcon color="error" />
              )}
            </Box>
            <Box>
              {selected === 'thread_resolve'
                ? 'Resolve Thread'
                : 'Reject Thread'}
            </Box>
          </Stack>
        </DialogTitle>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <DialogContent>
          <Stack mb={2}>
            <Stack direction="row">
              <Typography fontWeight={700}>
                {selected === 'thread_reject'
                  ? 'Reason for Rejection'
                  : 'Reason (Optional)'}
              </Typography>
              {selected === 'thread_reject' && (
                <Typography color="error">*</Typography>
              )}
            </Stack>
            <Autocomplete
              freeSolo
              forcePopupIcon
              multiple
              sx={{
                '& .MuiAutocomplete-tag': {
                  color: '#FFFFFF',
                  borderRadius: '7px',
                  height: '2.5em',
                  '& .MuiChip-deleteIcon': {
                    color: 'rgb(255 255 255 / 75%)',
                  },
                },
              }}
              value={reason}
              clearOnBlur
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) =>
                    inputValue.toLowerCase() === option.value.toLowerCase()
                );

                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    id: 0,
                    parent_id: othersId,
                    value: `${inputValue}`,
                  });
                }

                return filtered;
              }}
              onChange={handleReason}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      sx={{
                        backgroundColor:
                          option?.parent_id !== othersId
                            ? '#25165B'
                            : '#5025C4',
                      }}
                      label={option?.value}
                      key={key}
                      {...tagProps}
                    />
                  );
                })
              }
              getOptionLabel={(option) => option.value}
              options={reasonTagList}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{ ...params.inputProps, maxLength: 50 }}
                />
              )}
              renderOption={(props, option) => (
                <Box
                  {...props}
                  key={option.value}
                  sx={{
                    backgroundColor: _.some(reason, option)
                      ? '#edebef'
                      : '#fff',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  {option.value}&nbsp;
                  {_.some(reason, option) && (
                    <CheckIcon color="secondary" fontSize="small" />
                  )}
                </Box>
              )}
            />
          </Stack>
          <Stack mb={2}>
            <Stack direction="row">
              <Typography fontWeight={700}>Error Category</Typography>
              {selected === 'thread_reject' && (
                <Typography color="error">*</Typography>
              )}
            </Stack>
            <Autocomplete
              multiple
              sx={{
                '& .MuiAutocomplete-tag': {
                  color: '#FFFFFF',
                  borderRadius: '7px',
                  height: '2.5em',
                  '& .MuiChip-deleteIcon': {
                    color: 'rgb(255 255 255 / 75%)',
                  },
                },
              }}
              popupIcon={''}
              open={false}
              InputProps={{ sx: { caretColor: 'white' } }}
              value={errorCategory}
              onChange={handleCategory}
              getOptionLabel={(option) => option.value}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      sx={{
                        backgroundColor:
                          option?.id !== othersId ? '#25165B' : '#5025C4',
                      }}
                      label={option?.value}
                      key={key}
                      {...tagProps}
                    />
                  );
                })
              }
              options={tagsList.filter((data) => data?.parent_id === 0)}
              renderInput={({ inputProps, ...rest }) => (
                <TextField
                  {...rest}
                  inputProps={{ ...inputProps, readOnly: true }}
                />
              )}
            />
          </Stack>
          <Stack mb={2}>
            <Stack direction="row">
              <Typography fontWeight={700}>Report Link</Typography>
              <Typography color="error">*</Typography>
            </Stack>
            <TextField
              fullWidth
              placeholder="Report Link"
              onChange={(e) => setReportLink(e.target.value)}
            />
          </Stack>

          <Stack mb={2}>
            <Stack direction="row">
              <Typography fontWeight={700}>Driven Type</Typography>
              {selected === 'thread_reject' && (
                <Typography color="error">*</Typography>
              )}
            </Stack>
            <FormControl fullWidth>
              <Select
                multiple
                value={drivenType}
                onChange={(e) => setDrivenType(e.target.value)}
                sx={{
                  '.MuiSvgIcon-root': {
                    fontSize: '1.5em',
                    marginTop: '.1em',
                    marginRight: '.1em',
                  },
                }}
              >
                <MenuItem value={'Dev Driven'}>Developer</MenuItem>
                <MenuItem value={'PM/MSS'}>PM/MSS</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          {selected !== 'thread_resolve' && (
            <>
              <Stack mb={2}>
                <Typography fontWeight={700}>Desktop Sizes</Typography>
                <Grid container sx={{ padding: '0.2em 0' }}>
                  <Grid item xs={8}>
                    <Box width="fit-content">
                      {!_.isEmpty(displayDesktop) ? (
                        displayDesktop.map((e, i) => (
                          <Chip
                            color="secondary"
                            key={i}
                            label={e.size}
                            size="small"
                            variant={
                              selectedDesktopSizes.find(
                                (c) => c.size === e.size
                              )
                                ? 'filled'
                                : 'outlined'
                            }
                            sx={{
                              marginRight: '0.5em',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const isAlreadySelected =
                                selectedDesktopSizes.find(
                                  (c) => c.size === e.size
                                );
                              isAlreadySelected
                                ? setSelectedDesktopSizes((prev) =>
                                    prev.filter((c) => c.size !== e.size)
                                  )
                                : setSelectedDesktopSizes((prev) => [
                                    ...prev,
                                    e,
                                  ]);
                            }}
                          />
                        ))
                      ) : (
                        <Typography fontWeight={300} fontSize="0.7em">
                          No sizes found
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
              <Stack mb={2}>
                <Typography fontWeight={700}>Mobile Sizes</Typography>
                <Grid container sx={{ padding: '0.2em 0' }}>
                  <Grid item xs={8}>
                    <Box width="fit-content">
                      {!_.isEmpty(displayMobile) ? (
                        displayMobile.map((e, i) => (
                          <Chip
                            color="secondary"
                            key={i}
                            label={e.size}
                            size="small"
                            variant={
                              selectedMobileSizes.find((c) => c.size === e.size)
                                ? 'filled'
                                : 'outlined'
                            }
                            sx={{
                              marginRight: '0.5em',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const isAlreadySelected =
                                selectedMobileSizes.find(
                                  (c) => c.size === e.size
                                );
                              isAlreadySelected
                                ? setSelectedMobileSizes((prev) =>
                                    prev.filter((c) => c.size !== e.size)
                                  )
                                : setSelectedMobileSizes((prev) => [
                                    ...prev,
                                    e,
                                  ]);
                            }}
                          />
                        ))
                      ) : (
                        <Typography fontWeight={300} fontSize="0.7em">
                          No sizes found
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </>
          )}
          <Stack mb={2}>
            <Typography fontWeight={700}>Notes</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            disableElevation
            variant="contained"
            onClick={handleOnSubmit}
            color="secondary"
            sx={{ minWidth: '6em' }}
            disabled={!canSubmit || loading}
          >
            {!loading ? 'Submit' : <CircularProgress size={22} />}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CommentDialog.propTypes = {
  type: PropTypes.string,
  threadId: PropTypes.any,
  taskId: PropTypes.any,
  isParent: PropTypes.any,
  userId: PropTypes.any,
};
