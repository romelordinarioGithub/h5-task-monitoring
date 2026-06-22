import { useContext } from 'react';
import { useSelector } from 'react-redux';
// Context
import BriefContext from 'pages/Brief/Context';
import { Stack } from '@mui/material';
// local component
import CommentPanel from 'pages/Brief/Components/CommentPanel';
import _ from 'lodash';

export default function Update() {
  const { isTask, handleOnSaveThread, handleAttachments, handleOnPaginate } =
    useContext(BriefContext);
  // Redux State
  const {
    overview: { id: briefId, task_type },
    threads,
  } = useSelector((state) => state.briefs);

  const { data: userData } = useSelector((state) => state.user);

  return (
    <Stack>
      {/* {((is_migrated && !_.isEmpty(description)) ||
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
      )} */}
      {/* Threads */}
      <>
        {!_.isEmpty(threads) ? (
          <CommentPanel
            user={userData}
            taskId={briefId}
            section={task_type}
            comment={threads?.data?.slice()?.reverse() ?? []}
            commentRelType={'task'}
            threadRelType={'parent_task'}
            handleAttachments={handleAttachments}
            isCollapseEnabled={true}
            hasNextPage={
              !_.isNull(threads?.next_page_url) &&
              !_.isEmpty(threads?.data ?? [])
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
            // onPaginate={() => handleOnPaginate('parent_task')}
          />
        ) : null}
      </>
    </Stack>
  );
}
