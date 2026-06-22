import { useState, useRef, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import theme from 'theme';
import {
  Box,
  Card,
  Divider,
  Stack,
  Button,
  Avatar,
  Tooltip,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
// helper
import { dateFormatter, getFileType } from 'pages/Task/helpers';
import TaskContext from 'pages/Task/Context';
// constant
import {
  thread_opts_with_edit_history,
  thread_opts_for_assigned_teams,
  thread_opts_for_assigned_teams_with_edit_history,
  thread_opts_for_assigned_teams_with_ownership,
  thread_opts_for_assigned_teams_with_ownership_and_edit_history,
  thread_opts_with_ownership_and_edit_history,
  thread_opts_with_ownership,
  default_thread_comment_opts,
} from 'pages/Task/constant';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// local component
import CommentHeader from 'pages/Task/Components/CommentHeader';
import ThreadInput from '../ThreadInput';
import CommentInput from './CommentInput';
import ThreadComment from './ThreadComment';
// MUI Icons
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import DocumentIcon from '@mui/icons-material/Article';
import OtherFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { getItemByKey } from 'utils/dictionary';
import SkeletonLoader from './Skeleton';
import _ from 'lodash';

const Thread = ({
  user,
  taskId,
  thread,
  threadComment,
  threadRelType,
  commentRelType,
  handleThread,
  handleAttachments,
}) => {
  const {
    overview: { assignees, watcher, is_parent, task_type_id, team },
  } = useSelector((state) => state.tasks);

  const [collapseComment, setCollapseComment] = useState(false);
  const [collapseThreadAttachments, setCollapseThreadAttachments] =
    useState(false);

  const threadContainerRef = useRef(null);
  const commentRef = useRef(null);

  const {
    isEditingThread,
    selectedThreadId,
    usersList,
    handleModal,
    handleThreadReply,
    handleOnHoverMention,
  } = useContext(TaskContext);

  const renderIcon = (fileName) => {
    if (getFileType(fileName) === 'image') {
      return <ImageIcon color="secondary" sx={{ marginTop: '2px' }} />;
    } else if (getFileType(fileName) === 'document') {
      return <DocumentIcon color="secondary" sx={{ marginTop: '2px' }} />;
    } else if (getFileType(fileName) === 'video') {
      return <VideoFileIcon color="secondary" sx={{ marginTop: '2px' }} />;
    } else {
      return <OtherFileIcon color="secondary" sx={{ marginTop: '2px' }} />;
    }
  };

  const handleFocusCommentReply = () => {
    // if (!collapseComment) {
    //   setCollapseComment(true);
    //   setTimeout(() => {
    //     commentRef.current.focus();
    //     clearTimeout();
    //   }, 500);
    // } else {
    //   commentRef.current.focus();
    // }
    if (!collapseComment && _.isEmpty(threadComment))
      handleThreadReply(threadRelType, thread?.id, taskId);

    setCollapseComment(!collapseComment); // Temporary
  };

  const handleCollapseComment = () => {
    if (!collapseComment && _.isEmpty(threadComment))
      handleThreadReply(threadRelType, thread?.id, taskId);

    setCollapseComment(!collapseComment);
  };

  useEffect(() => {
    if (collapseComment && _.isEmpty(threadComment) && thread?.reply_count != 0)
      handleThreadReply(threadRelType, thread?.id, taskId);

    const threadContainer = threadContainerRef.current;
    if (!threadContainer) return;

    const handleMouseOver = (e) => {
      const mentionEl = e.target.closest('.mention');
      if (mentionEl && threadContainer.contains(mentionEl)) {
        const id = mentionEl.getAttribute('data-mention');
        handleOnHoverMention(mentionEl, id);
      }
    };

    const handleMouseOut = (e) => {
      // Hide popper when not hovering mention or popper itself
      if (!e.relatedTarget || !e.relatedTarget.closest('#mention-popper')) {
        handleOnHoverMention(null);
      }
    };

    threadContainer.addEventListener('mouseover', handleMouseOver);
    threadContainer.addEventListener('mouseout', handleMouseOut);

    return () => {
      threadContainer.removeEventListener('mouseover', handleMouseOver);
      threadContainer.removeEventListener('mouseout', handleMouseOut);
    };
  }, [threadComment, thread, usersList]);

  const isAssignee = !_.isEmpty(
    getItemByKey(is_parent ? 'id' : 'user_id', user?.id, assignees)
  );

  const isWatcher =
    _.filter(watcher ?? [], (w) => w?.user_id === user?.id)?.length > 0;

  const isMyThread = user?.id === thread?.user_id;

  const isUserQa = user?.team_name?.toLowerCase() === 'qa';

  const isUserDesigner = user?.team_name?.toLowerCase() === 'design';

  const isUserSmart = user?.team_name?.toLowerCase() === 'smart services';

  const isUserAdministrator =
    user?.user_role?.toLowerCase() === 'administrator';

  // const isUserSmartServices = user?.team_id === 23;

  //const isSmartServicesTask = team?.id === 23;

  const isDesignQaTask = `${task_type_id}` === '12';

  const isPhase1QaTask = `${task_type_id}` === '684';

  const isQaTask = team?.name?.toLowerCase() === 'qa';

  const hasEditHistory = !_.isEmpty(thread?.edit_history ?? []);

  const getBaseThreadOptions = () => {
    if (isMyThread && hasEditHistory) {
      return thread_opts_with_ownership_and_edit_history;
    }

    if (isMyThread) {
      return thread_opts_with_ownership;
    }

    if (hasEditHistory) {
      return thread_opts_with_edit_history;
    }

    return default_thread_comment_opts;
  };

  const getTeamSpecificThreadOptions = () => {
    if (isMyThread && hasEditHistory) {
      return thread_opts_for_assigned_teams_with_ownership_and_edit_history;
    }

    if (isMyThread) {
      return thread_opts_for_assigned_teams_with_ownership;
    }

    if (hasEditHistory) {
      return thread_opts_for_assigned_teams_with_edit_history;
    }

    return thread_opts_for_assigned_teams;
  };

  const getThreadOptions = (hasRevisionResult) => {
    // For QA, Design team
    if (
      (isUserDesigner && isDesignQaTask) ||
      (isUserQa && isQaTask) ||
      ((isUserSmart || isUserQa) && isPhase1QaTask)
    ) {
      return getTeamSpecificThreadOptions();
    }

    // For admin
    if (isUserAdministrator) {
      let options = getBaseThreadOptions();

      if (!_.some(options, { key: 'thread_delete' }) && !hasRevisionResult) {
        options = [
          {
            key: 'thread_delete',
            name: 'Delete thread',
            icon: <DeleteIcon />,
          },
          ...options,
        ];
      }

      return options;
    }

    // Everyone else
    return getBaseThreadOptions();
  };

  return (
    <>
      {isEditingThread && thread?.id === selectedThreadId ? (
        <Box my={2} mx={1}>
          <ThreadInput
            user={user}
            commentRelType={commentRelType}
            taskId={taskId}
            threadId={thread?.id}
            threadAttachments={thread?.attachment}
            defaultText={thread?.thread}
            handleThread={handleThread}
            handleAttachments={handleAttachments}
            isEditing={isEditingThread}
          />
        </Box>
      ) : (
        <Card
          id={thread?.id}
          key={thread?.id}
          variant="outlined"
          sx={{
            margin: '0.75em',
            borderColor: '#ede9fe',
            borderRadius: '14px',
            boxShadow: '0 8px 20px rgba(38, 31, 77, 0.05)',
            overflow: 'hidden',
          }}
        >
          <CommentHeader
            user={{
              name: thread?.username,
              avatar: thread?.avatar,
              id: thread?.user_id,
              slackName: thread?.slack_username,
            }}
            createdDate={dateFormatter(
              _.isEmpty(thread?.date_created?.replace(/-/g, '/'))
                ? thread?.date?.replace(/-/g, '/')
                : thread?.date_created?.replace(/-/g, '/')
            )}
            commentRelType={commentRelType}
            options={getThreadOptions(!_.isNull(thread?.status?.status))}
            status={thread?.status}
            taskId={taskId}
            threadId={thread?.id}
            thread={thread}
            editHistory={thread?.edit_history ?? []}
            isEdited={thread?.is_edited}
          />

          {/*  Thread Info */}
          <Box
            px={2}
            pb={2}
            ref={threadContainerRef}
            className="ck-content"
            lineHeight="1.2"
            whiteSpace="pre-line"
            dangerouslySetInnerHTML={{ __html: thread?.thread }}
            sx={{ overflowWrap: 'break-word' }}
          />

          {/* Thread Attachments */}
          {!_.isEmpty(thread?.attachment) && (
            <Box px={2} mb={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AttachFileIcon color="secondary" />
                <Typography
                  color="secondary"
                  variant="body2"
                  onClick={() =>
                    setCollapseThreadAttachments(!collapseThreadAttachments)
                  }
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      // color: theme.palette.secondary.main,
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Attachments
                </Typography>
              </Stack>
              <Collapse in={collapseThreadAttachments}>
                <Stack mt={1}>
                  {thread?.attachment?.map((attachment, index) => (
                    <Stack
                      key={index}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          color: theme.palette.secondary.main,
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      <Stack
                        key={index}
                        spacing={1}
                        direction="row"
                        alignItems="center"
                      >
                        {renderIcon(attachment.file_name)}
                        <Typography
                          variant="p"
                          sx={{
                            fontSize: '0.85em',
                          }}
                          onClick={() => {
                            if (getFileType(attachment.file_name) === 'image') {
                              handleModal(
                                'attachment_preview',
                                true,
                                attachment.file_path
                              );
                            } else {
                              window.open(attachment.file_path, '_blank');
                            }
                          }}
                        >
                          {attachment.file_name}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          )}

          {!_.isEmpty(thread?.status?.voters) && (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                p={1}
                alignItems="center"
              >
                <Stack direction="row" alignItems="center">
                  <Tooltip title="Report Summary" arrow>
                    <IconButton
                      color="secondary"
                      size="small"
                      onClick={() =>
                        handleModal(
                          'response_summary',
                          true,
                          thread?.status?.voters ?? []
                        )
                      }
                    >
                      <AssessmentOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    Revision rounds: {thread?.revision_rounds}
                  </Typography>
                </Stack>

                {/* Approve Assigned Thread */}
                <Stack direction="Row" justifyContent="flex-end">
                  {thread?.status?.voters.map((voter, index) => (
                    <Tooltip title={voter?.user_name ?? ''} key={index} arrow>
                      <Avatar
                        sx={{
                          width: 15,
                          height: 15,
                          border: '2px solid',
                          borderColor:
                            voter.status?.toLowerCase() === 'rejected'
                              ? '#ff4a4a'
                              : '#1ABC00',
                          marginRight: 0.1,
                          fontSize: '9px',
                          textTransform: 'capitalize',
                        }}
                        alt={voter?.user_name}
                        src={voter?.avatar}
                      />
                    </Tooltip>
                  ))}
                </Stack>
              </Stack>
            </>
          )}

          <Divider />
          <Stack direction="row" justifyContent="space-between">
            {(isAssignee || isWatcher) && user?.team_id !== 11 && (
              <Box flex={1}>
                <Button
                  sx={{
                    width: '-webkit-fill-available',
                    borderRadius: 0,
                  }}
                  onClick={handleFocusCommentReply}
                >
                  Reply
                </Button>
              </Box>
            )}
            <Divider orientation="vertical" flexItem />
            <Box flex={1}>
              <Button
                id={`comment-trigger-${thread?.id}`}
                sx={{
                  width: '-webkit-fill-available',
                  borderRadius: 0,
                }}
                onClick={handleCollapseComment}
              >
                {/* {`${
                  !_.isUndefined(thread?.comment?.length)
                    ? thread?.comment?.length
                    : 0
                } Comments`} */}
                {`${thread?.reply_count} Comments`}
              </Button>
            </Box>
          </Stack>
          <Divider />

          {/* Comment */}
          <Collapse in={collapseComment}>
            <Box>
              {(isAssignee || isWatcher || user?.team_id == 11) && (
                <Stack pt={1}>
                  <CommentInput
                    commentRef={commentRef}
                    user={user}
                    commentRelType={commentRelType}
                    taskId={taskId}
                    threadId={thread?.id}
                    // defaultText={thread?.thread}
                    handleThread={handleThread}
                    isEditing={false}
                    users={usersList?.map((user) => ({
                      id: `@${user.id}`,
                      text: `@${user.fullname}`,
                      fullname: user.fullname,
                      profile_picture: user.profile_picture,
                      team_name: user.team_name,
                      email: user.email,
                    }))}
                  />
                  <Divider />
                </Stack>
              )}
              {thread?.reply_count != 0 ? (
                !_.isEmpty(threadComment) ? (
                  // ? [...threadComment].reverse()?.map((data, index) =>
                  threadComment?.map((data, index) =>
                    isEditingThread && selectedThreadId === data?.id ? (
                      <Box my={2} mx={1} key={index}>
                        <CommentInput
                          user={user}
                          commentRelType={commentRelType}
                          taskId={taskId}
                          threadId={{
                            threadId: thread?.id,
                            commentId: data?.id,
                          }}
                          threadAttachments={data?.attachment}
                          defaultText={data?.comment}
                          handleThread={handleThread}
                          handleAttachments={handleAttachments}
                          isEditing={true}
                          users={usersList?.map((user) => ({
                            id: `@${user.id}`,
                            text: `@${user.fullname}`,
                            fullname: user.fullname,
                            profile_picture: user.profile_picture,
                            team_name: user.team_name,
                            email: user.email,
                          }))}
                        />
                      </Box>
                    ) : (
                      <ThreadComment
                        key={index}
                        index={index}
                        taskId={taskId}
                        data={{ parentThreadId: thread?.id, ...data }}
                        user={user}
                        assignees={assignees}
                        isEditingThread={
                          isEditingThread && selectedThreadId === data?.id
                        }
                        handleModal={handleModal}
                        handleOnHoverMention={handleOnHoverMention}
                      />
                    )
                  )
                ) : (
                  <SkeletonLoader count={thread?.reply_count} />
                )
              ) : null}
            </Box>
          </Collapse>
        </Card>
      )}
    </>
  );
};

Thread.propTypes = {
  thread: PropTypes.any,
  threadComment: PropTypes.any,
  commentRelType: PropTypes.any,
  threadRelType: PropTypes.any,
  user: PropTypes.any,
  taskId: PropTypes.any,
  handleThread: PropTypes.func,
  handleAttachments: PropTypes.func,
};

export default Thread;
