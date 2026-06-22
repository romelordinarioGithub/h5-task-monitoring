import React, { Fragment, useContext } from 'react';

import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';

//Reducer
import { getValidate } from 'store/reducers/manualTaskCreation';

// Context
import TaskCreationContext from 'components/TaskCreation/Context';

// MUI Components
import { Box, Typography, styled, Stack, TextField } from '@mui/material';

// Custom Component
// import TaskInput from 'components/TaskCreation/Components/TaskInput';
import InfiniteAutoComplete from 'components/Common/InfiniteAutoComplete';

// Loader
// import SkeletonLoader from 'components/TaskCreation/Components/Skeleton';

// bg
// import cover from 'assets/smartly/ad-weave-patern.svg';

const StyledTypography = styled(Typography)`
  background-image: linear-gradient(90deg, #e0238c, #f22076 47.43%, #f96666);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    height: auto !important;
    border-radius: 0.8em;
    fontsize: '1rem';
    height: '48px';
  }
`;

const TaskConfiguration = () => {
  const {
    team,
    setTeam,
    taskType,
    setTaskType,
    taskName,
    setTaskName,
    subTask,
    setSubTask,
    concept,
    partner,
    campaign,
    channel,
    validateSubTask,
    validateTaskType,
    setValidateTaskType,
    setValidateSubTask,
    loading,
    handleOnOpen,
  } = useContext(TaskCreationContext);

  const dispatch = useDispatch();

  const {
    data: { teamList, taskTypeList, subTaskList, validate },
  } = useSelector((state) => state.manualTaskCreation);

  // useEffect(() => {
  //   dispatch(getData('get_teams'));
  //   dispatch(getData('get_active_task_type'));
  //   dispatch(getData('get_active_task_category'));
  //   dispatch(getValidate(`task_type`))
  // }, []);

  const onInputChange = (e, v, name) => {
    setValidateTaskType(null);
    setValidateSubTask(null);
    switch (name.toLowerCase().replace(/ /g, '_')) {
      case 'team':
        setTaskType('');
        setSubTask('');
        _.isNull(v)
          ? setTeam(null)
          : setTeam(
              _.pickBy(v, (value, key) => key === 'name' || key === 'id')
            );
        break;
      case 'task_type':
        setSubTask('');
        if (_.isNull(v)) {
          setTaskType(null);
        } else {
          setTaskType(
            _.pickBy(v, (value, key) => key === 'name' || key === 'id')
          );

          dispatch(
            getValidate(`task_type`, {
              conceptId: concept?.id,
              campaignId: campaign?.uuid,
              channelId: channel?.id,
              taskType: v?.id,
            })
          );

          setTeam({
            id: v.team_id,
            name: v.team_name,
          });
        }

        break;
      case 'sub_task':
        if (_.isNull(v)) {
          setSubTask(null);
        } else {
          setSubTask(
            _.pickBy(v, (value, key) => key === 'name' || key === 'id')
          );
          dispatch(
            getValidate(`sub_type`, {
              conceptId: concept && concept !== '' ? concept.id : null,
              taskType: taskType && taskType !== '' ? taskType.id : null,
              channelId: channel?.id,
              CategoryId: v?.id,
            })
          );

          setTaskType({
            id: v.task_type_id,
            name: v.task_type_name,
          });
          setTeam({
            id: v.team_id,
            name: v.team_name,
          });
        }

        break;
    }
  };

  // TODO: To be removed later. This is for debugging purposes only.
  // useEffect(() => {
  //   if (_.isEmpty(team)) {
  //     console.log(
  //       'task type list for empty team: ',
  //       _.filter(
  //         _.sortBy(taskTypeList, (s) => s.name),
  //         (t) => [3, 4, 5, 6, 8].includes(t.team_id)
  //       )
  //     );
  //     console.log(
  //       'sorted: ',
  //       _.sortBy(taskTypeList, (s) => s.name)
  //     );
  //   } else {
  //     console.log(
  //       'task type list if has team: ',
  //       _.sortBy(taskTypeList, (s) => s.name).filter(
  //         (i) => i.team_id === team.id
  //       )
  //     );
  //   }
  // }, [team, taskTypeList]);

  const onClose = (name) => {
    switch (name) {
      case 'task_type':
        setValidateTaskType(validate);
        break;
      case 'sub_task':
        setValidateSubTask(validate);
        break;
    }
  };

  return (
    <Fragment>
      {/*
      <Box
        backgroundColor="#25175a"
        color="#fff"
        padding="100px 76px 8px"
        sx={{
          backgroundImage: `url(${cover})`,
          backgroundSize: 'cover',
        }}
      >
        <Stack direction="row">
          <Typography variant="h4" fontWeight={800}>
            Create new &nbsp;
          </Typography>
          <StyledTypography variant="h4" fontWeight={800}>
            Task
          </StyledTypography>
        </Stack>
      </Box>
      */}
      {/* {!fetching &&
      !_.isEmpty(teamList) &&
      !_.isEmpty(taskTypeList) &&
      !_.isEmpty(subTaskList) ? ( */}
      <Box padding="45px 60px">
        <Stack direction="row">
          <Typography variant="h4" fontWeight={800}>
            Create new Task
          </Typography>
          <StyledTypography variant="h4" fontWeight={800}></StyledTypography>
        </Stack>
        <Box mb={4}>
          <Typography>Please fill the required fields below.</Typography>
        </Box>
        {(_.isEqual(partner?.name?.toLowerCase(), 'uncategorized') ||
          _.isEqual(campaign?.name?.toLowerCase(), 'uncategorized') ||
          _.isEqual(channel?.name?.toLowerCase(), 'uncategorized')) && (
          <Box mb={6}>
            <StyledTextField
              label="Task Name"
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              inputProps={{ maxLength: 75 }}
            />
          </Box>
        )}
        <InfiniteAutoComplete
          data={_.filter(
            _.sortBy(teamList, (s) => s.name),
            (t) => [3, 4, 5, 6, 8, 14, 19, 23].includes(t.id)
          )}
          name="Team"
          defaultValue={team}
          description="Selected team will be assigned by this task."
          isRequired={true}
          // isDisabled={_.isEmpty(teamList)}
          onInputChange={onInputChange}
          onOpen={handleOnOpen('team')}
          isLoading={loading.isTeam}
        />
        <InfiniteAutoComplete
          data={
            _.isEmpty(team)
              ? _.filter(
                  _.sortBy(taskTypeList, (s) => s.name),
                  (t) => [3, 4, 5, 6, 8, 14, 19, 23].includes(t.team_id)
                )
              : _.sortBy(taskTypeList, (s) => s.name).filter(
                  (i) => i.team_id === team.id
                )
          }
          name="Task Type"
          defaultValue={taskType}
          isDisabled={
            // _.isEmpty(taskTypeList) ||
            Boolean(_.isEmpty(team) || _.isUndefined(team))
          }
          isRequired={true}
          validation={validateTaskType}
          onInputChange={onInputChange}
          onOpen={handleOnOpen('task_type')}
          isLoading={loading.isTaskType}
          onClose={onClose('task_type')}
        />
        <InfiniteAutoComplete
          data={
            _.isEmpty(taskType)
              ? _.filter(
                  _.sortBy(subTaskList, (s) => s.name),
                  (t) => [3, 4, 5, 6, 8, 14, 19, 23].includes(t.team_id)
                )
              : _.sortBy(subTaskList, (s) => s.name).filter(
                  (i) => i.task_type_id === taskType.id
                )
          }
          name="Sub Task"
          defaultValue={subTask}
          isDisabled={
            // _.isEmpty(subTaskList) ||
            Boolean(
              _.isEmpty(taskType) ||
                _.isUndefined(taskType) ||
                _.isEmpty(team) ||
                _.isUndefined(team) ||
                !validateTaskType
            )
          }
          description="Task Category is now deprecated."
          isRequired={false}
          validation={validateSubTask}
          onInputChange={onInputChange}
          onOpen={handleOnOpen('sub_task')}
          onClose={onClose('sub_task')}
          isLoading={loading.isSubTask}
        />
      </Box>
      {/* ) : (
        <SkeletonLoader />
      )} */}
    </Fragment>
  );
};

export default TaskConfiguration;
