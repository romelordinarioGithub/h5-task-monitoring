import React, { useRef, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import _ from 'lodash';

import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  Autocomplete,
  Checkbox,
  Tabs,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';

import PlaylistAddTwoToneIcon from '@mui/icons-material/PlaylistAddTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';

export default function ReferenceContent({
  open,
  value,
  onClose,
  inputDatasources,
  handleAddReferenceLink,
  handleUpdateReferenceLink,
  selectedRows,
  isTask,
}) {
  const inputRef = useRef(null);

  const inputAddLink = {
    name: null,
    url: null,
    task_type: [],
    category: [],
  };

  const [linkId, setLinkId] = useState(null);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [isCheckLabel, setIsCheckLabel] = useState(true);
  const [isCheckUrl, setIsCheckUrl] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [parentTasks, setParentTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [addLinks, setAddLinks] = useState([inputAddLink]);
  const [tabView, setTabView] = useState(0);

  const isEditing = !_.isNull(value);
  const regexUrl = /^https?:\/\//;

  useEffect(() => {
    open && inputRef.current.focus();
    setIsCheckLabel(true);
    setIsCheckUrl(true);
    setIsValidUrl(false);

    if (_.isEmpty(selectedRows) && isEditing) {
      setIsValidUrl(!regexUrl.test(value?.url ?? ''));
      setLinkId(value?.id ?? '');
      setLabel(value?.name ?? '');
      setUrl(value?.url ?? '');
      setParentTasks(
        value?.types?.map((i) => ({
          id: i.task_type.id,
          label: i.task_type.name,
        })) ?? []
      );
      setSubTasks(
        value?.categories?.map((i) => ({
          id: i.category.id,
          label: i.category.name,
        })) ?? []
      );
    } else {
      setTabView(0);
      setAddLinks([inputAddLink]);
    }
  }, [open]);

  const handleOnClickAddOrSave = () => {
    if (isEditing) {
      const inputs = {
        name: label ?? null,
        url: url ?? null,
        task_type: parentTasks?.map((i) => `${i.id}`) ?? [],
        category: subTasks?.map((i) => `${i.id}`) ?? [],
      };
      handleUpdateReferenceLink({ ...inputs, link_id: linkId });
    } else {
      const inputs = addLinks?.map((data) => ({
        ...data,
        task_type: data?.task_type?.map((i) => `${i.id}`) ?? [],
        category: data?.category?.map((i) => `${i.id}`) ?? [],
      }));
      handleAddReferenceLink(inputs);
    }

    onClose();
  };

  const handleOnClickCancel = () => {
    onClose();
  };

  const handleInputUrl = (e) => {
    setIsValidUrl(!regexUrl.test(e.target.value));
    setUrl(e.target.value);
  };

  const handleIsDisabledSave = () => {
    if (isEditing) {
      const hasSelection = !_.isEmpty(selectedRows);
      const hasLabel = !_.isEmpty(label);
      const hasUrl = !_.isEmpty(url);

      if (hasSelection) {
        // bulk edit
        if (!isCheckLabel || !isCheckUrl) {
          if (isCheckLabel && hasLabel) return false;
          if (isCheckUrl && hasUrl && !isValidUrl) return false;
        }

        if (isCheckLabel && hasLabel && isCheckUrl && hasUrl && !isValidUrl)
          return false;
      } else {
        // single edit
        if (hasLabel && hasUrl && !isValidUrl) return false;
      }

      return true;
    } else {
      let isValidAddReferenceLink = addLinks.some(({ name, url }, index) => {
        if (_.isEmpty(name) || _.isEmpty(url) || !regexUrl.test(url))
          return true;

        if (addLinks?.length - 1 === index) return false;
      });

      return isValidAddReferenceLink;
    }
  };

  return (
    <>
      <Box width={600} py={2} px={3}>
        <Box display="flex" alignItems="center" mb={1}>
          {isEditing ? (
            <EditTwoToneIcon
              sx={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
            />
          ) : (
            <AddTwoToneIcon
              sx={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
            />
          )}
          <Typography variant="h6" fontWeight={800} color="primary">
            {isEditing ? 'Edit' : 'Add'}{' '}
            {!_.isEmpty(selectedRows) && 'Selected'} Reference Link
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {isEditing ? (
            <Box width="100%">
              <Box>
                {!_.isEmpty(selectedRows) && isEditing && (
                  <Checkbox
                    sx={{ marginBottom: '4px' }}
                    checked={isCheckLabel}
                    onClick={() => {
                      setIsCheckLabel((prev) => !prev);
                      setLabel('');
                    }}
                    size="small"
                  />
                )}
                <Typography
                  variant="caption"
                  textTransform="uppercase"
                  fontWeight={700}
                  color="#777777"
                >
                  Label
                </Typography>
                <TextField
                  size="small"
                  inputRef={inputRef}
                  value={label}
                  disabled={!isCheckLabel}
                  inputProps={{ maxLength: 75 }}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </Box>
              <Box>
                {!_.isEmpty(selectedRows) && isEditing && (
                  <Checkbox
                    sx={{ marginBottom: '4px' }}
                    checked={isCheckUrl}
                    onClick={() => {
                      setIsCheckUrl((prev) => !prev);
                      setUrl('');
                      if (isCheckUrl) setIsValidUrl(false);
                    }}
                    size="small"
                  />
                )}
                <Typography
                  variant="caption"
                  textTransform="uppercase"
                  fontWeight={700}
                  color="#777777"
                >
                  Url
                </Typography>
                <TextField
                  size="small"
                  value={url}
                  disabled={!isCheckUrl}
                  placeholder="https://"
                  error={!_.isEmpty(url) && isValidUrl}
                  helperText={
                    !_.isEmpty(url) && isValidUrl
                      ? 'Please enter a valid URL'
                      : ''
                  }
                  inputProps={{ maxLength: 1000 }}
                  onChange={(e) => handleInputUrl(e)}
                />
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  borderRight: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Tabs
                  orientation="vertical"
                  value={tabView}
                  sx={{ textTransform: 'none' }}
                >
                  {addLinks?.map((data, index) => (
                    <Box direction="row" key={index}>
                      <IconButton
                        color="error"
                        disabled={addLinks?.length <= 1}
                        onClick={() => {
                          if (index <= tabView && tabView !== 0)
                            setTabView(tabView - 1);
                          setAddLinks(
                            addLinks.filter(
                              (_, deleteIndex) => deleteIndex !== index
                            )
                          );
                        }}
                      >
                        <DeleteTwoToneIcon />
                      </IconButton>
                      <Button onClick={() => setTabView(index)}>
                        <Tooltip
                          disableInteractive
                          title={
                            !_.isEmpty(data?.name)
                              ? data?.name
                              : `Link ${index + 1}`
                          }
                        >
                          <Typography
                            color={
                              _.isEmpty(data?.name) ||
                              _.isEmpty(data?.url) ||
                              !regexUrl.test(data?.url)
                                ? 'error'
                                : ''
                            }
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: '2',
                              WebkitBoxOrient: 'vertical',
                              maxWidth: '45px',
                              textTransform: 'none',
                            }}
                          >
                            {!_.isEmpty(data?.name)
                              ? data?.name
                              : `Link ${index + 1}`}
                          </Typography>
                        </Tooltip>
                      </Button>
                    </Box>
                  ))}
                </Tabs>
                <Button
                  startIcon={<PlaylistAddTwoToneIcon />}
                  disabled={addLinks?.length >= 10}
                  onClick={() => setAddLinks([...addLinks, inputAddLink])}
                  sx={{ textTransform: 'none' }}
                >
                  Add Link
                </Button>
              </Box>
              <Box width="100%">
                <Box>
                  <Typography
                    variant="caption"
                    textTransform="uppercase"
                    fontWeight={700}
                    color="#777777"
                  >
                    Label
                  </Typography>
                  <TextField
                    size="small"
                    inputRef={inputRef}
                    value={addLinks[tabView]?.name ?? ''}
                    inputProps={{ maxLength: 75 }}
                    onChange={(e) =>
                      setAddLinks(
                        addLinks.map((data, index) =>
                          index === tabView
                            ? { ...data, name: e.target.value }
                            : data
                        )
                      )
                    }
                  />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    textTransform="uppercase"
                    fontWeight={700}
                    color="#777777"
                  >
                    Url
                  </Typography>
                  <TextField
                    size="small"
                    value={addLinks[tabView]?.url ?? ''}
                    placeholder="https://"
                    error={
                      !_.isEmpty(addLinks[tabView]?.url) &&
                      !regexUrl.test(addLinks[tabView]?.url)
                    }
                    helperText={
                      !_.isEmpty(addLinks[tabView]?.url) &&
                      !regexUrl.test(addLinks[tabView]?.url)
                        ? 'Please enter a valid URL'
                        : ''
                    }
                    inputProps={{ maxLength: 1000 }}
                    onChange={(e) =>
                      setAddLinks(
                        addLinks.map((data, index) =>
                          index === tabView
                            ? { ...data, url: e.target.value }
                            : data
                        )
                      )
                    }
                  />
                </Box>
                {!isTask && (
                  <>
                    <Box>
                      <Typography
                        variant="caption"
                        textTransform="uppercase"
                        fontWeight={700}
                        color="#777777"
                      >
                        Parent Task
                      </Typography>
                      <Autocomplete
                        fullWidth
                        disablePortal
                        multiple
                        freeSolo
                        value={addLinks[tabView]?.task_type}
                        isOptionEqualToValue={(o, v) => o.id == v.id}
                        options={inputDatasources?.parentTasks.map((i) => ({
                          id: i.id,
                          label: i.name,
                        }))}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                        onChange={(_, value) =>
                          setAddLinks(
                            addLinks.map((data, index) =>
                              index === tabView
                                ? { ...data, task_type: value }
                                : data
                            )
                          )
                        }
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        textTransform="uppercase"
                        fontWeight={700}
                        color="#777777"
                      >
                        Sub Task
                      </Typography>
                      <Autocomplete
                        fullWidth
                        disablePortal
                        multiple
                        freeSolo
                        value={addLinks[tabView]?.category}
                        isOptionEqualToValue={(o, v) => o.id == v.id}
                        options={inputDatasources?.subTasks.map((i) => ({
                          id: i.id,
                          label: i.name,
                        }))}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                        onChange={(_, value) =>
                          setAddLinks(
                            addLinks.map((data, index) =>
                              index === tabView
                                ? { ...data, category: value }
                                : data
                            )
                          )
                        }
                      />
                    </Box>
                  </>
                )}
              </Box>
            </>
          )}
        </Stack>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
        px={3}
        py={2}
      >
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          disableFocusRipple
          disabled={handleIsDisabledSave()}
          sx={{ textTransform: 'capitalize' }}
          startIcon={<SaveTwoToneIcon />}
          onClick={handleOnClickAddOrSave}
        >
          Save
        </Button>
        <Box mx={0.5} />
        <Button
          color="error"
          variant="contained"
          disableElevation
          disableFocusRipple
          sx={{ textTransform: 'capitalize' }}
          startIcon={<CloseTwoToneIcon />}
          onClick={handleOnClickCancel}
        >
          Cancel
        </Button>
      </Box>
    </>
  );
}

ReferenceContent.propTypes = {
  open: PropTypes.any,
  value: PropTypes.any,
  onClose: PropTypes.func,
  inputDatasources: PropTypes.any,
  handleAddReferenceLink: PropTypes.func,
  handleUpdateReferenceLink: PropTypes.func,
  selectedRows: PropTypes.any,
  isTask: PropTypes.bool,
};

// const channelList = [
//   { label: 'Google Display', id: 1 },
//   { label: 'Google Video', id: 2 },
//   { label: 'Meta Static', id: 3 },
//   { label: 'Meta Video', id: 4 },
//   { label: 'Youtube', id: 5 },
// ];
