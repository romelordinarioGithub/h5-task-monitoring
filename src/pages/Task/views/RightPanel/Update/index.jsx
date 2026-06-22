import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
// Context
import TaskContext from 'pages/Task/Context';
import { Card, Stack, Box, Alert, Collapse, Button } from '@mui/material';
// local component
import CommentPanel from 'pages/Task/Components/CommentPanel';
import _ from 'lodash';

export default function Update() {
  const { isTask, handleOnSaveThread, handleAttachments, handleOnPaginate } =
    useContext(TaskContext);
  const [checked, setChecked] = useState(false);
  // Redux State
  const {
    overview: {
      name,
      additional_info,
      id: taskId,
      task_type,
      rel_type,
      is_migrated,
      description,
      build_instuction,
      check_list,
      team,
      task_type_id,
    },
    threads,
  } = useSelector((state) => state.tasks);

  const { data: userData } = useSelector((state) => state.user);

  const isSmartlyTask = [15, 16].includes(team?.id);

  const isConceptDesignTask = task_type_id === 9;

  return (
    !_.isUndefined(rel_type) && (
      <Stack>
        {((is_migrated && !_.isEmpty(description)) ||
          (isSmartlyTask && !_.isEmpty(build_instuction)) ||
          (!is_migrated &&
            !isSmartlyTask &&
            isConceptDesignTask &&
            !_.isEmpty(additional_info))) && (
          <>
            <Box sx={{ display: 'flex' }}>
              <Alert
                severity="info"
                sx={{ width: '100%' }}
                action={
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    sx={{ textTransform: 'capitalize' }}
                    onClick={(e) => {
                      e.preventDefault();
                      setChecked(!checked);
                    }}
                  >
                    {checked ? `Hide` : `View`} Description
                  </Button>
                }
              >
                {isSmartlyTask
                  ? 'Click to show build instruction.'
                  : is_migrated
                  ? 'This task is migrated with description.'
                  : 'Click to show additional info.'}
              </Alert>
            </Box>
            <Collapse in={checked}>
              <Card
                sx={{
                  padding: '1.5em',
                  overflowX: 'auto',
                  backgroundColor: '#4099ff0f',
                  marginTop: '10px',
                }}
                variant="outlined"
              >
                <Box
                  className="ck-content"
                  lineHeight="normal"
                  whiteSpace="pre-line"
                  dangerouslySetInnerHTML={{
                    __html: isSmartlyTask
                      ? build_instuction
                      : is_migrated
                      ? description
                      : additional_info,
                  }}
                ></Box>
                {!_.isNull(check_list) && !_.isEmpty(check_list) && (
                  <Box
                    sx={{
                      mt: 2,
                      width: '100%',
                      padding: '10px 12px 10px 12px',
                      fontSize: '0.68em',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      color: '#014361',
                      backgroundColor: '#ebf9ff',
                      border: '1px solid #d7eef7',
                      borderRadius: 1,
                    }}
                  >
                    <b>Assets: </b>
                    {check_list.join(', ')}
                  </Box>
                )}
              </Card>
            </Collapse>
          </>
        )}
        {/* Threads */}
        {isTask ? (
          <>
            {!_.isEmpty(threads) ? (
              <CommentPanel
                user={userData}
                taskId={taskId}
                section={task_type}
                comment={threads?.task?.data ?? []}
                commentRelType={'task'}
                threadRelType={'parent_task'}
                handleAttachments={handleAttachments}
                isCollapseEnabled={true}
                hasNextPage={
                  !_.isNull(threads?.task?.next_page_url) &&
                  !_.isEmpty(threads?.task?.data ?? [])
                }
                onSave={(relId, relType, comment, id, attachments) =>
                  handleOnSaveThread(
                    relId,
                    relType,
                    comment,
                    id,
                    attachments,
                    'parent_task'
                  )
                }
                onPaginate={() => handleOnPaginate('parent_task')}
              />
            ) : null}
            {!_.isEmpty(threads) && !_.isEmpty(threads?.subtask)
              ? threads?.subtask?.map((subtask) => (
                  <CommentPanel
                    key={subtask.data.id}
                    user={userData}
                    taskId={subtask.data.id}
                    section={subtask.data.name}
                    comment={subtask.data.list}
                    commentRelType={'subtask'}
                    threadRelType={'parent_task_subtask'}
                    handleAttachments={handleAttachments}
                    isCollapseEnabled={true}
                    hasNextPage={
                      !_.isNull(subtask?.next_page_url) &&
                      !_.isEmpty(subtask.data.list ?? [])
                    }
                    onSave={(relId, relType, comment, id, attachments) =>
                      handleOnSaveThread(
                        relId,
                        relType,
                        comment,
                        id,
                        attachments,
                        'parent_task_subtask',
                        subtask.data
                      )
                    }
                    onPaginate={() =>
                      handleOnPaginate('parent_task_subtask', subtask.data)
                    }
                  />
                ))
              : null}
          </>
        ) : (
          <CommentPanel
            user={userData}
            taskId={taskId}
            section={name}
            comment={threads?.subtask?.data ?? []}
            commentRelType={'subtask'}
            threadRelType={'subtask'}
            handleAttachments={handleAttachments}
            isCollapseEnabled={false}
            hasNextPage={
              !_.isNull(threads?.subtask?.next_page_url) &&
              !_.isEmpty(threads?.subtask?.data ?? [])
            }
            onSave={(relId, relType, comment, id, attachments) =>
              handleOnSaveThread(
                relId,
                relType,
                comment,
                id,
                attachments,
                'subtask'
              )
            }
            onPaginate={() => handleOnPaginate('subtask')}
          />
          // ))
        )}
      </Stack>
    )
  );
}
