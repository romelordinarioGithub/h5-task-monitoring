import { useState, memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import theme from 'theme';
import { Box, Divider, Stack, Collapse, Typography } from '@mui/material';
// helper
import { dateFormatter, getFileType } from 'pages/Brief/helpers';
// constant
import {
  comment_opts_with_edit_history,
  comment_opts_with_ownership,
  comment_opts_with_ownership_and_edit_history,
  default_thread_comment_opts,
} from 'pages/Brief/constant';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// local component
import CommentHeader from 'pages/Brief/Components/CommentHeader';
// MUI Icons
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import DocumentIcon from '@mui/icons-material/Article';
import OtherFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from 'lodash';

function ThreadComment({
  index,
  user,
  taskId,
  data,
  isThreadEditing,
  handleModal,
  handleOnHoverMention,
}) {
  const [collapseCommentAttachments, setCollapseCommentAttachments] =
    useState(false);

  const isUserAdministrator =
    user?.user_role?.toLowerCase() === 'administrator';

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

  const isMyComment = user?.id === data?.user_id;

  const hasEditHistory = !_.isEmpty(data?.edit_history ?? []);

  const getCommentOptions = () => {
    let options = [];

    if (isMyComment && hasEditHistory) {
      options = comment_opts_with_ownership_and_edit_history;
    } else if (isMyComment) {
      options = comment_opts_with_ownership;
    } else if (hasEditHistory) {
      options = comment_opts_with_edit_history;
    } else {
      options = default_thread_comment_opts;
    }

    if (isUserAdministrator) {
      options = _.some(options, { key: 'comment_delete' })
        ? options
        : [
            {
              key: 'comment_delete',
              name: 'Delete comment',
              icon: <DeleteIcon />,
            },
            ...options,
          ];
    }

    return options;
  };

  const threadContainerRef = useRef(null);

  useEffect(() => {
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
  }, [data]);

  return (
    <Box
      id={data?.id}
      sx={{ backgroundColor: index === 0 ? '#fafaf7' : 'inherit' }}
    >
      <CommentHeader
        type="comment"
        user={{
          name: data?.created_by?.name,
          avatar: data?.created_by?.avatar,
          id: data?.created_by?.user_id,
        }}
        createdDate={dateFormatter(data?.created_at)}
        taskId={taskId}
        parentThreadId={data?.parentThreadId}
        threadId={data?.id}
        options={getCommentOptions()}
        comment={data?.comment}
        editHistory={data?.edit_history ?? []}
        isThreadEditing={isThreadEditing}
        isEdited={data?.is_edited}
      />

      <Box
        ref={threadContainerRef}
        className="ck-content"
        mr={2}
        ml={7}
        mb={2}
        px={2}
        py={1}
        borderRadius="0.5em"
        backgroundColor="#f5f5f5"
        lineHeight="1.2"
        whiteSpace="pre-line"
        sx={{ overflowWrap: 'break-word' }}
        dangerouslySetInnerHTML={{ __html: data?.comment }}
      />

      <Divider />
    </Box>
  );
}

ThreadComment.propTypes = {
  index: PropTypes.any,
  user: PropTypes.any,
  assignees: PropTypes.arrayOf(PropTypes.object),
  taskId: PropTypes.func,
  data: PropTypes.func,
  isThreadEditing: PropTypes.bool,
  handleModal: PropTypes.func,
  handleOnHoverMention: PropTypes.func,
};

export default memo(ThreadComment);
