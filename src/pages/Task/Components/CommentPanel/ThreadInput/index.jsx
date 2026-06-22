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
  Collapse,
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
import { getFileType } from 'pages/Task/helpers';
import { CircularProgress } from '@material-ui/core';

function ThreadInput({
  user,
  taskId,
  threadId,
  threadAttachments,
  commentRelType,
  defaultText,
  handleThread,
  handleAttachments,
  isEditing,
}) {
  const { setIsEditingThread, handleModal } = useContext(TaskContext);

  const [threadText, setThreadText] = useState(null);
  const [editorKey, setEditorKey] = useState(1);
  const editorInstanceRef = useRef(null);

  // Image Uploading
  const [, selectFiles] = useFileUpload();
  const [attachments, setAttachments] = useState(threadAttachments ?? []);
  const [errorMsg, setErrorMsg] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [isInputCollapsed, setIsInputCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  useEffect(() => {
    setThreadText(defaultText);
  }, [defaultText]);

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
    const hasContent = stripHtml(editorData).length > 0 || editorData.includes("<img");

    if (hasContent) {
      setIsSaving(true);
      await handleThread(
        taskId,
        commentRelType,
        editorData,
        threadId ?? null,
        attachments
      );
      // Set back to default
      setIsSaving(false);
      setIsInputCollapsed(false);
      setThreadText('');
      setAttachments([]);
      // Clears editor
      setEditorKey((prev) => prev * 2);
    } else {
      setIsInputCollapsed(!isInputCollapsed);
    }
  };

  const handleTaskCancelThread = () => {
    setIsEditingThread(false);
  };

  // const handleEditorButtonClick = () => {
  //   handleThread(
  //     taskId,
  //     commentRelType,
  //     threadText,
  //     threadId ?? null,
  //     attachments
  //   );
  //   setThreadText('');
  //   setAttachments([]);

  //   // Clears editor
  //   setEditorKey((prev) => prev * 2);
  // };

  return (
    <Stack
      sx={{ padding: '0.5em 0.5em' }}
      direction="column"
      spacing={1}
      alignItems="flex-start"
    >
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Stack spacing={1} direction="row" alignItems="center">
          <Box sx={{ margin: '0.2em 0' }}>
            {!_.isNull(user?.profile_picture) &&
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
          <Typography
            variant="body1"
            component="div"
            fontWeight={700}
            textTransform="capitalize"
          >
            {user?.fullname?.toLowerCase().includes('ad-weave')
              ? 'Ad-Weave'
              : user?.fullname}
          </Typography>
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
              background: isInputCollapsed ? '#F22076' : '#25165B',
              fontSize: '0.8em',
              fontWeight: 600,
              width: '90px',
            }}
            disabled={isSaving}
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

      <Box width="100%">
        <Collapse in={isInputCollapsed || isEditing}>
          <Editor
            key={editorKey}
            initValue={threadText}
            onInit={(editor) => {
              editorInstanceRef.current = editor;
            }}
            placeholder="Write something..."
            height={250}
            isDisabled={isSaving}
            isUserMentionEnable={true}
          />
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
        </Collapse>
      </Box>
    </Stack>
  );
}

ThreadInput.propTypes = {
  user: PropTypes.object.isRequired,
  users: PropTypes.any.isRequired,
  commentRelType: PropTypes.string,
  taskId: PropTypes.any,
  threadId: PropTypes.any,
  threadRef: PropTypes.any,
  threadAttachments: PropTypes.any,
  defaultText: PropTypes.any,
  handleThread: PropTypes.func,
  handleAttachments: PropTypes.func,
  isEditing: PropTypes.bool,
};

export default memo(ThreadInput);
