import { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import SkeletonLoader from './skeleton';
import {
  Stack,
  Box,
  InputAdornment,
  OutlinedInput,
  Typography,
  IconButton,
  Collapse,
  Button,
  Grid,
  Card,
  FormControl,
  NativeSelect,
  FormGroup,
  FormControlLabel,
  Checkbox,
  styled,
  Chip,
} from '@mui/material';
import {
  requestAddChecklist_,
  requestUpdateChecklist_,
  requestFetchChecklist_,
  requestDestroyChecklist_,
  requestUncheckedChecklist_,
  requestCheckedChecklist_,
  requestFetchRevision_,
  requestFetchRefLink_,
  requestDestroyRefLink_,
  requestAddRefLink_,
  taskTemplates,
  requestChangeTemplateVersion_,
} from 'store/reducers/tasks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material//Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
// components
import Subtasks from 'pages/Task/Components/CollapsiblePanels/Subtasks';
import Revisions from 'pages/Task/Components/CollapsiblePanels/Revisions';
// Colors
import { appColors } from 'theme/variables';
import { Link } from 'react-router-dom';
// Global CSS
import '../../../../assets/css/concept/task/overide.css';
import { smartly_details } from 'pages/Task/constant';
import _ from 'lodash';

const StyledInputField = styled(OutlinedInput)({
  fontSize: '0.9rem',
  borderRadius: '0.2rem',
  paddingRight: '12px',
  '&.Mui-focused fieldset': {
    border: '1px solid #5025c4 !important',
    boxShadow: '0 0 0 4px rgb(80 37 196 / 10%)',
  },
});

const CollapsiblePanels = ({
  name,
  dataFields,
  subtasks,
  priorityList,
  usersList,
  statusList,
  handleOpen,
  data,
  onCloseDialog,
  onChangeSubtasksAccordion,
}) => {
  const Swal = require('sweetalert2');
  const dispatch = useDispatch();

  const { data_reference } = useSelector((state) => state.tasks);

  const { data_check, data_revision, creatives, isLoadingTemplate } =
    useSelector((state) => state.tasks);

  const [expand, setExpand] = useState(false);

  // References Link
  const [filteredRowsReferenceLink, setFilteredRowsReferenceLink] =
    useState(data_reference);
  const [referenceLinkInput01, setReferenceLinkInput01] = useState('');
  const [referenceLinkInput02, setReferenceLinkInput02] = useState('');

  // Checklist
  const [checkedInput, setCheckedInput] = useState('');
  const [filteredRows, setFilteredRows] = useState(data_check);
  const [filteredRowsCount, setFilteredRowsCount] = useState('');
  const [totalLabel, setTotalLabel] = useState('COMPLETED');
  const [filteredValueUpdate, setFilteredValueUpdate] = useState('');
  const [filteredValueUpdateID, setFilteredValueUpdateID] = useState('');

  useEffect(() => {
    setFilteredRowsReferenceLink(data_reference);
  }, [data_reference]);

  useEffect(() => {
    if (name.toLowerCase() === 'subtasks' && !_.isEmpty(subtasks))
      setExpand(true);
  }, [subtasks]);

  useEffect(() => {
    if (name.toLowerCase() === 'formats') setExpand(true);
  }, [data.format]);

  // Subtasks handlers
  const handleSubtasksAccordion = () => {
    if (!expand) {
      onChangeSubtasksAccordion(dataFields.id);
    }
  };

  // References link handlers
  const handleReferencesAccordion = () => {
    if (!expand) {
      dispatch(
        requestFetchRefLink_({
          relId: dataFields.id,
          relType: dataFields?.rel_type?.toLowerCase() === 'subtask' ? 4 : 3,
        })
      );
    }
  };

  const handleReferencesOnKeyUp = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      if (
        referenceLinkInput01.toString() == '' ||
        referenceLinkInput02.toString() == ''
      ) {
        alert('Please complete all fields.');
      } else {
        const params = {
          rel_id: dataFields.id,
          url: referenceLinkInput02,
          name: referenceLinkInput01,
          rel_type: dataFields?.rel_type?.toLowerCase() === 'subtask' ? 4 : 3, // For fetching. Refactor soon
        };

        dispatch(requestAddRefLink_(params));
        setReferenceLinkInput01('');
        setReferenceLinkInput02('');
      }
    }
  };

  const handleReferencesDelete = (e, id) => {
    Swal.fire({
      title: 'Do you want to delete this data?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        const params = {
          link_id: id,
          rel_id: dataFields.id,
          rel_type: dataFields?.rel_type?.toLowerCase() === 'subtask' ? 4 : 3, // For fetching. Refactor soon
        };

        dispatch(requestDestroyRefLink_(params));
        Swal.fire('Saved!', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  // Templates
  const handleTemplatesAccordion = () => {
    if (!expand) {
      dispatch(
        taskTemplates(
          dataFields?.id,
          dataFields?.rel_type === 'subtask' ? 1 : 0
        )
      );
    }
  };

  const handleTemplatesDropdownOnChange = (e) => {
    const dataVersion = e.target.value.split(',');

    const params = {
      concept_id: data?.concept_id,
      rel_id: dataFields.id,
      rel_type: data?.rel_type == 'task' ? '3' : '4',
      template_id: dataVersion[1],
      version: dataVersion[0],
    };

    dispatch(
      requestChangeTemplateVersion_(
        params,
        dataFields?.rel_type?.toLowerCase() === 'subtask' ? 1 : 0
      )
    );
  };

  // Checklist handlers
  const handleChecklistAccordion = () => {
    if (!expand) {
      dispatch(requestFetchChecklist_(dataFields.id));

      const uncheckedItems = data_check.filter((item) => item.checked == '0');
      const checkedItems = data_check.filter((item) => item.checked == '1');

      setFilteredRows(uncheckedItems);
      setFilteredRowsCount(checkedItems.length);
    }
  };

  const handleChecklistSearch = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      if (_.isEmpty(e.target.value)) {
        return setFilteredRows(data_check);
      }

      setFilteredRows(
        data_check.filter(
          (item) =>
            item.description.toLowerCase() == e.target.value.toLowerCase()
        )
      );
    }
  };

  const handleChecklistOnKeyUp = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      const params = {
        task_id: dataFields.id,
        description: e.target.value,
        is_parent: '1',
      };
      dispatch(requestAddChecklist_(params));
      setTotalLabel('COMPLETED');
      setCheckedInput('');
    }
  };

  const handleChecklistFilter = () => {
    if (totalLabel == 'COMPLETED') {
      setFilteredRows(data_check);
      setTotalLabel('HIDE COMPLETED');
    } else {
      const itemUnchecked = data_check.filter((item) => item.checked == '0');
      setFilteredRows(itemUnchecked);
      setTotalLabel('COMPLETED');
    }
  };

  const handleChecklistCheckboxOnChange = (e, id, type) => {
    if (type == true) {
      const params = {
        id: id,
        task_id: dataFields.id,
      };
      const uncheckedItems = data_check.filter((item) => item.checked == '0');
      dispatch(requestUncheckedChecklist_(params));
      setFilteredRows(uncheckedItems);
      setTotalLabel('COMPLETED');
    } else {
      const params = {
        id: id,
        task_id: dataFields.id,
      };
      dispatch(requestCheckedChecklist_(params));
    }
  };

  const handleChecklistUpdate = (e, id) => {
    const getDataItem = data_check.filter((item) => item.id == id);
    setFilteredValueUpdate(getDataItem[0].description);
    setFilteredValueUpdateID(id);
  };

  const handleChecklistDelete = (e, id) => {
    const params = {
      ids: id,
      task_id: dataFields.id,
    };
    dispatch(requestDestroyChecklist_(params));
    const itemUnchecked = data_check.filter((item) => item.checked == '0');
    setFilteredRows(itemUnchecked);
  };

  const handleChecklistUpdateOnKeyUp = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      const params = {
        id: filteredValueUpdateID,
        description: filteredValueUpdate,
        task_id: dataFields.id,
      };
      dispatch(requestUpdateChecklist_(params));
      const getDataItem = data_check.filter(
        (item) => item.id == filteredValueUpdateID
      );

      if (getDataItem[0].checked == '1') {
        const checkedItems = data_check.filter((item) => item.checked == '1');
        setFilteredRows(checkedItems);
      } else {
        const uncheckedItem = data_check.filter((item) => item.checked == '0');
        setFilteredRows(uncheckedItem);
      }

      setCheckedInput('');
      setFilteredValueUpdate('');
      setFilteredValueUpdateID('');
      setTotalLabel('COMPLETED');
    }
  };

  const transformFormats = (formats) => {
    const newFormats = [];
    formats.forEach((item) => {
      const existingItem = newFormats.find(
        (element) => element.name === item.name
      );
      const size = item.duration
        ? `${item.size} ${item.duration}`
        : `${item.size}`;
      if (existingItem) {
        !_.isEmpty(size) && existingItem.sizes.push(size);
      } else {
        newFormats.push({
          name: item.name,
          sizes: [!_.isEmpty(size) && size],
        });
      }
    });
    return newFormats;
  };

  // Revisions handlers
  const handleRevisionsAccordion = () => {
    dispatch(requestFetchRevision_(dataFields.id));
  };

  switch (name.toLowerCase()) {
    case 'subtasks':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? (
                  <ExpandLessIcon onClick={handleSubtasksAccordion} />
                ) : (
                  <ExpandMoreIcon onClick={handleSubtasksAccordion} />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Subtasks
              data={dataFields}
              task_id={dataFields.id}
              subtasks={subtasks}
              priorityList={priorityList}
              usersList={usersList}
              statusList={statusList}
              handleOpen={handleOpen}
              onCloseDialog={onCloseDialog}
            />
          </Collapse>
        </>
      );

    case 'references':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? (
                  <ExpandLessIcon onClick={handleReferencesAccordion} />
                ) : (
                  <ExpandMoreIcon onClick={handleReferencesAccordion} />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            {!_.isEmpty(filteredRowsReferenceLink) ? (
              (filteredRowsReferenceLink ?? []).map((reference, index) => (
                <Stack
                  justifyContent="space-between"
                  flexDirection="row"
                  paddingRight="10px"
                  display="flex"
                  key={index}
                >
                  <Typography
                    fontWeight={600}
                    color="#DF3C76"
                    component={Link}
                    to={{
                      pathname: reference?.url,
                    }}
                    target="_blank"
                    sx={{
                      textDecoration: 'none',
                      ':hover': { textDecoration: 'underline' },
                    }}
                  >
                    {reference.name}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      padding: 0,
                      '&:hover': { background: 'transparent' },
                    }}
                    onClick={(e) =>
                      handleReferencesDelete(
                        e,
                        reference.id,
                        reference.rel_type,
                        'value'
                      )
                    }
                  >
                    <CloseOutlinedIcon />
                  </IconButton>
                </Stack>
              ))
            ) : (
              <Card variant="outlined" sx={{ borderStyle: 'none' }}>
                <Stack alignItems="center" p={1}>
                  <Box>
                    <IconButton
                      size="large"
                      color="error"
                      disableRipple
                      disableTouchRipple
                      disableFocusRipple
                      sx={{ backgroundColor: '#f2445c1a' }}
                    >
                      <LinkOffIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography fontWeight={700} color="#999999">
                      No reference link found.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            )}
            <Grid sx={{ marginTop: '0px' }} container spacing={2}>
              <Grid item xs={6}>
                <StyledInputField
                  sx={{
                    borderRadius: '0.1em',
                    fieldset: {
                      border: '1px dashed #ececec',
                    },
                  }}
                  onChange={(event) =>
                    setReferenceLinkInput01(event.target.value)
                  }
                  value={referenceLinkInput01}
                  fullWidth
                  name="search"
                  type="text"
                  placeholder="Link Name"
                  inputProps={{
                    autoComplete: 'off',
                  }}
                  size="small"
                  required
                  onKeyUp={handleReferencesOnKeyUp}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledInputField
                  sx={{
                    borderRadius: '0.1em',
                    fieldset: {
                      border: '1px dashed #ececec',
                    },
                  }}
                  onChange={(event) =>
                    setReferenceLinkInput02(event.target.value)
                  }
                  value={referenceLinkInput02}
                  fullWidth
                  name="search"
                  type="text"
                  placeholder="Url"
                  inputProps={{
                    autoComplete: 'off',
                  }}
                  size="small"
                  required
                  onKeyUp={handleReferencesOnKeyUp}
                />
              </Grid>
            </Grid>
          </Collapse>
        </>
      );

    case 'checklist':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? (
                  <ExpandLessIcon onClick={handleChecklistAccordion} />
                ) : (
                  <ExpandMoreIcon onClick={handleChecklistAccordion} />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Stack direction="row" justifyContent="flex-start">
              <Box>
                <StyledInputField
                  name="search"
                  onKeyUp={handleChecklistSearch}
                  type="text"
                  placeholder="Search..."
                  inputProps={{
                    autoComplete: 'off',
                  }}
                  size="small"
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          width: '1em !important',
                          height: '1em !important',
                          color: '#484964',
                        }}
                      />
                    </InputAdornment>
                  }
                  required
                />
              </Box>
            </Stack>
            {_.isEmpty(filteredRows) ? (
              <Card variant="outlined" sx={{ borderStyle: 'none' }}>
                <Stack alignItems="center" p={1}>
                  <Box>
                    <IconButton
                      size="large"
                      color="error"
                      disableRipple
                      disableTouchRipple
                      disableFocusRipple
                      sx={{ backgroundColor: '#f2445c1a' }}
                    >
                      <RemoveDoneIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography fontWeight={700} color="#999999">
                      No checklist found.
                    </Typography>
                  </Box>
                </Stack>
                <Box>
                  <StyledInputField
                    sx={{
                      borderRadius: '0.1em',
                      fieldset: {
                        border: '1px dashed #ececec',
                      },
                    }}
                    onChange={(event) => setCheckedInput(event.target.value)}
                    value={checkedInput}
                    fullWidth
                    name="search"
                    type="text"
                    placeholder="Add New"
                    inputProps={{
                      autoComplete: 'off',
                    }}
                    size="small"
                    required
                    onKeyUp={handleChecklistOnKeyUp}
                  />
                </Box>
                <Box mt={1}>
                  <Button onClick={handleChecklistFilter} color="secondary">
                    {filteredRowsCount} {totalLabel}
                  </Button>
                </Box>
              </Card>
            ) : (
              <Box py={1.5}>
                <FormGroup>
                  {(filteredRows ?? []).map((row) => (
                    <Stack
                      key={row.id}
                      px={1.5}
                      direction="row"
                      justifyContent={'space-between'}
                      sx={{
                        border: '1px solid #ececec',
                        marginBottom: '0.2em',
                        marginLeft: 0,
                        marginRight: 0,
                        '&:hover': {
                          boxShadow: '0 3px 15px rgb(80 37 196 / 40%)',
                        },
                      }}
                    >
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onClick={(e) =>
                                handleChecklistCheckboxOnChange(
                                  e,
                                  row.id,
                                  row.checked == '1' ? true : false,
                                  'value'
                                )
                              }
                              defaultChecked={row.checked == '1' ? true : false}
                            />
                          }
                          label={row.description}
                        />
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          sx={{
                            padding: 0,
                            '&:hover': { background: 'transparent' },
                          }}
                          onClick={(e) =>
                            handleChecklistUpdate(e, row.id, 'value')
                          }
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            padding: 0,
                            '&:hover': { background: 'transparent' },
                          }}
                          onClick={(e) =>
                            handleChecklistDelete(e, row.id, 'value')
                          }
                        >
                          <CloseOutlinedIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  ))}
                </FormGroup>

                {_.isEmpty(filteredValueUpdate) ? (
                  <Box>
                    <StyledInputField
                      sx={{
                        borderRadius: '0.1em',
                        fieldset: {
                          border: '1px dashed #ececec',
                        },
                      }}
                      onChange={(event) => setCheckedInput(event.target.value)}
                      value={checkedInput}
                      fullWidth
                      name="search"
                      type="text"
                      placeholder="Add New"
                      inputProps={{
                        autoComplete: 'off',
                      }}
                      size="small"
                      required
                      onKeyUp={handleChecklistOnKeyUp}
                    />
                  </Box>
                ) : (
                  <Box>
                    <StyledInputField
                      sx={{
                        borderRadius: '0.1em',
                        fieldset: {
                          border: '1px dashed #ececec',
                        },
                      }}
                      onChange={(event) =>
                        setFilteredValueUpdate(event.target.value)
                      }
                      fullWidth
                      value={filteredValueUpdate}
                      name="search"
                      type="text"
                      placeholder="Add New"
                      inputProps={{
                        autoComplete: 'off',
                      }}
                      size="small"
                      required
                      onKeyUp={handleChecklistUpdateOnKeyUp}
                    />
                  </Box>
                )}

                <Box mt={1}>
                  <Button onClick={handleChecklistFilter} color="secondary">
                    {filteredRowsCount} {totalLabel}
                  </Button>
                </Box>
              </Box>
            )}
          </Collapse>
        </>
      );

    case 'templates':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? (
                  <ExpandLessIcon onClick={handleTemplatesAccordion} />
                ) : (
                  <ExpandMoreIcon onClick={handleTemplatesAccordion} />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            {isLoadingTemplate ? (
              <SkeletonLoader />
            ) : (
              <Box>
                {!_.isEmpty(creatives?.templates) ? (
                  creatives?.templates?.map((template, index) => (
                    <Stack key={index} mb={1}>
                      <Card variant="outlined">
                        <Stack p={1}>
                          <Typography
                            fontWeight={700}
                            color={appColors.lightViolet}
                            component={Link}
                            to={{
                              pathname: `https://beta.ad-lib.io/concepts/${dataFields?.concept_id}/templates/${template?.template_id}`,
                            }}
                            target="_blank"
                            sx={{
                              textDecoration: 'none',
                              '&:hover': { color: '#25165B' },
                            }}
                          >
                            {template?.name}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography
                              variant="caption"
                              fontWeight={700}
                              color="secondary"
                            >
                              {template?.size}
                            </Typography>

                            <Stack display="flex">
                              {!_.isEmpty(dataFields['campaign_name']) ? (
                                creatives?.versions
                                  .filter(
                                    (d) =>
                                      d.is_default_version == '1' &&
                                      d.template_id == template?.template_id
                                  )
                                  .map((versionItem, index_) => (
                                    <Typography
                                      key={index_}
                                      variant="caption"
                                      fontWeight={700}
                                      color="secondary"
                                    >
                                      {versionItem.is_approved == true ? (
                                        <CheckCircleIcon
                                          sx={{
                                            position: 'relative',
                                            top: '3px',
                                            right: '4px',
                                            fontSize: '14px',
                                            color: '#4caf50',
                                          }}
                                        />
                                      ) : (
                                        ''
                                      )}

                                      {versionItem.version_name}
                                    </Typography>
                                  ))
                              ) : (
                                <FormControl fullWidth>
                                  <NativeSelect
                                    sx={{
                                      height: '30px',
                                      width: '145px',
                                      padding: '5px 10px',
                                    }}
                                    onChange={(e) =>
                                      handleTemplatesDropdownOnChange(e)
                                    }
                                  >
                                    {creatives?.versions
                                      .filter(
                                        (d) =>
                                          d.template_id == template?.template_id
                                      )
                                      .map((versionItem, index_) => (
                                        <option
                                          selected={versionItem.is_selected}
                                          key={index_}
                                          value={[
                                            versionItem.version_name +
                                              ',' +
                                              versionItem.template_id,
                                          ]}
                                        >
                                          {versionItem.version_name}
                                        </option>
                                      ))}
                                  </NativeSelect>
                                </FormControl>
                              )}
                            </Stack>
                          </Stack>
                        </Stack>
                      </Card>
                    </Stack>
                  ))
                ) : (
                  <Card variant="outlined" sx={{ borderStyle: 'none' }}>
                    <Stack alignItems="center" p={1}>
                      <Box>
                        <IconButton
                          size="large"
                          color="error"
                          disableRipple
                          disableTouchRipple
                          disableFocusRipple
                          sx={{ backgroundColor: '#f2445c1a' }}
                        >
                          <DashboardIcon />
                        </IconButton>
                      </Box>
                      <Box>
                        <Typography fontWeight={700} color="#999999">
                          No templates found.
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                )}
              </Box>
            )}
          </Collapse>
        </>
      );

    case 'revisions':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? (
                  <ExpandLessIcon
                    onClick={(e) => handleRevisionsAccordion(e)}
                  />
                ) : (
                  <ExpandMoreIcon
                    onClick={(e) => handleRevisionsAccordion(e)}
                  />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Revisions
              data={dataFields}
              task_id={dataFields.id}
              revision={data_revision}
            />
          </Collapse>
        </>
      );

    case 'details':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Stack ml={1} spacing={1}>
              {smartly_details.map((detail, index) => (
                <Fragment key={index}>
                  <Grid container sx={{ padding: '0.2em 0' }}>
                    <Grid item xs={4}>
                      <Typography fontWeight={700}>{detail.name}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Stack>
                        {detail.key === 'assets' ? (
                          _.isEmpty(data.assets) ? (
                            <Typography
                              sx={{
                                '& a': { color: '#7e14e6' },
                                marginBottom: '10px',
                              }}
                            >
                              {'Not Set'}
                            </Typography>
                          ) : (
                            (data.assets ?? []).map((i, j) => (
                              <>
                                <Typography
                                  key={j}
                                  sx={{
                                    '& a': { color: '#7e14e6' },
                                    marginBottom: '10px',
                                  }}
                                >
                                  <a
                                    href={`${i.file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {`${i.original_name}` ?? 'Not Set'}
                                  </a>
                                </Typography>
                              </>
                            ))
                          )
                        ) : detail.key === 'gdrive_link' ? (
                          data.gdrive_link === 'Not Set' ? (
                            <Typography
                              sx={{
                                '& a': { color: '#7e14e6' },
                                marginBottom: '10px',
                              }}
                            >
                              {data.gdrive_link}
                            </Typography>
                          ) : (
                            <>
                              <Typography
                                sx={{
                                  '& a': { color: '#7e14e6' },
                                  marginBottom: '10px',
                                }}
                              >
                                <a
                                  href={`${data.gdrive_link}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {data.gdrive_link.length > 40
                                    ? `${data.gdrive_link.substring(0, 40)}...`
                                    : `${data.gdrive_link}`}
                                </a>
                              </Typography>
                            </>
                          )
                        ) : (
                          <Typography
                            sx={{
                              textDecoration: 'none',
                            }}
                          >
                            {`${data[detail.key]}` ?? 'Not Set'}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Fragment>
              ))}
            </Stack>
          </Collapse>
        </>
      );

    case 'formats':
      return (
        <>
          <Stack
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>{name}</Typography>
            </Box>
            <Box
              borderBottom="1px solid #ececec"
              borderColor="#0000000a"
              width="100%"
            ></Box>
            <Box>
              <IconButton onClick={() => setExpand(!expand)}>
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expand}>
            <Stack ml={1} spacing={1}>
              {transformFormats(data.format).map((format, index) => (
                <Grid
                  key={index}
                  container
                  sx={{ padding: '0.2em 0', alignItems: 'center' }}
                >
                  <Grid item xs={5}>
                    <Typography fontWeight={700}>{format.name}</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    {format.sizes.map((size, index) => (
                      <Chip
                        key={index}
                        color="secondary"
                        label={size}
                        size="small"
                        variant="outlined"
                        sx={{
                          marginRight: '0.5em',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </Collapse>
        </>
      );
  }
};

CollapsiblePanels.propTypes = {
  name: PropTypes.string,
  dataFields: PropTypes.any,
  overview: PropTypes.any,
  data: PropTypes.any,
  subtasks: PropTypes.any,
  creatives: PropTypes.any,
  priorityList: PropTypes.any,
  usersList: PropTypes.any,
  statusList: PropTypes.any,
  handleOpen: PropTypes.func,
  onCloseDialog: PropTypes.func,
  onChangeSubtasksAccordion: PropTypes.func,
};

export default CollapsiblePanels;
