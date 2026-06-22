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
import TicketContext from 'pages/Ticket/Context';
// constant
import {
  thread_opts_with_edit_history,
  thread_opts_with_ownership_and_edit_history,
  thread_opts_with_ownership,
} from 'pages/Ticket/constant';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// local component
import CommentHeader from 'pages/Ticket/Components/CommentHeader';
import ThreadInput from '../ThreadInput';
import CommentInput from './CommentInput';
import ThreadComment from './ThreadComment';
// MUI Icons
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import DocumentIcon from '@mui/icons-material/Article';
import OtherFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
// import { getItemByKey } from 'utils/dictionary';
import SkeletonLoader from './Skeleton';
import _ from 'lodash';

const Thread = ({
  thread,
  threadComment,
  commentRelType,
  user,
  ticketId,
  handleThread,
  handleAttachments,
  isCollapseAll,
}) => {
  const {
    overview: { assignees },
  } = useSelector((state) => state.tasks);

  const [collapseComment, setCollapseComment] = useState(isCollapseAll);
  const [collapseThread, setCollapseThread] = useState(!isCollapseAll);
  const [collapseThreadAttachments, setCollapseThreadAttachments] =
    useState(false);
  const firstRender = useRef(false);

  const isUserAdministrator =
    user?.user_role?.toLowerCase() === 'administrator';

  useEffect(() => {
    // Don't mount useStates at 1st render
    if (!firstRender.current) return (firstRender.current = true);

    setCollapseComment(isCollapseAll);
    setCollapseThread(isCollapseAll);
    if (isCollapseAll && _.isEmpty(threadComment) && thread?.reply_count != 0)
      handleThreadReply(thread?.id);
  }, [isCollapseAll]);

  const commentRef = useRef(null);

  const { isEditingThread, selectedThreadId, handleModal, handleThreadReply } =
    useContext(TicketContext);

  const handleCollapseThread = () => {
    setCollapseThread(!collapseThread);
  };

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

  const handleCollapseComment = () => {
    if (
      !collapseComment &&
      _.isEmpty(threadComment) &&
      thread?.reply_count != 0
    )
      handleThreadReply(thread?.id);

    setCollapseComment(!collapseComment);
  };

  useEffect(() => {
    if (collapseComment && _.isEmpty(threadComment) && thread?.reply_count != 0)
      handleThreadReply(thread?.id);
  }, [threadComment, thread]);

  // const isAssignee = !_.isEmpty(
  //   getItemByKey(is_parent ? 'id' : 'user_id', user?.id, assignees)
  // );

  // const isWatcher =
  //   _.filter(watcher ?? [], (w) => w?.user_id === user?.id)?.length > 0;

  const isMyThread = user?.id === parseInt(thread?.user_id);

  const hasEditHistory = !_.isEmpty(thread?.edit_history ?? []);

  const getThreadOptions = () => {
    let options = [];

    if (isMyThread && hasEditHistory) {
      options = thread_opts_with_ownership_and_edit_history;
    } else if (isMyThread) {
      options = thread_opts_with_ownership;
    } else if (hasEditHistory) {
      thread_opts_with_edit_history;
    }

    if (isUserAdministrator) {
      options = _.some(options, { key: 'thread_delete' })
        ? options
        : [
            {
              key: 'thread_delete',
              name: 'Delete thread',
              icon: <DeleteIcon />,
            },
            ...options,
          ];
    }

    return options;
  };

  return (
    <>
      {isEditingThread && thread?.id === selectedThreadId ? (
        <Box my={2} mx={1}>
          <ThreadInput
            user={user}
            commentRelType={commentRelType}
            ticketId={ticketId}
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
              slackName: thread?.slack_username,
              avatar: thread?.avatar,
              id: thread?.user_id,
            }}
            createdDate={dateFormatter(
              _.isEmpty(thread?.date_created?.replace(/-/g, '/'))
                ? thread?.date?.replace(/-/g, '/')
                : thread?.date_created?.replace(/-/g, '/')
            )}
            commentRelType={commentRelType}
            options={getThreadOptions()}
            status={thread?.status}
            taskId={ticketId}
            threadId={thread?.id}
            thread={thread}
            editHistory={thread?.edit_history ?? []}
            isEdited={thread?.is_edited}
            handleCollapseThread={handleCollapseThread}
            collapseThread={collapseThread}
          />
          {/*  Thread Info */}
          <Collapse in={collapseThread}>
            <Box
              className="ck-content"
              px={2}
              pb={2}
              lineHeight="1.2"
              whiteSpace="pre-line"
              sx={{ overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: thread?.thread }}
            />
          </Collapse>

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
            <Divider orientation="vertical" flexItem />
            <Box flex={1}>
              <Button
                sx={{
                  width: '-webkit-fill-available',
                  borderRadius: 0,
                }}
                onClick={handleCollapseComment}
              >
                {`${thread?.reply_count} Comments`}
              </Button>
            </Box>
          </Stack>
          <Divider />

          {/* Comment */}
          <Collapse in={collapseComment}>
            <Box>
              <Stack pt={1}>
                <CommentInput
                  commentRef={commentRef}
                  user={user}
                  commentRelType={commentRelType}
                  taskId={ticketId}
                  threadId={thread?.id}
                  // defaultText={thread?.thread}
                  handleThread={handleThread}
                  isEditing={false}
                />
                <Divider />
              </Stack>
              {thread?.reply_count != 0 ? (
                !_.isEmpty(threadComment) ? (
                  // ? [...threadComment].reverse()?.map((data, index) =>
                  threadComment?.map((data, index) =>
                    isEditingThread && selectedThreadId === data?.id ? (
                      <Box my={2} mx={1} key={index}>
                        <CommentInput
                          user={user}
                          commentRelType={commentRelType}
                          taskId={ticketId}
                          threadId={{
                            threadId: thread?.id,
                            commentId: data?.id,
                          }}
                          threadAttachments={data?.attachment}
                          defaultText={data?.comment}
                          handleThread={handleThread}
                          handleAttachments={handleAttachments}
                          isEditing={true}
                        />
                      </Box>
                    ) : (
                      <ThreadComment
                        key={index}
                        index={index}
                        taskId={ticketId}
                        data={data}
                        user={user}
                        assignees={assignees}
                        isEditingThread={
                          isEditingThread && selectedThreadId === data?.id
                        }
                        handleModal={handleModal}
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
  ticketId: PropTypes.any,
  handleThread: PropTypes.func,
  handleAttachments: PropTypes.func,
  isCollapseAll: PropTypes.any,
};

export default Thread;
