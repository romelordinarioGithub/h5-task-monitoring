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

import BriefContext from 'pages/Brief/Context';
import GlobalSnackbar from 'components/Common/SnackBar';
import { CircularProgress } from '@material-ui/core';

import { getFileType } from 'pages/Brief/helpers';

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

  const { handleModal, setIsEditingThread } = useContext(BriefContext);
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
            {`${user?.fullname.split(' ')[0][0]}${
              !_.isEmpty(user?.fullname.split(' ')[1][0])
                ? user?.fullname.split(' ')[1][0]
                : ''
            }`}
          </Avatar>
        )}
      </Box>
      <Box width="100%">
        <Editor
          key={editorKey}
          onInit={(editor) => {
            editorInstanceRef.current = editor;
            if (editorListenerCleanupRef.current) {
              editorListenerCleanupRef.current();
            }

            // Track editor text changes so we can toggle the Save button without lifting state via onChange.
            const handleEditorChange = () => {
              setHasContent(
                stripHtml(editor.getData()).length > 0 ||
                  editor.getData().includes('<img')
              );
            };

            editor.model.document.on('change:data', handleEditorChange);
            editorListenerCleanupRef.current = () => {
              editor.model.document.off('change:data', handleEditorChange);
            };

            handleEditorChange();
          }}
          onChange={(_, editor) => setCommentText(editor.getData())}
          height={130}
          placeholder="Write a comment..."
          users={users}
          isDisabled={isSaving}
          isUserMentionEnable={true}
        />
        <Stack
          direction="row-reverse"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          mt={1}
        >
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
