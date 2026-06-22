import { useState, useEffect, useContext, memo, useRef } from 'react';

import _ from 'lodash';

import Editor from 'components/Common/Editor';

import PropTypes from 'prop-types';

import theme from 'theme';

import {
  Box,
  Stack,
  IconButton,
  Avatar,
  Typography,
  Button,
} from '@mui/material';

import { useFileUpload } from 'use-file-upload';

// MUI icons
import ClearIcon from '@mui/icons-material/Clear';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import DocumentIcon from '@mui/icons-material/Article';
import OtherFileIcon from '@mui/icons-material/InsertDriveFile';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import TaskContext from 'pages/Task/Context';
import GlobalSnackbar from 'components/Common/SnackBar';
import { CircularProgress } from '@material-ui/core';

import { getFileType } from 'pages/Task/helpers';

function CommentInput({
  user,
  users,
  taskId,
  threadId,
  commentRelType,
  threadAttachments,
  defaultText,
  handleThread,
  handleAttachments,
  isEditing,
}) {
  const [commentText, setCommentText] = useState('');

  const { handleModal, setIsEditingThread } = useContext(TaskContext);
  const [editorKey, setEditorKey] = useState(1);
  const editorInstanceRef = useRef(null);
  const editorListenerCleanupRef = useRef(null);

  // Image Uploading
  const [, selectFiles] = useFileUpload();
  const [attachments, setAttachments] = useState(threadAttachments ?? []);
  const [errorMsg, setErrorMsg] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const stripHtml = (html) =>
    String(html || '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;|\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  useEffect(() => {
    for (const a of attachments) {
      if (a.size >= 104857600) {
        setErrorMsg(a);
        setAttachments([
          ...attachments.filter((data) => data.source != a.source),
        ]);
        setIsOpen(true);
      }
    }
  }, [attachments]);

  const handleClose = () => {
    setIsOpen(false);
  };

  // const editorRef = useRef(null);

  useEffect(() => {
    setCommentText(defaultText);
    setHasContent(stripHtml(defaultText).length > 0);
  }, [defaultText]);

  useEffect(
    () => () => {
      if (editorListenerCleanupRef.current) {
        editorListenerCleanupRef.current();
        editorListenerCleanupRef.current = null;
      }
    },
    []
  );

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

  const handleDeleteAttachment = (attachment) => {
    if (attachment.id) {
      // Component is in edit mode
      setAttachments([...attachments.filter((a) => a.id != attachment.id)]);
    } else {
      setAttachments([
        ...attachments.filter((a) => a.source != attachment.source),
      ]);
    }

    handleAttachments(attachment);
  };

  const handleOnClickSave = async () => {
    const editorData = editorInstanceRef.current?.getData?.() ?? '';

    setIsSaving(true);
    await handleThread(
      taskId,
      commentRelType,
      editorData,
      threadId,
      attachments
    );
    // Set back to default
    setIsSaving(false);
    setCommentText('');
    setHasContent(false);
    setAttachments([]);
    // Clears editor
    setEditorKey((prev) => prev * 2);

  };

  const handleTaskCancelThread = () => {
    setIsEditingThread(false);
  };

  return (
    <Stack
      sx={{ padding: '0.5em 0.5em' }}
      direction="row"
      spacing={1}
      alignItems="flex-start"
    >
      <Box sx={{ margin: '0.2em 0' }}>
        {!_.isEmpty(user?.profile_picture) &&
          user?.profile_picture?.split('/').pop() !== 'thumb_' ? (
          <Avatar
            sx={{ width: 30, height: 30 }}
            alt={user?.fullname}
            src={user?.profile_picture}
          />
        ) : (
          <Avatar
            sx={{
              border: '2px solid #25165b',
            }}
          >
            {`${user?.fullname.split(' ')[0][0]}${!_.isEmpty(user?.fullname.split(' ')[1][0])
              ? user?.fullname.split(' ')[1][0]
              : ''
              }`}
          </Avatar>
        )}
      </Box>
      <Box width="565px">
        <Editor
          key={editorKey}
          initValue={commentText}
          onInit={(editor) => {
            editorInstanceRef.current = editor;
            if (editorListenerCleanupRef.current) {
              editorListenerCleanupRef.current();
            }

            // Track editor text changes so we can toggle the Save button without lifting state via onChange.
            const handleEditorChange = () => {
              setHasContent(stripHtml(editor.getData()).length > 0 || editor.getData().includes("<img"));
            };

            editor.model.document.on('change:data', handleEditorChange);
            editorListenerCleanupRef.current = () => {
              editor.model.document.off('change:data', handleEditorChange);
            };

            handleEditorChange();
          }}
          height={130}
          placeholder="Write a comment..."
          users={users}
          isDisabled={isSaving}
          isUserMentionEnable={true}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Stack direction="row" justifyContent="start" spacing={0.5} mt={1}>
            <Typography variant="h7" fontWeight={700} color="primary">
              Attachments
            </Typography>
            <IconButton
              color="secondary"
              variant="text"
              sx={{ fontSize: '1.2em' }}
              disabled={isSaving}
              onClick={() => {
                selectFiles({ multiple: true }, (files) =>
                  setAttachments([
                    ...attachments,
                    ...files.map((f) => ({
                      ...f,
                      is_new: true,
                    })),
                  ])
                );
              }}
            >
              <FileUploadIcon />
            </IconButton>
            <GlobalSnackbar
              isOpen={isOpen}
              onClose={handleClose}
              anchor={{ vertical: 'top', horizontal: 'center' }}
              alertType="error"
              alertContent={`File ${errorMsg.name} was rejected. File is ${(
                errorMsg.size / 1048576
              ).toFixed(2)} MB. Size limit is 100 MB.`}
            />
          </Stack>
          <Stack spacing={1} direction="row">
            {isEditing && (
              <Button
                variant="outlined"
                sx={{
                  fontSize: '0.8em',
                  fontWeight: 600,
                  width: '90px',
                }}
                disabled={isSaving}
                onClick={handleTaskCancelThread}
              >
                {'Cancel'}
              </Button>
            )}
            <Button
              variant="contained"
              sx={{
                fontSize: '0.8em',
                fontWeight: 600,
                width: '90px',
              }}
              disabled={isSaving || !hasContent}
              onClick={handleOnClickSave}
            >
              {isSaving ? (
                <CircularProgress color="white" size={20} />
              ) : isEditing ? (
                'Save'
              ) : (
                'Create'
              )}
            </Button>
          </Stack>
        </Stack>
        {!_.isEmpty(attachments) ? (
          <Stack>
            {attachments.map((attachment, index) => (
              <Stack
                key={index}
                spacing={1}
                direction="row"
                alignItems="center"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    textDecoration: 'underline',
                  },
                  '&:hover .remove-button': {
                    display: 'inherit',
                  },
                }}
              >
                {renderIcon(attachment.name ?? attachment.file_name)}
                <Typography
                  variant="p"
                  sx={{
                    fontSize: '0.85em',
                  }}
                  onClick={() => {
                    if (
                      getFileType(attachment.name ?? attachment.file_name) ===
                      'image'
                    ) {
                      handleModal(
                        'attachment_preview',
                        true,
                        attachment.source ?? attachment.file_path
                      );
                    } else {
                      window.open(
                        attachment.source ?? attachment.file_path,
                        '_blank'
                      );
                    }
                  }}
                >
                  {attachment.name ?? attachment.file_name}
                </Typography>
                <IconButton
                  ml={2}
                  className="remove-button"
                  aria-label="remove"
                  onClick={() => handleDeleteAttachment(attachment)}
                  sx={{ display: 'none' }}
                >
                  <ClearIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography
            variant="span"
            sx={{ color: '#a8a8a8', fontWeight: 400, fontSize: '0.8em' }}
          >
            No files attached
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

CommentInput.propTypes = {
  user: PropTypes.object.isRequired,
  users: PropTypes.any.isRequired,
  commentRelType: PropTypes.string,
  taskId: PropTypes.any,
  threadId: PropTypes.any,
  defaultText: PropTypes.any,
  commentRef: PropTypes.any,
  threadAttachments: PropTypes.any,
  isEditing: PropTypes.any,
  handleThread: PropTypes.func,
  handleAttachments: PropTypes.func,
};

export default memo(CommentInput);
