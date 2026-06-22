import { useState, useEffect, useContext, memo, useRef } from 'react';

import _ from 'lodash';

import Editor from 'components/Common/Editor';

import PropTypes from 'prop-types';

import {
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  Collapse,
} from '@mui/material';

import BriefContext from 'pages/Brief/Context';
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
  const { setIsEditingThread } = useContext(BriefContext);

  const [threadText, setThreadText] = useState(null);
  const [editorKey, setEditorKey] = useState(1);
  const editorInstanceRef = useRef(null);

  // Image Uploading
  const [attachments, setAttachments] = useState(threadAttachments ?? []);

  const [isInputCollapsed, setIsInputCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const stripHtml = (html) =>
    String(html || '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;|\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  useEffect(() => {
    setThreadText(defaultText);
  }, [defaultText]);

  const handleOnClickSave = async () => {
    const editorData = editorInstanceRef.current?.getData?.() ?? '';
    const hasContent =
      stripHtml(editorData).length > 0 || editorData.includes('<img');

    if (hasContent) {
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
                {`${user?.fullname.split(' ')[0][0]}${
                  !_.isEmpty(user?.fullname.split(' ')[1][0])
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
